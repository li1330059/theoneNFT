<template>
  <div class="ll-bag-body ll-max-width">
    <img
      class="responsive-img"
      src="//static.theone.art/pc/ll-bag/pay-success.png"
    />
    <div class="title">充值成功</div>
    <div class="msg"></div>
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

  },
  beforeDestroy() {

  },
  methods: {
    confirm() {
      this.$router.replace(`/ll_bag`);
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
