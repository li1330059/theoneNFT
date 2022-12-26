<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <div class="title">支付密码</div>
    <div class="des">请输入设置的支付密码</div>
    <div class="fixed-bottom">
      <div class="ll-btn ll-btn-primary ll-btn-full" @click="submit">确定</div>
      <ll-footer />
    </div>
    <pay-password-input
      @success="listenSuccess"
      @error="listenError"
    ></pay-password-input>
    <div class="msg">
      本次操作需要短信验证<br />
      请输入{{ $common.formatAliAcount(phone) }}收到的短信验
    </div>
    <div class="input-line">
      <div class="label">验证码：</div>
      <div class="">
        <el-input placeholder="请输入验证码" v-model="code" />
      </div>
      <g-verification-code
        :phone="phone"
        :getCode="getCode"
        :isReason="true"
      ></g-verification-code>
    </div>
  </div>
</template>
<script>
import PayPasswordInput from "./components/pay-password-input.vue";
import MHead from "./components/m-head.vue";
import llFooter from "./components/ll-footer.vue";
export default {
  components: { PayPasswordInput, MHead, llFooter },
  data() {
    return {
      phone: "",
      code: "",
      bankcard: "",
      password: "",
      randomKey: "",
      isClickPost: false,
      errorMessage: "",
    };
  },
  computed: {},
  watch: {
    $route: function (to, from) {
      this.isClickPost = false;
      this.errorMessage = "";
    },
  },
  created() {
    this.phone = this.$route.query.phone;
    this.bankcard = this.$route.query.bankcard;
    this.isClickPost = false;
    this.errorMessage = "";
  },
  methods: {
    async getCode() {
      if (!this.password) {
        this.$message.warning("请先输入支付密码");
        return -1;
      }
      const res = await this.$api.service.ll_bindCard_bind({
        acctno: this.bankcard,
        password: this.password,
        phone: this.phone,
        randomKey: this.randomKey,
      });
      this.isClickPost = true;
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.errorMessage = "";
          this.token = res.data.data.token;
        } else {
          this.errorMessage = res.data.data.reason;
        }
      } else {
        this.errorMessage = res.data.message;
      }
      return res;
    },
    listenSuccess(info) {
      this.password = info.password;
      this.randomKey = info.randomKey;
    },
    listenError(info) {
      this.$message.error(info.code);
    },
    async submit() {
      if (!this.isClickPost) {
        this.$message.warning("请先获取验证码");
        return;
      }
      if (!this.code) {
        this.$message.warning("请先填写验证码");
        return;
      }
      if (this.errorMessage) {
        this.$message.error(this.errorMessage);
        return;
      }
      if (!this.token) {
        this.$message.warning("参数错误");
        return;
      }

      const res = await this.$api.service.ll_bindCard_bind_verify({
        acctno: this.bankcard,
        phone: this.phone,
        token: this.token,
        verifyCode: this.code,
      });
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.$router.push(`/ll_bag/res_status/bindcard_success`);
        } else {
          this.$router.push(`/ll_bag/res_status/bindcard_fail?msg=${res.data.data.reason}`);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.msg {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 30px;
  margin-top: 30px;
}
.title {
  margin-top: 30px;
  font-size: 16px;
  font-weight: 400;
  color: #333333;
}
.des {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  margin-top: 16px;
  margin-bottom: 12px;
}
</style>
