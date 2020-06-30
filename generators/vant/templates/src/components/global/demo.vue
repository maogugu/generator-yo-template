<template>
  <div>这里是 demo测试  需要props test Object  不传 测试控制台报错</div>
</template>
<script>
export default {
  name: 'Demo',
  props: {
    test: {
      type: Object,
      required: true
    }
  },
  methods: {}
}
</script>
<style scoped lang="less">
</style>
