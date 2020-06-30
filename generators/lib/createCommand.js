const Handlebars = require('handlebars')
const split = require('argsplit')

const createCommand = (str) => (vars = {}) => {
  const render = Handlebars.compile(str)
  const resultStr = render(vars)
  const resultArr = split(resultStr)

  if (!resultArr.length) {
    throw new Error('Invalid command')
  }

  const [command, ...args] = resultArr

  return [
    command,
    args,
  ]
}

module.exports = createCommand
