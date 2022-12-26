<template>
  <div class="ll-bag-body ll-max-width">
    <img
      class="responsive-img"
      src="//static.theone.art/pc/ll-bag/account-fail.png"
    />
    <div class="title">开通失败</div>
    <div class="msg" v-if="msg">失败原因：{{ msg }}</div>
    <section class="fixed-bottom">
      <div class="ll-btn ll-btn-primary ll-btn-full" @click="back">返回</div>
    </section>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return { msg: "" };
  },
  created() {
    this.msg = this.$route.query.msg;
  },
  methods: {
    back() {
      window.location.href = `/ll_bag/account_opening`;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(232, 67, 53, 1);
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
