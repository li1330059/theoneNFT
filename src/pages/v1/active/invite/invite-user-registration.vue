<template>
  <div class="ui-body">
    <img
      class="body-img-title"
      src="
        //static.theone.art/pc/invite/m-title.png
      "
    />
    <div class="section">
      <img
        class="content-title"
        src="
          //static.theone.art/pc/invite/title-new-user.png
        "
      />
      <div class="form">
        <div v-if="showRegister">
          <div class="input-box">
            <div class="label">手机号</div>
            <el-input
              v-model="phone"
              placeholder="请输入手机号"
              type="text"
            ></el-input>
          </div>
          <div class="input-box">
            <div class="label">验证码</div>
            <div class="code-wrap">
              <el-input
                type="text"
                maxlength="6"
                placeholder="请输入验证码"
                v-model="verification_code"
              />
              <get-phonecode :phone="phone" :type="1" api="login_getAuthCode" />
            </div>
          </div>
          <div
            class="btn btn-red"
            :class="{ 'btn-disabled': submit_disabled }"
            @click="onRegister"
          >
            立即注册
          </div>
          <div class="agreement" @click="onRead">
            <span :class="{ read: is_read_agreement }" />我已阅读并同意
            <div @click.stop="go('user_agreement')">《用户协议》</div>
            和
            <div @click.stop="go('privacy_policy')">《隐私政策》</div>
          </div>
        </div>
        <div v-else>
          <div class="content-txt">
            您是老用户啦，快去邀请朋友注册领取奖励吧。
          </div>
          <div class="ui-btn-group">
            <div class="btn btn-red" @click="goIndx">去首页</div>
            <div class="btn btn-red" @click="goDetail">邀请好友</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>元宇宙时代新的艺术消费选择</div>
      <div>开拓全新的艺术收藏及应用途径</div>
      <div>寻找全新的文化价值承载方式</div>
    </div>
  </div>
</template>
<script>
import { checkPhoneNumber } from "@/utils/common";
export default {
  data() {
    return {
      phone: "",
      verification_code: "",
      is_read_agreement: false,
      agreement_obj: {},
      submit_disabled: true,
      showRegister: true,
    };
  },
  created() {
    this.invitation_code = this.$route.params.invitation_code;
  },
  mounted() {
    this.getAgreement();
  },
  computed: {},
  methods: {
    init() {},
    goIndx() {
      this.$router.push("/");
    },
    goDetail() {
      // window.location.href = "/invite_friends_detail";
      this.$router.push("/invite_friends_detail");
    },
    onRead() {
      this.is_read_agreement = !this.is_read_agreement;
      this.submit_disabled = !this.is_read_agreement;
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
    async onRegister() {
      const self = this;

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
        params.inviteCode = this.invitation_code;
        if (this.verification_code) {
          params.authCode = this.verification_code;
          const res = await this.$api.service.login_authCodeLogin(params);
          if (res.data.code == 200) {
            //注册成功
            self.loginResultHandle(res);
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        } else {
          this.$message({
            message: "请输入正确的验证码",
            type: "warning",
          });
        }
        self.submit_disabled = false;
      }
    },
    async loginResultHandle(result) {
      if (result.data.code == 200) {
        if (result.data.data.status == 2) {
          this.$message.warning("该账号已提交注销申请，可前往APP撤销注销申请");
          return;
        }
        localStorage.setItem("authorization", result.headers.authorization);
        this.$message({
          message: "欢迎来到唯艺个人博物馆",
          type: "success",
        });

        const user_attribute_res =
          await this.$api.service.userattribute_queryByUserUuid();
        if (user_attribute_res && user_attribute_res.data.code == 200) {
          this.$store.commit("setUserInfo", user_attribute_res.data.data);
          localStorage.setItem(
            "THEONE_MEMBER",
            JSON.stringify(user_attribute_res.data.data)
          );
          if (result.data.data.isNewUser == 1) {
            //新用户去实名认证

            window.location.href = "/invite_user_name_auth";
          } else {
            this.showRegister = false;
          }
          //新用户注册成功后跳转实名认证界面。
          //老用户提示【您已实名认证，快去邀请朋友注册领取奖励吧。】不跳转实名认证。
        } else {
          this.$message({
            message: user_attribute_res.data.message,
            type: "error",
          });
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
.ui-btn-group {
  .btn {
    margin: 0 4px;
  }
}
* {
  box-sizing: border-box;
}
.content-txt {
  padding: 0.9rem;
  font-size: 0.26rem;
  font-weight: 400;
  color: #333333;
  line-height: 0.4rem;
  text-align: center;
}
.ui-body {
  background: #201207 url("//static.theone.art/pc/invite/register-bg.png") top
    center no-repeat;
  background-size: contain;
  height: 100vh;
  width: 100%;

  padding-top: 1.73rem;
}
.section {
  position: relative;
  top: 0;
  left: 0;
  .content-title {
    display: block;
    width: 4.27rem;
    margin: 0 auto -0.2rem;
  }
}
.body-img-title {
  display: block;
  width: 5.32rem;
  margin: 0 auto 0.87rem;
}
.input-box {
  margin-bottom: 0.2rem;
  .label {
    font-size: 0.26rem;
    font-weight: 400;
    color: #333333;
    margin-bottom: 0.2rem;
  }
}
.code-wrap {
  display: flex;
  align-items: center;
}
.btn {
  line-height: 0.88rem;
  font-size: 0.26rem;
  font-weight: 400;
  border-radius: 50px;
  width: 100%;
  text-align: center;
}
.btn-red {
  background: linear-gradient(270deg, #e6231d 0%, #ff7863 100%);
  color: #fff;
}
.form {
  background: #ffffff;
  border-radius: 0.2rem;
  width: 90%;
  margin: 0 auto;
  padding: 0.45rem;
  position: relative;
  top: 0;
  left: 0;
  z-index: 2;
  max-width: 800px;
}
.agreement {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #666666;
  font-size: 12px;
  margin-top: 8px;
  cursor: pointer;
  span {
    display: block;
    background: url("//static.theone.art/pc/images/pic-home/icon_weigouxuan%402x.png")
      no-repeat center;
    background-size: contain;
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
  .read {
    background: url("//static.theone.art/pc/images/pic-home/icon_gouxuan%402x.png")
      no-repeat center;
    background-size: contain;
  }
  a {
    color: #000000;
    font-size: 0.12rem;
    font-weight: 400;
  }
  @media screen and (max-width: 540px) {
    font-size: 0.24rem;
    margin-top: 0.4rem;
    justify-content: center;

    span {
      width: 0.24rem;
      height: 0.24rem;

      margin-right: 0.04rem;
    }
    a {
      color: #000000;
      font-size: 0.24rem;
      font-weight: 400;
    }
  }
}
.btn-disabled {
  background: #d3d3d3;
}
.footer {
  font-size: 0.24rem;
  font-weight: 400;
  color: #ffffff;
  line-height: 3;
  text-align: center;
  padding-top: 1rem;
}
</style>