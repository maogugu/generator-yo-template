# <%= name %>

## Description

<%= desc %>

## Author

<% if (author) { %>- <%= author%><%
} %>

## 资料参考

- 图片mediaId转url: @ali/ding-mediaId
- 国际化：
  - @ali/dingtalk-i18n
  - @ali/dingtalk-medusa
  - 更新命令："update-18n": "update-i18n ./services/translationKeys.js ./i18nResource -n ${medusaId}"
- eslint
  - 为了保持小程序依赖包尽量小，eslint功能和规则已经从脚手架中移动到 @ali/ding-cr-cli （https://npm.alibaba-inc.com/package/@ali/ding-cr-cli） 工具中