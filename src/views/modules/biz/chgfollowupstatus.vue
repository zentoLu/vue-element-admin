<template>
  <el-dialog
    title="新增"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="当前状态" prop="bizCurrFollowUpStatusDictId">
          <el-select v-model="dataForm.bizCurrFollowUpStatusDictId" placeholder="请选择状态">
            <el-option
             v-for="item in fpss"
             :key="item.id"
             :label="item.value"
             :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="isAuth('biz:infodetail:update')" type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          bizInfoId: '',
          bizCurrFollowUpStatusDictId: ''
        },
        fpss: [],
        dataRule: {
          bizCurrFollowUpStatusDictId: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id, statusId) {
        this.dataForm.bizInfoId = id
        this.dataForm.bizCurrFollowUpStatusDictId = statusId
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.getFpsOptions()
        })
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/infodetail/updatestatus/${this.dataForm.bizInfoId}/${this.dataForm.bizCurrFollowUpStatusDictId}`),
              method: 'post',
              data: this.$http.adornData({})
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
