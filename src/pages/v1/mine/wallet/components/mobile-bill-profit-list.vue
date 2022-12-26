
<template>
  <div class="ui-wrap">
    <div
      class="line-block ui-bar-border"
      v-for="(item, idx) in listResult.records"
      :key="idx"
    >
      <div class="line-bar">
        <div>
          <div class="txt">
            <div v-if="item.dataType == 1">售出-{{ item.goodsName }}</div>
            <div v-else-if="item.dataType == 2">结算</div>
            <div v-else-if="item.dataType == 3">支付</div>
            <div v-else-if="item.dataType == 4">账户金额提现</div>
            <div v-else-if="item.dataType == 5">退款</div>
          </div>
        </div>
        <div>
          <div class="yellow-num" v-if="item.operateType == 1">
            + {{ $common.formatMoney(item.amount) }}
          </div>
          <div class="red-num" v-if="item.operateType == 2">
            - {{ $common.formatMoney(item.amount) }}
          </div>
        </div>
      </div>
      <div class="line-bar">
        <div>操作前</div>
        <div>
          <div class="txt">
            <div>{{ $common.formatMoney(item.amountOld) }}</div>
          </div>
        </div>
      </div>
      <div class="line-bar">
        <div>操作后</div>
        <div>
          <div class="txt">
            <div>{{ $common.formatMoney(item.amountNew) }}</div>
          </div>
        </div>
      </div>
      <div class="line-bar">
        <div>单据编号</div>
        <div>
          {{ item.dataNo }}
        </div>
      </div>
      <div class="line-bar">
        <div>时间</div>
        <div>{{item.createTime}}</div>
      </div>
      <div class="message">
        <div v-html="item.message"></div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  components: {},
  props: {
    listResult: {
      type: Object,
      default: () => {
        return {
          records: [],
        };
      },
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/wallet-bill-list.scss";
</style>
