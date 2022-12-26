<template>
  <div>
    <!--      <div class="v1-card-title-mycenter the-left">
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
      </div> -->
    <m-head :title="options[currentTabIdx].name"></m-head>
    <div class="nav-wrap hand mode-PC">
      <span class="ui-icon icon-left" @click="goBack"></span
      ><span @click="goBack">{{ options[currentTabIdx].name }}</span>
    </div>
    <div class="paychannel-body">
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
      <ll-withdraw
        v-if="options[currentTabIdx].ref == 'LlWithDrawRef'"
        ref="LlWithDrawRef"
      ></ll-withdraw>
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
import WalletBhBill from "./components/wallet-bh-bill.vue";
import BillWithdrawList from "./components/bill-withdraw-list.vue";
import BillProfitList from "./components/bill-profit-list.vue";
import BillBalanceList from "./components/bill-balance-list.vue";
import HyWithdrawList from "./components/hy-withdraw-list.vue";
import YbWithdrawList from "./components/yb-withdraw-list.vue";
import MHead from "../../../../components/v1/m-head.vue";
import LlWithdraw from './components/ll-withdraw.vue'
/* import HyBalanceList from "./hy-balance-list.vue"; */
export default {
  components: {
    WalletBhBill,
    BillBalanceList,
    BillWithdrawList,
    BillProfitList,
    HyWithdrawList,
    YbWithdrawList,
    LlWithdraw,
    MHead,
  },
  data() {
    return {
      options: [
        {
          name: "恒信通账户提现列表",
          ref: "WithDrawRef",
          key: "hxt",
        },
        {
          name: "宝付账户提现列表",
          ref: "WalletBhBillRef",
          key: "baofoo",
        },
        {
          name: "汇元账户提现列表",
          ref: "HyWithDrawRef",
          key: "hy",
        },
        {
          name: "易宝账户提现列表",
          ref: "YbWithDrawRef",
          key: "yibao",
        },
        {
          name: "连连账户提现列表",
          ref: "LlWithDrawRef",
          key: "ll",
        },
      ],
      currentTabIdx: 0,
    };
  },

  computed: {},
  created() {
    this.currentTabIdx = this.options.findIndex(
      (item) => item.key == this.$route.params.way
    );
    console.log(this.currentTabIdx);
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.back();
    },
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
