import { initRetcode as initRetcodeImpl } from '../logger/retcode';
import { RETCODE_SPM } from '../../constants/config';

export const initRetcode = () => {
  // retcode 埋点初始化
  initRetcodeImpl(RETCODE_SPM);
};
