const isModuleName = (val) => /^[a-zA-Z]+$/.test(val)

const isRoutePath = (val) => /^\/?(:?[\w]+)(?:\/:?[\w]+)*$/.test(val)

const isSceneName = val => /^[-a-zA-Z]+$/.test(val)

module.exports = {
  isModuleName,
  isRoutePath,
  isSceneName,
}
