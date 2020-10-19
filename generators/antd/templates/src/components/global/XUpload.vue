<script>
import { ErrorMessage } from '@/utils/antdvUtils'
import { uniqBy, isFunction } from 'lodash'
/**
 * 上传文件组件
 * <br>
 * <upload-file :show-upload-list="false" @finish="procureUpFinish" >
 * <br> 继承a-upload
 * @displayName XUpload
 */
export default {
  name: 'XUpload',
  props: {
    /**
     *
     */
    accept: {
      type: String,
      default: ''
    },
    /**
     * 最多可上传几个
     */
    max: {
      type: Number,
      default: Infinity
    },
    /**
     * 上传前的函数 返回 true or false false则中断
     */
    beforeUpload: {
      type: Function,
      default: () => true
    },
    /**
     * 上传函数
     * @example
     * :uploadFn="$apis.demo" 或不写
     */
    uploadFn: {
      type: [Function, String],
      default: null
    },
    /**
     * 传递file 自行判断是否可以删除
     */
    canDel: {
      type: Function,
      default: () => true
    },
    /**
     * 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
     */
    listType: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      localFileList: [],
      visiblePreview: false
    }
  },
  computed: {
    upFn () {
      return isFunction(this.uploadFn) ? this.uploadFn : this.$apis.uploadFile
    }
  },
  methods: {
    localBefore (file) {
      if (Infinity !== this.max && this.localFileList.length >= this.max) { // 限制上传次数
        ErrorMessage(`超出上传限制,最多允许上传${this.max}个 ${this.max} / ${this.localFileList.length}`)
        return false
      }
      return this.beforeUpload(file) // 用户逻辑
    },
    previewFn ({ thumbUrl, uid }) {
      this.visiblePreview = true
      const index = this.localFileList.findIndex(_ => _.uid === uid)
      this.$nextTick(() => {
        this.$refs.carousel.goTo(index, true)
      })
    },
    previewCancel () {
      this.visiblePreview = false
    },
    async upload (options) {
      const file = options.file
      try {
        const res = await this.upFn(file, options.onProgress)
        options.onSuccess(true)
        /**
         * 上传完成事件 (res,fileList)=>{}
         * @property {Any} res 后台返回数据 如果为null 则是删除或者上传失败
         * @property {Array} fileList 当前文件数组
         */
        this.$emit('finish', res, this.localFileList)
      } catch (error) {
        options.onError(true)
        this.localFileList = this.localFileList.filter(({ error }) => !error)
        this.$emit('finish', null, this.localFileList)
      } finally {
      }
    },
    removeFile (file) {
      const doDel = this.canDel(file)
      if (doDel) { // 可以删除
        this.localFileList = this.localFileList.filter(x => x.uid !== file.uid)
        this.$emit('finish', null, this.localFileList) // null 是被删除的
      }
      return doDel
    },
    handelChange (info) {
      if (info.fileList.length > this.max) {
        ErrorMessage(`超出上传限制,最多允许上传${this.max}个`)
        throw new Error('超出上传限制')
      }
      if (this.max > this.localFileList.length) {
        this.localFileList = uniqBy([...info.fileList, ...this.localFileList], 'uid')
      }
    }
  },
  render () {
    // 对change 事件进行覆盖
    const on = { ...this.$listeners, change: this.handelChange }
    // 引入未覆盖的属性 留作扩展
    const props = { ...this.$attrs }
    // 对获取外部插槽
    let slots = Object.keys(this.$scopedSlots).map(slot => {
      const vnode = this.$scopedSlots[slot]
      return (<template slot={slot}>{ isFunction(vnode) ? vnode() : vnode }</template>)
    })
    if (slots.length === 0) {
      slots = /picture/.test(this.listType)
        ? (<a-icon type="plus" class="fs-22 cursor-pointer" />)
        : <a-button> <a-icon type="upload" /> 上传 </a-button>
    }
    if (this.localFileList.length >= this.max) {
      slots = null
    }
    let accept = this.accept
    let preview = () => {}

    if (/picture/.test(this.listType)) {
      if (accept === '') {
        accept = 'image/*'
      }
      preview = () => (
        <a-modal
          title="预览"
          visible={this.visiblePreview}
          footer={null}
          onCancel={this.previewCancel}
        >
          <a-carousel ref="carousel" effect="fade">
            { this.localFileList.map(_ => <img key={_.uid} src={_.thumbUrl}/>)}
          </a-carousel>
        </a-modal>
      )
    }

    return (
      <a-upload
        props={props}
        custom-request={this.upload}
        before-upload={this.localBefore}
        file-list={this.localFileList}
        list-type={this.listType}
        remove={this.removeFile}
        accept={accept}
        on={on}
        onPreview={this.previewFn}
      >
        {slots}
        {preview()}
      </a-upload>
    )
  }
}
</script>
