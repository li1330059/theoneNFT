<template>
  <div class="amount-type">
    <div v-if="info.amountType == 1">可用金额</div>
    <div v-else-if="info.amountType == 2">冻结金额</div>
    <div v-else-if="info.amountType == 3">待结算金额</div>
    <div v-else-if="info.amountType == 4">累计销售额</div>
    <div v-else-if="info.amountType == 5">累计收益额</div>
    <div v-else-if="info.amountType == 6">累计余额支付额</div>
    <div v-else-if="info.amountType == 7">累计充值额</div>
    <div v-else-if="info.amountType == 8">累计手续费</div>
    <div v-else-if="info.amountType == 9">累计第三方支付额</div>
    <div v-else-if="info.amountType == 10">累计提现金额</div>
    <div v-else-if="info.amountType == 11">宝户可用余额</div>
    <div v-else-if="info.amountType == 12">宝户冻结金额</div>
    <div v-else-if="info.amountType == 13">累计宝户提现金额</div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    info: {},
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
