import Utils from '/utils/index'
import mock from '/utils/mockData'
import Config from '/utils/config'

/**
 * 返回值统一处理
 */
function beResponse (result) {
  const res = result.data
  if (!res.success) { // 逻辑错误 自定义错误码
    if (res.errorMsg) {
      Utils.showToast(res.errorMsg, () => {}, 'fail ')
    }
    console.error('接口调用失败', result)
    switch (res.errorCode) {
      case 401:
      case 403:
      case 405:
        // TODO  未登录处理
        break
      default:
        break
    }
    throw new Error(JSON.stringify(res))
  }
  return res.result
}
// http 说明表
const ERROR_MSG = {
  400: '请求错误(400)',
  401: '未授权，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  408: '请求超时(408)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)'
}
/**
 * 失败统一处理
 */
function beError ({ method, url }, result) {
  const status = result.status

  // const httpCode = payload.stat
  const errorMsg = ERROR_MSG[status] || `未知错误(${status})`
  const message = `${url}:${method}----${errorMsg}`
  // Utils.
  return new Error(message)
}
// curring
const httpRequest = (method, contentType) => (url) => httpServer(url, method, contentType)
// 后端一定返回json
function httpServer (url, method, contentType) {
  return (data = {}) => {
    return new Promise((resolve, reject) => {
      if (Config.useMock) {
        const res = mock[url]
        if (res) {
          console.log('[mock success]')
          resolve(res)
        } else {
          console.log('[mock 404]')
          reject(new Error('mock error 404'))
        }
      } else {
        const options = {
          url: Config.baseUrl + url,
          method,
          headers: {
            // TODO 构造统一的头 自己构造
          }
        }
        // 加入 请求头
        if (contentType !== undefined) {
          options.headers['Content-Type'] = contentType
        }
        dd.httpRequest({
          ...options,
          data: method === 'POST' ? JSON.stringify(data) : data,
          success: res => resolve(beResponse(res)),
          fail: res => reject(beError(options, res))
        })
      }
    })
  }
}

export const get = httpRequest('GET')
export const post = httpRequest('POST', 'application/json;charset=UTF-8;')
