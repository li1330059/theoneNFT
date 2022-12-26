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
      <section class="w-200 line-bar" style="color: #333">
        <span v-if="item.withdrawalStatus == 1"> 待提现</span>
        <span v-if="item.withdrawalStatus == 2"> 提现中</span>
        <span v-if="item.withdrawalStatus == 3"> 提现成功</span>
        <span v-if="item.withdrawalStatus == 4"> 提现失败</span>
      </section>
      <div class="message">
        <div v-if="item.withdrawalStatus == 4">
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
