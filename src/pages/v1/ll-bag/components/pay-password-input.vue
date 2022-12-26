<template>
  <div class="pay-input-body">
    <div class="input-wrap">
      <pay-password-mobile
        ref="payPasswordMobileRef"
        v-if="this.$common.isMobile()"
        @success="listenSuccess"
        @error="listenError"
        :id="id"
        :space="space"
        :left="left"
      ></pay-password-mobile>
      <pay-password-pc
        ref="payPasswordPcRef"
        @success="listenSuccess"
        @error="listenError"
        :id="id"
        :space="space"
        :left="left"
        v-else
      ></pay-password-pc>
    </div>

    <div class="num-wrap">
      <div
        class="num-box"
        v-for="item in count"
        :key="item"
        :class="`j-num-box-${item}`"
      >
        <div class="num"></div>
      </div>
    </div>
  </div>
</template>
<script>
import PayPasswordMobile from "./pay-password-mobile.vue";
import PayPasswordPc from "./pay-password-pc.vue";
export default {
  components: { PayPasswordMobile, PayPasswordPc },
  data() {
    return {
      count: 6,
      space: 0,
      left: 0,
    };
  },
  props: {
    id: {
      type: String,
      default: "12",
    },
    autoLoad: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
    window.addEventListener("resize", this.createCss);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.createCss, false);
  },
  methods: {
    init(options) {
      this.createCss();
      setTimeout(() => {
        this.createCss();
      }, 500);
      if (this.autoLoad) {
        this.$nextTick(() => {
          if (this.$common.isMobile()) {
            this.$refs.payPasswordMobileRef.init(options);
          } else {
            this.$refs.payPasswordPcRef.init(options);
          }
        });
      }
    },
    clearInput() {
      if (this.$common.isMobile()) {
        this.$refs.payPasswordMobileRef.clearInput();
      } else {
        this.$refs.payPasswordPcRef.clearInput();
      }
    },
    createCss() {
      this.$nextTick(() => {
        const $dom = document.querySelector(".j-num-box-1");
        const pInfo = $dom ? $dom.getBoundingClientRect() : { width: 50 };
        const width = pInfo.width;
        console.log(width);
        const w = parseInt(width / 2);
        this.space = width - 5;
        this.left = w;
      });
    },
    load(options) {
      this.$nextTick(() => {
        this.createCss();
        setTimeout(() => {
          this.createCss();
        }, 500);
        if (this.$common.isMobile()) {
          this.$refs.payPasswordMobileRef.init(options);
        } else {
          this.$refs.payPasswordPcRef.init(options);
        }
      });
    },

    listenSuccess(info) {
      this.isShow = false;
      this.$emit("success", info);
    },
    listenError(info) {
      this.$emit("error", info);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.num-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: 0;
  left: 0;
  .num-box {
    flex: 1;
    padding: 4px;
    .num {
      background: #f7f7f7;
      border-radius: 4px;
      height: 48px;
    }
  }
}
.pay-input-body {
  position: relative;
  top: 0;
  left: 0;
  .input-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    ::v-deep .password-input {
      display: block;
      width: 100%;
      height: 100%;
      input {
        display: block;
        border: none;
        width: 100%;
        height: 100%;
        background: initial;
      }
    }
  }
  @media screen and (max-width: 540px) {
    .input-wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      ::v-deep .password-input {
        display: block;
        width: 100%;
        height: 100%;
        input {
          display: block;
          border: none;
          width: 100%;
          height: 100%;
          background: initial;
        }
      }
    }
  }
}

#LOGPASS2_SHOW {
  display: none;
}
</style>
