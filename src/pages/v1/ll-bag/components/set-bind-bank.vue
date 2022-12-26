<template>
  <div class="ll-bag-body">
    <m-head :back="back"></m-head>
    <div class="input-line">
      <div class="label">银行卡号：</div>
      <div class="v-code-wrap">
        <el-input
          type="txt"
          placeholder="请输入银行卡号"
          v-model="bankCardNum"
        />

        <div class="ui-btn link-btn" @click="showBanks">支持银行</div>
      </div>
    </div>
    <div class="input-line">
      <div class="label">预留手机号：</div>
      <div class="input-box">
        <el-input
          v-model="phone"
          type="txt"
          placeholder="请输入银行卡预留手机号"
        />
      </div>
    </div>
    <div class="input-line">
      <div class="label">验证码：</div>
      <div class="v-code-wrap">
        <el-input
          class="el-input"
          type="txt"
          placeholder="请输入验证码"
          v-model="code"
        />
        <g-verification-code
          :phone="phone"
          :getCode="getCode"
          :isReason="true"
          class="cus-color"
        ></g-verification-code>
      </div>
    </div>
    <section class="fixed-bottom bottom-btn-wrap">
      <div class="ll-btn ll-btn-default" @click="back">返回</div>
      <div
        class="ll-btn ll-btn-primary"
        :class="{ 'll-btn-opacity': isDisabled }"
        @click="next"
      >
        下一步
      </div>
    </section>
    <div v-if="isShowBanks" class="ll-bank-info">
      <bankcards-info
        class="fixed"
        :back="goBack"
        ref="bankcardsInfoRef"
      ></bankcards-info>
    </div>
  </div>
</template>
<script>
const payChannel = "ll";
import MHead from "./m-head.vue";
import BankcardsInfo from "../bankcards-info.vue";
export default {
  components: { BankcardsInfo, MHead },
  props: {
    resParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    nextPage: {
      type: String,
      default: "",
    },
  },
  computed: {
    isDisabled() {
      return !(this.bankCardNum && this.phone && this.code);
    },
  },
  data() {
    return {
      bankCardNum: "",
      phone: "",
      code: "",
      token: "",
      isShowBanks: false,
    };
  },
  created() {
    this.bankCardNum = this.resParams.bankCardNum;
    this.phone = this.resParams.phone;
  },

  methods: {
    back() {
      this.$emit("listen", {
        page: "id-card",
        data: {},
      });
    },
    showBanks() {
      this.isShowBanks = true;
      this.$nextTick(() => {
        this.$refs.bankcardsInfoRef.init();
      });
    },
    goBack() {
      this.isShowBanks = false;
    },
    next() {
      if (this.isDisabled) {
        return;
      }
      if (!this.token) {
        this.$message.warning("请先发送验证码");
        return;
      }
      this.$emit("listen", {
        page: this.nextPage,
        data: {
          phone: this.phone,
          bankCardNum: this.bankCardNum,
          verifyCode: this.code,
          token: this.token,
        },
      });
    },
    async getCode() {
      const res = await this.$api.service.ll_walletAccount_bindCardApply({
        payChannel: payChannel,
        phone: this.phone,
        bankCardNum: this.bankCardNum,
        idCardBack: this.resParams.idCardBack,
        idCardFront: this.resParams.idCardFront,
      });
      window.localStorage.setItem("LLOvertime", "no");

      if (res.data.code == 200 && res.data.data && res.data.data.success) {
        this.token = res.data.data.token;
      } else {
        if (res.data.code == 1000) {
          //可以重新上传身份证
        }
        if (res.data.data && res.data.data.reason) {
          const reason = res.data.data.reason;
          if (reason.search(/请退出重新验证注册/gi) !== -1) {
            this.$message.warning(reason);
            window.localStorage.setItem("LLOvertime", "yes");
            setTimeout(() => {
              window.location.reload();
            }, 600);

            /* this.$parent.getAccountStatus(); */
          }
        }
      }

      return res;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.fixed {
  position: absolute;
  z-index: 9999;
  background-color: #fff;
  box-shadow: none;
  @media screen and (max-width: 540px) {
    position: fixed;
    height: 100%;
  }
}
.ll-bank-info {
  ::v-deep .ll-bag-body {
    top: 0;
  }

  @media screen and (max-width: 540px) {
    ::v-deep .ll-bag-body {
      overflow-y: auto;
    }
  }
}
.v-code-wrap {
  flex: 1;
  .link-btn {
    text-align: right;
    font-size: 14px;
  }
}
.input-line {
  .label {
    width: 100px;
  }
  ::v-deep .el-input__inner {
    padding: 0;
  }
}
</style>
