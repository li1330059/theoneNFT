<template>
  <div class="code-wrap">
    <span
      class="post-code"
      :class="{'disabled':disabled}"
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
const CD_TIME = 60; //倒计时默认60s
export default {
  name: "GVerificationCode",
  props: {
    phone: {},
    disabled:{
      type:Boolean,
      default:false,
    },
    isCheck: {
      //是否检查手机号
      type: Boolean,
      default: true,
    },
    isReason: {
      //返回数据结构
      type: Boolean,
      default: false,
    },
    getCode: Function,
  },
  data() {
    return {
      verification_code_disabled: false,
      code_down_count: CD_TIME,
    };
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  methods: {
    downStart() {
      const self = this;

      self.verification_code_disabled = true;
      const config = {
        cdTime: CD_TIME,
        tickCall: (obj) => {
          self.code_down_count = obj.cdTime;
        },
        endCall: () => {
          self.verification_code_disabled = false;
        },
      };
      if (self.countDown) {
        self.countDown.start(config);
      } else {
        self.countDown = new countDown(config);
      }
    },
    async onPostCode() {
      const self = this;
      if(this.disabled){
        return;
      }

      if ((self.phone && checkPhoneNumber(self.phone)) || !self.isCheck) {
        //operation_authCode
        //login_getAuthCode
        if (this.getCode && typeof this.getCode == "function") {
          const res = await this.getCode();
          if (res == -1) {
            return;
          }

          if (res) {
            if (res.data.code == 200) {
              if (self.isReason) {
                if (res.data.data.success) {
                  self.$message({
                    message: "已发送",
                    type: "success",
                  });

                  self.downStart();
                } else {
                  self.$message({
                    message: res.data.data.reason,
                    type: "error",
                  });
                }
              } else {
                self.$message({
                  message: "已发送",
                  type: "success",
                });

                self.downStart();
              }
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
        }
        return;
      } else {
        self.$message({
          message: "请填写正确的国内手机号",
          type: "warning",
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