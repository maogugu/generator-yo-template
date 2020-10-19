import { Form, Row, Col, Input, Select, Button, Icon, DatePicker } from 'ant-design-vue'
import XUserPicker from '../global/XUserPicker'
import _ from 'lodash'
import moment from 'moment'
// eslint-disable-next-line
import styles from './index.less'

const { RangePicker } = DatePicker

const format = (columns, formData) => {
  const formatFormData = {}
  columns.forEach(item => {
    let value = formData[item.fieldName]
    switch (item.type) {
      case 'rangePicker':
        value && (value = value.map(time => (item.valueFormat || time.format) ? time : moment(time)))
        break
      case 'datePicker':
        value && (value = value.format ? value : moment(value))
        break
      default:
    }
    formatFormData[item.fieldName] = value
  })
  return formatFormData
}

const parse = (columns, formData) => {
  const parseFormData = {}
  columns.forEach(item => {
    let value = formData[item.fieldName]
    switch (item.type) {
      case 'rangePicker':
        value && (value = value.map(time => time.format ? time.format(item.format || 'YYYY-MM-DD HH:mm:ss') : time))
        break
      case 'datePicker':
        value && (value = value.format ? value.format(item.format || 'YYYY-MM-DD HH:mm:ss') : value)
        break
      case 'yearPicker':
        value && (value = value.format ? value.format(item.format || 'YYYY') : value)
        break
      default:
    }
    parseFormData[item.fieldName] = value
  })
  return parseFormData
}

const getProps = options => {
  const config = { props: {}, on: {} }
  Object.keys(options).forEach(key => {
    if (key.startsWith('on')) {
      let propsName = key.replace('on', '')
      propsName = `${propsName.slice(0, 1).toLowerCase()}${propsName.slice(1)}`
      config.on[propsName] = options[key]
      return
    }
    config.props[key] = options[key]
  })
  return config
}

const propsConf = {
  columns: {
    type: Array,
    default: () => []
  },
  value: {
    type: Object,
    default: () => ({})
  },
  rowNum: {
    type: Number,
    default: 3
  },
  showRow: {
    type: Number,
    default: 1
  },
  loading: {
    type: Boolean,
    default: false
  },
  toggleExpand: {
    type: Function || null,
    default: null
  },
  searchFormRef: {
    type: Function || null,
    default: null
  },
  changeFormFields: {
    type: Function || null,
    default: null
  },
  changeFormValues: {
    type: Function || null,
    default: null
  },
  resetSearch: {
    type: Boolean,
    default: true
  }
}

