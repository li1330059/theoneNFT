<template>
  <div class="open-app-body">
    <div v-if="mode == 'fixed'">
      <div class="open-app-wrap" v-if="isShow">
        <span @click="close" class="ui-icon icon-close-open"></span
        ><span class="open-app-btn" @click="openApp">APP内打开</span>
      </div>
    </div>
    <div v-else class="down-app-btn" @click="openApp">下载APP</div>
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
    mode: {
      type: String,
      default: "fixed",
    },
  },
  watch: {},
  created() {
    const isClose = localStorage.getItem("CLOSE-DOWN");

    this.isShow = isClose ? false : true;
  },
  computed: {},
  methods: {
    openApp() {
      const browser = App.browser;
      if (browser.browser.wechat) {
        this.$store.commit("setWxTip", {
          show: true,
        });
      } else {
        App.$methods.callApp();
      }
    },
    close() {
      this.isShow = false;
      localStorage.setItem("CLOSE-DOWN", 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.down-app-btn {
  display: none;
}
.open-app-wrap {
  display: none;
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
}
.icon-close-open {
  width: 0.36rem;
  height: 0.36rem;
  background-image: url("//static.theone.art/pc/open-app/icon-open-close.png");
  margin-right: 0.14rem;
}
@media screen and (max-width: 540px) {
  .down-app-btn {
    display: inline-block;
    height: 0.44rem;
    line-height: 0.44rem;
    text-align: center;
    padding: 0 0.2rem;
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 100px;
    font-size: .2rem;
    color: #ffffff;
  }
  .open-app-wrap {
    position: fixed;
    bottom: 1.2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999999;
    display: flex;
    align-items: center;

    .open-app-btn {
      display: inline-block;
      cursor: pointer;
      background: linear-gradient(
        90deg,
        rgba(255, 122, 100, 0.8) 0%,
        rgba(230, 31, 26, 0.8) 100%
      );
      box-shadow: 0px 2px 8px 0px rgba(88, 88, 88, 0.3);
      border-radius: 20px;
      border: 1px solid #ffffff;
      font-size: 14px;
      color: #ffffff;
      line-height: 32px;
      padding: 0 28px;
      text-align: center;
      user-select: none;
    }
  }
}
</style>
