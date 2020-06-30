/**
 *  分为钉钉原生api和非钉钉原生通用api
 */

import 'dingtalk-jsapi/entry/union'
import openLink from 'dingtalk-jsapi/api/biz/util/openLink'
import datetimepicker from 'dingtalk-jsapi/api/biz/util/datetimepicker'
import close from 'dingtalk-jsapi/api/biz/navigation/close'
import Config from '/utils/config'

export default {
  // 修改头部title
  setNavigationBar (pageTitle) {
    dd.setNavigationBar({
      title: pageTitle
    })
  },

  // alert弹框
  alert (content, title, buttonText = '确定', func) {
    dd.alert({
      title,
      content,
      buttonText,
      success: () => {
        func && func()
      }
    })
  },
  // 调试用alert
  alertObj (obj) {
    dd.alert({
      content: JSON.stringify(obj)
    })
  },
  // toast提示框
  showToast (content, func1, type = 'success', duration = 2000, func2) {
    dd.showToast({
      type,
      content,
      duration,
      success () {
        func1 && func1()
      },
      complete () {
        func2 && func2()
      }
    })
  },
  // 显示加载提示
  showLoading (content, delay = 0) {
    dd.showLoading({
      content,
      delay
    })
  },
  // 隐藏加载提示
  hideLoading () {
    dd.hideLoading()
  },
  // confirm提示框
  confirm (content, confirmFun, cancelFun, title = '', confirmButtonText = '确定', cancelButtonText = '取消') {
    dd.confirm({
      title,
      content,
      confirmButtonText,
      cancelButtonText,
      success: (result) => {
        if (result.confirm) {
          confirmFun && confirmFun()
        } else {
          cancelFun && cancelFun()
        }
      }
    })
  },
  // 免登
  getAuthCode (successFun, failFun) {
    dd.getAuthCode({
      success: res => {
        successFun && successFun(res)
      },
      fail: err => {
        successFun && successFun(err)
      }
    })
  },
  // 显示操作菜单
  showActionSheet (items = [], confirmFun, cancelFun, title = '选择', cancelButtonText = '取消') {
    dd.showActionSheet({
      title,
      items,
      cancelButtonText,
      success: (res) => {
        if (res.index === -1) {
          cancelFun && cancelFun()
        } else {
          confirmFun && confirmFun(res.index)
        }
      }
    })
  },
  // 设置导航栏文字及样式
  setNavigationBar (title, backgroundColor, reset) {
    dd.setNavigationBar({
      title,
      backgroundColor,
      reset
    })
  },
  // 获取本地存储
  getStorage (key) {
    return dd.getStorageSync({ key }).data ? dd.getStorageSync({ key }).data : ''
  },
  // 异步获取本读存储
  getStoragePromise (key) {
    return new Promise((resolve, reject) => {
      dd.getStorageSync({
        key,
        success: res => {
          resolve()
        },
        fail: res => {
          reject()
        }
      })
    })
  },
  // 设置本地存储
  setStorage (key, value) {
    dd.setStorageSync({ key, data: value })
  },
  // 异步设置本地存储
  setStoragePromise (key, value) {
    return new Promise((resolve, reject) => {
      dd.getStorageSync({
        key: key,
        data: value,
        success: res => {
          resolve(res)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },
  // 删除本地存储
  removeStorage (key, success) {
    dd.removeStorageSync({
      key,
      success: success && success()
    })
  },
  // 保留当前页面，跳转到应用内的某个指定页面，可以使用 dd.navigateBack 返回到原来页面
  navigateTo (url, param = {}, func1, func2, func3) {
    if (param) {
      let urlAppend = '?'
      if (Object.keys(param).length > 0) {
        urlAppend += Object.keys(param).map(k => {
          return k + '=' + param[k]
        }).join('&')
        url += urlAppend
      }
    };
    dd.navigateTo({
      url,
      success () {
        func1 && func1()
      },
      fail () {
        func2 && func2()
      },
      complete () {
        func3 && func3()
      }
    })
  },
  // 关闭当前页面，跳转到应用内的某个指定页面
  redirectTo (url, param = {}, func1, func2, func3) {
    if (param) {
      let urlAppend = '?'
      if (Object.keys(param).length > 0) {
        urlAppend += Object.keys(param).map(k => {
          return k + '=' + param[k]
        }).join('&')
        url += urlAppend
      }
    };
    dd.redirectTo({
      url,
      success () {
        func1 && func1()
      },
      fail () {
        func2 && func2()
      },
      complete () {
        func3 && func3()
      }
    })
  },
  // 切换tabbar页面，并关闭其他非tabbar页面
  switchTab (url, func1, func2, func3) {
    dd.switchTab({
      url,
      success () {
        func1 && func1()
      },
      fail () {
        func2 && func2()
      },
      complete () {
        func3 && func3()
      }
    })
  },
  // 关闭当前页面，返回上一级或多级页面。可通过 getCurrentPages 获取当前的页面栈信息，决定需要返回几层。
  navigateBack (delta = 1) {
    dd.navigateBack({
      delta
    })
  },
  // 关闭当前所有页面，跳转到应用内的某个指定页面
  reLaunch (url, func1, func2, func3) {
    dd.reLaunch({
      url,
      success () {
        func1 && func1()
      },
      fail () {
        func2 && func2()
      },
      complete () {
        func3 && func3()
      }
    })
  },
  // 预览图片
  previewImage (urls, current = 0) {
    dd.previewImage({
      current,
      urls
    })
  },
  // 滚动到页面的目标位置
  pageScrollTo (scrollTop) {
    dd.pageScrollTo({ scrollTop })
  },
  // 选择日期
  datePicker (format = 'yyyy-MM-dd', currentDate, startDate, endDate, func1, func2) {
    dd.datePicker({
      format, // 日期格式
      currentDate, // 初始选择的日期时间
      startDate, // 起始时间
      endDate, // 终止时间
      success (res) {
        func1 && func1(res)
      },
      fail (err) {
        func2 && func2(err)
      }
    })
  },

  // 选择图片
  chooseImage (count, sourceType = ['camera', 'album'], func1, func2) {
    dd.chooseImage({
      count,
      sourceType,
      success (res) {
        func1 && func1(res)
      },
      fail (err) {
        func2 && func2(err)
      }
    })
  },
  // 上传本地资源到开发者服务器
  uploadFile (url, filePath, fileName, fileType, header, formData, func1, func2) {
    dd.uploadFile({
      url,
      filePath,
      fileName,
      fileType,
      header,
      formData,
      success (res) {
        func1 && func1(res)
      },
      fail (err) {
        func2 && func2(err)
      }
    })
  },

  // 下载文件资源到本地
  downloadFile (url, header, func1, func2) {
    dd.downloadFile({
      url,
      header,
      success (res) {
        func1 && func1(res)
      },
      fail (err) {
        func2 && func2(err)
      }
    })
  },

  // 选择人和部门，选择部门后把该部门转换成对应部门下的人
  complexChoose (title, multiple, limitTips, maxUsers, pickedUsers, pickedDepartments, disabledUsers, disabledDepartments, requiredUsers, requiredDepartments, permissionType, responseUserOnly, startWithDepartmentId, func1, func2) {
    const { isEmulator } = Config // 获取是否是模拟器环境
    dd.complexChoose({
      title, // 标题
      multiple, // 是否多选
      limitTips, // 超过限定人数返回提示
      maxUsers, // 最大可选人数
      pickedUsers, // 已选用户
      pickedDepartments, // 已选部门
      disabledUsers, // 不可选用户
      disabledDepartments, // 不可选部门
      requiredUsers, // 必选用户（不可取消选中状态）
      requiredDepartments, // 必选部门（不可取消选中状态）
      permissionType, // 可添加权限校验，选人权限，目前只有GLOBAL这个参数
      responseUserOnly, // 返回人，或者返回人和部门
      startWithDepartmentId, // 仅支持0和-1两个值 0表示从企业最上层开始；-1表示从自己部门开始，为-1时仅在Android端生效
      success (res) {
        if (isEmulator) {
          const resEm = responseUserOnly
            ? { users: [{ name: '刘煜冰', orgUserName: '刘煜冰', nick: '刘煜冰', avatar: 'https://static.dingtalk.com/media/lADPDgQ9q79jW8Q0MA_48_52.jpg', userId: '072156571021116908' }], departments: [], selectedCount: 1, warm: '这是模拟器测试数据' }
            : { users: [{ name: '方珍', orgUserName: '方珍', nick: '方珍', avatar: 'https://static.dingtalk.com/media/lADPDgQ9qf6MAl_NBDjNBDg_1080_1080.jpg', selectDeptId: 86091173, selectDeptName: '电大测试', userId: '2026363551836916' }], departments: [{ id: 136184795, name: '油管1部', count: 3 }], selectedCount: 4, warm: '这是模拟器测试数据' }
          func1 && func1(resEm)
        } else {
          func1 && func1(res)
        }
      },
      fail (err) {
        func2 && func2(err)
      }
    })
  },

  // 选择部门信息
  chooseDepartments (title, multiple, limitTips, maxDepartments, pickedDepartments, disabledDepartments, requiredDepartments, permissionType, func1, func2) {
    dd.chooseDepartments({
      title, // 标题
      multiple, // 是否多选
      limitTips, // 超过限定人数返回提示
      maxDepartments, // 最大选择部门数量
      pickedDepartments, // 已选部门
      disabledDepartments, // 不可选部门
      requiredDepartments, // 必选部门（不可取消选中状态）
      permissionType, // 选人权限，目前只有GLOBAL这个参数
      success: function (res) {
        func1 && func1(res)
      },
      fail: function (err) {
        func2 && func2(err)
      }
    })
  },

  // 调用扫一扫功能
  scan (type = 'qr', func1, func2) {
    dd.scan({
      type,
      success (res) {
        func1 && func1(res)
      },
      fail (err) {
        func2 && func2(err)
      }
    })
  },
  // 钉盘文件预览
  previewFileInDingTalk (corpId, spaceId, fileId, fileName, fileSize, fileType) {
    dd.previewFileInDingTalk({
      corpId,
      spaceId,
      fileId,
      fileName,
      fileSize,
      fileType
    })
  },

  /** 钉钉内部 api ---start */
  // 打开新开页面
  openLink (url) {
    openLink({ url })
  },

  // 选择日期
  datetimepicker (format = 'yyyy-MM-dd', value, func1, func2) {
    datetimepicker({
      format, // 日期格式
      value // 初始选择的日期时间
    }).then((res) => {
      func1 && func1(res)
    }).catch((error) => {
      func2 && func2(error)
    })
  },

  // 关闭小程序进程方法
  close () {
    close()
  }
}
