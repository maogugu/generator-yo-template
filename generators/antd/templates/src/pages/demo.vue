<template>
  <div class="home p-24">
    <a-button @click="confirmA">Util confirm</a-button>
    <a-button @click="confirmB">decorator confirm</a-button>
    <h3 class="c-link-80 border-1 border-y-1 border-c-red p-l-2rem">颜色在gloableColors.json 中配置</h3>
    <h3 class="c-link-80 m-x-30 m-t-1p">css将会根据 class 规则自动生成 如 m-x-30 m-t-10vw</h3>
    <search-form
      v-model="formData"
      :columns="formColumns"
      :loading="loadingTable"
      @search="search"
    />
    <x-table
      ref="table"
      :columns="columns"
      :data-source="tableData"
      :loading="loadingTable"
      sort-type="排序类型"
      @getData="getTableData"
    >
      <template #age="hahah">{{ hahah }}内嵌模板测试</template>
    </x-table>
  </div>
</template>

<script>
import { uniqueId, random } from 'lodash'
import { loading, debounceFnStart, confirm } from '@/decorator'
import { getDictList } from '@/dicts'
import { uuid } from '@/utils'
import { AntdUtils } from '../utils/antdvUtils'
import SearchForm from '@/components/SearchForm'

function mockData ({ pageSize }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Array(pageSize).fill(1).map(x => ({
        key: uniqueId(),
        name: 'John Brown',
        age: random(10, 50),
        address: uuid(),
        tags: ['nice', 'developer']
      })))
    }, 300)
  })
}

export default {
  name: 'Home',
  components: {
    SearchForm
  },
  data () {
    return {
      type: true,
      formData: { },
      formColumns: [
        { type: 'input', label: '字段1', fieldName: 'ss1' },
        { type: 'rangePicker', label: '字段2', fieldName: 'rangeDate', valueFormat: 'YYYY-MM-DD' },
        { type: 'input', label: '字段3', fieldName: 'ss3' },
        { type: 'input', label: '字段4', fieldName: 'ss4' },
        { type: 'input', label: '字段5', fieldName: 'ss5' },
        { type: 'userPicker', label: '选人', fieldName: 'ss6' },
        {
          type: 'userPicker',
          label: '组织',
          fieldName: 'orgList',
          inType: 'departments',
          placeholder: '全部',
          multiple: false,
          fieldNames: { label: 'orgName', key: 'orgId' }
        }
      ],
      loadingTable: false,
      columns: [
        { title: 'name', dataIndex: 'name', sorter: true },
        { title: 'Age', dataIndex: 'age', scopedSlots: { customRender: 'age' } },
        { title: 'Address', dataIndex: 'address' },
        { title: 'Tags', dataIndex: 'tags' }],
      tableData: []
    }
  },
  created () {
    console.log('获取字典', getDictList('type'))
  },
  methods: {
    @debounceFnStart()
    @loading('loadingTable')
    async getTableData () {
      const params = { ...this.form, ...this.$refs.table.getValues() }
      console.log('传给后端的数据', JSON.stringify(params, null, '\t'))
      this.tableData = await mockData(params)
      this.$refs.table.setTotal(200)
    },
    search () {
      this.$refs.table.search()
    },
    resetTable () {
      this.formData = this.$options.data().formData
      this.$refs.table.reset()
    },
    async confirmA () {
      await AntdUtils.confirm('通过await 进行控制 此处可写变量')
      alert('进入了下一步')
    },
    @confirm({ title: 'isObject', okType: 'primary' })
    confirmB () {
      this.type = !this.type
    }
  }
}
</script>
