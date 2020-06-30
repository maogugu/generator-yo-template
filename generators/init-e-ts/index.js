'use strict';
const generators = require('yeoman-generator');
const logSymbols = require('log-symbols');
const wpo = require('@ali/retcodelog');
const chalk = require('chalk');
const path = require('path');
const mkdir = require('mkdirp')
const yosay = require('yosay');
const mocks = require('../lib/mocks');
const shell = require('shelljs');
const {
  isRepository,
  getRemoteOrigin,
  commands: gitCommands,
} = require('../lib/git');

const config = require('./config');
wpo.setConfig({
  sample: 1,
  spmId: 'dd.generator',
});

module.exports = class extends generators {

  constructor(args, opts) {
    super(args, opts);
    this.newDir = false;
  }

  initializing() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to use ${chalk.red('dingding')} generator!`)
    );
    this.log('');
  }


  async prompting() {
    let questions = [{
      'type': 'input',
      'name': 'modname',
      'message': '项目名称:',
      'default': () => {
        return process.cwd().split("/").pop()
      }
    }, {
      'type': 'input',
      'name': 'desc',
      'message': '项目描述:',
    }, {
      'type': 'input',
      'name': 'designWidth',
      'message': '设计稿宽度(px转rpx使用, 默认750<以px为单位的css直接转化为等值的rpx>)',
    }, {
      'type': 'confirm',
      'name': 'arms',
      'message': '监控需要使用arms吗？默认使用retCode',
      'default': false,
    }, {
      'type': 'input',
      'name': 'author',
      'message': '项目作者:',
      'default': () => {
        const username = this.user.git.name()
        const email = this.user.git.email()

        if (!username && !email) {
          return null
        }

        if (username && email) {
          return `${username}<${email}>`
        }

        return username || email
      },
    }];

    questions.concat([{
        'type': 'input',
        'name': 'gitUrl',
        'message': 'Git项目Url:',
      }, {
        'type': 'input',
        'name': 'gitRepo',
        'message': 'Git仓库地址:',
      }])


    const addtionalAnswers = await this.prompt(questions);
    this.modname = addtionalAnswers.modname;
    this.desc = addtionalAnswers.desc;
    this.arms = addtionalAnswers.arms;
    this.author = addtionalAnswers.author;
    this.mocksCode = addtionalAnswers.mocksCode;
    this.gitUrl = addtionalAnswers.gitUrl;
    this.gitRepo = addtionalAnswers.gitRepo;
    this.designWidth = addtionalAnswers.designWidth;
    wpo.log(JSON.stringify({
      modname: this.modname,
      arms: this.arms,
      author: this.author,
      designWidth: this.designWidth
    }), 1);
  }

  async configuring() {
    this._createEmptyDirs();
    this._gitInit();
    this._createApp();
    this._createPackageJson();
    this._createLintConfig();
    this._createReadme();
    this._createGitIgnore();
    this._createNpmRC();
    this._createChangelog();
    this._createIdlConfig();
    this._createBabelConfig();
    this._createJestConfig();
    this._createDtestConfig();
  }

  writing() {
    this._copyUtils();
    this._copyServices();
    this._copyMock();
    this._copyPages();
    this._copyConstants();
    this._copyDingtalkRpc();
    this._copyTests();
    this._copyStyles();
    this._copyTypes();
    this._copyIdl();
    this._copyI18nResource();
    this._copyIconResource();
    this._copyVscode();
  }

  async install() {
    if(this.newDir){
      shell.cd(this.modname);
    }
    await this.spawnCommandSync('ayarn');
    if(this.newDir){
      shell.cd("..");
    }
  }

  async end() {
    await this._gitCommit();
    if(this.newDir){
      shell.cd("..");
    }
    this.log('');
    this.log(logSymbols.success, chalk.green('初始化项目成功'))
  }

  /**
   * git相关
   */
  _gitInit() {
    const { init } = gitCommands;
    if(this.newDir){
      shell.cd(this.modname);
      this.spawnCommandSync(...init());
      shell.cd('..');
    } else if (!isRepository()) {
      this.spawnCommandSync(...init());
    }
  }

  _del() {
    const { arms = false } = this;
    if (this.newDir) {
      shell.cd(this.modname);
    }
    if (arms) {
      this.spawnCommandSync('rm', ['src/utils/initApp/initRetcode.ts']);
      this.spawnCommandSync('rm', ['src/utils/logger/retcode.ts']);
    } else {
      this.spawnCommandSync('rm', ['src/utils/initApp/initArms.ts']);
      this.spawnCommandSync('rm', ['src/utils/logger/arms.ts']);
    }
    if (this.newDir) {
      shell.cd('..');
    }
  }

  _gitCommit() {
    const { add, commit, addRemote, updateRemote } = gitCommands
    if (this.newDir) {
      shell.cd(this.modname);
    }
    this.spawnCommandSync(...add())
    this.spawnCommandSync(
      ...commit({ message: 'Init project with generator-y' })
    )

    const gitRepo = this.gitRepo;

    return getRemoteOrigin()
      .then((url) => {
        if (gitRepo && url !== gitRepo) {
          this.spawnCommandSync(
            ...updateRemote({ repo: gitRepo })
          )
        }
      })
      .catch(() => {
        gitRepo && this.spawnCommandSync(
          ...addRemote({ repo: gitRepo })
        )
      })
  }

  /**
   * 创建package.json
   */
  _createPackageJson() {
    const { modname = '', desc = '', author = '', gitUrl = '', medusaId = '', designWidth = 750, arms = false } = this;
    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
      name: modname,
      description: desc,
      gitUrl,
      author,
      medusaId,
      designWidth,
      arms,
    });
    this.fs.copy(this.templatePath('yarn.lock'), this.destinationPath('yarn.lock'));
  }

  /**
   * 创建gulpfile.js
   */
  _createGulpfile() {
    this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));
  }

  /**
   * 创建lint config
   */
  _createLintConfig() {
    // tslint规则待统一
    this.fs.copy(this.templatePath('tslint.json'), this.destinationPath('tslint.json'));
    this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
    this.fs.copy(this.templatePath('src/translationKeys.js'), this.destinationPath('src/translationKeys.js'));
  }

  /**
   * 创建README.md
   */
  _createReadme() {
    const { modname = '', desc = '' } = this;
    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), {
      name: modname,
      desc,
    });
  }

  /**
   * 创建.gitignore
   */
  _createGitIgnore() {
    const { modname = '' } = this;
    this.fs.copyTpl(this.templatePath('gitignore'), this.destinationPath('.gitignore'), {
      name: modname,
    });
    this.fs.copyTpl(this.templatePath('gitmodules'), this.destinationPath('.gitmodules'), {
      name: modname,
    });
  }

  /**
   * 创建.npmrc
   */
  _createNpmRC() {
    this.fs.copy(this.templatePath('npmrc'), this.destinationPath('.npmrc'));
  }

  /**
   * 创建CHANGELOG.md
   */
  _createChangelog() {
    const { modname = '' } = this;
    this.fs.copyTpl(this.templatePath('CHANGELOG.md'), this.destinationPath('CHANGELOG.md'), {
      time: new Date().toLocaleDateString(),
      name: modname,
    });
  }

  /**
   * 创建空目录
   */
  _createEmptyDirs() {
    const dirs = [
      config.constants,
      config.styles,
      config.components,
      config.pages,
      config.services,
      config.types,
      config.mock,
      config.dingtalkRpc,
      config.i18nResource,
      config.iconResource,
      config.utils,
      config.vscode,
    ];
    var destRoot = path.basename(this.destinationRoot());
    if (destRoot == this.modname) {
      this.log('模块名`' + this.modname + '`与当前目录匹配，跳过创建目录');
    } else {
      this.log('模块名`' + this.modname + '`对应目录不存在，自动创建目录');
      this.newDir = true;
      this.destinationRoot(this.modname);
    }
    const appDest = this.destinationPath();
    dirs.forEach((dir) => {
      mkdir.sync(path.join(appDest, dir))
    });
  }

  /**
   * 创建app.js app.json app.acss
   */
  _createApp() {
    const { modname = '', arms = false } = this;
    this.fs.copy(this.templatePath('src/app.less'), this.destinationPath('src/app.less'));
    this.fs.copyTpl(this.templatePath('src/app.ts'), this.destinationPath('src/app.ts'), {
      arms,
    });
    this.fs.copyTpl(this.templatePath('src/app.json'), this.destinationPath('src/app.json'), {
      name: modname
    })
  }

  /**
   * 创建示例 idlConfig.js
   */
   _createIdlConfig() {
     this.fs.copy(this.templatePath('idlConfig.js'), this.destinationPath('idlConfig.js'));
   }

  /**
   * 创建示例 jest.config.js
   */
  _createJestConfig() {
    this.fs.copy(this.templatePath('jest.config.js'), this.destinationPath('jest.config.js'));
  }

  /**
   * 创建示例 dtest.config.js
   */
  _createDtestConfig() {
    this.fs.copy(this.templatePath('dtest.config.js'), this.destinationPath('dtest.config.js'));
  }

  /**
   * 创建示例 babel.config.js
   */
  _createBabelConfig() {
    this.fs.copy(this.templatePath('babel.config.js'), this.destinationPath('babel.config.js'));
  }

  /**
   * 将Services模板复制到项目中
   */
  _copyServices() {
    const { mocksCode, arms = false } = this;
    const sourcePathSrc = this.templatePath(config.services);
    const destPathSrc = this.destinationPath(config.services)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false,
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }
  /**
   * 将i18nResource模板复制到项目中
   */
  _copyI18nResource() {
    const { mocksCode } = this;
    const sourcePathSrc = this.templatePath(config.i18nResource);
    const destPathSrc = this.destinationPath(config.i18nResource)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false,
          mocksCode: mocksCode || 'eapp-example',
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }
  /**
   * 将iconResource模板复制到项目中
   */
  _copyIconResource() {
    const sourcePathSrc = this.templatePath(config.iconResource);
    const destPathSrc = this.destinationPath(config.iconResource)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false,
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }
  /**
   * 将 utils 模板复制到项目中
   */
  _copyUtils() {
    const { arms = false } = this;
    const sourcePathSrc = this.templatePath(config.utils);
    const destPathSrc = this.destinationPath(config.utils)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false,
          arms,
        }
      )
      
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
    setTimeout(() => {
      this._del()
    }, 500);
  }
  /**
   * 将 vscode 模板复制到项目中
   */
  _copyVscode() {
    const sourcePathSrc = this.templatePath(config.vscode);
    const destPathSrc = this.destinationPath(config.vscode)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false,
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }
  /**
   * 将 Mock 模板复制到项目中
   */
  _copyMock() {
    const sourcePathSrc = this.templatePath(config.mock);
    const destPathSrc = this.destinationPath(config.mock)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        { nodir: false }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }

  /**
   * 将pages模板复制到项目中
   */
  _copyPages() {
    const { arms = false } = this;
    const sourcePathSrc = this.templatePath(config.pages);
    const destPathSrc = this.destinationPath(config.pages)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false,
          arms,
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }

  /**
   * 将constants模板复制到项目中
   */
  _copyConstants() {
    const { arms } = this;
    const sourcePathSrc = this.templatePath(config.constants);
    const destPathSrc = this.destinationPath(config.constants)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false,
          arms,
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }

  /**
   * 将Rpc模板复制到项目中
   */
  _copyDingtalkRpc() {
    const sourcePathSrc = this.templatePath(config.dingtalkRpc);
    const destPathSrc = this.destinationPath(config.dingtalkRpc)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc, {
          nodir: false
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }

  /**
   * 将__tests__模板复制到项目中
   */
  _copyTests() {
    const { arms } = this;
    const sourcePathSrc = this.templatePath(config.__tests__);
    const destPathSrc = this.destinationPath(config.__tests__);
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false,
          arms,
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }

  /**
   * 将styles模板复制到项目中
   */
  _copyStyles() {
    const sourcePathSrc = this.templatePath(config.styles);
    const destPathSrc = this.destinationPath(config.styles)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }

  /**
   * 将types模板复制到项目中
   */
  _copyTypes() {
    const sourcePathSrc = this.templatePath(config.types);
    const destPathSrc = this.destinationPath(config.types)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }

  /**
   * 将idl模板复制到项目中
   */
  _copyIdl() {
    const sourcePathSrc = this.templatePath(config.idl);
    const destPathSrc = this.destinationPath(config.idl)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        {
          nodir: false
        }
      )
    } catch (err) {
      this.log('Fallback to file copying...')
      this.fs.copy(sourcePathSrc, destPathSrc)
    }
  }
};
