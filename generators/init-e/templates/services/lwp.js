import request from '../utils/request';

const lwpFactory = (uri) => (params, baseUrl) => request(uri, params, baseUrl)

export const eappTest = lwpFactory('eappTest');