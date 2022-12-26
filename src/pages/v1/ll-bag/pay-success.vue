<template>
  <div class="ll-bag-body ll-max-width">
    <img
      class="responsive-img"
      src="//static.theone.art/pc/ll-bag/pay-success.png"
    />
    <div class="title">支付成功</div>
    <div class="msg">{{ count }}秒后自动返回</div>
    <section class="fixed-bottom">
      <div class="ll-btn ll-btn-primary ll-btn-full" @click="confirm">确定</div>
    </section>
  </div>
</template>
<script>
import countDown from "@/utils/countDown";
import App from "@/utils/app/index";
export default {
  components: {},
  data() {
    return {
      count: 5,
    };
  },
  created() {
    this.postMessage();
    const config = {
      cdTime: 5,
      tickCall: (obj) => {
        this.count = obj.cdTime;
      },
      endCall: () => {
        this.confirm();
      },
    };
    if (this.countDown) {
      this.countDown.start(config);
    } else {
      this.countDown = new countDown(config);
    }
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  methods: {
    confirm() {
      const url = localStorage.getItem("VISITOR-LINK");

      window.location.href=url ? url : "/market?type=copyright"
      /*       this.$router.replace(`/ll_bag`); */
    },
    postMessage() {
      this.theOne = App.browser.theone;
      if (App.browser.theone.isTheOne) {
        if (App.browser.os.ios) {
          App.ios.payResult("success");
        } else {
          App.android.payResult("success");
        }
      } else {
        setTimeout(() => {
          uni.redirectTo({
            url: "/pages/order/success",
          });
        }, 200);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.title {
  font-size: 16px;
  font-weight: 600;
  color: #58be6c;
  text-align: center;
  margin-top: 16px;
}
.msg {
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  text-align: center;
  margin-top: 6px;
}
</style>
