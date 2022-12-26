<template>
  <div class="ll-bag-body">
    <img
      class="responsive-img"
      src="//static.theone.art/pc/ll-bag/account-fail.png"
    />
    <div class="title">开通失败</div>
    <div class="msg">失败原因：XXXXXXX</div>
    <div class="ll-btn ll-btn-primary">返回</div>
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
  color: rgba(232, 67, 53, 1);
  text-align: center;
  margin-top: 16px;
}
.msg {
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  text-align: center;
  margin-top:6px;
}
</style>
