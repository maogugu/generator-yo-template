
export interface IHeaders {
    [index: string]: any;
}

export interface RPC {
    sendMsg<T>(url: string, headers: IHeaders, body: any[]): Promise<IRPCResult<T>>;
}

let rpc: RPC;

export function init(_rpc: RPC): void {
    rpc = _rpc;
}

export interface IRPCResult<T> {
    code: number;
    body: T;
    headers?: {};
}

export const sendMsg = <T>(url: string, headers: IHeaders, body: any[]): Promise<IRPCResult<T>> => {
    if(!rpc){
        throw new Error('rpc is null, must init rpc first');
    }else{
        return rpc.sendMsg(url, headers, body);
    }
};
