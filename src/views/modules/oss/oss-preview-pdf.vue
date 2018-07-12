<template>
<el-dialog
    title="pdf预览"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div>
        <pdf
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
            style="display: inline-block; width: 100%"
        ></pdf>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  components: {
    pdf
  },
  data () {
    return {
      src: '',
      numPages: undefined,
      visible: false
    }
  },
  methods: {
    init (imgUrl) {
      this.visible = true
      var loadingTask = pdf.createLoadingTask(this.$http.adornUrl(imgUrl))
      this.src = loadingTask
      this.$nextTick(() => {
        this.src.then(pdf => {
          this.numPages = pdf.numPages
        })
      })
    }
  }
}
</script>
