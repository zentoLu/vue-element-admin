<template>
  <div class="mod-ap">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="代理商账号:">
        <el-input v-model="dataForm.agentAccount" placeholder="代理商账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="代理商名称:">
        <el-input v-model="dataForm.agentEntName" placeholder="代理商名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="签约状态:">
          <el-select v-model="dataForm.currYearSignStatus" placeholder="请选择签约状态">
            <el-option key="" value="" label="全部"></el-option>
            <el-option key="0" value="0" label="未签约"></el-option>
            <el-option key="1" value="1" label="已签约"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="结算状态:">
          <el-select v-model="dataForm.currProfitStatus" placeholder="请选择结算状态">
            <el-option key="" value="" label="全部"></el-option>
            <el-option key="0" value="0" label="当期未结算"></el-option>
            <el-option key="1" value="1" label="当期已结算"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增代理商</el-button>
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
        prop="agentInfo.currYearSignStatus"
        header-align="center"
        align="center"
        label="签约状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.agentInfo.currYearSignStatus === 0" size="small" type="danger">未签约</el-tag>
          <el-tag v-else size="small">已签约</el-tag>
        </template>
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
        prop="profitInfo.currProfitAmt"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="当期分润（元）"
        :formatter="valueMoneyFormat">
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
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.agentInfo.agentAccount)">修改代理商</el-button>
          <el-button type="text" size="small" @click="profitMonthHandle(scope.row.agentInfo.agentAccount)">分润信息</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <profit-month v-if="profitVisible" ref="profitMonth" @refreshDataList="getDataList"></profit-month>
  </div>
</template>

<script>
import AddOrUpdate from './agent-add-or-update'
import ProfitMonth from './agent-profit-month'
export default {
  data() {
    return {
      dataForm: {
        agentAccount: "",
        agentEntName: "",
        currYearSignStatus: "",
        currProfitStatus: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      profitVisible: false
    };
  },
  components: {
      AddOrUpdate,
      ProfitMonth
  },
  created () {
    this.getDataList()
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
        url: this.$http.adornUrl("/profit/agent/list"),
        method: "post",
        data: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          agentAccount: this.dataForm.agentAccount,
          agentEntName: this.dataForm.agentEntName,
          currYearSignStatus: this.dataForm.currYearSignStatus,
          currProfitStatus: this.dataForm.currProfitStatus
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
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
