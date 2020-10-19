<script>
import { Icon } from 'ant-design-vue'
import { ICON_URL } from '@/constants'
export default {
  name: 'XIcon',
  render () {
    const IconFont = Icon.createFromIconfontCN({ scriptUrl: ICON_URL })
    return (
      <IconFont props={this.$attrs} on={this.$listeners}/>
    )
  }
}
</script>
