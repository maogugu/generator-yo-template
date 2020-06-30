<template>
  <div>
    <router-view />
    <van-tabbar v-model="active">
      <van-tabbar-item
        v-for="(item, index) in tabList"
        :key="index"
        :to="{name:item.routerName}"
      >
        <span class="fs-10">{{ item.name }}</span>
      </van-tabbar-item>
    </van-tabbar>
    <van-number-keyboard safe-area-inset-bottom />
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: null,
      tabList: [
        { routerName: 'tab_home', name: '首页' },
        { routerName: 'tab_my', name: '我的' }
      ]
    }
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler (n, o) {
        this.active = this.tabList.findIndex(row => n.name === row.routerName)
      }
    }
  }
}
</script>
<style lang="less">

</style>
