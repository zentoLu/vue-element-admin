<template>
    <div class="cust-manage">
      <el-table
        :data="apply.applyRcordsList"
        border
        v-loading="dataListLoading"
        style="width: 100%">
        <el-table-column
          prop="createdate"
          header-align="center"
          align="center"
          width="220"
          label="处理时间">
        </el-table-column>
        <el-table-column
          prop="content"
          header-align="center"
          align="center"
          label="处理步骤">
        </el-table-column>
      </el-table>
      <div class="data-table" id="data_table">
      <table align="center" style="width: 100%">
        <tbody><tr>
          <td width="33%" align="center"><strong>用户信息</strong></td>
          <td width="33%" align="center"><strong>上传软件信息</strong></td>
          <td width="33%" align="center"><strong>贷款审批信息</strong></td>
        </tr>
        <tr>
          <td>
            <table align="center">
              <tbody><tr>
                <td>客户ID：</td>
                <td>{{apply.apply.custId}}</td>
              </tr>
              <tr>
                <td>客户账号:</td>
                <td id="custName" onclick="change('custName',31334)">{{apply.user.number}}</td>
              </tr>
              <tr>
                <td>最近登录时间:</td>
                <td>{{apply.userLogin.createdate}}</td>

              </tr>
              <tr>
                <td>推荐人账号：</td>
                <td></td>
              </tr>
            </tbody></table>
          </td>
          <td>
            <table align="center">
              <tbody><tr>
                <td>是否已经上传数据：</td>
                <td>
                  <p v-if="apply.dataUpload!=null">
                    <a href="javascript:void(0);" onclick="showUploadDeatail()">
                      是</a> </p>
                  <p v-if="apply.dataUpload==null">否</p>
                   </td>
              </tr>
              <tr>
                <td>上传时间：<p v-if="apply.dataUpload!=null">{{apply.dataUpload.createdate}}</p></td>
                <td>
                   
                  </td>
              </tr>
              <tr>
                <td>软件版本</td>
                <td><p v-if="apply.dataUpload!=null">{{apply.dataUpload.client}}</p></td>
              </tr>
            </tbody></table>
          </td>
          <td>
            <table align="center">
              <tbody><tr>
                <td>申请ID:</td>
                <td>{{apply.apply.id}}</td>
              </tr>
              <tr>
                <td>审批额度：</td>
                <td>{{apply.apply.creditAmt}}万元</td>
              </tr>
              <tr>
                <td>发放额度：</td>
                <td>{{apply.apply.grantAmt}}万元</td>
              </tr>
            </tbody></table>
          </td>


        </tr>
      </tbody></table>
    </div>
    <div class="block">
      <el-container>
        <el-container>
          <el-header>贷款信息</el-header>
          <el-main>
            <div class="loan-info">
              <el-row :gutter="20">
                <el-col :span="20">贷款产品：{{apply.product.name}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10">申请金额：{{apply.apply.loanAmount}}万元</el-col>
                <el-col :span="10">贷款期限：{{apply.apply.loanLimit}}个月</el-col>
              </el-row>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div class="block">
      <el-container>
        <el-container>
          <el-header>法人信息</el-header>
          <el-main>
              <el-row :gutter="14">
                <el-col :span="7">姓名：<el-label v-if="apply.Material!=null"> {{apply.Material.legalname}}</el-label></el-col>
                <el-col :span="7">身份证号码：<el-label v-if="apply.Material!=null"> {{apply.Material.legalidno}}</el-label></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10">手机号码： <el-label v-if="apply.Material!=null">{{apply.Material.legaltel}}</el-label></el-col>
                <el-col :span="10"></el-col>
              </el-row>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div class="block">
      <el-container>
        <el-container>
          <el-header>企业信息</el-header>
          <el-main>
            <div class="loan-info">
              <el-row :gutter="20">
                <el-col :span="10">公司名称：<el-label v-if="apply.Material!=null">{{apply.Material.custname}}</el-label></el-col>
                <el-col :span="10">社会信用代码：<el-label v-if="apply.Material!=null">  {{apply.Material.socialCerditCode}}</el-label></el-col>
              </el-row>
              <el-row :gutter="20">
               
               <el-col :span="10">控制人姓名：<el-label v-if="apply.Material!=null">{{apply.Material.ownerName}}</el-label></el-col>
                 <el-col :span="10">公司名称：<el-label v-if="apply.Material!=null">{{apply.Material.ownerPhone}}</el-label></el-col>
              </el-row>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div class="block">
      <el-container>
        <el-container>
          <el-header>服务费相关信息</el-header>
          <el-main>
            <div class="loan-info">
              <el-row :gutter="30">
                <el-col :span="10">合同编号：<el-label v-if="apply.serviceCharge!=null">{{apply.serviceCharge.contractNo}}</el-label></el-col>
                <el-col :span="10">合同下载地址：<el-label v-if="apply.serviceCharge!=null">   <a target="_blank" :href="apply.serviceCharge.downloadUrl">点击查看</a></el-label></el-col>
                <el-col :span="10">合同查看地址：<el-label v-if="apply.serviceCharge!=null">  <a  target="_blank" :href="apply.serviceCharge.previewOfPcUrl">点击查看</a> </el-label></el-col>
              </el-row>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div> 
    </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      dataListLoading: false
    };
  },
  created() {
    console.log(this.$route.query);
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/order/findDetail"),
        method: "post",
        data: this.$http.adornParams({
          applyId: this.$route.query
          //applyId: 31332
        })
      }).then(({ data }) => {
        var apply = JSON.parse(data.data);
        console.log(apply);
        if (data && data.code === 200) {
          this.apply = apply;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    }
  }
};
</script>
<style lang="scss">
.data-table {
  padding: 18px 17px 28px;
  table {
    border: 1px solid #e5e4e4;
    width: 100%;
    td {
      height: 34px;
    }
    th,
    td {
      border: 1px solid #e5e4e4;
      padding: 3px 5px;
      font-size: 12px;
      font-weight: 400;
    }
  }
}
.block {
  margin-bottom: 20px;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  font-size: 26px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  line-height: 40px;
}
</style>
