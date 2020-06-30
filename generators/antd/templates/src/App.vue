<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <transition>
        <router-view />
      </transition>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
export default {
  name: 'App',
  data () {
    return {
      zhCN
    }
  }
}
</script>
