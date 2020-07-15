<template>
  <a-layout class="h-100vh">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo bg-red m-16 h-32">
        <p class="lh-32 text-center text-fff fs-24">此处是logo</p>
      </div>
      <sider-menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="bg-fff p-0">
        <a-icon
          class="fs-18 p-x-24 cursor-pointer text-hover-blue"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="toggleCollapsed"
        />
      </a-layout-header>
      <a-layout-content>
        <div :class="$route.meta.full === true ? '' : 'p-24'" class="h-100p">
          <router-view :key=" $route.path" class="bg-fff" />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import SiderMenu from '@/components/SiderMenu'

export default {
  name: 'BaseLayout',
  components: {
    SiderMenu
  },
  data () {
    return {
      collapsed: false
    }
  },
  methods: {
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style lang="less" scoped>

</style>
