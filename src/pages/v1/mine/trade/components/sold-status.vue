<template>
  <div class="">
    <span class="txt"> {{ statusObj.txt }}</span>

    <div class="v1-btn mycenter" v-if="statusObj.isRefund" @click="onRefund">
      违约退赔
    </div>

    <div v-if="statusObj.time">支付时间：{{ statusObj.time }}</div>
  </div>
</template>
<script>
import { soldStatus } from "./sold-status.js";

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
      return soldStatus(this.data);
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
<style lang="scss" scoped>
.txt {
  margin-bottom: 6px;
  display: inline-block;
}
@media screen and (max-width: 540px) {
  .txt {
    display: inline;
    font-size: 0.24rem;
    font-weight: 400;
    color: #333;
  }
}
</style>
