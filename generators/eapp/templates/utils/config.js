/**
 * 项目配置内容
 */
const isDev = true

const dev = {
  useMock: true, // 是否使用mock数据
  isEmulator: true, // 是否模拟器开发环境
  baseUrl: 'http://localhost:3000' // 测试'
}

const prod = {
  useMock: false,
  isEmulator: false,
  baseUrl: 'http://1.29.218.75:5555'
}

export default isDev ? dev : prod
