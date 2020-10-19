<!--
 * @Description: 选择人和部门 或者 部门 ddJsApi complex/departments封装
 *                @params label     【String】'请选择': 选择框文案
 *                       title      【String】'选择': 弹框title文案
 *                       value      【Array】 []:绑定的值v-model
 *                       fieldNames 【Object】{label:'label', key:'key'}: value绑定的字段名称
 *                       type       【String】'complex': complex选择人和部门、departments选择部门
 *                       multiple   【Boolean】true: false 单选 | true 多选
 *                       extraConf  【Object】{}:ddJsApi配置项
 *                @example <x-user-picker v-model="users">
 *                        users:[{label,key}]
 * @Autor: cd
 * @Date: 2020-06-19 11:49:56
 * @LastEditors: cd
 * @LastEditTime: 2020-08-04 16:16:46
-->
<style scoped type='text/less' lang="less">
  .c-complex-picker{
    position: relative;
    font-size: 12px;
  }
  .c-complex-picker-multiple {
    .add{
      width:58px;
      line-height:20px;
      background:rgba(255,255,255,1);
      border-radius:4px;
      border:1px dashed rgba(217,217,217,1);
      color: #666;
      text-align: center;
      cursor:pointer;
      position: absolute;
      left:12px;
      top:8px;
      z-index:1;
      span:first-child{
        margin-right:4px;
      }
    }
    /deep/.ant-select-selection__rendered{
      padding-left:78px;
      margin-left: 0;
      margin-right: 0;
    }
    /deep/.ant-select-selection--multiple .ant-select-selection__choice{
      font-size:12px;
      height:22px;
      line-height:20px;
      margin-top:4px;
      margin-right:8px;
    }
  }
</style>

<template>
  <div :class="['c-complex-picker', multiple ? 'c-complex-picker-multiple' : ''].join(' ')" @click="click">
    <div v-if="multiple" class="add" @click="selectUsers"><span>+</span><span>请选择</span></div>
    <a-select
      v-model="currentValue"
      :class="selectClass"
      v-bind="$attrs"
      :placeholder="multiple ? '' : placeholder"
      :mode="multiple ? 'multiple' : 'default'"
      label-in-value
      allow-clear
      @change="change"
    >
      <div slot="dropdownRender" />
    </a-select>
  </div>
</template>

<script>
import { complexPicker, departmentsPicker } from '@/utils/ddApi'
export default {
  name: 'XUserPicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    selectClass: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '请选择'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    title: {
      type: String,
      default: '选择'
    },
    value: {
      type: Array,
      default: () => []
    },
    fieldNames: {
      type: Object,
      default: () => ({ label: 'label', key: 'key' })
    },
    type: { // 调用通讯录类型：'complex':人员和部门，'departments':选择部门
      type: String,
      default: 'complex'
    },
    inType: { // 调用通讯录类型：'complex':人员和部门，'departments':选择部门
      type: String,
      default: ''
    },
    multiple: { // 是否多选
      type: Boolean,
      default: true
    },
    maxUsers: {
      type: Number,
      default: 100
    },
    extraConf: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      currentValue: this.formatValue(this.value)
    }
  },
  watch: {
    value (n, o) {
      this.currentValue = this.formatValue(n)
    }
  },
  methods: {
    // currentValue
    formatValue (value = []) {
      return value.map(item => ({
        label: item[this.fieldNames.label],
        key: item[this.fieldNames.key]
      }))
    },
    formatValue1 (value = [], type) {
      return value.map(item => ({
        label: item.name,
        key: type === 'complex' ? item.emplId : item.id
      }))
    },
    // value
    paserValue (value = []) {
      return value.map(item => ({
        [this.fieldNames.key]: item.key,
        [this.fieldNames.label]: item.label
      }))
    },
    async selectUsers () {
      const selectedId = this.currentValue.map(item => String(item.key))
      const type = this.inType || this.type
      let data = []
      if (type === 'complex') {
        ({ users: data = [] } = await complexPicker({
          title: this.title,
          multiple: this.multiple,
          pickedUsers: selectedId,
          maxUsers: this.maxUsers,
          responseUserOnly: true,
          ...this.extraConf
        }))
      } else {
        ({ departments: data = [] } = await departmentsPicker({
          title: this.title,
          multiple: this.multiple,
          maxUsers: this.maxUsers,
          pickedDepartments: selectedId,
          responseUserOnly: true,
          ...this.extraConf
        }))
      }
      this.currentValue = this.formatValue1(data, type)
      this.$emit('change', this.paserValue(this.currentValue))
    },
    change (value) {
      this.$emit('change', this.paserValue(value))
    },
    click () {
      if (!this.multiple) {
        this.selectUsers()
      }
    }
  }
}
</script>
