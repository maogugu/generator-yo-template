const { resolve } = require('path')
const fs = require('fs-extra')

module.exports = () => {
  const packageJsonFile = resolve(__dirname, '..', 'package.json')
  const { version = '1.0.0' } = fs.readJsonSync(packageJsonFile)
  return version
}
