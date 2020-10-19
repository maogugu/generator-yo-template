<template>
  <a-select
    style="width:278px"
    label-in-value
    :options="options"
    :value="selected"
    :placeholder="placeholder"
  >
    <template #dropdownRender>
      <div>
        <div class="ant-calendar-header" @mousedown.prevent="">
          <div class="position-relative">
            <a title="上一年 (Control键加左方向键)" class="ant-calendar-prev-year-btn" @click="preYear" />
            <span class="ant-calendar-ym-select" @click="changeYeaer">
              <a role="button" title="选择年份" class="ant-calendar-year-select"> {{ year }} </a>
            </span>
            <a title="下一年 (Control键加右方向键)" class="ant-calendar-next-year-btn" @click="nextYear" />
          </div>
        </div>
        <div v-if="selectYear" class="ant-calendar-year-panel-body">
          <table cellspacing="0" role="grid" class="ant-calendar-year-panel-table">
            <tbody class="ant-calendar-year-panel-tbody">
              <tr v-for="(item,i) of yearList" :key="i">
                <td
                  v-for="(yearNum,j) of item"
                  :key="yearNum"
                  class="ant-calendar-year-panel-cell p-y-8"
                  :class="calendarTdClass(i,j)"
                  @click="pickYear(i,j,yearNum)"
                  @mousedown.prevent=""
                >
                  <a class="ant-calendar-year-panel-year">{{ yearNum }}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="flex-around-center w-100p flex-wrap-wrap p-8 fs-16">
          <a-row>
            <a-col
              v-for="item of quatreList"
              :key="item.value"
              :span="span"
              class="text-center select-none p-y-8"
              :disabled="item.disabled"
              :class="item.disabled ? 'c-000-25 cursor-not-allowed' : 'c-000-65 c-hover-000-85 cursor-pointer'"
              @click="setSelected(item)"
              @mousedown="mouseDown(item,$event)"
            >
              {{ item.label }}
            </a-col>
          </a-row>
        </div>
      </div>
    </template>
  </a-select>
</template>
<script>
/**
 * @displayName XQuartePicker
 */
export default {
  name: 'XQuartePicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    placeholder: {
      type: String,
      default: '请选择季度'
    },
    /**
     * 选年列数
     */
    colNum: {
      type: Number,
      default: 3
    },
    /**
     * 选年行数
     */
    rowNum: {
      type: Number,
      default: 4
    },
    /**
     * v-model { "label": "2024年第四季度", "value": 4, "year": 2024 }
     */
    value: {
      type: Object,
      default: () => ({})
    },
    /**
     * 季度选择列表，可以按需求更换，例如学期等，格式：{label , value}
     * 以下均以季度为参考
     */
    optionList: {
      type: Array,
      default: () => ([
        { label: '第一季度', value: 1 },
        { label: '第二季度', value: 2 },
        { label: '第三季度', value: 3 },
        { label: '第四季度', value: 4 }
      ])
    },
    /**
     * 季度选择列表所占span，默认12。和a-col的span一样
     */
    span: {
      type: Number,
      default: 12
    },
    /**
     * @function
     * 控制不可选的项，true不可选，false可选，返回下面两个参数
     * {label, value, disabled}, 年份
     * label: 季度, value: 对应的值， disabled: 是否可选
     */
    disabledFn: {
      type: Function,
      default: () => false
    }
  },
  data () {
    return {
      selectYear: false,
      pickYearLocation: [0, 1],
      selected: undefined,
      quatreList: [],
      options: [],
      yearList: [],
      year: new Date().getFullYear()
    }
  },
  computed: {
    calendarTdClass () {
      return (i, j) => {
        if (i === j && i === 0) {
          return 'ant-calendar-year-panel-last-decade-cell'
        }
        if (i === this.rowNum - 1 && j === this.colNum - 1) {
          return 'ant-calendar-year-panel-next-decade-cell'
        }
        const [x, y] = this.pickYearLocation
        if (x === i && y === j) {
          return 'ant-calendar-year-panel-selected-cell'
        }
        return ''
      }
    }
  },
  watch: {
    optionList: {
      immediate: true,
      handler (val) {
        this.quatreList = val
        this.setDisabled()
      }
    }
  },
  created () {
    this.changeYearList(new Date().getFullYear() - 1)
  },
  methods: {
    pickYear (i, j, year) {
      // go back
      const [x, y] = this.pickYearLocation
      if (i === j && j === 0) {
        this.changeYearList(year - (this.rowNum * this.colNum) + 2)
        this.year = this.yearList[x][y]
        return null
      }
      // go next
      if (i === this.rowNum - 1 && j === this.colNum - 1) {
        this.changeYearList(year - 1)
        this.year = this.yearList[x][y]
        return null
      }
      this.pickYearLocation = [i, j]
      this.year = year
      this.selectYear = false
    },
    /**
     * @param preYear now year -1
     */
    changeYearList (preYear) {
      if (preYear < 1970) {
        preYear = 1970
      }
      this.yearList = Array(this.rowNum)
        .fill()
        .reduce((t, c, i) => [
          ...t,
          Array(this.colNum)
            .fill()
            .map((_, j) => preYear + (i * this.colNum) + j)], [])
    },
    changeYeaer () {
      this.selectYear = true
    },
    mouseDown ({ disabled }, e) {
      if (disabled === true) {
        e.preventDefault()
      }
    },
    setSelected ({ label, value, disabled }) {
      if (disabled === true) {
        return null
      }
      const params = { label: `${this.year}年${label}`, value, year: this.year }
      this.options = [params]
      this.selected = params
      this.$emit('change', params)
    },
    setDisabled () {
      this.quatreList = this.quatreList.map(_ => ({
        ..._,
        disabled: this.disabledFn(_, this.year)
      }))
    },
    preYear () {
      this.year--
      this.setDisabled()
    },
    nextYear () {
      this.year++
      this.setDisabled()
    }
  }
}
</script>
<style scoped lang="less">
</style>
