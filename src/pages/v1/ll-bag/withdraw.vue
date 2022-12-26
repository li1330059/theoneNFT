<template>
  <div class="ll-bag-withdraw-body ll-max-width ll-body-x-padding">
    <m-head :is-bg-color="false"></m-head>
    <!--  <section class="warning-msg">请绑定银行卡后充值</section> -->
    <loading v-if="loading"></loading>
    <div v-else>
      <section class="bank-block">
        <div class="title">到账银行卡</div>
        <div class="bank-wrap" @click="selectBankHandle">
          <div class="info">
            <span class="ll-icon icon-idcard"></span>
            <span class="txt bold"
              >{{ selectedBank.bankName }} ({{
                selectedBank.acctNo && selectedBank.acctNo.replace(/\*/gi, "")
              }})</span
            >
          </div>
          <span class="ll-icon icon-p-right"></span>
        </div>
      </section>
      <section class="withdraw-info-block">
        <div class="tip-txt">提现金额</div>
        <div class="money">¥{{ money || 0 }}</div>
        <div class="message-wrap">
          <div class="draw-info">
            <div class="info">
              <span class="txt"
                >可提现余额：{{ $common.formatMoney(amtMoney) }}元</span
              >
              <span class="link-btn" @click="drawAll">全部提现</span>
            </div>
            <!--   <div class="txt">手续费：0%</div> -->
          </div>
          <div class="msg">
            提现说明：每日可提现一次，最低100元起提，低于100元需全额提取，预计次日24时前到账到您选择的银行卡上。
          </div>
        </div>
      </section>
    </div>
    <div class="fixed-bottom">
      <keyboard @keyup="keyUp" @confirm="showPassword"></keyboard>
    </div>

    <ll-dialog ref="llDialogRef"></ll-dialog>
    <selecte-bank
      :bank-list="bankList"
      :bank-idx="bankIdx"
      ref="selectBankRef"
      @listen="listenSelectBank"
      class="fixed-bottom"
      title="请选择提现银行卡"
    ></selecte-bank>
    <pay-password-input-dialog
      ref="payPasswordInputRef"
      :price="money"
      title="请输入支付密码"
      des="提现金额"
      @success="passwordSuccess"
      @error="passwordError"
    ></pay-password-input-dialog>
  </div>
