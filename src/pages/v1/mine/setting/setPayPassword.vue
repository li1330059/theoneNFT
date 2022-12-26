<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    width="320px"
    :title="`设置安全锁密码`"
    :fullscreen="isPc ? false : true"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <div class="phone-num title" v-if="userInfo.isPayPwd == 1">
          手机号：{{ phone }}
        </div>
        <h1 v-else class="message title">
          为保障您的数字资产安全，请设置安全锁密码
        </h1>
        <div v-if="isPc">
          <div class="form-line">
            <h1 class="title">请输入6位数字安全锁密码</h1>
            <count-letters ref="payNum" />
          </div>
          <div class="form-line">
            <h1 class="title">再次输入</h1>
            <count-letters ref="repeatPayNum" />
          </div>
        </div>

        <div v-else>
          <h1 class="title">输入安全锁密码</h1>
          <el-input
            v-model="payPassword"
            placeholder="请输入6位安全锁密码"
          ></el-input>
          <h1 class="title">确认密码</h1>
          <el-input
            v-model="agianPassword"
            placeholder="请再次输入6位安全锁密码"
          ></el-input>
        </div>

        <div class="form-line" v-if="false">
          <h1>验证码</h1>
          <div class="input-line phone-code-wrap">
            <el-input
              v-model="initialPayPwParam.phoneCode"
              maxlength="6"
              placeholder="请输入验证码"
            ></el-input>
            <getphonecode :type="4" class="code-wrap" />
          </div>
        </div>
        <div class="form-btns">
          <div class="v1-btn mycenter" @click="dialogVisible = false">取消</div>
          <div class="v1-btn mycenter red" @click="submit()">确定</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import getphonecode from "@/components/v1/getphonecode";
import Encryption from "@/utils/encryption";
export default {
  components: { getphonecode },
  props: {
    userInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      phone: "",
      payPassword: "",
      agianPassword: "",
      initialPayPwParam: {
        password: "",
        phoneCode: "111111",
      },
      isPc: true,
    };
  },
  methods: {
    async init() {
      this.dialogVisible = true;
      this.restInput();
      this.isPc = !this.$common.isMobile();

      const user_member = localStorage.getItem("THEONE_MEMBER");
      if (user_member) {
        this.phone = JSON.parse(user_member).phone;
      }
    },
    restInput() {
      this.phone = "";
      this.payPassword = "";
      this.agianPassword = "";
      this.initialPayPwParam = {
        password: "",
        phoneCode: "111111",
      };
    },
    async onSendCode() {
      let result = await this.$api.service.operation_authCode({ type: 4 });
      if (result.data.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.warning(result.data.message);
      }
    },
    async submit() {
      /*    this.$emit("listen", { result: 123456 });
     return */
      let password, agianPassword;
      if (this.isPc) {
        password = this.$refs.payNum.getLetters().join("");
        agianPassword = this.$refs.repeatPayNum.getLetters().join("");
      } else {
        password = this.payPassword;
        agianPassword = this.agianPassword;
      }

      if (password.length != 6) {
        this.$message.error("请输入6位密码");
        return;
      }
      if (password == agianPassword) {
        const resPassword = await Encryption.getPassword(password);
        if (!resPassword) {
          this.$message.warning("密码加密错误");
          return;
        }
        this.initialPayPwParam.password = resPassword;
        let result = await this.$api.service.userAttribute_initialPayPw(
          this.initialPayPwParam
        );
        if (result.data.code == 200) {
          if (result.data.data) {
            console.log(`密码`, password);
            this.$store.commit("setUserInfo", { isPayPwd: 1 });
            this.dialogVisible = false;
            this.$emit("listen", { result: password });
          }
        } else {
          this.$message.warning(result.data.message);
        }
      } else {
        this.$message.warning("确认密码与密码不一致");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/mineSettings.scss";
.phone-code-wrap {
  display: flex;
  align-items: center;
  .code-wrap {
    width: 110px;
  }
}
.phone-num {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 16px;
}
.page-mine-setting-nameVerified .message {
  color: rgba($color: #000000, $alpha: 0.7);
}
.form-line {
  .title {
    padding-top: 15px;
  }
}
.form-btns {
  padding-top: 20px;
}
</style>
