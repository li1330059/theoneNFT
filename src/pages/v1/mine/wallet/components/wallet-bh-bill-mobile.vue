/* 手机端账单 */
<template>
  <div>
    <div
      class="line-block ui-bar-border"
      v-for="(item, idx) in BHListResult.records"
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
          {{ item.withdrawalTime || item.createTime }}
        </div>
      </div>
      <div class="line-bar">
        <div>单据编号</div>
        <div>
          {{ item.orderNo }}
        </div>
      </div>
      <div class="line-bar">
        <div>
          <div class="data-type">
            <!--  {{ item.withdrawalStatus }}
              {{ item.auditStatus }} -->
            <div v-if="item.auditStatus == 3">
              <div v-if="item.withdrawalStatus == 1">
                <!-- 审核成功-待提现 -->
                可提款金额
              </div>
              <div v-if="item.withdrawalStatus == 2">
                <!-- 提现中 -->
                财务打款中
              </div>

              <div v-if="item.withdrawalStatus == 3">
                <!-- 提现成功 -->
                <!--   - {{ $common.formatMoney(item.amount) }} -->
                宝付账户累计冻结金额减少
              </div>
              <div v-if="item.withdrawalStatus == 4">
                <!-- 提现失败 -->提现失败
              </div>
            </div>
            <div v-else>
              <div v-if="item.auditStatus == 1">
                <!-- 申请成功（待审核） -->
                <!--    + {{ $common.formatMoney(item.amount) }} -->
                宝付账户冻结金额增加
              </div>
              <div v-if="item.auditStatus == 2">
                <!-- 审核中 -->
                可提款金额
              </div>

              <div v-if="item.auditStatus == 4">
                <!-- 审核失败 -->
                审核失败
              </div>
            </div>
          </div>
        </div>
        <div>
          <div v-if="item.auditStatus == 3">
            <span
              v-if="item.withdrawalStatus == 1 || item.withdrawalStatus == 2"
              @click="baohuWidthdraw(item)"
              class="draw-btn"
              >提款</span
            >
          </div>
        </div>
      </div>
      <div class="message">
        <baohu-bill-message :info="item" />
      </div>
    </div>

<!--     <div class="pagination-wrap">
      <g-paging
        :pageChange="handleCurrentChange"
        :pageSize="10"
        :list="BHListResult.records"
        :current-page="BHListResult.current"
      />
    </div> -->
  </div>
</template>
<script>
import BaohuBillMessage from "./baohu-bill-message.vue";
export default {
  components: {
    BaohuBillMessage,
  },
  props: {
    BHListResult: {
      type: Object,
      default: () => {
        return {
          records: [],
        };
      },
    },
    baohuWidthdraw: {
      type: Function,
      default: () => {},
    },
    handleCurrentChange: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      drawDisabled: false,
    };
  },
  mounted() {
    // 获取账单
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/wallet-bill-list.scss";
.pagination-wrap {
  display: flex;
  justify-content: center;
  padding: 0.2rem 0 1.4rem;
}
.draw-btn {
  border-radius: 100px;
  border: 1px solid #397fe7;
  font-size: 12px;
  font-weight: 400;
  color: #397fe7;
  padding: .04rem .46rem;
  display: inline-block;
  user-select: none;
}
</style>
