<template>
  <div class="h-500 m-t-100 text-center">
    <!-- <van-loading type="spinner" /> -->
    <van-button type="primary" @click="login">模拟登陆</van-button>
  </div>
</template>

<script>
import { SuccessMessage } from '@/utils/vantUtils'
import { session, uuid } from '@/utils'

export default {
  data () {
    return {}
  },
  created () {

  },
  mounted () {

  },
  methods: {
    async login () {
      session.setSession('token', uuid())
      const backRoute = session.getSession('backRoute')
      if (!backRoute) {
        this.$router.push({ name: 'tab_home' })
        // todo
      } else {
        session.destroy('backRoute')
        this.$router.push(backRoute)
      }
      SuccessMessage('模拟登录 login.vue line:26')
      // this.$router.push({ name: 'tab_home' })
    }
  }
}
</script>
