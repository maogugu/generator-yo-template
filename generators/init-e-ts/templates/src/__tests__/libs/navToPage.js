// defaultPagePath: 填写当前app.json中配置的默认页面路由
let defaultPagePath = 'pages/home/home'; 
module.exports = async (app, pagePath) => {
  if (pagePath === defaultPagePath) {
    return app.getCurrentPage();
  }
  app.navigateTo(`/${pagePath}`);
  const targetPage = await app.waitForPage(p => p.instance.route === pagePath, { timeout: 6000 });
  await targetPage.waitForPageReady();
  defaultPagePath = pagePath;
  return targetPage;
};
