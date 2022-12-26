<template>
  <div class="ll-bag-body">
    <img
      class="responsive-img"
      src="//static.theone.art/pc/ll-bag/account-success.png"
    />
    <div class="title">开通成功</div>
    <div class="msg">5秒后自动返回</div>
    <router-link to="/ll_bag">
      <div class="ll-btn ll-btn-primary">返回</div>
    </router-link>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
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
