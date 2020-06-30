import { mid2Url } from '@ali/ding-mediaid'; //维护人@烛象
import logger from '/services/logger';

//拼接search串
export const formQueryString = (query) => Object.keys(query).reduce((pre, next) => `${pre}&${next}=${query[next]}`, '').slice(1)

//转换钉钉内部用的MediaId为web可用的url兼容http类型mock数据，为空时返回undefined，注：不支持日常环境
export const formatImageUrl = (url) => (url ? (url.startsWith('http') ? url : mid2Url(url)) : undefined)

//跳转前检测页面堆栈
export const navigateTo = (url) => {
  if (getCurrentPages().length < 4) {
    dd.navigateTo({ url })
  } else {
    dd.redirectTo({ url })
  }
}

//调用自定义jsApi
export const callApi = (options) => {
  const startTime = Date.now();
  return new Promise(((resolve, reject) => {
    dd.dtBridge({
      m: options.api,
      args: options.params,
      onSuccess(result) {
        logger.logApiStatus2RetCode(options.api, true, Date.now() - startTime, {
          request: options.params,
          response: result,
        });
        resolve(result);
      },
      onFail(err) {
        logger.logApiStatus2RetCode(options.api, false, Date.now() - startTime, {
          request: options.params,
          response: err,
        });
        reject(err);
      }
    });
  }));
}