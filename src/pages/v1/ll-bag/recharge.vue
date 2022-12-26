<template>
  <div class="ll-bag-withdraw-body ll-max-width ll-body-x-padding">
    <m-head :is-bg-color="false"></m-head>
    <!--  <section class="warning-msg">请绑定银行卡后充值</section> -->
    <loading v-if="loading"></loading>
    <div v-else>
      <section class="bank-block">
        <div class="title">充值方式</div>
        <div class="bank-wrap hand" @click="selectBankHandle">
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
        <div class="tip-txt">充值金额</div>
        <div class="money">¥{{ money || 0 }}</div>
      </section>
    </div>
    <div class="">
      <keyboard @keyup="keyUp" @confirm="rechargeConfirm"></keyboard>
    </div>

    <ll-dialog></ll-dialog>
    <selecte-bank
      :bank-list="bankList"
      :bank-idx="bankIdx"
      ref="selectBankRef"
      @listen="listenSelectBank"
      class="fixed-bottom"
    ></selecte-bank>
  </div>
</template>
<script>
import Keyboard from "./components/keyboard.vue";
import LlDialog from "./components/ll-dialog.vue";
import SelecteBank from "./components/selecte-bank.vue";
import Loading from "./components/loading.vue";
import MHead from "./components/m-head.vue";
export default {
  components: { Keyboard, LlDialog, SelecteBank, Loading, MHead },
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
    };
  },
  computed: {
    money() {
      return this.moneyArr.join("");
    },
    selectedBank() {
      return this.bankList[this.bankIdx] || {};
    },
  },
  created() {
    this.init();
  },
  watch: {
    $route: function (to, from) {
      this.loading = true;
      this.init();
    },
  },
  methods: {
    init() {
      this.moneyArr = [];
      this.getBankList();
    },
    selectBankHandle() {
      this.$refs.selectBankRef.show();
    },
    listenSelectBank(info, idx) {
      console.log(idx);
      this.bankIdx = idx;
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
    async rechargeConfirm() {
      if (this.money) {
        const params = {
          price: this.money,
          bankObj: this.selectedBank,
        };
        this.$router.push(
          `/ll_bag/recharge_confirm/${window.encodeURIComponent(
            JSON.stringify(params)
          )}`
        );
      } else {
        this.$message.warning("请输入金额");
      }
    },
    async getBankList() {
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
