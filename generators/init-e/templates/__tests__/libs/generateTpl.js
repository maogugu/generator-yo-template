const fs = require('fs');
const path = require('path');
import { lwpResultMock } from '../mock/lwpResultMock'

export const generateTpl = (appWrapper, pagePath)=>{
  let originFileInfo = ''
  const testFileName = pagePath.match(/\/(\S*)\//)[1];
  let pageCurrInstance = '';
  let tpl_LWPFunc = {};
  let tpl_LWPFunc_str = '';

  const readFilePath = path.join(__dirname, `../../${pagePath}.js`);
  const writeFilePath = path.join(__dirname, `../../.tea/testFileTemplates/${testFileName}.js`);
  const writeDirPath = path.join(__dirname, `../../.tea/testFileTemplates`);

  return new Promise((resolve, reject) => {
    fs.readFile(readFilePath, 'utf8', (error, data) => {
      if(error){
        console.log(error);
        reject(error);
      }

      originFileInfo = data.replace(/[\t ]*Page\s*\(\s*?{/, `module.exports = {\ngetApp,\nisGoPromiseError,\ntpl_LWPFunc,\n`)
      .replace(/\s*Page\(\s*connectPage\(\s*mapStateToData\s*\)\s*\(\s*\{/, 'module.exports = connectPage(mapStateToData)({\ngetApp,\nisGoPromiseError,\ntpl_LWPFunc,\n')
      .replace(/\s*\)\s*;{0,1}\s*$/, '').replace(/this.setData/g, 'setData').replace(/this.dispatch/g, 'dispatch');

      for (let key in lwpResultMock[testFileName]){ 
        const then_regStr = new RegExp(`(${key})\\s*\\(\\s*[^;]+?\\)\\.then`,"g");
        const await_regStr = new RegExp(`await\\s+(${key})\\s*\\([\\s\\S]*?\\)(\s*|;)?`,"g");
        
        // console.log(then_regStr);
        tpl_LWPFunc[key] = () => { return lwpResultMock[testFileName][key].defalut};
        tpl_LWPFunc_str = tpl_LWPFunc_str + `${key}: () => { return ${JSON.stringify(lwpResultMock[testFileName][key].defalut)} }, `
        originFileInfo = originFileInfo.replace(then_regStr, `(()=>{ if(!isGoPromiseError){ return Promise.resolve(tpl_LWPFunc.${key}()) } else { return Promise.reject(tpl_LWPFunc.${key}()) }})().then`);
        originFileInfo = originFileInfo.replace(await_regStr, `tpl_LWPFunc.${key}()`);
      }

      originFileInfo = `const tpl_App = ${JSON.stringify(appWrapper.app)};\nlet getApp = ()=> { return tpl_App}; const setData = ()=>{}; const isGoPromiseError = false; \nconst tpl_LWPFunc = {${tpl_LWPFunc_str}}\n` + originFileInfo;

      fs.exists(writeDirPath, function(exists) {
        if(!exists){
          fs.mkdir(writeDirPath, function(error){
            if(error){
              console.log(error);
              reject(error);
            }
          })
        }
        fs.writeFile(writeFilePath, originFileInfo, 'utf8', (error, data) => {
          if(error){
            console.log(error);
            reject(error);
          }

          pageCurrInstance = require(`../../.tea/testFileTemplates/${testFileName}.js`);
          resolve(pageCurrInstance);
        })

      })
    })
  })
}
