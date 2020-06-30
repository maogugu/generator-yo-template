import {BasicMap} from './lib/basic-types';
import {sendMsg, IRPCResult, IHeaders} from './lib/rpc-request';
export interface OrgTargetModel {
    cid?: string;
    nick?: string;
    industry?: string;
}
export const DeptGuideI_getI18nContent = (keys: string[], headers: IHeaders = {}): Promise<IRPCResult<BasicMap<string>>> => {
    return sendMsg<BasicMap<string>>('/r/Adaptor/DeptGuideI/getI18nContent', headers, [keys]);
};
export const DeptGuideI_sendSetDeptAdminMsg = (corpId: string, content: string, deptId: number, headers: IHeaders = {}): Promise<IRPCResult<boolean>> => {
    return sendMsg<boolean>('/r/Adaptor/DeptGuideI/sendSetDeptAdminMsg', headers, [corpId, content, deptId]);
};
export const DeptGuideI_setOrgTarget = (target: number, corpId: string, headers: IHeaders = {}): Promise<IRPCResult<boolean>> => {
    return sendMsg<boolean>('/r/Adaptor/DeptGuideI/setOrgTarget', headers, [target, corpId]);
};
export const DeptGuideI_getOrgTargetInfo = (corpId: string, headers: IHeaders = {}): Promise<IRPCResult<OrgTargetModel>> => {
    return sendMsg<OrgTargetModel>('/r/Adaptor/DeptGuideI/getOrgTargetInfo', headers, [corpId]);
};