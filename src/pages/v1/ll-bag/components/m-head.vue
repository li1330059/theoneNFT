<template>
  <div class="head-body" v-if="isShow">
    <div class="main" :class="{ 'bg-color': isBgColor }">
      <span class="ll-icon icon-back" @click="goBack" v-if="isBack"></span>
      <div class="title">连连钱包</div>
      <div class="menu-wrap">
        <!--    <hamburger @click="toggleMenu"></hamburger> -->
      </div>
    </div>
    <div class="menu-wrap">
      <div class="mask"></div>
      <div class="menu-list">
        <div></div>
      </div>
    </div>
  </div>
</template>
<script>
import App from "@/utils/app/index";
import Hamburger from "./hamburger.vue";
export default {
  components: {},
  props: {
    isBack: {
      type: Boolean,
      default: true,
    },
    isBgColor: {
      type: Boolean,
      default: true,
    },
    back: {
      type: Function,
    },
  },
  data() {
    return { isShow: true };
  },
  created() {
    this.checkFooterStatus(this.$route.meta);
  },
  watch: {
    $route: function (to, from) {
      this.checkFooterStatus(to.meta);
    },
  },
  methods: {
    toggleMenu() {},
    goBack() {
      if (this.back) {
        this.back();
      } else {
        this.$router.back();
      }
    },
    checkFooterStatus(meta) {
      this.isShow = true;
      return;
      if (App.browser.theone && App.browser.theone.isTheOne) {
        this.isShow = false;
      }
      if (localStorage.getItem("is_uniapp")) {
        this.isShow = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.icon-back {
  width: 40px;
  height: 40px;
  background-image: url("https://static.theone.art/pc/ll-bag/icon-head-back.png");
}
.head-body {
  height: 80px;
  width: 100%;
  .main {
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;

    display: flex;
    .title {
      text-align: center;
      font-size: 22px;
      font-weight: 600;
      color: #2a3147;
      line-height: 80px;
      width: 100%;
    }
    .ll-icon {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
    }
  }
  .bg-color {
    background-color: #fff;
  }

  @media screen and (max-width: 540px) {
    .main {
      position: fixed;
    }
  }
}
</style>
