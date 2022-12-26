<template>
  <Content>
    <div class="restpoassword-wrap">
      <Header title="重置密码" />

      <div class="form-wrap">
        <div class="input-title">手机号</div>
        <div class="input-block">
          <input type="text" placeholder="请输入手机号" v-model="phone" />
        </div>

        <div class="input-block verification-block">
          <input
            type="text"
             maxlength="6"
            placeholder="请输入验证码"
            v-model="verification_code"
          />
          <getphonecode :phone="phone" :type="2" api="login_getAuthCode" />
        </div>
        <div class="input-title">密码</div>
        <div class="input-block">
          <input type="password" placeholder="请输入密码" v-model="password" />
        </div>
        <div class="input-title">确认密码</div>
        <div class="input-block">
          <input
            type="password"
            placeholder="请确认密码"
            v-model="confirm_password"
          />
        </div>
        <div
          class="login-btn"
          :class="{ login_disabled: submit_disabled }"
          @click="onLogin"
        >
          完成
        </div>
      </div>
    </div>
  </Content>
</template>
<script>
import { checkPhoneNumber } from "@/utils/common";
import getphonecode from "../../../components/v1/getphonecode";
import Header from "./component/header.vue";
import Content from "./component/content.vue";
export default {
  components: { Header, getphonecode, Content },
  name: "resetPassword",
  data() {
    return {
      phone: null,
      password: null, //密码
      confirm_password: "", //确认密码
      verification_code: null, //手机验证码
      submit_disabled: false, //冻结提交按钮
    };
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  methods: {
    restInput(){
      this.phone=null
      this.password=null
      this.confirm_password=null
      this.verification_code=null
    },
    async onLogin() {
      const self = this;

      if (!checkPhoneNumber(this.phone)) {
        this.$message.warning("请填写正确的国内手机号");
        return;
      }
      if (
        this.password &&
        this.phone &&
        this.verification_code &&
        this.confirm_password
      ) {
        if (
          this.password.search(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/) !== -1 &&
          this.password.length >= 8
        ) {
          if (this.password === this.confirm_password) {
            const params = {
              phone: this.phone,
              phoneCode: this.verification_code,
              password: this.password,
            };
            if (!self.submit_disabled) {
              self.submit_disabled = true;
              const rest_password_res =
                await this.$api.service.operation_changePwByAuthCode(params);
              self.submit_disabled = false;
              if (
                rest_password_res.data.code === 200 &&
                rest_password_res.data.data
              ) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                setTimeout(() => {
                  this.$router.push("/login");
                }, 500);
              } else {
                this.$message({
                  message: rest_password_res.data.message,
                  type: "error",
                });
              }
            }
          } else {
            this.$message({
              message: "两次密码输入不一致",
              type: "warning",
            });
          }
        } else {
          this.$message({
            message: "密码由英文数字下划线组成,最少6位",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "请填写完整",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/loginRegistration.scss";
.restpoassword-wrap {
  min-width: 3.8rem;
}
.input-title {
  font-size: 0.14rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  margin-bottom: 0.08rem;
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

  .login-info-wrap {
    flex: 6;
    padding: 0.92rem 0.6rem 0 1.6rem;
  }
}
.header {
  .logo {
    display: none;
  }
  .login-title {
    padding: 1.74rem 0 0.24rem;
    font-size: 0.18rem;
    font-weight: bold;
    color: #e61f1a;
  }
}
/* 切换登录方式-start */
.login-way {
  display: flex;
  align-items: center;
  margin-bottom: 0.32rem;
  .tab {
    cursor: pointer;
    font-size: 0.14rem;
    font-weight: 400;
    color: #a3a3a3;
    transition: color ease-out 0.26s;
    span {
      display: none;
    }
  }
  .tab:first-child {
    margin-right: 0.3rem;
  }
  .selected {
    color: #000;
  }
}

/* 切换登录方式-end */
@media screen and (max-width: 525px) {
  .input-title {
    font-size: 0.28rem;
  }
  .restpoassword-wrap {
    min-width: inherit;
    padding: 0 0.3rem;
  }

  .login-way {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.92rem;
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



