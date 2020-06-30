<template>
  <a-menu theme="dark" mode="inline" @click="clickMenu">
    <a-sub-menu>
      <span slot="title">
        <i class="iconfont iconshangwuguanli" />
        <span>全屏layout</span>
      </span>
      <a-menu-item key="base_demo">base_demo</a-menu-item>
      <a-menu-item key="base_demo2">base_demo2</a-menu-item>
    </a-sub-menu>
    <a-sub-menu>
      <span slot="title">
        <i class="iconfont iconshangwuguanli" />
        <span>管理平台layout</span>
      </span>
      <a-menu-item key="manager_demo">manager_demo</a-menu-item>
      <a-menu-item key="manager_richText">富文本</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
<script>
export default {
  name: 'SiderMenu',
  methods: {
    clickMenu ({ key }) {
      if (this.$route.name !== key) {
        this.$router.push({ name: key })
      }
    }
  }
}
</script>
<style scoped lang="less">
</style>
