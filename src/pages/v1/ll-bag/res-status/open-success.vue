<template>
  <div class="ll-bag-body ll-max-width">
    <img
      class="responsive-img"
      src="//static.theone.art/pc/ll-bag/account-success.png"
    />
    <div class="title">开通成功</div>
    <div class="msg">{{ count }}秒后自动返回</div>
    <div class=""></div>
    <section class="fixed-bottom">
      <div class="ll-btn ll-btn-primary ll-btn-full" @click="back">返回</div>
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
      redirect: "",
    };
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  methods: {
    init() {
      this.countDown = new countDown({
        cdTime: 10,
        tickCall: (obj) => {
          this.count = obj.cdTime;
        },
        endCall: () => {
          this.back();
        },
      });
    },
    async back() {
      if (this.$route.query.back) {
        if (App.browser.theone.isTheOne) {
          App.$methods.goBack();
          return;
        } else {
          window.location.href = this.$route.query.back;
          return;
        }
      }

      await this.$store.dispatch("getLlAccountStatus");
      if (this.$store.state.llWalletAccountInfo.status != 10) {
        this.$message.error(`请稍等！还未开通！`);
        return;
      }

      const redirect = this.$localStorage.getItem("ll-redirect");
      if (redirect) {
        this.$localStorage.removeItem("ll-redirect");
        window.location.href = redirect;
      } else {
        this.$router.push(`/ll_bag`);
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
