<template>
  <div class="ll-bag-body ll-max-width ll-body-x-padding">
    <m-head></m-head>
    <div class="warp">
      <div class="price">
        <div class="num">{{ $common.formatMoney(info.amount) }}</div>
        <div class="text">成功</div>
      </div>
      <div class="info">
        <div class="li">
          <div class="label">商品名称：</div>
          <div>{{ info.goodsName }}</div>
        </div>
        <div class="li">
          <div class="label">交易时间：</div>
          <div>
            {{ info.createTime }}
          </div>
        </div>
        <div class="li">
          <div class="label">交易类型：</div>
          <div v-if="info.type == 1">收款</div>
          <div v-if="info.type == 2">消费</div>
          <div v-if="info.type == 3">充值</div>
          <div v-if="info.type == 4">提现</div>
          <div v-if="info.type == 5">退款</div>
          <div v-if="info.type == 6">收款-定金</div>
          <div v-if="info.type == 7">收款-尾款</div>
          <div v-if="info.type == 10">收款-退赔</div>
          <div v-if="info.type == 8">消费-定金</div>
          <div v-if="info.type == 9">消费-尾款</div>
          <div v-if="info.type == 11">消费-退赔</div>
        </div>
        <div class="li">
          <div class="label">交易方式：</div>
          <div>{{ info.tradeWay }}</div>
        </div>
        <div class="li">
          <div class="label">订单编号：</div>
          <div>{{ info.outTradeNo }}</div>
        </div>
      </div>
    </div>
    <ll-footer class="fixed-bottom" />
  </div>
</template>
<script>
import llFooter from "./components/ll-footer.vue";
import MHead from "./components/m-head.vue";
export default {
  components: { llFooter, MHead },
  data() {
    return {
      info: null,
    };
  },
  watch: {
    $route: function (to, from) {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.query.item) {
        this.info = JSON.parse(decodeURIComponent(this.$route.query.item));
        console.dir(this.info);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.warp {
  background: #f7f7f7;
  border-radius: 16px 16px 0px 0px;
  backdrop-filter: blur(10px);
  .price {
    text-align: center;
    padding: 35px 0 32px;
    .num {
      font-size: 32px;
      font-weight: 600;
      color: #333333;
    }
    .text {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      margin-top: 5px;
    }
  }
  .info {
    background: #ffffff;
    border-radius: 16px 16px 0 0;
    backdrop-filter: blur(10px);
    padding: 0 20px;
    .li {
      display: flex;
      padding: 16px 0;
      border-bottom: 1px solid #f7f7f7;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      .label {
        color: #999999;
        margin-right: 18px;
      }
    }
  }
}
</style>
