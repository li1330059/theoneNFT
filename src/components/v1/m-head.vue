<template>
  <div class="m-phone-header" v-if="isShow">
    <div class="main">
      <div class="icon-direction" @click="onCancel"></div>
      <div class="text">{{ title }}</div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import App from "@/utils/app/index";
export default {
  data() {
    return {
      isShow: true,
    };
  },
  props: {
    go: {
      type: Function,
    },
    title: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    $route: function (to, from) {
      this.checkHeaderStatus(to.meta);
    },
  },
  created() {
    this.checkHeaderStatus(this.$route.meta);
  },
  computed: {},
  methods: {
    back() {
      this.$router.back();
    },
    onCancel() {
      if (this.go) {
        this.go();
      } else {
        this.back();
      }
    },
    checkHeaderStatus(meta) {
      const browser = App.browser.browser;

      this.isShow = true;
      if (this.show) {
        return;
      }
      if (meta.hideMoblieHeader) {
        this.isShow = false;
      }
      if (App.browser.theone && App.browser.theone.isTheOne) {
        //app内
        if (meta.headerTheoneHide) {
          this.isShow = false;
        }
      }
      if (browser.wechat) {
        //微信内
        if (meta.headerWechatHide) {
          this.isShow = false;
        }
      }
      if (browser.weibo) {
        //微博内
        if (meta.headerWeiboHide) {
          this.isShow = false;
        }
      }
      // if(this.$route.meta.hideMoblieFooter){
      // 	this.isShow = true;
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
.m-phone-header {
  margin-top: constant(safe-area-inset-top);
  margin-top: env(safe-area-inset-top);
  display: none;
  height: 1.08rem;
  @media screen and (max-width: 540px) {
    display: block;
    .main {
      width: 100%;
      background: #fff;
      height: 1.08rem;
      position: fixed;
      z-index: 999;
      padding: 0 0.32rem;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.36rem;
      font-weight: 500;
      color: #333333;
      margin-top: constant(safe-area-inset-top);
      margin-top: env(safe-area-inset-top);
      .icon-direction {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("//static.theone.art/pc/icons/icon-left-direction.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        position: absolute;
        left: 0.32rem;
      }
      .placeholder {
        width: 0.4rem;
      }
      .text {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 5rem;
      }
    }
  }
}
</style>
