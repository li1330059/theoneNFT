<template>
  <div class="m-select-bankcard ui-content-wrap">
    <m-head title="选择银行卡" :go="onCancel" />
    <!--     <div class="m-phone-header">
      <div class="main">
        <div class="icon-direction" @click="onCancel"></div>
        <div class="txt">选择银行卡</div>
        <div class="placeholder"></div>
      </div>
    </div> -->
    <div v-if="userBankCards.length > 0">
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
                :class="{ 'icon-selected': idx == cardIdx }"
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
    <div v-else>去绑定银行卡</div>
  </div>
</template>
<script>
const BigNumber = require("bignumber.js");
export default {
  data() {
    return {
      cardIdx: 0,
    };
  },
  props: {
    userBankCards: {
      type: Array,
      default: () => {
        return [];
      },
    },
    userSelectedBankCardIdx: Number,
    cancel: {
      type: Function,
      default: () => {},
    },
    sure: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    userSelectedBankCardIdx: function () {
      this.cardIdx = this.userSelectedBankCardIdx;
    },
  },
  computed: {},

  methods: {
    onBankHandle(item, idx) {
      this.cardIdx = idx;
    },
    onSure() {
      this.sure(this.cardIdx);
      this.onCancel();
    },
    onCancel() {
      this.cardIdx = this.userSelectedBankCardIdx;
      this.cancel(1);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";

.m-select-bankcard {
  background: #ffffff;
  border-radius: 10px;
  padding: 16px 0px 50px !important;
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

@media screen and (max-width: 540px) {
  .ui-content-wrap {
    background-color: transparent !important;
  }
}
</style>


