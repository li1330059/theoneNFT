<template>
  <div>
    <div class="manage-section">
      <div class="mode-mobile">
        <m-header title="我的卡券" />
      </div>
	  <div class="page-title">我的卡券</div>
        <div v-if="couponList.length > 0">
		<!-- 主内容区域 -->
		  <div class="coupon-list">
			  <div class="coupon-item" v-for="(item,index) in couponList" :key="index">
				  <div class="item-title nowarp">{{item.couponName}}</div>
				  <div class="item-text nowarp">获取来源<span class="line">｜</span>{{item.couponSource}}</div>
				  <div class="item-text mb-26">获得时间<span class="line">｜</span>{{item.gainTime}}</div>
				  <div class="item-text num"><span v-if="item.couponNo">卡号：{{item.couponNo}}</span></div>
				  <div class="item-text num">卡密：{{item.couponPassword}}</div>
				  <div class="btn" @click="copyClipboardFun(item.uuid,index)">一键复制</div>
			  </div>
			  <div class="load" v-if="$common.isMobile() && loading">加载中...</div>
			  <div class="load" v-if="$common.isMobile() && noMore">没有更多了</div>
		  </div>
		<!-- 分页 -->
          <div class="v1-pagination" v-if="!$common.isMobile()">
            <g-paging
              :pageChange="handleCurrentChange"
              :list="couponList"
              :pageSize="listParams.pageSize"
              :current-page="couponInfo.current"
            />
          </div>
		  
        </div>
		<div v-else class="empty">暂无卡券信息</div>
    </div>
	 <span class='c-btn' @click="copy" id="copy" ref="copy"  :data-clipboard-text="copyData"  ></span>

  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
