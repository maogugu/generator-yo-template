/* eslint-disable */
const path = require('path');
const rootDir = path.resolve(__dirname, './imsdk_android/openimService/idl-sources');

// 选择你想要编译的 IDL 文件
const repoDirs = [
    'dept_guide_interfaces',
    'dept_guide_models',
].map((fileName) => {
    return path.resolve(rootDir, `${fileName}.idl`);
});

// 没有IDL的在本地定义
const localDirs = [
    path.join(__dirname, './src/idl/EduAlbum_interface.idl'),
    path.join(__dirname, './src/idl/EduAlbum_model.idl'),
];

module.exports = repoDirs.concat(localDirs);
/* eslint-enable */