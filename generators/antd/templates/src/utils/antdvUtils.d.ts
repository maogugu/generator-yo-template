/** 成功的防抖提示 */
declare function SuccessMessage(msg: string): void

/** 警告的防抖提示 */
declare function WarningMessage(msg: string): void

/** 错误的防抖提示 */
declare function ErrorMessage(msg: string): void

interface antdRule{
  pattern:RegExp,
  message:string
}
/** 两位小数的正数 价格校验 */
declare const priceRuler:antdRule
/** 邮箱校验 */
declare const emailRuler:antdRule
/** 手机号校验 */
declare const phoneRuler:antdRule
/** 身份证号校验 */
declare const idRuler:antdRule
/** 座机号校验 */
declare const mobileRuler:antdRule
/** 正整数校验 */
declare const positiveIntRuler:antdRule
/** 限制输入 min~max个汉字、字母、数字 中划线下划线 */
declare function normalStr({min = 0, max = 9999}):antdRule 



export {
  SuccessMessage,
  WarningMessage,
  ErrorMessage,
  priceRuler,
  emailRuler,
  phoneRuler,
  idRuler,
  mobileRuler,
  positiveIntRuler
}
