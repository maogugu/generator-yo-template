
import { init, appendMockApiResult } from '@ali/dingtalk-jsapi/plugin/mockApi';

const lwpApiMockJson = require('./lwpApiMock.js').lwpMockApi;
const apiMockJson = require('./jsapiMock').jsapiMock;

init({
  mockApiMap: apiMockJson,
});
appendMockApiResult('internal.request.lwp', (params) => {
  const mockData = lwpApiMockJson[params.uri];
  if (mockData) {
    if (mockData.isSuccess) {
      return Promise.resolve(mockData.payload);
    }
    else {
      return Promise.reject(mockData.payload);
    }
  } else {
    return Promise.reject({
      code: 404,
      body: {}
    });
  }
});

