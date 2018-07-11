<template>

<div class="mod-followup" style="position: relative;z-index: 2000;" v-loading="dataPostLoading">
  <el-dialog
    title="客户信息"
    :close-on-click-modal="false"
    :visible.sync="followupVisible">
      <el-table
      :data="custInfo"
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
import Add from './followuplog'
import {isMobile} from '@/utils/validate'
export default {
  data () {
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    var checkNum = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        id: '',
        bizCustId: '',
        bizInfoId: '',
        entName: '',
        entCreditCode: '',
        entLegalOptName: '',
        entLegalOptMobile: '',
        wantLoanAmt: '',
        wantLoanLimt: '',
        payTypeDictId: ''
      },

      dataRule: {
        entName: [
            { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        entCreditCode: [
            { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }
        ],
        entLegalOptName: [
            { required: true, message: '法定代表人姓名不能为空', trigger: 'blur' }
        ],
        entLegalOptMobile: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
        ],
        wantLoanAmt: [
            { required: true, message: '需求金额不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur' }
        ],
        wantLoanLimt: [
            { required: true, message: '需求期限不能为空', trigger: 'blur' },
            { validator: checkNum, trigger: 'blur' }
        ],
        payTypeDictId: [
            { required: true, message: '还款方式不能为空', trigger: 'blur' }
        ]
      },
      dataPostLoading: false,
      followupVisible: true,
      addLogVisible: false,
      bizId: '',
      entName: '',
      entCreditCode: '',
      entLegalOptName: '',
      entLegalOptMobile: '',
      wantLoanAmt: '',
      wantLoanLimt: '',
      payTypeDictId: '',
      dataListLoading: false,
      fpss: [],
      callTypes: [],
      dataLogListLoading: false,
      dataLogList: [],
      payTypeDics: [],
      custInfo: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  components: {
    Add
  },
  created () {
      // 调用的后台接口
    this.$http({
      url: this.$http.adornUrl(`/biz/info/allpaytypes`),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 200 && data.data) {
        this.payTypeDics = data.data
      }
    })
  },
  methods: {
    init (bizCustId, bizId) {
      this.followupVisible = true
      this.dataForm.bizCustId = bizCustId
      this.bizId = bizId
      this.getFpsOptions()
      this.getCallTypeOptions()
      this.getLogDetailDataInfo()
      this.getDataInfo()
      this.getLogDataInfo()
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
    valueFollowUpCallFormat: function (row, column) {
      let statusId = row.followUpCallDictId
      let val = '未定义'
      this.callTypes.forEach(element => {
        if (element.id === statusId) {
          val = element.value
        }
      })
      return val
    },
    // 获取跟进状态列表
    getFpsOptions () {
      this.$http({
        url: this.$http.adornUrl('/biz/info/allfps'),
        method: 'post'
      }).then(({data}) => {
        if (data && data.code === 200 && data.data) {
          this.fpss = data.data
        } else {
          this.fpss = []
        }
      })
    },
      // 获取跟进状态列表
    getCallTypeOptions () {
      this.$http({
        url: this.$http.adornUrl(`/biz/info/allcalltypes`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200 && data.data) {
          this.callTypes = data.data
        }
      })
    },
    getLogDataInfo () {
      this.dataLogListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/biz/infofuplog/list/${this.bizId}`),
        method: 'get',
        data: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 200 && data.data) {
          this.dataLogList = data.data
        } else {
          this.dataLogList = []
        }
        this.dataLogListLoading = false
      })
    },
    getLogDetailDataInfo () {
      this.dataLogListLoading = true
      this.$http({
        url: this.$http.adornUrl(`/biz/infodetail/info`),
        method: 'post',
        data: this.$http.adornData({
          'bizInfoId': this.bizId
        })
      }).then(({data}) => {
        if (data && data.code === 200 && data.data) {
          this.dataForm = data.data
          this.dataForm.wantLoanAmt = (this.dataForm.wantLoanAmt || 0) / 1000000
        }
        this.dataLogListLoading = false
      })
    },
    getDataInfo () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/cust/getCustInfo'),
        method: 'post',
        data: this.$http.adornParams({
          'custId': this.dataForm.bizCustId
        })
      }).then(({data}) => {
        console.log(data.data)
        if (data && data.code === 200) {
          this.custInfo = data.data
        } else {
          this.custInfo = ''
        }
        this.dataListLoading = false
      })
    },
    okHandle () {
      this.dataPostLoading = true
      this.$http({
        url: this.$http.adornUrl(`/biz/infodetail/${!this.dataForm.id ? 'save' : 'update'}`),
        method: 'post',
        data: this.$http.adornParams({
          'id': this.dataForm.id || undefined,
          'bizInfoId': this.bizId,
          'wantLoanAmt': (this.dataForm.wantLoanAmt || 0) * 1000000,
          'wantLoanLimt': this.dataForm.wantLoanLimt,
          'payTypeDictId': this.dataForm.payTypeDictId,
          'entName': this.dataForm.entName,
          'entCreditCode': this.dataForm.entCreditCode,
          'entLegalOptName': this.dataForm.entLegalOptName,
          'entLegalOptMobile': this.dataForm.entLegalOptMobile
        })
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(data.msg)
        }
        this.dataPostLoading = false
      })
    },
    translateHandle () {
      if (this.dataForm.bizCustId) {
        this.$message.error('已经是平台用户，不能再转')
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataPostLoading = true
          this.$http({
            url: this.$http.adornUrl(`/biz/infodetail/traslate`),
            method: 'post',
            data: this.$http.adornParams({
              'id': this.dataForm.id || undefined,
              'bizInfoId': this.bizId,
              'wantLoanAmt': (this.dataForm.wantLoanAmt || 0) * 1000000,
              'wantLoanLimt': this.dataForm.wantLoanLimt,
              'payTypeDictId': this.dataForm.payTypeDictId,
              'entName': this.dataForm.entName,
              'entCreditCode': this.dataForm.entCreditCode,
              'entLegalOptName': this.dataForm.entLegalOptName,
              'entLegalOptMobile': this.dataForm.entLegalOptMobile
            })
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message.success('保存成功')
            } else {
              this.$message.error('转化失败')
            }
            this.dataPostLoading = false
          })
        }
      })
    },
    addHandle () {
      this.addLogVisible = true
      let id = this.bizId
      this.$nextTick(() => {
        this.$refs.add.init(id)
      })
    }
  }
}
</script>

