<template>
  <div class="wallet-info-body">
    <div class="mode-mobile">
      <m-head class="wallet-info-head" :title="'支付管理'" />
    </div>

    <section class="ui-head-wrap">
      <div class="left">
        <div class="sum-money-title hand" @click="changeHidden">
          <span>总金额(元)</span
          ><span
            :class="{
              'ui-icon': true,
              'icon-eye-open': !hiddenMoney,
              'icon-eye-close': hiddenMoney,
            }"
          ></span>
        </div>
        <div class="sum-money">
          {{ hiddenMoney ? "***" : $common.formatMoney(totalAmount) }}
        </div>
      </div>
      <div class="right">
        <div>
          <router-link to="/mine/wallet/bill">
            <div class="ui-btn btn-detail">
              <span class="ui-icon icon-bill"></span>账单明细
            </div>
          </router-link>
        </div>
        <div class="ui-btn ui-btn-link j-pc" @click="onGoPayManage">
          支付管理帮助>
        </div>
      </div>
    </section>

    <div class="page-body">
      <section class="way-block">
        <div class="block-main">
          <div class="tip-wrap">
            <div class="ll-tip-wrap">
              <el-popover
                placement="top-start"
                title
                width="260"
                trigger="hover"
                :content="llTxt.text"
              >
                <div slot="reference">
                  <div class="ll-q-wrap">
                    <span class="ui-icon icon-q"></span>{{ llTxt.name }}
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
          <div class="content">
            <div class="way-icon-wrap ll-color">
              <div class="ui-icon icon-ll"></div>
            </div>
            <div class="title">连连钱包</div>
            <div class="line-wrap">
              <div class="key">账户余额(元）</div>
              <div class="val money">
                {{ hiddenMoney ? "***" : $common.formatMoney(llInfo.amount) }}
              </div>
            </div>
            <div class="line-wrap">
              <div class="key">结算中金额(元）</div>
              <div class="val">
                {{
                  hiddenMoney ? "***" : $common.formatMoney(llInfo.freezeAmount)
                }}
              </div>
            </div>

            <div class="ui-btn-wrap ll-btn-wrap">
              <div class="btn-block">
                <router-link to="/mine/wallet/pay_channel_bill/ll">
                  <div class="ui-btn ui-btn-border">账单</div>
                </router-link>
              </div>
              <div class="btn-block">
                <div class="ui-btn ui-btn-border" @click="goLLbag">
                  进入连连钱包
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="way-block">
        <div class="block-main">
          <div class="tip-wrap" v-if="ybAccountInfo.status == 2">
            <div class="ybao-tip-wrap">
              <span></span>
              开户中
            </div>
          </div>
          <div class="content">
            <div class="way-icon-wrap yb-color">
              <div class="ui-icon icon-yb"></div>
            </div>
            <div class="title">易宝账户</div>
            <div class="line-wrap">
              <div class="key">账户余额(元）</div>
              <div class="val money">
                {{
                  hiddenMoney ? "***" : $common.formatMoney(yibaoInfo.amount)
                }}
              </div>
            </div>
            <div class="line-wrap">
              <div class="key">结算中金额(元）</div>
              <div class="val">
                {{
                  hiddenMoney
                    ? "***"
                    : $common.formatMoney(yibaoInfo.freezeAmount)
                }}
              </div>
            </div>
            <div class="ui-btn-wrap">
              <div class="btn-block">
                <router-link to="/mine/wallet/pay_channel_bill/yibao">
                  <div class="ui-btn ui-btn-border">账单</div>
                </router-link>
              </div>
              <div class="btn-block" v-if="ybAccountInfo.status !== 2">
                <div
                  class="ui-btn ui-btn-border"
                  v-if="ybAccountInfo.status == 0"
                  @click="onDrawYbMoney"
                >
                  去开户
                </div>
                <div
                  class="ui-btn ui-btn-border"
                  v-if="ybAccountInfo.status == 1 && yibaoInfo.amount > 0"
                  @click="onDrawYbMoney"
                >
                  提现申请
                </div>
                <div
                  class="ui-btn ui-btn-border"
                  v-if="ybAccountInfo.status == 1 && !yibaoInfo.amount"
                  @click="onChangeYbCard"
                >
                  换卡
                </div>
                <!--     <div
                  class="ui-btn ui-btn-border"
                  v-if="ybAccountInfo.status == 2"
                  @click="rePostCode"
                >
                  重发验证码
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="way-block">
        <div class="block-main">
          <div class="tip-wrap"></div>
          <div class="content">
            <div class="way-icon-wrap bf-color">
              <div class="ui-icon icon-bf"></div>
            </div>

            <div class="title">宝付账户</div>
            <div class="line-wrap">
              <div class="key">账户余额(元）</div>
              <div class="val money">
                {{
                  hiddenMoney
                    ? "***"
                    : $common.formatMoney(userWalletResult.baofooAmount)
                }}
              </div>
            </div>
            <div class="line-wrap">
              <div class="key">结算中金额(元）</div>
              <div class="val">
                {{
                  hiddenMoney
                    ? "***"
                    : $common.formatMoney(userWalletResult.baofooFreezeAmount)
                }}
              </div>
            </div>
            <div class="ui-btn-wrap">
              <div class="btn-block">
                <router-link to="/mine/wallet/pay_channel_bill/baofoo">
                  <div class="ui-btn ui-btn-border">账单</div>
                </router-link>
              </div>
              <div class="btn-block" v-if="userWalletResult.baofooAmount > 0">
                <div class="ui-btn ui-btn-border" @click="baohuWithdraw">
                  提现申请
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="way-block">
        <div class="block-main">
          <div class="tip-wrap"></div>
          <div class="content">
            <div class="way-icon-wrap hy-color">
              <div class="ui-icon icon-hy"></div>
            </div>

            <div class="title">汇元账户</div>
            <div class="line-wrap">
              <div class="key">账户余额(元）</div>
              <div class="val money">
                {{ hiddenMoney ? "***" : $common.formatMoney(hyInfo.amount) }}
              </div>
            </div>
            <div class="line-wrap">
              <div class="key">结算中金额(元）</div>
              <div class="val">
                {{
                  hiddenMoney ? "***" : $common.formatMoney(hyInfo.freezeAmount)
                }}
              </div>
            </div>
            <div class="ui-btn-wrap">
              <div class="btn-block">
                <router-link to="/mine/wallet/pay_channel_bill/hy">
                  <div class="ui-btn ui-btn-border">账单</div>
                </router-link>
              </div>
              <div class="btn-block" v-if="hyInfo.amount > 0">
                <div class="ui-btn ui-btn-border" @click="onDrawMoney(1)">
                  提现申请
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="way-block">
        <div class="block-main">
          <div class="tip-wrap"></div>
          <div class="content">
            <div class="way-icon-wrap hxt-color">
              <div class="ui-icon icon-hxt"></div>
            </div>

            <div class="title">恒信通账户</div>
            <div class="line-wrap">
              <div class="key">账户余额(元）</div>
              <div class="val money">
                {{
                  hiddenMoney
                    ? "***"
                    : $common.formatMoney(userWalletResult.amount)
                }}
              </div>
            </div>
            <div class="line-wrap">
              <div class="key">结算中金额(元）</div>
              <div class="val">
                {{
                  hiddenMoney
                    ? "***"
                    : $common.formatMoney(userWalletResult.freezeAmount)
                }}
              </div>
            </div>
            <div class="ui-btn-wrap">
              <div class="btn-block">
                <router-link to="/mine/wallet/pay_channel_bill/hxt">
                  <div class="ui-btn ui-btn-border">账单</div>
                </router-link>
              </div>
              <div class="btn-block" v-if="userWalletResult.amount">
                <div class="ui-btn ui-btn-border" @click="applyWithdraw">
                  提现申请
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="mode-mobile">
      <div class="panel-list">
        <div @click="goPage('/mine/wallet/account_manage')">
          <span>结算账户管理</span>
          <span class="ui-icon icon-right"></span>
        </div>
        <div @click="goPage('/mine/wallet/bank')">
          <span>银行卡绑定</span>
          <span class="ui-icon icon-right"></span>
        </div>
        <div @click="onGoPayManage">
          <span>支付管理帮助</span>
          <span class="ui-icon icon-right"></span>
        </div>
      </div>
    </div>

    <withdrawalAmount
      ref="withdrawalAmount"
      :amount="userWalletResult.amount"
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
    <!-- 汇元提现 -->
    <hy-withdraw ref="hyWithDraw" @listen="listenWithdrawalHyAmount" />
    <yb-withdraw ref="ybWithDraw" @listen="listenWithdrawalYbAmount" />
  </div>
</template>
<script>
import withdrawalAmount from "../withdrawalAmount.vue";
import thirdAliSubmit from "../thirdAliSubmit";
import bankSubmit from "../bankSubmit";
import setPayPassword from "@/pages/v1/mine/setting/setPayPassword";

import recharge from "@/pages/v1/mine/wallet/recharge";
import nameVerified from "@/pages/v1/mine/setting/nameVerified";
import walletMessage from "@/utils/walletMessage";
import HyWithdraw from "./hy-withdraw.vue";
import YbWithdraw from "./yb-withdraw.vue";
const BigNumber = require("bignumber.js");
export default {
  components: {
    withdrawalAmount,
    thirdAliSubmit,

    bankSubmit,
    setPayPassword,
    recharge,
    nameVerified,
    HyWithdraw,
    YbWithdraw,
  },
  props: {
    ybAccountInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      llTxt: { name: "什么是连连钱包", text: "" },
      accountMessage: {
        baohu: {
          title: "宝付账户金额",
          message: `宝付账户账户是针对用户大额订单的支付通道的账户。与宝付网络科技（上海）有限公司合作，请放心支付。在您使用宝付账户账户时请知晓以下几点：<br>
1、宝付账户仅支持全额提现，宝付账户余额不支持余额购买。<br>
2、宝付账户提现手续费“1%”在交易成功时扣取，提现时将不再扣除手续费。<br>
3、大额订单不支持组合支付。`,
        },
      },
      llInfo: { amount: 0, freezeAmount: 0 },
      isShowTip: false,
      loading: true,
      loadingList: false,
      showEmpty: false,
      hiddenMoney: true,
      userWalletResult: {},

      withdrawalAmountType: 3, //1 微信  2 支付宝 3 银行卡
      userWalletListResult: null,
      /*      userAttrResult: null, */
      hyInfo: {},
      yibaoInfo: {},
    };
  },
  created() {
    // 获取钱包金额
    this.getUserWallet();
    this.getLlTxt();
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
    totalAmount() {
      return BigNumber(
        this.userWalletResult.amount ? this.userWalletResult.amount : 0
      )
        .plus(
          this.userWalletResult.baofooAmount
            ? this.userWalletResult.baofooAmount
            : 0
        )
        .plus(this.hyInfo.amount ? this.hyInfo.amount : 0)
        .plus(this.yibaoInfo.amount ? this.yibaoInfo.amount : 0)
        .plus(this.llInfo.amount);
    },
  },
  methods: {
    goLLbag() {
      if (this.$common.isMobile()) {
        window.open("/ll_bag");
        //  window.location.href = "/ll_bag";
      } else {
        window.open("/ll_bag");
      }
    },
    async getLlTxt() {
      const res = await this.$api.service.getByKey_walletLlHelp();
      console.log(res);
      if (res.data.code == 200) {
        this.llTxt = res.data.data;
      }
    },
    async getLlBalance() {
      const res = await this.$api.service.ll_balance_get();

      if (res.data.code == 200) {
        if (res.data.data.success) {
          const accountInfo = res.data.data;
          this.llInfo = {
            amount:
              accountInfo.totalBalaval ||
              accountInfo.totalBalcur ||
              accountInfo.totalBalfrz,
            freezeAmount:
              accountInfo.waitBalaval ||
              accountInfo.waitBalcur ||
              accountInfo.waitBalfrz,
          };
        }
      }
    },
    onChangeYbCard() {
      this.$refs.ybWithDraw.changeBank();
    },
    async rePostCode() {
      const res = await this.$api.service.payChannel_requestYbRepeat();
      if (res.data.code == 200) {
        if (res.data.data.openAccountStatus == "FAIL") {
          this.$confirm(res.data.data.openAccountFailReason, "失败", {
            confirmButtonText: "我知道了",
            showCancelButton: false,
          })
            .then(async () => {
              this.$parent.getUserYBInfo();
            })
            .catch(() => {});
        } else if (res.data.data.openAccountStatus == "SUCCESS") {
          this.$message.success("开户成功!");
          this.$parent.getUserYBInfo();
        } else if (res.data.data.openAccountStatus == "REPEAT_SEND_MSG") {
          this.$message.warning("已重发验证短信");
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    showYbDrawal() {
      // this.$refs.ybWithDraw.init();
    },
    onDrawYbMoney() {
      //获取易宝用户状态
      this.$parent.checkUserYBInfo();
    },
    async onGoPayManage() {
      const res = await this.$api.service.news_list({
        location: "pay_manage_help",
        pageCount: 1,
        pageSize: 20,
      });

      if (res.data.code == 200 && res.data.data.records) {
        if (res.data.data.records.length <= 0) {
          this.$message.warning("暂没数据");
          return;
        }
        if (this.$common.isMobile()) {
          window.location.href = `/news/${res.data.data.records[0].uuid}`;
        } else {
          window.open(`/news/${res.data.data.records[0].uuid}`);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    onImproveData(accountType) {
      //完善资料
      switch (accountType) {
        case "c":
          //需要完善资料
          this.$parent.changePage(7);
          break;
      }
    },
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
    onDrawMoney() {
      //申请提现
      if (this.hyInfo.amount > 0) {
        this.$refs.hyWithDraw.init();
      } else {
        this.$message.warning("无可用余额");
      }
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
        //恒信通提现弹窗
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
    listenWithdrawalHyAmount(result) {
      if (result.result) {
        this.getUserWallet();
        this.getUserWalletList();
      }
    },
    listenWithdrawalYbAmount() {
      /*       this.getUserWallet();
      this.getUserWalletList(); */
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
      this.getUserHyWallet();
      this.getLlBalance();
      this.loading = false;
    },
    // 获取汇元账户信息
    async getUserHyWallet() {
      let result = await this.$api.service.notecase_query({
        // payChannel: "hy",
      });
      if (result.data.code == 200) {
        this.hyInfo = result.data.data.hy ? result.data.data.hy : {};
        this.yibaoInfo = result.data.data.yb ? result.data.data.yb : {};
      }
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
.icon-bill {
  background-image: url("//static.theone.art/pc/mine/icon-bill.png");
}
.wallet-info-body {
  min-width: 1030px;
}
.icon-bf {
  background-image: url("//static.theone.art/pc/mine/icon-bf.png");
}
.icon-hxt {
  background-image: url("//static.theone.art/pc/mine/icon-hxt.png");
}
.icon-hy {
  background-image: url("//static.theone.art/pc/mine/icon-hy.png");
}
.icon-yb {
  background-image: url("//static.theone.art/pc/mine/icon-yb.png");
}
.icon-ll {
  background-image: url("//static.theone.art/pc/ll-bag/icon-ll.png");
}
.icon-eye-close {
  background-image: url("//static.theone.art/pc/mine/icon-eye-open.png");
}
.icon-eye-open {
  background-image: url("//static.theone.art/pc/icons/icon-eye-open.png");
}

.yb-color {
  background: rgba(30, 120, 66, 0.07);
}
.bf-color {
  background: rgba(28, 117, 181, 0.1);
}
.hxt-color {
  background: rgba(255, 174, 67, 0.1);
}
.hy-color {
  background: rgba(67, 121, 255, 0.1);
}
.ll-color {
  background: rgba(14, 89, 240, 0.07);
}
.icon-q {
  background-image: url("//static.theone.art/pc/ll-bag/icon-q.png");
  width: 22px;
  height: 22px;
}
.ll-q-wrap {
  display: flex;
  align-items: center;
}
.page-body {
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
  padding: 24px 0;
}
.ui-btn-border {
  line-height: 30px;
  border-radius: 100px;
  border: 1px solid rgba(230, 31, 26, 1);
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  color: #e61f1a;
  width: 100%;
  width: 130px;
  margin: 0 auto;
}
.ui-btn-wrap {
  display: flex;
  justify-content: center;
  padding: 23px 30px 0;
  .btn-block {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
.ll-btn-wrap {
}
.ui-head-wrap {
  display: flex;
  justify-content: space-between;
  background: linear-gradient(149deg, #ff7a64 0%, #e61f1a 100%);
  box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.1);
  border-radius: 4px;
  padding: 16px 20px;
  color: #fff;
  overflow: hidden;
  .sum-money {
    font-size: 24px;
    font-weight: 500;
    color: #ffffff;
  }
  .sum-money-title {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .btn-detail {
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    border: 1px solid #ffffff;
    text-align: center;
    padding: 0 10px;
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    .icon-bill {
      width: 23px;
      height: 23px;
      position: relative;
      top: -1px;
    }
  }
  .ui-btn-link {
    padding: 0;
    text-decoration: underline;
    font-size: 12px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    border-radius: 0;
    padding: 0.62rem 0.32rem 100px;
    .right {
      display: flex;
      align-items: center;
      .btn-detail {
        position: relative;
        right: -20px;
        border: none;
        border-radius: 100px 0 0 100px;
      }
    }
  }
}
.way-block {
  width: 33.3%;
  padding: 10px;
  .block-main {
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    position: relative;
    top: 0;
    left: 0;
    padding: 42px 0;

    .content {
      .way-icon-wrap {
        width: 48px;
        height: 48px;

        padding: 12px;
        border-radius: 100px;
        margin: 15px auto;
      }
      .ui-icon {
        width: 100%;
        height: 100%;
      }
    }
    .tip-wrap {
      position: absolute;
      top: 15px;
      right: 25px;
      font-size: 12px;
      font-weight: 400;
      color: #397fe7;
      .ybao-tip-wrap {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        span {
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: #397fe7;
          margin-right: 6px;
          border-radius: 100px;
        }
      }
    }
    .title {
      font-size: 16px;
      font-weight: 800;
      color: #333333;
      text-align: center;
      margin-bottom: 13px;
    }
    .line-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 50px;
      .key {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
      }
      .val {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
      }
      .money {
        font-size: 18px;
        font-weight: 800;
        color: #333333;
      }
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 100%;
    padding: 0.16rem 0.32rem;
    .block-main {
      .line-wrap {
        .key {
          font-size: 0.26rem;
          font-weight: 400;
          color: #666666;
        }
        .val {
          font-size: 0.26rem;
          font-weight: 400;
          color: #666666;
        }
        .money {
        }
      }
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .wallet-info-head {
  }
  .page-body {
    margin: -2.2rem 0 0;
  }
  .wallet-info-body {
    min-width: inherit;
    padding-bottom: 1.8rem;
  }
  .tip-message {
    padding: 0.15rem;
  }
  .j-pc {
    display: none;
  }
  .j-phone {
    display: block;
  }
  .panel-list {
    padding: 0 0.32rem;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(151, 151, 151, 0.1);
      font-size: 0.26rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      padding: 0.1rem 0;
      .icon-right {
        width: 0.48rem;
        height: 0.48rem;
        background-image: url("//static.theone.art/pc/mine/icon-right.png");
      }
    }
  }
}
</style>
