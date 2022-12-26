<template>
  <div>
    <div class="autumn-content">
      <div class="banner-wrap">
        <div class="logo-wrap pc-hide">
          <img class="logo" :src="config.theoneLogo" />
        </div>
        <img class="title-img pc-hide" :src="config.title" />
        <div ref="animateWrapRef" id="banner-wrap">
          <img
            class="responsive-img banner-img animate-img"
            v-lazy="config.bannerBlock"
          />
        </div>
      </div>
      <div class="info-wrap">
        <img class="logo phone-hide" :src="config.theoneLogo" />
        <img class="title-img phone-hide" :src="config.title" />
        <div class="btn-wrap">
          <div
            class="draw-btn bg-img hand"
            @click="onDraw(item)"
            :style="`background-image:url(${config.btnImg})`"
            v-for="item in wayArr"
            :key="item.type"
          >
            {{ item.txt }}
          </div>
        </div>
      </div>
    </div>
    <section
      v-if="activeRule"
      class="m-active-rule active-turntable-lottery-main-bg active-turntable-lottery-active-rule-color"
    >
      <img
        class="message-title"
        src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/m2-title.png"
      />
      <div class="txt" v-html="activeRule"></div>
    </section>

    <section
      v-if="config.activeMessage"
      class="m-active-rule m-active-message active-turntable-lottery-main-bg active-turntable-lottery-active-message-color"
    >
      <img
        class="message-title"
        src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/m1-title.png"
      />

      <div class="txt" v-html="config.activeMessage"></div>
    </section>
    <m-animate ref="mAnimateRef" @listenEnd="end"></m-animate>
    <success-dialog
      ref="successRef"
      :successTitle="config.successTitle"
      :top="config.successTop"
      :bottom="config.successBottom"
      :bg="config.successBg"
    ></success-dialog>
  </div>
</template>
<script>
import MAnimate from "./m-animate.vue";
import SuccessDialog from "../../component/success-dialog.vue";
import { Particle } from "./particle-2";
import { windowVisibility } from "./window-hidden";
export default {
  components: { MAnimate, SuccessDialog },
  data() {
    return { particles: [] };
  },
  props: {
    wayArr: {
      type: Array,
      default: () => {
        return [];
      },
    },
    activeRule: {
      type: String,
      default: "",
    },
    dataJson: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    config() {
      return { ...this.dataJson };
    },
  },
  mounted() {
    /*     this.play(); */
  },
  created() {
    this.$nextTick(() => {
      this.startRound();
      windowVisibility.listen(
        () => {},
        () => {
          this.particles = this.particles.filter(function (p) {
            p.destroy();
            return false;
          });
        }
      );
    });
  },
  beforeDestroy() {
    clearInterval(this.startTimer);
    clearInterval(this.timer);
  },
  methods: {
    startRound() {
      this.startTimer = setInterval(() => {
        const domP = this.$refs.animateWrapRef.getBoundingClientRect();
        if (domP.width) {
          clearInterval(this.startTimer);
          this.createRound(domP.width, domP.height);
        }
      }, 200);
    },
    createRound(width, height) {
      const self = this;
      clearInterval(this.timer);
      const data = [
        `<img
        style="width:${40}px"
      src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/icon-round.png"
    />`,
      ];
      self.particles = [];
      let num = 4;
      let r = 1 + Math.random() * 6;
      if (this.$common.isMobile()) {
        r = 0.6 + Math.random() * 5;
        num = 4;
      }

      this.timer = setInterval(() => {
        self.particles.push(
          new Particle(
            data[0],
            {
              x: Math.random() * width,
              y: height,
            },
            1 + Math.random() * 3,
            "#banner-wrap"
          )
        );
      }, 800);

      function update() {
        self.particles = self.particles.filter(function (p) {
          return p.move();
        });
        requestAnimationFrame(update);
      }
      update();
    },
    onDraw(e) {
      this.$emit("listenDraw", e);
    },
    play() {
      this.$refs.mAnimateRef.play();
    },
    end() {
      this.isShow = false;
      this.$emit("listenAnimateEnd", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.banner-wrap {
}
#banner-wrap {
  position: relative;
  top: 0;
  left: 0;
  min-width: 200px;
}
.autumn-content {
  display: flex;
  max-width: 1140px;
  margin: 0 auto 135px;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 89px;
  .pc-hide {
    display: none;
  }
  @media screen and (max-width: 540px) {
    display: block;
    margin: 0 auto 1.28rem;
    padding-top: 0.24rem;
    .logo {
      width: 3.12rem;
    }
    .phone-hide {
      display: none;
    }
    .pc-hide {
      display: block;
    }
    .banner-img {
      width: 70%;
      margin: 0 auto 1.16rem;
    }
    .logo-wrap {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.92rem;
    }
    .title-img {
      width: 80%;
      margin: 0 auto 1.16rem;
    }
  }
}

.banner-img {
  max-width: 413px;
}

.info-wrap {
  flex: 1;
  .logo {
    max-width: 317px;
    margin-bottom: 40px;
  }
  .title-img {
    max-width: 530px;
    margin-bottom: 40px;
    width: 100%;
  }
  > img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .btn-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0;
    .draw-btn {
      background-size: 100% 100%;
      text-align: center;
      display: inline-block;
      padding: 13px 20px;
      min-width: 310px;
      font-size: 30px;
      font-weight: bold;
      color: #8d2500;
      letter-spacing: 6px;
    }
  }
  @media screen and (max-width: 540px) {
    .btn-wrap {
      .draw-btn {
        padding: 0.13rem 0.2rem;
        width: 4.52rem;
        min-width: initial;
        font-size: 0.36rem;
        letter-spacing: initial;
      }
    }
  }
}
.m-active-rule {
  position: relative;
  top: 0;
  left: 0;
  &::before {
    content: "";
    display: block;
    width: 100%;
    height: 30px;
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/border-4.png");
    background-size: 100% 100%;
  }
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 30px;
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/border-3.png");
    background-size: 100% 100%;
  }
  .txt {
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/border-2.png");
    background-size: 100% auto;
    background-repeat: repeat-y;
    padding: 50px 28px 14px;
    line-height: 28px;
  }

  .message-title {
    width: 309px;
    display: block;
    margin: 0 auto 18px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -7px;
  }
  @media screen and (max-width: 540px) {
    &::before {
      height: 0.6rem;
      background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/top-m.png");
    }
    &::after {
      height: 0.6rem;
      background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/bottom-m.png");
    }
    .txt {
      line-height: 0.42rem;
      padding: 0.5rem 0.28rem 0.1rem;
      background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/mid-m.png");
    }
    .message-title {
      width: 70%;
      top: -0.12rem;
    }
  }
}
.m-active-message {
  margin-top: 60px;
}
.animate-img {
  animation: shake 2.6s infinite linear;
}
@keyframes shake {
  0% {
    transform: translateX(-8px);
  }
  50% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-8px);
  }
}
</style>
