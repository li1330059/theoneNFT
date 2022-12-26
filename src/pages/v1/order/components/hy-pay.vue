<template>
  <transition name="fade">
    <div class="yb-pay-body" v-if="isShow">
      <m-head
        :title="title"
        :go="
          () => {
            isShow = false;
          }
        "
      />
      <div class="yb-pay-content">
        <div class="head">
          <div class="title" @click="isShow = false">
            <div class="ui-icon"></div>
            {{ title }}
          </div>
        </div>
        <div class="form">
          <div class="ui-line">
            <div class="input-group">
              <div class="label">姓名</div>
              <div class="input">
                <el-input type="text" v-model="user.realname"></el-input>
              </div>
            </div>
            <div class="input-group">
              <div class="label">身份证</div>
              <div class="input">
                <el-input type="text" v-model="user.idNumber"></el-input>
              </div>
            </div>
          </div>

          <div class="ui-line">
            <div class="input-group">
              <div class="label">银行卡号</div>
              <div class="input input-message">
                <!--      <el-input
                  type="text"
                  v-model="hyInfo.bankAccount"
                  disabled
                ></el-input> -->
                
                <el-select
                  v-if="bankList.length>0"
                  class="cus-el-select"
                  v-model="bankIdx"
                  placeholder="请选则银行卡"
                  @change="bankChange"
                >
                  <el-option
                    v-for="(item, idx) in bankList"
                    :key="item.uuid"
                    :label="item.bankAccont"
                    :value="idx"
                  >
                  </el-option>
                </el-select>
                <div v-else class="link" @click="onBindBankCard">添加银行卡</div>
              </div>
            </div>
            <div class="input-group flex">
              <!--      <div class="link" @click="onAddBank">换卡</div> -->
              <div class="link" @click="$refs.Cards.show()">
                查看支持的银行卡和额度
              </div>
            </div>
          </div>
          <div class="bank-err-message">{{ bankErrorMessage }}</div>

          <div class="ui-line" v-if="isShowPhoneCode">
            <div class="input-group">
              <div class="label">预留手机号</div>
              <div class="input">
                <el-input
                  type="text"
                  placeholder="未获取到手机号"
                  v-model="bankList[bankIdx].phone"
                  disabled
                ></el-input>
              </div>
            </div>
            <div class="input-group group-line">
              <div class="input">
                <el-input
                  type="text"
                  placeholder="请输入验证码"
                  v-model="phoneCode"
                ></el-input>
                <div class="post-code">
                  <g-verification-code
                    ref="postPhoneCodeRef"
                    :getCode="checkBank"
                    :isCheck="false"
                  ></g-verification-code>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="yb-pay-footer">
          <div class="content">
            <div class="price-wrap">
              <div class="title">支付金额：</div>
              <div class="money">
                {{ $common.formatMoney(money) }}
              </div>
            </div>
            <div
              class="pay-btn ui-btn ui-btn-red"
              :class="{ 'ui-btn-disabled': subDisabled }"
              @click="onSubmit"
            >
              确认
            </div>

            <!--      <div class="agreement-wrap" @click="onToggleAgreement">
              <div class="ui-icon" :class="{ selected: isAgreement }"></div>
              同意<span>《用户协议》</span>和<span>《隐私政策》</span>
            </div> -->
          </div>
        </div>
      </div>
      <buy-cards ref="Cards" location="hy_pay_xe"></buy-cards>
      <bankSubmit
        v-if="user"
        ref="bankSubmitRef"
        :userInfo="user"
        @listen="listenBankSubmit"
      ></bankSubmit>
    </div>
  </transition>
