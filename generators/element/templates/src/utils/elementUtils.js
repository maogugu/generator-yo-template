import { debounce } from 'lodash'
import { Message } from 'element-ui'
const debounceConfig = [ 1500, { leading: true, trailing: false } ]
// 成功提示
export const SuccessMessage = debounce((msg) => { Message.success(msg) },...debounceConfig)

// 警告提示
export const WarningMessage = debounce((msg) => { Message.warning(msg) },...debounceConfig)

// 失败提示
export const ErrorMessage = debounce((msg) => { Message.error(msg) },...debounceConfig)
