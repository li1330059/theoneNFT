<template>
  <div v-if="isShow">
    <!--  绑卡并开户 -->
    <div class="m-navigation">
      <div class="main" @click="onCancel">
        <span class="icon-direction" />授权银行卡
      </div>
    </div>
    <m-head title="授权银行卡" :go="onCancel" />
    <!--     <div class="m-phone-header">
      <div class="main">
        <div class="icon-direction" @click="onCancel"></div>
        <div class="txt">授权银行卡</div>
        <div class="placeholder"></div>
      </div>
    </div> -->
    <div class="hxt-improve-body">
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
              v-if="userBankCards.length > 0"
              class="cus-el-select"
              v-model="userSelectedBankCardIdx"
              placeholder="请选则银行卡"
              @change="bankChange"
            >
              <el-option
                v-for="(item, idx) in userBankCards"
                :key="item.uuid"
                :label="item.bankAccont"
                :value="idx"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="input-group flex">
          <div>
            <span class="ui-link-btn" @click="bindBank">添加银行卡</span>
          </div>
          <!--      <div class="link" @click="onAddBank">换卡</div> -->
          <div class="link"></div>
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
              v-model="userBankCards[userSelectedBankCardIdx].phone"
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

      <div class="ui-btn-group ui-btn-end">
        <!--  <div class="btn btn-disable" @click="onCancel">取消</div> -->
        <div
          class="btn ui-btn-red"
          :class="{ 'ui-btn-disabled': subDisabled }"
          @click="onSure"
        >
          确定
        </div>
      </div>
    </div>

    <bankSubmit ref="bankSubmit" @listen="listenBankSubmit"></bankSubmit>
  </div>
</template>
<script>
import bankSubmit from "../../bankSubmit";
export default {
  name: "汇元完善资料流程",
  components: { bankSubmit },
  data() {
    return {
      isShow: false,
      isShowPhoneCode: false,
      page: "",
      userSelectedBankCardIdx: 0,
      userBankCards: [],
      bankErrorMessage: "",
      phoneCode: "",
      subDisabled: false,
    };
  },
  props: {
    payWay: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  created() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    init() {},
    bankChange() {
      this.checkBank();
    },
    async checkBank() {
      const bankCardUUID =
        this.userBankCards[this.userSelectedBankCardIdx].uuid;
      const res = await this.$api.service.userBank_checkAuthInfo({
        bankCardUUID,
      });
      this.isShowPhoneCode = false;

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
    bindBank() {
      this.$refs.bankSubmit.init();
    },
    listenBankSubmit() {
      //绑卡成功
      this.getUserCards();
    },
    onBankHandle(item, idx) {
      this.userSelectedBankCardIdx = idx;
    },
    onCancel() {
      this.isShow = false;
      this.$emit("cancel");
    },
    async onSure() {
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
    },
    async SETstatusBankCard() {
      //绑定银行卡并开户
      this.isShow = true;
      await this.getUserCards();
      this.checkBank();
    },
    async getUserCards() {
      //获取用户银行卡列表
      const res = await this.$api.service.userbank_findBankAccount();
      if (res.data.code == 200) {
        this.userBankCards = res.data.data;
        if (this.userBankCards.length > 0) {
          const idx = this.userBankCards.findIndex((item) =>
            Boolean(item.statusDefault)
          );
          this.userSelectedBankCardIdx = idx >= 0 ? idx : 0;
        } else {
          /*   this.$refs.bankSubmit.init(); */
        }
      } else {
        this.$message.error(res.data.message);
      }
      // console.log(`获取用户银行卡列表`,this.userBankCards);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.m-navigation {
  padding: 0 20px 20px;
}
.bank-err-message {
  color: #e61f1a;
  padding: 0 8px;
  @media screen and (max-width: 540px) {
    padding: 0;
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
        width: 100%;
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
      padding: 0 0 0.32rem;
    }
    .post-code {
      padding-right: 0.32rem;
    }
  }
}
.hxt-improve-body {
  padding: 16px 62px 50px;
  background-color: #fff;
  border-radius: 10px;
  @media screen and (max-width: 540px) {
    padding: 0.16rem 0.32rem 0.3rem;
  }
}

.m-select-bankcard {
  background: #ffffff;
  border-radius: 10px;
}
.bank-list {
  padding-bottom: 22px;
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 19px;
  margin-bottom: 20px;
  cursor: pointer;
  .info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .count {
    width: 100px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }
  .name {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    flex: 1;
  }
  .bank-id {
    width: 200px;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
  }
  .select {
    width: 50px;
  }
  @media screen and (max-width: 540px) {
    display: block;
    background-color: #fff;
    margin: 0.2rem 0.3rem;
    border: none;
    padding: 0.3rem 0.26rem;
    border-radius: 0.1rem;
    .bank-id {
      width: inherit;
      flex: 1;
      min-width: 2.6rem;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
    }
    .count {
      margin-bottom: 0.2rem;
    }
    .select {
      position: relative;
      left: 0;
      top: 0.02rem;
      width: 0.5rem;
    }
  }
}
@media screen and (max-width: 540px) {
  .ui-link-btn {
    padding: 0;
  }
}
</style>