const SearchForm = {
  name: 'SearchForm',
  props: propsConf,
  data () {
    return {
      expand: false,
      isOpen: false, // yearPicker弹窗是否打开
      time: '' // yearPicker绑定的值
      // form: this.$form.createForm(this, { name: 'advanced_search' }),
    }
  },
  created () {
  },
  methods: {
    async search () {
      const { errors } = await this.form
        .validateFields()
        .then(res => ({ values: res }))
        .catch(res => res)
      if (errors) return
      let formData = this.form.getFieldsValue()
      formData = parse(this.columns, formData)
      this.$emit('search', formData)
    },
    reset () {
      this.form.resetFields()
      let formData = this.form.getFieldsValue()
      formData = parse(this.columns, formData)
      this.changeFormValues && this.changeFormValues(formData, formData)
      setTimeout(() => {
        this.resetSearch && this.search()
      }, 0)
    },
    toggle () {
      this.expand = !this.expand
      this.toggleExpand && this.toggleExpand(this.expand)
    },
    // 校验规则
    createRules (item) {
      if (item.rules) {
        return item.rules
      }
      if (item.required) {
        const message = `${item.type === 'input' ? '请输入' : '请选择'}${item.label}`
        return [{ required: true, message }]
      }
      return []
    },
    onchangeInput (e) {
      // e.target.value = e?.target?.value.trim() ?? null
    },
    // 元素
    inputContent (conf) {
      const config = { props: { placeholder: '请输入', allowClear: true, ...conf } }
      return (<Input onChange={this.onchangeInput.bind(this)} {...config}/>)
    },
    selectContent ({ data = [], fieldNames = { code: 'code', name: 'name' }, loading = false, ...conf }) {
      let config = getProps(conf)
      config = {
        ...config,
        props: {
          placeholder: '全部',
          allowClear: true,
          showSearch: true,
          notFoundContent: '暂无数据',
          filterOption: (input, option) => (option.componentOptions.propsData.label.toLowerCase().indexOf(input.toLowerCase()) >= 0),
          ...config.props
        }
      }
      return (
        <Select {...config}>
          {!!loading && <Icon slot="suffixIcon" type="loading" />}
          {data.map(item => (
            <Select.Option value={item[fieldNames.code]} key={item[fieldNames.code]} label={item[fieldNames.name]} >
              {item[fieldNames.name]}
            </Select.Option>
          ))}
        </Select>
      )
    },
    rangePickerContent (conf) {
      const config = { props: conf }
      return (<RangePicker getCalendarContainer={triggerNode => triggerNode.parentNode} {...config}></RangePicker>)
    },
    cascaderContent (conf) {
      let config = getProps(conf)
      config = {
        ...config,
        props: {
          placeholder: '全部',
          notFoundContent: '暂无数据',
          allowClear: true,
          showSearch: true,
          filterOption: (input, option) => (option.componentOptions.propsData.label.toLowerCase().indexOf(input.toLowerCase()) >= 0),
          ...config.props
        }
      }
      return (<Cascader getCalendarContainer={triggerNode => triggerNode.parentNode} {...config} onChange={this.handerCascader}></Cascader >)
    },
    datePickerContent (conf) {
      const config = getProps(conf)
      return (<DatePicker class="datePicker" getCalendarContainer={triggerNode => triggerNode.parentNode} {...config}></DatePicker>)
    },
    userPickerContent (conf) {
      const config = getProps(conf)
      return (<XUserPicker {...config} />)
    },
    yearPickerContent (conf) {
      let config = getProps(conf)
      config = {
        ...config,
        props: {
          mode: 'year',
          format: 'YYYY',
          placeholder: '请选择年份',
          ...config.props
        }
      }
      const { fieldName } = conf
      return (<DatePicker
        {...config}
        open={this.isOpen}
        onopenChange={v => (this.isOpen = v)}
        onpanelChange={v => { this.form.setFieldsValue({ [fieldName]: v }); this.isOpen = false }}
        onchange={(this.time = null)}
      />)
    },
    content ({ type, ...conf }) {
      switch (type) {
        case 'input':
          return this.inputContent(conf)
        case 'select':
          return this.selectContent(conf)
        case 'cascader':
          return this.cascaderContent(conf)
        case 'rangePicker':
          return this.rangePickerContent(conf)
        case 'datePicker':
          return this.datePickerContent(conf)
        case 'userPicker':
          return this.userPickerContent(conf)
        case 'yearPicker':
          return this.yearPickerContent(conf)
        default:
          return <span></span>
      }
    },

    handerCascader (value) {
      this.$emit('cascader', value)
    }
  },
  render () {
    // console.log('render searchForm')
    const { getFieldDecorator } = this.form
    const { expand, rowNum, showRow, columns, loading } = this
    return (
      <div class="search-form">
        <Form>
          <Row gutter={48}>
            {columns
              .filter(item => !item.hidden)
              .map((item, index) => {
                const { label, fieldName } = item
                return (
                  <Col
                    span={24 / rowNum}
                    key={fieldName}
                    style={{
                      display: expand || columns.length === rowNum * showRow || index < rowNum * showRow - 1 ? 'block' : 'none'
                    }}
                  >
                    <Form.Item label={label}>
                      {getFieldDecorator(fieldName, {
                        rules: this.createRules(item),
                        initialValue: undefined
                      })(this.content(item))}
                    </Form.Item>
                  </Col>
                )
              })}
            <Col span={24 / rowNum} class="operation">
              <Button type="primary" onClick={this.search} disabled={loading}>查询</Button>
              <Button class="reset" onClick={this.reset} disabled={loading}>重置</Button>
              {columns.length > (rowNum * showRow) && <a class="toggle" onClick={this.toggle}>{expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} /></a>}
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
const WrappedSearchForm = Form.create({
  name: 'WrappedSearchForm',
  mapPropsToFields (props) {
    // console.log('mapPropsToFields')
    const formData = format(props.columns, props.value)
    const form = {}
    Object.keys(formData).forEach(key => {
      form[key] = Form.createFormField({ value: formData[key] })
    })
    return form
  },
  onFieldsChange (props, changedFields, allFields) {
    props.changeFormFields && props.changeFormFields(changedFields, allFields)
  },
  onValuesChange (props, changedValues, allValues) {
    props.changeFormValues && props.changeFormValues(changedValues, allValues)
  }
})(SearchForm)
const DecoratorSearchForm = {
  name: 'DecoratorSearchForm',
  props: propsConf,
  data () {
    return { searchForm: null }
  },
  mounted () {
    this.searchFormRef && this.searchFormRef(this.$refs.searchForm)
  },
  methods: {
    changeFormValuesIn (changedValues, allValues) {
      const formData = parse(this.columns, allValues)
      this.$emit('input', formData)
      this.$emit('select', formData)
      this.changeFormValues && this.changeFormValues(changedValues, formData)
    },
    search (formData) {
      this.$emit('search', formData)
    }
  },
  render () {
    // console.log('render WrappedSearchForm')
    const config = { props: _.pick(this, ['columns', 'value', 'rowNum', 'showRow', 'loading', 'changeFormFields', 'resetSearch']), on: {} }
    config.props.changeFormValues = this.changeFormValuesIn
    config.on.search = this.search
    return (<WrappedSearchForm ref="searchForm" {...config} />)
  }
}
export default DecoratorSearchForm
