import Store from 'avet/store';

export default class PageIndex extends Store {
  constructor(
    state = {
      count: 0,
      totalPage: 0,
      deepobject: {
        a: 'xxx',
      },
    }
  ) {
    super(state);
  }

  increment(state) {
    this.setState({ count: state.count + 1 });
    this.dispatch('currentStore.setCurrent', state.count + 100);
  }

  dynamicLoad(state) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ totalPage: state.totalPage + 4 });
      }, 1000);
    });
  }
}
