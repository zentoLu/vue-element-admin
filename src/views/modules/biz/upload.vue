<template>
<el-dialog
    title="上传商机文件"
    :close-on-click-modal="false"
    width="62%"
    :visible.sync="dataUploadVisible">
<div class="mod-index" v-loading="dataUploadLoading">
  <el-row :gutter="20">
    <el-col :span="6">
      <el-upload
        ref="upload"
        action="#url"
        :show-file-list="false"
        :on-change="readExcel"
        :auto-upload="false"
        style="text-align: center;">
        <img src="~@/assets/img/demo.png">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击上传（只支持xls、xlsx格式文件！）</em></div>
      </el-upload>
    </el-col>
    <el-col :span="6">
      <div>&nbsp;&nbsp;</div>
    </el-col>
    <el-col :span="12">
      <!--展示导入信息-->
      <el-table 
        :data="excelPageData"
        border
        v-loading="dataListLoading"
        style="width: 100%">
        <el-table-column label="客户名称" prop="客户名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="联系方式" prop="联系方式" show-overflow-tooltip></el-table-column>
        <el-table-column label="联系人姓名" prop="联系人姓名" show-overflow-tooltip></el-table-column>
        <el-table-column label="软件使用版本" prop="软件使用版本" show-overflow-tooltip></el-table-column>
        <el-table-column label="导入优先级" prop="导入优先级" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        :small="true"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-col>
  </el-row>
  <el-row :gutter="20">
      <div>&nbsp;&nbsp;</div>
  </el-row>
  <el-row :gutter="20">
      <div>&nbsp;&nbsp;</div>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="24">
      <div>请选择名单来源：</div>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-autocomplete  
        v-model="agent"   
        :fetch-suggestions="querySearchAsync"   
        @select="handleSelect"  
        placeholder="请输入代理商名称"
        style="width: 75%;">  
      </el-autocomplete>
      <el-button type="primary" @click="successHandle()">确认</el-button>
    </el-col>
    <el-col :span="6">
       <div>&nbsp;&nbsp;</div>
    </el-col>
  </el-row>
  <el-row :gutter="20">
      <div>&nbsp;&nbsp;</div>
  </el-row>
  <el-row :gutter="20">
    <el-tag size="small" type="danger">如遇代理商中未能选择，请先联系代理商先进行注册，否则无法进行分润统计</el-tag>
  </el-row>
</div>
 </el-dialog>
</template>
<script>
  var XLSX = require('xlsx')
  export default {
    data () {
      return {
        dataUploadVisible: false,
        dataListLoading: false,
        dataUploadLoading: false,
        url: '',
        agent: '',
        agentModel: '',
        agents: [],
        fileList: [],
        excelData: [],
        excelPageData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0
      }
    },
    created () {
      // 调用的后台接口
      this.$http({
        url: this.$http.adornUrl(`/biz/info/allagents`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200 && data.data) {
          this.agents = data.data
        }
      })
    },
    methods: {
      init () {
        this.dataUploadVisible = true
        this.excelData = []
        this.excelPageData = []
        this.agent = ''
      },
      querySearchAsync (queryString, callback) {
        let results = []
        for (let i of this.agents) {
          if (i['agentName'].indexOf(queryString) !== -1) {
            results.push({
              value: i['agentName'],
              agentId: i['agentId']
            })
          }
        }
        callback(results)
      },
      handleSelect (item) {
        this.agentModel = item
      },
      // 上传成功
      successHandle () {
        let flag = true
        if (this.excelData.length === 0) {
          this.$message.error('你还没有上传名单呢')
          return
        }
        if (this.agent === '') {
          this.$message.error('你还没有选择名单来源呢')
          flag = false
        }
        if (flag) {
          this.dataUploadLoading = true
          this.$http({
            url: this.$http.adornUrl(`/biz/info/upload?token=${this.$cookie.get('token')}`),
            method: 'post',
            data: this.$http.adornData({
              'agentId': this.agentModel.agentId,
              'agentName': this.agentModel.value,
              'bizInfos': this.excelData
            })
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.excelData = []
              this.excelPageData = []
              this.agent = ''
              this.$message.success('上传成功')
            } else {
              this.$message.error('上传失败')
            }
            this.dataUploadLoading = false
          })
        }
      },
      readExcel (file) { // 导入excel
        this.dataListLoading = true
        const fileReader = new FileReader()
        let $t = this
        fileReader.onload = (e) => {
          var data = e.target.result
          if ($t.rABS) {
            $t.wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
              type: 'base64'
            })
          } else {
            $t.wb = XLSX.read(data, {
              type: 'binary'
            })
          }
          if (!$t.wb.Workbook) {
            this.$message.error('只支持xls、xlsx格式的文件！')
            this.dataListLoading = false
            return
          }
          let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
          $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
        }
        fileReader.readAsBinaryString(file.raw)
      },
      analyzeData: function (data) {  // 此处可以解析导入数据
        return data
      },
      dealFile: function (data) {   // 处理导入的数据
        this.dataListLoading = false
        if (data.length <= 0 || !data[0].联系方式) {
          this.$message.error('请导入表头为[客户名称,联系方式,联系人姓名,软件使用版本]内容的正确数据格式')
        } else {
          this.excelData = data
          this.excelPageData = data.slice(this.pageIndex - 1, this.pageSize)
          this.totalPage = data.length
        }
      },
      fixdata: function (data) {  // 文件流转BinaryString
        var o = ''
        var l = 0
        var w = 10240
        for (; l < data.byteLength / w; ++l) {
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        }
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      },  // 每页数
      sizeChangeHandle (val) {
        let data = this.excelData
        this.pageSize = val
        this.pageIndex = 1
        this.excelPageData = data.slice(0, this.pageSize)
      },
      // 当前页
      currentChangeHandle (val) {
        let data = this.excelData
        this.pageIndex = val
        this.excelPageData = data.slice(val > 1 ? (val - 1) * this.pageSize : 0, val * this.pageSize - 1)
      }
    }
  }
</script>