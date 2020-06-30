import ddApi from '/utils/ddApi'
import validate from '/utils/validate'

// import Config from '/utils/config'


export default {
  // 个性化 utils
  ...ddApi,
  ...validate,
  /*
   * 标准时间格式转化
   * @argument {String} date  时间戳
   * @argument {String} formatStr  时间格式，例：'yyyy年M月d日'返回'2019年9月9日'、'yyyy-MM-dd HH:mm:ss'返回'2019-09-09 14:36:49'
  */
  transDate (date, formatStr) {
    date = date || new Date()
    formatStr = formatStr || 'yyyy-MM-dd HH:mm'

    const zeroize = (value, length) => {
      if (!length) {
        length = 2
      }
      value += ''
      let zeros = ''
      for (let i = 0; i < (length - value.length); i++) {
        zeros += '0'
      }
      return zeros + value
    }

    return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, $0 => {
      switch ($0) {
        case 'd': return date.getDate()
        case 'dd': return zeroize(date.getDate())
        case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()]
        case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
        case 'M': return date.getMonth() + 1
        case 'MM': return zeroize(date.getMonth() + 1)
        case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
        case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]
        case 'yy': return date.getFullYear().toString().substr(2)
        case 'yyyy': return date.getFullYear()
        case 'h': return date.getHours() % 12 || 12
        case 'hh': return zeroize(date.getHours() % 12 || 12)
        case 'H': return date.getHours()
        case 'HH': return zeroize(date.getHours())
        case 'm': return date.getMinutes()
        case 'mm': return zeroize(date.getMinutes())
        case 's': return date.getSeconds()
        case 'ss': return zeroize(date.getSeconds())
        case 'l': return date.getMilliseconds()
        case 'll': return zeroize(date.getMilliseconds())
        case 'tt': return date.getHours() < 12 ? 'am' : 'pm'
        case 'TT': return date.getHours() < 12 ? 'AM' : 'PM'
        default: return ''
      }
    })
  },
  // 时间戳转日期
  getLocalTime (timestamp) {
    const date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = date.getDate() + ' '
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
  },
  // 获取文件名后缀
  getSuffix (str) {
    return str.substring(str.lastIndexOf('.') + 1, str.length)
  },

}
