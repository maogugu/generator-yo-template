// 使用该函数获取应用实例，每一次执行一次测试，每条测试用例应该获取到同一个应用实例
const { launchApp } = require("@ali/dtest-eapp");
jest.setTimeout(10000); //避免jest运行超时
let app, page;
async function launchAndWaitFirstPageReady() {
  // baseUrl：当前启动test-server的路径
  app = await launchApp({
    baseUrl: "http://127.0.0.1:8000/",
    useAppx: "dingtalk"
  });
  // 变量填写，设置小程序入参初始query中的内容
  app.app.onLaunch({
    query: {
      corpId: "ding3c2eeededae92fa935c2f4657eb6378f"
    }
  });
  const rootPage = app.getCurrentPage();
  expect(rootPage).not.toBeNull();
  await rootPage.waitForPageReady();
  await rootPage.sleep(300);
  page = rootPage;
}

beforeAll(async () => {
  console.log = jest.fn();
  console.error = jest.fn();
  global.dd = {
    showLoading: () => {},
    hideLoading: () => {},
    navigateTo: () => {},
    redirectTo: () => {},
    alert: () => {},
    getSystemInfo: () => {},
    setNavigationBar: () => {},
    showToast: () => {},
    httpRequest: () => {}
  };
  !app && (await launchAndWaitFirstPageReady());
});

afterAll(() => {
  app.close();
});

module.exports = {
  getAppIns: () => {
    return { app, page };
  },
  launchAndWaitFirstPageReady
};
