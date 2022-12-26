<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <div class="title">请输入您的支付密码</div>
    <div class="position5">
      <pay-password-input
        :autoLoad="false"
        @success="passwordSuccess"
        @error="error"
        id="p4"
        ref="passWord3"
      ></pay-password-input>
    </div>

    <div class="title">请输入6位数字支付密码</div>
    <div class="des">请不要设置连续相同数字</div>

    <div class="position4">
      <pay-password-input
        :autoLoad="false"
        @success="nuewSuccess"
        @error="error"
        id="p5"
        ref="newPassword"
      ></pay-password-input>
    </div>

    <div class="title">请再次输入支付密码</div>

    <pay-password-input
      :autoLoad="false"
      @success="nuewAginSuccess"
      @error="error"
      id="p2"
      ref="passWord2"
    ></pay-password-input>
    <ll-footer class="fixed-bottom"></ll-footer>
  </div>
</template>
<script>
import MHead from "./components/m-head.vue";
import PayPasswordInput from "./components/pay-password-input.vue";
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
      console.log("新密码触发");
      this.submit();
    },
    nuewAginSuccess(obj) {
      this.newAginPasswordObj = obj;
      console.log(" 新密码再次触发");
      this.submit();
    },
    passwordSuccess(obj) {
      this.password = obj.password;
      console.log("老密码触发");
      this.submit();
    },
    async submit() {
      console.log("提交");
      if (!this.password) {
        this.$message.warning("请先输入支付密码");
        return;
      }
      if (this.newAginPasswordObj && this.newPasswordObj) {
        const password1 = this.newAginPasswordObj.hash;
        const password2 = this.newPasswordObj.hash;
        if (password1 == password2) {
          const keyRes = await this.$api.service.ll_safeConfig_changePwd({
            password: this.password,
            passwordNew: this.passwordNew,
            randomKey: this.options.randomKey,
          });
          if (keyRes.data.code == 200) {
            if (keyRes.data.data.success) {
              this.$message.success("修改支付密码成功");
              this.$router.push(`/ll_bag/security_setting`);
            } else {
              this.$message.error(keyRes.data.data.reason);
            }
          } else {
            this.$message.error(keyRes.data.message);
          }
        } else {
          this.$message.warning("两次输入的密码不一致");
        }
      }
    },
    async getOptions() {
      const keyRes = await this.$api.service.ll_safeConfig_randomKey({
        appName: this.$store.state.llConfig.appName,
        encryptAlgorithm: this.$common.isMobile() ? "RSA" : "SM2",
        flagChnl: "H5",
        pkgName: this.$store.state.llConfig.pkgName,
      });
      if (keyRes.data.code == 200 && keyRes.data.data.success) {
        this.options = keyRes.data.data;
        this.$refs.newPassword.load(this.options);
        this.$refs.passWord2.load(this.options);
        this.$refs.passWord3.load(this.options);
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
.position5 {
  position: relative;
  z-index: 5;
  margin-bottom: 20px;
}
.position4 {
  position: relative;
  z-index: 4;
  margin-bottom: 20px;
}
</style>
