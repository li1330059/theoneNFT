<template>
  <div>
    <el-dialog
      class="v1-dialog-mycenter page-mine-setting-nameVerified"
      :visible.sync="dialogVisible"
      append-to-body
      width="410px"
      :title="`充值`"
    >
      <div class="dialog-content">
        <div class="dialog-form">
          <div class="form-line">
            <div class="money">
              <div
                v-for="(item, index) in money"
                :key="index"
                :class="{ selected: item == rechargeMoney }"
                @click="inputMoney(item)"
              >
                {{ item }}<span>元</span>
              </div>
            </div>
          </div>
          <div class="form-line">
            <div class="input-money">
              <span>¥</span
              ><el-input
                v-model="rechargeMoney"
                placeholder="请输入充值金额"
              ></el-input>
            </div>
          </div>
          <div class="form-line">
            <h1>充值方式</h1>
            <div class="input-line">
              <el-radio-group v-model="payType">
                <el-radio :label="2">支付宝</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="form-btns">
            <div class="v1-btn mycenter red" @click="submit()">立即充值</div>
          </div>
        </div>
      </div>
    </el-dialog>
    <payCode ref="PayCode" />
  </div>
</template>
<script>
import payCode from "@/pages/v1/order/payCode";
export default {
  components: { payCode },
  props: {
    userInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      money: ["10", "50", "100", "500", "1000", "3000"],
      rechargeMoney: "",
      payType: 2,
    };
  },
  methods: {
    async init(wallet) {
      this.dialogVisible = true;
    },
    inputMoney(val) {
      this.rechargeMoney = val;
    },
    async submit() {
      if (!/^\d+(.\d+)?$/.test(this.rechargeMoney.replace(/,/g, ""))) {
        this.$message.error("请输入正确的金额");
        return;
      }
      let result = await this.$api.service.orderRecharge_addRecharge({
        amount: this.rechargeMoney,
      });
      if (result.data.code == 200) {
        const payMode = this.$common.isMobile() ? 2 : 1;
        let payResult = await this.$api.service.v2_pay_rechargePay({
          orderNo: result.data.data.orderNo,
          payMode,
          unitType: 3,
          userThirdType: this.payType,
        });
        if (payResult && payResult.data.code == 200) {
          this.dialogVisible = false;
          if (payMode == 1) {
            //pc自己生成二维码
            this.$refs.PayCode.init(
              `${payResult.data.data}&source=ON_PC`,
              result.data.data.orderNo,
              2
            );
          } else {
            window.location.href = payResult.data.data;
          }
        }
        // this.$emit("listen", { result: true });
      } else {
        this.$message.warning(result.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-mine-setting-nameVerified {
  .message {
    color: rgba($color: #000000, $alpha: 0.7);
  }
  .money {
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
    div {
      width: 110px;
      height: 46px;
      background: #f5f5f5;
      border-radius: 4px;
      margin: 8px;
      text-align: center;
      line-height: 46px;
      cursor: pointer;
      font-size: 22px;
      color: #999999;
      transition: all ease-out 0.16s;
      span {
        font-size: 12px;
        color: #999999;
        display: inline-block;
        padding-left: 2px;
      }
    }
    .selected {
      background: rgba(57, 127, 231, 0.1);
      color: #397fe7;
      span {
        color: #397fe7;
      }
    }
  }
  .input-money {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    margin-bottom: 24px;
    span {
      font-size: 20px;
      font-weight: 500;
    }
    ::v-deep .el-input__inner {
      border: none;
    }
  }
}
</style>
