<template>
  <transition name="fade">
    <div class="paypassword-input-dialog" v-if="isShow">
      <div class="mask"></div>
      <section class="input-block main">
        <div class="ll-icon icon-close hand" @click="hide"></div>
        <div class="title" v-if="title">{{ title }}</div>
        <div class="msg" v-if="des">{{ des }}</div>
        <div class="money" v-if="price">{{ $common.formatMoney(price) }}</div>
        <div class="pay-input-box">
          <pay-password-input
            @success="listenSuccess"
            @error="listenError"
            ref="payPasswordRef"
          ></pay-password-input>
        </div>
      </section>
    </div>
  </transition>
</template>
<script>
import PayPasswordInput from "./pay-password-input.vue";
export default {
  components: { PayPasswordInput },
  data() {
    return {
      isShow: false,
    };
  },
  props: {
    price: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
    des: {
      type: String,
      default: "",
    },
  },
  created() {},
  methods: {
    init() {
      this.isShow = true;
      this.createCss();
    },
    createCss() {},
    hide() {
      this.isShow = false;
    },
    clearInput() {
      this.$refs.payPasswordRef.clearInput();
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
.paypassword-input-dialog {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(51, 51, 51, 0.4);
  }
  @media screen and (max-width: 540px) {
    position: fixed;
  }
}

.input-group {
  margin-bottom: 24px;
  .label {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 12px;
  }
}
.main {
  position: absolute;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  .icon-close {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 16px;
    left: 16px;
  }
  @media screen and (max-width: 540px) {
    position: fixed;
    top: 40%;
    transform: translate(-50%, -50%);
  }
}
.input-block {
  background: #ffffff;
  border-radius: 20px;
  text-align: center;
  padding: 26px;
  .title {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
  }
  .msg {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-top: 26px;
  }
  .money {
    font-size: 32px;
    font-weight: 600;
    color: #333333;
    margin-top: 8px;
  }
  .input-list {
    display: flex;
    margin-top: 8px;
    .input-box {
      flex: 1;
      padding: 4.5px;
      cursor: pointer;
      .input {
        height: 40px;
        line-height: 40px;
        background: #f7f7f7;
        border-radius: 4px;
        user-select: none;
      }
    }
  }
}
.pay-input-box {
  margin-top: 16px;
}
@media screen and (max-width: 540px) {
  .pay-input-box {
  }
}
#LOGPASS2_SHOW {
  display: none;
}
</style>
