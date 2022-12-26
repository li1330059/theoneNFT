<template>
  <div class="address-m-edit">
	  <m-head :title="`添加收货地址`" ></m-head>
	  <div class="form">
	    <div class="form-line">
	      <h1 class="title">收货人</h1>
	      <div class="input-line">
	        <el-input
	          placeholder="请输入姓名"
			  v-model="verified.contactsName"
			  maxlength="10"
	        ></el-input>
	      </div>
	    </div>
	    <div class="form-line">
	      <h1 class="title">手机号</h1>
	      <div class="code">
	        <div class="input-line">
	          <el-input
	            placeholder="请输入手机号"
				v-model="verified.contactsPhone"
	          ></el-input>
	        </div>
	      </div>
		</div>
	    <div class="form-line">
	      <h1 class="title">城市/区域</h1>
	      <div class="code">
	        <div class="input-line">
	          <city-address ref="cityAddress" @listen="getAddressCode"></city-address>
	        </div>
	      </div>
		</div>
	    <div class="form-line">
	      <h1 class="title">详细地址</h1>
	      <div class="code">
	        <div class="input-line">
	          <el-input
	            placeholder="街道，楼牌号等"
				v-model="verified.addressDetail"
				type="textarea"
				class="address-area"
				:rows="5"
				maxlength="100"
				 show-word-limit
	          ></el-input>
	        </div>
	      </div>
		</div>
		<div class="form-line">
			<div class="radio-wrap" @click="setDefault()">
			  <span :class="{ def: verified.isDefault }"></span>设为默认收货地址
			</div>
		</div>
		<div class="btngroup">
			<div v-if="verified.contactsName&&verified.contactsPhone&&verified.addressDetail&&this.verified.areaCode" class="ok" @click="submit()">保存</div>
			<div v-else>保存</div>
		</div>
	</div>
  </div>
</template>
<script>
import { checkPhoneNumber } from "@/utils/common";
import cityAddress from "../address-manage/components/city-address.vue";
export default {
  components: { cityAddress },
  data() {
    return {
		type:0,//新建
		verified: {
		  contactsName: "",
		  contactsPhone:"",
		  addressDetail: "",
		  isDefault:false,
		},
	};
  },
  mounted() {
	  if(this.$route.query.item){//修改
		  this.init(this.$route.query.item)
	  }
  },
  methods: {
	  //监听地址回调
	  getAddressCode(option){
		  if(!option&&this.type){//修改改动了地址
			  delete this.verified.province;
			  delete this.verified.provinceCode;
			  delete this.verified.city;
			  delete this.verified.cityCode;
			  delete this.verified.area;
			  delete this.verified.areaCode;
		  }else{
			  this.verified = { ...this.verified, ...option };
		  }
		  this.verified = JSON.parse(JSON.stringify(this.verified))
		  console.dir(this.verified)
	  },
	  init(item) {
		this.type = 1;
		this.verified = JSON.parse(JSON.stringify(item));
		this.verified.isDefault = !!item.isDefault
		this.$nextTick(() => {
			this.$refs['cityAddress'].init(item);
		});
	  },
	  setDefault() {
	    this.verified.isDefault = !this.verified.isDefault;
	  },
	  async submit() {
		  let post_url = this.$api.service.address_create;
		  let warn = "添加地址成功";
		  if(this.type){
			  post_url = this.$api.service.address_update;
			  warn = "修改地址成功";
		  }
		if (!checkPhoneNumber(this.verified.contactsPhone)) {
		  this.$message.warning("请输入正确的国内手机号");
		  return;
		}
		this.verified.isDefault = Number(this.verified.isDefault)
	    const res = await post_url(this.verified);
	    console.log(res);
	    if (res.data.code == 200) {
			this.$message.success(warn);
			this.$router.back();
	    }else{
			this.$message.error(res.data.message)
		}
	  },
  },
};
</script>
<style lang="scss" scoped>
.address-m-edit{
	padding-bottom: 60px;
	.form{
		.form-line{
			.title{
				font-size: .28rem;
				font-weight: 400;
				color: #000000;
				padding: .32rem;
			}
			::v-deep .el-input__inner{
				border: 0;
				height: 1rem;
				line-height: 1rem;
				color: #999999;
				font-size: .28rem;
			}
			::v-deep .el-textarea__inner{
				padding: .32rem;
				border: 0;
				color: #999999;
				height: 2rem;
				font-size: .28rem;
			}
		}
	}
	::v-deep .address-select .el-input__inner{
		padding-left: .32rem;
		font-size: .28rem;
	}
	.radio-wrap {
	    display: flex;
	    align-items: center; 
	    justify-content: flex-start;
	    cursor: pointer;
		font-size: .24rem;
		color: #4D4D4D;
		padding: .32rem;
	    span {
	        display: block;
	        background: url("//static.theone.art/pc/images/pic-home/icon_weigouxuan%402x.png") no-repeat center;
	        background-size: contain;
	        width: .24rem;
	        height: .24rem;
	        margin-right:.08rem;
	    }
	    .def{
	       
	        background: url("//static.theone.art/pc/images/pic-home/icon_gouxuan%402x.png") no-repeat center;
	        background-size: contain;
	    }
	}
	.btngroup{
		margin-top: .94rem;
		padding: 0 .32rem;
		div{
			height: .72rem;
			line-height: .72rem;
			border-radius: .72rem;
			background: #E5E5E5;
			font-weight: 500;
			color: #FFFFFF;
			font-size: .28rem;
			text-align: center;
		}
		.ok{
			background: linear-gradient(90deg, #FF7A64 0%, #E61F1A 100%);
		}
	}
}
</style>
