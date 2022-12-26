<template>
  <transition name="fade">
    <div class="m-com-animate-wrap" v-if="isShow">
      <div class="mask" />
      <canvas id="canvas" class="canvas"></canvas>
      <div class="close" @click="hide" />
      <div class="ui-animate-content" ref="animateWrap">
        <div id="button" class="ready" />

        <img
          src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/success-title.png"
          class="title"
          :class="{ 'title-animate': playAnimate }"
        />
        <div
          class="content-wrap synthesis-animate-content-bgcolor"
          :class="{ 'content-wrap-aniamte': playAnimate }"
        >
          <img
            src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/coloured-top.png"
            class="coloured-top"
          />
          <img
            src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/coloured-bottom.png"
            class="coloured-bottom"
          />
          <div class="bg">
            <div
              class="preview-wrap"
              :style="`background-image:url(${
                commodity.commoditySku && commodity.commoditySku.cover
              })`"
            ></div>

            <div class="txt-wrap">
              <div class="des hidden-1" style="text-align: center">
                {{ commodity.commoditySku && commodity.commoditySku.name }}
              </div>
              <div
                class="des"
                v-if="commodity.commoditySku && commodity.commoditySku.number"
              >
                恭喜合成成功，您是第<span style="color: #e61f1a">{{
                  commodity.commoditySku.number
                }}</span
                >位用户！
              </div>
              <div class="tip-btn">
                去<span @click="$common.goPage('/mine/treasure')">我的藏品</span
                >查看
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import composeAnimate from "./animate";
export default {
  name: "DhComposeAnimate",
  props: {
    commodity: {
      type: Object,
      default: () => {
        return {
          commoditySku: {
            cover: "",
            name: "",
          },
        };
      },
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isShow: false,
      playAnimate: false,
    };
  },
  mounted() {
    // ammount to add on each button press
  },
  methods: {
    goCollect() {
      this.$router.push("/mine/treasure");
    },
    show() {
      this.isShow = true;
      setTimeout(() => {
        this.playAnimate = true;
      }, 100);
      this.$nextTick(() => {
        setTimeout(() => {
          const animate = composeAnimate();
          animate.initBurst();
          animate.render();
        }, 600);
      });
    },
    hide() {
      this.isShow = false;
      this.playAnimate = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/synthetic-system.scss";
.coloured-top {
  position: absolute;
  top: -5px;
  left: -13px;
  width: 100px;
}
.coloured-bottom {
  position: absolute;
  bottom: 0;
  right: -18px;
  width: 83px;
}
@media screen and (max-width: 540px) {
  .coloured-top {
    top: -0.08rem;
    left: -0.2rem;
    width: 1.6rem;
  }
  .coloured-bottom {
    right: -0.29rem;
    width: 1.3rem;
  }
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
}
.close {
  position: absolute;
  top: 45%;
  right: 50%;
  margin-right: -25px;
  margin-top: 340px;
  width: 50px;
  height: 50px;
  z-index: 999999;
  background-image: url("//static.theone.art/pc/three-feet-boy/animate-close.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
}
.m-com-animate-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  .mask {
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
  }
}
.ui-animate-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 478px;
  height: 497px;
  border-radius: 10px;

  .title {
    display: block;
    width: 46%;
    margin: -8px auto;
    position: relative;
    top: 0;
    left: 0;
    z-index: 2;
  }
  .title-animate {
    animation: title-animate ease-out 0.5s;
  }
  .content-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /*     width: 97%;
    height: 97%;
    transform: translate(-50%, -50%); */
    border-radius: 10px;
    background-color: rgba(255, 212, 157, 1);
    padding: 10px;
    .bg {
      border-radius: 10px;
      padding-top: 16%;
      background-color: #fff5e6;
      width: 100%;
      height: 100%;
      .des {
        padding-top: 10px;
      }
    }
    .animate-bg {
      display: block;
      width: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-48%);
    }
  }
  .content-wrap-aniamte {
    animation: content-rotate 0.4s linear;
  }
  .preview-wrap {
    height: 66%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
}
.txt-wrap {
  margin-top: 10px;

  left: 0;
  width: 100%;
  text-align: center;
  z-index: 999;
  text-align: center;

  .des {
    font-size: 14px;
    margin-bottom: 5px;
  }
  .tip-btn {
    position: relative;
    top: 0;
    left: 0;
    z-index: 999;
    font-size: 14px;
    span {
      font-size: 20px;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

@keyframes title-animate {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }

  70% {
    transform: scale(1.4);
  }

  100% {
    transform: scale(1);
  }
}
@keyframes content-rotate {
  0% {
    transform: rotate(0) scale(0.1);
  }
  100% {
    transform: rotate(180deg) scale(1);
  }
}
@media screen and (max-width: 540px) {
  .close {
    width: 0.8rem;
    height: 0.8rem;
    margin-right: -0.4rem;
    margin-top: 4.2rem;
  }
  .ui-animate-content {
    width: 6rem;
    height: 6rem;
    border-radius: 0.1rem;

    .title {
      display: block;
      width: 52%;
      margin: -2.2% auto 0;
      position: relative;
      top: 0;
      left: 0;
      z-index: 2;
    }
    .content-wrap {
      border-radius: 0.1rem;
      .animate-bg {
        width: 86%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-48%);
      }
      .bg {
        .des {
          padding-top: 0;
        }
      }
    }
    .preview-wrap {
      height: 66%;
      width: 100%;
      margin-bottom: 0.2rem;
    }
  }
  .txt-wrap {
    width: 100%;
    margin-top: 0;
    .tip {
      font-size: 0.4rem;
      margin-bottom: 0.1rem;
    }
    .des {
      font-size: 0.24rem;
      margin-bottom: 0.06rem;
    }
    .tip-btn {
      position: relative;
      top: 0;
      left: 0;
      z-index: 999;
      font-size: 0.16rem;
      span {
        font-size: 0.24rem;

        cursor: pointer;
      }
    }
  }
}
</style>
