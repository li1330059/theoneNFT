/* 手机端账单 */
<template>
  <div>
    <div class="mode-mobile">
      <m-header :title="'账单'" />
    </div>
    <div class="tab-box">
      <div class="tab-wrap">
        <div
          :class="{
            selected: index == currentTabIdx,
          }"
          v-for="(item, index) in options"
          :key="index"
          @click="onDataTypeListChange(index)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <bill-withdraw-list
      v-if="options[currentTabIdx].ref == 'WithDrawRef'"
      ref="WithDrawRef"
    ></bill-withdraw-list>
    <bill-profit-list
      v-if="options[currentTabIdx].ref == 'ProfitRef'"
      ref="ProfitRef"
    ></bill-profit-list>
    <wallet-bh-bill
      v-if="options[currentTabIdx].ref == 'WalletBhBillRef'"
      ref="WalletBhBillRef"
    ></wallet-bh-bill>
    <bill-balance-list
      v-if="options[currentTabIdx].ref == 'BillBalanceListRef'"
      ref="BillBalanceListRef"
    ></bill-balance-list>
    <hy-withdraw-list
      v-if="options[currentTabIdx].ref == 'HyWithDrawRef'"
      ref="HyWithDrawRef"
    ></hy-withdraw-list>
    <yb-withdraw-list
      v-if="options[currentTabIdx].ref == 'YbWithDrawRef'"
      ref="YbWithDrawRef"
    ></yb-withdraw-list>
  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
import BillWithdrawList from "./components/bill-withdraw-list.vue";
import BillProfitList from "./components/bill-profit-list.vue";
import WalletBhBill from "./components/wallet-bh-bill.vue";
import BillBalanceList from "./components/bill-balance-list.vue";
import HyWithdrawList from "./components/hy-withdraw-list.vue";
import YbWithdrawList from "./components/yb-withdraw-list.vue";
export default {
  components: {
    BillWithdrawList,
    BillProfitList,
    WalletBhBill,
    mHeader,
    BillBalanceList,
    HyWithdrawList,
    YbWithdrawList,
  },
  data() {
    return {
      options: [
        {
          name: "余额变动",
          ref: "BillBalanceListRef",
        },
        {
          name: "收益",
          ref: "ProfitRef",
        },
        {
          name: "恒信通账户提现列表",
          ref: "WithDrawRef",
        },
        {
          name: "宝付账户提现",
          ref: "WalletBhBillRef",
        },
        {
          name: "汇元账户提现",
          ref: "HyWithDrawRef",
        },
        {
          name: "易宝账户提现列表",
          ref: "YbWithDrawRef",
        },
      ],
      currentTabIdx: 0,
    };
  },
  mounted() {},
  computed: {
    isBigPay() {
      return this.$store.state.isBigPay;
    },
  },
  methods: {
    onDataTypeListChange(idx) {
      this.currentTabIdx = idx;
    },
  },
};
</script>
<style lang="scss" scoped>
.draw-btn {
  color: #1288e5;
}
.tab-box {
  overflow-x: auto;

}
.tab-wrap {
  display: flex;
  align-items: center;
  padding-top: 1.1rem;

  > div {
    word-break: keep-all;

    white-space: nowrap;
    font-size: 0.28rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    padding: 0.32rem 0.4rem;
  }
  .selected {
    font-weight: 500;
    color: #000000;
  }
}
.bar {
  background-color: #fff;
  margin-bottom: 0.16rem;
  padding: 0.32rem 0.32rem 0;
  .line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.32rem;
    .message {
      font-size: 0.24rem;
      color: rgba(0, 0, 0, 0.7);
      line-height: 150%;
      ::v-deep span {
        padding: 0 0.1rem;
        color: #ff7a64;
      }
    }
    .data-type {
      font-size: 0.24rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
    .price {
      font-size: 0.28rem;
      font-weight: 600;
      color: #000000;
    }
    .add {
      color: #f4a33a;
    }
    .no {
      font-size: 0.24rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
    }
    .time {
      font-size: 0.24rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
  }
}
.pagination-wrap {
  display: flex;
  justify-content: center;
  padding: 0.2rem 0 1.4rem;
}
</style>
