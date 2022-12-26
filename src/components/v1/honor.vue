<template>
	<div>
		<div class="honor-warp">
			<template v-for="(item,index) in honorList">
				<div class="honor" :class="honorList.length>1?'honors':''" v-if="index<4||isOpen" :key="index" @click="goDetail(item)">
				  <div class="honor-book">
					  <div class="honor-book-img" :style="`background-image:url('${item.picUrl}')`"></div>
				  </div>
				  <div class="honor-text">
					  <div class="honor-text-name">{{item.name}}</div>
					  <div class="honor-text-des">{{item.description}}</div>
				  </div>
				</div>
			</template>
		</div>
		<div v-if="honorList.length>4" class="open-btn">
			  <div class="honor-btn honor-down" v-if="!isOpen" @click="isOpen=true">展开更多</div>
			  <div class="honor-btn honor-up" v-else @click="isOpen=false">收起更多</div>
		</div>
	</div>
</template>
<script>
import App from "@/utils/app/index";
export default {
  data() {
    return {
		isOpen:false,
	};
  },
  props: {
	  honorList: {
	    type: Array,
	    default: () => {
	      return [];
	    },
	  },
  },
  watch: {

  },
  created() {
	  
  },
  computed: {},
  methods: {
	  goDetail(item){
		  if(this.$common.isMobile()){
			  this.$router.push({
			    path:`/honorDetail/${item.id}`,
			  });
		  }
	  }
  },
};
</script>
<style lang="scss" scoped>
.honor-warp{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-left: -5px;
}
.open-btn{
	text-align: center;
	width: 100px;
	margin: 0 auto;
	.honor-btn{
		background-repeat: no-repeat;
		background-position: right;
		background-size: 12px 5px;
	}
	.honor-up{
		background-image: url("~@/assets/1.0/images/honor-up.png");
	}
	.honor-down{
		background-image: url("~@/assets/1.0/images/honor-down.png");
	}
}
//一个
.honor{
	display: flex;
	justify-content: center;
	margin: 0 auto;
	.honor-book{
		width: 241px;
		height: 327px;
		padding: 25px;
		background-image: url("~@/assets/1.0/images/honor-bg.png");
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 30px;
		.honor-book-img{
			width: 100%;
			height: 100%;
			background-size: 100%;
			background-repeat: no-repeat;
			background-position: center;
		}
	}
	.honor-text{
		padding-top: 78px;
		.honor-text-name{
			width: 540px;
			font-size: 14px;
			color: #000000;
			line-height: 20px;
			margin-bottom: 13px;
			margin-top: 20px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.honor-text-des{
			width: 540px;
			height: 120px;
			font-size: 12px;
			line-height: 20px;
			word-wrap:break-word;
			word-break: break-all;
		}
	}
}
//多个
.honors{
	width: 48%;
	margin: 0 0 40px 0;
	padding: 0;
	.honor-book{
		width: 200px;
		height: 268px;
		margin-right: 20px;
		.honor-book-img{
			width: 165px;
			height: 234px;
		}
	}
	.honor-text{
		// flex: 1;
		width: 230px;
		padding: 0;
		.honor-text-name{
			width: 210px;
			white-space: inherit;
			overflow: inherit;
			text-overflow: inherit;
		}
		.honor-text-des{
			width: 100%;
			height: auto;
		}
	}
}
@media screen and (max-width: 540px) {
	// .honor-warp{
	// 	display: block;
	// }
	//一个
	.honor{
		display: block;
		margin: 0;
		.honor-book{
			width: 5.26rem;
			height: 6.98rem;
			background-image: url("~@/assets/1.0/images/honor-bg.png");
			background-size: 100%;
			 background-position: center;
			background-repeat: no-repeat;
			display: flex;
			justify-content: center;
			align-items: center;
			margin:0 auto;
			.honor-book-img{
				width: 4.13rem;
				height: 5.84rem;
				background-size: 100%;
				background-repeat: no-repeat;
			}
		}
		.honor-text{
			padding-top: 0;
			.honor-text-name{
				width: auto;
				font-size: 14px;
				color: #000000;
				line-height: 20px;
				margin-bottom: 13px;
				white-space: inherit;
				margin: 20px auto 7px;
				display: table;
			}
			.honor-text-des{
				width: 5rem;
				height: auto;
				font-size: 12px;
				line-height: 20px;
			}
		}
	}
	//多个
	.honors{
		width: 50%;
		margin-bottom: .4rem;
		padding: 0;
		.honor-book{
			width: 2.6rem;
			height: 3.57rem;
			margin: 0;
			padding:15px;
			.honor-book-img{
				width: 100%;
				height: 100%;
			}
		}
		.honor-text{
			flex: 1;
			padding: 0;
			width: auto;
			.honor-text-name{
				margin:0;
				margin-top: .3rem;
				width: auto;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; /* 这里是超出几行省略 */
				overflow: hidden;
				text-align:center;
				word-wrap: break-word;
			}
			.honor-text-des{
				display: none;
				width: 100%;
				height: auto;
			}
		}
	}
}
</style>
