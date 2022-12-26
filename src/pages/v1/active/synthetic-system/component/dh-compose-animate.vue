<template>
  <transition name="fade">
    <div class="m-com-animate-wrap" v-if="isShow">
      <div class="mask" />
      <canvas id="canvas" class="canvas"></canvas>
      <div class="close" @click="hide" />
      <div class="ui-animate-content" ref="animateWrap">
        <div id="button" class="ready" />

        <img
          src="//static.theone.art/pc/three-feet-boy/success-title.png"
          class="title"
          :class="{ 'title-animate': playAnimate }"
        />
        <div
          class="content-wrap synthesis-animate-content-bgcolor"
          :class="{ 'content-wrap-aniamte': playAnimate }"
        >
          <img
            class="animate-bg"
            src="//static.theone.art/pc/three-feet-boy/animate-bg.png"
          />

          <div
            class="preview-wrap"
            :style="`background-image:url(${
              commodity.commoditySku && commodity.commoditySku.cover
            })`"
          ></div>
        </div>
      </div>
      <div class="txt-wrap">
        <div class="des">
          恭喜获得{{ commodity.commoditySku && commodity.commoditySku.name }}
        </div>
        <div class="tip-btn">
          去<span @click="$common.goPage('/mine/treasure')">我的藏品</span>查看
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
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
}
.close {
  position: absolute;
  top: 50%;
  right: 50%;
  margin-right: -25px;
  margin-top: 34vh;
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
  width: 660px;
  height: 60vh;
  border-radius: 10px;

  .title {
    display: block;
    width: 40%;
    margin: -18% auto;
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
    border-radius: 10px;
    padding-top: 16%;
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
  position: absolute;
  top: 68%;

  left: 0;
  width: 100%;
  text-align: center;
  z-index: 999;
  text-align: center;

  .des {
    font-size: 14px;
    margin-bottom: 10px;
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
    margin-top: 3.2rem;
  }
  .ui-animate-content {
    width: 6rem;
    height: 5.9rem;
    border-radius: 0.1rem;

    .title {
      display: block;
      width: 72%;
      margin: -36% auto 0;

      position: relative;
      top: 0;
      left: 0;
      z-index: 2;
    }
    .content-wrap {
      padding-top: 1.4rem;
      border-radius: 0.3rem;
      .animate-bg {
        width: 86%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-48%);
      }
    }
    .preview-wrap {
      height: 66%;
      width: 100%;
      margin-bottom: 0.4rem;
    }
  }
  .txt-wrap {
    top: 50%;
    transform: translateY(240%);
    width: 100%;
    .tip {
      font-size: 0.4rem;
      margin-bottom: 0.3rem;
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
