/* 手机端账单 */
<template>
  <div>
    <div
      class="line-block ui-bar-border"
      v-for="(item, idx) in listResult.records"
      :key="idx"
    >
      <div class="line-bar">
        <div>账户余额变动</div>
        <div>
          <span class="red-num"> -{{ $common.formatMoney(item.amount) }} </span>
        </div>
      </div>
      <div class="line-bar">
        <div>{{ item.autoFlag ? "结算时间" : "申请时间" }}</div>
        <div>
          {{ item.createTime }}
        </div>
      </div>
      <div class="line-bar">
        <div>单据编号</div>
        <div>
          {{ item.orderNo }}
        </div>
      </div>
      <div class="message">
        <div v-if="item.auditStatus == 4">{{ item.auditReason }}</div>
        <div v-if="item.withdrawalStatus == 4 && item.auditStatus == 3">
          {{ item.withdrawalReason }}
        </div>
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
