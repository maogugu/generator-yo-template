//用于业务数据分析类埋点，同时支持ut,retCode（可选埋点，需要bi，pm配合）。稳定性埋点请使用/services/logger.js
//有疑问请咨询@梦汐@晴葵
import ut from '@ali/dingtalk-jsapi/api/biz/util/ut';
import { WPO } from './logger';

// spmid map列表，需要bi，pm申请spm
const spm = {
  //"Page_HighF_Send": "a2q1i.12563201",

}

/**
 * 初始化某个单页的埋点方法，key规则始终不变
 * @param {*} page 
 * @param {*} defaultValue 
 */
const clickLogInit = (page, defaultValue = {}) => (key, value = {}) => {
  ut({
    key: `${page}_Button-${key}`,
    //根据业务数据埋点要求修改
    value: {
      ...defaultValue,
      ...value,
      //   "version": 'dproject',
      'spm-url': `${spm[page]}.1.${key}`, //申请的spm点位
      'eventid': 2101 //操作id，如点击，跳转等，bi，pm会给到开发
    }
  });
  WPO.custom('count', `${page}_Button-${key}`);
}

/**
 * 某个单页的具体业务事件埋点（事件类型根据eventid变化，一般为这里的点击事件）
 * @param {*} page 
 * @param {*} value
 */
const pageLog = (page, value = {}) => {
  ut({
    key: page,
    value: {//根据项目修改
      ...value,
      //   "version": 'dproject',
      'spm-url': spm[page],
      'eventid': 2001
    }
  });
  WPO.custom('count', page);
}

export default {
  pageLog,
  clickLogInit
};