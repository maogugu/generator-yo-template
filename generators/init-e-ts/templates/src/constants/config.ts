<% if (arms) { %>// ARMS 监控
export const ARMS_PID = '';<% } %><% if (!arms) { %>
// Retcode SPM 值
export const RETCODE_SPM = '';<% } %>
// spm数据埋点A点
export const SPMA = '';

// spm数据埋点key值
export const SpmTrackerUtKey = '';

// 是否开启 MOCK
export const MOCK_MODE_ENABLE = true;

// 日志 Type , 用于 JSAPI 本地日志
export const LOCAL_LOG_TYPE = `miniapp_${ <% if (!arms) { %>RETCODE_SPM<% } %><% if (arms) { %>ARMS_PID<% } %> }`;

if (<% if (arms) { %> !ARMS_PID <% } %><% if (!arms) { %> !RETCODE_SPM <% } %>|| !SpmTrackerUtKey || !SPMA) {
  throw new Error('请设置 config 参数');
}
