const getRemoteOrigin = require('git-remote-origin-url')
const isRepository = require('is-git-repository')
const createCommand = require('./createCommand')

const commands = {
  init: createCommand('git init'),
  addRemote: createCommand('git remote add origin {{repo}}'),
  updateRemote: createCommand('git remote set-url origin {{repo}}'),
  add: createCommand('git add .'),
  commit: createCommand('git commit -m "{{message}}"'),
}

module.exports = {
  /* exported getRemoteOrigin */
  getRemoteOrigin,
  /* exported isRepository */
  isRepository,
  /* exported commands */
  commands,
}
