/* tslint:disable:no-console */
import jsapiLog from '@ali/dingtalk-jsapi/api/internal/log/add';
import jsapiUt from '@ali/dingtalk-jsapi/api/biz/util/ut';
import { LOCAL_LOG_TYPE } from '../../constants/config';

/**
 * 用于打客户端本地日志
 */
const localLog = (text: string) => {
  return jsapiLog({
    text,
    type: LOCAL_LOG_TYPE,
  });
};

const serializeLog = (prefix: string, ...args: any[]) => {
  const logArgs = args.map((item) => {
    if (item instanceof Error) {
      return item.stack + item.toString();
    } else if (typeof item === 'object') {
      try {
        return JSON.stringify(item);
      } catch (e) {
        return `[Log Exception] object can't be logged due to reason ${e.toString()}`;
      }
    } else if (item !== undefined) {
      return item.toString();
    } else {
      return '';
    }
  });
  return `[${prefix}] ${logArgs.join(' | ')}`;
};

/**
 * DingTalk Logger
 * @description 使用场景：通用日志 Logger，无特殊需求，都推荐使用此 Logger
 */
export const dtLogger = {
  /** 开发测试log 不上报 */
  info: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(...args);
    }
    localLog(serializeLog('DEBUG', ...args));
  },

  warn: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args);
    }
    localLog(serializeLog('WARN', ...args));
  },
  /** 当程序异常的埋点 */
  error: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args);
    }
    const errorMsg = serializeLog('ERROR', ...args);
    localLog(errorMsg);
  },
  /**
   * 用于钉钉业务数据埋点 [详细资料](https://yuque.antfin-inc.com/dd-fd/union_jsapi/aaw595)
   * @param {string} key
   * @param {{
   *     [key: string]: string;
   * }} value
   * @returns
   */
  UT: (key: string, value?: {
    [key: string]: string;
  }) => {
    return jsapiUt({
      key,
      value,
    });
  },
};
