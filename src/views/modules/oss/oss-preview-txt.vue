<template>
  <el-dialog
    title="文本预览"
    :close-on-click-modal="false"
    :visible.sync="visible">
		<span> {{txtdata}} </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      txtdata: {}
    }
  },
  methods: {
    init (txtUrl) {
      this.visible = true
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl(txtUrl),
          method: 'get'
        }).then(({data}) => {
          console.log(data)
          this.txtdata = data
        })
      })
    }
  }
}
</script>
