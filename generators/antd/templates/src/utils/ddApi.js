import * as dd from 'dingtalk-jsapi'
import { CORP_ID } from '@/utils/constant'
import { session } from '@/utils'

const baseConfig = () => ({

  corpId: process.env.NODE_ENV === 'development'
    ? process.env.VUE_APP_agentId
    : session.getSession(CORP_ID),
  appId: process.env.VUE_APP_agentId
})

/**
 * 获取微应用免登授权码
 */
export function requestAuthCodeForRuntime () {
  return dd.runtime.permission.requestAuthCode(baseConfig())
}

// 打开一个新的h5页面
export function openLink (config) {
  return dd.biz.util.openLink({ ...baseConfig(), ...config })
}

/**
 * 修改钉钉页面的title
 */
export function setTitle (config) {
  return dd.biz.navigation.setTitle({ ...baseConfig(), ...config })
}
/**
 * 鉴权
 */
export function ddConfig (config) {
  return dd.config({
    ...config,
    ...baseConfig(),
    jsApiList: [
      'biz.contact.choose',
      'biz.contact.complexPicker',
      'biz.contact.departmentsPicker',
      'biz.customContact.choose',
      'biz.customContact.multipleChoose',
      'biz.ding.post',
      'biz.util.openLink',
      'device.notification.alert',
      'device.notification.confirm',
      'device.notification.prompt',
      'runtime.info'
    ]
  })
}

/**
 * 扫描条形码、二维码
 */
export function utilScan (config) {
  return dd.biz.util.scan({ ...baseConfig(), ...config })
}
export async function complexPicker (config) {
  /**
   * mac端这个点击取消的触发是已知的，目前是需要开发者麻烦跟进返回的信息，如果都是空值，使用对返回信息做个判断，来走自己的取消后的逻辑，暂时麻烦开发者不走onfail回调判断取消
   * 工单原话
   */
  const res = await dd.biz.contact.complexPicker({ ...baseConfig(), ...config })
  if (res.users.length === 0 && res.departments.length === 0) {
    throw new Error('没有选择')
  }
  return res
}

export async function multipleChoose (config) {
  const res = await dd.biz.customContact.multipleChoose({ ...baseConfig(), ...config })
  if (res.length === 0) {
    throw new Error('没有选择')
  }
  return res
}
export function choose (config) {
  return dd.biz.customContact.choose({ ...baseConfig(), ...config })
}

// 图片预览
export function previewImage (config) {
  return dd.biz.util.previewImage({ ...baseConfig(), ...config })
}

/**
 * 获取当前地理位置(单次定位)
 */
export function getGeolocation (config) {
  return dd.device.geolocation.get({ ...baseConfig(), ...config })
}

export function openChart (config) {
  return dd.biz.chat.openSingleChat({ ...baseConfig(), ...config })
}

export function openDing (config) {
  return dd.biz.ding.create({ ...baseConfig(), ...config })
}

// 获取用户的设备信息
export function getPhoneInfo (config) {
  return dd.device.base.getPhoneInfo({ ...baseConfig(), ...config })
}

// 打开地图选择
export function mapSelect (config) {
  return dd.biz.map.search({ ...baseConfig(), ...config })
}

// 打开地图展示
export function mapView (config) {
  return dd.biz.map.view({ ...baseConfig(), ...config })
}

// 跳出当前页面
export function closeWindow (config) {
  return dd.biz.navigation.close({ ...baseConfig(), ...config })
}

// 设置导航栏右侧单个按钮
export function setRight (config) {
  return dd.biz.navigation.setRight({ ...baseConfig(), ...config })
}
/**
 * 预览钉盘文件
 */
export function cspacePreview (config) {
  return dd.biz.cspace.preview({ ...baseConfig(), ...config })
}
/**
 * 文件下载
 */
export function downloadFile (config) {
  return dd.biz.util.downloadFile({ ...baseConfig(), ...config })
}

export function departmentsPicker (config) {
  return dd.biz.contact.departmentsPicker({ ...baseConfig(), ...config })
}

export default {
  requestAuthCodeForRuntime,
  ddConfig,
  setTitle,
  utilScan,
  complexPicker,
  multipleChoose,
  choose,
  previewImage,
  getGeolocation,
  openLink,
  openChart,
  openDing,
  getPhoneInfo,
  mapSelect,
  mapView,
  closeWindow,
  setRight,
  cspacePreview,
  downloadFile,
  departmentsPicker
}
