<template>
  <div
    class="customer-service-body"
    :style="{ bottom: isWechat ? '2rem' : '' }"
    ref="drawRef"
    @mousedown="start"
    @touchstart="start"
    @touchmove="move"
    @mousemove="move"
    @click="test"
    v-if="isShow"
  >
    <el-popover
      :placement="placement"
      :trigger="trigger"
      popper-class="cus-popover j-cus-popover"
    >
      <div class="m-pop-wrap grayscale">
        <div class="serve-phone">
          <div class="title">
            <div class="">
              <span class="ui-icon ui-icon-phone" /><span class="txt"
                >客服热线</span
              >
            </div>
            <span class="phone-number pc-number">400-8571-888</span>
            <a class="phone-number ph-number" href="tel:400-8571-888"
              >400-8571-888</a
            >
          </div>
          <!--     <div class="serve-des">周一至周日8:00-22:00</div> -->
        </div>
        <div class="line"></div>
        <div class="phone-online" @click="showServe">
          <div class="title">
            <span class="ui-icon ui-icon-serve" />在线客服
          </div>
          <div class="ui-btn-red pc-number">立即沟通</div>
          <div class="online-des ph-number">点击联系在线客服</div>
        </div>
      </div>
      <div slot="reference">
        <div class="icon-wrap grayscale" @click="goLink">
          <div class="ui-icon"></div>
          <div class="txt">客户服务</div>
        </div>
      </div>
    </el-popover>
    <!--    <div class="icon-wrap" @click="goLink">
      <div class="ui-icon"></div>
      <div class="txt">投诉&建议</div>
    </div>
    <div class="code-wrap">
      <img
        src="//static.theone.art/pc/icons/service/icon-code1.png"
      />
      <div class="txt">请用微信扫一扫<br />填写信息</div>
      <div class="icon"></div>
    </div> -->
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
      isWechat: false,
    };
  },
  watch: {
    $route: function (to, from) {
      // 执行需要更新的方法
      this.checkoutShow(to.meta);
    },
  },
  mounted() {
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
      } else {
        this.isShow = true;
      }
    },
    showServe() {
      ysf("open");
    },
    goLink() {
      /*       if (this.$common.isMobile()) {
        window.location.href = "http://wjx.theone.art/vm/eHv43yn.aspx";
      } */
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
.pc-number {
  display: block;
}
.ph-number {
  display: none;
}
.ui-icon-phone {
  background-image: url("//static.theone.art/pc/icons/icon-serve-phone.png");
}
.ui-icon-serve {
  background-image: url("//static.theone.art/pc/icons/service/icon-serve-eir.png");
}
.m-pop-wrap {
  width: 235px;
  background: #ffffff;
  height: 118px;
  padding: 10px 2px;
  .serve-phone {
    padding-left: 18px;
    .title {
      position: relative;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.7);
      line-height: 19px;
      letter-spacing: 1px;
      padding-bottom: 10px;
      .txt {
        display: inline-block;
        padding-left: 6px;
        width: 85px;
      }
      .ui-icon-phone {
        margin-left: -20px;
        position: relative;
        top: 2px;
      }
    }
    .phone-number {
      color: rgba(0, 0, 0, 0.7);
    }
    .serve-des {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.4);
      line-height: 16px;
      letter-spacing: 1px;
    }
  }
  .line {
    border: 1px solid #e3e3e3;
    margin: 16px 0 12px;
  }
  .phone-online {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.7);
      letter-spacing: 1px;
      position: relative;
      left: -2px;
      .ui-icon {
        margin-right: 7px;
      }
    }

    .ui-btn-red {
      width: 112px;
      line-height: 26px;
      background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
      border-radius: 15px;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 3.1rem;
    height: 1.5rem;
    padding: 0;
    .serve-phone {
      padding-left: 18px;
      .title {
        font-size: 14px;
        line-height: 19px;
        letter-spacing: 1px;
        padding-bottom: 0.05rem;
        .txt {
          display: none;
        }
        .ui-icon-phone {
          margin-left: -20px;
          position: relative;
          top: 2px;
        }
      }

      .phone-number {
        flex: 1;
        display: block;
        color: #000000;
        font-size: 0.28rem;
      }
      .serve-des {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);
        line-height: 16px;
        letter-spacing: 1px;
      }
    }
    .line {
      margin: 0.12rem 0;
    }
    .phone-online {
      display: block;
      .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.7);
        letter-spacing: 1px;
        left: -0.03rem;
        .ui-icon {
          margin-right: 0.06rem;
        }
      }
      .online-des {
        font-size: 0.24rem;
        color: rgba(0, 0, 0, 0.4);
        letter-spacing: 1px;
        padding-left: 0.3rem;
        padding-top: 0.01rem;
      }
    }
  }
}

.customer-service-body {
  position: fixed;
  z-index: 99999;
  bottom: 80px;
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
      background-image: url("//static.theone.art/pc/icons/service/icon-customer-service.png");
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
    bottom: 1.3rem;
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
@media screen and (min-width: 0px) and (max-width: 540px) {
  .pc-number {
    display: none !important;
  }
  .ph-number {
    display: block;
  }
}
</style>
