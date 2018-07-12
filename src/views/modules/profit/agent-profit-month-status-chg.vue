<template>
  <el-dialog
    title="修改结算状态"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="当前状态" prop="currProfitStatus">
          <el-select v-model="dataForm.currProfitStatus" placeholder="请选择结算状态">
            <el-option
             v-for="item in statuss"
             :key="item.val"
             :label="item.val"
             :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          agentAccount: '',
          currProfitStatus: '',
          date:''
        },
        statuss:[
          {id:'',val:'全部'},
          {id:0,val:'当期未结算'},
          {id:1,val:'当期已结算'}
        ]
      }
    },
    methods: {
      init (id,month,status) {
        this.dataForm.agentAccount = id
        this.dataForm.date = month
        this.dataForm.currProfitStatus = status
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
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
    }
  }
</script>
