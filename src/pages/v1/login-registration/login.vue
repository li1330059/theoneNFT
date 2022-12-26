<template>
  <Content>
    <div class="body-box">
      <app-head v-if="isOauth" :go="isOauth" title="授权登录" />
      <Header title="登录" />
      <!--       <div class="login-way">
        <div
          class="tab"
          :class="{ selected: login_way == 'phone' }"
          @click="onChangeLoginWay('phone')"
        >
          手机号登录
          <span />
        </div>
        <div class="line" />
        <div
          class="tab"
          :class="{ selected: login_way == 'password' }"
          @click="onChangeLoginWay('password')"
        >
          密码登录
          <span />
        </div>
      </div> -->

      <div class="form-wrap">
        <div class="input-block">
          <input type="text" placeholder="请输入手机号" v-model="phone" />
        </div>
        <div class="swiper-wrap">
          <div v-show="login_way == 'password'">
            <div class="input-block m-password">
              <input
                type="password"
                placeholder="请输入密码"
                v-model="password"
              />
              <div class="go-rest-password">
                <router-link to="/reset_password">忘记密码？</router-link>
              </div>
            </div>
            <div class="input-block verification-block img-code-wrap">
              <input
                type="text"
                placeholder="请输入图片验证码"
                v-model="imgCode"
              />
              <div class="code-img-wrap" @click="getCodeImg">
                <img :src="`data:image/png;base64,${codeImg}`" />
              </div>
            </div>
            <div class="img-code-tip" @click="getCodeImg">看不清点击刷新</div>
          </div>

          <div
            class="input-block verification-block"
            v-show="login_way == 'phone'"
          >
            <input
              type="text"
              maxlength="6"
              placeholder="请输入验证码"
              v-model="verification_code"
            />
            <getphonecode :phone="phone" :type="1" api="login_getAuthCode" />
          </div>
        </div>

        <div
          class="login-btn grayscale"
          :class="{ 'disabled-btn': submit_disabled }"
          @click="onLogin"
        >
          {{ loading ? "登录中……" : "立即登录" }}
        </div>
        <div class="agreement" @click="onRead">
          <span :class="{ read: is_read_agreement }" />我已阅读并同意
          <div class="blue" @click.stop="go('user_agreement')">
            《用户协议》
          </div>
          和
          <div class="blue" @click.stop="go('privacy_policy')">
            《隐私政策》
          </div>
        </div>
      </div>
    </div>
    <div id="captchaBox"></div>
  </Content>
</template>
<script>
import App from "@/utils/app/index";
import { checkPhoneNumber } from "@/utils/common";
import getphonecode from "@/components/v1/getphonecode.vue";
import Header from "./component/header.vue";
import Content from "./component/content.vue";
import Encryption from "@/utils/encryption";
import appHead from "./component/app-head.vue";

