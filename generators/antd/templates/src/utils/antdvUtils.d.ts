/** 成功的防抖提示 */
declare function SuccessMessage(msg: string): void

/** 警告的防抖提示 */
declare function WarningMessage(msg: string): void

/** 错误的防抖提示 */
declare function ErrorMessage(msg: string): void

interface decoratorConfig {
  /** 是否需要 trim 默认不可trim 有些组件类型 不是 element 没有 e.target */
  trim ? : boolean,
    /** 是否必须 */
    required ? : boolean,
    /** 必须的提示文字 */
    requiredMsg ? : string
  /** 支持的类型  见官网 */
  type ? : any,
    /** 最小字数 */
    min ? : number
  /** 最大字数 */
  max ? : number
  /** 自定义的规则 */
  rules ? : any[]
  /** 自定义的options */
  options ? : any[],
    /** 值的重写函数 与trim 互斥 */
    getValueFromEvent ? : (value: HTMLElement | string) => string
}

/**
 * 
 * @param name  字段名
 * @param config 配置
 */
declare function CreatedDecorator(name: string, config: decoratorConfig): object

/**
 * 
 * @param config 配置用二维数组
 */
declare function mapDecorator(config: [string, decoratorConfig][]): object

interface paginationConfig {
  /** 页面分页器数组 */
  pageSizeOptions ? : number[]
  /** 当前页数 */
  current ? : number
  /** 每页个数 */
  pageSize ? : number
  /** 显示sizeChanger */
  showSizeChanger ? : boolean
  /** 显示快速跳转 */
  showQuickJumper ? : boolean
  /** 只有一页是否隐藏分页 */
  hideOnSinglePage ? : boolean,
    /** 是否初始化加载数据 默认false */
    init ? : boolean
}

interface paginationObject extends paginationConfig {
  /** 设置总页数 */
  setTotal(value: number)
  /** 重置分页参数并重新获取数据 */
  initData(): void
  /** 获取分页器的值 */
  getValues(getConfig ? : getValueConfigInterface)
}

interface getValueConfigInterface {
  /** 当前页名 */
  pageNum ? : string
  /** 当前大小名 */
  pageSize ? : string
  /** 字段名 */
  sortField ? : string
  /** 排序方式名 */
  sortType ? : string
}
/**
 * @param getData 获取数据的函数 自行bind(this)
 * @param config 对配置的修改
 * 自动处理分页
 */
declare function paginTool(getData: Function, config ? : paginationConfig): paginationObject

export {
  SuccessMessage,
  WarningMessage,
  ErrorMessage,
  Pagination,
  CreatedDecorator,
  mapDecorator,
  paginTool
}
