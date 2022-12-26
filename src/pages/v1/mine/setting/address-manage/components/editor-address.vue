<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    width="500px"
    :fullscreen="isPc ? false : true"
	:title="type==0 ? '添加收货地址' : '编辑收货地址'"
	:before-close="onCancelC"
  >
  <div class="dialog-content">
    <div class="dialog-form">
      <div class="form-line">
        <h1 class="title">收货人</h1>
        <div class="input-line">
          <el-input
            v-model="verified.contactsName"
            placeholder="请输入姓名"
			maxlength="10"
          ></el-input>
        </div>
      </div>
      <div class="form-line">
        <h1 class="title">手机号</h1>
        <div class="input-line">
          <el-input
            v-model="verified.contactsPhone"
            placeholder="请输入手机号"
          ></el-input>
        </div>
      </div>
	  <div class="form-line">
	    <h1 class="title">城市区域</h1>
	    <div class="input-line">
			<city-address v-if="dialogVisible" ref="cityAddress" @listen="getAddressCode"></city-address>
	    </div>
	  </div>
	  <div class="form-line">
	    <h1 class="title">详细地址</h1>
	    <div class="input-line">
	      <el-input
			class="text-area"
	        v-model="verified.addressDetail"
	        placeholder="街道，楼牌号等"
			type="textarea"
			maxlength="100"
			:rows="4"
			 show-word-limit
	      ></el-input>
	    </div>
	  </div>
	  <div class="tip radio-wrap" @click="setDefault()">
	    <span :class="{ def: verified.isDefault }"></span>设为默认收货地址
	  </div>
      <div class="form-btns">
        <div class="v1-btn mycenter pc-show" @click="onCancelC">
          取消
        </div>
        <div class="v1-btn v1-red" @click="submit()">保存</div>
      </div>
    </div>
  </div>
  </el-dialog>
</template>
<script>
import { checkPhoneNumber } from "@/utils/common";
import cityAddress from "../components/city-address.vue";
export default {
  components: { cityAddress },
  props: {
  },
  data() {
    return {
		type:0,//新建
		dialogVisible: false,
		isPc:true,
		verified: {
		  contactsName: "",
		  contactsPhone:"",
		  addressDetail: "",
		  isDefault:false,
		},
		isPcInit:false
	};
  },
  mounted() {
    this.isPc = !this.$common.isMobile();
  },
  methods: {
	  onCancelC() {
	  	this.dialogVisible = false;
		if(this.isPcInit){
			this.$parent.clearDeliveryType();
		}
	  },
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
	  },
	  async init(item) {
	    this.dialogVisible = true;
	    this.isPc = !this.$common.isMobile();
		if(item){
			if(item == "pc-init"){
				this.type = 0;
				this.isPcInit = true;
				this.restInput();
			}else{
				this.type = 1;
				this.verified = JSON.parse(JSON.stringify(item));
				this.verified.isDefault = !!item.isDefault
				this.$nextTick(() => {
					this.$refs['cityAddress'].init(item);
				});
			}
		}else{
			this.type = 0;
			this.restInput();
		}
	  },
	  restInput() {
	    this.verified = {
		  contactsName: "",
		  contactsPhone:"",
		  addressDetail: "",
		  isDefault:false,
	    };
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
		if(!this.verified.contactsName){
			this.$message.warning("姓名不能为空");return;
		}
		if(!this.verified.contactsPhone){
			this.$message.warning("手机号不能为空");return;
		}
		if (!checkPhoneNumber(this.verified.contactsPhone)) {
		  this.$message.warning("请输入正确的国内手机号");
		  return;
		}
		if(!this.verified.areaCode){
			this.$message.warning("请选择城市区域");return;
		}
		if(!this.verified.addressDetail){
			this.$message.warning("详细地址不能为空");return;
		}
		this.verified.isDefault = Number(this.verified.isDefault)
	    const res = await post_url(this.verified);
	    console.log(res);
	    if (res.data.code == 200) {
			this.$message.success(warn);
			this.dialogVisible = false;
			this.restInput();
			this.$parent.getList();
	    }else{
			this.$message.error(res.data.message)
		}
	  },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/mineSettings.scss";

.page-mine-setting-nameVerified .message {
  color: rgba($color: #000000, $alpha: 0.7);
}
.tip {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  padding-bottom: 16px;
}
.v1-red {
  background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
  color: #fff;
  min-width: 96px;
  line-height: 30px;
  height: 30px;
  font-size: 14px;
}
.radio-wrap {
    display: flex;
    align-items: center; 
    justify-content: flex-start;
    cursor: pointer;
    span {
        display: block;
        background: url("//static.theone.art/pc/images/pic-home/icon_weigouxuan%402x.png") no-repeat center;
        background-size: contain;
        width: 12px;
        height: 12px;
        margin-right:4px;
    }
    .def{
       
        background: url("//static.theone.art/pc/images/pic-home/icon_gouxuan%402x.png") no-repeat center;
        background-size: contain;
    }
}
.text-area{
	.text-area{
		padding-bottom: 15px;
	}
}
</style>
