<template>
  <div class="ll-bag-dialog-body" v-if="isShow">
    <div class="mask"></div>
    <div class="main">
      <div class="ll-icon icon-close hand" @click="hide"></div>
      <div class="msg">{{ msg }}</div>
      <div class="ll-btn-group space-center" :class="{'space-between':cancelTxt&&confirmTxt}">
        <div class="ll-btn" v-if="cancelTxt" @click="cancel">
          {{ cancelTxt }}
        </div>
        <div class="ll-btn primary" v-if="confirmTxt" @click="confirm">
          {{ confirmTxt }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      isShow: false,
      msg: "",
    };
  },
  created() {},
  methods: {
    show(opt) {
      this.msg = opt.msg || "";
      this.isShow = true;
      this.cancelTxt = opt.cancelTxt;
      this.confirmTxt = opt.confirmTxt;
      this.confirmCb = opt.confirm;
      this.cancelCb = opt.cancel;
    },
    hide() {
      this.isShow = false;
    },
    cancel() {
    
      if (this.cancelCb) {
        this.cancelCb();
      }
      this.hide();
    },
    confirm() {
      if (this.confirmCb) {
        console.log(  this.confirmCb);
        this.confirmCb();
      }
      this.hide(); 
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.ll-bag-dialog-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(51, 51, 51, 0.4);
  }
  .main {
    position: relative;
    z-index: 4;
  }
  @media screen and (max-width: 540px) {
    position: fixed;
  }
}
.ll-btn-group {
  display: flex;
  justify-content: space-between;
  .ll-btn {
    line-height: 40px;
    background: #f7f7f7;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    color: #333333;
    text-align: center;
    width: 46%;
  }
  .primary {
    color: #343edf;
  }
}
.space-center{
  justify-content: center;
}
.space-between{
  justify-content: space-between;
}
.main {
  background: #ffffff;
  border-radius: 20px;
  width: 90%;
  margin: 20vh auto 0;
  padding: 26px;
  .msg {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    line-height: 20px;
    text-align: center;
    padding-bottom: 32px;
    padding-top: 50px;
  }
}
.icon-close {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
}
</style>
