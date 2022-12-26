<template>
  <div class="page-order-success">
    <div class="order-successs">
      <div class="icon"></div>
      <div class="des">已完成支付？</div>
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
  created() {},
  methods: {
    async onSure() {
      const orderNo = this.$common.getQueryString("order_no");
      if (orderNo) {
        const res = await this.$api.service.v3_pay_confirm({
          orderNo: orderNo,
        });
        if (res.data.code == 200) {
          this.$router.push("/mine/buy");
        } else {
          this.$message.error(res.data.message);
        }
      } else {
        this.$router.push("/mine/buy");
      }
    },
    goWalletBill() {
      /*    if (this.$common.isMobile()) {
       
      } else {
        this.$router.push("/mine/wallet/index");
      } */
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
