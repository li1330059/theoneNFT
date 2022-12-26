<template>
  <div>
    <div class="mode-PC">
      <div class="v1-card-title-mycenter the-left">
        <h1 class="title">账单</h1>
        <div class="v1-tabs">
          <ul>
            <li
              v-for="(item, idx) in options"
              :key="item.name"
              :class="{
                selected: idx == currentTabIdx,
              }"
              @click="onDataTypeListChange(idx)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
      <bill-withdraw-list
        v-if="options[currentTabIdx].ref == 'WithDrawRef'"
        ref="WithDrawRef"
      ></bill-withdraw-list>
      <hy-withdraw-list
        v-if="options[currentTabIdx].ref == 'HyWithDrawRef'"
        ref="HyWithDrawRef"
      ></hy-withdraw-list>
      <yb-withdraw-list
        v-if="options[currentTabIdx].ref == 'YbWithDrawRef'"
        ref="YbWithDrawRef"
      ></yb-withdraw-list>
      <bill-profit-list
        v-if="options[currentTabIdx].ref == 'ProfitRef'"
        ref="ProfitRef"
      ></bill-profit-list>

      <wallet-bh-bill
        v-if="options[currentTabIdx].ref == 'WalletBhBillRef'"
        ref="WalletBhBillRef"
      ></wallet-bh-bill>
      <bill-balance-list
        v-if="options[currentTabIdx].ref == 'BalanceRef'"
        ref="BalanceRef"
      ></bill-balance-list>
    </div>
  </div>
</template>
<script>
import WalletBhBill from "./wallet-bh-bill.vue";
import BillWithdrawList from "./bill-withdraw-list.vue";
import BillProfitList from "./bill-profit-list.vue";
import BillBalanceList from "./bill-balance-list.vue";
import HyWithdrawList from "./hy-withdraw-list.vue";
import YbWithdrawList from "./yb-withdraw-list.vue";
/* import HyBalanceList from "./hy-balance-list.vue"; */
export default {
  components: {
    WalletBhBill,
    BillBalanceList,
    BillWithdrawList,
    BillProfitList,
    HyWithdrawList,
    YbWithdrawList,
  },
  data() {
    return {
      options: [
        {
          name: "收益",
          ref: "ProfitRef",
        },
        {
          name: "提现",
          ref: "WithDrawRef",
        },
      ],
      currentTabIdx: 0,
    };
  },

  computed: {
    isBigPay() {
      return this.$store.state.isBigPay;
    },
  },
  created() {},
  mounted() {
    if (this.isBigPay) {
      this.options = [
        {
          name: "余额变动",
          ref: "BalanceRef",
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
          name: "宝付账户提现列表",
          ref: "WalletBhBillRef",
        },
        {
          name: "汇元账户提现列表",
          ref: "HyWithDrawRef",
        },
        {
          name: "易宝账户提现列表",
          ref: "YbWithDrawRef",
        },
      ];
    }
  },
  methods: {
    onDataTypeListChange(idx) {
      this.currentTabIdx = idx;
    },

    upodateBaohuList() {
      if (this.currentTabIdx == 2) {
        this.$refs.WalletBhBillRef.getList();
      } else if (this.currentTabIdx == 0 || this.currentTabIdx == 1) {
        const ref = this.options[this.currentTabIdx].ref;
        this.$refs[ref].getList();
      }
    },
    upodateYbList() {
      if (this.currentTabIdx == 5) {
        this.$refs.YbWithDrawRef.getList();
      } else if (this.currentTabIdx == 0 || this.currentTabIdx == 1) {
        const ref = this.options[this.currentTabIdx].ref;
        this.$refs[ref].getList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
@import "@/assets/1.0/scss/wallet-bill.scss";
.v1-card-title-mycenter {
  .title {
    color: #000;
  }
  &.the-left {
    justify-content: flex-start;
    .v1-tabs {
      margin-left: 36px;
      border-bottom: none;
      padding: 0;
      ul {
        li {
          color: rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }
        .selected {
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }
  }
}
</style>
