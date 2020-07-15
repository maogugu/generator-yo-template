<script>
export default {
  name: 'XRangePicker',
  props: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  computed: {
    pickTime: {
      get () {
        if (this.start && this.end) {
          return [this.start, this.end]
        }
        return ['', '']
      },
      set (dates) {
        const [start = '', end = ''] = dates
        this.$emit('update:start', start)
        this.$emit('update:end', end)
      }
    }
  },
  watch: {
    start: {
      handler () {
        this.pickTime = [this.start, this.end]
      },
      immediate: true
    }
  },
  methods: {
    change (value) {
      this.pickTime = value
      this.$emit('change', value)
    }
  },
  render () {
    const on = { ...this.$listeners, change: this.change }
    // 对获取外部插槽
    const slots = Object.keys(this.$scopedSlots).map(slot => {
      return (<template slot={slot}>{ this.$scopedSlots[slot] }</template>)
    })
    return (
      <a-range-picker
        valueFormat="YYYY-MM-DD"
        props={this.$attrs}
        on={on}
        value={this.pickTime}
        scopedSlots={ this.$scopedSlots }
      >
        {slots}
      </a-range-picker>
    )
  }
}
</script>
<style scoped lang="less"></style>
