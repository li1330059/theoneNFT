<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <section class="list-block">
      <div class="bar hand" @click="goChangePassword">
        <span class="name">修改支付密码</span>
        <span class="ll-icon icon-p-right"></span>
      </div>
      <div class="bar hand" @click="goResetPassword">
        <span class="name">忘记支付密码</span>
        <span class="ll-icon icon-p-right"></span>
      </div>
    </section>
    <ll-footer class="fixed-bottom"></ll-footer>
  </div>
</template>
<script>
import MHead from "./components/m-head.vue";
import llFooter from "./components/ll-footer.vue";
export default {
  components: { MHead,llFooter },
  data() {
    return {};
  },
  created() {},
  methods: {
    goChangePassword() {
      this.$router.push(`/ll_bag/change_pay_password`);
    },
    goResetPassword() {
      this.$router.push(`/ll_bag/reset_password`);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.list-block {
  .bar {
    height: 60px;
    background: #f7f7f7;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 16px;
    .name {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }
  }
}
</style>
