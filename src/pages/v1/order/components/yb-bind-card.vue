<template>
  <transition name="fade">
    <div class="yb-pay-body" v-if="isShow">
      <!--     <m-head
        :title="title"
        :go="
          () => {
            isShow = false;
          }
        "
      /> -->
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
              <div class="label">已绑定银行卡</div>
              <div class="input">
                <el-input
                  type="text"
                  placeholder=""
                  v-model="accountInfo.bankAccount"
                  disabled
                ></el-input>
              </div>
            </div>
          </div>
          <div class="ui-line">
            <div class="input-group">
              <div class="label">选择银行卡</div>
              <div class="input" v-if="bankList.length > 0">
                <el-select
                  :value="bankIdx"
                  placeholder="请选择银行卡"
                  class="el-select"
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
              </div>
              <div v-else class="link bind-btn" @click="onBindBank">
                绑定银行卡
              </div>
            </div>
            <div
              class="input-group see-banks"
              style="width: 90px; flex: inherit; padding-right: 0"
            >
              <div class="link" @click="onBindBank">新增银行卡</div>
              <!--      <div class="link" @click="$refs.Cards.show()">
                查看支持的银行卡和额度
              </div> -->
            </div>
          </div>
          <!--      <div v-if="bankWarning" class="ui-warning">不支持的银行卡</div> -->

          <div class="ui-line">
            <div class="input-group">
              <div class="label">预留手机号</div>
              <div class="input">
                <el-input
                  type="text"
                  placeholder="请输入您的预留手机号"
                  v-model="bankInfo.phone"
                  disabled
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="yb-pay-footer">
          <div class="content">
            <div class="pay-btn ui-btn ui-btn-red" @click="onSubmit">确认</div>

            <!--         <div class="agreement-wrap" @click="onToggleAgreement">
              <div class="ui-icon" :class="{ selected: isAgreement }"></div>
              同意<span>《用户协议》</span>和<span>《隐私政策》</span>
            </div> -->
          </div>
        </div>
      </div>
      <buy-cards ref="Cards" location="hy_pay_xe"></buy-cards>
      <bankSubmit
        v-if="userAttrResult"
        ref="bankSubmit"
        :userInfo="userAttrResult"
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
      money: "",
    };
  },
  props: {
    payWay: {
      type: Object,
      default: () => {
        return {};
      },
    },
    listenSuccess: {
      type: Function,
      default: () => {},
    },
    accountInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  created() {},
  computed: {
    userAttrResult() {
      return this.$store.state.user_info;
    },
    bankInfo() {
      return this.bankList[this.bankIdx] || {};
    },
    title() {
      return this.accountInfo.statusBankCard == 1
        ? "更换易宝账户银行卡"
        : "绑定易宝账户银行卡";
    },
    bankWarning() {
      return false;
    },
  },
  methods: {
    onBindBank() {
      this.$refs.bankSubmit.init();
    },
    listenBankSubmit() {
      this.getUserBank();
    },
    bankChange(e) {
      this.bankIdx = e;
    },
    goBindBank() {
      this.$router.push(`/mine/wallet/bank`);
    },
    show() {
      this.getUserBank();
      this.phoneCode = "";
      this.isShow = true;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    onToggleAgreement() {
      this.isAgreement = !this.isAgreement;
    },
    async getUserBank() {
      const res = await this.$api.service.userbank_findBankAccount();
      if (res.data.code == 200) {
        this.bankList = res.data.data.filter((item) => {
          if (item.bankAccont == this.accountInfo.bankAccount) {
            return false;
          }
          return true;
        });
        this.bankIdx = 0;
      } else {
        this.$message.error(res.data.message);
      }
    },
    async onSubmit() {
      const bankInfo = this.bankList[this.bankIdx];
      if (!bankInfo) {
        this.$message.warning("请先选择银行卡");
        return;
      }
      const res = await this.$api.service.payChannel_changeYbSettleBankCard({
        userBankCardId: bankInfo.uuid,
      });
      if (res.data.code == 200) {
        this.$message.success("换卡成功");
        this.isShow = false;
        this.$emit("listenSuccess");
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.ui-warning {
  color: #e61f1a;
  font-size: 12px;
  padding: 0 10px 20px;
  margin-top: -5px;
}
.el-select {
  width: 100%;
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
    padding: 17px 15px 0;
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
    width: 90%;
    .head {
      /*      display: none; */
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
    .link {
      text-align: left;
    }
    .bind-btn {
      text-align: left;
      padding-left: 0.32rem;
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
      line-height: 1rem;

      ::v-deep .el-input__inner {
        border: none;
        width: 100%;
      }
    }
  }
}
.see-banks {
  display: flex;
  align-items: center;
  .link {
  }
  @media screen and (max-width: 540px) {
    padding-left: 0.32rem;
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
