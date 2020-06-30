import '@ali/dingtalk-jsapi/entry/union';
<% if (!arms) { %>import {
  miniAppOnError,
  setLwfromValue,
} from './utils/logger/retcode';<% } %><% if (arms) { %>
import Arms, {
  setLwfromValue,
} from './utils/logger/arms';<% } %>
import {
  dtLogger,
} from './utils/logger/dtLogger';
import {
  addCommonLogData,
} from '@ali/eapp-spm-tracker';
import {
  initApp,
} from './utils/initApp';

// 初始化 App
initApp();

interface IAppQeuryOptions {
  /** 来源 */
  source?: string;
  lwfrom?: string;
}

App(<% if (arms) { %>Arms.hookApp(<% } %>{
  globalData: {},
  onLaunch(options: AppX.AppLaunchOption<IAppQeuryOptions>) {
    // 设置来源
    const lwfrom = options && options.query && (options.query.lwfrom || options.query.source) || 'unknown';
    setLwfromValue(lwfrom);
    // 日志埋点
    dtLogger.info('app runing start', options);
    // 业务数据埋点初始化
    addCommonLogData({
      // 这里设置的值,将在每个自动 ut 数据埋点中当做 value 带入
      lwfrom,
      // corpId: options.query && options.query.corpId,
    });
  },<% if (!arms) { %>
  // 监听错误并上报
  onError(msg: any, source: any, lineno: any, colno: any, stack: any) {
    miniAppOnError(msg, source, lineno, colno, stack);
  },<% } %>
}<% if (arms) { %>)<% } %>);
