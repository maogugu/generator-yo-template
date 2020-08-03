import { debounce } from 'lodash'
import { PriceReg, emailReg, PhoneReg, MobileReg, IDReg, PositiveIntReg, limtInputReg } from '@/utils/validate'
import { message } from 'ant-design-vue'
const debounceConfig = [ 1500, { leading: true, trailing: false } ]
// 成功提示
export const SuccessMessage = debounce((msg) => { message.success(msg) },...debounceConfig)

// 警告提示
export const WarningMessage = debounce((msg) => { message.warning(msg) },...debounceConfig)

// 失败提示
export const ErrorMessage = debounce((msg) => { message.error(msg) },...debounceConfig)

// 常见校验规则
/**
 * 返回一个 CreatedDecorator rules 中的配置项
 */
export const priceRuler = {
  pattern: PriceReg,
  message: '请输入正确的价格'
}

export const emailRuler = {
  pattern: emailReg,
  message: '请输入正确的邮箱'
}

export const phoneRuler = {
  pattern: PhoneReg,
  message: '请输入正确的手机号'
}

export const idRuler = {
  pattern: IDReg,
  message: '请输入正确的身份证号'
}

export const mobileRuler = {
  pattern: MobileReg,
  message: '请输入正确的座机号'
}
export const positiveIntRuler = {
  pattern: PositiveIntReg,
  message: '请输入正整数'
}
export const normalStr = (min = 0, max = 9999) => ({
  pattern: limtInputReg(min, max),
  message: `请输入${min}~${max}个字符`
})
// 常见的格式化规则
