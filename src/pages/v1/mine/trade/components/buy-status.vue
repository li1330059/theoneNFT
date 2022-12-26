<template>
  <div class="">
    {{ statusObj.txt }}
    <div
      class="v1-btn mycenter red"
      v-if="statusObj.isRefund"
      @click="onRefund"
    >
      主动退款
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    statusObj() {
      if (
        this.data.statusTrade == 0 &&
        this.data.depositObj &&
        this.data.depositObj.statusTrade == 0
      ) {
        return { txt: "待支付定金" };
      }
      if (
        this.data.statusTrade == 0 &&
        this.data.balanceObj &&
        this.data.balanceObj.statusTrade == 0
      ) {
        return { txt: "待支付尾款", isRefund: true };
      }
      if (
        this.data.statusTrade == 5 &&
        this.data.refundObj &&
        this.data.refundObj.statusTrade == 1
      ) {
        return { txt: "已关闭 退款成功", time: "" };
      }
      if (
        this.data.statusTrade == 5 &&
        this.data.balanceObj &&
        this.data.balanceObj.statusTrade == 4
      ) {
        return { txt: "已关闭 尾款超时未支付" };
      }
      return {};
    },
  },

  created() {},
  methods: {
    onRefund() {
      this.$emit("refund", this.data);
    },
  },
};
</script>
<style lang="scss" scoped></style>
