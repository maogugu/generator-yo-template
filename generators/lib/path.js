const relative = require('relative')
const fs = require('fs-extra')


const unixify = (str) => str.replace(/[\\\/]+/g, '/') // eslint-disable-line

const getRelativePath = (from, to) => {
  const result = unixify(relative(from, to, true))
  return result.startsWith('../') ? result : `./${result}`
}

const exists = (path) => fs.pathExistsSync(path)

module.exports = {
  getRelativePath,
  exists,
}
