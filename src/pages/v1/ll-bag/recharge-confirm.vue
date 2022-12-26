<template>
  <div class="ll-bag-withdraw-body ll-max-width ll-body-x-padding">
    <m-head></m-head>
    <section class="money-block">
      <div class="label">充值金额</div>
      <div class="money">{{ $common.formatMoney(rechargeInfo.price) }}</div>
    </section>
    <section class="recharge-info-block">
      <div class="bar">
        <div class="label">银行卡：</div>
        <div class="val">{{ rechargeInfo.bankObj.bankName }}</div>
      </div>
      <div class="bar">
        <div class="label">手机号：</div>
        <div class="val">
          <div class="val">{{ rechargeInfo.bankObj.phone }}</div>
        </div>
      </div>
      <div class="bar">
        <div class="label">验证码：</div>
        <div class="val code-wrap">
          <div>
            <el-input type="text" placeholder="请输入验证码" v-model="code" />
          </div>
          <div>
            <g-verification-code
              :isCheck="false"
              :getCode="getCode"
              :isReason="true"
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
      code: "",
      phone: "",
      rechargeInfo: {},
      params: {},
    };
  },
  computed: {},
  created() {
    let rechargeInfo = this.$route.params.info;
    if (rechargeInfo) {
      this.rechargeInfo = JSON.parse(window.decodeURIComponent(rechargeInfo));
    }
    this.init();
  },
  methods: {
    init() {},
    async submit() {
      if (!this.code) {
        this.$message.warning("请先填写验证码");
        return;
      }
      if (!this.params.outTradeNo) {
        this.$message.warning("请先发送验证码");
        return;
      }
      const res = await this.$api.service.ll_recharge_check({
        channel: "ll",
        outTradeNo: this.params.outTradeNo,
        token: this.params.token,
        verifyCode: this.code,
      });
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.$router.push(`/ll_bag/res_status/recharge_success`);
        } else {
          this.$router.push(
            `/ll_bag/res_status/recharge_fail?msg=${res.data.data.reason}`
          );
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    async getCode() {
      const res = await this.$api.service.ll_recharge_create({
        amount: this.$common.formatMoneyNum(this.rechargeInfo.price),
        channel: "ll",
        clientChnl: "H5",
        uuid: this.rechargeInfo.bankObj.uuid,
      });
      this.params = res.data.data;
      return res;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";

.money-block {
  background: #f7f7f7;
  border-radius: 16px 16px 0px 0px;
  backdrop-filter: blur(10px);
  padding: 24px 0 32px;
  text-align: center;
  .label {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 4px;
  }
  .money {
    font-size: 32px;
    font-weight: 600;
    color: #333333;
  }
}
.recharge-info-block {
  background: #ffffff;
  border-radius: 16px 16px 0px 0px;
  backdrop-filter: blur(10px);
  padding: 0 20px;
  .bar {
    border-bottom: 1px solid #f7f7f7;
    display: flex;
    align-items: center;
    padding: 12px 0;
    margin-top: 13px;
    .label {
      font-size: 16px;
      font-weight: 400;
      color: #999999;
      width: 80px;
    }
    .val {
      flex: 1;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      ::v-deep .el-input__inner {
        padding: 0;
        border: none;
      }
    }
    .code-wrap {
      display: flex;
      align-items: center;
    }
  }
}
</style>
