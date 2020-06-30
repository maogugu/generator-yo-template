import getCurrentUserInfo from '@ali/dingtalk-jsapi/api/internal/user/getCurrentUserInfo';
import EAppLogger from 'alife-logger/eapp';
import {
  SPMA,
  ARMS_PID,
} from '../../constants/config';
import {
  dtLogger,
} from '../logger/dtLogger'
import appJSON from '../../app.json';

// https://help.aliyun.com/document_detail/103990.html?#title-5e4-xzm-lh8
interface IMonitor {
  // NOTE: 以下两个类型来自 https://web.npm.alibaba-inc.com/package/@ali/types-dingtalk-miniapp
  hookApp: <Extra>(option: AppX.AppOption<Extra>) => any;
  hookPage: <
    Data,
    Methods,
    CustomPageInstance = AppX.AnyObject,
  >(option: AppX.ThisTypedPageOption<Data, Methods, CustomPageInstance>) => any;
  // API: https://help.aliyun.com/document_detail/58657.html?spm=a2c4g.11186623.6.692.59a223b8vioCCr
  setConfig: (config: { [key: string]: string }) => void;
  api: (api: string, success: boolean, time: number, code?: string | number, msg?: string) => void;
  error: (msg: string | object, pos?: { filename?: string; lineno?: string; colno?: string; }) => void;
  sum: (key: string) => void;
  avg: (key: string) => void;
}

function getBuildTime() {
  const time = (appJSON as any).buildTime;
  if (time) {
    const d = new Date();
    d.setTime(time);

    const year = d.getFullYear();
    const mon = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();
    const arr = [
      year,
      mon < 10 ? '0' + mon : mon,
      day < 10 ? '0' + day : day,
      hour < 10 ? '0' + hour : hour,
      min < 10 ? '0' + min : min,
      sec < 10 ? '0' + sec : sec,
    ];
    return arr.join('');
  } else {
    return '';
  }
}

const Arms: IMonitor = EAppLogger.init({
  pid: ARMS_PID,
  region: 'cn',
  behavior: true,
  tag: `v=${getBuildTime()}`,
  disabled: dd.isIDE,
  disableHook: true,
});

// 补充 uid 信息，便于 uv 统计
getCurrentUserInfo({}).then((user) => {
  const uid = user && user.uid;
  if (uid) {
    Arms.setConfig({
      uid: `${uid}`,
      tag: `u=${uid}&v=${getBuildTime()}`,
    });
  }
}).catch((e: any) => {
  // 仅写入本地，异常会统一上报 arms
  if (dd.isIDE) {
    // tslint:disable-next-line: no-console
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      // tslint:disable-next-line: no-console
      console.log('----------getCurrentUserInfo().error----------', e);
    }
  } else {
    dtLogger.warn(e);
  }
});

// 设置来源
let hasSettedLwfrom: boolean = false;
export const setLwfromValue = (lwfrom: string = 'unknown') => {
  if (hasSettedLwfrom) {
    return;
  } else {
    Arms.setConfig({
      c1: lwfrom,
    });
    hasSettedLwfrom = true;
    Arms.sum(`appLaunch_lwfrom_${lwfrom}`);
  }
};

export default Arms;
