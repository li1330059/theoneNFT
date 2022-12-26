<template>
  <div>
    <div class="mode-mobile">
      <m-header :title="'支付管理'" />
    </div>

    <div class="page-mine-wallet-index">
      <el-skeleton :loading="loading" :animated="true" :throttle="500">
        <template slot="template">
          <div class="wallet-panel">
            <div class="wallet-main">
              <div class="top">
                <div>
                  <p>总金额（元）</p>
                  <el-skeleton-item variant="h1" />
                </div>
              </div>
              <div class="money-panel">
                <div>
                  <p>可用金额（元）</p>
                  <el-skeleton-item variant="h1" />
                  <el-skeleton-item variant="button" />
                </div>
                <div>
                  <p>冻结金额（元）</p>
                  <el-skeleton-item variant="h1" />
                </div>
                <div>
                  <p>累计收益（元）</p>
                  <el-skeleton-item variant="h1" />
                </div>
              </div>
            </div>
            <div class="wallet-info">
              <div class="mode-PC">
                <div class="btns">
                  <div
                    :class="{ 'v1-btn-eye': true, hidden: hiddenMoney }"
                    @click="changeHidden"
                  ></div>
                </div>
              </div>
              <div class="money-panel">
                <div>
                  <p>待结算金额（元）</p>
                  <el-skeleton-item variant="h1" />
                </div>
                <div>
                  <p>累计销售（元）</p>
                  <el-skeleton-item variant="h1" />
                </div>
                <div>
                  <p>累计充值（元）</p>
                  <el-skeleton-item variant="h1" />
                </div>
                <div>
                  <p>累计提现（元）</p>
                  <el-skeleton-item variant="h1" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template>
          <div class="wallet-panel" v-if="userWalletResult">
            <div class="wallet-main">
              <div class="top">
                <div class="top-left">
                  <div>
                    <p>总金额（元）</p>
                    <h1>
                      {{
                        hiddenMoney
                          ? "***"
                          : $common.formatMoney(userWalletResult.amount+userWalletResult.baofooAmount)
                      }}
                    </h1>
                  </div>
            
                  <div class="mode-mobile">
                    <div class="btns eye-wrap">
                      <div
                        :class="{ 'v1-btn-eye': true, hidden: hiddenMoney }"
                        @click="changeHidden"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="mode-mobile" @click="goBill">账单</div>
              </div>
              <div class="money-panel">
                <div>
                  <p>恒信通账户余额(元)</p>
                  <h1>
                    {{
                      hiddenMoney
                        ? "***"
                        : $common.formatMoney(userWalletResult.amount)
                    }}
                  </h1>
                  <div class="v1-btn-link blue mode-PC" @click="applyWithdraw">
                    恒信通账户提现
                  </div>
                </div>
                <!-- <div>
                  <p>冻结金额（元）</p>
                  <h1>
                    {{
                      hiddenMoney
                        ? "***"
                        : $common.formatMoney(userWalletResult.freezeAmount)
                    }}
                  </h1>
                </div> -->
                <div v-if="isBigPay">
                  <p  class="baohu-txt">
                    宝付账户余额（元）<!-- <span class="icon icon-q" /> -->
                  </p>
                  <h1>
                    {{
                      hiddenMoney
                        ? "***"
                        : $common.formatMoney(userWalletResult.baofooAmount)
                    }}
                  </h1>
                  <div
                    class="v1-btn-link blue mode-PC"
                    v-if="userWalletResult.baofooAmount > 0"
                    @click="baohuWithdraw"
                  >
                    宝付账户提现
                  </div>
                </div>
              </div>
            </div>
            <div class="wallet-info">
              <div class="mode-PC">
                <div class="btns">
                  <div
                    :class="{ 'v1-btn-eye': true, hidden: hiddenMoney }"
                    @click="changeHidden"
                  ></div>
                </div>
              </div>
              <div class="money-panel">
                <div>
                  <p>恒信通账户提现待审核金额(元)</p>
                  <h1>
                    {{
                      hiddenMoney
                        ? "***"
                        : $common.formatMoney(userWalletResult.freezeAmount)
                    }}
                  </h1>
                </div>
                <div>
                  <p>宝付账户提现待审核金额(元)</p>
                  <h1>
                    {{
                      hiddenMoney
                        ? "***"
                        : $common.formatMoney(userWalletResult.baofooFreezeAmount)
                    }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>

      <div class="mode-mobile">
        <div class="panel-list">
          <div @click="goPage('/mine/wallet/third')">第三方支付</div>
          <div @click="goPage('/mine/wallet/bank')">银行卡绑定</div>
        </div>

        <div class="btn-list">
          <div @click="applyWithdraw" class="red">恒信通账户提现</div>
        <div
            v-if="
              userWalletResult && userWalletResult.baofooAmount > 0 && isBigPay
            "
            @click="onBHApplyWithdraw"
            class="red"
          >
            宝付账户提现
          </div> 
          <!--      <div class="red" @click="onRecharge">充值</div> -->
        </div>
      </div>

      <withdrawalAmount
        ref="withdrawalAmount"
        @listen="listenWithdrawalAmount"
      ></withdrawalAmount>
      <bankSubmit
        v-if="userAttrResult"
        ref="bankSubmit"
        :userInfo="userAttrResult"
        @listen="listenBankSubmit"
      ></bankSubmit>
      <!-- 设置支付密码 -->
      <setPayPassword
        ref="setPayPassword"
        @listen="listenSetPayPassword"
      ></setPayPassword>
      <!-- 充值 -->
      <recharge ref="recharge" @listen="listenRecharge"></recharge>
      <!-- 实名认证 -->
      <nameVerified
        ref="nameVerified"
        @listen="listenNameVerified"
      ></nameVerified>
      <!-- 设置支付宝 -->
      <thirdAliSubmit
        ref="thirdAliSubmit"
        @listen="listenthirdAliSubmit"
      ></thirdAliSubmit>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import withdrawalAmount from "../withdrawalAmount.vue";
import thirdAliSubmit from "../thirdAliSubmit";
import bankSubmit from "../bankSubmit";
import mHeader from "@/components/v1/layout/mobileHeader";
import setPayPassword from "@/pages/v1/mine/setting/setPayPassword";

import recharge from "@/pages/v1/mine/wallet/recharge";
import nameVerified from "@/pages/v1/mine/setting/nameVerified";
import walletMessage from "@/utils/walletMessage";

export default {
  components: {
    withdrawalAmount,
    thirdAliSubmit,
    mHeader,
    bankSubmit,
    setPayPassword,
    recharge,
    nameVerified,
  },
  data() {
    return {
      accountMessage: {
        baohu: {
          title: "宝付账户金额",
          message: `宝付账户账户是针对用户大额订单的支付通道的账户。与宝付网络科技（上海）有限公司合作，请放心支付。在您使用宝付账户账户时请知晓以下几点：<br>
1、宝付账户仅支持全额提现，宝付账户余额不支持余额购买。<br>
2、宝付账户提现手续费“1%”在交易成功时扣取，提现时将不再扣除手续费。<br>
3、大额订单不支持组合支付。`,
        },
      },
      isShowTip: false,
      loading: true,
      loadingList: false,
      showEmpty: false,
      hiddenMoney: true,
      userWalletResult: null,

      withdrawalAmountType: 3, //1 微信  2 支付宝 3 银行卡
      userWalletListResult: null,
      /*      userAttrResult: null, */
    };
  },
  created() {
    // 获取钱包金额
    this.getUserWallet();
    // 获取账单
    // this.getUserWalletList();
    // 获取用户属性
    // this.getUserAttr();
  },
  computed: {
    userAttrResult() {
      return this.$store.state.user_info;
    },
    isBigPay() {
      return this.$store.state.isBigPay;
    },
  },
  methods: {
    onBHApplyWithdraw() {
      this.$parent.checkUserBHInfo();
    },
    baohuWithdraw() {
      this.$parent.checkUserBHInfo();
    },
    goBill() {
      this.$router.push("/mine/wallet/bill_m");
    },

    recharge() {},
    goPage(url) {
      this.$router.push({ path: url });
    },
    // 申请提现
    applyWithdraw() {
      console.log(
        `提现操作`,
        this.userAttrResult,
        this.userAttrResult.alipayAccount
      );
      if (this.withdrawalAmountType == 2) {
        //支付宝
        if (!this.userAttrResult.alipayAccount) {
          this.$refs.thirdAliSubmit.init(this.userAttrResult);
        } else {
          this.inputPayPassword();
        }
      } else if (this.withdrawalAmountType == 3) {
        //银行卡
        if (this.userAttrResult.statusBankVerified != 1) {
          this.$refs.bankSubmit.init();
        } else {
          this.inputPayPassword();
        }
      }
    },
    // 输入支付密码
    inputPayPassword() {
      if (this.userAttrResult.isPayPwd == 1) {
        this.$refs.withdrawalAmount.init();
      } else {
        this.$refs.setPayPassword.init();
      }
    },
    //设置支付密码
    async listenSetPayPassword(result) {
      if (result.result) {
        this.payPassword = result.result;
        console.log(`支付密码`, this.payPassword);
        this.$store.commit("setUserInfo", { isPayPwd: 1 });
        this.$refs.withdrawalAmount.init({
          type: 1,
          password: this.payPassword,
        });
      }
    },
    listenBankSubmit(result) {
      if (result.result) {
        this.$store.commit("setUserInfo", { statusBankVerified: 1 });
        this.inputPayPassword();
      }
    },
    listenthirdAliSubmit(result) {
      if (result.result) {
        this.inputPayPassword();
      }
    },
    listenWithdrawalAmount(result) {
      if (result.result) {
        this.getUserWallet();
        this.getUserWalletList();
      }
    },
    // 金钱显示隐藏
    changeHidden() {
      this.hiddenMoney = !this.hiddenMoney;
    },
    // 获取账户信息
    async getUserWallet() {
      this.loading = true;
      let result = await this.$api.service.userWallet_get();
      this.userWalletResult = result.data.data;
      this.loading = false;
    },
    // 获取用户属性
    async getUserAttr() {
      let result = await this.$api.service.userattribute_queryByUserUuid();

      this.userAttrResult = result.data.data;
    },
    // 更新账单记录
    async getUserWalletList() {
      this.$parent.getUserWalletList();
    },

    // 充值
    onRecharge() {
      // 判断是否已经实名认证
      if (this.userAttrResult.statusVerified != 1) {
        this.$refs.nameVerified.init();
      } else {
        this.$refs.recharge.init();
      }
    },
    listenRecharge() {},
    listenNameVerified(result) {
      if (result.result) {
        console.log(`认证通过`);
        this.$refs.recharge.init();
      }
    },
    baohuDes() {
      this.$confirm(
        `宝付账户账户是针对用户大额订单的支付通道的账户。与宝付网络科技（上海）有限公司合作，请放心支付。在您使用宝付账户账户时请知晓以下几点：<br>
1、宝付账户仅支持全额提现，宝付账户余额不支持余额购买。<br>
2、宝付账户提现手续费“1%”在交易成功时扣取，提现时将不再扣除手续费。<br>
3、大额订单不支持组合支付。`,
        "宝付账户金额",
        {
          confirmButtonText: "我知道了",
          showCancelButton: false,
          dangerouslyUseHTMLString: true,
        }
      )
        .then(async () => {})
        .catch(() => {});
    },
    showAccountMessage(type) {
      this.$confirm(
       this.accountMessage[type].message,
       this.accountMessage[type].title,
        {
          confirmButtonText: "我知道了",
          showCancelButton: false,
          dangerouslyUseHTMLString: true,
        }
      )
        .then(async () => {})
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.page-mine-wallet-index {
  .loading {
    height: 500px;
  }

  .money-panel {
    display: flex;
    justify-content: space-around;
    align-items: center;
    > div {
      h1 {
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 6px;
      }
      p {
        font-size: 14px;
      }
    }
  }

  .wallet-panel {
    display: flex;
    margin-bottom: 40px;
    .wallet-main {
      width: 420px;
      height: 176px;
      background: linear-gradient(204deg, #303a63 0%, #0f1722 100%);
      box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.1);
      border-radius: 4px;
      color: #ffffff;
      padding: 16px 32px 0;
      .top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .top-left {
          display: flex;
          flex: 1;
          justify-content: space-between;
        }
        p {
          color: rgba($color: #fff, $alpha: 0.4);
          margin-bottom: 4px;
        }
        h1 {
          font-size: 24px;
        }
        .v1-btn {
          border: 1px solid #ffffff;
          color: #ffffff;
          background: transparent;
        }
      }
      .money-panel {
        border-top: 1px solid rgba($color: #fff, $alpha: 0.1);
        padding-top: 12px;
        justify-content: space-between;
        align-items: flex-start;
        > div {
          p {
            color: rgba($color: #fff, $alpha: 0.4);
          }
        }
      }
    }
    .wallet-info {
      flex: 1;
      .btns {
        height: 27px;
        display: flex;
        justify-content: flex-end;
      }
      .money-panel {
        height: 149px;
        background: #ffffff;
        box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.3);
        border-radius: 4px;
        > div {
          h1 {
            color: #000000;
          }
          p {
            color: rgba($color: #000000, $alpha: 0.4);
          }
        }
      }
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mine-wallet-index {
    padding-top: 1.42rem;
    .loading {
      height: 8rem;
    }

    .wallet-panel {
      flex-direction: column;
      margin-bottom: 0.32rem;
      .wallet-main {
        margin: 0 0.32rem 0.32rem;
        width: auto;
        height: 3.52rem;
        padding: 0.32rem;
        background: linear-gradient(204deg, #303a63 0%, #0f1722 100%);
        box-shadow: 0 0.04rem 0.32rem 0 rgba(180, 180, 180, 0.1);
        border-radius: 0.08rem;
        z-index: 99;
        .top {
          margin-bottom: 0.4rem;
          .top-left {
            display: flex;
            flex: 1;
            justify-content: flex-start;
          }
          p {
            font-size: 0.24rem;
            font-weight: 400;
            color: #ffffff;
            margin-bottom: 0.12rem;
          }
          h1 {
            font-size: 0.36rem;
            font-weight: 800;
            color: #ffffff;
          }
        }
        .money-panel {
          padding-top: 0.48rem;
          > div {
            p {
              font-size: 0.2rem;
              font-weight: 400;
              margin-bottom: 0.12rem;
            }
            h1 {
              font-size: 0.28rem;
              font-weight: 800;
              color: #ffffff;
            }
          }
        }
      }
      .wallet-info {
        .money-panel {
          width: 100%;
          height: 3.84rem;
          background: #ffffff;
          box-shadow: 0 0.04rem 0.12rem 0 rgba(229, 229, 229, 0.5);
          border-radius: 0.08rem;
          align-items: flex-end;
          margin-top: -1.92rem;
          padding: 0 0.32rem;
          padding-bottom: 0.64rem;
          z-index: 9;

          > div {
            p {
              font-size: 0.2rem;
              font-weight: 400;
              color: rgba($color: #000000, $alpha: 0.4);
              margin-bottom: 0.12rem;
            }
            h1 {
              font-size: 0.24rem;
              font-weight: 800;
              color: #000000;
            }
          }
        }
      }
    }

    .panel-list {
      width: 100%;
      height: 2.04rem;
      background: #ffffff;
      font-size: 0.28rem;
      font-weight: 500;
      color: #000000;
      display: flex;
      flex-direction: column;

      div {
        padding: 0 0.32rem;
        line-height: 1.02rem;
        &:nth-child(1) {
          border-bottom: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
        }
      }
    }

    .btn-list {
      padding: 0 0.32rem 2rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 1rem;
      div {
        height: 0.72rem;
        line-height: 0.72rem;
        flex: 1;
        background: #e5e5e5;
        border-radius: 0.36rem;
        font-size: 0.28rem;
        font-weight: 500;
        color: #000000;
        text-align: center;
        &:nth-child(1) {
          margin-right: 0.16rem;
        }
        &:nth-child(2) {
          margin-left: 0.16rem;
        }

        &.red {
          background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
          color: #fff;
        }
      }
    }
  }
  .v1-btn-eye {
    background: url("//static.theone.art/pc/images/wallet-eye-white.png")
      no-repeat center center;
    background-size: contain;
    &.hidden {
      background: url("//static.theone.art/pc/images/wallet-eye-hidden-white.png")
        no-repeat center center;
      background-size: contain;
    }
  }
}
.baohu-txt {
  cursor: pointer;
  span {
    display: inline-block;
  }
  .icon-q {
    background-image: url("//static.theone.art/pc/icons/icon-question.png");
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    position: relative;
    top: 2px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    .icon-q {
      width: 0.26rem;
      height: 0.26rem;
      position: relative;
      top: 0.02rem;
    }
  }
}
</style>
