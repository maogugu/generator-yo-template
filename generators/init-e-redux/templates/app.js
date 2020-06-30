import '@ali/dingtalk-jsapi/entry/mobile';
// import { autoInit, changeLanguage, i18next } from '@ali/dingtalk-i18n';
// import i18nResource from '/i18nResource/translation';
// import keys from '/services/translationKeys';
import * as jsapi from '/services/jsApiHelper';
import confirm from '@ali/dingtalk-jsapi/api/device/notification/confirm';
import { compareVersion }  from '@ali/dingtalk-jsapi/core';
import logger, { WPO } from '/services/logger';

//TODO: 翻译任务，完成翻译后打开注释，在getApp().displayText中可访问文案
// autoInit(i18nResource, my.getSystemInfoSync().language, {keySeparator: ':'});
// const displayText = {};
// keys.forEach(key => {
//   displayText[key] = i18next.t(key);
// })

App({
  debug: true,
  // displayText,
  globalData: {},
  onLaunch(options) {
    // options.query获取url中query参数
  },
  onShow(options) {
    dd.getSystemInfo({
      success: (res) => {
        const { version } = res;
        // mini-ddui一些组件会用到，用到时请放开
        // app.globalData.systemInfo = res; 
        WPO.setConfig({
          tag: res.platform
        });
        if (!compareVersion('4.5.15', version, true)) {
          //TODO: 翻译提示升级任务，统一提示文案，有翻译需求的E应用请翻译如下文案
          confirm({
            message: '当前钉钉版本过低，不支持此功能，是否立即升级？',
            buttonLabels: ['取消', '立即升级'],
            title: '升级提示',
            onSuccess: (result) => {
              const index = result.buttonIndex;
              if (index === 1) {
                jsapi.openLink({ url: 'https://www.dingtalk.com/download' });
              } else {
                jsapi.close();
              }
            },
          });
        }
      }
    })
  },
  onError(message, source, lineno, colno, stack) {
    logger.logJsError2RetCode(message, source, lineno, colno, stack)
  }
});
