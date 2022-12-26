<template>
  <div v-if="isShow">
    <!--  绑卡并开户 -->
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
    <div class="hxt-improve-body">
      <div
        class="bind-bank-wrap"
        v-if="userBankCards && userBankCards.length > 0"
      >
        <div class="bank-list">
          <div
            class="bar"
            v-for="(item, idx) in userBankCards"
            :key="idx"
            @click="onBankHandle(item, idx)"
          >
            <div class="count">银行卡{{ idx + 1 }}</div>
            <div class="info">
              <div class="name hidden-one">{{ item.bankShortName }}</div>
              <div class="bank-id">{{ item.bankAccont }}</div>
              <div class="select">
                <span
                  class="icon icon-default"
                  :class="{ 'icon-selected': idx == userSelectedBankCardIdx }"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div class="m-btn-group">
          <div class="btn btn-disable" @click="onCancel">取消</div>
          <div class="btn btn-red" @click="onSure">确定</div>
        </div>
      </div>
      <div v-else>
        还没有绑定银行卡<span class="ui-link-btn" @click="bindBank"
          >点击绑定</span
        >
      </div>
    </div>

    <bankSubmit ref="bankSubmit" @listen="listenBankSubmit"></bankSubmit>
  </div>
</template>
<script>
import bankSubmit from "../../bankSubmit";
export default {
  name: "恒信通完善资料流程",
  components: { bankSubmit },
  data() {
    return {
      isShow: false,
      page: "",
      userSelectedBankCardIdx: 0,
      userBankCards: [],
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
    onSure() {
      this.cardAccount();
    },
    SETstatusBankCard() {
      //绑定银行卡并开户
      this.isShow = true;
      this.getUserCards();
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

    async cardAccount() {
      //绑卡&开户
      const bankInfo = this.userBankCards[this.userSelectedBankCardIdx];
      const res = await this.$api.service.payChannel_bindCardApply({
        accountType: 0,
        extendInfo: "",
        bankCardUUID: bankInfo.uuid,
        payChannel: "hxt",
      });
      if (res.data.code == 200) {
        if (res.data.data.bindFlag) {
          this.isShow = false;
          this.$message.success("绑定成功");
          this.$emit("success");
        } else {
          this.$message.error(res.data.data.action);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.m-navigation {
  padding: 0 20px 20px;
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
    margin: 0.2rem 0rem;
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
</style>
