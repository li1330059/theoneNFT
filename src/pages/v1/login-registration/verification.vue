<template>
	<Content>
		<div class="verification-wrap">
			<div class="title">风险验证</div>
			<div class="text">{{copytext.RiskTipB && copytext.RiskTipB.text}}</div>
			<div class="warn-warp" v-if="successInfo.name">
				<div :class="['warn-img',this.successInfo.success ? 'warn-img-success' : '']"></div>
				<div :class="['warn-name',this.successInfo.success ? 'warn-name-success' : '']">{{this.successInfo.name}}</div>
				<div class="warn-text">{{this.successInfo.text}}</div>
				<div class="warn-time">{{this.code_down_count}}{{this.successInfo.timeText}}</div>
			</div>
			<div :class="[riskVerifiedType==1 ? 'label-left' : '']" v-else>
				<el-tabs type="border-card">
				  <el-tab-pane v-if="riskVerifiedType!=1">
					  <div class="label" slot="label">
						  <div class="label-bank"></div>银行卡验证
					  </div>
					  <div>
						  <div class="form-text">{{copytext.BankVerifyA && copytext.BankVerifyA.text}}</div>
						  
						  <div class="form-line" v-if="riskVerifiedType==3">
						    <h1 class="form-label">银行</h1>
						    <div>
						      <div class="input-line select-line">
						        <el-input
						          v-model="bankInfoListShortNameParam.bankShortName"
						          placeholder="请选择银行"
						          @input="onSearchBank"
						        ></el-input>
						  
						        <ul v-if="bankInfoListShortNameResult && bankParam.search">
						          <li
						            v-for="(item, index) in bankInfoListShortNameResult.records"
						            :key="index"
						            @click="chooseBank(item)"
						          >
						            {{ item.bankShortName }}
						          </li>
						          <li v-if="bankInfoListShortNameResult.records.length == 0">
						            未能查询到此银行有关信息
						          </li>
						        </ul>
						      </div>
						    </div>
						  </div>
						  <div class="form-line" v-if="riskVerifiedType==3">
						    <h1 class="form-label">开户行</h1>
						    <div class="input-line select-line">
						      <el-input
						        v-model="bankInfoListParam.bankDetailName"
						        placeholder="请选择开户行"
						        @input="onSearchBankDetail"
						        :disabled="bankInfoListParam.bankShortName ? false : true"
						      ></el-input>
						      <ul v-if="bankInfoListResult && bankParam.searchDetail">
						        <li
						          v-for="(item, index) in bankInfoListResult.records"
						          :key="index"
						          @click="chooseBankDetail(item)"
						        >
						          {{ item.bankDetailName }}
						        </li>
						        <li v-if="bankInfoListResult.records.length == 0">
						          未能查询到此开户行有关信息
						        </li>
						      </ul>
						    </div>
						  </div>
						  <div class="form-line">
						    <h1 class="form-label">银行卡号</h1>
						    <div class="input-line">
						      <el-input
						        v-model="submitForm.bankcard"
						        placeholder="请输入银行卡号"
						      ></el-input>
						    </div>
						  </div>
						  <div class="btn btn-primary" @click="bankEnter" v-if="isBtnBank">下一步</div>
						  <div class="btn" v-else>下一步</div>
					  </div>
				  </el-tab-pane>
				  <el-tab-pane>
					  <div class="label" slot="label">
					  		<div class="label-id"></div>证件验证
					  </div>
					  <div class="form-text">{{copytext.IDVerify && copytext.IDVerify.text}}</div>
					  <div class="form-label">证件号后四位</div>
					  <count-idcard ref="payNum" class="count-idcard" @isEnter="isEnter"/>
					  <div class="btn btn-primary" @click="idcardEnter" v-if="isBtn">下一步</div>
					  <div class="btn" v-else>下一步</div>
				  </el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</Content>
