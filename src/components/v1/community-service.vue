<template>
  <div
    class="customer-service-body"
	:style="{bottom:isWechat?'3.4rem':''}"
    ref="drawRef"
    @mousedown="start"
    @touchstart="start"
    @touchmove="move"
    @mousemove="move"
    v-if="isShow"
  >
    <el-popover
      :placement="placement"
      :trigger="trigger"
      popper-class="cus-popover j-cus-popover"
    >
      <div class="m-pop-wrap grayscale">
		  <div class="qr-wrap">
			  <div class="qr-label">
				  <div class="title"><div class="qr-icon"></div>{{$common.isMobile()?'截图保存二维码':'微信扫码'}}</div>
				  <div class="des">{{$common.isMobile()?'微信扫码加入专属社群':'加入专属社群'}}</div>
			  </div>
			  <div class="qr-img">
				  <img :src="qrCode" />
			  </div>
		  </div>
      </div>
      <div slot="reference">
        <div class="icon-wrap grayscale">
          <div class="ui-icon"></div>
          <div class="txt">加入社群</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
function findDimensions() {
  //函数：获取尺寸
  var point = {};
  //获取窗口宽度
  window.innerWidth && (point.width = window.innerWidth);
  window.innerHeight && (point.height = window.innerHeight);
  return point;
}
import App from "@/utils/app/index";
export default {
  data() {
    return {
      isShow: false,
	  qrCode:"",
	  isWechat:false
    };
  },
  watch: {
    $route: function (to, from) {
      // 执行需要更新的方法
      this.checkoutShow(to.meta);
    },
  },
  mounted() {
	  this.getApiPic();
	  const browser = App.browser.browser;
	  if (browser.wechat) {
	    //微信内
	    this.isWechat = true;
	  }
  },
  computed: {
    trigger() {
      return this.$common.isMobile() ? "click" : "click";
    },
    placement() {
      return this.$common.isMobile() ? "left" : "left";
    },
  },
  methods: {
    checkoutShow(meta) {
      if (meta.hideService) {
        this.isShow = false;
      }else{
        this.isShow=true;
      }
    },
    showServe() {
      ysf("open");
    },
	async getApiPic() {
		let result = await this.$api.service.detail_communityPic();
		if (result.data.code == 200) {
			this.qrCode = result.data.data
		}
	},
    start(e) {
      this.odiv = this.$refs.drawRef; //获取目标元素
      let touch = null;
      this.start = true;

      if (e.touches) {
        touch = e.touches[0];
        // this.moveKey = "ontouchmove";
        this.upKey = "ontouchend";
      } else {
        touch = e;
        // this.moveKey = "onmousemove";
        this.upKey = "onmouseup";
      }

      //算出鼠标相对元素的位置
      this.disX = touch.clientX - this.odiv.offsetLeft;
      this.disY = touch.clientY - this.odiv.offsetTop;
      /*       this.move(); */
      this.up();
    },
    move(e) {
      if (!this.start || !this.odiv) {
        return;
      }
      let touch = null;
      if (e.touches) {
        touch = e.touches[0];
      } else {
        touch = e;
      }
      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      let left = touch.clientX - this.disX;
      let top = touch.clientY - this.disY;

      const windowSize = findDimensions();

      const domSize = this.odiv.getBoundingClientRect();

      if (left >= windowSize.width - domSize.width) {
        left = windowSize.width - domSize.width;
      }
      if (left <= 0) {
        left = 0;
      }
      if (top <= 0) {
        top = 0;
      }
      if (top >= windowSize.height - domSize.height) {
        top = windowSize.height - domSize.height;
      }

      //移动当前元素
      this.odiv.style.left = left + "px";
      this.odiv.style.top = top + "px";
      e.preventDefault();
      e.resutnValue = false;
      return false;
    },
    up() {
      document[this.upKey] = (e) => {
        /*  document[this.moveKey] = null; */
        document[this.upKey] = null;
        this.start = false;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.m-pop-wrap {
  background: #ffffff;
  padding: 0px 4px;
  .qr-wrap{
	  display: flex;
	  .qr-label{
		  margin-right: 10px;
		  display: flex;
		  flex-direction: column;
		  justify-content: center;
		  .title{
			  display: flex;
			  align-items: center;
			  margin-right: 2px;
			  font-size: 14px;
			  font-weight: bold;
			  color: rgba(0, 0, 0, .7);
			  line-height: 19px;
			  .qr-icon{
				  width: 16px;
				  height: 16px;
				  margin-right: 6px;
				  background-image: url("~@/assets/1.0/images/icon-qrcode.png");
				  background-size: 100%;
			  }
		  }
		  .des{
			  font-size: 12px;
			  color: rgba(0, 0, 0, .4);
			  line-height: 16px;
			  letter-spacing: 1px;
			  margin-top: 10px;
			  margin-left: 20px;
		  }
	  }
	  .qr-img{
		  width: 76px;
		  height: 76px;
		  background: #EEEEEE;
		  border-radius: 2px;
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  img{
			  width: 68px;
			  height: 68px;
		  }
	  }
  }


  @media screen and (min-width: 0px) and (max-width: 540px) {
  }
}

.customer-service-body {
  position: fixed;
  z-index: 99999;
  bottom: 180px;
  right: 40px;
  width: 90px;
  height: 90px;
  .icon-wrap {
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    width: 90px;
    height: 90px;
    background: #ffffff;
    box-shadow: 0px 2px 20px 0px rgba(87, 87, 87, 0.14);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    .ui-icon {
      width: 36px;
      height: 36px;
      background-image: url("~@/assets/1.0/images/qr_btn.png");
    }
    .txt {
      font-weight: 400;
      color: #000000;
      font-size: 12px;
      padding-top: 10px;
    }
  }
  .code-wrap {
    display: none;
    position: absolute;
    background: #ffffff;
    box-shadow: 0px 2px 20px 0px rgba(87, 87, 87, 0.14);
    border-radius: 4px;
    top: -126px;
    left: -200px;
    font-size: 14px;
    color: #000000;
    line-height: 14px;
    letter-spacing: 2px;
    text-align: center;
    padding: 20px;

    img {
      display: block;
      width: 140px;
    }
    .icon {
      width: 12px;
      height: 20px;
      background-image: url("//static.theone.art/pc/icons/service/icon-customer-service-right.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      position: absolute;
      right: -11px;
      bottom: 20px;
    }
  }
  .radius-txt {
    background: #397fe7;
    border-radius: 100px;
    padding: 6px 10px;
    color: #fff;
    margin-top: 8px;
  }
  .txt {
    color: rgba(0, 0, 0, 0.7);
    line-height: 18px;
  }
  &:hover {
    .code-wrap {
      display: block;
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    bottom: 2.64rem;
    right: 0.3rem;
    width: 1.2rem;
    height: 1.2rem;
    .icon-wrap {
      user-select: none;
      padding: 0.1rem 0;
      width: 1.2rem;
      height: 1.2rem;
      .ui-icon {
        width: 0.6rem;
        height: 0.6rem;
      }
      .txt {
        font-size: 0.2rem;
        padding-top: 0.05rem;
        word-break: keep-all;
      }
    }
    &:hover {
      .code-wrap {
        display: none;
      }
    }
  }
}
</style>
