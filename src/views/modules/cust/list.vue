<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.mobile" placeholder="注册手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.legalName" placeholder="法定代表人" clearable></el-input>
      </el-form-item>
      <el-form-item>
          <el-select v-model="dataForm.productLine" placeholder="请选择名单来源" clearable>
            <el-option
             v-for="(item, index) in productLineLevels"
             :key="index"
             :label="item"
             :value="item">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
          <el-select v-model="dataForm.status" placeholder="请选择跟进状态" clearable>
            <el-option
            v-for="item in statusLevels"
             :key="item.id"
             :label="item.value"
             :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          unlink-panels
          format="yyyy-MM-dd"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          @change="setDate">
        </el-date-picker>
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
      <el-table-column v-if="false"
        prop="bizCustId"
        header-align="center"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column v-if="false"
        prop="bizInfoId"
        header-align="center"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="注册手机号">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="公司名称">
      </el-table-column>
      <el-table-column
        prop="legalName"
        header-align="center"
        align="center"
        label="法人姓名">
      </el-table-column>
      <el-table-column
        prop="requireAmount"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="贷款需求（万元）">
      </el-table-column>
      <el-table-column
        prop="requireLimit"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="期限（月）">
      </el-table-column>
      <el-table-column
        prop="followStatus"
        header-align="center"
        align="center"
        label="跟进状态">
        <template slot-scope="scope">
          <el-dropdown  @command="handleCommand" trigger="click" class="navdash">
            <el-button type="primary">
              {{ scope.row.followStatus }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in statusLevels" v-text="item.value" :command="{status:item.id, custId:scope.row.bizCustId}"  :key="item.id"></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column
        prop="productLine"
        header-align="center"
        align="center"
        width="150"
        label="名单来源">
      </el-table-column>
      <el-table-column
        prop="followPerson"
        header-align="center"
        align="center"
        label="跟进人">
      </el-table-column>
      <el-table-column
        prop="registerTime"
        header-align="center"
        align="center"
        width="180"
        label="注册时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="followupHandle(scope.row.bizCustId, scope.row.bizInfoId)">跟进</el-button>
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
  <!-- 弹窗, 日志列表 -->
  <followup v-if="followupVisible" ref="followup"></followup>
  </div>
</template>

<script>
import Followup from './followup'
import Vue from 'vue'
import {DatePicker, Option, Button, Select, Input, Autocomplete} from 'element-ui'
Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.component(Input.name, Input)
Vue.component(Autocomplete.name, Autocomplete)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Option.name, Option)
export default {
  data () {
    return {
      dataForm: {
        bizAgentLevel: '',
        fps: '',
        bizName: '',
        bizMobile: '',
        sTime: '',
        eTime: ''
      },
      followupVisible: false,
      dateValue: {},
      productLineLevels: [],
      statusLevels: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    }
  },
  components: {
    Followup
  },
  created () {
    this.getDataList()
    this.getLevelOptions()
    this.getStatusOptions()
  },
  methods: {
    setDate (val) {
      if(!val){
        this.dataForm.sTime = ''
        this.dataForm.eTime = ''
      }else{
        let startT = val[0]
        let startE = val[1]
        this.dataForm.sTime = startT
        this.dataForm.eTime = startE
      }
    },
    valueMoneyFormat: function (row, column) {
      var val = row.wantLoanAmt
      return (val || 0) / 1000000
    },
    valueFollowUpStatusFormat: function (row, column) {
      let statusId = row.bizCurrFollowUpStatusDictId
      let val = '未定义'
      this.fpss.forEach(element => {
        if (element.id === statusId) {
          val = element.value
        }
      })
      return val
    },
    // 获取产品级别列表
    getLevelOptions () {
      this.$http({
        url: this.$http.adornUrl('/biz/info/allproduct'),
        method: 'post'
      }).then(({data}) => {
        if (data && data.code === 200 && data.data) {
          this.productLineLevels = data.data
        } else {
          this.productLineLevels = []
        }
      })
    },
    // 获取跟进状态列表
    getStatusOptions () {
      this.$http({
        url: this.$http.adornUrl('/cust/getCustStatusDic'),
        method: 'post'
      }).then(({data}) => {
        if (data && data.code === 200 && data.data) {
          this.statusLevels = data.data
        } else {
          this.statusLevels = []
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/cust/getCustList'),
        method: 'post',
        data: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'mobile': this.dataForm.mobile,
          'companyName': this.dataForm.companyName,
          'legalName': this.dataForm.legalName,
          'productLine': this.dataForm.productLine,
          'status': this.dataForm.status,
          'startDate': this.dataForm.sTime,
          'endDate': this.dataForm.eTime
        })
      }).then(({data}) => {
        if (data && data.code === 200 && data.data) {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
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

    followupHandle (bizCustId, bizInfoId) {
      this.followupVisible = true
      this.$nextTick(() => {
        this.$refs.followup.init(bizCustId, bizInfoId)
      })
    },

    handleCommand(command) {
        console.log(command)
        this.$http({
        url: this.$http.adornUrl('/cust/updateCustStatus'),
        method: 'post',
        data: this.$http.adornParams({
          'status': command.status,
          'custId': command.custId
        })
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.getDataList()
        } else {
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .mod-followup{
    position: relative;z-index: 2000;
  }
  .v-modal{
    z-index: 1999!important;
  }
</style>
