<template>
  <el-dialog
    title="图片预览"
    :close-on-click-modal="false"
    :visible.sync="visible">
		<img id="img-view"  v-bind:src="imgUrl" width="90%" height="50%" >
  </el-dialog>
</template>

<script>
import Viewer from 'viewerjs'
import '@/assets/css/viewer.min.css'
export default {
  data () {
    return {
      visible: false,
      viewerId: {},
      imgUrl: ''
    }
  },
  methods: {
    init (imgUrl) {
      this.visible = true
      this.imgUrl = imgUrl
      this.$nextTick(() => {
        this.viewerId = new Viewer(document.getElementById('img-view'), {
          url: 'src',
          navbar: true,
          title: false,
          inline: true,
          toolbar: {
            zoomIn: true,
            zoomOut: true,
            play: {
              show: 1
            },
            rotateLeft: true,
            reset: true,
            rotateRight: true,
            flipHorizontal: true,
            flipVertical: true
          }
        })
        // document.getElementById('img-view').click()
        // this.visible = false
      })
    }
  }
}
</script>
