import { debounce } from 'lodash'
import { Toast } from 'vant'

Toast.allowMultiple()
// 普通提示
export const NormalMessage = debounce((msg) => { Toast(msg) }, 1500, { leading: true, trailing: false })
// 成功提示
export const SuccessMessage = debounce((msg) => { Toast.success(msg) }, 1500, { leading: true, trailing: false })
// 失败提示
export const ErrorMessage = debounce((msg) => { Toast.fail(msg) }, 1500, { leading: true, trailing: false })
