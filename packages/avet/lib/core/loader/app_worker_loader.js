const { AppWorkerLoader } = require('../egg');
const createLoader = require('./create_loader');

class AvetAppWorkerLoader extends createLoader(AppWorkerLoader) {
  loadConfig() {
    this.loadPlugin();
    super.loadConfig();
  }

  load() {
    if (process.env.AVET_RUN_ENV !== 'build') {
      // app > plugin > core
      this.loadApplicationExtend();
      this.loadRequestExtend();
      this.loadResponseExtend();
      this.loadContextExtend();
      this.loadHelperExtend();
    }

    // avet layout
    this.loadLayout();
    this.loadAlias();

    if (process.env.AVET_RUN_ENV === 'build') {
      this.loadCustomBuild();
    }

    if (process.env.AVET_RUN_ENV !== 'build') {
      // app > plugin
      this.loadCustomApp();
      // app > plugin
      this.loadService();
      // app > plugin > core
      this.loadMiddleware();
      // app
      this.loadController();
      // app
      this.loadRouter(); // 依赖 controller
    }
  }
}

module.exports = AvetAppWorkerLoader;
