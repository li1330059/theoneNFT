<template>
  <div class="yb-body grayscale">
    <status-template
      :list="withdrawResult && withdrawResult.records"
      api="/order/api/withdrawalOrder/list"
      :init="getList"
    >
      <div class="page-mine-wallet-index">
        <yb-mobile-bill-withdraw-list
          v-if="$common.isMobile()"
          :listResult="withdrawResult"
        ></yb-mobile-bill-withdraw-list>
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
              <section></section>
              <section class="w-200">
                <div v-if="item.auditStatus == 1">待审核</div>
                <div v-else-if="item.auditStatus == 2">审核中</div>
                <div v-else-if="item.auditStatus == 4">审核失败</div>
                <div v-else-if="item.auditStatus == 3">
                  <span v-if="item.withdrawalStatus == 1"> 待提现</span>
                  <span v-if="item.withdrawalStatus == 2"> 提现中</span>
                  <span
                    v-if="
                      item.withdrawalStatus == 3 || item.withdrawalStatus == 0
                    "
                  >
                    {{ item.autoFlag ? "结算成功" : "提现申请成功" }}</span
                  >
                  <span v-if="item.withdrawalStatus == 4"> 提现失败</span>
                </div>
              </section>
              <section class="w-200">
                <span class="red-num">-{{ $common.formatMoney(item.amount) }}</span>
                
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
        :pageSize="params.pageSize"
        :list="withdrawResult.records"
        :current-page="withdrawResult.current"
      />
    </div>
  </div>
</template>
<script>
import YbMobileBillWithdrawList from "./yb-mobile-bill-withdraw-list.vue";
export default {
  components: { YbMobileBillWithdrawList },
  data() {
    return {
      params: {
        payChannel: "yb",
        pageCount: 1,
        pageSize: 12,
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
</style>
