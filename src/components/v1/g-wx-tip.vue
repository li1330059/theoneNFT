<template>
  <transition name="fade">
    <div class="wx-tip-body" v-if="isShow" @click="hide">
      <div class="content">
        <div class="txt-wrap">
          <div class="txt">建议点击右上角···</div>
          <div class="txt">选择在浏览器中打开</div>
        </div>
        <div class="img-wrap">
          <img
            class="icon"
            src="//static.theone.art/pc/icons/icon-vx-tip.png"
          />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    isShow() {
      return this.$store.state.wxTipInfo.show;
    },
  },
  methods: {
    hide() {
      this.$store.commit("setWxTip", {
        show: false
      });
      sessionStorage.setItem(
        "WX_TIP",
        JSON.stringify({
          show: false
        })
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.wx-tip-body {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999999;
  width: 100%;
  height: 100%;

  .content {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-right: 25px;
  }
  .icon {
    display: block;
    width: 100%;
  }
  .img-wrap {
    max-width: 78px;
  }
}
.txt-wrap {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  .txt {
    margin-top: 17px;
  }
  padding-right: 20px;
}
</style>
