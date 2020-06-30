import { generateTpl } from "../libs/generateTpl";
const { getAppIns } = require('../libs/getAppIns');
const navToPage = require('../libs/navToPage');

const pagePath = 'pages/home/home';
let pageCurrInstance = '';

describe('index.test.js', () => {
  const getCurrentPage = async (app) => {
    return navToPage(app, pagePath);
  };

  it('renders', async () => {
    const { app } = getAppIns();
    pageCurrInstance = await generateTpl(app, pagePath);
    const currentPage = await getCurrentPage(app)
    await currentPage.sleep(300);

    const pageClassName = '.page-index'; // 变量填写，eg: pageClassName = '.page-index'
    expect(currentPage.querySelector(pageClassName)).not.toBeNull();
    expect(currentPage.toSnapshot()).toMatchSnapshot(pageClassName);
  });
  
});
