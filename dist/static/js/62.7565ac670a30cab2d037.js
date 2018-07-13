webpackJsonp([62],{OYy5:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});e("4Xi4");var i=e("DtDh"),o=e("E4LH"),n={data:function(){return{dataForm:{id:"",bizCustId:"",bizInfoId:"",entName:"",entCreditCode:"",entLegalOptName:"",entLegalOptMobile:"",payTypeDictId:""},dataRule:{entName:[{required:!0,message:"企业名称不能为空",trigger:"blur"}],entCreditCode:[{required:!0,message:"统一社会信用代码不能为空",trigger:"blur"}],entLegalOptName:[{required:!0,message:"法定代表人姓名不能为空",trigger:"blur"}],entLegalOptMobile:[{required:!0,message:"手机号码不能为空",trigger:"blur"},{validator:function(t,a,e){Object(o.b)(a)?e():e(new Error("手机号格式错误"))},trigger:"blur"}],payTypeDictId:[{required:!0,message:"还款方式不能为空",trigger:"blur"}]},dataPostLoading:!1,followupVisible:!1,addLogVisible:!1,bizId:"",applyId:"",entName:"",entCreditCode:"",entLegalOptName:"",entLegalOptMobile:"",wantLoanAmt:"",wantLoanLimt:"",payTypeDictId:"",dataListLoading:!1,dataInfoList:[],fpss:[],callTypes:[],dataLogListLoading:!1,dataLogList:[],payTypeDics:[],pageIndex:1,pageSize:10,totalPage:0}},components:{Add:i.default},created:function(){var t=this;this.$http({url:this.$http.adornUrl("/biz/info/allpaytypes"),method:"get",params:this.$http.adornParams()}).then(function(a){var e=a.data;e&&200===e.code&&e.data&&(t.payTypeDics=e.data)})},methods:{init:function(t,a){this.followupVisible=!0,this.bizId=t,this.applyId=a,this.getFpsOptions(),this.getCallTypeOptions(),this.getLogDetailDataInfo(),this.getDataInfo(),this.getLogDataInfo()},valueMoneyFormat:function(t,a){return(t.wantLoanAmt||0)/1e6},valueFollowUpStatusFormat:function(t,a){var e=t.bizCurrFollowUpStatusDictId,i="未定义";return this.fpss.forEach(function(t){t.id===e&&(i=t.value)}),i},valueFollowUpCallFormat:function(t,a){var e=t.followUpCallDictId,i="未定义";return this.callTypes.forEach(function(t){t.id===e&&(i=t.value)}),i},getFpsOptions:function(){var t=this;this.$http({url:this.$http.adornUrl("/biz/info/allfps"),method:"post"}).then(function(a){var e=a.data;e&&200===e.code&&e.data?t.fpss=e.data:t.fpss=[]})},getCallTypeOptions:function(){var t=this;this.$http({url:this.$http.adornUrl("/biz/info/allcalltypes"),method:"get",params:this.$http.adornParams()}).then(function(a){var e=a.data;e&&200===e.code&&e.data&&(t.callTypes=e.data)})},getLogDataInfo:function(){var t=this;this.$http({url:this.$http.adornUrl("/biz/infofuplog/listApply/"+this.bizId+"/"+this.applyId),method:"get",data:this.$http.adornParams()}).then(function(a){var e=a.data;e&&200===e.code&&e.data?t.dataLogList=e.data:t.dataLogList=[]})},getLogDetailDataInfo:function(){var t=this;this.dataLogListLoading=!0,this.$http({url:this.$http.adornUrl("/biz/infodetail/info"),method:"post",data:this.$http.adornData({bizInfoId:this.bizId})}).then(function(a){var e=a.data;e&&200===e.code&&e.data&&(t.dataForm=e.data,t.dataForm.wantLoanAmt=(t.dataForm.wantLoanAmt||0)/1e6),t.dataLogListLoading=!1})},getDataInfo:function(){var t=this;this.dataListLoading=!0,this.$http({url:this.$http.adornUrl("/biz/order/getApply"),method:"post",data:this.$http.adornParams({applyId:this.applyId,bizInfoId:this.bizId})}).then(function(a){var e=a.data;e&&200===e.code&&e.data?t.dataInfoList=e.data.list:t.dataInfoList=[],t.dataListLoading=!1})},okHandle:function(){var t=this;this.dataPostLoading=!0,this.$http({url:this.$http.adornUrl("/biz/infodetail/"+(this.dataForm.id?"update":"save")),method:"post",data:this.$http.adornParams({id:this.dataForm.id||void 0,bizInfoId:this.bizId,wantLoanAmt:1e6*(this.dataForm.wantLoanAmt||0),wantLoanLimt:this.dataForm.wantLoanLimt,payTypeDictId:this.dataForm.payTypeDictId,entName:this.dataForm.entName,entCreditCode:this.dataForm.entCreditCode,entLegalOptName:this.dataForm.entLegalOptName,entLegalOptMobile:this.dataForm.entLegalOptMobile})}).then(function(a){var e=a.data;e&&200===e.code?t.$message.success("保存成功"):t.$message.error(e.msg),t.dataPostLoading=!1})},translateHandle:function(){var t=this;this.dataForm.bizCustId?this.$message.error("已经是平台用户，不能再转"):this.$refs.dataForm.validate(function(a){a&&(t.dataPostLoading=!0,t.$http({url:t.$http.adornUrl("/biz/infodetail/traslate"),method:"post",data:t.$http.adornParams({id:t.dataForm.id||void 0,bizInfoId:t.bizId,wantLoanAmt:1e6*(t.dataForm.wantLoanAmt||0),wantLoanLimt:t.dataForm.wantLoanLimt,payTypeDictId:t.dataForm.payTypeDictId,entName:t.dataForm.entName,entCreditCode:t.dataForm.entCreditCode,entLegalOptName:t.dataForm.entLegalOptName,entLegalOptMobile:t.dataForm.entLegalOptMobile})}).then(function(a){var e=a.data;e&&200===e.code?t.$message.success("保存成功"):t.$message.error("转化失败"),t.dataPostLoading=!1}))})},addHandle:function(){var t=this;this.addLogVisible=!0;var a=this.bizId,e=this.applyId;this.$nextTick(function(){t.$refs.add.init(a,e)})}}},l={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.dataPostLoading,expression:"dataPostLoading"}],staticClass:"mod-order-followup",staticStyle:{position:"relative","z-index":"2000"}},[e("el-dialog",{attrs:{title:"订单跟进","close-on-click-modal":!1,visible:t.followupVisible},on:{"update:visible":function(a){t.followupVisible=a}}},[e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:t.dataInfoList,border:""}},[e("el-table-column",{attrs:{prop:"mobile","header-align":"center",align:"center",label:"注册人手机号"}}),t._v(" "),e("el-table-column",{attrs:{prop:"companyName","header-align":"center",align:"center",width:"110",label:"企业名称"}}),t._v(" "),e("el-table-column",{attrs:{prop:"legalName","header-align":"center",align:"center",width:"150","show-overflow-tooltip":!0,label:"法人代表姓名"}}),t._v(" "),e("el-table-column",{attrs:{prop:"loanAmount","header-align":"center",align:"center",width:"100","show-overflow-tooltip":!0,label:"需求金额（万元）"}}),t._v(" "),e("el-table-column",{attrs:{prop:"loanLimit","header-align":"center",align:"center",width:"100",label:"需求期限（月）"}}),t._v(" "),e("el-table-column",{attrs:{prop:"productLine","header-align":"center",align:"center",width:"150",label:"客户来源"}}),t._v(" "),e("el-table-column",{attrs:{prop:"followPerson","header-align":"center",align:"center",width:"100",label:"跟进人"}}),t._v(" "),e("el-table-column",{attrs:{prop:"applyDate","header-align":"center",align:"center",width:"180",label:"申貸时间"}}),t._v(" "),e("el-table-column",{attrs:{prop:"linkApply","header-align":"center",align:"center",width:"180",label:"关联申请单"}})],1),t._v(" "),e("el-form",{attrs:{inline:!0}},[e("el-form-item",[e("div",[t._v("  ")])])],1),t._v(" "),e("el-form",{attrs:{inline:!0}},[e("el-form-item",[e("h5",[t._v("跟进记录")])])],1),t._v(" "),e("el-form",{attrs:{inline:!0}},[e("el-form-item",[t.isAuth("biz:infofuplog:save")?e("el-button",{attrs:{type:"success"},on:{click:function(a){t.addHandle()}}},[t._v("新增")]):t._e()],1)],1),t._v(" "),e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.dataLogListLoading,expression:"dataLogListLoading"}],staticStyle:{width:"100%"},attrs:{data:t.dataLogList,border:""}},[e("el-table-column",{attrs:{prop:"followUperName","header-align":"center",align:"center",label:"跟进人"}}),t._v(" "),e("el-table-column",{attrs:{prop:"followUpCallDictId","header-align":"center",align:"center",label:"电话接通情况",formatter:t.valueFollowUpCallFormat}}),t._v(" "),e("el-table-column",{attrs:{prop:"followUpCallDesp","header-align":"center",align:"center",width:"150","show-overflow-tooltip":!0,label:"详细描述"}}),t._v(" "),e("el-table-column",{attrs:{prop:"createdTime","header-align":"center",align:"center",width:"180",label:"创建时间"}})],1),t._v(" "),e("el-form",{attrs:{inline:!0}},[e("el-form-item",[e("div",[t._v("  ")])])],1)],1),t._v(" "),t.addLogVisible?e("add",{ref:"add",on:{refreshDataList:t.getLogDataInfo}}):t._e()],1)},staticRenderFns:[]},r=e("vSla")(n,l,!1,null,null,null);a.default=r.exports}});