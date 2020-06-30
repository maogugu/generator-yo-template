import { sendMsg } from './lib/rpc-request';
export const DeptGuideI_getI18nContent = (keys, headers = {}) => {
    return sendMsg('/r/Adaptor/DeptGuideI/getI18nContent', headers, [keys]);
};
export const DeptGuideI_sendSetDeptAdminMsg = (corpId, content, deptId, headers = {}) => {
    return sendMsg('/r/Adaptor/DeptGuideI/sendSetDeptAdminMsg', headers, [corpId, content, deptId]);
};
export const DeptGuideI_setOrgTarget = (target, corpId, headers = {}) => {
    return sendMsg('/r/Adaptor/DeptGuideI/setOrgTarget', headers, [target, corpId]);
};
export const DeptGuideI_getOrgTargetInfo = (corpId, headers = {}) => {
    return sendMsg('/r/Adaptor/DeptGuideI/getOrgTargetInfo', headers, [corpId]);
};
