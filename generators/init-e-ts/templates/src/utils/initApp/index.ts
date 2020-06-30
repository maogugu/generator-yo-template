import { initSpmTracker } from '@ali/eapp-spm-tracker';
<% if (arms) { %>import './initArms'; <% } %><% if (!arms) { %>import { initRetcode } from './initRetcode';<% } %>
import './initIcon';
import { initI18n } from './initI18n';
import { initJsapi } from './initJsapi';
import { initDTRpc } from './initDTRpc';
import { SPMA, SpmTrackerUtKey } from '../../constants/config';

/**
 * 初始化 App 相关配置
 * @description 在应用初始时调用
 */
export const initApp = () => {
  // 初始化 Jsapi
  initJsapi();
  // 初始化 DTRpc
  initDTRpc();
  // 初始化 i18n
  initI18n();
  // 初始化utTrace埋点A位
  initSpmTracker(SpmTrackerUtKey, { spmA: SPMA });<% if (!arms) { %>
  // 初始化 Retcode
  initRetcode();<% } %>
};
