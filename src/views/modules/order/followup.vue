<template>
<div class="mod-order-followup" style="position: relative;z-index: 2000;"  v-loading="dataPostLoading">
  <el-dialog
    title="订单跟进"
    :close-on-click-modal="false"
    :visible.sync="followupVisible">
    <el-table
      :data="dataInfoList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="注册人手机号">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        width="110"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="legalName"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="法人代表姓名">
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        header-align="center"
        align="center"
        width="100"
        :show-overflow-tooltip="true"
        label="需求金额（万元）">
      </el-table-column>
      <el-table-column
        prop="loanLimit"
        header-align="center"
        align="center"
        width="100"
        label="需求期限（月）">
      </el-table-column>
      <el-table-column
        prop="productLine"
        header-align="center"
        align="center"
        width="150"
        label="客户来源">
      </el-table-column>
      <el-table-column
        prop="followPerson"
        header-align="center"
        align="center"
        width="100"
        label="跟进人">
      </el-table-column>
      <el-table-column
        prop="applyDate"
        header-align="center"
        align="center"
        width="180"
        label="申貸时间">
       </el-table-column>
       <el-table-column
        prop="linkApply"
        header-align="center"
        align="center"
        width="180"
        label="关联申请单">
      </el-table-column>
    </el-table>
    <el-form :inline="true">
      <el-form-item>
        <div>&nbsp;&nbsp;</div>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <h5>跟进记录</h5>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button v-if="isAuth('biz:infofuplog:save')" type="success" @click="addHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataLogList"
      border
      v-loading="dataLogListLoading"
      style="width: 100%">
      <el-table-column
        prop="followUperName"
        header-align="center"
        align="center"
        label="跟进人">
      </el-table-column>
      <el-table-column
        prop="followUpCallDictId"
        header-align="center"
        align="center"
        label="电话接通情况"
        :formatter="valueFollowUpCallFormat">
      </el-table-column>
      <el-table-column
        prop="followUpCallDesp"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="详细描述">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
    </el-table>
    <el-form :inline="true">
      <el-form-item>
        <div>&nbsp;&nbsp;</div>
      </el-form-item>
    </el-form>
    
  
  </el-dialog>
  <add v-if="addLogVisible" ref="add" @refreshDataList="getLogDataInfo"></add>
