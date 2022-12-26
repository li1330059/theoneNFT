<template>
  <div>
    <el-dialog
      class="v1-dialog-mycenter page-mine-wallet-withdrawal-amount"
      :visible.sync="dialogVisible"
      append-to-body
      width="400px"
      title="提现"
      z-index="100"
    >
      <div class="dialog-content">
        <div class="dialog-form">
          <div class="ui-tip-wraning">提现金额提示：</div>
          <div class="ui-tip-wraning">
            D
            账户订单不足10笔，需全额提取；订单超过10笔，提现金额为汇元账户最先寄售成功的10笔订单金额。
          </div>
          <div class="ui-tip-wraning">提现规则提示：</div>
          <div class="ui-tip-wraning">
            每天可提现{{
              drawConfig.confValue1
            }}次，当天17:00前提交的申请，预计次日24时前到账。当天17:00后提交的申请，预计后天24时前到账.
          </div>

          <div class="line-wrap">
            <div class="title">提现到账银行卡：</div>
            <div>{{ this.ybInfo.bankAccount }}</div>
            <div class="link-btn hand" @click="onChangeBank">更换</div>
          </div>
          <div v-if="type == 0" class="form-line">
            <h1>请输入6位数字安全锁密码</h1>
            <div class="input-line password-number adjacent">
              <count-letters ref="payPassword" />
            </div>
          </div>

          <div class="form-btns">
            <div class="v1-btn mycenter" @click="dialogVisible = false">
              取消
            </div>
            <div class="v1-btn mycenter red" @click="addSubmit()">确定</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <yb-bind-card
      ref="YbBindCardRef"
      @listenSuccess="ybBindCardSuccess"
      :accountInfo="ybInfo"
    ></yb-bind-card>
  </div>
</template>
<script>
const BigNumber = require("bignumber.js");
import Encryption from "@/utils/encryption";
import YbBindCard from "../../../order/components/yb-bind-card.vue";
export default {
  components: { YbBindCard },
  data() {
    return {
      drawConfig: {},
      type: 0, //0已存在支付密码    1 未设置支付密码，设置密码后进行支付
      dialogVisible: false,
      isShowBindCard: false,
      ybInfo: {},
      withdrawalAmountParam: {
        payChannel: "yb",
      },
      flag: {
        bankMessage: false,
      },
    };
  },
  computed: {},
  watch: {
    withdrawalAmountParam: {
      handler(val, oldVal) {
        if (this.serviceCharge) {
          this.realAmount = new BigNumber(val.amount)
            .times(
              100 -
                this.serviceCharge.chargeRage *
                  (this.serviceCharge.commodityName
                    ? this.serviceCharge.withdrawDiscount * 100
                    : 1)
            )
            .div(100);
        }
      },
      deep: true, //true 深度监听
    },
  },
  created() {},
  methods: {
    async init(param) {
      this.dialogVisible = true;
      this.restInput();
      this.getYbUserAccount();
      this.getConfig();
    },
    async getConfig() {
      let result = await this.$api.service.config_get({
        key: "WITHDRAW_COUNT_LIMIT_KEY",
      });
      console.log(result);
      if (result.data.code == 200) {
        this.drawConfig = result.data.data;
      } else {
        this.$message.warning(result.data.message);
      }
    },
    ybBindCardSuccess() {
      this.isShowBindCard = false;
      this.getYbUserAccount();
    },
    onChangeBank() {
      this.isShowBindCard = true;
      this.$refs.YbBindCardRef.show();
    },
    changeBank() {
      this.getYbUserAccount();
      this.$refs.YbBindCardRef.show();
    },
    async getYbUserAccount() {
      const res = await this.$api.service.payChannel_accountInfo({
        accountType: 0,
        payChannel: "yb",
      });
      if (res.data.code == 200) {
        this.ybInfo = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },

    restInput() {
      this.withdrawalAmountParam = {
        amount: "",
        type: 3,
        payPw: "",
        bankUuid: "",
        payChannel: "yb",
      };
      this.$nextTick(() => {
        if (this.$refs.payPassword) {
          this.$refs.payPassword.init();
        }
      });
    },
    async addSubmit() {
      /*     this.$emit("listen", { result: true }); */
      let password = this.$refs.payPassword
        .getLetters()
        .join("")
        .replace(/,/g, "");
      if (password.length != 6) {
        this.$message.error("请输入6位密码");
        return;
      }
      this.withdrawalAmountParam.payPw = password;
      await this.withdrawalAmount();
    },
    async withdrawalAmount() {
      const resPassword = await Encryption.getPassword(
        this.withdrawalAmountParam.payPw
      );
      if (!resPassword) {
        this.$message.warning("密码加密错误");
        return;
      }
      let result =
        await this.$api.service.withdrawalOrderYb_withdrawalOrderList({
          payPw: resPassword,
        });
      if (result.data.code == 200) {
        this.$message.success("提现成功");
        this.dialogVisible = false;
        this.$emit("listen", { result: true });
      } else {
        this.$confirm(result.data.message, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          // type: "warning",
        })
          .then(async () => {})
          .catch(() => {});
        /*        this.$message.error(result.data.message); */
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .yb-pay-body {
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 103;
}
::v-deep .yb-pay-content {
  background-color: #fff;
  max-width: 480px;
  margin-top: 20vh;
}
.service-money-wrap {
  .txt {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    display: inline-block;
    padding-right: 10px;
  }
  .line-through {
    text-decoration: line-through;
  }
  .blue-txt {
    font-size: 12px;
    font-weight: 400;
    color: #397fe7;
    letter-spacing: 1px;
  }
}
.ui-tip-wraning {
  color: #ff7a64;
  margin-bottom: 10px;
}
.page-mine-wallet-withdrawal-amount {
  .message {
    color: #123ce1;
    padding-top: 10px;
    margin-bottom: 10px;
    > span {
      display: block;
    }
  }
  .bankmessage {
    line-height: 150%;
    color: rgba($color: #ff7a64, $alpha: 1);
  }
  .paytype {
    display: flex;
    > div {
      margin-right: 20px;
      cursor: pointer;
      line-height: 40px;
      &.active {
        color: #000;
      }
    }
  }
}
.password-number {
  max-width: 200px;
}
.link-btn {
  font-size: 14px;
  font-weight: 500;
  color: #397fe7;
}
.line-wrap {
  display: flex;
  align-items: center;
  padding: 12px 0;
  .link-btn {
    margin-left: 8px;
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 540px) {
}
</style>
