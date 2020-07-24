const _execSync = require('child_process').execSync
const execSync = (val) => {
  _execSync(val, {
    stdio: 'inherit'
  })
}
console.log('正在安装初始化脚本依赖，请稍后...')
// 最小的两个包
execSync('npm install inquirer optimist')
const argv = require('optimist').argv
const inquirer = require('inquirer')
const name = 'generator'
const types = ['antd', 'element', 'eapp', 'vant']
const tools = ['npm', 'cnpm', 'yarn']
let tool = ''
async function chooseType () {
  const {
    type
  } = await inquirer.prompt([{
    type: 'list',
    name: 'type',
    choices: types,
    message: 'what template would you like use?',
    default: true
  }])
  return type
}

async function chooseManagerTool () {
  const {
    tool
  } = await inquirer.prompt([{
    type: 'list',
    name: 'tool',
    choices: tools,
    message: 'what tool would you like use?',
    default: true
  }])
  return tool
}

async function run () {
  // 选择版本 ['antd','element','eapp','vant']
  const type = types.includes(argv.t) ? argv.t : await chooseType()
  tool = tools.includes(argv.u) ? argv.u : await chooseManagerTool()
  console.log('正在安装环境依赖')
  const packList = 'yeoman-environment generator-yo-template shelljs'
  if (tool === 'yarn') {
    execSync(`yarn add ${packList}`)
  } else {
    execSync(`${tool} install ${packList}`)
  }
  const yeoman = require('yeoman-environment')
  const shelljs = require('shelljs')
  const yoEnv = yeoman.createEnv()
  console.log('安装初始化脚本依赖完成')
  console.log('安装项目模板')
  yoEnv.register(`generator-yo-template/generators/${type}/index.js`, name)
  yoEnv.run(`${name} --force`, {}, function (err) {
    try {
      console.log('安装项目模板完成')
      shelljs.rm('-rf', 'init.js')
      shelljs.rm('-rf', 'node_modules')
      shelljs.rm('-rf', '*.lock')
      shelljs.mv('-f', 'gitignore', '.gitignore')
      console.log('清理初始化脚本成功')
      install()
    } catch (e) {
      console.log('清理初始化脚本失败')
    }
    if (err) {
      console.log(err)
    }
  })
}

function install () {
  if (argv.a !== 'no') {
    console.log('开始自动安装项目依赖')
    if (tool === 'yarn') {
      execSync('yarn')
    } else {
      execSync(`${tool} install`)
    }
  }
}

run()