</div>
</template>
<script>
import Add from "./followuplog";
import { isMobile } from "@/utils/validate";
export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    var checkNum = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      dataForm: {
        id: "",
        bizCustId: "",
        bizInfoId: "",
        entName: "",
        entCreditCode: "",
        entLegalOptName: "",
        entLegalOptMobile: "",
        payTypeDictId: ""
      },

      dataRule: {
        entName: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        entCreditCode: [
          {
            required: true,
            message: "统一社会信用代码不能为空",
            trigger: "blur"
          }
        ],
        entLegalOptName: [
          { required: true, message: "法定代表人姓名不能为空", trigger: "blur" }
        ],
        entLegalOptMobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ],
        payTypeDictId: [
          { required: true, message: "还款方式不能为空", trigger: "blur" }
        ]
      },
      dataPostLoading: false,
      followupVisible: false,
      addLogVisible: false,
      bizId: "",
      applyId: "",
      entName: "",
      entCreditCode: "",
      entLegalOptName: "",
      entLegalOptMobile: "",
      wantLoanAmt: "",
      wantLoanLimt: "",
      payTypeDictId: "",
      dataListLoading: false,
      dataInfoList: [],
      fpss: [],
      callTypes: [],
      dataLogListLoading: false,
      dataLogList: [],
      payTypeDics: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    };
  },
  components: {
    Add
  },
  created() {
    // 调用的后台接口
    this.$http({
      url: this.$http.adornUrl(`/biz/info/allpaytypes`),
      method: "get",
      params: this.$http.adornParams()
    }).then(({ data }) => {
      if (data && data.code === 200 && data.data) {
        this.payTypeDics = data.data;
      }
    });
  },
  methods: {
    init(id, appId) {
      this.followupVisible = true;
      this.bizId = id;
      this.applyId = appId;
      this.getFpsOptions();
      this.getCallTypeOptions();
      this.getLogDetailDataInfo();
      this.getDataInfo();
      this.getLogDataInfo();
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
    valueFollowUpCallFormat: function(row, column) {
      let statusId = row.followUpCallDictId;
      let val = "未定义";
      this.callTypes.forEach(element => {
        if (element.id === statusId) {
          val = element.value;
        }
      });
      return val;
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
    // 获取跟进状态列表
    getCallTypeOptions() {
      this.$http({
        url: this.$http.adornUrl(`/biz/info/allcalltypes`),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.callTypes = data.data;
        }
      });
    },
    getLogDataInfo() {
      // this.dataLogListLoading = true
      this.$http({
        url: this.$http.adornUrl(
          `/biz/infofuplog/listApply/${this.bizId}/${this.applyId}`
        ),
        method: "get",
        data: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.dataLogList = data.data;
        } else {
          this.dataLogList = [];
        }
        // this.dataLogListLoading = false
      });
    },
    getLogDetailDataInfo() {
      this.dataLogListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/biz/infodetail/info`),
        method: "post",
        data: this.$http.adornData({
          bizInfoId: this.bizId
        })
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.dataForm = data.data;
          this.dataForm.wantLoanAmt =
            (this.dataForm.wantLoanAmt || 0) / 1000000;
        }
        this.dataLogListLoading = false;
      });
    },
    getDataInfo() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/biz/order/getApply"),
        method: "post",
        data: this.$http.adornParams({
          applyId: this.applyId,
          bizInfoId: this.bizId
        })
      }).then(({ data }) => {
        if (data && data.code === 200 && data.data) {
          this.dataInfoList = data.data.list;
        } else {
          this.dataInfoList = [];
        }
        this.dataListLoading = false;
      });
    },

    okHandle() {
      this.dataPostLoading = true;
      this.$http({
        url: this.$http.adornUrl(
          `/biz/infodetail/${!this.dataForm.id ? "save" : "update"}`
        ),
        method: "post",
        data: this.$http.adornParams({
          id: this.dataForm.id || undefined,
          bizInfoId: this.bizId,
          wantLoanAmt: (this.dataForm.wantLoanAmt || 0) * 1000000,
          wantLoanLimt: this.dataForm.wantLoanLimt,
          payTypeDictId: this.dataForm.payTypeDictId,
          entName: this.dataForm.entName,
          entCreditCode: this.dataForm.entCreditCode,
          entLegalOptName: this.dataForm.entLegalOptName,
          entLegalOptMobile: this.dataForm.entLegalOptMobile
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message.success("保存成功");
        } else {
          this.$message.error(data.msg);
        }
        this.dataPostLoading = false;
      });
    },
    translateHandle() {
      if (this.dataForm.bizCustId) {
        this.$message.error("已经是平台用户，不能再转");
        return;
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.dataPostLoading = true;
          this.$http({
            url: this.$http.adornUrl(`/biz/infodetail/traslate`),
            method: "post",
            data: this.$http.adornParams({
              id: this.dataForm.id || undefined,
              bizInfoId: this.bizId,
              wantLoanAmt: (this.dataForm.wantLoanAmt || 0) * 1000000,
              wantLoanLimt: this.dataForm.wantLoanLimt,
              payTypeDictId: this.dataForm.payTypeDictId,
              entName: this.dataForm.entName,
              entCreditCode: this.dataForm.entCreditCode,
              entLegalOptName: this.dataForm.entLegalOptName,
              entLegalOptMobile: this.dataForm.entLegalOptMobile
            })
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message.success("保存成功");
            } else {
              this.$message.error("转化失败");
            }
            this.dataPostLoading = false;
          });
        }
      });
    },
    addHandle() {
      this.addLogVisible = true;
      let id = this.bizId;
      let applyId = this.applyId;
      this.$nextTick(() => {
        this.$refs.add.init(id, applyId);
      });
    }
  }
};
</script>