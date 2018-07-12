<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="代理商名称" prop="agentEntName">
        <el-input v-model="dataForm.agentEntName" placeholder="代理商名称" :disabled="dataForm.id>0"></el-input>
      </el-form-item>
      <el-form-item label="代理商账号" prop="agentAccount">
        <el-input v-model="dataForm.agentAccount" placeholder="代理商账号" :disabled="dataForm.id>0"></el-input>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="联系人姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="联系方式"></el-input>
      </el-form-item>
      <el-form-item label="所在区域" prop="province">
        <el-autocomplete  
        v-model="dataForm.province"   
        :fetch-suggestions="querySearchAsync"   
        @select="handleSelect"  
        placeholder="请输入所在区域"
        style="width: 100%;">  
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="合同有效期" size="mini" prop="signYears">
        <el-checkbox-group v-model="dataForm.signYears">
          <el-checkbox v-for="year in signYearList" :key="year" :label="year" :disabled="containsValue(dataForm.signYears,year)">{{ year }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {isMobile} from '@/utils/validate'
  var kdloanprovinces = require('@/assets/file/kdloanprovinces.json')//加载本地数据文件
  export default {
    data () {
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      var checkExist = (rule, value, callback) => {
        if (this.dataForm.id) {
          callback()
        }
        this.$http({
          url: this.$http.adornUrl(`/profit/agent/exist/`+ value),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 200) {
            if (data.data) {
              callback(new Error('代理商已经存在'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        })
      }
      return {
        visible: false,
        signYearList: [],
        dataForm: {
          id: 0,
          agentEntName: '',
          agentAccount: '',
          name: '',
          mobile: '',
          currYear: (new Date()).getFullYear(),
          nextYear: (new Date()).getFullYear()+1,
          signYears: [],
          province: ''
        },
        dataRule: {
          agentEntName: [
            { required: true, message: '代理商名称不能为空', trigger: 'blur' }
          ],
          agentAccount: [
            { required: true, message: '代理商账号不能为空', trigger: 'blur' },
            { validator: checkExist, trigger: 'blur' }
          ],
          name: [
            { required: true, message: '联系人姓名不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '联系方式不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      containsValue: function (arr, val) {
        if (arr&&arr.length>0) {
          for (let index = 0; index < arr.length; index++) {
            const ele = arr[index];
            if (ele === val) {
              return true
            }
          }
        }
        return false
      },
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/profit/agent/signyears/' + this.dataForm.id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.signYearList = data && data.code === 200 ? data.data : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/profit/agent/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.agentEntName = data.data.agentEntName
                this.dataForm.agentAccount = data.data.agentAccount
                this.dataForm.name = data.data.name
                this.dataForm.mobile = data.data.mobile
                this.dataForm.currYear = data.data.currYear
                this.dataForm.signYears = data.data.signYears
                if (data.data.province) {
                  for (let i of kdloanprovinces) {
                    if (i['FCODE'] == data.data.province) {
                      this.dataForm.province = i['FNAME']
                    }
                  }
                }
              }
            })
          }
        })
      },
      querySearchAsync (queryString, callback) {
        let results = []
        for (let i of kdloanprovinces) {
          if (i['FNAME'].indexOf(queryString) !== -1) {
            results.push({
              value: i['FNAME'],
              province: i['FCODE']
            })
          }
        }
        callback(results)
      },
      handleSelect (item) {
        this.dataForm.provice = item.FCODE
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/profit/agent/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'agentEntName': this.dataForm.agentEntName,
                'agentAccount': this.dataForm.agentAccount,
                'name': this.dataForm.name,
                'mobile': this.dataForm.mobile,
                'provice': this.dataForm.provice,
                'signYears': this.dataForm.signYears
              })
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
          }
        })
      }
    }
  }
</script>
