<template>
  <div class="home p-24 w-100p">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人" />
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <x-table
      ref="table"
      v-loading="loadingTable"
      border
      hide-on-single-page
      :data="tableData"
      @getData="getTableData"
    >
      <el-table-column v-for="item of cols" :key="item.id" v-bind="item" />
    </x-table>
  </div>
</template>

<script>
import { uniqueId, random } from 'lodash'
import { loading, debounceFnStart } from '@/decorator'
import { getDictList } from '@/dicts'
import { uuid } from '@/utils'

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
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      cols: [{
        prop: 'name',
        label: '日期',
        width: '180'
      },
      {
        prop: 'age',
        label: '姓名'
      }
      ],
      loadingTable: false,
      tableData: []
    }
  },
  created () {
    console.log('获取字典', getDictList('type'))
  },
  methods: {
    search () {
      this.$refs.table.search()
    },
    @debounceFnStart()
    @loading('loadingTable')
    async getTableData () {
      const params = { ...this.formInline, ...this.$refs.table.getValues() }
      console.log('传给后端的数据', JSON.stringify(params, null, '\t'))
      this.tableData = await mockData(params)
      this.$refs.table.setTotal(11)
    },
    resetTable () {
      this.form.resetFields()
      this.$refs.table.reset()
    }
  }
}
</script>
