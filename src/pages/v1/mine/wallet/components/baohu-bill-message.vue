<template>
  <div>
    <div v-if="info.auditStatus == 3">
      <div v-if="info.withdrawalStatus == 1">
        您的提现申请已通过。可提款金额为<span>{{
          $common.formatMoney(info.amount)
        }}</span
        >，请点击右侧提款按钮在宝付账户完成提款操作。
      </div>
      <div v-if="info.withdrawalStatus == 2">
        <!-- 提现中 -->
        您的宝付账户提款操作完成。财务正在打款，累计提现金额增加<span>{{
          $common.formatMoney(info.amount)
        }}</span
        >请关注到账成功短信提醒。
      </div>
      <div v-if="info.withdrawalStatus == 3">
        您的宝付账户提款操作完成。财务已打款<!-- ，宝付账户冻结金额减少<span>{{
          $common.formatMoney(info.amount)
        }}</span
        > -->。
      </div>
      <div v-if="info.withdrawalStatus == 4">{{info.withdrawalReason}}</div>
    </div>
    <div v-else>
      <div v-if="info.auditStatus == 1">
        您已发起提现申请<!-- ，<span>{{ $common.formatMoney(info.amount) }}</span
        >进入宝付账户冻结金额池中，若提现被拒绝此资金将会原路返还 -->。
      </div>
      <div v-if="info.auditStatus == 2">提现审核中</div>
      <div v-if="info.auditStatus == 4">提现审核失败：{{info.auditReason}}</div>
    </div>
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
