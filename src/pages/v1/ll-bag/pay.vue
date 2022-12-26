<template>
  <div class="ll-bag-body ll-max-width">
    <m-head :back="goBack"></m-head>
    <loading v-if="loading"></loading>
    <div v-else>
      <section class="order-price-wrap">
        <div class="title">订单金额</div>
        <div class="money">{{ $common.formatMoney(amountPay) }}</div>
      </section>
      <section class="list-wrap">
        <div class="list-bar">
          <div class="key">商品名称：</div>
          <div class="val">{{ goodsName }}</div>
        </div>
        <div class="list-bar">
          <div class="key">订单编号：</div>
          <div class="val">{{ orderNo }}</div>
        </div>
        <div class="list-bar">
          <div class="key">支付方式：</div>
          <div
            class="val balance-wrap"
            @click="showPayWay"
            v-if="payWayIdx == -1"
          >
            <span class="ll-icon icon-money" />
            <span class="txt">余额({{ $common.formatMoney(useMoney) }})</span>
            <span class="ll-icon icon-p-right"></span>
          </div>
          <div class="val balance-wrap" @click="showPayWay" v-else>
            <span class="txt"
              >{{ currentBankObj.bankName }}（{{
                currentBankObj.acctNo &&
                currentBankObj.acctNo.replace(/\*/gi, "")
              }}）</span
            >
            <span class="ll-icon icon-p-right"></span>
          </div>
        </div>
      </section>
      <div class="fixed-bottom">
        <div
          class="ll-btn ll-btn-primary ll-btn-full"
          @click="goBalancePay"
          v-if="payWayIdx == -1"
        >
          余额支付 {{ $common.formatMoney(amountPay) }}
        </div>
        <div
          class="ll-btn ll-btn-primary ll-btn-full"
          @click="goBankPay"
          v-else
        >
          银行卡支付
        </div>
      </div>
    </div>

    <selecte-bank></selecte-bank>

    <pay-password-input-dialog
      ref="payPasswordInputRef"
      :price="amountPay"
      @success="onPay"
      @error="passwordError"
    ></pay-password-input-dialog>
    <pay-input-password :price="amountPay"></pay-input-password>
    <pay-select-way
      ref="paySelectWayRef"
      :payWayIdx="payWayIdx"
      :bankList="bankList"
      :balance-money="useMoney"
      :isBalance="isBalanceFull"
      @listen="listenPaywayHandle"
    ></pay-select-way>
    <!--     <div class="pay-test" @click="onPay">pay</div> -->
  </div>
