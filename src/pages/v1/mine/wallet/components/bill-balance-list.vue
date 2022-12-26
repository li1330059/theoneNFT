<template>
  <div>
    <status-template
      :list="withdrawResult && withdrawResult.records"
      api="/market/api/walletLog/list"
      :init="getList"
    >
      <div class="page-mine-wallet-index">
        <bill-balance-list-mobile
          v-if="$common.isMobile()"
          :listResult="withdrawResult"
        >
        </bill-balance-list-mobile>
        <div class="wallet-log-list" v-else>
          <div
            class="wallet-log-item"
            v-for="(item, index) in withdrawResult.records"
            :key="index"
          >
            <div class="wallet-log">
              <div class="info">
                <div class="title">
                  <div v-if="item.dataType == 1">
                    售出-{{ item.consignmentInfo && item.consignmentInfo.name }}
                  </div>
                  <div v-else-if="item.dataType == 2">结算</div>
                  <div v-else-if="item.dataType == 3">支付</div>
                  <div v-else-if="item.dataType == 4">账户金额提现</div>
                  <div v-else-if="item.dataType == 5">退款</div>
                </div>
                <div>
                  <p>时间</p>
                  <p>{{ item.createTime }}</p>
                </div>
                <div>
                  <p>单据编号</p>
                  <p>{{ item.dataNo }}</p>
                </div>
              </div>
              <div class="amount-change-wrap">
                <div>操作前：{{ $common.formatMoney(item.amountOld) }}</div>
                <div>操作后：{{ $common.formatMoney(item.amountNew) }}</div>
              </div>

              <div class="price small">
                <div class="price add" v-if="item.operateType == 1">
                  + {{ $common.formatMoney(item.amount) }}
                </div>
                <div class="price cut" v-if="item.operateType == 2">
                  - {{ $common.formatMoney(item.amount) }}
                </div>
              </div>
              <!--     <div class="small">
                <p v-if="item.amountType == 1">可用金额</p>
                <p v-else-if="item.amountType == 2">冻结金额</p>
                <p v-else-if="item.amountType == 3">待结算金额</p>
                <p v-else-if="item.amountType == 4">累计销售额</p>
                <p v-else-if="item.amountType == 5">累计收益额</p>
                <p v-else-if="item.amountType == 6">累计钱包支付额</p>
                <p v-else-if="item.amountType == 7">累计充值额</p>
                <p v-else-if="item.amountType == 8">累计手续费</p>
                <p v-else-if="item.amountType == 9">累计第三方支付额</p>
                <p v-else-if="item.amountType == 10">累计提现金额</p>
                <p v-if="item.operateType == 1">增加</p>
                <p v-if="item.operateType == 2">减少</p>
              </div> -->
            </div>
            <!--     <div class="message">
              <div v-html="item.message"></div>
            </div> -->
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
import walletMessage from "@/utils/walletMessage";

