import { debounce } from 'lodash'
import { Toast } from 'vant'

Toast.allowMultiple()
const debounceConfig = [ 1500, { leading: true, trailing: false } ]
// 普通提示
export const NormalMessage = debounce((msg) => { Toast(msg) }, ...debounceConfig)
// 成功提示
export const SuccessMessage = debounce((msg) => { Toast.success(msg) }, ...debounceConfig)
// 失败提示
export const ErrorMessage = debounce((msg) => { Toast.fail(msg) }, ...debounceConfig)
