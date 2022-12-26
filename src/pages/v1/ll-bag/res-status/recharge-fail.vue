<template>
  <div class="ll-bag-body ll-max-width">
    <img
      class="responsive-img"
      src="//static.theone.art/pc/ll-bag/account-fail.png"
    />
    <div class="title">充值失败</div>
    <div class="msg" v-if="msg" >{{msg}}</div>
    <section class="fixed-bottom">
      <div class="ll-btn ll-btn-primary ll-btn-full" @click="back">确定</div>
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
      this.$router.replace(`/ll_bag/recharge`);
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
  padding:0 60px;
}
</style>
