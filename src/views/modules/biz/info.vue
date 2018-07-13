<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="联系人姓名:">
        <el-input v-model="dataForm.bizName" placeholder="联系人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系电话:">
        <el-input v-model="dataForm.bizMobile" placeholder="联系电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="导入优先级:">
          <el-select v-model="dataForm.bizImportLevel" placeholder="导入优先级">
            <el-option key="" value="" label="全部"></el-option>
            <el-option
             v-for="item in importLevels"
             :key="item.code"
             :label="item.value"
             :value="item.code">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="名单来源:">
          <el-select v-model="dataForm.bizAgentLevel" placeholder="请选择名单来源">
            <el-option key="" value="" label="全部"></el-option>
            <el-option
             v-for="(item, index) in agentLevels"
             :key="index"
             :label="item"
             :value="item">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="跟进状态:">
          <el-select v-model="dataForm.fps" placeholder="请选择状态">
            <el-option key="" value="" label="全部"></el-option>
            <el-option
             v-for="item in fpss"
             :key="item.id"
             :label="item.value"
             :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="创建时间:">
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
        <el-button v-if="isAuth('biz:info:upload')" type="primary" @click="uploadHandle()">新增导入</el-button>
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
        prop="bizName"
        header-align="center"
        align="center"
        label="联系人姓名">
      </el-table-column>
      <el-table-column
        prop="bizMobile"
        header-align="center"
        align="center"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="wantLoanAmt"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="贷款需求（万元）"
        :formatter="valueMoneyFormat">
      </el-table-column>
      <el-table-column
        prop="wantLoanLimt"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="期限（月）">
      </el-table-column>
      <el-table-column
        prop="bizCurrFollowUpStatusDictId"
        header-align="center"
        align="center"
        label="状态"
        :formatter="valueFollowUpStatusFormat">
      </el-table-column>
      <el-table-column
        prop="bizAgentLevel"
        header-align="center"
        align="center"
        width="150"
        label="名单来源">
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
          <el-button v-if="isAuth('biz:infofuplog:info')" type="text" size="small" @click="followupHandle(scope.row.id)">跟进</el-button>
          <el-button v-if="isAuth('biz:infodetail:update')" type="text" size="small" @click="chgFollowupStatusHandle(scope.row.id,scope.row.bizCurrFollowUpStatusDictId)">修改跟进状态</el-button>
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
  <upload v-if="dataUploadVisible" ref="upload"></upload>
  <followup v-if="followupVisible" ref="followup"></followup>
  <chgFollowupStatus v-if="chgFollowupStatusVisible" @refreshDataList="getDataList" ref="chgFollowupStatus"></chgFollowupStatus>
  </div>
</template>

<script>
import Upload from "./upload";
import Followup from "./followup";
import ChgFollowupStatus from "./chgfollowupstatus";
import Vue from "vue";
import {
  DatePicker,
  Option,
  Button,
  Select,
  Input,
  Autocomplete
} from "element-ui";
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Input.name, Input);
Vue.component(Autocomplete.name, Autocomplete);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Option.name, Option);
export default {
  data() {
    return {
      dataForm: {
        bizAgentLevel: "",
        bizImportLevel: "",
        fps: "",
        bizName: "",
        bizMobile: "",
        sTime: "",
        eTime: ""
      },
      importLevels: [],
      dataUploadVisible: false,
      followupVisible: false,
      chgFollowupStatusVisible: false,
      dateValue: {},
      agentLevels: [],
      fpss: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    };
  },
  components: {
    Upload,
    Followup,
    ChgFollowupStatus
  },
  created() {
    this.getDataList();
    this.getLevelOptions();
    this.getFpsOptions();
    this.getImportLevelOptions();
  },
  methods: {
    setDate(val) {
      if (!val) {
        this.dataForm.sTime = "";
        this.dataForm.eTime = "";
      } else {
        let startT = val[0];
        let startE = val[1];
        this.dataForm.sTime = startT;
        this.dataForm.eTime = startE;
      }
    },
    valueMoneyFormat: function(row, column) {
      var val = row.wantLoanAmt;
      return (val || 0) / 1000000;
    },
    valueFollowUpStatusFormat: function(row, column) {
      let statusId = row.bizCurrFollowUpStatusDictId;
      let val = "未定义";
      this.fpss.forEach(element => {
        if (element.id === statusId) {
          val = element.value;
        }
      });
      return val;
    },
    // 获取产品级别列表
    getLevelOptions() {
      this.$http({
        url: this.$http.adornUrl("/biz/info/allproduct"),
        method: "post"
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.agentLevels = data.data;
        } else {
          this.agentLevels = [];
        }
      });
    },
    // 获取跟进状态列表
    getFpsOptions() {
      this.$http({
        url: this.$http.adornUrl("/biz/info/allfps"),
        method: "post"
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.fpss = data.data;
        } else {
          this.fpss = [];
        }
      });
    },
    getImportLevelOptions() {
      this.$http({
        url: this.$http.adornUrl("/biz/info/allimportLevels"),
        method: "post"
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.importLevels = data.data;
        } else {
          this.importLevels = [];
        }
      });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/biz/info/list"),
        method: "post",
        data: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          bizAgentLevel: this.dataForm.bizAgentLevel,
          bizImportLevel: this.dataForm.bizImportLevel,
          bizCurrFollowUpStatusDictId: this.dataForm.fps,
          bizMobile: this.dataForm.bizMobile,
          bizName: this.dataForm.bizName,
          sTime: this.dataForm.sTime,
          eTime: this.dataForm.eTime
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
    // 上传商机文件
    uploadHandle() {
      this.dataUploadVisible = true;
      this.$nextTick(() => {
        this.$refs.upload.init();
      });
    },
    followupHandle(id) {
      this.followupVisible = true;
      this.$nextTick(() => {
        this.$refs.followup.init(id);
      });
    },
    chgFollowupStatusHandle(id, statusId) {
      this.chgFollowupStatusVisible = true;
      this.$nextTick(() => {
        this.$refs.chgFollowupStatus.init(id, statusId);
      });
    }
  }
};
</script>
<style lang="scss">
.mod-followup {
  position: relative;
  z-index: 2000;
}
.v-modal {
  z-index: 1999 !important;
}
.mod-log .el-dialog__wrapper{
  z-index: 2000 !important;
}
</style>
