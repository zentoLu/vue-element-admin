<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="登录用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="登录帐号" :disabled="dataForm.id>0"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realname">
        <el-input v-model="dataForm.realname" placeholder="姓名" :disabled="dataForm.id>0"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱" :disabled="dataForm.id>0"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号" :disabled="dataForm.id>0"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.id">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      var checkRealNameExist = (rule, value, callback) => {
        if (this.dataForm.id) {
          callback()
        }
        this.$http({
          url: this.$http.adornUrl(`/sys/user/exist`),
          method: 'post',
          data: this.$http.adornData({
            'realname': value
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            if (data.data) {
              callback(new Error('用户名已经存在'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        })
      }
      var checkUserNameExist = (rule, value, callback) => {
        if (this.dataForm.id) {
          callback()
        }
        this.$http({
          url: this.$http.adornUrl(`/sys/user/exist`),
          method: 'post',
          data: this.$http.adornData({
            'username': value
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            if (data.data) {
              callback(new Error('登录用户名已经存在'))
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
        roleList: [],
        dataForm: {
          id: 0,
          username: '',
          realname: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1
        },
        dataRule: {
          username: [
            { required: true, message: '登录用户名不能为空', trigger: 'blur' },
            { validator: checkUserNameExist, trigger: 'blur' }
          ],
          realname: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { validator: checkRealNameExist, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码为空', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 200 ? data.data : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.username = data.data.username
                this.dataForm.realname = data.data.realname
                this.dataForm.salt = data.data.salt
                this.dataForm.email = data.data.email
                this.dataForm.mobile = data.data.mobile
                this.dataForm.roleIdList = data.data.roleIdList
                this.dataForm.status = data.data.status
              }
            })
          }
        })
      },
      userExist (username, realname) {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/exist`),
          method: 'post',
          data: this.$http.adornData({
            'username': username,
            'realname': realname
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            if (data.data) {
              return true
            } else {
              return false
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'username': this.dataForm.username,
                'realname': this.dataForm.realname,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList
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
