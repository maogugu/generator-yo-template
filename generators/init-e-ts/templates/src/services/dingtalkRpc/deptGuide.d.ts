import { BasicMap } from './lib/basic-types';
import { IRPCResult, IHeaders } from './lib/rpc-request';
export interface OrgTargetModel {
    cid?: string;
    nick?: string;
    industry?: string;
}
export declare const DeptGuideI_getI18nContent: (keys: string[], headers?: IHeaders) => Promise<IRPCResult<BasicMap<string>>>;
export declare const DeptGuideI_sendSetDeptAdminMsg: (corpId: string, content: string, deptId: number, headers?: IHeaders) => Promise<IRPCResult<boolean>>;
export declare const DeptGuideI_setOrgTarget: (target: number, corpId: string, headers?: IHeaders) => Promise<IRPCResult<boolean>>;
export declare const DeptGuideI_getOrgTargetInfo: (corpId: string, headers?: IHeaders) => Promise<IRPCResult<OrgTargetModel>>;
