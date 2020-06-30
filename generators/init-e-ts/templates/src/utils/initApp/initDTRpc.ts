import lwp from '@ali/dingtalk-jsapi/api/internal/request/lwp';
import { init } from '../../services/dingtalkRpc/lib/rpc-request';

export const initDTRpc = () => {
  init({
    sendMsg: (url, headers = {}, body = []) => {
      return lwp({
        uri: url,
        headers,
        body,
      }).then((result) => {
        if (result.code === 200) {
          return Promise.resolve(result);
        } else {
          return Promise.reject(result);
        }
      });
    },
  });
};
