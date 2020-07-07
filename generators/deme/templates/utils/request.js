import lwp from '@ali/dingtalk-jsapi/api/internal/request/lwp';
import logger from '../services/logger';
import { debug } from '../constants/config'

//在线mocks平台：https://mocks.alibaba-inc.com
const mockBaseUrl = 'https://mocks.alibaba-inc.com/mock/y-example/';
//TODO：请按照服务端给出的lwpBaseUrl修改
const lwpBaseUrl = '/r/Adaptor'; 

const request = (uri, body, customBaseUrl) => {
  const startTime = Date.now();
  if (!debug) {
    return new Promise((resolve, reject) => {
      lwp({
        uri: `${customBaseUrl || lwpBaseUrl}/${uri}`,
        body: body || [],
        onSuccess: (result) => {
          const endTime = Date.now();
          if (result.code === 200) {
            resolve(result.body);
            logger.logApiStatus2RetCode(`${customBaseUrl || lwpBaseUrl}/${uri}`, true, endTime - startTime, {
              request: body || [],
              response: result
            });
          } else {
            let  reason = '网络错误';
            if (result.body) {
              reason = result.body.errorMsg || result.body.errorMessage || '网络错误';
            }
            dd.showToast({
              type: 'fail',
              content: reason,
              duration: 2000,
            });
            logger.logApiStatus2RetCode(`${customBaseUrl || lwpBaseUrl}/${uri}`, false, endTime - startTime, {
              request: body || [],
              response: result
            })
            reject(result);
          }
        },
        onFail: (e) => {
          const endTime = Date.now();
          const serviceExption = '系统错误';
          dd.showToast({
            type: 'fail',
            content: e.errorMessage || serviceExption,
            duration: 2000,
          });
          logger.logApiStatus2RetCode(`${customBaseUrl || lwpBaseUrl}/${uri}`, false, endTime - startTime, {
            request: body || [],
            response: e
          });
          reject(e.errorMessage || serviceExption);
        },
      });
    })
  } else {
    //mock接口
    return new Promise((resolve, reject) => {
      dd.httpRequest({
        url: `${customBaseUrl || mockBaseUrl}/${uri}`,
        method: 'get',
        data: {},
        dataType: 'application/json',
        success(res) {
          logger.log(`[MOCK SUCCESS]:${customBaseUrl || mockBaseUrl}/${uri}`, {
            request: body,
            response: JSON.parse(res.data)
          })
          resolve(JSON.parse(res.data));
        },
        fail(res) {
          logger.log(`[MOCK FAIL]:${customBaseUrl || mockBaseUrl}/${uri}`, {
            request: body,
            response: res.data
          })
          reject(res)
        }
      });
    })
  }
}

export default request;