import Clipboard from 'clipboard';
export default {
  components: { mHeader },
  data() {
    return {
	  couponInfo:{},
      couponList: [],
      listParams: {
        pageIndex: 1,
        pageSize: 20,
      },
	  loading: false,
	  noMore: false,
	  copyData:""
    };
  },
  created() {
    this.getCouponList();
  },
  mounted() {
	  if (this.$common.isMobile()) {
		  window.addEventListener("scroll", this.handleScroll, true);
	  }
  },
  beforeDestroy() {
	  if (this.$common.isMobile()) {
	  	  window.removeEventListener("scroll", this.handleScroll, true);
	  }
  },
  methods: {
    onStatusStateChange() {
      this.handleCurrentChange(1);
    },
    handleCurrentChange(val) {
      this.listParams.pageIndex = val;
      this.getCouponList();
    },
	handleScroll() {
	   // scrollDom = document.documentElement;
		var scrollTop =  document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		var scrollHeight =  document.body.scrollHeight;
		var windowHeight = document.body.clientHeight;
	  if (
	    scrollHeight - scrollTop - windowHeight < 100 &&
	    !this.noMore &&
	    !this.loading
	  ) {
	    this.getCouponList(); 
	  }
	},
    async getCouponList() {
	  this.loading = true;
      const res = await this.$api.service.virtualCouponList(
        this.listParams
      );
	  if (res.data.code == 200) {
		  this.loading = false;
		  if (!res.data.data||!res.data.data.records) {
			this.noMore = true;
			return;
		  }
		if (res.data.data.records.length < 20) {
		  this.noMore = true;
		}
		this.listParams.pageIndex++;
		this.couponInfo = res.data.data;
		if(this.$common.isMobile()){
			this.couponList = this.couponList.concat(res.data.data.records);
		}else{
			this.couponList = res.data.data.records;
		}
	  }else{
		  this.loading = false;
		  this.noMore = true;
	  }
    },
	
	copy(evnet) {
	  evnet.preventDefault()
	  let _that = this
	  let clipboard = new Clipboard('.c-btn');
	  clipboard.on('success',  e => {
		this.$message.success("复制成功");
		// 释放内存
		clipboard.destroy()
	  })
	  clipboard.on('error', (e) => {
		this.$message.success("复制失败");
		// 释放内存
		clipboard.destroy()
	  });
	},

	
	async copyClipboardFun(uuid,idx) {
		const res = await this.$api.service.virtualCopy({uuid});
		if (res.data.code == 200) {
		  this.copyData = `卡号：${res.data.data.couponNo} 卡密：${res.data.data.couponPassword}`;
		  this.$forceUpdate()
		   setTimeout(()=>{//模拟点击真正复制链接的按钮 
		     this.$refs.copy.click();
		  },10)
		}else if(res.data.code == 10081){
			this.$message.success(res.data.message);
			setTimeout(function(){
				window.location.reload();
			},1000)
		}else{
			this.$message.success('请刷新页面，重新再试');
			setTimeout(function(){
				window.location.reload();
			},1000)
		}
	},

  },
};
</script>
<style lang="scss" scoped>
.page-title{
	font-size: 14px;
	color: #000000;
	line-height: 20px;
	margin-bottom: 20px;
}
.empty{
	width: 164px;
	height: 160px;
	background-image: url("//static.theone.art/pc/mine/coupon-empty.png");
	background-repeat: no-repeat;
	background-position: top;
	background-size: 164px 119px;
	text-align: center;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	font-size: 14px;
	color: #666666;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	@media screen and (min-width: 0px) and (max-width: 540px) {
	  width: 3.28rem;
	  height: 3.2rem;
	  background-size: 3.28rem 2.38rem;
	}
}
.coupon-list{
	display: flex;
	flex-wrap: wrap;
}
.coupon-item{
	background-image: url("//static.theone.art/pc/mine/coupon-bg.png");
	background-repeat: no-repeat;
	background-size: contain;
	width: 295px;
	height: 162px;
	position: relative;
	padding: 12px 22px 22px;
	margin: 0 20px 20px 0;
	.item-title{
		font-size: 16px;
		font-weight: 500;
		color: #0F0F02;
		line-height: 22px;
		background: linear-gradient(270deg, #4F3F2A 0%, #6E5738 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.item-text{
		font-size: 12px;
		font-weight: 400;
		color: #806748;
		line-height: 17px;
		height: 17px;
		margin-top: 4px;
	}
	.mb-26{
		margin-bottom: 26px;
	}
	.nowarp{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis; 
	}
	.line{
		color: #E1C9A2;
	}
	.num{
		color: #A69174;
	}
	.btn{
		position: absolute;
		right: 17px;
		bottom: 22px;
		width: 74px;
		height: 24px;
		line-height: 24px;
		text-align: center;
		background: linear-gradient(270deg, #4F3F2A 0%, #6E5738 100%);
		border-radius: 17px;
		color: #FFFFFF;
		font-size: 12px;
		cursor: pointer;
		&:hover{
			box-shadow: 0px 2px 5px 0px rgba(82,68,48,0.41);
		}
	}
}
.v1-pagination {
  padding-bottom: 100px;
}
.ui-gift-manage-wrap {
  ::v-deep .section {
    background-color: transparent;
    padding-top: 15vh;
    @media screen and (min-width: 0px) and (max-width: 540px) {
      padding-top: 32vh;
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
	.coupon-list{
		justify-content: center;
		padding-top: .38rem;
		padding-bottom: 1.2rem;
		.coupon-item{
			width: 7.06rem;
			height: 3.46rem;
			padding: .36rem .58rem .48rem .38rem;
			margin: .08rem 0;
			background-image: url("//static.theone.art/pc/mine/coupon-bg-m.png");
			background-size: contain;
			.item-title{
				font-size: .32rem;
				line-height: .44rem;
			}
			.item-text{
				font-size: .24rem;
				line-height: .34rem;
				height: .34rem;
				margin-top: .08rem;
			}
			.mb-26{
				margin-bottom: .58rem;
			}
			.btn{
				right: .48rem;
				bottom: .46rem;
				width: 1.52rem;
				height: .52rem;
				line-height: .52rem;
				border-radius: .26rem;
				font-size: .24rem;
			}
		}
	}
}
</style>
