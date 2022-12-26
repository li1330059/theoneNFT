<template>
  <div class="m-bank-card ui-content-wrap">
    <div class="m-navigation">
      <div class="main" @click="onCancel">
        <span class="icon-direction" />绑定银行卡
      </div>
    </div>
    <div class="m-phone-header">
      <div class="main">
        <div class="icon-direction" @click="onCancel"></div>
        <div class="txt">绑定银行卡</div>
        <div class="placeholder"></div>
      </div>
    </div>

    <div v-if="bankCardInfo">
      <div class="ui-head">
        <div class="des">
          {{ tip }}
        </div>
        <div class="tool">
          <div>
            <span class="change-banck-card" @click="$parent.showBanks"
              >更换银行卡</span
            >
          </div>
        </div>
      </div>
      <div class="m-form">
        <div class="m-card-info">
          <div class="bar">
            <div class="label">姓名：</div>
            <div class="value">{{ userInfo.realname }}</div>
          </div>
          <div class="bar">
            <div class="label">身份证号：</div>
            <div class="value">{{ userInfo.idNumber }}</div>
          </div>
          <div class="bar">
            <div class="label">银行卡预留手机号：</div>
            <div class="value">{{ bankCardInfo.phone }}</div>
          </div>
          <div class="bar">
            <div class="label">银行卡号：</div>
            <div class="value">{{ bankCardInfo.bankAccont }}</div>
          </div>
        </div>
        <div class="m-code-wrap">
          <div class="label">验证码：</div>
          <div class="input">
            <el-input type="text" v-model="verifyCode" />
            <div class="post">
              <g-verification-code
                :phone="bankCardInfo.phone"
                :getCode="getCode"
                :isCheck="false"
              ></g-verification-code>
            </div>
          </div>
        </div>
      </div>
      <div class="m-btn-group">
        <div class="btn btn-disable" @click="onCancel">取消</div>
        <div class="btn btn-red" @click="onSubmit">确定</div>
      </div>
    </div>
    <div v-else>
      尚未绑定银行卡<span class="blue" @click="goBindCard"> 去绑定</span>
    </div>
  </div>
</template>
<script>
const BigNumber = require("bignumber.js");
export default {
  data() {
    return {
      verifyCode: "",
    };
  },
  props: {
    userBankCards: [],
    userSelectedBankCardIdx: Number,
    tip: String,
    submit: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    bankCardInfo() {
      return this.userBankCards[this.userSelectedBankCardIdx] || null;
    },
    userInfo() {
      return this.$store.state.user_info;
    },
  },

  methods: {
    goBindCard() {
      this.$router.push("/mine/wallet/bank");
    },
    onCancel() {
      this.verifyCode = "";
      this.$parent.changePage(0);
    },
    async getCode() {
      return await this.$api.service.payChannel_bindCardApply({
        payChannel: "baofoo",
        accountType: 0,
        backCardUUID: this.userBankCards[this.userSelectedBankCardIdx].uuid,
      });
    },
    async onSubmit() {
      if (this.verifyCode) {
        this.verifyCode = this.verifyCode.trim();
        if (this.verifyCode) {
          if (this.userBankCards[this.userSelectedBankCardIdx]) {
            const res = await this.$api.service.payChannel_bindCardConfirm({
              payChannel: "baofoo",
              bankUuid: this.userBankCards[this.userSelectedBankCardIdx].uuid,
              verifyCode: this.verifyCode,
            });
            /*      this.onCancel();
            this.$parent.goConsignment();
            return; */
            if (res.data.code == 200 && res.data.data) {
              //绑定成功继续寄售流程
              this.onCancel();
              this.submit();
            } else {
              this.$message.error(res.data.message);
            }
          } else {
            this.$message.warning("无银行卡信息");
          }
        } else {
          this.$message.warning("请输入正确的验证码");
        }
      } else {
        this.$message.warning("请输入验证码");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";

.ui-head {
  font-size: 14px;
  font-weight: 400;
  padding-bottom: 14px;
  .des {
    color: #333333;
    line-height: 24px;
  }
  .warning {
    color: #e61f1a;
    line-height: 20px;
  }
  .change-banck-card {
    color: #397fe7;
    line-height: 20px;
    cursor: pointer;
  }
  .tool {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 26px;
  }
  @media screen and (max-width: 540px) {
    background: linear-gradient(240deg, #303a63 0%, #0f1722 100%);
    padding: 0.4rem 0.56rem 2rem;
    .des {
      color: #ffffff;
    }
  }
}
.m-card-info {
  border-radius: 3px;
  border: 1px solid #eeeeee;
  padding: 25px 20px 5px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  .bar {
    display: flex;
    width: 50%;
    margin-bottom: 20px;
  }
  @media screen and (max-width: 540px) {
    background: transparent;
    border: none;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 0.2rem;
    display: block;
    .bar {
      width: 100%;
      justify-content: space-between;
    }
  }
}
.m-code-wrap {
  display: flex;
  align-items: center;
  width: 400px;
  padding-bottom: 30px;
  .input {
    display: flex;
    align-items: center;
  }
  .post {
    width: 160px;
    text-align: right;
  }
  .label {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    width: 100px;
  }
  @media screen and (max-width: 540px) {
    display: block;
    width: 100%;
    padding: 0.4rem 0.3rem;
    .label {
      margin-bottom: 0.24rem;
    }
  }
}
@media screen and (max-width: 540px) {
  .ui-content-wrap {
    background-color: transparent !important;
  }
  .m-form {
    background-color: #fff;
    margin: -1.7rem 0.3rem 0;
    border-radius: 0.1rem;
  }
}
</style>


