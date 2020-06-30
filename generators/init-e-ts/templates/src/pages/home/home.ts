import { i18next } from '@ali/dingtalk-i18n';
import openLink from '@ali/dingtalk-jsapi/api/biz/util/openLink';
import qs from 'querystring';
import { IMap } from '../../types/common';
import { dtLogger } from '../../utils/logger/dtLogger';
<% if (arms) { %>import Arms from '../../utils/logger/arms';<% } %>
// NOTE: tracker接入文档 https://npm.alibaba-inc.com/package/@ali/eapp-spm-tracker
// import { withPageSpmTracker } from '@ali/eapp-spm-tracker';
import { DeptGuideI_getOrgTargetInfo } from '../../services/dingtalkRpc/deptGuide';

interface IPageData {
  i18nText: IMap <string> ;
}

interface IPageMethod {
  sendRequest: () => void;
}
interface IPageQuery {
  corpId?: string;
}

Page<IPageData, IPageMethod>(<% if (arms) { %>Arms.hookPage(<% } %>{
  data: {
    // 推荐使用此方式来进行文案的国际化
    i18nText: {
        h5_dingtalk_name: i18next.t('h5_dingtalk_name'),
    },
  },
  onLoad(query: IPageQuery) {
    dtLogger.info('Home page onLoad, query:', query);
  },
  sendRequest() {
    // 钉钉事业部的 CorpId
    const DTCorpId = 'ding3abbf39a5ee6c44235c2f4657eb6378f';
    // RPC 调用接口示例
    DeptGuideI_getOrgTargetInfo(DTCorpId).then((result) => {
      dtLogger.info('Test Lwp success', result);
      const urlPrefix = 'dingtalk://dingtalkclient/action/open_mini_app?miniAppId=2019071965873227';
      const pagePath = '/pages/home/home?';
      const pageSearch = {
        corpId: 'ding5b42cac453ec637c35c2f4657eb6378f',
      };
      openLink({
        url: `${urlPrefix}&${encodeURIComponent(`${pagePath}${qs.stringify(pageSearch)}`)}`,
      });
    }).catch((err) => {
      dtLogger.info('Test Lwp failed', err);
    });
  },
}<% if (arms) { %>)<% } %>);
