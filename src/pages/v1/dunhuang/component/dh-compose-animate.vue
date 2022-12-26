<template>
  <transition name="fade">
    <div class="m-com-animate-wrap" v-if="isShow">
      <div class="mask" />
      <canvas id="canvas" class="canvas"></canvas>
        <div class="close" @click="hide"/>
      <div class="ui-animate-content" ref="animateWrap">
      
        <div id="button" class="ready" />

        <img
          src="//static.theone.art/pc/dunhuang/pop-animate-title.png"
          class="title"
          :class="{ 'title-animate': playAnimate }"
        />
        <div
          class="content-wrap"
          :class="{ 'content-wrap-aniamte': playAnimate }"
        >
          <div
            class="preview-wrap"
            :style="`background-image:url(${commodity.commoditySku&&commodity.commoditySku.cover})`"
          ></div>
        </div>
      </div>
      <div class="txt-wrap">
        <div class="tip">合成成功</div>
        <div class="des">恭喜你合成{{ commodity.commoditySku&&commodity.commoditySku.name }}</div>
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
      default: "B款三个人坐姿奏乐组（静态）",
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
  margin-right:-320px;
  margin-top:-300px;
  width: 50px;
  height: 50px;
  z-index: 999999;
  background-image: url("//static.theone.art/pc/icons/close.png");
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
    background-color: #8f8370;
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
  height: 620px;
  border-radius: 10px;

  .title {
    display: block;
    width: 72%;
    margin: -50px auto;

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
    background: #fff7e9
      url("//static.theone.art/pc/dunhuang/pop-animate-bg.png")
      center no-repeat;
    background-size: cover;

    padding-top: 80px;
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
    margin-bottom: 30px;
  }
}
.txt-wrap {
  position: absolute;
  top: 62%;

  left: 0;
  width: 100%;
  text-align: center;
  z-index: 999;
  text-align: center;
  color: #c55234;
  .tip {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .des {
    font-size: 14px;
    margin-bottom: 20px;
  }
  .tip-btn {
    position: relative;
    top: 0;
    left: 0;
    z-index: 999;
    font-size: 14px;
    span {
      font-size: 20px;
      border-bottom: 1px solid #c55234;
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
  position: absolute;
  top: 50%;
  right: 50%;
  margin-top:-4.4rem;
  margin-right:-2.9rem;
  width:.8rem;


}
  .ui-animate-content {
    width: 6rem;
    height: 9rem;
    border-radius: 0.1rem;

    .title {
      display: block;
      width: 72%;
      margin: -.3rem auto 0;

      position: relative;
      top: 0;
      left: 0;
      z-index: 2;
    }
    .content-wrap {
      padding-top: 0.8rem;
      border-radius: 0.3rem;
    }
    .preview-wrap {
      height: 66%;
      width: 100%;
      margin-bottom: 0.4rem;
    }
  }
  .txt-wrap {
    top: 63%;
    width: 100%;
    .tip {
      font-size: 0.4rem;
      margin-bottom: 0.3rem;
    }
    .des {
      font-size: 0.28rem;
      margin-bottom: 0.2rem;
    }
    .tip-btn {
      position: relative;
      top: 0;
      left: 0;
      z-index: 999;
      font-size: 0.28rem;
      span {
        font-size: 0.4rem;
        border-bottom: 1px solid #c55234;
        cursor: pointer;
      }
    }
  }
}
</style>