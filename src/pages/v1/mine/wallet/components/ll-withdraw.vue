<template>
  <div class="yb-body grayscale">
    <status-template
      :list="withdrawResult && withdrawResult.records"
      api="/finance/api/llWithdrawal/list"
      :init="getList"
    >
      <div class="page-mine-wallet-index">
        <ll-withdraw-mobile
          v-if="$common.isMobile()"
          :listResult="withdrawResult"
        ></ll-withdraw-mobile>
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
                    {{item.createTime}}
                  </div>
                </div>
              </section>
              <section></section>
              <section class="w-200">
                <span v-if="item.withdrawalStatus == 1"> 待提现</span>
                <span v-if="item.withdrawalStatus == 2"> 提现中</span>
                <span v-if="item.withdrawalStatus == 3"> 提现成功</span>
                <span v-if="item.withdrawalStatus == 4"> 提现失败</span>
              </section>
              <section class="w-200">
                <span class="red-num"
                  >-{{ $common.formatMoney(item.amount) }}</span
                >
              </section>
            </div>
            <div class="message">
              <div v-if="item.withdrawalStatus == 4">
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
import LlWithdrawMobile from "./ll-withdraw-mobile.vue";
export default {
  components: { LlWithdrawMobile },
  data() {
    return {
      params: {
        payChannel: "ll",
        pageCount: 1,
        pageSize: 10,
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
      let result = await this.$api.service.ll_llWithdrawal_list(this.params);
      this.withdrawResult = result.data.data;

      this.withdrawResult.records = this.withdrawResult.records.map((item) => {
        item.createTime = this.$common.formatDate(
          item.withdrawalTime ? item.withdrawalTime.replace(/T/gi, " ") : "",
          "yyyy-MM-dd HH:mm:ss"
        );
        return item;
      });
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