</template>
<script>
import Keyboard from "./components/keyboard.vue";
import LlDialog from "./components/ll-dialog.vue";
import SelecteBank from "./components/selecte-bank.vue";
import PayPasswordInputDialog from "./components/pay-password-input-dialog.vue";
import Loading from "./components/loading.vue";
import MHead from "./components/m-head.vue";
export default {
  components: {
    Keyboard,
    LlDialog,
    SelecteBank,
    PayPasswordInputDialog,
    Loading,
    MHead,
  },
  data() {
    return {
      loading: true,
      moneyArr: [],
      bankList: [],
      bankIdx: 0,
      listParams: {
        pageCount: 1,
        pageSize: 20,
        statusList: [],
      },
      accountInfo: {},
    };
  },
  computed: {
    money() {
      return this.moneyArr.join("");
    },
    selectedBank() {
      return this.bankList[this.bankIdx] || {};
    },
    amtMoney() {
      //可提现

      return (
        this.accountInfo.amtBalaval ||
        this.accountInfo.amtBalcur ||
        this.accountInfo.amtBalfrz
      );
    },
  },
  created() {
    if (this.$store.state.llWalletAccountInfo.status != 10) {
      const redirect = `${window.location.origin}/${window.location.pathname}/${window.location.search}`;
      this.$router.replace(
        `/ll_bag/account_opening?redirect=${encodeURIComponent(redirect)}`
      );
    } else {
      this.init();
    }
  },
  watch: {
    $route: function (to, from) {
      this.moneyArr = [];
    },
  },

  methods: {
    init() {
      this.loading = true;
      this.moneyArr = [];
      this.getBankList();
      this.getBalance();
    },
    drawAll() {
      if (Number(this.amtMoney) > 0) {
        this.moneyArr = this.amtMoney.split("");
      }
    },
    selectBankHandle() {
      this.$refs.selectBankRef.show();
    },
    listenSelectBank(info, idx) {
      this.bankIdx = idx;
    },
    async getBalance() {
      const res = await this.$api.service.ll_balance_get();

      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.accountInfo = res.data.data;
        } else {
          this.$message.error(res.data.data.reason);
        }
      } else if (res.data.code == 1000) {
        this.$router.replace("/ll_bag/account_opening");
      } else {
        this.$message.error(res.data.message);
      }
    },

    keyUp(e) {
      if (this.moneyArr.length == 0 && e.val == ".") {
        return;
      }

      if (
        this.moneyArr.length == 1 &&
        this.moneyArr[0] == 0 &&
        e.val.toString() != "."
      ) {
        return;
      }
      if (e.val.toString() && !e.key) {
        if (this.moneyArr.length > 8) {
          return;
        }

        const pointIdx = this.moneyArr.findIndex((item) => item == ".");

        if (pointIdx == -1) {
          this.moneyArr.push(e.val);
          return;
        }

        if (this.moneyArr.length - pointIdx <= 2) {
          this.moneyArr.push(e.val);
        }
      }
      if (e.key == 1) {
        const idx = this.moneyArr.findIndex((item) => item == e.val);
        if (idx == -1) {
          this.moneyArr.push(e.val);
        }
      }

      if (e.key == -1) {
        //删除
        this.moneyArr.splice(this.moneyArr.length - 1, 1);
      }
    },
    async passwordSuccess(passwordObj) {
      const params = {
        amount: this.$common.formatMoneyNum(this.money),
        bankCardUuid: this.selectedBank.uuid,
        password: passwordObj.password,
        randomkey: passwordObj.randomKey,
      };
      const res = await this.$api.service.llWithdrawal_withdrawal(params);
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.$router.push("/ll_bag/res_status/draw_success");
        } else {
          this.$refs.llDialogRef.show({
            msg: res.data.data.reason,
            confirm: () => {
              window.location.href = "/ll_bag/security_setting";
            },
            confirmTxt: "重置密码",
          });
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    passwordError(info) {
      this.$refs.llDialogRef.show({
        msg: "支付密码错误，请重试",
        confirm: () => {
          this.$refs.payPasswordInputRef.clearInput();
        },
        cancel: () => {
          window.location.href = "/ll_bag/security_setting";
        },
        cancelTxt: "忘记密码",
        confirmTxt: "重试",
      });
      /*      this.$message.error(info.code); */
    },
    async showPassword() {
      console.log(this.money);
      if (this.money && this.money > 0) {
        //输入密码
        this.$refs.payPasswordInputRef.init();
      } else {
        this.$message.warning("请输入金额");
      }
    },
    async getBankList() {
      //获取用户绑定的银行卡
      const res = await this.$api.service.ll_bindCard_list(this.listParams);
      this.loading = false;
      if (res.data.code == 200) {
        this.bankList = res.data.data.records;
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.bold {
  font-weight: bold;
}

.fixed-bottom {
  padding: 0;
  bottom: 0;
}
.warning-msg {
  line-height: 48px;
  background: #f8e7e7;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #ee4242;
  margin: 0 20px;
}
.ll-bag-withdraw-body {
  background: #f7f7f7;
  height: 800px;
  padding-bottom: 100px;
  @media screen and (max-width: 540px) {
    padding-right: 0;
    padding-left: 0;
    height: 80vh;
  }
}
.bank-block {
  padding: 20px;
  .title {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 23px;
  }
  .bank-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .info {
      flex: 1;
      display: flex;
      align-items: center;
      .icon-idcard {
        width: 25px;
        height: 18px;
        margin-right: 13px;
      }
    }
  }
}
.withdraw-info-block {
  padding: 20px;
  background-color: #fff;
  min-height: 500px;
  border-radius: 16px;
  .money {
    font-size: 32px;
    font-weight: 600;
    color: #333333;
    margin-top: 24px;
    border-bottom: 1px solid #f7f7f7;
    height: 45px;
  }
  .message-wrap {
    margin-top: 7px;
    .draw-info {
      display: flex;
      justify-content: space-between;
      .link-btn {
        margin-left: 8px;
      }
      .txt {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
      }
    }
  }
  .info-wrap {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
  }
  .msg {
    margin-top: 12px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
  }
}
</style>
