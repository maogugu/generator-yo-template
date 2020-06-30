<template>
  <div>
    <div ref="richText" class="c-4cd3c2 h-300" />
    <a-button type="primary" @click="getData">获取数据</a-button>
  </div>
</template>
<script>
import Quill from 'quill'
// 文本编辑器样式
import 'quill/dist/quill.snow.css'
export default {
  name: 'RichText',
  data () {
    return {
      quill: null

    }
  },
  mounted () {
    this.initQuill()
  },
  methods: {
    initQuill () {
      this.quill = new Quill(this.$refs.richText, {
        placeholder: '请编辑内容',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction
            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ align: [] }],
            ['link', 'image']
          ]
        },
        theme: 'snow'
      })
    },
    getData () {
      console.log(this.quill.root.innerHTML)
    }
  }
}
</script>
<style scoped lang="less">
</style>
