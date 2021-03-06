/* global __APP_DATA__ */

import { parse, format } from 'url';
import { loadGetInitialProps, loadGetStore } from 'avet-utils/lib/component';

import EventEmitter from '../event-emiiter';
import shallowEquals from '../shallow-equals';
import PQueue from '../p-queue';
import { getURL, execOnce } from '../utils';
import { _rewriteUrlForAvetExport } from './';

const historyUnavailableWarning = execOnce(() => {
  console.warn('Warning: window.history is not available.');
});

const historyMethodWarning = execOnce(method => {
  console.warn(`Warning: window.history.${method} is not available`);
});

export default class Router {
  constructor(
    pathname,
    query,
    as,
    { pageLoader, Component, ErrorComponent, err } = {}
  ) {
    // represents the current component key
    this.route = toRoute(pathname);

    // set up the component cache (by route keys)
    this.components = {};
    // We should not keep the cache, if there's an error
    // Otherwise, this cause issues when when going back and
    // come again to the errored page.
    if (Component !== ErrorComponent) {
      this.components[this.route] = { Component, err };
    }

    // Handling Router Events
    this.events = new EventEmitter();

    this.pageLoader = pageLoader;
    this.prefetchQueue = new PQueue({ concurrency: 2 });
    this.ErrorComponent = ErrorComponent;
    this.pathname = pathname;
    this.query = query;
    this.asPath = as;
    this.subscriptions = new Set();
    this.componentLoadCancel = null;
    this.onPopState = this.onPopState.bind(this);

    if (typeof window !== 'undefined') {
      // in order for `e.state` to work on the `onpopstate` event
      // we have to register the initial route upon initialization
      this.changeState('replaceState', format({ pathname, query }), getURL());

      window.addEventListener('popstate', this.onPopState);
    }
  }

  async onPopState(e) {
    if (!e.state) {
      // We get state as undefined for two reasons.
      //  1. With older safari (< 8) and older chrome (< 34)
      //  2. When the URL changed with #
      //
      // In the both cases, we don't need to proceed and change the route.
      // (as it's already changed)
      // But we can simply replace the state with the new changes.
      // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
      // So, doing the following for (1) does no harm.
      const { pathname, query } = this;
      this.changeState('replaceState', format({ pathname, query }), getURL());
      return;
    }

    const { url, as, options } = e.state;
    this.replace(url, as, options);
  }

  update(route, Component) {
    const data = this.components[route];
    if (!data) {
      throw new Error(`Cannot update unavailable route: ${route}`);
    }

    const newData = { ...data, Component };
    this.components[route] = newData;

    if (route === this.route) {
      this.notify(newData);
    }
  }

  async reload(route) {
    delete this.components[route];
    this.pageLoader.clearCache(route);

    if (route !== this.route) return;

    const { pathname, query } = this;
    const url = window.location.href;

    this.events.emit('routeChangeStart', url);
    const routeInfo = await this.getRouteInfo(route, pathname, query, url);
    const { error } = routeInfo;

    if (error && error.cancelled) {
      return;
    }

    this.notify(routeInfo);

    if (error) {
      this.events.emit('routeChangeError', error, url);
      throw error;
    }

    this.events.emit('routeChangeComplete', url);
  }

  back() {
    window.history.back();
  }

  push(url, as = url, options = {}) {
    return this.change('pushState', url, as, options);
  }

  replace(url, as = url, options = {}) {
    return this.change('replaceState', url, as, options);
  }

  async change(method, _url, _as, options) {
    // If url and as provided as an object representation,
    // we'll format them into the string version here.
    const url = typeof _url === 'object' ? format(_url) : _url;
    let as = typeof _as === 'object' ? format(_as) : _as;

    // Add the ending slash to the paths. So, we can serve the
    // "<page>/index.html" directly for the SSR page.
    if (__APP_DATA__.avetExport) {
      as = _rewriteUrlForAvetExport(as);
    }

    this.abortComponentLoad(as);
    const { pathname, query } = parse(url, true);

    // If the url change is only related to a hash change
    // We should not proceed. We should only change the state.
    if (this.onlyAHashChange(as)) {
      this.changeState(method, url, as);
      this.scrollToHash(as);
      return;
    }

    // If asked to change the current URL we should reload the current page
    // (not location.reload() but reload getInitalProps and other Avet.js stuffs)
    // We also need to set the method = replaceState always
    // as this should not go into the history (That's how browsers work)
    if (!this.urlIsNew(pathname, query)) {
      method = 'replaceState';
    }

    const route = toRoute(pathname);
    const { shallow = false } = options;
    let routeInfo = null;

    this.events.emit('routeChangeStart', as);

    // If shallow === false and other conditions met, we reuse the
    // existing routeInfo for this route.
    // Because of this, getInitialProps would not run.
    if (shallow && this.isShallowRoutingPossible(route)) {
      routeInfo = this.components[route];
    } else {
      routeInfo = await this.getRouteInfo(route, pathname, query, as);
    }

    const { error } = routeInfo;

    if (error && error.cancelled) {
      return false;
    }

    this.events.emit('beforeHistoryChange', as);
    this.changeState(method, url, as, options);
    const hash = window.location.hash.substring(1);

    this.set(route, pathname, query, as, { ...routeInfo, hash });

    if (error) {
      this.events.emit('routeChangeError', error, as);
      throw error;
    }

    this.events.emit('routeChangeComplete', as);
    return true;
  }

