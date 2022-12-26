<template>
  <div class="ll-bag-body fixed-bottom">
    <section class="list-wrap">
      <div class="list-bar">
        <div class="key">商品名称：</div>
        <div class="val">汤姆猫飞车</div>
      </div>
      <div class="list-bar">
        <div class="key">订单编号：</div>
        <div class="val">OTN1529779176939126785</div>
      </div>
      <div class="list-bar">
        <div class="key">支付方式：</div>
        <div class="val">
          <span class="ui-icon icon-money" />
          <span class="txt">余额(¥1.00)</span>
          <span class="ui-icon"></span>
        </div>
      </div>
    </section>
    <div class="fixed-bottom">
      <div class="ll-btn ll-btn-primary ll-btn-full">余额支付 ¥35.00</div>
    </div>

  </div>
</template>
<script>

export default {
  components: {  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";

.list-wrap {
  background: #ffffff;
  border-radius: 16px 16px 0px 0px;
  backdrop-filter: blur(10px);
}
.list-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f7f7f7;
  .key {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
  }
  .val {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
}
</style>
