'use strict';
const generators = require('yeoman-generator');
const logSymbols = require('../eapp/node_modules/log-symbols');
const chalk = require('chalk');
const fs = require('fs');
const yosay = require('yosay');
const shell = require('shelljs');
const {
  isRepository,
  getRemoteOrigin,
  commands: gitCommands,
} = require('../lib/git');


module.exports = generators.Base.extend({
  constructor:function(args, opts) {
    // super(args, opts);
    generators.Base.apply(this, arguments);
    // this.newDir = false;
  },
  
  initializing() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to use ${chalk.red('generator-yo-template')} !`)
    );
    this.log('');
  },


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


    // const addtionalAnswers = await this.prompt(questions);
    // this.modname = addtionalAnswers.modname;
    // this.desc = addtionalAnswers.desc;
    // this.author = addtionalAnswers.author;
    // this.mocksCode = addtionalAnswers.mocksCode;
    // this.gitUrl = addtionalAnswers.gitUrl;
    // this.gitRepo = addtionalAnswers.gitRepo;
  },

  // async configuring() {
  //   this._createEmptyDirs();
  //   this._gitInit();
  //   this._createApp();
  //   this._createPackageJson();
  //   this._createConfigs();
  //   this._createReadme();
  // },

  writing() {
    const temps = {};
    fs.readdir(this.sourceRoot(), (err, items) => {
      for(let item of items) {
        console.log(item)
        console.log(temps[item])
          if(temps[item]) {
              this.fs.copyTpl(
                  this.templatePath(item),
                  this.destinationPath(item),
                  temps[item]
              );
          } else {
              this.fs.copy(
                  this.templatePath(item),
                  this.destinationPath(item)
              );
          }
      }
  });
    
  },

  // async install() {
  //   if(this.newDir){
  //     shell.cd(this.modname);
  //   }
  //   await this.spawnCommandSync('ayarn');
  //   if(this.newDir){
  //     shell.cd("..");
  //   }
  // },

  async end() {
    // await this._gitCommit();
    if(this.newDir){
      shell.cd("..");
    }
    this.log('');
    this.log(logSymbols.success, chalk.green('初始化项目成功'))
  },

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
  },

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
  },

})
