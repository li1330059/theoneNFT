<template>
  <div>
    <status-template
      :list="listResult && listResult.records"
      api="/order/api/withdrawalOrderBaofoo/list"
      :init="getList"
    >
      <wallet-bh-bill-mobile
        :BHListResult="listResult"
        :baohuWidthdraw="baohuWidthdraw"
        :handleCurrentChange="handleCurrentChange"
        v-if="$common.isMobile()"
      >
      </wallet-bh-bill-mobile>
      <div class="ui-content" v-else>
        <div
          class="line-block ui-bar-border"
          v-for="(item, index) in listResult.records"
          :key="index"
        >
          <div class="line-bar">
            <section class="flex1">
              <div class="line-bar">
                <div class="key">单据编号</div>
                <div class="val txt">{{ item.orderNo }}</div>
              </div>
              <div class="line-bar">
                <div class="key">时间</div>
                <div class="val">
                  {{ item.withdrawalTime || item.createTime }}
                </div>
              </div>
            </section>

            <section class="w-200">
              <div v-if="item.auditStatus == 3">
                <span v-if="item.withdrawalStatus == 2">提现申请成功</span>
                <span v-if="item.withdrawalStatus == 3">提现成功</span>
                <span v-if="item.withdrawalStatus == 4">提现失败</span>
              </div>
              <div v-else>
                <span v-if="item.auditStatus == 1">申请成功（待审核）</span>
                <span v-if="item.auditStatus == 2">审核中</span>
                <span v-if="item.auditStatus == 4">审核失败</span>
              </div>
            </section>
            <section class="w-200">
              <span class="red-num">
                - {{ $common.formatMoney(item.amount) }}</span
              >

              <div v-if="item.auditStatus == 3">
                <span
                  v-if="
                    item.withdrawalStatus == 1 || item.withdrawalStatus == 2
                  "
                  @click="baohuWidthdraw(item)"
                  class="draw-btn hand"
                  :class="{ disabled: drawDisabled }"
                  >提款</span
                >
              </div>
            </section>
          </div>
          <div class="message">
            <baohu-bill-message :info="item" />
          </div>
        </div>
        <div class="price small" v-if="false">
          <div v-if="item.auditStatus == 3">
            <div v-if="item.withdrawalStatus == 2"><!-- 提现中 --></div>
            <div v-if="item.withdrawalStatus == 3">
              <!-- 提现成功 -->
              <div class="price">
                - {{ $common.formatMoney(item.amount) }}
                <div class="des">宝付账户累计冻结金额减少</div>
              </div>
            </div>
            <div v-if="item.withdrawalStatus == 4"><!-- 提现失败 --></div>
          </div>
          <div v-else>
            <div v-if="item.auditStatus == 1">
              <!-- 申请成功（待审核） -->
              <div class="price add">
                + {{ $common.formatMoney(item.amount) }}
                <div class="des">宝付账户冻结金额增加</div>
              </div>
            </div>
            <div v-if="item.auditStatus == 2"><!-- 审核中 --></div>
            <div v-if="item.auditStatus == 4"><!-- 审核失败 --></div>
          </div>
        </div>
      </div>
    </status-template>
    <div class="v1-pagination">
      <g-paging
        :pageChange="handleCurrentChange"
        :list="listResult.records"
        :pageSize="params.pageSize"
        :current-page="listResult.current"
      />
    </div>
  </div>
</template>
<script>
import BaohuBillMessage from "./baohu-bill-message.vue";
import WalletBhBillMobile from "./wallet-bh-bill-mobile.vue";
import createForm from "@/utils/form";
export default {
  components: { BaohuBillMessage, WalletBhBillMobile },
  data() {
    return {
      drawDisabled: false,
      params: {
        endDate: "",
        orderNo: "",
        pageCount: 1,
        pageSize: 12,
        startDate: "",
      },
      listResult: {
        records: [],
      },
    };
  },

  computed: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    async getList() {
      const res = await this.$api.service.withdrawalOrderBaofoo_list(
        this.params
      );
      if (res.data.code == 200) {
        this.listResult = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(val) {
      this.params.pageCount = val;
      this.getList();
    },
    async baohuWidthdraw(info) {
      if (this.drawDisabled) return;
      this.drawDisabled = true;
      const res = await this.$api.service.baofooWithdraw_withdraw({
        orderNo: info.orderNo,
      });
      this.drawDisabled = false;
      if (res.data.code == 200) {
        const url = `${window.location.origin}/bh_draw_result?order_no=${info.orderNo}`;
        window.location.href = `${res.data.data}?Address=${encodeURIComponent(
          url
        )}`;
        /*      window.open(res.data.data);
        setTimeout(() => {
          this.$confirm(`已经提现？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(async () => {
              this.getList();
            })
            .catch(() => {});
        }, 500); */
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/wallet-bill-list-pc.scss";
.draw-btn {
  border-radius: 100px;
  border: 1px solid #397fe7;
  font-size: 12px;
  font-weight: 400;
  color: #397fe7;
  padding: 4px 26px;
  margin-top: 20px;
  display: inline-block;
  user-select: none;
}
</style>
