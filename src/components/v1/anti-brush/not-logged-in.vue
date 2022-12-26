<template>
  <div class="anti-brush">
    <el-dialog
      title="登录"
      :visible.sync="dialogVisible"
      width="410px"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <div class="ui-dialog-content">
        <div class="txt">为了您更好的体验，请登录后继续使用市场功能。</div>
        <div class="line-input">
          <el-input placeholder="请输入手机号" v-model="phone"></el-input>
        </div>
        <div class="line-input">
          <el-input placeholder="请输入验证码" v-model="vCode"></el-input>
          <verification-code
            :phone="phone"
            :type="1"
            api="login_getAuthCode"
          ></verification-code>
        </div>
      </div>
      <div class="agreement-wrap" @click="onRead">
        <span
          class="ui-icon icon-radius-default"
          :class="{ 'icon-radius-selected': isRead }"
        ></span>
        阅读并同意<span class="blue" @click.stop="go('user_agreement')"
          >《用户协议》</span
        >和<span class="blue" @click.stop="go('privacy_policy')"
          >《隐私政策》</span
        >
      </div>
      <div class="ui-btn-group ui-btn-end">
        <div class="ui-btn ui-btn-default" @click="handleClose">取消</div>
        <div class="ui-btn ui-btn-red" @click="onSubmit">确定</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import verificationCode from "../verification-code.vue";
import { checkPhoneNumber } from "@/utils/common";
export default {
  components: { verificationCode },
  data() {
    return {
      vCode: "",
      phone: "",
      isRead: false,
    };
  },
  props: {
    init: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    dialogVisible() {
      return this.$store.state.isShowNotLoggedIn;
    },
  },
  mounted() {
    this.getAgreement();
  },
  methods: {
    handleClose() {
      this.vCode = "";
      this.phone = "";
      this.isRead = false;
      this.$store.commit("setAntiBrush", {
        code: 1005,
        isShow: false,
      });
    },
    go(type) {
      try {
        this.$router.push(`/news/${this.agreement_obj[type].records[0].uuid}`);
      } catch (e) {
        this.$message.warning("无信息");
      }
    },
    onRead() {
      this.isRead = !this.isRead;
    },
    async getAgreement() {
      try {
        let agreement_obj = {};
        const user_agreement = await this.$api.service.news_list({
          location: "user_agreement",
          pageCount: 1,
          pageSize: 20,
        });
        const privacy_policy = await this.$api.service.news_list({
          location: "privacy_policy",
          pageCount: 1,
          pageSize: 20,
        });
        agreement_obj["user_agreement"] = user_agreement.data.data;
        agreement_obj["privacy_policy"] = privacy_policy.data.data;
        this.agreement_obj = agreement_obj;
      } catch (e) {}
    },
    async onSubmit() {
      if (!this.isRead) {
        this.$message.warning("请先同意《用户协议》和《隐私政策》");
        return;
      }
      if (!this.phone) {
        this.$message.warning("请输入手机号");
        return;
      }
      if (!checkPhoneNumber(this.phone)) {
        this.$message.warning("请输入正确的国内手机号");
        return;
      }
      if (!this.vCode) {
        this.$message.warning("请输入正确的验证码！");
        return;
      }

      const res = await this.$api.service.login_authCodeLogin({
        authCode: this.vCode,
        phone: this.phone,
      });

      if (res.data.code == 200) {
        //登录成功
        this.loginResultHandle(res);
      } else {
        this.$message({
          message: res.data.message,
          type: "error",
        });
      }
    },
    async loginResultHandle(result) {
      if (result.data.code == 200) {
        if (result.data.data.status == 2) {
          this.$message.warning("该账号已提交注销申请，可前往APP撤销注销申请");
          return;
        }
        localStorage.setItem("THEONE_MEMBER", JSON.stringify(result.data.data));
        localStorage.setItem("authorization", result.headers.authorization);
        this.$message({
          message: "欢迎来到唯艺个人博物馆",
          type: "success",
        });
        this.init();
        this.vCode = "";
        this.$store.commit("setmarketBtnDisabledInfo", {
          code: -1,
          time: "",
        });
        this.$store.commit("setAntiBrush", {
          code: 1005,
          isShow: false,
        });
        this.$store.dispatch("getUserInfo");
      } else {
        this.$message({
          message: result.data.message,
          type: "error",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.line-input {
  display: flex;
  align-items: center;
}
.ui-dialog-content {
  .txt {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    margin-bottom: 8px;
  }
  .red {
    color: #e61f1a;
  }
}
.line-input {
  margin: 16px 0;
}
.ui-btn-group {
  padding-top: 24px;
  .ui-btn {
    margin-left: 30px;
  }
}
.label {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
}
.agreement-wrap {
  cursor: pointer;
  .ui-icon {
    position: relative;
    top: 3px;
  }
  .blue {
    color: #397fe7;
  }
}
.anti-brush {
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
