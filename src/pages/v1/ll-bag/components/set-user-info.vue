<template>
  <div class="ll-bag-user-info-body">
    <m-head :back="back"></m-head>
    <div class="input-line">
      <div class="label">姓名：</div>
      <div class="input-box">
        <div>{{ userInfo.realname }}</div>
      </div>
    </div>
    <div class="input-line">
      <div class="label">身份证号：</div>
      <div class="input-box">
        <div>{{ userInfo.idNumber }}</div>
      </div>
    </div>
    <div class="input-line">
      <div class="label">手机号：</div>
      <div class="input-box">
        <el-input type="txt" v-model="phone" :disabled="phoneDisabled" />
      </div>
    </div>
    <div class="input-line">
      <div class="label">验证码：</div>
      <div class="v-code-wrap">
        <el-input
          class="el-input"
          type="txt"
          v-model="code"
          :disabled="codeInputDisabled"
        />
        <g-verification-code
          :disabled="codeDisabled"
          :phone="phone"
          :getCode="getCode"
          :isReason="true"
          class="cus-color"
        ></g-verification-code>
      </div>
    </div>
    <div class="agreement-wrap">
      <span
        @click="toggleAgreement"
        class="ll-icon icon-radius-default hand radius"
        :class="{ 'icon-radius-selected': isAgreement }"
      ></span>
      <sapn class="hand" @click="toggleAgreement">我已阅读并同意</sapn>
      <span class="link-btn" @click="goNews(news_id)"
        >《连连支付服务协议-用户协议》</span
      >与
      <span class="link-btn" @click="goNews(privacyAgreementId)"
        >《连连支付隐私权政策》</span
      >协议
    </div>
    <div class="fixed-bottom">
      <div
        class="ll-btn ll-btn-full"
        :class="[isPass ? 'll-btn-default' : 'll-btn-primary']"
        @click="submit"
      >
        下一步
      </div>
    </div>
  </div>
</template>
<script>
import MHead from "./m-head.vue";
import App from "@/utils/app/index";
const payChannel = "ll";
export default {
  components: { MHead },
  data() {
    return {
      news_id: "",
      privacyAgreementId: "",
      isAgreement: false,
      phone: "",
      code: "",
      codeDisabled: false,
      phoneDisabled: false,
      codeInputDisabled: false,
      isClickNext: false,
    };
  },
  props: {
    nextPage: {
      type: String,
      default: "",
    },
    resParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
    isPass() {
      if (
        this.userInfo.realname &&
        this.userInfo.idNumber &&
        this.phone &&
        this.code &&
        this.isAgreement
      ) {
        return false;
      }
      return true;
    },
  },
  created() {
    this.isClickNext = false;
    this.getAgreement();
    this.getPrivacyAgreement();
  },
  watch: {
    resParams(val) {
      console.log("参数变动");
      /*  this.isClickNext = false; */
      if (val && val.phone && val.verifyCode) {
        this.phone = val.phone;
        this.code = val.verifyCode;
        this.isAgreement = true;
        this.codeDisabled = true;
        this.phoneDisabled = true;
        this.codeInputDisabled = true;
      } else {
        this.codeDisabled = false;
        this.phoneDisabled = false;
        /*      this.phone = "";
        this.code = "";
        this.isAgreement = false; */
      }
    },
  },

  methods: {
    back() {
      if (App.browser.theone.isTheOne) {
        App.$methods.goBack();
      } else {
        this.$router.back();
      }
    },
    async getAgreement() {
      const res = await this.$api.service.dynamicNews_findNewsList({
        location: "ll_pay_agreement",
        pageCount: 1,
        pageSize: 10,
      });
      if (
        res.data.code == 200 &&
        res.data.data &&
        res.data.data.records.length > 0
      ) {
        this.news_id = res.data.data.records[0].uuid;
      }
    },
    async getPrivacyAgreement() {
      const res = await this.$api.service.dynamicNews_findNewsList({
        location: "ll_pay_privacy_agreement",
        pageCount: 1,
        pageSize: 10,
      });
      if (
        res.data.code == 200 &&
        res.data.data &&
        res.data.data.records.length > 0
      ) {
        this.privacyAgreementId = res.data.data.records[0].uuid;
      }
    },
    goNews(id) {
      if (id) {
        this.$router.push(`/news/${id}?is_show=1`);
      } else {
        this.$message.warning("暂无数据");
      }
    },
    toggleAgreement() {
      this.isAgreement = !this.isAgreement;
    },
    async getCode() {
      /*       return {
        data:{
          code:200,
          data:{
            reason:'cuowu',
            success:false,
          }
        }
      } */
      return await this.$api.service.ll_phoneVerifyCodeApply({
        payChannel: payChannel,
        phone: this.phone,
      });
    },
    async submit() {
      if (this.isPass) {
        return;
      }
      if (this.subDisabled) {
        return;
      }
      if (
        (this.resParams && this.resParams.phone && this.resParams.verifyCode) ||
        this.isClickNext
      ) {
        this.$emit("listen", { page: this.nextPage, data: {} });
        this.codeDisabled = true;
        this.phoneDisabled = true;
        this.codeInputDisabled = true;
        return;
      }
      this.subDisabled = true;

      const res = await this.$api.service.ll_checkVerifyCode({
        infoCode: this.code,
        phone: this.phone,
        payChannel: payChannel,
      });
      this.subDisabled = false;

      if (res.data.code == 200 && res.data.data.success) {
        this.isClickNext = true;
        this.codeDisabled = true;
        this.phoneDisabled = true;
        this.codeInputDisabled = true;
        this.$emit("listen", { page: this.nextPage, data: {} });
      } else {
        this.$message.error(res.data.data.reason || res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";

.agreement-wrap {
  word-break: break-all;
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  margin-top: 23px;
  .radius {
    margin-right: 5px;
  }
  .ll-icon {
    position: relative;
    top: 3px;
  }
}
.input-line {
  .label {
    width: 100px;
  }
  ::v-deep .el-input__inner {
    padding: 0;
  }
  ::v-deep .el-input {
    .is-disabled {
      .el-input__inner {
        color: #a2a2a2;
      }
    }
  }
}
</style>
