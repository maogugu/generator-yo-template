//jsAPi接口返回说明：https://yuque.antfin-inc.com/dd-fd/union_jsapi/ol1rx7
//jsApi查询：https://yuque.antfin-inc.com/docs/share/8feb5081-6fa5-4631-9c8a-94962679e7ad
//开放平台jsApi查询：https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.7b6f4a97ANrfOL&treeId=171&articleId=107553&docType=1
// import { callApi } from '/utils/tool';
import logger from '/services/logger';
import jsapi from '@ali/dingtalk-jsapi';

const withLogger = (fn, uri) => async (...args) => {
  const startTime = Date.now();
  try {
    const r = await fn(...args);
    logger.logApiStatus2RetCode(uri, true, Date.now() - startTime, {
      request: args,
      response: r,
    });
    return r;
  } catch (e) {
    logger.logApiStatus2RetCode(uri, false, Date.now() - startTime, {
      request: args,
      response: e,
    });
    throw e;
  }
};

export const openLink = withLogger(jsapi.biz.util.openLink, 'biz.util.openLink');
export const close = withLogger(jsapi.biz.navigation.close, 'biz.navigation.close');

// export function wakeupAvatar(success) {
//   callAPI({
//     api: 'internal.chat.chooseGroupIcon',
//     params: {}
//   }).then((res) => {
//     console.log('success', res);
//     success(res)
//   }, (res) => {
//     console.log('error', res);
//     dd.showToast({
//       type: 'fail',
//       content: '系统错误',
//       duration: 2000
//     });
//   })
// }