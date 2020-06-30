import Utils from '/utils/index'
// import validate from '/utils/validate'
import { testGet } from '/http/api'
const app = getApp()

Page({
  data: {
    name: 'alibaba'
  },
  onLoad (query) {
    // 页面加载
  },
  onReady () {
    // 页面加载完成
  },
  onShow () {
    // 页面显示
  },
  onHide () {
    // 页面隐藏
  },
  onUnload () {
    // 页面被关闭
  },
  onTitleClick () {
    // 标题被点击
  },
  onPullDownRefresh () {
    // 页面被下拉
  },
  onReachBottom () {
    // 页面被拉到底部
  },
  onShareAppMessage () {
    // 返回自定义分享信息
  },
  // 按钮
  async test () {
    const res = await testGet({ test: app.test })
    Utils.showToast('接口成功')
    console.log(res)
  }
})
