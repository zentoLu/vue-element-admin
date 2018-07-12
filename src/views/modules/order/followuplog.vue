<template>
  <el-dialog
    title="新增"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="电话接听情况" prop="followUpCallDictId">
          <el-select v-model="dataForm.followUpCallDictId" placeholder="请选择电话接听情况">
            <el-option
             v-for="(item, index) in callTypes"
             :key="index"
             :label="item.value"
             :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="详细描述" prop="followUpCallDesp">
        <el-input type="textarea" :rows="10" placeholder="请输入回访内容" v-model="dataForm.followUpCallDesp"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="isAuth('biz:infofuplog:save')" type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        bizInfoId: "",
        followUpCallDictId: "",
        followUpCallDesp: "",
        bizCurrFollowUpStatusDictId: ""
      },
      callTypes: [],
      fpss: [],
      dataRule: {
        bizCurrFollowUpStatusDictId: [
          { required: true, message: "参数值不能为空", trigger: "blur" }
        ],
        followUpCallDictId: [
          { required: true, message: "参数值不能为空", trigger: "blur" }
        ],
        followUpCallDesp: [
          { required: true, message: "参数值不能为空", trigger: "blur" }
        ]
      },
      applyId: ""
    };
  },
  methods: {
    init(id, applyId) {
      this.dataForm.bizInfoId = id;
      this.applyId = applyId;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.getCallTypeOptions();
        this.getFpsOptions();
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
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/biz/infofuplog/save`),
            method: "post",
            data: this.$http.adornData({
              bizInfoId: this.dataForm.bizInfoId,
              applyId: this.applyId,
              bizCurrFollowUpStatusDictId: this.dataForm
                .bizCurrFollowUpStatusDictId,
              followUpCallDictId: this.dataForm.followUpCallDictId,
              followUpCallDesp: this.dataForm.followUpCallDesp
            })
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
