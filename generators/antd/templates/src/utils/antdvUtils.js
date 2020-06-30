import { isFunction, debounce } from 'lodash-es'
import { Decimal } from 'decimal.js'
import { PriceReg, emailReg, PhoneReg, MobileReg, IDReg, PositiveIntReg, limtInputReg } from '@/utils/validate'
import { message } from 'ant-design-vue'

// 成功提示
export const SuccessMessage = debounce((msg) => { message.success(msg) }, 1500, {
  leading: true,
  trailing: false
})

// 警告提示
export const WarningMessage = debounce((msg) => { message.warning(msg) }, 1500, {
  leading: true,
  trailing: false
})

// 失败提示
export const ErrorMessage = debounce((msg) => { message.error(msg) }, 1500, {
  leading: true,
  trailing: false
})

/**
 * 直接返回一个分页器对象
 * @author 虎哥
 * @param {*} config config 里面任何参数都可以覆写
 * @example
 */
export function paginTool (getData, config = {}) {
  if (!isFunction(getData)) { throw new Error('请传入getData函数') }
  const baseConfig = {
    sortField: null,
    sortType: null,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    hideOnSinglePage: false,
    showTotal: (total, range) => `共 ${total} 条记录 第 ${range[0]} -${range[1]} 条`
  }
  const methods = {
    getValues ({ pageNum = 'pageNum', pageSize = 'pageSize', sortField = 'sortField', sortType = 'sortType' } = {}) {
      return {
        [pageNum]: this.current,
        [pageSize]: this.pageSize,
        [sortField]: this.sortField ?? null,
        [sortType]: this.sortType ?? null
      }
    },
    setTotal (value) {
      this.total = value
    },
    initData () {
      this.current = 1
      this.pageSize = 10
      // 重新获取数据
      getData()
    },
    change ({ current, pageSize }, filters = {}, { field = null, order = null } = {}) {
      const sortType = order?.slice(0, order.length - 3) ?? null
      /**
       * 改变页数
       * 改变排序条件
       * 回到第一页
       */
      const backOne = [this.pageSize !== pageSize, this.sortField !== field, this.sortType !== sortType].some(x => x)
      if (backOne) {
        this.current = 1
      } else {
        this.current = current
      }
      this.pageSize = pageSize
      this.sortField = field ?? null
      this.sortType = sortType
      getData()
    }
  }
  // 等待初始化
  setTimeout(() => { if (config?.init !== false) getData() })
  return Object.assign(baseConfig, config, methods)
}

// ...createdDecorator('demo', {
//   trim: true, // 清除两侧空格
//   required: true, // 必填
//   requiredMsg: '这是一个demo 必填消息', // 必填说明
//   min: 4, // 最小
//   max: 20, // 最大
//   rules: [ // 自定义规则
//     {pattern: /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/, message: '正则demo'},
//   ]
// }),

/**
 * @author 虎哥
 * @param String name 定义名称字段名一样
 * @typedef config {{
 *  trim:boolean,
 *  required:boolean,
 *  requiredMsg:string,
 *  min:number,
 *  max:number,
 *  rules:Array<rules>,
 *  options:Array<option>,
 *  getValueFromEvent:Function,
 * }}
 * @param {config} config 配置参数
 * trim = true, // 是否需要 trim
 * required = false, // 是否必须
 * requiredMsg = 'is required', // 必须提示
 * min, // 最小字数
 * max, // 最大字数
 * rules = [], // 自定义rules,
 * options = [], // 自定义options
 * getValueFromEvent, // 重写函数 与trim 互斥
 * demo see BusinessProcure.vue
 */
export function CreatedDecorator (name, {
  trim = false, // 是否需要 trim 默认不可trim 有些组件类型 不是 element 没有 e.target
  required = false, // 是否必须
  requiredMsg = 'is required', // 必须提示
  type,
  min, // 最小字数
  max, // 最大字数
  rules = [], // 自定义rules,
  options = [], // 自定义options
  getValueFromEvent // 重写函数 与trim 互斥
} = {}) {
  const modifyRules = []
  if (required) modifyRules.push({ required: true, message: requiredMsg })
  if (min) modifyRules.push({ min, message: `最少输入${min}个字符` })
  if (max) modifyRules.push({ max, message: `最多输入${max}个字符` })
  if (type) modifyRules.push({ type, message: '输入类型不正确' })
  const obj = {
    [name]: [name, {
      rules: [...modifyRules, ...rules],
      ...options
    }]
  }
  // trim 优先级更高
  if (trim) {
    obj[name][1].getValueFromEvent = ({ target: { value } }) => value.trim()
  }
  // 有传一个函数来,并且没有trim
  if (isFunction(getValueFromEvent) && !trim) {
    obj[name][1].getValueFromEvent = e => getValueFromEvent(e?.target?.value ?? e)
  }
  // obj = {demo:[xxxxxxx]}
  return obj
}

/**
 * 辅助函数
 * @example
 * ...mapDecorator([
 *  ['demo',config],
 *  ['demo2',{trim:true}],
 *  ])
 * @return {Object} 根据二维数组生成的对象
 */
export const mapDecorator = (arrays) => {
  return arrays.reduce((t, c) => {
    return { ...t, ...CreatedDecorator(...c) }
  }, {})
}
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

/**
 * 表单 金钱工具 用次函数格式化的 传给后端 将会 * 100
 * @param {String} value
 */
export const formMoney = value => { // 此工具 允许负数
  if (value === '-') { // 先判断负数
    return value
  }
  // 用户正在编辑 遇到最后一个数字是 . 就直接返回 由控件二次调用再处理
  if (`${value}`.charAt(`${value}`.length - 1) === '.') {
    return value
  }
  if (Number.isNaN(parseFloat(value))) { // 不是数字类型直接返回
    return 0
  }

  if (`${value}`.includes('e')) { // 不可以有 e
    return 0
  }
  // eslint-disable-next-line no-new-wrappers
  const newValue = new Number(value)
  newValue.toJSON = function () { return Decimal.mul(this, 100).toNumber() }
  return newValue
}
