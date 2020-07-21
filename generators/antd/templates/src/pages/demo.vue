<template>
  <div class="home p-24">
    <a-button @click="confirmA(1,2,3,4,5,6)">confirm string</a-button>
    <a-button @click="confirmB">confirm object</a-button>
    <h3 class="c-link-80 border-1 border-y-1 border-c-red p-l-2rem">颜色在gloableColors.json 中配置</h3>
    <h3 class="c-link-80 m-x-30 m-t-1p">css将会根据 class 规则自动生成 如 m-x-30 m-t-10vw</h3>
    <a-form-model
      ref="form"
      layout="inline"
      class="searchForm m-b-16"
      :model="form"
    >
      <a-form-model-item
        label="搜索1"
        prop="ss1"
        colon
        class="m-b-16"
      >
        <a-input v-model.trim="form.ss1" placeholder="请输入" class="w-17vw" />
      </a-form-model-item>
      <a-form-model-item
        label="搜索2"
        prop="ss2"
        colon
        class="m-b-16"
      >
        <a-input v-model.trim="form.ss2" placeholder="请输入" class="w-17vw" />
      </a-form-model-item>
      <a-form-model-item
        label="搜索3"
        prop="ss3"
        colon
        class="m-b-16"
      >
        <a-input v-model.trim="form.ss3" placeholder="请输入" class="w-17vw" />
      </a-form-model-item>
      <a-form-model-item
        label="搜索4"
        prop="ss4"
        colon
        class="m-b-16"
      >
        <a-input v-model.trim="form.ss4" placeholder="请输入" class="w-17vw" />
      </a-form-model-item>
      <a-form-model-item
        label="搜索5"
        prop="ss5"
        colon
        class="m-b-16"
      >
        <a-date-picker v-model="form.ss5" class="w-17vw" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" :loading="loadingTable" @click="search">
          查 询
        </a-button>
        <a-button :loading="loadingTable" @click="resetTable">
          重 置
        </a-button>
      </a-form-model-item>
    </a-form-model>
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
      type: true,
      form: {
        ss1: '',
        ss2: '',
        ss3: '',
        ss4: '',
        ss5: null
      },
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
      await this.$refs.form.validate()
      const params = { ...this.form, ...this.$refs.table.getValues() }
      console.log('传给后端的数据', JSON.stringify(params, null, '\t'))
      this.tableData = await mockData(params)
      this.$refs.table.setTotal(200)
    },
    search () {
      this.$refs.table.search()
      // 两个方法相同
      // this.$refs.table.setPageSize(1)
    },
    resetTable () {
      this.$refs.form.resetFields()
      this.$refs.table.reset()
    },
    @confirm('is string')
    confirmA (...args) {
      console.log(...args)
    },
    @confirm({ title: 'isObject', okType: 'primary' })
    confirmB () {
      this.type = !this.type
    }
  }
}
</script>
