<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-wallet-withdrawal-amount"
    :visible.sync="dialogVisible"
    append-to-body
    width="400px"
    title="提现"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <h1>提现位置</h1>
        <div class="input-line">
          <div class="paytype">
            <!--      <div
              v-if="withdrawalAmountParam.type == 2"
              :class="{ active: withdrawalAmountParam.type == 2 }"
            >
              支付宝
            </div> -->
            <div>
              <p>银行卡</p>
              <el-select
                v-model="withdrawalAmountParam.bankUuid"
                placeholder="请选择银行卡"
                @change="onChooseBank"
              >
                <el-option
                  v-for="option in bankCards"
                  :key="option.uuid"
                  :label="option.bankAccont"
                  :value="option.uuid"
                ></el-option>
              </el-select>
              <p class="bankmessage" v-if="flag.bankMessage">
                为了能缩短您的提现到账时间，请补充完整的银行卡信息。请在银行卡绑定功能中更新开户行信息。
              </p>
            </div>

            <!--   1、微信 2、支付宝 3、银行卡 -->
          </div>
        </div>
        <h1>提现金额</h1>
        <div class="input-line">
          <el-input
            v-model="withdrawalAmountParam.amount"
            maxlength="8"
          ></el-input>
          <div class="message" v-if="getChargeRateResult">
            <!--        <span v-if="withdrawalAmountParam.type == 1"
              >提现手续费{{ getChargeRateResult.wechatRate }}%</span
            >
            <span v-else>提现手续费{{ getChargeRateResult.alipayRate }}%</span> -->

            <div v-if="false">
              <div class="service-money-wrap">
                <span
                  class="txt"
                  :class="{ 'line-through': serviceCharge.commodityName }"
                  >提现手续费{{ serviceCharge.chargeRage }}%</span
                >
                <span class="blue-txt" v-if="serviceCharge.commodityName"
                  >[{{ serviceCharge.commodityName }}] 提现手续费{{
                    relChargeRage
                  }}%</span
                >
              </div>

              <span v-if="!isNaN(realAmount) && realAmount"
                >预计此次提现实际可得{{
                  $common.formatMoney(realAmount)
                }}元</span
              >
              <span v-else></span>
            </div>
          </div>
          <div class="ui-tip-wraning">
            每天可提现{{ drawConfig.confValue4 }}次，单日提现限额{{
              $common.formatMoney(drawConfig.confValue5 / 100)
            }}元；若提现金额低于{{
              $common.formatMoney(drawConfig.confValue1 / 100)
            }}元，{{ drawConfig.confValue2 }}天内限提现{{
              drawConfig.confValue3
            }}次。
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
            <div
              class="v1-btn mycenter"
              :class="{ red: drawConfig.confValue4 > 0 }"
              @click="addSubmit()"
            >
              确定
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
const BigNumber = require("bignumber.js");
import Encryption from "@/utils/encryption";
export default {
  data() {
    return {
      type: 0, //0已存在支付密码    1 未设置支付密码，设置密码后进行支付
      dialogVisible: false,
      withdrawalAmountParam: {
        amount: "",
        type: 3,
        payPw: "",
        bankUuid: "",
        payChannel: "hy",
      },
      flag: {
        bankMessage: false,
      },
      getChargeRateResult: null,
      getConfigResult: null,
      realAmount: 0,
      withdrawalNumResult: 0,
      bankCards: [], //用户绑定的银行卡
      drawConfig: {},
      serviceCharge: {},
    };
  },
  computed: {
    relChargeRage() {
      if (this.serviceCharge.commodityName) {
        const discount = new BigNumber(
          this.serviceCharge.withdrawDiscount
        ).multipliedBy(100);
        return new BigNumber(this.serviceCharge.chargeRage).multipliedBy(
          discount
        );
      }
      return "";
    },
  },
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

          /*       if (val.type == 1) {
          } else if (val.type == 2) {
            this.realAmount = new BigNumber(val.amount)
              .times(100 - this.serviceCharge.alipayRate)
              .div(100);
          } else {
            this.realAmount = new BigNumber(val.amount)
              .times(100 - this.serviceCharge.alipayRate)
              .div(100);
          } */
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
      if (param) {
        this.type = param.type;
        this.withdrawalAmountParam.payPw = param.password;
      }
      this.getChargeRate();
      this.withdrawalNum();
      this.getBanks();
      this.getConfig();
      this.getServiceCharge();
    },
    async getServiceCharge() {
      let result = await this.$api.service.withdrawalOrder_getChargeRate({
        type: this.withdrawalAmountParam.type,
      });
      if (result.data.code == 200) {
        this.serviceCharge = result.data.data;
      } else {
        this.$message.warning(result.data.message);
      }
    },
    restInput() {
      this.withdrawalAmountParam = {
        amount: "",
        type: 3,
        payPw: "",
        bankUuid: "",
        payChannel: "hy",
      };
      this.$nextTick(() => {
        if (this.$refs.payPassword) {
          this.$refs.payPassword.init();
        }
      });
    },
    async getConfig() {
      let result = await this.$api.service.config_get({
        key: "WITHDRAW_MIN",
      });
      console.log(result);
      if (result.data.code == 200) {
        this.drawConfig = result.data.data;
      } else {
        this.$message.warning(result.data.message);
      }
    },

    onChooseBank(uuid) {
      let bank = this.bankCards.find((item) => item.uuid == uuid);
      if (!bank.bankDetailName || !bank.bankShortName) {
        this.flag.bankMessage = true;
        this.$message.warning(
          "为了能缩短您的提现到账时间，请补充完整的银行卡信息。请在银行卡绑定功能中更新开户行信息。"
        );
      } else {
        this.flag.bankMessage = false;
      }
    },
    async getBanks() {
      const result = await this.$api.service.userbank_findBankAccount();
      // console.log(result);
      if (result && result.data.code == 200 && result.data.data.length > 0) {
        this.bankCards = result.data.data;
        let detaultBank = result.data.data.find(
          (item) => item.statusDefault == 1
        );
        if (detaultBank) {
          this.withdrawalAmountParam.bankUuid = detaultBank.uuid;
        } else {
          detaultBank = this.bankCards[0];
          this.withdrawalAmountParam.bankUuid = this.bankCards[0].uuid;
        }
        if (!detaultBank.bankDetailName || !detaultBank.bankShortName) {
          this.flag.bankMessage = true;
          this.$message.warning(
            "为了能缩短您的提现到账时间，请补充完整的银行卡信息。请在银行卡绑定功能中更新开户行信息。"
          );
        } else {
          this.flag.bankMessage = false;
        }
        // console.log(this.bank_card);
      }
    },

    changePayType(val) {
      this.withdrawalAmountParam.type = val;
    },
    async addSubmit() {
      if (
        !this.drawConfig.confValue4 ||
        Number(this.drawConfig.confValue4) <= 0
      ) {
        this.$message.warning("超出每天提现次数");
        return;
      }

      let password = this.$refs.payPassword
        .getLetters()
        .join("")
        .replace(/,/g, "");
      if (password.length != 6) {
        this.$message.error("请输入6位密码");
        return;
      }
      this.withdrawalAmountParam.payPw = password;

      let number = /^[0-9]+.?[0-9]*$/;
      if (
        !/^\d+(.\d+)?$/.test(
          `${this.withdrawalAmountParam.amount}`.replace(/,/g, "")
        )
      ) {
        this.$message.error("请输入正确的价格");
        return;
      }
      if (
        new BigNumber(this.withdrawalAmountParam.amount).comparedTo(
          new BigNumber(this.withdrawalNumResult.value1).div(100)
        ) < 0
      ) {
        if (this.withdrawalNumResult.num == 0) {
          this.$message.error(
            ` 您的提现金额过低，金额低于${this.$common.formatMoney(
              this.withdrawalNumResult.value1 / 100
            )}的提现操作，每${this.withdrawalNumResult.value2}天可提现${
              this.withdrawalNumResult.value3
            }次，很抱歉，您已经没有机会了。`
          );
        } else {
          this.$confirm(
            ` 您的提现金额过低，金额低于${this.$common.formatMoney(
              this.withdrawalNumResult.value1 / 100
            )}的提现操作，每${this.withdrawalNumResult.value2}天可提现${
              this.withdrawalNumResult.value3
            }次，您还有${this.withdrawalNumResult.num}次机会，是否提现。`,
            "",
            {
              confirmButtonText: "立即提现",
              cancelButtonText: "暂不提现",
            }
          )
            .then(async () => {
              this.withdrawalAmount();
            })
            .catch(() => {});
        }
      } else {
        this.withdrawalAmount();
      }
    },
    async withdrawalAmount() {
      const resPassword = await Encryption.getPassword(
        this.withdrawalAmountParam.payPw
      );
      if (!resPassword) {
        this.$message.warning("密码加密错误");
        return;
      }
      let result = await this.$api.service.userWallet_withdrawal({
        ...this.withdrawalAmountParam,
        payPw: resPassword,
        payChannel: "hy",
      });
      if (result.data.code == 200) {
        this.$message.success("操作成功");
        this.dialogVisible = false;
        this.$emit("listen", { result: true });
      } else {
        this.$message.error(result.data.message);
      }
    },
    async getChargeRate() {
      let result = await this.$api.service.userWallet_getChargeRate({
        type: 1,
      });
      this.getChargeRateResult = result.data.data;
    },
    async withdrawalNum() {
      let result = await this.$api.service.userWallet_withdrawalNum({
        payChannel: "hy",
      });
      this.withdrawalNumResult = result.data.data;
      // console.log(`withdrawalNumResult`, this.withdrawalNumResult, result.data);
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>

<style lang="scss" scoped>
@media screen and (max-width: 540px) {
}
</style>
