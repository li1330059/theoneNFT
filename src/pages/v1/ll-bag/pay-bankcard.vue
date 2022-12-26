<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <section class="order-price-wrap">
      <div class="title">订单金额</div>
      <div class="money">{{ $common.formatMoney(bankInfo.price) }}</div>
    </section>
    <section class="list-wrap">
      <div class="list-bar">
        <div class="key">银行卡：</div>
        <div class="val txt-align-right">
          {{ bankInfo.bankName }}（{{
            bankInfo.acctNo && bankInfo.acctNo.replace(/\*/gi, "")
          }}）
        </div>
      </div>
      <div class="list-bar">
        <div class="key">手机号：</div>
        <div class="val txt-align-right">
          {{ bankInfo.phone }}
          <!--        <el-input
            class="el-input"
            type="txt"
            v-model="phone"
            palceholder="请输入银行预留手机号"
          /> -->
        </div>
      </div>
      <div class="list-bar">
        <div class="key">验证码：</div>
        <div class="val">
          <div class="v-code-wrap">
            <el-input
              class="el-input"
              type="txt"
              palceholder="请输入验证码"
              v-model="code"
            />
            <g-verification-code
              :getCode="getCode"
              :isCheck="false"
            ></g-verification-code>
          </div>
        </div>
      </div>
    </section>
    <div class="fixed-bottom">
      <div class="ll-btn ll-btn-primary ll-btn-full" @click="submit">确定</div>
    </div>
  </div>
</template>
<script>
import MHead from "./components/m-head.vue";
export default {
  components: { MHead },
  data() {
    return {
      bankInfo: {},
      payParams: {},
      phone: "",
      code: "",
      isPostCode: false,
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.isPostCode = false;
      this.phone = "";
      this.code = "";
      this.payParams = JSON.parse(decodeURIComponent(this.$route.query.params));
      this.bankInfo = JSON.parse(
        decodeURIComponent(this.$route.query.bank_info)
      );
      console.log(this.bankInfo);
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
    listenPaywayHandle(info, idx) {
      this.payWayIdx = idx;
    },
    async getUserBalance() {
      const res = await this.$api.service.ll_balance_get();
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.balanceInfo = res.data.data;
        } else {
          this.$message.error(res.data.data.reason);
        }
      } else if (res.data.code == 1000) {
        this.$router.replace("/ll_bag/account_opening");
      } else {
        this.$message.error(res.data.message);
      }
    },
    showPayWay() {
      this.$$nextTick(() => {
        this.$refs.paySelectWayRef.init();
      });
    },
    async submit() {
      if (!this.code) {
        this.$message.warning("请填写验证码");
        return;
      }
      if (!this.isPostCode) {
        this.$message.warning("请先发送验证码");
        return;
      }
      if (!this.payInfo) {
        this.$message.warning("验证码发送失败");
        return;
      }
      const res = await this.$api.service.ll_pay_confirm({
        orderNo: this.payParams.orderNo,
        outTradeNo: this.payInfo.outTradeNo,
        payChannel: "ll",
        token: this.payInfo.token,
        verifyCode: this.code,
      });
      if (res.data.code == 200) {
        if (res.data.data.status == "normal") {
          this.$router.push(`/ll_bag/pay_success`);
        } else {
          this.$router.push(
            `/ll_bag/pay_fail?msg=${res.data.data.errorMessage}`
          );
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    async getCode() {
      let payResult = await this.$api.service.v3_pay(this.payParams);
      this.isPostCode = true;
      if (payResult.data.code == 200) {
        this.payInfo = payResult.data.data.detail;
      }
      return payResult;
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
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    ::v-deep .el-input__inner {
      border: none;
    }
  }
}
.txt-align-right {
  padding-left: 16px;
}
</style>
