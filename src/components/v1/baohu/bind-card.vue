<template>
  <div class="ui-body" v-if="isShow">
    <div class="m-bank-card ui-content-wrap">
      <div class="m-navigation">
        <div class="main" @click="onCancel">
          <span class="icon-direction" />返回
        </div>
      </div>
      <div class="m-phone-header">
        <div class="main">
          <div class="icon-direction" @click="onCancel"></div>
          <div class="txt">绑定宝付账户银行卡</div>
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
              <span class="change-banck-card" @click="showBanks"
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
      <select-cards
        v-if="isShowSelectCard"
        class="ui-selecte-cards-wrap"
        :bankList="userBankCardList"
        :userSelectedBankCardIdx="userSelectedBankCardIdx"
        :cancel="bankChange"
        :sure="bankChange"
      ></select-cards>
    </div>
  </div>
</template>
<script>
import SelectCards from "./select-cards.vue";
export default {
  components: { SelectCards },
  data() {
    return {
      isShowSelectCard: false,
      isShow: false,
      verifyCode: "",
      userBankCardList: [],
      userSelectedBankCardIdx: 0,
    };
  },
  props: {
    tip: String,
    submit: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    bankCardInfo() {
      return this.userBankCardList[this.userSelectedBankCardIdx] || null;
    },
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  created() {},

  methods: {
    goBindCard() {
      this.$router.push("/mine/wallet/bank");
    },
    async bankChange(idx) {
      this.isShowSelectCard = false;
      this.userSelectedBankCardIdx = idx;
      /*   await this.$api.service.userBank_unbound({
        uuid: this.bankCardInfo.uuid,
      }); */
    },
    show() {
      this.getUserCards();
      this.isShow = true;
    },
    showBanks() {
      this.isShowSelectCard = true;
    },
    onCancel() {
      this.verifyCode = "";
      this.isShow = false;
       this.submit();
    },
    async getCode() {
      return await this.$api.service.baofooInfo_changeCard({
        bankId: this.userBankCardList[this.userSelectedBankCardIdx].uuid,
      });
    },
    async getUserCards() {
      //获取用户银行卡列表
      const res = await this.$api.service.userbank_findBankAccount();
      if (res.data.code == 200) {
        this.userBankCardList = res.data.data;
        if (this.userBankCardList.length > 0) {
          const idx = this.userBankCardList.findIndex((item) =>
          (item.statusBandingBaofoo==1)
          );
          this.userSelectedBankCardIdx = idx >= 0 ? idx : 0;
        } else {
        }
      } else {
        this.$message.error(res.data.message);
      }
    },

    async onSubmit() {
      if (this.verifyCode) {
        this.verifyCode = this.verifyCode.trim();
        if (this.verifyCode) {
       
          if (this.userBankCardList[this.userSelectedBankCardIdx]) {
            const res = await this.$api.service.payChannel_bindCardConfirm({
              payChannel: "baofoo",
              bankUuid:
                this.userBankCardList[this.userSelectedBankCardIdx].uuid,
              verifyCode: this.verifyCode,
            });
            /*      this.onCancel();
            this.$parent.goConsignment();
            return; */
            if (res.data.code == 200 && res.data.data) {
              this.$message.success("绑定成功");

              this.onCancel();
              this.submit();
            } else {
              this.$message.error(res.data.message);
            }
          } else {
            this.$message.warning("无银行卡信息");
          }
        } else {
          this.$message.warning("请输入正确的验证码(6位)");
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
.blue {
  color: rgba(57, 127, 231, 1) !important;
  cursor: pointer;
}
.ui-content-wrap {
  position: relative;
  top: 0;
  left: 0;
}

.ui-selecte-cards-wrap {
  position: absolute;
  top: -33px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
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
    position: fixed;
    top: 0;
    left: 0;
    max-width: inherit;
    padding: 0 !important;
    margin-top: 0 !important;
    width: 100%;
    height: 100%;
  }
  .m-form {
    background-color: #fff;
    margin: -1.7rem 0.3rem 0;
    border-radius: 0.1rem;
  }

  /*   .ui-selecte-cards-wrap {
    position: absolute;
    z-index: 9;
    background-color:red;
  

  } */
}
</style>


