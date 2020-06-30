export interface IHeaders {
    [index: string]: any;
}
export interface RPC {
    sendMsg<T>(url: string, headers: IHeaders, body: any[]): Promise<IRPCResult<T>>;
}
export declare function init(_rpc: RPC): void;
export interface IRPCResult<T> {
    code: number;
    body: T;
    headers?: {};
}
export declare const sendMsg: <T>(url: string, headers: IHeaders, body: any[]) => Promise<IRPCResult<T>>;
