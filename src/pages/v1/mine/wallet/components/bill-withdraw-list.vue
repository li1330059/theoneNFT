<template>
  <div>
    <status-template
      :list="withdrawResult && withdrawResult.records"
      api="/order/api/withdrawalOrder/list"
      :init="getList"
    >
      <div class="page-mine-wallet-index">
        <mobile-bill-withdraw-list
          v-if="$common.isMobile()"
          :listResult="withdrawResult"
        ></mobile-bill-withdraw-list>
        <div v-else>
          <div
            class="line-block ui-bar-border"
            v-for="(item, index) in withdrawResult.records"
            :key="index"
          >
            <div class="line-bar">
              <section class="flex1">
                <div class="line-bar">
                  <div class="key">单据编号</div>
                  <div class="val txt">{{ item.orderNo }}</div>
                </div>
                <div class="line-bar">
                  <div class="key">
                    {{ item.autoFlag ? "结算时间" : "申请时间" }}
                  </div>
                  <div class="val">
                    {{ item.withdrawalTime || item.createTime }}
                  </div>
                </div>
              </section>
              <section class="w-200">
                <div v-if="item.payType == 1">微信</div>
                <div v-else-if="item.payType == 2">支付宝</div>
                <div v-else-if="item.payType == 3">银行卡</div>
              </section>
              <section class="w-200">
                <div v-if="item.auditStatus == 1">待审核</div>
                <div v-else-if="item.auditStatus == 2">审核中</div>
                <div v-else-if="item.auditStatus == 4">审核失败</div>
                <div v-else-if="item.auditStatus == 3">
                  <span v-if="item.withdrawalStatus == 1"> 待提现</span>
                  <span v-if="item.withdrawalStatus == 2"> 提现中</span>
                  <span v-if="item.withdrawalStatus == 3"> 提现成功</span>
                  <span v-if="item.withdrawalStatus == 4"> 提现失败</span>
                </div>
              </section>
              <section class="w-200">
                <span class="red-num"
                  >-{{ $common.formatMoney(item.amount) }}</span
                >
              </section>
            </div>
            <div class="message">
              <div v-if="item.auditStatus == 4">{{ item.auditReason }}</div>
              <div v-if="item.withdrawalStatus == 4 && item.auditStatus == 3">
                {{ item.withdrawalReason }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </status-template>
    <div class="v1-pagination">
      <g-paging
        :pageChange="handleCurrentChange"
        :list="withdrawResult.records"
        :pageSize="params.pageSize"
        :current-page="withdrawResult.current"
      />
    </div>
  </div>
</template>
<script>
import MobileBillWithdrawList from "./mobile-bill-withdraw-list.vue";
export default {
  components: { MobileBillWithdrawList },
  data() {
    return {
      params: {
        pageCount: 1,
        pageSize: 12,
        payChannel: "hxt",
      },
      withdrawResult: {
        records: [],
      },
    };
  },
  created() {
    this.getList();
  },
  computed: {},
  methods: {
    // 获取账单记录
    async getList() {
      let result = await this.$api.service.withdrawalOrder_list(this.params);
      this.withdrawResult = result.data.data;
      /*    if (this.withdrawResult.records) {
        this.withdrawResult.records.forEach((a) => {
          a.message = walletMessage.message(a);
        });
      } */
    },
    // 分页
    handleCurrentChange(val) {
      this.params.pageCount = val;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/wallet-bill-list-pc.scss";
.ui-bar-border:last-child {
  border: none;
}

.v1-pagination {
  padding: 0;
}
</style>