</template>
<script>
import BuyCards from "./buy-cards.vue";
import bankSubmit from "../../mine/wallet/bankSubmit.vue";
export default {
  components: { BuyCards, bankSubmit },
  data() {
    return {
      userName: "",
      idcard: "",
      phone: "",
      phoneCode: "",
      bankList: [],
      bankIdx: "",
      isShow: false,
      isAgreement: false,
      isShowPhoneCode: false,
      bankErrorMessage: "",
    };
  },
  props: {
    payWay: {
      type: Object,
      default: () => {
        return {};
      },
    },
    title: {
      type: String,
      default: "选择汇元账户银行卡",
    },
    money: {
      type: Number,
      default: 0,
    },
    showAddBank: {
      type: Function,
      default: () => {},
    },
    hyInfo: {
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
    onBindBankCard() {
      this.$refs.bankSubmitRef.init();
    },
    listenBankSubmit() {
      this.show();
    },
    show() {
      this.isShow = true;
      this.isShowPhoneCode = false;
      this.phoneCode = "";
      this.getUserBank();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },

    async bankChange(idx) {
      this.phone = this.bankList[idx].phone;

      //检查银行卡状态
      this.preAuthCode = null;
      this.isShowPhoneCode = false;
      this.subDisabled = false;
      this.bankErrorMessage = "";
      this.checkBank();
    },
    async checkBank() {
      const bankCardUUID = this.bankList[this.bankIdx].uuid;
      const res = await this.$api.service.userBank_checkAuthInfo({
        bankCardUUID,
      });

      if (res.data.code == 200) {
        if (res.data.data.action == "need_auth") {
          this.$message.success("验证码已发送，此银行卡需要您输入验证码！");

          this.isShowPhoneCode = true;
          this.$nextTick(() => {
            this.$refs.postPhoneCodeRef.downStart();
          });

          this.preAuthCode = res.data.data.extendInfo;
        } else if (res.data.data.action == "error") {
          this.subDisabled = true;
          this.bankErrorMessage = res.data.data.errorMessage;
        }
      } else {
        this.$message.error(res.data.message);
      }
      return res;
    },

    onAddBank() {
      this.showAddBank();
    },
    upBank() {
      if (this.isShow) {
        this.$parent.getHyUserAccount();
      }
    },
    async getUserBank() {
      const res = await this.$api.service.userbank_findBankAccount();
      if (res.data.code == 200) {
        this.bankList = res.data.data;
        if (this.bankList.length > 0) {
          const bankUUid = localStorage.getItem("hy-pay-bank-uuid");

          if (bankUUid) {
            const idx = this.bankList.findIndex(
              //【修】
              (item) => item.uuid == bankUUid
            );
            console.log(idx);
            this.bankIdx = idx >= 0 ? idx : 0;
          } else {
            this.bankIdx = 0;
          }

          this.phone = this.bankList[this.bankIdx].phone;
          this.bankChange(this.bankIdx);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    onToggleAgreement() {
      this.isAgreement = !this.isAgreement;
    },
    async onSubmit() {
      /*     if (!this.isAgreement) {
        this.$message.warning("请先勾选协议");
        return;
      } */
      if (this.subDisabled) {
        return;
      }
      this.subDisabled = true;
      setTimeout(() => {
        this.subDisabled = false;
      }, 500);
      if (this.isShowPhoneCode) {
        if (!this.phoneCode) {
          this.$message.warning("请输入验证码");
          return;
        }
        if (!this.preAuthCode) {
          this.$message.warning("参数错误：extendInfo");
          return;
        }
        const res = await this.$api.service.payChannel_bindCardConfirm({
          payChannel: this.payWay.payChannel,
          accountType: 0,
          verifyCode: this.phoneCode,
          extendInfo: {},
          bankCardUUID: this.bankList[this.bankIdx].uuid,
          preAuthCode: this.preAuthCode,
        });
        this.subDisabled = false;
        if (
          res.data.code == 200 &&
          res.data.data &&
          res.data.data.bindCardConfirmFlag
        ) {
        } else {
          this.$message.error(res.data.message);
          return;
        }
      }
      localStorage.setItem(
        "hy-pay-bank-uuid",
        this.bankList[this.bankIdx].uuid
      );

      this.$parent.orderSubmitAndPay({}, this.bankList[this.bankIdx]);
    },
  },
};
</script>
<style lang="scss" scoped>
.bank-err-message {
  color: #e61f1a;
  padding: 0 8px;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > div {
    padding-right: 20px;
  }
  @media screen and (max-width: 540px) {
    height: 0.2rem;
    padding-bottom: 0.1rem;
    justify-content: flex-end;
    padding-right: 0.32rem;
  }
}
.yb-pay-body {
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
.yb-pay-content {
  width: 100%;
  margin: 10vh auto;
  max-width: 780px;
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
  .input-message {
    display: flex;
    align-items: center;
    width: 100%;
    ::v-deep .el-select {
      width: 100%;
    }
    .link {
      padding-left: 6px;
      padding-top: 8px;
    }
  }
  @media screen and (max-width: 540px) {
    padding: 0;
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
    ::v-deep .el-select {
      width: 100%;
    }
    .input-message {
      ::v-deep .el-select {
        flex: 1;
      }
      .link {
        position: relative;
        top: -0.32rem;
      }
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
