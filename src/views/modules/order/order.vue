<template>
    <div class="mod-order">
         <el-form :inline="true" :model="dataForm" >
             <div>
             <table>
               <tr>
                 <td><el-form-item class="em-label" label="注册手机号">
                    <el-input v-model="dataForm.mobile" clearable></el-input>
              </el-form-item></td>
                 <td><el-form-item label="企业名称">
                    <el-input  v-model="dataForm.companyName" clearable></el-input>
               </el-form-item></td>
                 <td><el-form-item class="em-label" label="法人代表姓名">
                    <el-input  v-model="dataForm.legalName" clearable></el-input>
               </el-form-item></td>
               </tr>
               <tr><td><el-form-item  class="em-label" label="时间">
              <el-date-picker
                v-model="dataForm.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker></el-form-item></td>
                <td><el-form-item label="客户来源" prop="typeId">
                   <el-select v-model="dataForm.productLine" clearable  placeholder="请选择">
                    <el-option
             v-for="(item, index) in agentLevels"
             :key="index"
             :label="item"
             :value="item">
            </el-option>
                  </el-select>
            </el-form-item></td>
            <td><el-form-item class="em-label" label="已录入申贷资料" prop="typeId">
                   <el-select v-model="dataForm.state" clearable  placeholder="请选择">
                    <el-option  v-for="item in loanstate"  :key="item.state" :label="item.name" :value="item.state">
                     </el-option>
                  </el-select>
            </el-form-item></td>
              </tr>
             </table>



             </div>
             <div>
             </div>
     <div>
          <el-form-item>
        <el-button  @click="getDataList()">查询</el-button>
          </el-form-item>
     </div>

         </el-form>

          <el-table  :data="dataList" border v-loading="dataListLoading"   style="width: 100%;">
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
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="legalName"
        header-align="center"
        align="center"
        label="法人代表名称">
      </el-table-column>
      <el-table-column
        prop="loanAmount"
        header-align="center"
        align="center"
        width="180"
        label="贷款金额（万元）">
      </el-table-column>
      <el-table-column
        prop="loanLimit"
        header-align="center"
        align="center"
        width="180"
        label="贷款期限（月）">
      </el-table-column>
      <el-table-column
        prop="productLine"
        header-align="center"
        align="center"
        label="客户来源">
      </el-table-column>
      <el-table-column
        prop="state"
        header-align="center"
        align="center"
        label="贷款状态">
         <template slot-scope="scope">
           <p v-if="scope.row.state===-4" size="small" type="danger">已发起贷款申请</p>
           <p v-if="scope.row.state===99" size="small" type="danger"> 贷款机构申请未完成</p>
           <p v-if="scope.row.state===-3" size="small" type="danger">已录入申贷资料</p>
           <p v-if="scope.row.state===0" size="small" type="danger">已同意数据授权</p>
           <p v-if="scope.row.state===1" size="small" type="danger">已完成申请</p>
            <p v-if="scope.row.state===2" size="small" type="danger">贷款机构审批中</p>
           <p v-if="scope.row.state===3" size="small" type="danger">贷款机构审批通过</p>
           <p v-if="scope.row.state===6" size="small" type="danger">贷款还款中</p>
           <p v-if="scope.row.state===4" size="small" type="danger">准入拒绝</p>
           <p v-if="scope.row.state===7" size="small" type="danger">贷款已完结</p>
            <p v-if="scope.row.state===11" size="small" type="danger">客户资料补充中</p>
           <p v-if="scope.row.state===98" size="small" type="danger">已完成征信授权</p>
           <p v-if="scope.row.state===97" size="small" type="danger">待支用</p>
           <p v-if="scope.row.state===5" size="small" type="danger">贷款已发放</p>
           <p v-if="scope.row.state===9" size="small" type="danger">审批拒绝</p>
            <p v-if="scope.row.state===12" size="small" type="danger">贷款机构受理中</p>
            <p v-if="scope.row.state===8" size="small" type="danger">客户放弃</p>
           <p v-if="scope.row.state===15" size="small" type="danger">已签署服务费合同</p>
           <p v-if="scope.row.state===16" size="small" type="danger">已收取服务费</p>
           <p v-if="scope.row.state===13" size="small" type="danger">贷款机构申请未完成</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="followPerson"
        header-align="center"
        align="center"
        label="跟进人">
      </el-table-column>
      <el-table-column
        prop="applyDate"
        header-align="center"
        align="center"
        label="申请时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="checkDetail(scope)">查看详情</el-button>
          <el-button  type="text" size="small" @click="followupHandle(scope.row.bizInfoId,scope.row.id)">跟进</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
