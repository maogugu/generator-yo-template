import { eappTest } from '../../services/lwp';
// import { clickLogInit, pageLog } from "../../services/dataLogger";
// let clickLog = () => { };

Page({
  data: {
    content: ''
  },
  onLoad(query) {
    // 页面加载
    dd.showLoading({
      content: '加载中...',
      delay: 1000,
    });
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    // 初始化业务数据类埋点实例
    // pageLog("Page_HighF_Home",{
    //   from:query.from||"default",
    //   corpId:query.corpId||""
    // });
    // clickLog = clickLogInit("Page_HighF_Home",{
    //   from:query.from||"default",
    //   corpId:query.corpId||""
    // });
  },
  async onReady() {
    // 页面加载完成
    const res = await eappTest([{}], 'https://mocks.alibaba-inc.com/mock/y-example');
    this.setData({
      content: res.data.content
    });
    dd.hideLoading();
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/home/home',
    };
  },
});
