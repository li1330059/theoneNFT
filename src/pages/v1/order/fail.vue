<template>
  <div class="page-order-fail">
    <div class="order-fails">
      <div class="icon"></div>
      <div class="btns">
        <div
          class="v1-btn disabled-btn h30"
          @click="$common.goPage('/mine/buy')"
        >
          取消
        </div>
        <div class="v1-btn h30" @click="$common.goPage('/mine/buy')">
          重新支付
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    try {
      this.$nextTick(() => {
        document.addEventListener("UniAppJSBridgeReady", function () {
          uni.redirectTo({
            url: "/pages/order/fail",
          });
        });
      });
    } catch (e) {}
    /*     const browserObj = new Browser();
    alert(JSON.stringify(browserObj.browser)); */
  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
.page-order-fail {
  .order-fails {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 222px;
    margin: 200px auto;
    .icon {
      background: url("//static.theone.art/pc/images/pic-home/order-fail.png")
        no-repeat center center;
      width: 222px;
      height: 145px;
      margin-bottom: 32px;
      background-size: contain;
    }
    .btns {
      display: flex;
      justify-content: center;
      .v1-btn {
        width: 96px;
        margin: 0 5px;
      }
      .disabled-btn {
        background: #e5e5e5;
      }
    }
  }
}
</style>