</template>
<script>
import Content from "./component/content.vue";
import Encryption from "@/utils/encryption";
import countDown from "@/utils/countDown";
export default {
  components: {Content},
  name: "verification",
  data() {
    return {
      submit_disabled: false, //冻结提交按钮
	  bankInfoListShortNameParam: {
	    bankShortName: "",
	    pageCount: 1,
	    pageSize: 5,
	  },
	  bankParam: {
	    search: true, //开启搜索
	    searchDetail: true, //开启支行搜索
	  },
	  bankInfoListShortNameResult: null,
	  bankInfoListParam: {
	    bankDetailName: "",
	    bankShortName: "",
	    pageCount: 1,
	    pageSize: 5,
	  },
	  bankInfoListResult: null,
	  submitForm: {
	    bankUuid: "",
	    bankcard: "",
	    idcard: "",
	  },
	  userBankUpdateBankInfoParam: {
	    bankUuid: "",
	    uuid: "",
	  },
	  riskVerifiedKey:"",
	  riskVerifiedType:"",
	  isBtn:false,
	  idcardNum:"",
	  copytext:{
		  RiskTipB:{},
		  BankVerifyA:{},
		  IDVerify:{},
		  BankPass:{},
		  IDPass:{},
	  },
	  successInfo:{},
	  code_down_count: 5,
    };
  },
  computed(){
	  isBtnBank
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  computed: {
    isBtnBank() {
		if(this.riskVerifiedType==2){
			if(this.submitForm.bankcard){
				return true
			}else{
				return false
			}
		}else{
			if(this.bankInfoListShortNameParam.bankShortName&&this.bankInfoListParam.bankDetailName&&this.submitForm.bankcard){
				return true
			}else{
				return false
			}
		}
    },
  },
  created() {
	  this.riskVerifiedKey = this.$route.query.riskVerifiedKey;
	  this.riskVerifiedType = this.$route.query.riskVerifiedType;
	  this.copyWriting();
  },
  methods: {
	  async copyWriting(){
	  	const res = await this.$api.service.copy_writing();
	  	if (res.data.code == 200) {
	  		this.copytext = res.data.data;
	  	}
	  },
	  async onSearchBank() {
	    if (this.bankInfoListShortNameParam.bankShortName) {
	      this.bankParam.search = true;
	      let result = await this.$api.service.bankInfo_listShortName(
	        this.bankInfoListShortNameParam
	      );
	      this.bankInfoListShortNameResult = result.data.data;
	      this.restBankDetail();
	      console.log(`银行列表`, this.bankInfoListShortNameResult.records);
	    }
	  },
	  restBankDetail() {
	    this.bankInfoListParam.bankDetailName = "";
	    this.submitForm.bankUuid = "";
	    this.userBankUpdateBankInfoParam.bankUuid = "";
	    this.haveBankDetailName = false;
	  },
	  chooseBank(item) {
	    this.bankParam.search = false;
	    this.bankInfoListShortNameParam.bankShortName = item.bankShortName;
	    this.bankInfoListParam.bankShortName = item.bankShortName;
	  },
	  async onSearchBankDetail() {
	    if (
	      this.bankInfoListParam.bankShortName &&
	      this.bankInfoListParam.bankDetailName.length >= 2
	    ) {
	      this.bankParam.searchDetail = true;
	      let result = await this.$api.service.bankInfo_list(
	        this.bankInfoListParam
	      );
	      this.bankInfoListResult = result.data.data;
	      console.log(`支行列表`, this.bankInfoListResult.records);
	    }
	  },
	  chooseBankDetail(item) {
	    this.bankParam.searchDetail = false;
	    this.bankInfoListParam.bankDetailName = item.bankDetailName;
	    this.submitForm.bankUuid = item.uuid;
	    this.userBankUpdateBankInfoParam.bankUuid = item.uuid;
	  },
	  isEnter() {
		  let password = this.$refs.payNum.getLetters().join("");
		  if(password.length==4){
			  this.isBtn = true;
		  }else{
			  this.isBtn = false;
		  }
		  this.idcardNum = password;
		  console.dir(password)
	  },
	async bankEnter(){
		const bankcard = await Encryption.getPassword(this.submitForm.bankcard);
		if (!bankcard) {
		  this.$message.warning("银行卡加密错误");
		  return;
		}
		const res = await this.$api.service.auth_bankVerified({
		  bankUuid: this.userBankUpdateBankInfoParam.bankUuid,
		  bankCard: bankcard,
		  riskVerifiedKey: this.riskVerifiedKey
		});
		if (res.data.code == 200&&res.data.data) {
			this.goHome('银行卡验证通过',this.copytext.BankPass && this.copytext.BankPass.text);
			localStorage.setItem("authorization", res.headers.authorization);
			this.getUserAttr();
		} else {
			this.goLogin('银行卡验证失败');
		}
	},
	async idcardEnter(){
		const res = await this.$api.service.auth_idCardVerified({
		  idCard: this.idcardNum,
		  riskVerifiedKey: this.riskVerifiedKey
		});
		if (res.data.code == 200&&res.data.data) {
			this.goHome('证件验证通过',this.copytext.IDPass && this.copytext.IDPass.text);
			localStorage.setItem("authorization", res.headers.authorization);
			this.getUserAttr();
		} else {
			this.goLogin('证件验证失败');
		}
	},
	goHome(name,text) {
		this.successInfo = {
			success:true,
			name:name,
			text:text,
			timeText:'s后自动跳转到首页',
		}
		this.countDown = new countDown({
		  cdTime: 5,
		  tickCall: (obj) => {
		    this.code_down_count = obj.cdTime;
		  },
		  endCall: async () => {
		    console.dir("首页");
			this.$message({
			  message: "欢迎来到唯艺个人博物馆",
			  type: "success",
			});
			await this.$store.dispatch("getUserInfo");
			window.location.href = "/";
		  },
		});
	},
	async getUserAttr() {
	  let result = await this.$api.service.userattribute_queryByUserUuid();
	  localStorage.setItem("THEONE_MEMBER",JSON.stringify(result.data.data));
	},
	goLogin(name) {
		this.successInfo = {
			success:false,
			name:name,
			text:'',
			timeText:'s后自动跳转到登录页',
		}
		this.countDown = new countDown({
		  cdTime: 5,
		  tickCall: (obj) => {
		    this.code_down_count = obj.cdTime;
		  },
		  endCall: () => {
		    console.dir("登录");
			window.location.href = "/Login";
		  },
		});
	},
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/loginRegistration.scss";
.verification-wrap{
	width: 380px;
	padding-top: 220px;
	.label{
		display: flex;
		align-items: center;
		div{
			width: 30px;
			height: 18px;
			margin-right: 9px;
			opacity: .6;
		}
		.label-bank{
			background: url("~@/assets/1.0/images/icon-bank-y.png") no-repeat;
			background-size: 100%;
		}
		.label-id{
			background: url("~@/assets/1.0/images/icon-idcard-y.png") no-repeat;
			background-size: 100%;
		}
	}
	.title{
		font-size: 18px;
		font-weight: bold;
		color: #E61F1A;
		line-height: 24px;
		margin-bottom: 12px;
	}
	.text{
		font-size: 14px;
		color: #999999;
		line-height: 19px;
		margin-bottom: 24px;
	}
	.form-text{
		font-size: 12px;
		color: #999999;
		line-height: 16px;
		margin-bottom: 24px;
	}
	.form-label{
		font-size: 14px;
		margin-bottom: 12px;
		color: #333333;
	}
	.form-line {
	  &.hov {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;

		h1 {
		  margin-bottom: 0;
		}

	  }


	}
	.btn{
		width: 100%;
		height: 46px;
		line-height: 46px;
		font-size: 14px;
		color: #FFFFFF;
		text-align: center;
		margin-top: 32px;
		margin-bottom: 16px;
		border-radius: 25px;
		background: rgba(0, 0, 0, .1);
	}
	.btn-primary{
		background: linear-gradient(90deg, #FF7A64 0%, #E61F1A 100%);
		color: #fff;
	}
	h1 {
	  font-size: 14px;
	  color: rgba($color: #000000, $alpha: 0.4);
	  margin-bottom: 8px;
	  line-height: 20px;
	}

	.input-line {
	  margin-bottom: 16px;
	  border-radius: 4px;


	  &.select-line {
		position: relative;

		ul {
		  position: absolute;
		  width: 100%;
		  z-index: 1;
		  background: #fff;
		  border: 1px solid rgba($color: #409EFF, $alpha: 1);
		  border-top: 0;

		  li {
			line-height: 40px;
			padding:0 20px;
			cursor: pointer;
			&:hover {
			  background: rgba($color: #000000, $alpha: 0.1); 
			}
		  }
		}
	  }

	  &.password-number {
		display: flex;
		justify-content: space-between;

		&.adjacent {
		  justify-content: start;

		  .number-input {
			margin-right: 16px;
		  }
		}

		.number-input {
		  width: 34px;
		  height: 40px;
		  background: #FFFFFF;
		  border-radius: 4px;
		}

		.el-input__inner {
		  padding: 0;
		  text-align: center;
		}
	  }
	}
	::v-deep .el-tabs__content{
		overflow: inherit;
	}
	::v-deep  .el-tabs--border-card{
		box-shadow: 0px 2px 42px 0px rgba(67,39,39,0.06);
		border: 0px solid #FFFFFF;
		border-radius: 4px;
		.el-tabs__header{
			background: #fff;
			border: rgba(255, 255, 255, 0);
			border-radius: 4px;
			.el-tabs__nav-wrap{
				border-radius: 4px 4px 0 0;
			}
			.el-tabs__nav{
				width: 100%;
				display: flex;
				.el-tabs__item{
					flex: 1;
					display: flex;
					justify-content: center;
					height: 50px;
					line-height: 50px;
					background: linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%);
					font-weight: bold;
				}
				.el-tabs__item:hover{
					color: #333;
				}
				#tab-0{
					border-radius: 4px 0 10px 0;
					box-shadow: 0px 2px 42px 0px rgba(67,39,39,0.06), inset 4px -4px 16px 0px rgba(67,39,39,0.04);
				}
				#tab-1{
					border-radius: 0 4px 0 10px;
					box-shadow: 0px 2px 42px 0px rgba(67,39,39,0.06), inset 4px -4px 16px 0px rgba(67,39,39,0.04);
				}
				.el-tabs__item.is-active{
					border: 1px solid rgba(255, 255, 255, 0);
					color: #333;
					background: #fff;
					box-shadow: none!important;
					div{
						opacity: 1;
					}
				}
			}
		}
	}
	.label-left{
		::v-deep .el-tabs__item{
			justify-content: flex-start!important;
		}
	}
	.warn-warp{
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		padding: 0 16px;
		.warn-img{
			width: 132px;
			height: 132px;
			background-image: url(~@/assets/1.0/images/verification-error.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center;
			margin:24px 0;
		}
		.warn-img-success{
			background-image: url(~@/assets/1.0/images/verification-success.png);
		}
		.warn-name{
			font-weight: bold;
			color: #333333;
			line-height: 19px;
			margin-bottom: 12px;
		}
		.warn-name-success{
			color: #7CD388;
		}
		.warn-text{
			font-size: 12px;
			color: #333333;
			line-height: 16px;
			margin-bottom: 45px;
		}
		.warn-time{
			font-size: 12px;
			color: #999999;
			line-height: 16px;
			margin-bottom: 12px;
		}
	}
	@media screen and (min-width: 0px) and (max-width: 540px) {
		padding: 150px 20px 0;
		width: 100%;
	}
}


</style>



