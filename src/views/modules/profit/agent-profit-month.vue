<template>
  <div class="mod-apm">
  <el-dialog
    title="伙伴信息"
    :close-on-click-modal="false"
    :visible.sync="apmVisible">
    <el-table
      :data="apmDataList"
      border
      v-loading="apmDataListLoading"
      style="width: 100%">
      <el-table-column
        prop="agentInfo.agentAccount"
        header-align="center"
        align="center"
        label="代理商账号">
      </el-table-column>
      <el-table-column
        prop="agentInfo.agentEntName"
        header-align="center"
        align="center"
        label="代理商名称">
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
        prop="agentInfo.signYears"
        header-align="center"
        align="center"
        label="签约时间">
        <template slot-scope="scope">
          <el-tag v-for="year in scope.row.agentInfo.signYears" :key="year" size="small" type="danger">{{year}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-form :inline="true">
      <el-form-item>
        <div>&nbsp;&nbsp;</div>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <h5>每月分润详情</h5>
      </el-form-item>
    </el-form>
    <el-table
      :data="apmDataProfitMonthList"
      border
      v-loading="apmDataProfitMonthListLoading"
      style="width: 100%">
      <el-table-column
        prop="profitInfo.date"
        header-align="center"
        align="center"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="profitInfo.grantAmt"
        header-align="center"
        align="center"
        width="200"
        :show-overflow-tooltip="true"
        label="贷款发放金额（万元）">
      </el-table-column>
      <el-table-column
        prop="profitInfo.profitSumAmt"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="分润金额（元）">
      </el-table-column>
      <el-table-column
        prop="profitInfo.currProfitStatus"
        header-align="center"
        align="center"
        label="结算状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.profitInfo.currProfitStatus === 0" size="small" type="danger">未结算</el-tag>
          <el-tag v-else size="small">已结算</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="profitStatusUpdateHandle(agentAccount,scope.row.profitInfo.date,scope.row.profitInfo.currProfitStatus)">修改结算状态</el-button>
          <el-button type="text" size="small" @click="recommendDetailHandle(agentAccount,scope.row.profitInfo.date)">推荐信息</el-button>
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
  </el-dialog>
  <apmStatusChg v-if="chgProfitStatusVisible" @refreshDataList="getApmDataProfitMonthList" ref="apmStatusChg"></apmStatusChg>
  <rd v-if="rdVisible" ref="rd"></rd>
  </div>
</template>

<script>
import ApmStatusChg from "./agent-profit-month-status-chg";
import Rd from "./agent-profit-month-rd";
export default {
  data() {
    return {
      dataForm: {
        agentAccount: "",
        agentEntName: "",
        currYearSignStatus: "",
        currProfitStatus: ""
      },
      apmVisible: false,
      agentAccount: '',
      apmDataList: [],
      apmDataListLoading: false,
      apmDataProfitMonthList: [],
      apmDataProfitMonthListLoading: false,
      chgProfitStatusVisible: false,
      rdVisible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    };
  },
  components: {
    ApmStatusChg,
    Rd
  },
  methods: {
    init(id) {
      this.apmVisible = true;
      this.agentAccount = id;
      this.getApmDataList();
      this.getApmDataProfitMonthList();
    },
    // 获取数据列表
    getApmDataList() {
      this.apmDataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/profit/agent/list"),
        method: "post",
        data: this.$http.adornParams({
          agentAccount:  this.agentAccount
        })
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.apmDataList = data.data.list;
        } else {
          this.apmDataList = [];
        }
        this.apmDataListLoading = false;
      });
    },
    // 获取数据列表
    getApmDataProfitMonthList() {
      this.apmDataProfitMonthListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/profit/agent/detail/month"),
        method: "post",
        data: this.$http.adornParams({
          agentAccount:  this.agentAccount
        })
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.apmDataProfitMonthList = data.data.list;
          this.totalPage = data.data.totalCount
        } else {
          this.apmDataProfitMonthList = [];
          this.totalPage = 0
        }
        this.apmDataProfitMonthListLoading = false;
      });
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
    },
    profitStatusUpdateHandle(id,month,status) {
      this.chgProfitStatusVisible = true;
      this.$nextTick(() => {
        this.$refs.apmStatusChg.init(id,month,status);
      });
    },
    recommendDetailHandle(id,month) {
      this.rdVisible = true;
      this.$nextTick(() => {
        this.$refs.rd.init(id,month);
      });
    },
  }
};
</script>
