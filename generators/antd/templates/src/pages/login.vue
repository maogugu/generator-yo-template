<template>
  <div class="h-500 m-t-100 text-center">
    <a-spin tip="登录中..." />
  </div>
</template>

<script>
import { SuccessMessage } from '@/utils/antdvUtils'
import { session, uuid } from '@/utils'
import { SESSIONID, BACK_ROUTE, USER_INFO } from '@/utils/constant'
import { requestAuthCodeForRuntime } from '@/utils/ddApi'

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
      session.setSession(SESSIONID, uuid())
      SuccessMessage('模拟登录 login.vue line:26')
      this.$router.push({ name: 'manager_demo' })
      return null
      //  正式使用 将上面与注释删除
      // eslint-disable-next-line no-unreachable
      const { code } = await requestAuthCodeForRuntime()
      const userInfo = await this.$apis.login({ code })
      session.setSession(USER_INFO, userInfo)
      const backRoute = session.getSession(BACK_ROUTE)
      if (!backRoute) {
        this.$router.push({ name: 'manager_welcome' })
      } else {
        session.destroy(BACK_ROUTE)
        this.$router.push(backRoute)
      }
    }
  }
}
</script>
