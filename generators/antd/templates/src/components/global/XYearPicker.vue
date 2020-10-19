<script>
/**
 * @displayName XYearPicker
 * <b>依赖于ant date-picker 所有属性都可merge</b><br/>
 * @example
 * <XYearPicker v-model="xxx" :allowClear="xxx"/>
 *
 */
import moment from 'moment'
import { DatePicker } from 'ant-design-vue'
import { isString, isNumber, isFunction } from 'lodash'

export default {
  name: 'XYearPicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    /**
     * @model
     * v-model覆盖默认时间
     * 类型为 string number
     */
    value: {
      type: null,
      required: true,
      validator: _ => isString(_) || isNumber(_) || _ === null
    },
    /**
     * 默认不可清楚，传一个Boolean
     */
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    yearValue: {
      get () {
        return this.value ? moment(`${this.value}`) : null
      },
      set (newVal) {
        if (newVal) {
          const str = newVal.format('YYYY')
          this.$emit('change', isString(this.value) ? str : Number(str))
        } else {
          this.$emit('change', null)
        }
      }
    }
  },
  methods: {
    controlPanel (v) {
      this.isOpen = v
    },
    selectYear (v) {
      this.yearValue = v
      this.isOpen = false
    },
    changeYear () {
      this.yearValue = null
    }
  },
  render () {
    const on = {
      ...this.$listeners,
      openChange: this.controlPanel,
      panelChange: this.selectYear,
      change: this.changeYear
    }
    const props = {
      ...this.$attrs,
      mode: 'year',
      format: 'YYYY',
      placeholder: '请选择年份',
      value: this.yearValue,
      allowClear: this.allowClear,
      open: this.isOpen
    }
    // 对获取外部插槽
    const slots = Object.keys(this.$scopedSlots).map(slot => {
      const vnode = this.$scopedSlots[slot]
      return (
        <template slot={slot}>{ isFunction(vnode) ? vnode() : vnode }</template>
      )
    })
    return (
      <DatePicker
        props={props}
        on={on}
        scopedSlots={ this.$scopedSlots }
      >
        {slots}
      </DatePicker>
    )
  }
}
</script>
