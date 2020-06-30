let rpc;
export function init(_rpc) {
    rpc = _rpc;
}
export const sendMsg = (url, headers, body) => {
    if (!rpc) {
        throw new Error('rpc is null, must init rpc first');
    }
    else {
        return rpc.sendMsg(url, headers, body);
    }
};
