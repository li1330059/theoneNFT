<template>
  <transition name="fade">
    <div class="yb-pay-body" v-if="isShow">
      <div class="yb-pay-content">
        <div class="head">
          <div class="title">
            <div class="ui-icon" @click="isShow = false"></div>
            银行卡支付
          </div>
        </div>
        <div class="form">
          <div class="ui-line">
            <div class="input-group">
              <div class="label">姓名</div>
              <el-input type="text"></el-input>
            </div>
            <div class="input-group">
              <div class="label">身份证</div>
              <el-input type="text"></el-input>
            </div>
          </div>

          <div class="ui-line">
            <div class="input-group">
              <div class="label">银行卡号</div>
              <el-select v-model="bankIdx" placeholder="请选则银行卡">
                <el-option
                  v-for="(item, idx) in bankList"
                  :key="item.value"
                  :label="item.label"
                  :value="idx"
                >
                </el-option>
              </el-select>
            </div>
            <div class="input-group">
              <div class="link">查看支持的银行卡和额度</div>
            </div>
          </div>

          <div class="ui-line">
            <div class="input-group">
              <div class="label">预留手机号</div>
              <el-input
                type="text"
                placeholder="请输入您的预留手机号"
              ></el-input>
            </div>
            <div class="input-group group-line">
              <el-input type="text" placeholder="请输入验证码"></el-input>
              <g-verification-code></g-verification-code>
            </div>
          </div>
        </div>
        <div class="yb-pay-footer">
          <div class="content">
            <div class="price-wrap">
              <div class="title">支付金额：</div>
              <div class="money">$123</div>
            </div>
            <div><div class="pay-btn ui-btn ui-btn-red">立即支付</div></div>

            <div class="agreement-wrap" @click="onToggleAgreement">
              <div class="ui-icon" :class="{ selected: isAgreement }"></div>
              同意<span>《用户协议》</span>和<span>《隐私政策》</span>
            </div>
          </div>
        </div>
      </div>
      <buy-cards location="123"></buy-cards>
    </div>
  </transition>
</template>
<script>
import BuyCards from "./buy-cards.vue";
export default {
  components: { BuyCards },
  data() {
    return {
      bankList: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
      ],
      bankIdx: "",
      isShow: false,
      isAgreement: false,
    };
  },
  created() {},
  methods: {
    onToggleAgreement() {
      this.isAgreement = !this.isAgreement;
    },
  },
};
</script>
<style lang="scss" scoped>
.yb-pay-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 999;
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
    .ui-icon {
      background-image: url("//static.theone.art/pc/yb-pay/icon-left.png");
    }
    font-size: 18px;
    font-weight: 600;
    color: #e61f1a;
  }
}
.ui-line {
  display: flex;
  align-items: flex-end;
  margin-bottom: 16px;
  > div {
    flex: 1;
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
}
.group-line {
  display: flex;
  align-items: center;
}
</style>
