<template>
  <div class="mod-ap">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="账号:">
        <el-input v-model="dataForm.username" placeholder="账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="dataForm.realname" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
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
        prop="tmkInfo.username"
        header-align="center"
        align="center"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="tmkInfo.realname"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="profitInfo.grantSum"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="贷款发放笔数">
      </el-table-column>
      <el-table-column
        prop="profitInfo.grantAmt"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="发放金额（万元）">
      </el-table-column>
      <el-table-column
        prop="profitInfo.profitSumAmt"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="分润总额（元）">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="profitMonthHandle(scope.row.tmkInfo.username)">分润信息</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <profit-month v-if="profitVisible" ref="profitMonth" @refreshDataList="getDataList"></profit-month>
  </div>
</template>

<script>
import ProfitMonth from './tmkp-profit-month'
export default {
  data() {
    return {
      dataForm: {
        username: "",
        realname: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      profitVisible: false
    };
  },
  components: {
      ProfitMonth
  },
  activated () {
    this.getDataList()
  },
  methods: {
    valueMoneyFormat: function(row, column) {
      var val = row.wantLoanAmt;
      return (val || 0) / 1000000;
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/profit/tmk/list"),
        method: "post",
        data: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          username: this.dataForm.username,
          realname: this.dataForm.realname
        })
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.dataList = data.data.list;
          this.totalPage = data.data.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    typeIndex(index) {
      return index + (this.pageIndex - 1) * this.pageSize + 1;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    profitMonthHandle(id){
      this.profitVisible = true
      this.$nextTick(() => {
        this.$refs.profitMonth.init(id)
      })
    }
  }
};
</script>
