<template>
  <transition name="fade">
  <div class="select-bank-body" v-if="isShow">
    <div class="mask" @click="hide"></div>
    <div class="main">
      <div class="head">
        <span class="ll-icon icon-close" @click="hide"></span>
        <div class="title">{{ title }}</div>
      </div>

      <div class="list-wrap">
        <div v-if="bankList.length > 0">
          <div
            class="bar"
            v-for="(item, idx) in bankList"
            :key="idx"
            :class="{ selected: idx == selectedBankIdx }"
            @click="bankHandle(item, idx)"
          >
            <div><span class="ll-icon icon-idcard"></span></div>

            <div class="info">
              <span class="bank-name hidden-1"
                >{{ item.bankName }}({{
                  item.acctNo.replace(/\*/gi, "")
                }})</span
              >
              <span class="ll-icon icon-selected"></span>
            </div>
          </div>
        </div>

        <div class="bar bindcard-new hand" @click="goBindCard">
          <div class="info">
            <span class="ll-icon icon-bank-add"></span>

            <span class="add-txt">添加新卡提现</span>
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
  </transition>
</template>
<script>
export default {
  components: {},
  props: {
    selectBankId: {
      type: String,
      default: "",
    },
    bankIdx: {
      type: Number,
      default: 0,
    },
    bankList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    title: {
      type: String,
      default: "请选择银行卡",
    },
  },
  data() {
    return {
      isShow: false,
      selectedBankIdx: 0,
    };
  },
  watch: {
    bankIdx(val) {
      this.selectedBankIdx = val || 0;
    },
    selectBankId(val) {
      const idx = this.bankList.find((item) => item.uuid);
      if (idx != -1) {
        this.selectedBankIdx = idx;
      }
    },
  },
  created() {},
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    bankHandle(item, idx) {
      this.selectedBankIdx = idx;
    },
    goBindCard() {
      this.$router.push(`/ll_bag/bankcard_bind`);
    },
    submit() {
      this.$emit(
        "listen",
        this.bankList[this.selectedBankIdx],
        this.selectedBankIdx
      );
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
  z-index: 999;
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
  max-height:400px;
  overflow-y:auto;
  .bar {
    display: flex;
    align-items: center;
    .icon-idcard {
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
      border-bottom: 1px solid #f7f7f7;
      padding: 22px 0;
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
    &.selected {
      .icon-selected {
        background-image: url("//static.theone.art/pc/ll-bag/icon-payway-select.png");
      }
    }
  }
  .bindcard-new {
    margin-bottom:32px;
    .info {
      padding: 16px 0;
    }
  }
}
</style>
