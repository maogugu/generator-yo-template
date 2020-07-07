/**
 * 字典
 * @example
 * dict.getDictList('user')  // 根据字典名，获取list(多用于下拉框)，如[{key:1,name:'内置类型1'},{key:2,name:'内置类型2'}]
 * dict.getDictObj('user')  // 根据字典名，获取对象，如{ 1: '内置类型1', 2: '内置类型2' }
 * dict.getDictItem('user',2))  // 根据字典名和key，获取value
*/
const requireDictFiles = require.context('./', true, /\.js/)
// 如果数据少,可写在对象内  数据多请新建文件
// 使用方式看type.js
// 注意不要重名哦
const dicts = {
  taskType: { 1: '内置类型1', 2: '内置类型2' }
}

requireDictFiles.keys().forEach(path => {
  const fileName = path.replace(/(.*\/)*([^.]+).*/ig, '$2')
  if (fileName !== 'index') {
    dicts[fileName] = requireDictFiles(path).default
  }
})

export function getDictList (name) {
  const list = []
  if (dicts[name]) {
    for (const i in dicts[name]) {
      list.push({ key: i, value: dicts[name][i] })
    }
  }
  return list
}
// 返回某项value
export function getDictItem (name, key) {
  return dicts[name][key]
}

// 返回对象
export function getDictObj (name) {
  if (dicts[name]) {
    return { ...dicts[name] }
  }
}
