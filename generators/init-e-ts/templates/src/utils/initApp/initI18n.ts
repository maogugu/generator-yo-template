import { autoInit } from '@ali/dingtalk-i18n';
import i18nResource from '../../i18nResource/translation';

export const initI18n = () => {
  autoInit(i18nResource, dd.getSystemInfoSync().language);
};
