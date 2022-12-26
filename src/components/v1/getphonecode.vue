<template>
  <div class="code-wrap">
    <span
      class="post-code"
      v-show="!verification_code_disabled"
      @click="onPostCode"
      >发送验证码</span
    >
    <span class="post-code disabled" v-show="verification_code_disabled"
      >{{ code_down_count }}s后重新发送</span
    >
  </div>
</template>
<script>
import countDown from "@/utils/countDown";
import { checkPhoneNumber } from "@/utils/common";
export default {
  name: "getphonecode",
  props: {
    phone: {},
    type: {
      type: Number,
      required: true,
    },
    api: {
      type: String,
      default: "operation_authCode",
    },
    is_check: {
      //是否检查手机号
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      CodeGeeTest: null,
      verification_code_disabled: false,
      code_down_count: 60,
    };
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  methods: {
    async onPostCode() {
		this.$sensors.track('getcode_click');
      const self = this;
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      setTimeout(() => {
        this.disabled = false;
      }, 500);

      if ((self.phone && checkPhoneNumber(self.phone)) || self.is_check !== 1) {
        //operation_authCode
        //login_getAuthCode
        if (this.api == "login_getAuthCode") {
          this.goOn();
        } else {
          this.goOn();
        }
      } else {
        self.$message({
          message: "请填写正确的国内手机号",
          type: "warning",
        });
      }
    },
    async goOn() {
      const self = this;
      const res = await this.$api.service[this.api]({
        phone: self.phone,
        type: self.type,
      });

      console.log("获得结果--------------");
      console.log(res);
      if (res) {
        if (res.data.code == 200 && res.data.data) {
          if (this.api == "login_getAuthCode") {
            self.$message({
              message:
                "登录验证码已发送，验证码在15分钟内有效，若您没有收到验证码可1分钟后进行重新发送验证码操作。",
              type: "success",
            });
          } else {
            self.$message({
              message:
                "已发送",
              type: "success",
            });
          }

          self.verification_code_disabled = true;
          self.countDown = new countDown({
            cdTime: 60,
            tickCall: (obj) => {
              self.code_down_count = obj.cdTime;
            },
            endCall: () => {
              self.verification_code_disabled = false;
            },
          });
        } else {
          self.$message({
            message: res.data.message,
            type: "warning",
          });
        }
      } else {
        self.$message({
          message: "未授权",
          type: "error",
        });
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.code-wrap {
  .post-code {
    font-size: 14px;
    font-weight: 400;
    color: #397fe7;
    user-select: none;
    width: 110px;
    cursor: pointer;
    text-align: right;
    display: block;
  }
  .disabled {
    color: #c1c1c1;
  }
  @media screen and (max-width: 525px) {
    .post-code {
      width: 2.2rem;
      font-size: 0.28rem;
    }
  }
}
</style>