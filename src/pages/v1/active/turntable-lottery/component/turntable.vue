<template>
  <div class="turntable-body">
    <LuckyWheel
      ref="myLucky"
      :width="width"
      :height="width"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @end="endCallback"
    />
  </div>
</template>
<script>
export default {
  props: {
    prizes: {
      type: Array,
      default: () => {
        return [];
      },
    },
    blocks: {
      type: Array,
      default: () => {
        return [];
      },
    },
    buttons: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  created() {
    this.checkScreen();
    //  window.addEventListener("resize", this.checkScreen);
  },
  beforeDestroy() {
    // window.removeEventListener("resize", this.checkScreen, false);
  },

  data() {
    return {
      isMobile: false,
      width: "7.2rem",
      height: 0,
      defaultConfig: { gutter: "5px" },
    };
  },
  methods: {
    checkScreen() {
      /*    if (this.$common.isMobile()) {
        this.width = "7rem";
      } else {
        this.width = "8rem";
      } */
      /*      const w =
        document.documentElement.clientWidth || document.body.clientWidth;
      this.isMobile = this.$common.isMobile(); */
      /*          this.width = "6.4rem";
        this.blocks[0].padding = ".4rem";
        this.blocks[1].padding = ".44rem"; */
      /*   this.width = "600px";
      this.blocks[0].padding = "40px";
      this.blocks[1].padding = "44px"; */
      return;
      if (this.isMobile) {
        this.width = "6rem";
        this.blocks[0].padding = ".4rem";
        this.blocks[1].padding = ".44rem";
      } else {
        console.log("电脑端");
        this.width = "600px";
        this.blocks[0].padding = "40px";
        this.blocks[1].padding = "44px";
      }
    },
    // 点击抽奖按钮会触发star回调
    startCallback() {
      this.start(2);
    },
    start(idx) {
      this.$refs.myLucky.play();
      const time = this.$common.randomNumBoth(2000, 4000);
      setTimeout(() => {
        this.stop(idx);
      }, time);
    },
    stop(index) {
      // 调用stop停止旋转并传递中奖索引
      this.$refs.myLucky.stop(index);
      setTimeout(() => {
        this.$emit("listen");
      }, 1600);
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      console.log(prize);
    },
  },
};
</script>
<style lang="scss" scoped></style>
