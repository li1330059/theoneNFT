<template>
  <div class="select-bank-body fixed-bottom fixed-full" v-if="isShow">
    <div class="mask" @click="hide"></div>
    <div class="main">
      <div class="head">
        <span class="ll-icon icon-close" @click="hide"></span>
        <div class="title">请选择支付方式</div>
      </div>

      <div class="list-wrap">
        <div v-if="bankList.length > 0">
          <div
            class="bar"
            v-for="(item, idx) in bankList"
            :key="idx"
            :class="{ selected: idx == selectPayIdx }"
            @click="bankHandle(item, idx)"
          >
            <div><span class="ll-icon icon-idcard"></span></div>

            <div class="info">
              <span class="bank-name hidden-1"
                >{{ item.bankName }}({{
                  item.acctNo.replace(/\*/gi, "")
                }})</span
              >
              <span class="ll-icon icon-p"></span>
            </div>
          </div>
        </div>
        <div
          class="bar no-center"
          :class="{
            selected: selectPayIdx == -1,
            'disabled-balance': !isBalance,
          }"
          @click="bankHandle({}, -1)"
        >
          <div><span class="ll-icon icon-money"></span></div>

          <div class="info balance-name-wrap">
            <div class="balance-wrap">
              <span class="hidden-1"
                >余额({{ $common.formatMoney(balanceMoney) }})</span
              >
              <div class="des" v-if="!isBalance">余额不足</div>
            </div>

            <span class="ll-icon icon-p balance-icon"></span>
          </div>
        </div>
        <div class="bar hand" @click="goBindCard">
          <div class="info">
            <span class="ll-icon icon-bank-add"></span>

            <span class="add-txt">添加新卡支付</span>
          </div>
          <span class="ll-icon icon-p-right"></span>
        </div>
      </div>
      <div
        v-if="bankList.length > 0"
        class="ll-btn ll-btn-primary ll-btn-full"
        @click="submit"
      >
        确认
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    selectBankId: {
      type: String,
      default: "",
    },
    payWayIdx: {
      type: Number,
      default: 0,
    },
    bankList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    balanceMoney: {
      type: Number,
      default: 0,
    },
    isBalance: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: false,
      selectPayIdx: 0,
    };
  },
  watch: {
    payWayIdx(val) {
      this.selectPayIdx = val || 0;
    },
    selectBankId(val) {
      const idx = this.bankList.find((item) => item.uuid);
      if (idx != -1) {
        this.selectPayIdx = idx;
      }
    },
  },
  created() {},
  methods: {
    init() {
      this.selectPayIdx = this.payWayIdx || 0;
      this.show();
    },
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    goBindCard() {
      this.$router.push(`/ll_bag/bankcard_bind`);
    },
    bankHandle(item, idx) {
      if (idx == -1 && !this.isBalance) {
        return;
      }
      this.selectPayIdx = idx;
    },
    submit() {
      const bankInfo = this.bankList[this.selectPayIdx] || {};
      this.$emit("listen", bankInfo, this.selectPayIdx);
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.select-bank-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(51, 51, 51, 0.4);
  }
}
.main {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 16px 16px 0px 0px;
  backdrop-filter: blur(10px);
  padding: 20px 20px 32px;
}
.head {
  text-align: center;
  padding-bottom: 32px;
  .icon-close {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 40px;
    height: 40px;
  }
}
.list-wrap {
  max-height: 300px;
  overflow-y: auto;
  .bar {
    display: flex;
    align-items: center;
    padding: 20px 0;
    .icon-idcard {
      width: 32px;
      height: 20px;
      margin-right: 10px;
    }
    .icon-money {
      width: 32px;
      height: 20px;
      margin-right: 10px;
    }
    .icon-bank-add {
      width: 32px;
      height: 28px;
      margin-right: 10px;
    }
    .info {
      flex: 1;
      display: flex;
      align-items: center;
      /*  border: 1px solid #F7F7F7; */
      .balance-wrap {
        flex: 1;
      }

      .add-txt {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
      }
      .bank-name {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: #333333;
      }
    }
    .balance-name-wrap {
      .balance-icon {
        background-image: initial;
      }

      .des {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
    }
    &.selected {
      .icon-p {
        background-image: url("//static.theone.art/pc/ll-bag/icon-payway-select.png") !important;
      }
    }
  }
  .disabled-balance {
    opacity: 0.5;
  }
  .no-center {
    align-items: flex-start;
  }
}
</style>
