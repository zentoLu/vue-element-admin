webpackJsonp([8],{EEaH:function(t,a,e){(t.exports=e("BkJT")(!1)).push([t.i,"\n.data-table {\n  padding: 18px 17px 28px;\n}\n.data-table table {\n    border: 1px solid #e5e4e4;\n    width: 100%;\n}\n.data-table table td {\n      height: 34px;\n}\n.data-table table th,\n    .data-table table td {\n      border: 1px solid #e5e4e4;\n      padding: 3px 5px;\n      font-size: 12px;\n      font-weight: 400;\n}\n.block {\n  margin-bottom: 20px;\n}\n.el-header,\n.el-footer {\n  background-color: #b3c0d1;\n  color: #333;\n  text-align: center;\n  line-height: 60px;\n  font-size: 26px;\n}\n.el-aside {\n  background-color: #d3dce6;\n  color: #333;\n  text-align: center;\n  line-height: 200px;\n}\n.el-main {\n  background-color: #e9eef3;\n  color: #333;\n  line-height: 40px;\n}\n",""])},FXpQ:function(t,a,e){var l=e("EEaH");"string"==typeof l&&(l=[[t.i,l,""]]),l.locals&&(t.exports=l.locals);e("8bSs")("81295ada",l,!0)},"e+Et":function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l={data:function(){return{dataList:[],dataListLoading:!1}},created:function(){console.log(this.$route.query),this.getDataList()},methods:{getDataList:function(){var t=this;this.dataListLoading=!0,this.$http({url:this.$http.adornUrl("/biz/order/findDetail"),method:"post",data:this.$http.adornParams({applyId:this.$route.query})}).then(function(a){var e=a.data,l=JSON.parse(e.data);console.log(l),e&&200===e.code?t.apply=l:(t.dataList=[],t.totalPage=0),t.dataListLoading=!1})}}},n={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"cust-manage"},[e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:t.apply.applyRcordsList,border:""}},[e("el-table-column",{attrs:{prop:"createdate","header-align":"center",align:"center",width:"220",label:"处理时间"}}),t._v(" "),e("el-table-column",{attrs:{prop:"content","header-align":"center",align:"center",label:"处理步骤"}})],1),t._v(" "),e("div",{staticClass:"data-table",attrs:{id:"data_table"}},[e("table",{staticStyle:{width:"100%"},attrs:{align:"center"}},[e("tbody",[t._m(0),t._v(" "),e("tr",[e("td",[e("table",{attrs:{align:"center"}},[e("tbody",[e("tr",[e("td",[t._v("客户ID：")]),t._v(" "),e("td",[t._v(t._s(t.apply.apply.custId))])]),t._v(" "),e("tr",[e("td",[t._v("客户账号:")]),t._v(" "),e("td",{attrs:{id:"custName",onclick:"change('custName',31334)"}},[t._v(t._s(t.apply.user.number))])]),t._v(" "),e("tr",[e("td",[t._v("最近登录时间:")]),t._v(" "),e("td",[t._v(t._s(t.apply.userLogin.createdate))])]),t._v(" "),t._m(1)])])]),t._v(" "),e("td",[e("table",{attrs:{align:"center"}},[e("tbody",[e("tr",[e("td",[t._v("是否已经上传数据：")]),t._v(" "),e("td",[null!=t.apply.dataUpload?e("p",[e("a",{attrs:{href:"javascript:void(0);",onclick:"showUploadDeatail()"}},[t._v("\n                  是")])]):t._e(),t._v(" "),null==t.apply.dataUpload?e("p",[t._v("否")]):t._e()])]),t._v(" "),e("tr",[e("td",[t._v("上传时间："),null!=t.apply.dataUpload?e("p",[t._v(t._s(t.apply.dataUpload.createdate))]):t._e()]),t._v(" "),e("td")]),t._v(" "),e("tr",[e("td",[t._v("软件版本")]),t._v(" "),e("td",[null!=t.apply.dataUpload?e("p",[t._v(t._s(t.apply.dataUpload.client))]):t._e()])])])])]),t._v(" "),e("td",[e("table",{attrs:{align:"center"}},[e("tbody",[e("tr",[e("td",[t._v("申请ID:")]),t._v(" "),e("td",[t._v(t._s(t.apply.apply.id))])]),t._v(" "),e("tr",[e("td",[t._v("审批额度：")]),t._v(" "),e("td",[t._v(t._s(t.apply.apply.creditAmt)+"万元")])]),t._v(" "),e("tr",[e("td",[t._v("发放额度：")]),t._v(" "),e("td",[t._v(t._s(t.apply.apply.grantAmt)+"万元")])])])])])])])])]),t._v(" "),e("div",{staticClass:"block"},[e("el-container",[e("el-container",[e("el-header",[t._v("贷款信息")]),t._v(" "),e("el-main",[e("div",{staticClass:"loan-info"},[e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:20}},[t._v("贷款产品："+t._s(t.apply.product.name))])],1),t._v(" "),e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:10}},[t._v("申请金额："+t._s(t.apply.apply.loanAmount)+"万元")]),t._v(" "),e("el-col",{attrs:{span:10}},[t._v("贷款期限："+t._s(t.apply.apply.loanLimit)+"个月")])],1)],1)])],1)],1)],1),t._v(" "),e("div",{staticClass:"block"},[e("el-container",[e("el-container",[e("el-header",[t._v("法人信息")]),t._v(" "),e("el-main",[e("el-row",{attrs:{gutter:14}},[e("el-col",{attrs:{span:7}},[t._v("姓名："),null!=t.apply.Material?e("el-label",[t._v(" "+t._s(t.apply.Material.legalname))]):t._e()],1),t._v(" "),e("el-col",{attrs:{span:7}},[t._v("身份证号码："),null!=t.apply.Material?e("el-label",[t._v(" "+t._s(t.apply.Material.legalidno))]):t._e()],1)],1),t._v(" "),e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:10}},[t._v("手机号码： "),null!=t.apply.Material?e("el-label",[t._v(t._s(t.apply.Material.legaltel))]):t._e()],1),t._v(" "),e("el-col",{attrs:{span:10}})],1)],1)],1)],1)],1),t._v(" "),e("div",{staticClass:"block"},[e("el-container",[e("el-container",[e("el-header",[t._v("企业信息")]),t._v(" "),e("el-main",[e("div",{staticClass:"loan-info"},[e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:10}},[t._v("公司名称："),null!=t.apply.Material?e("el-label",[t._v(t._s(t.apply.Material.custname))]):t._e()],1),t._v(" "),e("el-col",{attrs:{span:10}},[t._v("社会信用代码："),null!=t.apply.Material?e("el-label",[t._v("  "+t._s(t.apply.Material.socialCerditCode))]):t._e()],1)],1),t._v(" "),e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:10}},[t._v("控制人姓名："),null!=t.apply.Material?e("el-label",[t._v(t._s(t.apply.Material.ownerName))]):t._e()],1),t._v(" "),e("el-col",{attrs:{span:10}},[t._v("控制人电话："),null!=t.apply.Material?e("el-label",[t._v(t._s(t.apply.Material.ownerPhone))]):t._e()],1)],1)],1)])],1)],1)],1),t._v(" "),e("div",{staticClass:"block"},[e("el-container",[e("el-container",[e("el-header",[t._v("服务费相关信息")]),t._v(" "),e("el-main",[e("div",{staticClass:"loan-info"},[e("el-row",{attrs:{gutter:30}},[e("el-col",{attrs:{span:10}},[t._v("合同编号："),null!=t.apply.serviceCharge?e("el-label",[t._v(t._s(t.apply.serviceCharge.contractNo))]):t._e()],1),t._v(" "),e("el-col",{attrs:{span:10}},[t._v("合同下载地址："),null!=t.apply.serviceCharge?e("el-label",[e("a",{attrs:{target:"_blank",href:t.apply.serviceCharge.downloadUrl}},[t._v("点击查看")])]):t._e()],1),t._v(" "),e("el-col",{attrs:{span:10}},[t._v("合同查看地址："),null!=t.apply.serviceCharge?e("el-label",[e("a",{attrs:{target:"_blank",href:t.apply.serviceCharge.previewOfPcUrl}},[t._v("点击查看")])]):t._e()],1)],1)],1)])],1)],1)],1)],1)},staticRenderFns:[function(){var t=this.$createElement,a=this._self._c||t;return a("tr",[a("td",{attrs:{width:"33%",align:"center"}},[a("strong",[this._v("用户信息")])]),this._v(" "),a("td",{attrs:{width:"33%",align:"center"}},[a("strong",[this._v("上传软件信息")])]),this._v(" "),a("td",{attrs:{width:"33%",align:"center"}},[a("strong",[this._v("贷款审批信息")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("tr",[a("td",[this._v("推荐人账号：")]),this._v(" "),a("td")])}]};var r=e("vSla")(l,n,!1,function(t){e("FXpQ")},null,null);a.default=r.exports}});