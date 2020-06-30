/**
 * 字典
 * @example
 * dict.getDictList('user')  // 字典名
 * dict.getDictObj('user')  // 字典名
 * dict.getDictItem('user',2))  // 字典名, key
*/

export default {
  // 返回key/value数组
  getDictList (name) {
    let list = []
    if (dicts[name]) {
      for (let i in dicts[name]) {
        list.push({ key: i, value: dicts[name][i] })
      }
    }
    return list
  },
  // 返回对象
  getDictObj (name) {
    if (dicts[name]) {
      return { ...dicts[name] }
    }
  },
  // 返回某项value
  getDictItem (name, key) {
    return dicts[name][key]
  }
}

const dicts = {
  demo: { 1: 'demo文案1', 2: 'demo文案2' }
}