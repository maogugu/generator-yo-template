const Generator = require('yeoman-generator')
const get = require('lodash.get')
const forOwn = require('lodash.forown')
const keys = require('lodash.keys')
const merge = require('lodash.merge')
const pick = require('lodash.pick')
const mapKeys = require('lodash.mapkeys')
const mapValues = require('lodash.mapvalues')
const pickBy = require('lodash.pickby')
const camelCase = require('camelcase')
const isPlainObject = require('lodash.isplainobject')

const FALLBACK_LANG = 'en'

const getOption = (name, config = {}) => Object.assign(config, {
  name,
  description: config.description || config.desc,
})

const noop = () => {}

const createMessageGetter = (messages, locale = FALLBACK_LANG) => {
  if (!messages) {
    return (key) => key
  }

  const messageList = [].concat(messages).reduce(merge, {})[locale]
  return (key) => get(messageList, key, key)
}

const isStreamKey = (value, key) => key.endsWith('$')

module.exports = ({
  messages,
  options,
  prompts,
  arguments: cliArgs,
} = {}, GeneratorClass = Generator) => { // eslint-disable-line
  return class NewGenerator extends GeneratorClass {
    constructor(...args) {
      super(...args)

      const intl = createMessageGetter(messages, this.options.lang)
      this._initOptionsNoConflict(options, intl)
      this._initArgumentsNoConflict(cliArgs, intl)
      this._initPromptsNoConflict(prompts, intl)

      this._intl = intl
    }

    _initOptionsNoConflict(_options = {}, intl = noop) {
      const optionsList = [].concat(_options)
      const userOptions = optionsList.reduce((result, curr) => merge(
        result,
        typeof curr === 'function' ? curr(this, intl) : curr
      ), {})

      this.userOptionKeys = keys(userOptions)

      forOwn(userOptions, (value, key) => {
        this._setOption(key, value)
      })
    }

    _initArgumentsNoConflict(_arguments = {}, intl = noop) {
      const userArguments = typeof _arguments === 'function' ?
        _arguments(this, intl) : _arguments

      forOwn(userArguments, (value, key) => {
        this.argument(key, value)
      })
    }

    _initPromptsNoConflict(_prompts = [], intl = noop) {
      this.promptStream = {}

      if (Array.isArray(_prompts)) {
        this.promptStream = { main$: _prompts }
        return
      }

      if (isPlainObject(_prompts)) {
        this.promptStream = mapValues(
          pickBy(_prompts, isStreamKey),
          (prompt) => {
            if (typeof prompt === 'function') {
              return prompt(this, intl)
            }

            return prompt
          }
        )
        return
      }

      if (typeof _prompts === 'function') {
        this.promptStream = { main$: _prompts(this, intl) }
      }
    }

    _getPromptStream(name = 'main$') {
      if (Array.isArray(name)) {
        return name
      }

      if (typeof name === 'string') {
        return this.promptStream[name] || []
      }

      return []
    }

    _executePrompts(stream) {
      const promptStream = this._getPromptStream(stream)

      return this
        .prompt(promptStream)
        .then((props) => {
          const userOptions = pick(this.options, this.userOptionKeys)
          const optionsToProps = mapKeys(
            userOptions, (value, key) => camelCase(key)
          )
          const result = Object.assign(this.props || {}, optionsToProps, props)

          this.props = result
          return result
        })
    }

    _getMessage(...args) {
      return this._intl(...args)
    }

    _setOption(name, config) {
      const origin = this._options[name]
      if (!origin) {
        return this.option(name, config)
      }

      this._options[name] = Object.assign(origin, getOption(name, config))
      this.parseOptions()

      return this
    }
  }
}