  changeState(method, url, as, options = {}) {
    if (typeof window.history === 'undefined') {
      historyUnavailableWarning();
      return;
    }

    if (typeof window.history[method] === 'undefined') {
      historyMethodWarning(method);
      return;
    }

    if (method !== 'pushState' || getURL() !== as) {
      window.history[method]({ url, as, options }, null, as);
    }
  }

  async getRouteInfo(route, pathname, query, as) {
    let routeInfo = null;

    try {
      routeInfo = this.components[route];
      if (!routeInfo) {
        routeInfo = { Component: await this.fetchComponent(route, as) };
      }

      const { Component } = routeInfo;
      const ctx = { pathname, query, asPath: as };
      const { props, store } = await this.getInitialData(Component, ctx);
      routeInfo.props = props;
      routeInfo.store = store;

      this.components[route] = routeInfo;
    } catch (err) {
      if (err.code === 'PAGE_LOAD_ERROR') {
        // If we can't load the page it could be one of following reasons
        //  1. Page doesn't exists
        //  2. Page does exist in a different zone
        //  3. Internal error while loading the page

        // So, doing a hard reload is the proper way to deal with this.
        window.location.href = as;

        // Changing the URL doesn't block executing the current code path.
        // So, we need to mark it as a cancelled error and stop the routing logic.
        err.cancelled = true;
        return { error: err };
      }

      if (err.cancelled) {
        return { error: err };
      }

      const Component = this.ErrorComponent;
      routeInfo = { Component, err };
      const ctx = { err, pathname, query };
      const { props, store } = await this.getInitialData(Component, ctx);
      routeInfo.props = props;
      routeInfo.store = store;

      routeInfo.error = err;
    }

    return routeInfo;
  }

  set(route, pathname, query, as, data) {
    this.route = route;
    this.pathname = pathname;
    this.query = query;
    this.asPath = as;
    this.notify(data);
  }

  onlyAHashChange(as) {
    if (!this.asPath) return false;
    const [ oldUrlNoHash ] = this.asPath.split('#');
    const [ newUrlNoHash, newHash ] = as.split('#');

    // If the urls are change, there's more than a hash change
    if (oldUrlNoHash !== newUrlNoHash) {
      return false;
    }

    // If there's no hash in the new url, we can't consider it as a hash change
    if (!newHash) {
      return false;
    }

    // Now there's a hash in the new URL.
    // We don't need to worry about the old hash.
    return true;
  }

  scrollToHash(as) {
    const [ , hash ] = as.split('#');
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView();
    }
  }

  urlIsNew(pathname, query) {
    return this.pathname !== pathname || !shallowEquals(query, this.query);
  }

  isShallowRoutingPossible(route) {
    return (
      // If there's cached routeInfo for the route.
      Boolean(this.components[route]) &&
      // If the route is already rendered on the screen.
      this.route === route
    );
  }

  async prefetch(url) {
    // prefetch 不会再开发环境进行开放，这样的话 on-demand-entries 的优化就不会起作用
    if (process.env.NODE_ENV === 'development') return;

    const { pathname } = parse(url);
    const route = toRoute(pathname);
    return this.prefetchQueue.add(() => this.fetchRoute(route));
  }

  async fetchComponent(route, as) {
    let cancelled = false;
    const cancel = (this.componentLoadCancel = function() {
      cancelled = true;
    });

    try {
      const Component = await this.fetchRoute(route);
      if (cancelled) {
        const error = new Error(
          `Abort fetching component for route: "${route}"`
        );
        error.cancelled = true;
        throw error;
      }

      if (cancel === this.componentLoadCancel) {
        this.componentLoadCancel = null;
      }

      return Component;
    } catch (err) {
      // There's an error in loading the route.
      // Usually this happens when there's a failure in the webpack build
      // so in that case, we need to load the page with full SSR
      // That'll clean the invalid exising client side information.
      // (Like cached routes)
      window.location.href = as;
      throw err;
    }
  }

  async getInitialData(Component, ctx) {
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    this.componentLoadCancel = cancel;

    const props = await loadGetInitialProps(Component, ctx);
    const store = await loadGetStore(Component, ctx);

    if (cancel === this.componentLoadCancel) {
      this.componentLoadCancel = null;
    }

    if (cancelled) {
      const err = new Error('Loading initial data cancelled');
      err.cancelled = true;
      throw err;
    }

    return { props, store };
  }

  async fetchRoute(route) {
    const page = await this.pageLoader.loadPage(route);
    return page;
  }

  abortComponentLoad(as) {
    if (this.componentLoadCancel) {
      this.events.emit('routeChangeError', new Error('Route Cancelled'), as);
      this.componentLoadCancel();
      this.componentLoadCancel = null;
    }
  }

  notify(data) {
    this.subscriptions.forEach(fn => fn(data));
  }

  subscribe(fn) {
    this.subscriptions.add(fn);
    return () => this.subscriptions.delete(fn);
  }
}

function toRoute(path) {
  return path.replace(/\/$/, '') || '/';
}
