<template>
  <Content>
    <div class="authorize-body">
      <!--       -->
      <div class="authorize-wrap">
        <section class="authorize-detail">
          <app-head :go="gourl" title="" />
          <div class="ques">
            是否使用唯一艺术平台账号授权登录【{{ appInfo.name }}】？
          </div>
          <div class="logo-group">
            <div class="logo"></div>
            <div class="to"></div>
            <div
              class="logo-three"
              :style="{ backgroundImage: `url(${appInfo.iconUrl})` }"
            ></div>
          </div>

          <div class="set-wrap">
            <div class="label">登录后该平台将获得以下权限：</div>
            <div
              class="li hand"
              v-for="(item, index) in list"
              :key="index"
              @click="checkRadio(index)"
            >
              <div class="info">
                <div class="title-wrap">
                  <div class="title hidden-1">{{ item.name }}</div>
                  <div :class="['radio', item.check ? 'active' : '']"></div>
                </div>

                <div class="desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="">
            <div
              class="login-btn"
              :class="{ login_disabled: !submit_disabled }"
              @click="enter"
            >
              同意
            </div>
          </div>
          <div class="end-text">为了账号安全，请确认是您本人操作</div>
          <div class="describe">
            唯一艺术致力于保护您的个人隐私信息安全，具体数字艺术品信息的展示可能会单独向您获取授权，您可在唯一艺术APP-“我的藏品”中调整数字艺术品的可见状态或在唯一艺术APP-“账户安全"中直接解除登录授权。
          </div>
        </section>
      </div>
    </div>
  </Content>
</template>
<script>
import App from "@/utils/app/index";
import Content from "./component/content.vue";
import appHead from "./component/app-head.vue";
export default {
  components: { Content, appHead },
  name: "authorize",
  data() {
    return {
      submit_disabled: false, //冻结提交按钮
      list: [], //授权域信息
      gourl: "",
      appInfo: {
        name: "",
        iconUrl: "",
      },
    };
  },
  created() {
    if (App.browser.theone && App.browser.theone.isTheOne) {
      document.title = "授权登录";
    }
    this.authinfo();
    this.gourl = this.$route.query.redirectUri;
    localStorage.setItem("isOauth", this.gourl);
  },
  methods: {
    checkRadio(index) {
      this.list[index].check = !this.list[index].check;
      this.list = JSON.parse(JSON.stringify(this.list));
      this.submit_disabled = this.list.every((item) => item.check === true);
    },
    async authinfo() {
      const res = await this.$api.service.oauth_authinfo({
        appId: this.$route.query.appId,
        scope: this.$route.query.scope,
      });
      if (res.data.code == 200) {
        this.appInfo = res.data.data.appInfo;
        this.list = res.data.data.scopes;
        if (
          res.data.data.authedScopes &&
          res.data.data.authedScopes.length > 0
        ) {
          this.submit_disabled = true;
        }
        for (let i = 0; i < this.list.length; i++) {
          if (this.submit_disabled) {
            this.list[i].check = true;
          } else {
            this.list[i].check = false;
          }
        }
      } else {
        this.$message({
          message: res.data.message,
          type: "error",
        });
      }
    },
    async enter() {
      if (!this.submit_disabled) {
        return;
      }
      const res = await this.$api.service.oauth_grantcode({
        appId: this.$route.query.appId,
        scope: this.$route.query.scope,
        redirectUri: this.$route.query.redirectUri,
      });
      if (res.data.code == 200) {
        this.goApp(res.data.data.code);
      } else {
        this.$message({
          message: res.data.message,
          type: "error",
        });
      }
    },
    goApp(code) {
      //app内
      if (App.browser.theone && App.browser.theone.isTheOne) {
        if (App.browser.os.ios) {
          App.ios.authLogin(JSON.stringify({ message: "success", code: code }));
        } else if (App.browser.os.android) {
          App.android.authLogin({ message: "success", code: code });
        }
      } else {
        window.location.href = this.$route.query.redirectUri + "?code=" + code;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/loginRegistration.scss";
.authorize-body {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.authorize-wrap {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  border-radius: 4px;
  padding: 64px;
  .logo-group {
    display: flex;
    justify-content: center;
    div {
      width: 66px;
      height: 66px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
    .logo {
      background-image: url("~@/assets/1.0/images/auth-logo.png");
    }
    .to {
      background-image: url("~@/assets/1.0/images/auth-to.png");
      background-size: 44px auto;
      margin: 0 11px;
    }
    .logo-three {
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
      border-radius: 4px;
    }
  }
  .ques {
    color: #a3a3a3;

    text-align: center;
    margin-bottom: 32px;
  }
  .set-wrap {
    margin-top: 64px;
    .label {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
    .li {
      width: 380px;
      background: #f7f7f7;
      padding: 16px;
      margin-bottom: 8px;
      border-radius: 4px;
      .radio {
        width: 24px;
        height: 24px;
        background-image: url("~@/assets/1.0/images/auth-radio-no.png");
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;
      }
      .active {
        background-image: url("~@/assets/1.0/images/auth-radio-yes.png");
      }
      .info {
        word-wrap: break-word;
        white-space: pre-wrap;
        font-weight: 400;
        color: #a3a3a3;
        .desc {
          margin-top: 4px;
        }

        .title-wrap {
          display: flex;
          align-items: center;
        }
        .title {
          flex: 1;
          font-weight: 600;
          color: #333333;
        }
      }
      .logo-three {
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
        border-radius: 4px;
      }
    }
  }
  .describe {
    font-size: 12px;
    color: #a3a3a3;
    width: 380px;
    line-height: 17px;
  }
  .end-text {
    color: #a3a3a3;
    margin-top: 8px;
    margin-bottom: 24px;
    text-align: center;
  }
  .login_disabled {
    background: #d8d8d8;
  }
}
.login-btn {
  margin-top: 8px;
}
@media screen and (max-width: 525px) {
  .authorize-body {
    display: block;
    background-color: #fff;
    :deep(.m-phone-header) {
      .main {
        box-shadow: none;
        background-color: transparent;
      }
    }
  }
  .authorize-wrap {
    font-size: 0.28rem;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;
    overflow-x: hidden;
    background: #ffffff;
    padding: 0;
    .authorize-detail {
      flex: 1;
    }
    .logo-group {
      padding-top: 0.64rem;
      div {
        width: 1.32rem;
        height: 1.32rem;
      }
      .to {
        background-size: 0.88rem auto;
        margin: 0 0.22rem;
      }
    }
    .ques {
      margin-top: 0.48rem;
      margin-bottom: 0;
    }
    .set-wrap {
      margin: 1.58rem 0 0.12rem;
      padding: 0 0.4rem;
      .label {
        margin-bottom: 0.2rem;
      }
      .li {
        width: auto;
        padding: 0.24rem 0.4rem;
        margin-bottom: 0.16rem;
        .radio {
          width: 0.48rem;
          height: 0.48rem;
        }
      }
    }
    .describe {
      width: auto;
      padding: 0 0.4rem 0.38rem;
      text-align: center;
    }
    .end-text {
      margin-top: 0.16rem;
      margin-bottom: 0.48rem;
    }
  }
}
</style>
