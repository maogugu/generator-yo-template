<template>
  <div id="app">
    <transition>
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  },
  created () {
    // 删除loading
    document.body.removeChild(document.getElementById('loading-init'))
  }
}
</script>
