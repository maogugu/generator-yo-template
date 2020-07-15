import moment from 'moment'
// 全局格式化 moment 传给后端用
moment.locale('zh-cn')
// 建议 时间选择器 使用 valueFormat
moment.fn.toJSON = function () { return this.format('YYYY-MM-DD') }
