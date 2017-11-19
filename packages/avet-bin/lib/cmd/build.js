require('source-map-support/register');

const { join, isAbsolute } = require('path');
const { existsSync } = require('fs');
const Command = require('egg-bin');
const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const utils = require('avet-utils');
const globby = require('globby');

class BuildCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: avet-bin build';
    this.buildBin = join(__dirname, '../build-app');

    this.options = {
      outdir: {
        description:
          'If no directory is provided, the dist folder will be created in the current directory.',
        type: 'string',
        default: './',
      },
      baseDir: {
        description: 'directory of application, default to `process.cwd()`',
        type: 'string',
      },
      rootDir: {
        description:
          'directory of application root, a application may have multiple root.',
        type: 'string',
        default: './',
      },
      framework: {
        description:
          'specify framework that can be absolute path or npm package',
        type: 'string',
      },
    };

    this.buildPluginExtend = this.buildPluginExtend.bind(this);
    this.buildPluginMain = this.buildPluginMain.bind(this);
  }

  get description() {
    return 'build project';
  }

  *run(context) {
    this.modulePkg = require(join(context.cwd, 'package.json'));

    if (this.isPlugin) {
      this.buildPluginExtend(context);
      this.buildPluginMain(context);
      return null;
    } else {
      const devArgs = this.formatArgs(context);
      const options = {
        execArgv: context.execArgv,
        env: { NODE_ENV: 'production' },
      };

      yield this.helper.forkNode(this.buildBin, devArgs, options);
    }
  }

  get isPlugin() {
    if (this.modulePkg.avetPlugin) {
      return true;
    }
    return false;
  }

  formatArgs(context) {
    const { cwd, argv } = context;
    argv.baseDir = argv._[0] || argv.baseDir || cwd;
    if (!isAbsolute(argv.baseDir)) {
      argv.baseDir = join(cwd, argv.baseDir);
    }

    argv.framework = utils.getFrameworkPath({
      framework: argv.framework,
      baseDir: argv.baseDir,
      rootDir: argv.rootDir,
    });

    argv.p = undefined;
    argv._ = undefined;
    argv.$0 = undefined;

    return [ JSON.stringify(argv) ];
  }

  buildPluginExtend(context) {
    if (!existsSync(join(context.cwd, 'extend'))) return;

    let promise = Promise.resolve();
    promise = promise.then(() => del([ 'dist/*' ]));

    const files = globby.sync('extend/**/*.js', {
      cwd: context.cwd,
    });

    const deps = this.modulePkg.dependencies;
    const rollupOptions = {
      plugins: [
        babel(
          Object.assign({
            babelrc: false,
            presets: [
              require.resolve('babel-preset-es2015-rollup'),
              require.resolve('babel-preset-stage-2'),
              require.resolve('babel-preset-react'),
            ],
            plugins: [ require.resolve('babel-plugin-transform-runtime') ],
            exclude: 'node_modules/**',
            runtimeHelpers: true,
          })
        ),
      ],
    };

    if (deps) {
      rollupOptions.external = [ Object.keys(this.modulePkg.dependencies) ];
    }

    files.forEach(filepath => {
      rollupOptions.input = filepath;

      [ 'es', 'cjs', 'umd' ].forEach(format => {
        promise = promise.then(() =>
          rollup.rollup(rollupOptions).then(bundle =>
            bundle.write({
              dest: `dist/${filepath.replace('.js', '')}.${format}.js`,
              format,
              sourceMap: true,
              moduleName: format === 'umd' ? this.modulePkg.name : undefined,
            })
          )
        );
      });
    });

    promise.catch(err => console.error(err.stack));
  }

  buildPluginMain(context) {
    if (!existsSync(join(context.cwd, 'index.js'))) return;

    let promise = Promise.resolve();

    const rollupOptions = {
      input: 'index.js',
      external: [ Object.keys(this.modulePkg.dependencies) ],
      plugins: [
        babel(
          Object.assign({
            babelrc: false,
            presets: [
              require.resolve('babel-preset-es2015-rollup'),
              require.resolve('babel-preset-stage-2'),
              require.resolve('babel-preset-react'),
            ],
            plugins: [ require.resolve('babel-plugin-transform-runtime') ],
            exclude: 'node_modules/**',
            runtimeHelpers: true,
          })
        ),
      ],
    };

    [ ('es', 'cjs', 'umd') ].forEach(format => {
      promise = promise.then(() =>
        rollup.rollup(rollupOptions).then(bundle =>
          bundle.write({
            dest: `index.${format}.js`,
            format,
            sourceMap: true,
            moduleName: format === 'umd' ? this.modulePkg.name : undefined,
          })
        )
      );
    });
  }
}

module.exports = BuildCommand;