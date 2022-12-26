<template>
  <div class="page-order-success">
    <div class="order-successs">
      <div class="icon"></div>
      <div class="des">您的提现资金正在路上，请耐心等待。</div>
      <div class="btns">
        <div class="v1-btn h30" @click="onSure">确定</div>
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
  },
  methods: {
    async onSure() {
      this.goWalletBill();
     
    },
    goWalletBill() {
      if (this.$common.isMobile()) {
        this.$router.push("/mine/wallet/bill_m");
      } else {
        this.$router.push("/mine/wallet/index");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-order-success {
  .order-successs {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 200px auto;
    .icon {
      background: url("//static.theone.art/pc/images/pic-home/order-success.png")
        no-repeat center center;
      width: 222px;
      height: 145px;
      background-size: contain;
      margin: 0 auto;
    }
    .des {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      text-align: center;
    }
    .btns {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      .v1-btn {
        width: 96px;
      }
    }
  }
}
</style>
