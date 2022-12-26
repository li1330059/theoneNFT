<template>
  <div class="address-mobile-body">
	  <m-head :title="`收货地址`" >
		  <span v-if="!showSet" class="slot-span" @click="showSet = true">管理</span>
		  <span v-if="showSet" class="slot-span" @click="showSet = false">完成</span>
	  </m-head>
	  <div class="list-cont">
		  <ul>
			  <li v-for="(item,index) in list" :key="index">
				  <div class="show-cont" @click="selBuyAddress(item)">
					  <div class="avatar"><div>{{strSet(item.contactsName)}}</div></div>
					  <div class="text-cont">
						  <div class="user">
							  <div class="name-phone">{{item.contactsName}} {{item.contactsPhone}}</div>
							  <div class="set-btn" v-if="item.isDefault">默认</div>
						  </div>
						  <div class="address">{{item.province}} {{item.city}} {{item.area}} {{item.addressDetail}}</div>
					  </div>
					  <div class="edit" @click.stop="onSetting(item)"></div>
				  </div>
				  <div class="hide-cont" v-if="showSet">
					  <div class="radio-wrap" @click="setDefault(item)">
					    <span :class="{ def: item.isDefault }"></span>默认地址
					  </div>
					  <div class="del" @click="delAddress(item)">删除</div>
				  </div>
			  </li>
		  </ul>
	  </div>
	  <div v-if="list.length==0" class="empty">
		  <div class="img"></div>
		  <div>您还没有地址哦，快来添加吧～</div>
	  </div>
	<div class="add-btn">
		<div class="ui-btn ui-btn-red" @click="addressAddFun()"><div class="icon" />新增收货地址</div>
	</div>
  </div>
</template>
<script>
export default {
  components: {

  },
  props: {},
  data() {
    return {
		clickOn:false,
		showSet:false,
		list:[]
	};
  },
  mounted() {
	  if(this.$route.query.type){
		this.clickOn = true;
	  }
	this.getList()
  },
  methods: {
	  onSetting(item) {
		  this.$router.push({
			path: '/mine/setting/address-manage/address-mobile-edit',
			query: {
			  item: item
			}
		  })
	  },
	  selBuyAddress(item) {
		  if(this.clickOn){
			  localStorage.setItem("sel_address",JSON.stringify(item))
			  this.$router.back();
		  }
	  },
	  async getList() {
	    const res = await this.$api.service.address_list();
	    console.log(res);
	    if (res.data.code == 200) {
			this.list = res.data.data;
	    }else{
			this.$message.error(res.data.message)
		}
	  },
		delAddress(item) {
		  this.$confirm(`确定要删除该地址么？`, "提示", {
		    confirmButtonText: "确定",
		    cancelButtonText: "取消",
		  })
		    .then(async () => {
				const res = await this.$api.service.address_delete({uuid:item.uuid});
				console.log(res);
				if (res.data.code == 200) {
					this.$message.success("删除成功")
					this.getList();
				}else{
					this.$message.error(res.data.message)
				}
			})
		    .catch(() => {});
	  },
	  async setDefault(item) {
		this.verified = item;
	  	this.verified.isDefault = Number(!this.verified.isDefault)
	    const res = await this.$api.service.address_update(this.verified);
	    if (res.data.code == 200) {
	  			this.$message.success("设置默认地址成功");
	  			this.getList();
	    }else{
	  			this.$message.error(res.data.message)
	  		}
	  },
	  addressAddFun(){
		  if(this.list.length>=20){
			  this.$message.warning("最多创建20个地址");
			  return;
		  }
		   this.$router.push('/mine/setting/address-manage/address-mobile-edit');
	  },
	  strSet(str){
		  console.dir(str)
		  return str.charAt(0).toUpperCase();
	  }
  },
};
</script>
<style lang="scss" scoped>
.address-mobile-body{
	padding-bottom: 2rem;
	.slot-span{
		color: #397FE7;
		font-size: .28rem;
		font-weight: 400;
	}	
	.empty{
		font-size: .28rem;
		font-weight: 400;
		color: #999999;
		text-align: center;
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%,-50%);
		.img{
			background-image: url("~@/assets/1.0/images/address_no.png");
			width: 4.56rem;
			height: 2.94rem;
			background-size: 100%;
			margin-bottom: .32rem;
		}
	}
	.add-btn{
		padding: 0 .32rem;
		position: fixed;
		bottom:60px;
		width: 100%;
		background: rgba(255, 255, 255, .5);
		.ui-btn{
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 500;
			width: 100%;
			border-radius: .72rem;
			height: .72rem;
			line-height: .72rem;
			.icon{
				width: .36rem;
				height: .36rem;
				background-image: url("~@/assets/1.0/images/plus_address.png");
				background-size: 100%;
				background-repeat: no-repeat;
				margin-right: .16rem;
			}
		}
	}
	.list-cont{
		background: #FAFAFA;
		ul{
			li{
				background: #ffffff;
				padding-top: .30rem;
				margin-top: .16rem;
				.show-cont{
					display: flex;
					font-size: .28rem;
					padding-bottom: .3rem;
					.avatar{
						width: 1.2rem;
						display: flex;
						justify-content: center;
						div{
							width: .64rem;
							height: .64rem;
							background: #E5E5E5;
							border-radius: 100%;
							color: #999999;
							text-align: center;
							line-height: .64rem;
							margin-top: .12rem;
						}
					}
					.text-cont{
						flex: 1;
						.user{
							color: #4D4D4D;
							display: flex;
							align-items: center;
							.name-phone{
								margin-right:.16rem;
							}
							.set-btn{
								border-radius: 2px;
								border: 1px solid #F4A33A;
								color: #F4A33A;
								font-size: .2rem;
								width: .64rem;
								height: .34rem;
								text-align: center;
								line-height: .34rem;
							}
						}
						.address{
							font-size: .24rem;
							color: #999999;
							margin-top: .16rem;
						}
					}
					.edit{
						width: 1.12rem;
						background-image: url("~@/assets/1.0/images/icon_edit.png");
						background-repeat: no-repeat;
						background-position:center .26rem ;
						background-size: .36rem .36rem;
					}
				}
				.hide-cont{
					display: flex;
					justify-content: space-between;
					font-size: .24rem;
					padding: .14rem 0;
					margin: 0 .34rem;
					border-top: 1px solid #E5E5E5;
					.radio-wrap {
					    display: flex;
					    align-items: center; 
					    justify-content: flex-start;
					    cursor: pointer;
					    span {
					        display: block;
					        background: url("//static.theone.art/pc/images/pic-home/icon_weigouxuan%402x.png") no-repeat center;
					        background-size: contain;
					        width: .24rem;
					        height: .24rem;
					        margin-right:.08rem;
							color: #4D4D4D;
					    }
					    .def{
					       
					        background: url("//static.theone.art/pc/images/pic-home/icon_gouxuan%402x.png") no-repeat center;
					        background-size: contain;
					    }
					}
					.del{
						color: #397FE7;
					}
				}
			}
		}
	}
}
</style>
