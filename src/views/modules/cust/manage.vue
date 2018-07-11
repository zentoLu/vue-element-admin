<template>
    <div class="cust-manage">
      <h2>客户跟进</h2>
      <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        width="120"
        label="注册手机号">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="legalName"
        header-align="center"
        align="center"
        label="法人代表名称">
      </el-table-column>
      <el-table-column
        prop="requireAmount"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="需求金额（万元）">
      </el-table-column>
      <el-table-column
        prop="requireLimit"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="需求期限（月）">
      </el-table-column>
      <el-table-column
        prop="productLine"
        header-align="center"
        align="center"
        label="客户来源">
      </el-table-column>
      <el-table-column
        prop="followPerson"
        header-align="center"
        align="center"
        width="150"
        label="跟进人">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        header-align="center"
        align="center"
        width="180"
        label="注册时间">
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false
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
        url: this.$http.adornUrl('/cust/getCustList'),
        method: 'post',
        data: this.$http.adornParams({
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
    }
  }
}
</script>
