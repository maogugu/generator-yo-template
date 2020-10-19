<script>
import { isFunction } from 'lodash'
// 提交事件 重新获取数据
export default {
  name: 'XTable',
  props: {
    /**
     * 覆盖默认配置
     */
    pagination: {
      type: Object,
      default: () => ({})
    },
    /**
     * 单页不足时 是否隐藏分页器
     */
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },
    /**
     * 是否执行初始化
     */
    init: {
      type: Boolean,
      default: true
    },
    /**
     * pageNum 重命名
     */
    pageNum: {
      type: String,
      default: 'pageNum'
    },
    /**
     * pageSize 重命名
     */
    pageSize: {
      type: String,
      default: 'pageSize'
    },
    /**
     * 表格 样式
     */
    tableClass: {
      type: String,
      default: ''
    },
    /**
     * 分页器样式
     */
    paginationClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      paginationConfig: {
        pageSizes: [10, 20, 30, 40, 50, 100],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        layout: 'total, prev, pager, next,sizes,jumper'
      }
    }
  },
  watch: {
    pagination: {
      immediate: true,
      deep: true,
      // 覆盖默认配置
      handler (obj) {
        this.paginationConfig = { ...this.paginationConfig, ...obj }
      }
    }
  },
  mounted () {
    // 是否执行初始化
    if (this.init) {
      this.$emit('getData')
    }
  },

  methods: {
    /**
     * 向外暴露 reset 重置表格
     */
    reset () {
      this.paginationConfig.currentPage = 1
      this.paginationConfig.pageSize = this.pagination?.pageSize ?? this.$options.data().paginationConfig.pageSize
      this.$emit('getData')
    },
    /**
     * 向外暴露 setTotal 传入total
     */
    setTotal (value) {
      this.paginationConfig.total = value
    },
    /**
     * 设置 pageNum 触发 getData
     * @public
     */
    setPageNum (num) {
      this.paginationConfig.pageNum = num
      this.$emit('getData')
    },
    /**
     * 设置 pageSize 触发 getData
     * @public
     */
    setPageSize (num) {
      this.paginationConfig.currentPage = num
      this.$emit('getData')
    },
    /**
     * 搜索 会将页面设置到第一页 触发 getData
     * @public
     */
    search () {
      this.paginationConfig.currentPage = 1
      this.$emit('getData')
    },
    /**
     * 返回重命名后的分页参数
     */
    getValues () {
      return {
        [this.pageNum]: this.paginationConfig.currentPage,
        [this.pageSize]: this.paginationConfig.pageSize
      }
    },
    /**
      * 改变页数
      * 改变排序条件
      * 回到第一页
      */
    sizeChange (pageSize) {
      this.paginationConfig.currentPage = 1
      this.paginationConfig.pageSize = pageSize
      this.$emit('getData')
    },
    // 页数改变
    currentChange (currentPage) {
      this.paginationConfig.currentPage = currentPage
      this.$emit('getData')
    }
  },

  render () {
    // 对change 事件进行覆盖
    const on = { ...this.$listeners }
    // 引入未覆盖的属性 留作扩展
    const props = { ...this.$attrs }
    // 对获取外部插槽
    const slots = Object.keys(this.$scopedSlots).map(slot => {
      const vnode = this.$scopedSlots[slot]
      return (<template slot={slot}>{ isFunction(vnode) ? vnode() : vnode  }</template>)
    })
    const paginationProps = { ...this.paginationConfig }
    const paginationOn = { 'size-change': this.sizeChange, 'current-change': this.currentChange }
    return (
      <div>
        <el-table
          props={ props }
          on={ on }
          scopedSlots={ this.$scopedSlots }
          class={this.tableClass}
        >
          {slots}
        </el-table>
        {
          (this.paginationConfig.hideOnSinglePage && this.paginationConfig.total <= this.paginationConfig.pageSize)
            ? ''
            : <el-pagination class={'m-t-16 ' + this.paginationClass} props={ paginationProps } on={ paginationOn }/>
        }
      </div>
    )
  }
}
</script>
<style scoped lang="less">
// 自己的项目关掉
// .m-t-16{
//   margin-top: 16px;
// }
/deep/ .el-pagination{
  display: flex;
}
/deep/ .el-pagination__total {
  flex: 1
}
</style>
