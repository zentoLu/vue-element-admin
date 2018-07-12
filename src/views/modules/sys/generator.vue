<template>
  <div class="mod-generator">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.tableName" placeholder="表名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="danger" @click="genCodeHandle()" :disabled="dataListSelections.length <= 0">批量生成</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="tableName"
        header-align="center"
        align="center"
        label="表名">
      </el-table-column>
      <el-table-column
        prop="engine"
        header-align="center"
        align="center"
        label="引擎">
      </el-table-column>
      <el-table-column
        prop="tableComment"
        header-align="center"
        align="center"
        label="表备注">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="isAuth('sys:generator:code')" type="text" size="small" @click="genCodeHandle(scope.row.tableName)">生成代码</el-button> -->
          <el-button  type="text" size="small" @click="genCodeHandle(scope.row.tableName)">生成代码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import Vue from 'vue'
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)
export default {
  data () {
    return {
      dataForm: {
        tableName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: []
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
      // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/generator/list'),
        method: 'post',
        data: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'tableName': this.dataForm.tableName
        })
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
      // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
      // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
      // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    genCodeHandle (tableName) {
      let that = this
      var ajax = new XMLHttpRequest()
      var tableNames = tableName ? [tableName] : this.dataListSelections.map(item => {
        return item.tableName
      })
      ajax.responseType = 'blob'
      ajax.open('POST', this.$http.adornUrl('/sys/generator/code'), true)
      ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;')
      ajax.setRequestHeader('token', Vue.cookie.get('token'))
      ajax.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            if (this.response.type === 'application/octet-stream') {
              let disposition = ajax.getResponseHeader('Content-Disposition')
              let filename = decodeURI(disposition.match(/filename="(.*)"/)[1])
              that.downloadHandler(this.response, filename)
            } else {
              this.$message.error('您要下载的资源已被删除！')
            }
          } else if (this.responseText !== '') {
            this.$message.error(this.responseText)
          }
        } else if (this.readyState === 2) {
          if (this.status === 200) {
            this.responseType = 'blob'
          } else {
            this.responseType = 'text'
          }
        }
      }
      ajax.send('tables=' + tableNames)
    },
    downloadHandler (content, filename) {
      var eleLink = document.createElement('a')
      eleLink.download = filename
      eleLink.style.display = 'none'
        // 字符内容转变成blob地址
      var blob = new Blob([content], {type: 'application/octet-stream'})
      eleLink.href = URL.createObjectURL(blob)
        // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
        // 然后移除
      document.body.removeChild(eleLink)
    }
  }
}
</script>
