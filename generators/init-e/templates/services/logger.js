//TODO：监控任务，完成retCode任务创建后打开注释，上线将setDebugMode设置为false
//retCode:https://yuque.antfin-inc.com/docs/share/b8320e53-8534-4f87-accf-e72045ad16ee
import getUser from '@ali/dingtalk-jsapi/api/biz/user/get';
import { __WPO_MP } from '@ali/retcodelog/lib/eapp';

let isLoggerInited = false;
const logger = {
  init: (spmId) => {
    if (isLoggerInited) {
      return;
    }
    __WPO_MP
      .setConfig({
        spmId,
        request: (url) => {
          dd.httpRequest({
            url,
            method: 'GET',
          });
        },
      })
      // 设置一些大盘用到
      .setLogBaseSendValuePairs({
        // 默认uid覆盖为空，后续动态获取后设置
        uid: '',
        // 带上版本号，xflush上好区分
        eappVersion: '0.0.1',
        // E应用统一大盘
        monitorType: 'prodCommonXflush',
      })
      .setDebugMode({
        debug: !!dd.isIDE,
      }).performance();

    getUser()
      .then((userInfo = {}) => {
        // getUser目前只有有组织用户可成功调用
        __WPO_MP.setLogBaseSendValuePairs({
          // 这些字段是用来追踪信息时用到
          userNick: userInfo.nickName,
          corpId: userInfo.corpId,
          staffId: userInfo.emplId,
        });
      })
      .catch(() => {
        __WPO_MP.custom('count', 'eapp_get_userinfo_error');
      });

    isLoggerInited = true;
  },

  // log 到本地
  log(...args) {
    if (typeof console !== 'undefined' && console.log) {
      console.log(...args);
    }
  },

  logError2RetCode(type, msg) {
    logger.log(type, msg);

    logger.init();

    if (typeof msg === 'object') {
      try {
        msg = JSON.stringify(msg);
      } catch (error) {
        msg = `logError2RetCode.error ${error.message}`;
      }
    }
    __WPO_MP.error(type, `${logger.getBaseArgs()}|${msg}`);
  },

  logApiStatus2RetCode(api, issuccess, delay, httpInfo) {
    logger.log(`${api}:${issuccess ? 'Success' : 'Error'}:${delay}`, httpInfo);

    logger.init();

    let msg;
    try {
      // 错误时上报请求信息
      msg = JSON.stringify(
        issuccess ? 200 : httpInfo
      );
    } catch (error) {
      msg = `logApiStatus2RetCode.error ${error.message}`;
    }

    __WPO_MP.retCode({
      api,
      issuccess,
      delay,
      msg,
      detail: logger.getBaseArgs(),
    });
  },

  // js 异常报错
  logJsError2RetCode(msg, source, lineno, colno, stack) {
    logger.log(msg, source, lineno, colno, stack);
    logger.init();
    // 监听错误并上报
    __WPO_MP.error('jserror', msg, source, lineno, colno, `${logger.getBaseArgs()}|${stack}`);
  },

  getBaseArgs() {
    const {
      corpId,
      staffId,
    } = __WPO_MP.logBaseArgs;

    return JSON.stringify({
      corpId,
      staffId,
    });
  },
}

export default logger;

export const WPO = __WPO_MP;