#!/usr/bin/env node

/**
 * 请在工程根目录下执行：node init.js
 */
// TODO  可选antd  element vant eapp
const type = 'antd'
const _execSync = require('child_process').execSync
const execSync = (val) => { _execSync(val, { stdio: 'inherit' }) }
const fs = require('fs')
const path = require('path')

console.log('正在安装初始化脚本依赖，请稍后...')
execSync('npm install yeoman-environment generator-yo-template shelljs')
console.log('安装初始化脚本依赖完成')
const yeoman = require('yeoman-environment')
const shelljs = require('shelljs')
const yo_env = yeoman.createEnv()
const name = 'generator'
console.log('安装项目模板')

yo_env.register(`generator-yo-template/generators/${type}/index.js`, name)
yo_env.run(`${name}`, {}, function (err) {
  try {
    console.log('安装项目模板完成')
    // shelljs.rm('-rf init.js')
    shelljs.rm('-rf', 'node_modules')
    shelljs.rm('-rf', '*.lock')
    shelljs.mv('-f', 'gitignore', '.gitignore')
    console.log('清理初始化脚本成功，开始自动安装npm依赖')
    // install()
  } catch (e) {
    console.log('清理初始化脚本失败')
  }
  if (err) {
    console.log(err)
  }
})

function install () {
  const pkg = path.join(__dirname, 'package.json')
  if (fs.existsSync(pkg)) {
    execSync('npm install', { stdio: 'inherit' })
  }
}
