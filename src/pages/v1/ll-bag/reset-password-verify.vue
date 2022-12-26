<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <div class="title">请输入6位数字支付密码</div>
    <div class="des">请不要设置连续相同数字</div>
    <div class="position">
      <pay-password-input
        @success="nuewSuccess"
        @error="error"
        :autoLoad="false"
        id="p6"
        ref="passWord1"
      ></pay-password-input>
    </div>

    <div class="title">请再次输入支付密码</div>

    <pay-password-input
      @success="nuewAginSuccess"
      @error="error"
      :autoLoad="false"
      id="p7"
      ref="passWord2"
    ></pay-password-input>
    <ll-footer  class="fixed-bottom"/>
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
      password: "",
    };
  },
  computed: {},
  created() {
    this.getOptions();
  },
  methods: {
    error(info) {
      this.$message.error(info.code);
    },

    nuewSuccess(obj) {
      this.passwordNew = obj.password;
      this.newPasswordObj = obj;
      this.submit();
    },
    nuewAginSuccess(obj) {
      this.newAginPasswordObj = obj;
      this.submit();
    },

    async submit() {
      if (this.newAginPasswordObj && this.newPasswordObj) {
        const password1 = this.newAginPasswordObj.hash;
        const password2 = this.newPasswordObj.hash;

        if (password1 == password2) {
          const res = await this.$api.service.ll_resetPwd_verify({
            password: this.passwordNew,
            randomKey: this.options.randomKey,
            token: this.$route.params.token,
            verifyCode: this.$route.params.code,
          });
          if (res.data.code == 200) {
            if (res.data.data.success) {
              this.$message.success("重置支付密码成功");
              this.$router.push(`/ll_bag`);
            } else {
              this.$message.error(res.data.data.reason);
            }
          } else {
            this.$message.error(res.data.message);
          }
        } else {
          this.$message.warning("两次密码不同");
        }
      }
    },
    async getOptions() {
      const keyRes = await this.$api.service.ll_safeConfig_randomKey({
        appName: this.$store.state.llConfig.appName,
        encryptAlgorithm: this.$common.isMobile() ? "RSA" : "SM2",
        flagChnl: "H5",
        pkgName:this.$store.state.llConfig.pkgName,
      });
      if (keyRes.data.code == 200 && keyRes.data.data.success) {
        this.options = keyRes.data.data;
        this.$refs.passWord1.load(this.options);
        this.$refs.passWord2.load(this.options);
      } else {
        this.$message.error(keyRes.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.title {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 12px;
}
.des {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
}
.position {
  position: relative;
  z-index: 99;
  margin-bottom: 20px;
}
.position2 {
  position: relative;
  z-index: 100;
  margin-bottom: 20px;
}
</style>



