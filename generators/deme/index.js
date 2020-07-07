'use strict';
const generators = require('yeoman-generator');
const logSymbols = require('log-symbols');
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

module.exports = class extends generators {

  constructor(args, opts) {
    super(args, opts);
    this.buc = args[0]
    this.newDir = false;
  }

  initializing() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to use ${chalk.red('y')} generator!`)
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
      'message': '项目描述:'
    }, {
      'type': 'input',
      'name': 'mocksCode',
      'message': 'mock项目Code:(输入code不存在时将自动创建，不填则使用示例mock项目https://mocks.alibaba-inc.com/project/y-example/)',
      'default': 'y-example'
    }, {
      'type': 'input',
      'name': 'medusaId',
      'message': '美杜莎项目Id(没有可不填)'
    }, {
      'type': 'confirm',
      'name': 'less',
      'message': '需要支持less本地编译吗?(需要开发者本地运行gulp任务)',
      'default': false
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
      }
    }];

    if(!this.buc){
      questions.push({
        'type': 'input',
        'name': 'workId',
        'message': '工号（创建mock权限使用）:',
      })
    }

    questions.concat([{
        'type': 'input',
        'name': 'gitUrl',
        'message': 'Git项目Url:',
      }, {
        'type': 'input',
        'name': 'gitRepo',
        'message': 'Git仓库地址:'
      }])


    const addtionalAnswers = await this.prompt(questions);
    this.modname = addtionalAnswers.modname;
    this.desc = addtionalAnswers.desc;
    this.author = addtionalAnswers.author;
    this.mocksCode = addtionalAnswers.mocksCode;
    this.gitUrl = addtionalAnswers.gitUrl;
    this.gitRepo = addtionalAnswers.gitRepo;
    this.medusaId = addtionalAnswers.medusaId;
    this.workId = addtionalAnswers.workId;
    this.less = addtionalAnswers.less;
  }

  async configuring() {
    this._createEmptyDirs();
    this._gitInit();
    this._createApp();
    this._createPackageJson();
    // this._createLint();
    this._createReadme();
    this._createSnapshot();
    this._createGitIgnore();
    this._createNpmRC();
    this._createChangelog();
    this._createBabelConfig();
    this._createJestConfig();
    this._createDtestConfig();
    if(this.less){
      this._createGulpfile();
    }
    await this._createMocksProject();
  }

  writing() {
    this._copyServices();
    this._copyUtils();
    this._copyPages();
    this._copyAssets();
    this._copyTests();
    this._copyConstants();
    // this._copyBin();
  }

  async install() {
    if(this.newDir){
      shell.cd(this.modname);
    }
    await this.spawnCommandSync('tnpm', ['i']);
    if(this.medusaId){
      await this.spawnCommandSync('tnpm', ['run update-18n']);
      this.log(logSymbols.success, chalk.green('成功加载翻译包'))
    }
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
   * 创建mocks项目
   */
  _createMocksProject() {
    const _self = this;
    const { mocksCode, modname, buc, workId } = this;
    const { create, importApiList, addMember } = mocks;
    const username = this.user.git.name()
    const email = this.user.git.email()
    if (mocksCode !== 'y-example') {
      this.log(logSymbols.info, '正在为您创建mocks项目，请稍后...');
      return create({
        productName: modname,
        productCode: mocksCode
      }).then((res) => {
        if (!res.success) {
          if (res.code === 'Duplicate_Product_Code') {
            _self.mock = `https://mocks.alibaba-inc.com/mock/${mocksCode}/`
          } else {
            this.log(logSymbols.error, '创建mocks项目失败，已使用示例项目');
          }
        } else {
          let params = {};
          if(!buc){
            params = {
              product: mocksCode,
              nickName: workId ? username : '晴葵',
              realName: workId ? username : '王妍月',
              workId: workId || 112159,
              depDesc: '钉钉-前端',
              email,
              loginId: username,
              userType: 'admin'
            }
          } else {
            params = {
              product: mocksCode,
              nickName: buc.nick,
              realName: buc.name,
              workId: buc.empid,
              depDesc: '钉钉-前端',
              email,
              loginId: username,
              userType: 'admin'
            }
          }
          return addMember(params).then((res) => {
            if (!res.success) {
              return addMember({
                product: mocksCode,
                nickName: '晴葵',
                realName: '王妍月',
                workId: '112159',
                depDesc: 'Y项目事业部-沟通协同平台技术部-前端',
                email: 'yanyue.wyy@alibaba-inc.com',
                loginId: 'yanyue.wyy',
                userType: 'admin'
              }).then((res) => {
                if (!res.success) {
                  this.log(logSymbols.error, '创建mocks项目失败，已使用示例项目');
                } else {
                  _self.mock = `https://mocks.alibaba-inc.com/mock/${mocksCode}/`
                  this.log(logSymbols.warning, `读取登录信息失败，请联系@晴葵添加mocks项目权限,访问地址：https://mocks.alibaba-inc.com/project/${mocksCode}/`);
                }
              })
            } else {
              _self.mock = `https://mocks.alibaba-inc.com/mock/${mocksCode}/`
              this.log(logSymbols.success, `创建mocks项目成功，访问地址：https://mocks.alibaba-inc.com/project/${mocksCode}/，${workId ? '' : '请联系晴葵添加权限'}`);
            }
          })
        }
      })
    }
  }

  /**
   * 创建package.json
   */
  _createPackageJson() {
    const { modname = '', desc = '', author = '', gitUrl = '', medusaId = '', less } = this;
    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
      name: modname,
      description: desc,
      gitUrl,
      author,
      medusaId,
      less
    })
  }

  /**
   * 创建gulpfile.js
   */
  _createGulpfile() {
    this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));
  }

  /**
   * 创建.eslintrc .eslintignore
   */
  _createLint() {
    this.fs.copy(this.templatePath('eslintrc'), this.destinationPath('.eslintrc'));
    this.fs.copy(this.templatePath('eslintignore'), this.destinationPath('.eslintignore'));
  }

  /**
   * 创建README.md
   */
  _createReadme() {
    const { modname = '', desc = '', author = '' } = this;
    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), {
      name: modname,
      desc,
      author,
    });
  }

  /**
   * 创建截屏
   */
  _createSnapshot() {
    this.fs.copy(this.templatePath('snapshot.png'), this.destinationPath('snapshot.png'));
  }

  /**
   * 创建.gitignore
   */
  _createGitIgnore() {
    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
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
    this.fs.copy(this.templatePath('CHANGELOG.md'), this.destinationPath('CHANGELOG.md'));
  }

  /**
   * 创建空目录
   */
  _createEmptyDirs() {
    const dirs = [
      config.assets,
      config.components,
      config.pages,
      config.services,
      config.utils,
      // config.bin
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
    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    const { modname = '', desc = '', author = '', gitUrl = '', gitRepo = '' } = this;
    this.fs.copy(this.templatePath('app.acss'), this.destinationPath('app.acss'));
    this.fs.copy(this.templatePath('app.js'), this.destinationPath('app.js'));
    this.fs.copyTpl(this.templatePath('app.json'), this.destinationPath('app.json'), {
      name: modname
    })
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
    const sourcePathSrc = this.templatePath('services/');
    const destPathSrc = this.destinationPath(`${config.services}/`)
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
   * 将__tests__模板复制到项目中
   */
  _copyTests() {
    const sourcePathSrc = this.templatePath(config.__tests__);
    const destPathSrc = this.destinationPath(config.__tests__)
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
   * 将__tests__模板复制到项目中
   */
  _copyConstants() {
    const sourcePathSrc = this.templatePath(config.constants);
    const destPathSrc = this.destinationPath(config.constants)
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
   * 将Utils模板复制到项目中
   */
  _copyUtils() {
    const { mocksCode } = this;
    const sourcePathSrc = this.templatePath('utils/');
    const destPathSrc = this.destinationPath(`${config.utils}/`)
    try {
      this.fs.copyTpl(
        sourcePathSrc,
        destPathSrc,
        { nodir: false,
          mocksCode }
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
    const sourcePathSrc = this.templatePath('pages/');
    const destPathSrc = this.destinationPath(`${config.pages}/`)
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
   * 将assets模板复制到项目中
   */
  _copyAssets() {
    const sourcePathSrc = this.templatePath('assets/');
    const destPathSrc = this.destinationPath(`${config.assets}/`)
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
   * 将bin模板复制到项目中
   */
  _copyBin() {
    const sourcePathSrc = this.templatePath('bin/');
    const destPathSrc = this.destinationPath(`${config.bin}/`)
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

