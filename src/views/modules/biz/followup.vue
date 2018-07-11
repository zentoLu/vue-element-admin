<template>
<div class="mod-followup" style="position: relative;z-index: 2000;" v-loading="dataPostLoading">
  <el-dialog
    title="名单跟进"
    :close-on-click-modal="false"
    :visible.sync="followupVisible"
    @close='closeDialog'>
    <el-table
      :data="dataInfoList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
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
        width="110"
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
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="150px" input-width="100px">
      <el-form-item>
        <h5>企业信息</h5>
      </el-form-item>
      <el-form-item label="企业名称:" prop="entName">
        <el-col :span="12">
          <el-input v-model="dataForm.entName" placeholder="企业名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="统一社会信用代码:" prop="entCreditCode">
        <el-col :span="12">
          <el-input v-model="dataForm.entCreditCode" placeholder="统一社会信用代码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="法定代表人姓名:" prop="entLegalOptName">
        <el-col :span="12">
          <el-input v-model="dataForm.entLegalOptName" placeholder="法定代表人姓名"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="手机号码" prop="entLegalOptMobile">
        <el-col :span="12">
          <el-input v-model="dataForm.entLegalOptMobile" placeholder="手机号码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <h5>需求信息</h5>
      </el-form-item>
      <el-form-item label="需求金额（万元）" prop="wantLoanAmt">
        <el-col :span="12">
          <el-input v-model="dataForm.wantLoanAmt" placeholder="需求金额"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="需求期限（月）" prop="wantLoanLimt">
        <el-col :span="12">
          <el-input v-model="dataForm.wantLoanLimt" placeholder="需求期限"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="还款方式" prop="payTypeDictId">
        <el-col :span="12">
          <el-select v-model="dataForm.payTypeDictId" placeholder="还款方式">
            <el-option
             v-for="item in payTypeDics"
             :key="item.id"
             :label="item.value"
             :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button v-if="isAuth('biz:infodetail:save')" type="success" @click="okHandle()">确认</el-button>
        <el-button v-if="isAuth('biz:infodetail:traslate')" type="success" @click="translateHandle()">转化为用户</el-button>
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
    var validateCreditCode = (rule, value, callback) => {
      var str = value + "";
      var roughReg = /[IOZVS]/;
      var specificReg = /^((1[1239])|(5[1239])|(9[123])|(Y1))\d{6}[0-9ABCDEFGHJKLMNPQRTUWXY]{9}$/; // 前17位
      var baseMap = {}; // 存放基数的Map
      var allow = "ABCDEFGHJKLMNPQRTUWXY".split(""); // 允许的英文字母（用来生成字母的基数对照表）
      var weighting = [
        1,
        3,
        9,
        27,
        19,
        26,
        16,
        17,
        20,
        29,
        25,
        13,
        8,
        24,
        10,
        30,
        28
      ]; // 加权因子
      var letterReg = /^[A-Z]$/;

      var first17 = str.slice(0, str.length - 1);
      var arr = str.split("");

      if (str.length !== 18) {
        callback(new Error("统一社会信用代码不合法"));
      }
      if (roughReg.test(str) === true) {
        callback(new Error("统一社会信用代码不合法"));
      }
      if (specificReg.test(first17) !== true) {
        callback(new Error("统一社会信用代码不合法"));
      }
      // 生成字母的基数对照表
      for (var i = 0, len = allow.length, base = 10; i < len; i++, base++) {
        baseMap[allow[i]] = base;
      }

      // 基数和对应位数的加权因子数值相乘，并把乘积求和
      var sum = 0;
      for (var j = 0, leng = first17.length; j < leng; j++) {
        if (letterReg.test(first17[j]) === true) {
          sum += parseInt(baseMap[first17[j]]) * weighting[j];
        } else {
          sum += parseInt(first17[j]) * weighting[j];
        }
      }
      // 对总和进行31求余，得到余数
      var rest = sum % 31;
      // 用31减去余数，0-9直接作为校验码，其余的在基数对照表查找
      var minus = 31 - rest;
      var validChar;
      if (minus >= 10) {
        if (minus != 31) {
          for (var k in baseMap) {
            if (baseMap.hasOwnProperty(k) && baseMap[k] === minus) {
              validChar = k;
              break;
            }
          }
        } else {
          // 特殊情况，总和刚好被31整除，这样算0
          validChar = 0;
        }
      } else {
        validChar = minus;
      }
      // 和最后一位做比较
      if (str[17] == validChar) {
        callback();
      } else {
        callback(new Error("统一社会信用代码不合法"));
      }
    };

    // var checkNum = (rule, value, callback) => {
    //   if (!Number.isInteger(value)) {
    //     callback(new Error('请输入数字值'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      dataForm: {
        id: "",
        bizCustId: "",
        bizInfoId: "",
        entName: "",
        entCreditCode: "",
        entLegalOptName: "",
        entLegalOptMobile: "",
        wantLoanAmt: "",
        wantLoanLimt: "",
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
          },
          { validator: validateCreditCode, trigger: "blur" }
        ],
        entLegalOptName: [
          { required: true, message: "法定代表人姓名不能为空", trigger: "blur" }
        ],
        entLegalOptMobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ]
        // wantLoanAmt: [
        //     { required: true, message: '需求金额不能为空', trigger: 'blur' }
        // ],
        // wantLoanLimt: [
        //     { required: true, message: '需求期限不能为空', trigger: 'blur' }
        // ],
        // payTypeDictId: [
        //     { required: true, message: '还款方式不能为空', trigger: 'blur' }
        // ]
      },
      dataPostLoading: false,
      followupVisible: false,
      addLogVisible: false,
      bizId: "",
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
    init(id) {
      this.followupVisible = true;
      this.bizId = id;
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
        url: this.$http.adornUrl(`/biz/infofuplog/list/${this.bizId}`),
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
        } else {
          this.$refs["dataForm"].resetFields();
        }
        this.dataLogListLoading = false;
      });
    },
    getDataInfo() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/biz/info/list"),
        method: "post",
        data: this.$http.adornParams({
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
    checkCreditCode(value) {
      var str = value + "";
      var roughReg = /[IOZVS]/;
      var specificReg = /^((1[1239])|(5[1239])|(9[123])|(Y1))\d{6}[0-9ABCDEFGHJKLMNPQRTUWXY]{9}$/; // 前17位
      var baseMap = {}; // 存放基数的Map
      var allow = "ABCDEFGHJKLMNPQRTUWXY".split(""); // 允许的英文字母（用来生成字母的基数对照表）
      var weighting = [
        1,
        3,
        9,
        27,
        19,
        26,
        16,
        17,
        20,
        29,
        25,
        13,
        8,
        24,
        10,
        30,
        28
      ]; // 加权因子
      var letterReg = /^[A-Z]$/;

      var first17 = str.slice(0, str.length - 1);
      var arr = str.split("");

      if (str.length !== 18) {
        return false;
      }
      if (roughReg.test(str) === true) {
        return false;
      }
      if (specificReg.test(first17) !== true) {
        return false;
      }
      // 生成字母的基数对照表
      for (var i = 0, len = allow.length, base = 10; i < len; i++, base++) {
        baseMap[allow[i]] = base;
      }

      // 基数和对应位数的加权因子数值相乘，并把乘积求和
      var sum = 0;
      for (var j = 0, leng = first17.length; j < leng; j++) {
        if (letterReg.test(first17[j]) === true) {
          sum += parseInt(baseMap[first17[j]]) * weighting[j];
        } else {
          sum += parseInt(first17[j]) * weighting[j];
        }
      }
      // 对总和进行31求余，得到余数
      var rest = sum % 31;
      // 用31减去余数，0-9直接作为校验码，其余的在基数对照表查找
      var minus = 31 - rest;
      var validChar;
      if (minus >= 10) {
        if (minus != 31) {
          for (var k in baseMap) {
            if (baseMap.hasOwnProperty(k) && baseMap[k] === minus) {
              validChar = k;
              break;
            }
          }
        } else {
          // 特殊情况，总和刚好被31整除，这样算0
          validChar = 0;
        }
      } else {
        validChar = minus;
      }
      // 和最后一位做比较
      if (str[17] == validChar) {
        return true;
      } else {
        return false;
      }
    },
    okHandle() {
      if (this.dataForm.entCreditCode) {
        if (!this.checkCreditCode(this.dataForm.entCreditCode)) {
          return;
        }
      }
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
    closeDialog() {
      this.$refs["dataForm"].resetFields();
      // this.dataForm = '';//清空数据
    },
    addHandle() {
      this.addLogVisible = true;
      let id = this.bizId;
      this.$nextTick(() => {
        this.$refs.add.init(id);
      });
    }
  }
};
</script>