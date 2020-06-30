// JSAPI 环境初始化
import '@ali/dingtalk-jsapi/entry/union';
import { devConfig } from '@ali/dingtalk-jsapi/core';
import { init as mockInit, appendMockApiResult } from '@ali/dingtalk-jsapi/plugin/mockApi';
<% if (!arms) { %>import { __WPO_MP } from '../logger/retcode';<% } %><% if (arms) { %>import Arms from '../logger/arms';<% } %>
import { MOCK_MODE_ENABLE } from '../../constants/config';

export const initJsapi = () => {
  if (dd.isIDE) {
    if (MOCK_MODE_ENABLE) {
      // 配置数据
      const apiMockJson = require('../../mock/apiMock.js').apiMockMap;
      // 配置的 lwp 接口数据
      const lwpApiMockJson = require('../../mock/lwpApiMock.js').lwpApiMock;

      // 初始化
      mockInit({
        mockApiMap: apiMockJson,
        isOnlyMockWhenConfig: true,
      });

      // 自定义配置 lwp 接口
      appendMockApiResult(
        'internal.request.lwp',
        (params) => {
          const mockData = lwpApiMockJson[params.uri];
          if (mockData) {
            if (mockData.isSuccess) {
              return Promise.resolve(mockData.payload);
            } else {
              return Promise.reject(mockData.payload);
            }
          } else {
            return Promise.reject({
              code: 404,
              body: {},
            });
          }
        },
        (params) => {
          return !lwpApiMockJson[params.uri];
        },
      );
    }

    devConfig({
      debug: true,
    });
  } else {
    // 禁止上传的API列表
    const ForbiddenLogAPIList = ['internal.log.add', 'biz.util.ut'];

    // 生产环境下接口调用上报 Retcode
    devConfig({
        onAfterInvokeAPI: (data) => {
          try {
            if (data.method === 'internal.request.lwp') {
              let errorMessage: string = '';
              let errorCode: string  = '';
              let isLwpSuccess: boolean = true;
              if (data.isSuccess && data.payload.code !== 200) {
                isLwpSuccess = false;
                errorMessage = data.payload.body.reason;
                errorCode = data.payload.body.code;
              } else if (!data.isSuccess) {
                isLwpSuccess = false;
                errorCode = data.payload.errorCode;
                errorMessage = data.payload.errorMessage;
              }<% if (arms) { %>
              Arms.api(
                `[LWP]: ${data.params.uri}`,
                isLwpSuccess,
                data.duration,
                isLwpSuccess ? '200' : errorCode,
                isLwpSuccess ? 'success' : JSON.stringify({
                  request: data.params,
                  response: errorMessage,
                }),
              );<% } %><% if (!arms) { %>
              __WPO_MP.retCode(
                `[LWP]: ${data.params.uri}`,
                isLwpSuccess,
                data.duration,
                isLwpSuccess ? '200' : errorCode,
                isLwpSuccess ? 'success' : JSON.stringify({
                  request: data.params,
                  response: errorMessage,
                }),
              );<% } %>
            } else if (ForbiddenLogAPIList.indexOf(data.method) === -1) {<% if (!arms) { %>
              __WPO_MP.retCode(`[API]: ${data.method}`, data.isSuccess, data.duration);<% } %><% if (arms) { %>
              Arms.api(`[JSAPI]: ${data.method}`, data.isSuccess, data.duration);<% } %>
            }
          } catch (e) {<% if (!arms) { %>
            // 通常情况下不会报错，报错走监控
            __WPO_MP.error('customErrorLog', `jsapi onAfterInvokeAPI error ${JSON.stringify(e)}`);<% } %><% if (arms) { %>
            Arms.error(`[JSAPI]: ${data.method}|${JSON.stringify(e)}`);<% } %>
          }
      },
    });
  }
};
