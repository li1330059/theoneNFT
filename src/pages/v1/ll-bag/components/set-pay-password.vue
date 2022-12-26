<template>
  <div class="ll-bag-body">
    <m-head :back="back"></m-head>
    <div class="input-group position">
      <div class="label">设置6位支付密码</div>
      <pay-password-input
        @success="listenSuccess"
        @error="listenError"
        :autoLoad="false"
        id="p10"
        ref="passWord1"
      ></pay-password-input>
    </div>

    <div class="input-group">
      <div class="label">确认支付密码</div>
      <pay-password-input
        @success="againSuccess"
        @error="listenAgainError"
        :autoLoad="false"
        id="p11"
        ref="passWord2"
      ></pay-password-input>
    </div>

    <!--    <div class="input-group">
      <div class="label">确认支付密码</div>
      <el-input></el-input>
    </div> -->
    <!--     <div style="border: 1px solid #ccc; width: 300px">
      <div id="ipt_pwd2" class="ipt_pwd">
        <span id="LOGPASS2_SHOW">请输入密码</span>
        <input
          id="LOGPASS2"
          class="default input_search"
          type="password"
          disabled="disabled"
        />
        <div id="keyboardBtn2" class="ipt_pwd_rjp default"></div>
      </div>
    </div>

    <button id="get-password">获取密码</button> -->

    <section class="fixed-bottom bottom-btn-wrap">
      <div class="ll-btn ll-btn-default" @click="back">返回</div>
      <div class="ll-btn ll-btn-primary" @click="next">下一步</div>
    </section>
  </div>
</template>
<script>
import PayPasswordInput from "./pay-password-input.vue";
import MHead from "./m-head.vue";
export default {
  components: { PayPasswordInput, MHead },
  props: {},
  data() {
    return {
      password: "",
      options: {},
      passwordErr: false,
      passwordAgainErr: false,
    };
  },
  created() {},
  methods: {
    updateCss() {
      this.$refs.passWord2.createCss();
      this.$refs.passWord1.createCss();
    },
    back() {
      this.$emit("listenBack", "bind-bank");
    },
    init() {
      this.getOptions();
    },

    listenSuccess(info) {
      this.passwordErr = false;
      this.password = info.password;
      this.password1 = info;
      this.randomKey = info.randomKey;
    },
    againSuccess(info) {
      this.passwordAgainErr = false;
      this.password2 = info;
      this.againPassword = info.password;
    },
    listenError(info) {
      this.passwordErr = true;
      this.$message.error(info.code);
    },
    listenAgainError(info) {
      this.passwordAgainErr = true;
      this.$message.error(info.code);
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
        this.$refs.passWord1.load(this.options);
        this.$refs.passWord2.load(this.options);
      } else {
        this.$message.error(keyRes.data.message);
      }
    },

    async next() {
      if (this.password2 && this.password1) {
        const password1 = this.password1.hash;
        const password2 = this.password2.hash;
        if (password1 == password2) {
          this.$emit("listen", {
            password: this.password,
            randomKey: this.randomKey,
          });
        } else {
          this.$message.warning("密码不一致");
        }
      } else {
        if (this.passwordAgainErr) {
          this.$message.warning("密码简单，请重新输入");
          return;
        }
        if (this.passwordErr) {
          this.$message.warning("密码简单，请重新输入");
          return;
        }
        this.$message.warning("请先设置密码");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.input-group {
  margin-bottom: 24px;
  .label {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 12px;
  }
}
.position {
  position: relative;
  z-index: 99;
}
</style>