</template>
<script>
import MHead from "./components/m-head.vue";
import PaySelectWay from "./components/pay-select-way.vue";
import PayPasswordInputDialog from "./components/pay-password-input-dialog.vue";
import Loading from "./components/loading.vue";
import BigNumber from "bignumber.js";
import App from "@/utils/app/index";
export default {
  components: { PaySelectWay, PayPasswordInputDialog, Loading, MHead },
  data() {
    return {
      amountPay: 0,
      payWay: "balance", //balance,bankcard
      goodsName: "",
      orderNo: "",
      balanceInfo: {},
      payParams: {},
      bankListParams: { pageCount: 1, pageSize: 20, statusList: [] },
      bankList: [],
      payWayIdx: 0,
      loading: true,
    };
  },
  computed: {
    useMoney() {
      const money = Number(
        this.balanceInfo.totalBalaval ||
          this.balanceInfo.totalBalcur ||
          this.balanceInfo.totalBalfrz ||
          0
      );
      return money;
    },
    currentBankObj() {
      if (this.payWayIdx >= 0) {
        return this.bankList[this.payWayIdx] || {};
      }
      return {};
    },
    isBalanceFull() {
      //余额是否充足
      return new BigNumber(this.useMoney || 0).minus(this.amountPay || 0) >= 0;
    },
  },
  created() {
    const { order_no, amount_pay, show_amount, goods_name, pre_order_type } =
      this.$route.query;
    if (this.$store.state.llWalletAccountInfo.status != 10) {
      let redirect = `${window.location.origin}${window.location.pathname}?order_no=${order_no}&amount_pay=${amount_pay}&show_amount=${show_amount}&goods_name=${goods_name}`;
      if (pre_order_type) {
        redirect = `${redirect}&pre_order_type=${pre_order_type}`;
      }
      this.$localStorage.setItem("ll-redirect", redirect, 1 * 60 * 60 * 1000);
      setTimeout(() => {
        this.$router.replace(`/ll_bag/account_opening`);
      }, 200);
    } else {
      this.init();
    }
  },
  methods: {
    goBack() {
      if (App.browser.theone.isTheOne) {
        App.$methods.goBack();
      } else {
        this.$router.back();
      }
    },
    init() {
      this.loading = true;
      this.orderNo = this.$route.query.order_no || "";
      this.amountPay = this.$route.query.amount_pay || 0;
      this.showAmount = this.$route.query.show_amount || 0;
      this.preOrderType = this.$route.query.pre_order_type || "";
      this.goodsName =
        this.preOrderType == 40
          ? "购物车订单"
          : this.$route.query.goods_name || "";

      if (!this.orderNo) {
        this.$message.warning("参数错误");
        this.$router.push("/404");
        return;
      }
      //获取账户信息
      this.getUserBalance();
      this.getBankList();
    },
    async getBankList() {
      //获取用户绑定的银行卡
      const res = await this.$api.service.ll_bindCard_list(this.bankListParams);
      if (res.data.code == 200) {
        this.bankList = res.data.data.records;
      } else {
        this.$message.error(res.data.message);
      }
    },

    async getUserBalance() {
      const res = await this.$api.service.ll_balance_get();
      this.loading = false;
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.balanceInfo = res.data.data;

          if (
            new BigNumber(this.useMoney || 0).minus(this.amountPay || 0) >= 0
          ) {
            this.payWayIdx = -1;
          } else {
            this.showPayWay();
          }
        } else {
          const redirect = `${window.location.href}`;

          this.$router.push(
            `/ll_bag/account_opening?redirect=${encodeURIComponent(redirect)}`
          );
        }
      } else if (res.data.code == 1000) {
        const redirect = `${window.location.href}`;

        this.$router.push(
          `/ll_bag/account_opening?redirect=${encodeURIComponent(redirect)}`
        );
      } else {
        this.$message.error(res.data.message);
      }
    },
    listenPaywayHandle(info, idx) {
      this.payWayIdx = idx;
    },
    showPayWay() {
      this.$nextTick(() => {
        this.$refs.paySelectWayRef.init();
      });
    },
    goBankPay() {
      let params = {
        amountPay: this.$common.formatMoneyNum(this.amountPay),
        showAmount: this.$common.formatMoneyNum(this.showAmount),
        bankCardUUID: this.currentBankObj.uuid,
        orderNo: this.orderNo,
        payChannel: "ll",
        subject: this.goodsName,
        payType: 3,
        clientType: 1,
      };
      if (this.preOrderType) {
        params = {
          ...params,
          preOrderType: this.preOrderType,
        };
      }
      this.$router.push(
        `/ll_bag/pay_bankcard?params=${window.encodeURIComponent(
          JSON.stringify(params)
        )}&bank_info=${window.encodeURIComponent(
          JSON.stringify({
            bankName: this.currentBankObj.bankName,
            acctNo: this.currentBankObj.acctNo,
            price: this.amountPay,
            phone: this.currentBankObj.phone,
          })
        )}`
      );
    },
    goBalancePay() {
      this.$refs.payPasswordInputRef.init();
    },
    passwordError(info) {
      console.log(info);
      this.$message.error(info.code);
    },
    async onPay(passwordObj) {
      this.payParams = {
        amountPay: this.$common.formatMoneyNum(this.amountPay),
        showAmount: this.$common.formatMoneyNum(this.showAmount),
        bankCardUUID: "",
        orderNo: this.orderNo,
        payChannel: "ll",
        subject: this.goodsName,
        payType: 0,
        clientType: 1,
      };
      this.payParams = {
        ...this.payParams,
        payPw: passwordObj.password,
        randomKey: passwordObj.randomKey,
      };
      if (this.preOrderType) {
        this.payParams = {
          ...this.payParams,
          preOrderType: this.preOrderType,
        };
      }

      let payResult = await this.$api.service.v3_pay(this.payParams);
      console.log(payResult.data.data);
      if (payResult.data.code == 200) {
        if (payResult.data.data.status == "normal") {
          this.$router.push(`/ll_bag/pay_success`);
        } else {
          this.$router.push(`/ll_bag/pay_fail`);
        }
      } else {
        this.$message.error(payResult.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.balance-wrap {
  display: flex;
  align-items: center;
  .icon-money {
    margin-right: 4px;
  }
  .icon-p-right {
    width: 13px;
    height: 13px;
  }
}
.order-price-wrap {
  background: #f7f7f7;
  border-radius: 16px 16px 0px 0px;
  backdrop-filter: blur(10px);
  text-align: center;
  padding-bottom: 32px;
  .title {
    padding-top: 24px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
  .money {
    font-size: 32px;
    font-weight: 600;
    color: #333333;
    line-height: 45px;
  }
}

.list-wrap {
  background: #ffffff;
  border-radius: 16px 16px 0px 0px;
  backdrop-filter: blur(10px);
}
.list-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f7f7f7;
  .key {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
  }
  .val {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
}
.pay-test {
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