<followup v-if="followupVisible" ref="followup"></followup>
    </div>

</template>
<script>
import "@/assets/css/app.css";
import Vue from "vue";
import Followup from "./followup";
import { Option, DatePicker } from "element-ui";
import Tool from "@/utils/tool";
Vue.component(Option.name, Option);
Vue.component(DatePicker.name, DatePicker);

export default {
  data() {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      agentLevels: [],
      dataListLoading: false,
      followupVisible: false,
      dataListSelections: [],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      options: [
        {
          value: "kisline",
          label: "KIS产品线"
        },
        {
          value: "zhjline",
          label: "ZHJ产品线"
        },
        {
          value: "jdyline",
          label: "JDY产品线"
        },
        {
          value: "KIS代理商",
          label: "KIS代理商"
        },
        {
          value: "PC端产品需求登记",
          label: "PC端产品需求登记"
        },
        {
          value: "移动端产品需求登记",
          label: "移动端产品需求登记"
        }
      ],
      loanstate: [
        {
          state: -4,
          name: "已发起贷款申请"
        },
        {
          state: -3,
          name: "已录入申贷资料"
        },
        {
          state: 0,
          name: "已同意数据授权"
        },
        {
          state: 1,
          name: "完成申请"
        },
        {
          state: 11,
          name: "客户资料补充中"
        },
        {
          state: 13,
          name: "贷款逾期"
        },
        {
          state: 12,
          name: "贷款机构受理中"
        },

        {
          state: 2,
          name: "贷款机构申请中"
        },
        {
          state: 4,
          name: "准入拒绝"
        },
        {
          state: 3,
          name: "审批通过"
        },
        {
          state: 9,
          name: "审批拒绝"
        },
        {
          state: 7,
          name: "贷款已完结"
        },
        {
          state: 5,
          name: "贷款已发放"
        },
        {
          state: 6,
          name: "贷款还款中"
        },
        {
          state: 98,
          name: "已完成征信授权"
        },
        {
          state: 99,
          name: "贷款机构申请未完成"
        },
        {
          state: 97,
          name: "待支用"
        },
        {
          state: 15,
          name: "已签署服务费合同"
        },
        {
          state: 16,
          name: "已收取服务费"
        }
      ],

      defaultvalue: "",
      defaultstate: "",
      dataForm: {
        mobile: "",
        companyName: "",
        legalName: "",
        startDate: "",
        state: "",
        productLine: "",
        endDate: ""
      },

      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      startDate: "",
      value7: ""
    };
  },
  components: {
    Followup
  },
  created() {
    this.getDataList();
    this.getLevelOptions();
  },
  methods: {
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
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      console.log(this.dataForm.date);
      var date = this.dataForm.date || [];
      this.$http({
        url: this.$http.adornUrl("/biz/order/list"),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          mobile: this.dataForm.mobile,
          companyName: this.dataForm.companyName,
          legalName: this.dataForm.legalName,
          startDate: date[0] ? Tool.formatDate(date[0], "-") : null,
          state: this.dataForm.state,
          productLine: this.dataForm.productLine,
          endDate: date[1] ? Tool.formatDate(date[1], "-") : null
        })
      })
        .then(({ data }) => {
          if (data && data.code === 200) {
            this.dataList = data.data.list;
            this.totalPage = data.data.totalCount;
          } else {
            this.dataList = [];
            this.totalPage = 0;
          }
          this.dataListLoading = false;
        })
        .catch(({ data }) => {
          this.dataList = [];
          this.dataListLoading = false;
        });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      // this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 查看详情
    checkDetail(scope) {
      console.log(scope, scope.row.id);
      this.$router.push({ name: "order-detail", query: scope.row.id });
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    followupHandle(id, applyId) {
      this.followupVisible = true;
      this.$nextTick(() => {
        this.$refs.followup.init(id, applyId);
      });
    },
    // 删除
    deleteHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${userIds.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/user/delete"),
            method: "post",
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
.mod-order .el-date-editor .el-range-separator {
  margin: 0 5px;
  padding: 0;
}
.em-label .el-form-item__label {
  display: inline-block;
  width: 8em;
}
.mod-order-followup {
  position: relative;
  z-index: 2000;
}
.v-modal {
  z-index: 1999 !important;
}
</style>