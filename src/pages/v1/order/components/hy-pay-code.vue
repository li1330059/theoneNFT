<template>
  <transition name="fade">
    <div class="pay-body" v-if="isShow">
      <m-head
        :title="title"
        :go="
          () => {
            isShow = false;
          }
        "
      />
      <div class="pay-content">
        <div class="head">
          <div class="title" @click="isShow = false">
            <div class="ui-icon"></div>
            {{ title }}
          </div>
        </div>
        <div class="form">
          <div class="ui-line" v-if="isShowPhone">
            <div class="input-group">
              <div class="label">预留手机号</div>
              <div class="input">
                <el-input
                  type="text"
                  placeholder="请输入您的预留手机号"
                  v-model="phone"
                ></el-input>
              </div>
            </div>
          </div>
          <div class="input-group">
            <div class="input">
              <el-input
                type="text"
                placeholder="请输入验证码"
                v-model="phoneCode"
              ></el-input>
              <div class="post-code" v-if="isShowPhone">
                <g-verification-code
                  :phone="phone"
                  :getCode="getCode"
                ></g-verification-code>
              </div>
            </div>
            <div
              class="ui-link blue"
              @click="isShowPhone = true"
              v-if="!isShowPhone"
            >
              您没有收到验证码？请点击后重新获取。
            </div>
          </div>
          <div class="ui-btn-group ui-btn-end">
            <div class="ui-btn ui-btn-red ui-btn-radius" @click="onSubmit">
              确定
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      phone: "",
      phoneCode: "",
      isShow: false,
      isShowPhone: false,
      subDisabled:false,
    };
  },
  props: {
    title: {
      type: String,
      default: "支付",
    },
    bankInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    payWay: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    user() {
      return this.$store.state.user_info;
    },
  },

  created() {},
  methods: {
    show(params) {
      this.params = params;
      this.isShow = true;
    },
    async getCode() {
      const res = await this.$api.service.v3_pay_sendSms({
        outTradeNo: this.params.outTradeNo,
        payChannel: this.payWay.payChannel,
        phone: this.phone,
        bankCardUUID:this.bankInfo.uuid
      });
      return res;
      /*    if (res.data.code == 200) {
        this.$message.success(res.data.message);
      } else {
        this.$message.error(res.data.message);
      } */
    },
    async onSubmit() {
      if (this.phoneCode) {
        if (this.subDisabled) {
          return;
        }
        this.subDisabled = true;
        const res = await this.$api.service.v3_pay_confirm({
          orderNo: this.params.orderNo,
          outTradeNo: this.params.outTradeNo,
          payChannel: this.payWay.payChannel,
          verifyCode: this.phoneCode,
        });
        this.subDisabled = false;
        if (res.data.code == 200) {
          if (res.data.data.detail.status == "SUCCESS") {
            this.$router.push(`/order/success`);
          } else {
            this.$message.error("fail");
          }
        } else {
          this.$message.error(res.data.message);
        }
      } else {
        this.$message.warning("请输入验证码");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.blue {
  color: #397fe7;
  padding-top: 8px;
}
.ui-btn-group {
  padding: 30px;
  @media screen and (max-width: 540px) {
    .ui-btn {
      width: 100%;
      line-height: 0.8rem;
      border-radius: 100px;
    }
  }
}
.pay-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 999;
  @media screen and (max-width: 540px) {
    background-color: #fafafa;
  }
}
.pay-content {
  width: 100%;
  margin: 10vh auto;
  max-width: 480px;
  box-shadow: 0px 0px 9px 4px rgba(164, 164, 164, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(230, 31, 26, 0.6);
  .form {
    padding-top: 17px;
  }
  .head {
    background-color: rgba(230, 31, 26, 0.1);
    line-height: 64px;
    padding: 0 24px;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: flex-start;
    .title {
      cursor: pointer;
    }
    .ui-icon {
      background-image: url("//static.theone.art/pc/yb-pay/icon-left.png");
    }
    font-size: 18px;
    font-weight: 600;
    color: #e61f1a;
  }
  @media screen and (max-width: 540px) {
    margin-top: 0;
    border: none;
    box-shadow: none;
    .head {
      display: none;
    }
  }
}
.ui-line {
  display: flex;
  align-items: flex-end;
  margin-bottom: 16px;
  > div {
    flex: 1;
  }
  @media screen and (max-width: 540px) {
    display: block;
    > div {
      margin-bottom: 0.2rem;
    }
  }
}
.input-group {
  padding: 0 8px;
  .label {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    padding-bottom: 8px;
  }
  .link {
    font-size: 14px;
    font-weight: 400;
    color: #397fe7;
    padding-bottom: 10px;
    cursor: pointer;
  }
  .input {
    display: flex;
    align-items: center;
  }
  @media screen and (max-width: 540px) {
    padding: 0;
    ::v-deep .el-select {
      width: 100%;
    }
    .link {
      text-align: right;
      padding-right: 0.32rem;
      margin-bottom: -0.9rem;
    }
    .label {
      font-size: 0.28rem;
      color: #000000;
      padding: 0 0.32rem 0.32rem;
    }
    .post-code {
      padding-right: 0.32rem;
    }
    .input {
      display: flex;
      width: 100%;
      align-items: center;
      background-color: #fff;

      ::v-deep .el-input__inner {
        border: none;
        width: 100%;
        line-height: 1rem;
        height: 1rem;
      }
    }
  }
}
.yb-pay-footer {
  display: flex;
  justify-content: flex-end;
  padding: 24px;
  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .agreement-wrap {
    display: flex;
    align-items: center;
    padding-top: 8px;
    cursor: pointer;
    span {
      color: rgba(57, 127, 231, 1);
    }
    .ui-icon {
      width: 12px;
      height: 12px;
      margin-right: 6px;
      background-image: url("//static.theone.art/pc/yb-pay/icon-select-default.png");
    }
    .selected {
      background-image: url("//static.theone.art/pc/yb-pay/icon-selected.png");
    }
  }
  .price-wrap {
    display: flex;
    .title {
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      padding-bottom: 17px;
    }
    .money {
      font-size: 14px;
      font-weight: 600;
      color: #e61f1a;
    }
  }
  @media screen and (max-width: 540px) {
    display: block;
    .pay-btn {
      width: 100%;
      line-height: 0.8rem;
      border-radius: 100px;
    }
    .agreement-wrap {
      margin: 0 auto;
    }
  }
}
.group-line {
  display: flex;
  align-items: center;
}
</style>
