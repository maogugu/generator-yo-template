import { __WPO_MP } from '@ali/retcodelog/lib/eapp/index';
import { ILogErrorEventDefine } from '@ali/retcodelog/lib/eapp/modelDef';
import getUserInfo from '@ali/dingtalk-jsapi/api/biz/user/get';
import app from '../../app.json';

/**
 * 初始化 Retcode
 * @param spmId
 * @param [customTag]
 */
export const initRetcode = (spmId: string, customTag?: string) => {
  /**
   * 初始化监控sdk
   */
  __WPO_MP
      .setConfig({
        spmId,
        tag: customTag,
        // 关键，传入 request 方法，必不可少
        // 需要将 retcode.taobao.com 配置为E应用安全域名
        request: (url) => {
          dd.httpRequest({
            url,
            method: 'GET',
            // 不传 dataType 会在某些情况下报错，如某些 Android 和 IDE 中
            dataType: 'text',
          });
        },
      })
      .setLogBaseSendValuePairs({
        monitorType: 'prodCommonXflush',
        // monitorGroupType: 'yourMonitorGroupType',
        // 只有编译后的 app.json 有 buildTime
        buildTime: (app as any).buildTime,
        SDKVersion: dd.SDKVersion,
      })
      // 本地开发不发送日志，上线情况请改为false
      .setDebugMode({
        debug: dd.isIDE,
      })
      .performance();
  // 异步补充用户信息
  fillUserInfoToRetcode();
};

// 监听错误并上报
export const miniAppOnError = (
  msg: ILogErrorEventDefine | string, source: string,
  lineno: string | number,
  colno: string | number,
  stack: string,
) => {
  __WPO_MP.error('jserror', msg, source, lineno, colno, stack);
};

// 设置来源
export const setLwfromValue = (lwfrom: string = 'unknown') => {
  if (__WPO_MP.logBaseArgs && __WPO_MP.logBaseArgs.lwfrom) {
    return;
  } else {
    __WPO_MP.setLogBaseSendValuePairs({
      lwfrom,
    });

    __WPO_MP.custom('count', `appLaunch_lwfrom_${lwfrom}`);
  }
};

// 补充用户信息
const fillUserInfoToRetcode = () => {
  getUserInfo({
    allowNoOrgUser: true,
  }).then((user: { nickName?: string; corpId?: string; emplId?: string; }) => {
    if (!user) {
      throw new Error('User Information Empty');
    }
    __WPO_MP.setLogBaseSendValuePairs({
      userNick: user.nickName || '',
      corpId: user.corpId || '',
      staffId: user.emplId || '',
    });
  }).catch((error: any) => {
    __WPO_MP.custom('count', 'Logger.getUserInfo.error', error);
  });
};

export { __WPO_MP };
