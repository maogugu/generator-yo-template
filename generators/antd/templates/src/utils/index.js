import { isFunction } from 'lodash'

/**
 * 生成唯一标识
 */
export function uuid () {
  let d = Date.now()
  if (performance !== undefined && isFunction(performance.now)) {
    d += performance.now()
  }
  return 'x' + 'xxxxxxxx-fxxx-wxxx-fxxx-exxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

/**
 * SessionStorage
 * 传入什么 就返回什么
 */
export const session = {
  getSession (key) {
    const { value = null } = JSON.parse(sessionStorage.getItem(key)) ?? {}
    return value
  },
  setSession (key, value) {
    if (value === null || value === undefined) {
      throw new Error('不允许传入 null 或 undefined')
    }
    if (typeof value === 'function') {
      throw new Error('不允许传入 函数')
    }
    sessionStorage.setItem(key, JSON.stringify({ value }))
  },
  destroy (key) {
    sessionStorage.removeItem(key)
  }
}

// LocalStorage
export const localSession = {
  getLocal (key) {
    return JSON.parse(localStorage.getItem(key))
  },

  setLocal (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  destroy (key) {
    localStorage.removeItem(key)
  }
}
