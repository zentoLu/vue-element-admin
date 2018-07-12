<template>
  <el-dialog
    title="分润明细数据"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column
        type="index"
        :index="typeIndex"
        label="序号"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="custname"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="custEntName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="productName"
        header-align="center"
        align="center"
        label="贷款产品">
      </el-table-column>
      <el-table-column
        prop="grantAmt"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="发放金额（万元）">
      </el-table-column>
      <el-table-column
        prop="currProfitAmt"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="分润金额（元）">
      </el-table-column>
      <el-table-column
        prop="applyStatus"
        header-align="center"
        align="center"
        label="贷款状态">
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
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          agentAccount: '',
          date:''
        },
        dataList: [],
        dataListLoading: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0
      }
    },
    methods: {
      init (id,month) {
        this.dataForm.agentAccount = id
        this.dataForm.date = month
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$http({
          url: this.$http.adornUrl(`/biz/infodetail/updatestatus/${this.dataForm.bizInfoId}/${this.dataForm.bizCurrFollowUpStatusDictId}`),
            method: 'post',
            data: this.$http.adornData({})
          }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      typeIndex(index) {
        return index + (this.pageIndex - 1) * this.pageSize + 1;
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
      }
    }
  }
</script>
