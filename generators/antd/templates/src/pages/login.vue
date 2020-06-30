<template>
  <div class="h-500 m-t-100 text-center">
    <a-spin tip="登录中..." />
  </div>
</template>

<script>
import { SuccessMessage } from '@/utils/antdvUtils'
import { session, uuid } from '@/utils'

export default {
  data () {
    return {}
  },
  created () {
    setTimeout(() => {
      this.login()
    }, 1500)
  },
  mounted () {

  },
  methods: {
    async login () {
      session.setSession('token', uuid())
      SuccessMessage('模拟登录 login.vue line:26')
      this.$router.push({ name: 'manager_demo' })
    }
  }
}
</script>
