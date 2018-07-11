<template>
  <div class="mod-card">
    <div class="card-header">
        <h1 id = "card-title-id" class="card-title" style="margin-top:1.1rem"></h1>
        <div id = "card-subtitle-id" class="card-subtitle" style="margin-top:1rem"></div>
    </div>
    <div id = "card-content-id" class="card-block">
    </div>
    <div class="card-footer">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="prev-article">
            <span @click="prev()"><i class="el-icon-d-arrow-left"></i>上一篇</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div id="today" hidden>{{currDate}}</div>
          <div>&nbsp;&nbsp;</div>
        </el-col>
        <el-col :span="8">
          <div class="next-article">
            <span @click="next()">下一篇<i class="el-icon-d-arrow-right"></i></span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryDate: '',
      currDate: '',
      prevDate: '',
      nextDate: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
      // 获取数据列表
    getData (date) {
      this.queryDate = date || 0
      this.$http({
        url: this.$http.adornUrl(`/sys/article/info/${this.queryDate}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200) {
          var result = JSON.parse(data.data)
          document.getElementById('card-title-id').innerHTML = result.data.title
          this.currDate = result.data.date.curr
          var newDate = this.currDate.substr(0, 4) + '-' + this.currDate.substr(4, 2) + '-' + this.currDate.substr(6, 2)
          document.getElementById('card-subtitle-id').innerHTML = '<span>' + newDate + '&nbsp;&nbsp;' + result.data.author + '</span>' + '&nbsp;&nbsp;字数 ' + result.data.wc + '</span>'
          document.getElementById('card-content-id').innerHTML = result.data.content
          this.prevDate = result.data.date.prev
          this.nextDate = result.data.date.next
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    next () {
      if (this.nextDate > this.currDate) {
        this.$message.error('明天还未到来，请耐心等待吧~')
        return
      }
      this.getData(this.nextDate)
    },
    prev () {
      this.getData(this.prevDate)
    }
  }
}
</script>