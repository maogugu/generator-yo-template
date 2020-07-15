<script>
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
      default: 'currPage'
    },
    /**
     * pageSize 重命名
     */
    pageSize: {
      type: String,
      default: 'pageSize'
    },
    /**
     * sortField 重命名
     */
    sortField: {
      type: String,
      default: 'sortField'
    },
    /**
     * sortType 重命名
     */
    sortType: {
      type: String,
      default: 'sortType'
    },
    /**
     * 分页是否between显示
     */
    betweenPagination: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      paginationConfig: {
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
    }
  },
  watch: {
    pagination: {
      immediate: true,
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
     * 接管change事件
     */
    change ({ current, pageSize }, filters = {}, { field = null, order = null } = {}) {
      const sortType = order?.slice(0, order.length - 3) ?? null
      /**
       * 改变页数
       * 改变排序条件
       * 回到第一页
       */
      const backOne = [
        this.paginationConfig.pageSize !== pageSize,
        this.paginationConfig.sortField !== field,
        this.paginationConfig.sortType !== sortType
      ].some(_ => _)
      if (backOne) {
        this.paginationConfig.current = 1
      } else {
        this.paginationConfig.current = current
      }
      this.paginationConfig.pageSize = pageSize
      this.paginationConfig.sortField = field ?? null
      this.paginationConfig.sortType = sortType
      this.$emit('getData')
    },
    /**
     * 向外暴露 reset 重置表格
     */
    reset () {
      this.paginationConfig.current = 1
      this.paginationConfig.pageSize = 10
      this.$emit('getData')
    },
    /**
     * 向外暴露 setTotal 传入total
     */
    setTotal (value) {
      this.paginationConfig.total = value
    },
    /**
     * 返回重命名后的分页参数
     */
    getValues () {
      return {
        [this.pageNum]: this.paginationConfig.current,
        [this.pageSize]: this.paginationConfig.pageSize,
        [this.sortField]: this.paginationConfig.sortField ?? null,
        [this.sortType]: this.paginationConfig.sortType ?? null
      }
    }
  },

  render () {
    // 对change 事件进行覆盖
    const on = { ...this.$listeners, change: this.change }
    // 引入未覆盖的属性 留作扩展
    const props = { ...this.$attrs, pagination: this.paginationConfig }
    // 对获取外部插槽
    const slots = Object.keys(this.$scopedSlots).map(slot => {
      return (<template slot={slot}>{ this.$scopedSlots[slot] }</template>)
    })
    return (
      <a-table
        class={this.betweenPagination ? 'between-pagination' : ''}
        props={props}
        on={on}
        scopedSlots={ this.$scopedSlots }
      >
        {slots}
      </a-table>
    )
  }
}
</script>
<style scoped lang="less">
.between-pagination /deep/ .ant-table-pagination.ant-pagination{
  display: flex;
  width: 100%;
  float: none;
}
.between-pagination /deep/ .ant-pagination-total-text{
  flex:1;
  color:rgba(0, 0, 0, .45)
}
</style>