import BillBalanceListMobile from "./bill-balance-list-mobile.vue";
export default {
  components: { BillBalanceListMobile },
  data() {
    return {
      params: {
        dataTypeList: null,
        amountTypeList: [1], //1.出售所得 2.充值 3.支付账单 4.提现
        dataNo: "",
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
    // 获取余额变动记录
    async getList() {
      let result = await this.$api.service.userWallet_list(this.params);

      this.withdrawResult = result.data.data;
      if (this.withdrawResult.records) {
        this.withdrawResult.records.forEach((a, idx) => {
          a.goodsInfo = JSON.parse(a.dataJson);
          if (Array.isArray(a.goodsInfo)) {
            a.consignmentInfo = JSON.parse(a.goodsInfo[0].commoditySkuJson);
          } else {
            try {
              a.consignmentInfo = JSON.parse(a.goodsInfo.commodityJson);
            } catch (error) {}
          }
          a.message = walletMessage.message(a);
        });
      }
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
.amount-change-wrap {
  color: rgba(0, 0, 0, 0.7);
  text-align: left;
  > div:first-child {
    margin-bottom: 8px;
  }
}
.page-mine-wallet-index {
  .loading {
    height: 500px;
  }
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
  .wallet-log-item {
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    padding: 16px 0px;
    font-size: 12px;
    .balance {
      font-weight: 400;
      padding-top: 10px;
      color: rgba(0, 0, 0, 0.4);
    }
    .message {
      padding-top: 10px;
      color: rgba($color: #000000, $alpha: 0.4);
      ::v-deep span {
        padding: 0 8px;
        color: #ff7a64;
      }
    }
  }
  .wallet-log {
    display: flex;

    font-size: 12px;
    align-items: center;
    .small {
      width: 200px;
      text-align: center;
    }
    .price {
      color: #000000;
      text-align: right;
      font-size: 18px;
      &.add {
        color: #f4a33a;
      }
      &.cut {
        color: rgba(230, 31, 26, 1);
      }
      p {
        color: rgba($color: #000000, $alpha: 0.4);
        line-height: 16px;
      }
    }
    .info {
      flex: 1;
      .title {
        font-size: 12px;
        font-weight: 400;
        color: #000000;
      }
      > div {
        display: flex;
        margin-bottom: 8px;
        &:last-child {
          margin-bottom: 0px;
        }
      }
      p {
        color: rgba($color: #000000, $alpha: 0.4);
        line-height: 16px;
        &:nth-child(1) {
          width: 70px;
        }
      }
      h1 {
        font-size: 12px;
        color: #000000;
        line-height: 16px;
      }
    }
  }
  .money-panel {
    display: flex;
    justify-content: space-around;
    align-items: center;
    > div {
      h1 {
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 6px;
      }
      p {
        font-size: 14px;
      }
    }
  }

  .wallet-panel {
    display: flex;
    margin-bottom: 40px;
    .wallet-main {
      width: 420px;
      height: 176px;
      background: linear-gradient(204deg, #303a63 0%, #0f1722 100%);
      box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.1);
      border-radius: 4px;
      color: #ffffff;
      padding: 16px 32px 0;
      .top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .top-left {
          display: flex;
          flex: 1;
          justify-content: space-between;
        }
        p {
          color: rgba($color: #fff, $alpha: 0.4);
          margin-bottom: 4px;
        }
        h1 {
          font-size: 24px;
        }
        .v1-btn {
          border: 1px solid #ffffff;
          color: #ffffff;
          background: transparent;
        }
      }
      .money-panel {
        border-top: 1px solid rgba($color: #fff, $alpha: 0.1);
        padding-top: 12px;
        justify-content: space-between;
        align-items: flex-start;
        > div {
          p {
            color: rgba($color: #fff, $alpha: 0.4);
          }
        }
      }
    }
    .wallet-info {
      flex: 1;
      .btns {
        height: 27px;
        display: flex;
        justify-content: flex-end;
      }
      .money-panel {
        height: 149px;
        background: #ffffff;
        box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.3);
        border-radius: 4px;
        > div {
          h1 {
            color: #000000;
          }
          p {
            color: rgba($color: #000000, $alpha: 0.4);
          }
        }
      }
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mine-wallet-index {
    .loading {
      height: 8rem;
    }

    .wallet-panel {
      flex-direction: column;
      margin-bottom: 0.32rem;
      .wallet-main {
        margin: 0 0.32rem 0.32rem;
        width: auto;
        height: 3.52rem;
        padding: 0.32rem;
        background: linear-gradient(204deg, #303a63 0%, #0f1722 100%);
        box-shadow: 0 0.04rem 0.32rem 0 rgba(180, 180, 180, 0.1);
        border-radius: 0.08rem;
        z-index: 99;
        .top {
          margin-bottom: 0.4rem;
          .top-left {
            display: flex;
            flex: 1;
            justify-content: flex-start;
          }
          p {
            font-size: 0.24rem;
            font-weight: 400;
            color: #ffffff;
            margin-bottom: 0.12rem;
          }
          h1 {
            font-size: 0.36rem;
            font-weight: 800;
            color: #ffffff;
          }
        }
        .money-panel {
          padding-top: 0.48rem;
          > div {
            p {
              font-size: 0.2rem;
              font-weight: 400;
              margin-bottom: 0.12rem;
            }
            h1 {
              font-size: 0.28rem;
              font-weight: 800;
              color: #ffffff;
            }
          }
        }
      }
      .wallet-info {
        .money-panel {
          width: 100%;
          height: 3.84rem;
          background: #ffffff;
          box-shadow: 0 0.04rem 0.12rem 0 rgba(229, 229, 229, 0.5);
          border-radius: 0.08rem;
          align-items: flex-end;
          margin-top: -1.92rem;
          padding: 0 0.32rem;
          padding-bottom: 0.64rem;
          z-index: 9;

          > div {
            p {
              font-size: 0.2rem;
              font-weight: 400;
              color: rgba($color: #000000, $alpha: 0.4);
              margin-bottom: 0.12rem;
            }
            h1 {
              font-size: 0.24rem;
              font-weight: 800;
              color: #000000;
            }
          }
        }
      }
    }

    .panel-list {
      width: 100%;
      height: 2.04rem;
      background: #ffffff;
      font-size: 0.28rem;
      font-weight: 500;
      color: #000000;
      display: flex;
      flex-direction: column;

      div {
        padding: 0 0.32rem;
        line-height: 1.02rem;
        &:nth-child(1) {
          border-bottom: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
        }
      }
    }

    .btn-list {
      padding: 0 0.32rem 2rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 1rem;
      div {
        height: 0.72rem;
        line-height: 0.72rem;
        flex: 1;
        background: #e5e5e5;
        border-radius: 0.36rem;
        font-size: 0.28rem;
        font-weight: 500;
        color: #000000;
        text-align: center;
        &:nth-child(1) {
          margin-right: 0.16rem;
        }
        &:nth-child(2) {
          margin-left: 0.16rem;
        }

        &.red {
          background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
          color: #fff;
        }
      }
    }
  }
  .v1-btn-eye {
    background: url("//static.theone.art/pc/images/wallet-eye-white.png")
      no-repeat center center;
    background-size: contain;
    &.hidden {
      background: url("//static.theone.art/pc/images/wallet-eye-hidden-white.png")
        no-repeat center center;
      background-size: contain;
    }
  }
}
</style>
