<template>
  <div>
    <m-head title="账单明细"></m-head>
    <div class="mode-PC">
      <div class="nav-wrap hand">
        <span class="ui-icon icon-left"  @click="goBack"></span
        ><span @click="goBack">账单明细</span>
      </div>
    </div>
    <div class="paychannel-body">
      <div class="v1-card-title-mycenter the-left">
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
              <div class="line"></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="list-wrap">
        <bill-profit-list
          v-if="options[currentTabIdx].ref == 'ProfitRef'"
          ref="ProfitRef"
        ></bill-profit-list>
        <bill-balance-list
          v-if="options[currentTabIdx].ref == 'BalanceRef'"
          ref="BalanceRef"
        ></bill-balance-list>
      </div>
    </div>
  </div>
</template>
<script>
import BillProfitList from "./components/bill-profit-list.vue";
import BillBalanceList from "./components/bill-balance-list.vue";
import MHead from "../../../../components/v1/m-head.vue";
/* import HyBalanceList from "./hy-balance-list.vue"; */
export default {
  components: {
    BillBalanceList,
    BillProfitList,
    MHead,
  },
  data() {
    return {
      options: [
        {
          name: "余额变动",
          ref: "BalanceRef",
        },
        {
          name: "收益",
          ref: "ProfitRef",
        },
      ],
      currentTabIdx: 0,
    };
  },

  computed: {},
  created() {},
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
.list-wrap {
}
.nav-wrap {
  .icon-left {
    top: -1px;
  }
}

.v1-card-title-mycenter {
  padding-bottom: 0;
  .title {
    color: #000;
  }
  &.the-left {
    justify-content: flex-start;
    .v1-tabs {
      border-bottom: none;
      padding: 0;
      ul {
        li {
          color: rgba(0, 0, 0, 0.4);
          cursor: pointer;
          padding: 0;
          margin-right: 30px;
          position: relative;
          top: 0;
          left: 0;
          padding-bottom: 9px;
          &::after{
            opacity: 0;
            display: none;
          }
          .line {
            opacity: 0;
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 2px;
            background-color: rgba(230, 31, 26, 1);
          }
        }

        .selected {
          color: #e61f1a;
          .line {
            opacity: 1;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .v1-card-title-mycenter {
    border: none;

    background: #fafafa;
    padding:.28rem;
    .v1-tabs{
        flex:1;
       ul{
            justify-content: space-around;
            width:100%;
            li{
                margin-right:0;
            }
       }
    }
  }
  .paychannel-body {
    padding: 0;
  }
  .list-wrap {
    background-color: #fff;
    box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.06);
    padding: 0 0.32rem;
  }
}
</style>