export default {
  components: { getphonecode, Header, Content, appHead },
  name: "login",
  data() {
    return {
      loading: false,
      phone: null,
      password: null, //密码
      verification_code: null, //手机验证码
      login_way: "phone", //登录方式phone｜password
      is_read_agreement: false,
      submit_disabled: true,
      codeImg: "",
      imgCode: "", //图片验证吗
      captchaObj: {},
      isOauth: "",
      RiskTipA: "",
    };
  },

  mounted() {
    this.copyWriting();
    this.getAgreement();
    this.getCodeImg();
    const redirect = this.$common.getQueryString("redirect");
    if (redirect && redirect.search("Authorize") != -1) {
      this.isOauth = localStorage.getItem("isOauth");
      if (App.browser.theone && App.browser.theone.isTheOne) {
        document.title = "授权登录";
      }
    }
	this.$sensors.track('login_pageview');
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  beforeRouteEnter(to, from, next) {
    const redirect = window.location.search;
    if (redirect && redirect.search("Authorize") != -1) {
      to.meta.hideService = true;
      to.meta.hideMoblieFooter = true;
    }
    next();
  },
  methods: {
    async copyWriting() {
      const res = await this.$api.service.copy_writing();
      if (res.data.code == 200 && res.data.data.RiskTipA) {
        this.RiskTipA = res.data.data.RiskTipA.text;
      }
    },
    async getCodeImg() {
      const res = await this.$api.service.getVerificationCode();
      if (res && res.data.code == 200) {
        this.codeImg = res.data.data.imageCode;
        this.ctoken = res.data.data.ctoken;
      } else {
        this.$message.warning(res.data.message);
      }
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
    go(type) {
      try {
        this.$router.push(`/news/${this.agreement_obj[type].records[0].uuid}`);
      } catch (e) {
        this.$message.warning("无信息");
      }
    },
    onRead() {
      this.is_read_agreement = !this.is_read_agreement;
      this.submit_disabled = !this.is_read_agreement;
    },
    onChangeLoginWay(way) {
      this.login_way = way;
    },

    async onLogin() {
      const self = this;
	  this.$sensors.track('login_click', {
	  	button_name: "登录"
	  });
      if (!this.is_read_agreement) {
        this.$message({
          message: "请勾选协议",
          type: "warning",
        });
        return;
      }

      const params = {};

      if (this.phone && checkPhoneNumber(this.phone)) {
        params.phone = this.phone;
      } else {
        this.$message({
          message: "请填写正确的国内手机号",
          type: "warning",
        });
        return;
      }

      if (!self.submit_disabled) {
        self.submit_disabled = true;
        self.loading = true;
        switch (this.login_way) {
          case "phone":
            if (this.verification_code) {
              this.loginHandle();
            } else {
              this.$message({
                message: "请输入正确的验证码",
                type: "warning",
              });
            }
            break;
          case "password":
            if (this.password) {
              if (!this.imgCode) {
                self.submit_disabled = false;
                self.loading = false;
                this.$message.warning("请填写图片验证码");
                return;
              }
              params.password = this.password;
              //支付密码校验
              const resPassword = await Encryption.getPassword(params.password);
              if (!resPassword) {
                this.$message.warning("密码加密错误");
                return;
              }
              const password_login_res =
                await this.$api.service.login_authPcLogin({
                  userName: params.phone,
                  password: resPassword,
                  imageCode: this.imgCode,
                  ctoken: this.ctoken,
                });
              self.submit_disabled = false;
              self.loading = false;
              if (password_login_res.data.code == 200) {
                //登录成功
                self.loginResultHandle(password_login_res);
              } else {
                this.getCodeImg();
                this.$message({
                  message: password_login_res.data.message,
                  type: "error",
                });
              }
            } else {
              this.$message({
                message: "请输入密码",
                type: "warning",
              });
            }
            break;
        }
        self.loading = false;
        self.submit_disabled = false;
      }
    },
    async loginHandle() {
      const self = this;
      let inviteCode = sessionStorage.getItem("inviteCode");
      let api = this.$api.service.login_authCodeLogin
      // TODO 有 inviteCode 使用邀请的登陆接口
      let params = {
        phone: this.phone,
        inviteCode,
        authCode: this.verification_code,
        loginType: 4,
      }
      if (inviteCode) {
        api = this.$api.service.invite_login
        params.activityType = 1 // 活动类型,1 拉新
      }
      const res = await api(params);
      self.submit_disabled = false;
      self.loading = false;
      if (res.data.code == 200) {
        //登录成功
        self.loginResultHandle(res);
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
        if (
          result.data.data.riskVerifiedKey &&
          result.data.data.riskVerifiedType
        ) {
          this.$confirm(this.RiskTipA, "安全提醒", {
            confirmButtonText: "去验证",
            cancelButtonText: "取消",
          }).then(async () => {
            this.$router.push({
              path: "/verification",
              query: {
                riskVerifiedKey: result.data.data.riskVerifiedKey,
                riskVerifiedType: result.data.data.riskVerifiedType,
              },
            });
          });
          return;
        }
        localStorage.setItem("THEONE_MEMBER", JSON.stringify(result.data.data));
        if (result.headers.authorization) {
          localStorage.setItem("authorization", result.headers.authorization);
          this.$sensors.login(result.data.data.encryptUuid);
        } else {
          this.$message({
            message: "token获取失败",
            type: "warning",
          });
          return;
        }
        this.$message({
          message: "欢迎来到唯艺个人博物馆",
          type: "success",
        });
        await this.$store.dispatch("getUserInfo");
        const redirect = this.$common.getQueryString("redirect");
        if (
          redirect &&
          (redirect.search(/login/gi) == -1 || this.$route.path == "/login")
        ) {
          if (
            redirect.indexOf("appId") != -1 &&
            redirect.indexOf("scope") != -1
          ) {
            window.location.replace(decodeURIComponent(redirect));
          } else {
            window.location.href = decodeURIComponent(redirect);
          }
        } else {
          window.location.href = "/";
        }
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
@import "@/assets/1.0/scss/loginRegistration.scss";
.agreement {
  .blue {
    color: #397fe7;
  }
}
.m-password {
  align-items: center;
}
.img-code-tip {
  color: rgba(51, 51, 51, 0.69);
  font-size: 12px;
  text-decoration: underline;
  text-align: right;
  margin-bottom: 10px;
  margin-top: -10px;
  cursor: pointer;
  @media screen and (max-width: 540px) {
    margin-top: -0.4rem;
  }
}
.code-img-wrap {
  width: 120px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  border-radius: 5px;
  margin-left: 16px;
  top: 0;
  left: 0;
  background-color: #d0d0d0;
  height: 50px;
  img {
    display: block;
    width: 130%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
  @media screen and (max-width: 540px) {
    margin-bottom: 0.07rem;
    margin-top: -0.07rem;
  }
}
.go-rest-password {
  font-size: 12px;
  margin-top: -5px;
  a {
    color: #397fe7;
  }
}
.swiper-wrap {
  height: 160px;
  @media screen and (max-width: 540px) {
    height: 3.2rem;
  }
}
.body-box {
  min-width: 380px;
}

.login-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
  overflow-y: auto;
  background-color: #fbfbfb;
  display: flex;
}
.header {
  .logo {
    display: none;
  }
  .login-title {
    padding: 174px 0 24px;
    font-size: 18px;
    font-weight: bold;
    color: #e61f1a;
  }
}
/* 切换登录方式-start */
.login-way {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  .tab {
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: #a3a3a3;
    transition: color ease-out 0.26s;
    span {
      display: none;
    }
  }
  .line {
    width: 1px;
    height: 12px;
    background-color: rgba(0, 0, 0, 0.2);
    margin: 0 15px;
    display: block;
  }
  .tab:first-child {
  }
  .selected {
    color: #000;
  }
}
/* .img-code-wrap {
  width: 120px;
  height: 50px;

  border-radius: 5px;
} */
/* 切换登录方式-end */
@media screen and (max-width: 540px) {
  .swiper-wrap {
  }

  .body-box {
    width: 100%;
    padding: 0 0.3rem;
    min-width: inherit;
    margin-top: constant(safe-area-inset-top);
    margin-top: env(safe-area-inset-top);
  }
  .go-rest-password {
    font-size: 0.28rem;
    text-align: right;

    /*   margin-top: -0.2rem; */
  }
  .header {
    display: block;
    .logo {
      display: block;
      margin: 0.94rem auto 1rem;
    }
    .login-title {
      display: none;
    }
  }
  .login-way {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.62rem;
    .tab {
      font-size: 0.28rem;
      font-weight: 400;
      color: #a3a3a3;
      transition: color ease-out 0.26s;
      span {
        display: block;
        width: 0.1rem;
        margin: 0.08rem auto 0;
        height: 0.04rem;
        transition: width ease-out 0.26s;
      }
    }
    .line {
      display: none;
    }
    .tab:first-child {
      margin-right: 0.31rem;
    }
    .selected {
      color: #e61f1a;
      span {
        background: #e61f1a;
        width: 100%;
      }
    }
  }
  .login_disabled {
    opacity: 0.8;
  }
  .login-wrap {
    display: blcok;
    background-color: #fafafa;
    .theme-img {
      display: none;
    }
    .login-info-wrap {
      flex: 1;
      padding: 0.92rem 0.6rem 0;
    }
  }
}
</style>
