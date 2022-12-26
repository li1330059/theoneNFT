<template>
  <div>
    <div class="mode-mobile">
      <m-header :title="'上传身份证'" />
    </div>
    <div v-show="pages[currentPage].key == 1">
      <wallet-info
        ref="userWalletRef"
        :ybAccountInfo="ybAccountInfo"
      ></wallet-info>

    </div>
    <div v-if="pages[currentPage].key == 2">
      <!-- 宝户上传身份证 -->
      <up-user-card
        @listenUpCardSuccess="listenUpCardSuccess"
        title="为保证您的资金安全请先按照宝付账户要求进行身份证资料补充。"
      ></up-user-card>
    </div>

    <!-- 绑定银行卡 -->
    <bank-card
      v-show="pages[currentPage].key == 3"
      :userBankCards="userBankCards"
      :submit="checkUserBHInfo"
      :userSelectedBankCardIdx="userSelectedBankCardIdx"
      :tip="`请绑定银行卡完成提现`"
    ></bank-card>
    <!-- 银行卡选择 -->
    <sku-select-bankcard
      v-show="pages[currentPage].key == 4"
      :userBankCards="userBankCards"
      :userSelectedBankCardIdx="userSelectedBankCardIdx"
      :cancel="goBank"
      :sure="bankHandle"
    ></sku-select-bankcard>

    <!--  易宝完善资料 -->
    <yb-idcard-data v-if="pages[currentPage].key == 7" :idCard="ybCardInfo" />
    <div v-if="pages[currentPage].key == 5">
      <!-- 易宝支付上传身份证 -->
      <up-user-card @listenUpCardSuccess="listenUpCardYibao"></up-user-card>
    </div>
    <!-- 易宝用户绑卡 -->
    <yibao-bind-card
      v-if="pages[currentPage].key == 6"
      :userBankCards="userBankCards"
      :submit="checkUserBHInfo"
      :userSelectedBankCardIdx="userSelectedBankCardIdx"
      :tip="`请绑定银行卡完成提现`"
    ></yibao-bind-card>
    <!-- 易宝提现申请 -->
    <yb-withdrawal
      ref="ybWithdrawal"
      @listen="yibaoDrawalSuccess"
    ></yb-withdrawal>

    <!-- 支付密码验证 -->
    <!-- <verified-pay-pw ref="verifiedPayPw" />  -->

    <!-- 宝户提现 -->
    <baohu-withdrawal
      ref="BHWithdrawalRef"
      :bh-info="BHInfo"
    ></baohu-withdrawal>
    <!-- 提醒 -->
    <el-dialog
      title="提现申请"
      :visible.sync="isShowDrawApplyTip"
      :before-close="() => (isShowDrawApplyTip = false)"
    >
      <div class="m-success-wrap">
        <img
          class="icon-success"
          src="//static.theone.art/pc/icons/icon-treasure-success.png"
        />
        <div class="txt ui-title">提现申请成功</div>
        <div class="txt" style="margin-bottom: 16px">
          恭喜您宝付账户余额提现申请成功<br />
          财务审核通过后您可在【账单】-【宝付账户提现列表】-点击【提款】，请及时关注审核结果
        </div>
        <div class="btn-group btn-center">
          <div class="btn btn-red" @click="isShowDrawApplyTip = false">
            我知道了
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="验证成功"
      :visible.sync="isShowSetPassword"
      width="460px"
      :before-close="() => (isShowSetPassword = false)"
    >
      <div class="m-success-wrap text-left">
        <div class="txt">
          就差一步就验证完成啦，此支付密码是您在宝付账户专项提现时使用，请牢记。
        </div>
        <div class="btn-group btn-right">
          <div class="btn btn-red" @click="onSetPassword">
            去宝付账户设置支付密码
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 设置支付密码 -->
    <setPayPassword
      ref="setPayPassword"
      @listen="listenSetPayPassword"
    ></setPayPassword>
    <bankSubmit
      v-if="userInfo"
      ref="bankSubmit"
      :userInfo="userInfo"
      @listen="listenBankSubmit"
    ></bankSubmit>
    <wallet-withdrawal></wallet-withdrawal>
  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
import WalletInfo from "./components/wallet-info.vue";
import BaohuWithdrawal from "./components/baohu-withdrawal.vue";
import UpUserCard from "./components/up-user-card.vue";
import setPayPassword from "@/pages/v1/mine/setting/setPayPassword";
import BankCard from "../treasure/components/bank-card.vue";
import SkuSelectBankcard from "../treasure/components/sku-select-bankcard.vue";
import bankSubmit from "./bankSubmit";
import Encryption from "@/utils/encryption";
import WalletWithdrawal from "./components/wallet-withdrawal.vue";
import YibaoBindCard from "./components/yibao-bind-card.vue";
import YbIdcardData from "./components/yb-idcard-data.vue";
import YbWithdrawal from "./components/yb-withdraw.vue";

export default {
  components: {
    mHeader,
    WalletInfo,
    UpUserCard,
    setPayPassword,
    BaohuWithdrawal,
    BankCard,
    SkuSelectBankcard,
    bankSubmit,
    WalletWithdrawal,
    YibaoBindCard,
    YbIdcardData,
    YbWithdrawal,
  },
  data() {
    return {
      currentPage: 0,
      isShowSetPassword: false, //设置宝户支付密码
      isShowDrawApplyTip: false, //提现申请成功
      userBankCards: [],
      userSelectedBankCardIdx: 0,
      pages: [
        {
          title: "我的零钱",
          key: 1,
        },
        {
          title: "上传身份证",
          key: 2,
        },
        {
          title: "绑定银行卡",
          des: "宝户绑定银行卡",
          key: 3,
        },
        {
          title: "选择银行卡",
          key: 4,
        },
        {
          title: "易宝上传身份证",
          key: 5,
        },
        {
          title: "易宝绑卡",
          key: 6,
        },

        {
          title: "易宝完善资料",
          key: 7,
        },
      ],
      BHInfo: {},
      ybCardInfo: {},
      ybAccountInfo: {},
    };
  },
  created() {
    this.getUserYBInfo();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    bankHandle(idx) {
      //用户更换银行卡
      this.userSelectedBankCardIdx = idx;
    },
    listenBankSubmit() {
      //银行卡添加成功
      this.getUserCards();
    },
    goBank() {
      this.changePage(2);
    },
    showBanks() {
      this.changePage(3);
    },
    changePage(val) {
      //切换页面显示
      this.currentPage = val;
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
          this.changePage(2);
        } else {
          this.$refs.bankSubmit.init();
          /*      this.$refs.SkuRef.showBindBank();
          this.changePage(0); */
        }
      } else {
        this.$message.error(res.data.message);
      }
      // console.log(`获取用户银行卡列表`,this.userBankCards);
    },
    async checkUserBHInfo() {
      const res = await this.$api.service.payChannel_accountInfo({
        payChannel: "baofoo",
      });

      if (res.data.code == 200) {
        const info = res.data.data;
        this.BHInfo = info;
        //如果没有绑定银行卡
        if (!info.statusBankCard) {
          this.getUserCards();

          return;
        }
        if (info.statusRealName == 2) {
          this.$confirm("身份证认证中，请稍等！", "提示", {
            confirmButtonText: "检查结果",
            cancelButtonText: "取消",
          }).then(async () => {
            this.checkUserBHInfo();
          });

          return;
        }
        //未设置身份证照片
        if (!info.statusRealName) {
          this.changePage(1);
          return;
        }
        //去设置支付密码
        if (!info.statusPassword) {
          this.isShowSetPassword = true;
          return;
        }

        if (this.userInfo.isPayPwd == 1) {
          this.showBHWithdrawal();
        } else {
          this.$refs.setPayPassword.init();
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    showBHWithdrawal() {
      this.$refs.BHWithdrawalRef.init(
        this.$refs.userWalletRef.userWalletResult.baofooAmount,
        (password, drawMoney) => {
          this.password = password;
          this.drawMoney = drawMoney;
          this.BHWithdraw();
        }
      );
    },
    //设置支付密码(本平台)
    async listenSetPayPassword(result) {
      if (result.result) {
        this.payPassword = result.result;
        console.log(`支付密码`, this.payPassword);
        this.$store.commit("setUserInfo", { isPayPwd: 1 });
        this.showBHWithdrawal();
      }
    },
    async BHWithdraw() {
      //宝户提现申请
      const resPassword = await Encryption.getPassword(this.password);
      if (!resPassword) {
        this.$message.warning("密码加密错误");
        return;
      }
      const res = await this.$api.service.withdrawalOrderBaofoo_baofooWithdraw({
        amount: this.drawMoney,
        payPw: resPassword,
      });
      if (res.data.code == 200 && res.data.data) {
        this.$message.success(res.data.message);
        //更新宝户列表，更新钱包数据
        this.isShowDrawApplyTip = true;
        this.$refs.userWalletRef.getUserWallet();
        this.$refs.walletBillRef.upodateBaohuList();
      } else {
        this.$message.error(res.data.message);
      }
    },
    async listenUpCardSuccess(info) {
      //宝户上传身份证回调
      if (this.checkCardDisabled) {
        return;
      }
      this.checkCardDisabled = true;
      const res = await this.$api.service.baofooInfo_idcardImage({
        idCardBack: info.idCardBack.id,
        idCardFront: info.idCardFront.id,
      });
      this.checkCardDisabled = false;
      if (res.data.code == 200 && res.data.data) {
        this.changePage(0);
        this.checkUserBHInfo();
      } else {
        this.$message.error(res.data.message);
      }
    },
    async listenHuiYuanUpCardSuccess(info) {
      //汇元上传身份证回调
      this.changePage(7);
    },
    async listenUpCardYibao(info) {
      this.ybCardInfo = info;
      this.currentPage = 6;
      //
    },
    checkUserYBInfo() {
      /*         this.currentPage = 6;
           return;   */

      if (this.ybAccountInfo.status == 0) {
        //未开户

        this.currentPage = 4;
        // this.currentPage = 6;
      } else if (this.ybAccountInfo.status == 1) {
        //开户成功
        this.currentPage = 0;
        this.$refs.ybWithdrawal.init();
      }
    },
    async getUserYBInfo() {
      //获取易宝账户信息
      const res = await this.$api.service.payChannel_accountInfo({
        payChannel: "yb",
      });
      if (res.data.code == 200) {
        this.ybAccountInfo = res.data.data || {};
        this.currentPage = 0;
      } else {
        this.$message.error(res.data.message);
      }
      // this.currentPage = 4; //上传身份证
      //  this.currentPage = 5; //易宝绑卡
      // this.currentPage = 6; //易宝完善资料
    },
    yibaoDrawalSuccess() {
      this.$refs.userWalletRef.getUserHyWallet();
      this.$refs.walletBillRef.upodateYbList();
    },
    async onSetPassword() {
      const res = await this.$api.service.payChannel_transactionPassword({
        payChannel: "baofoo",
      });
      if (res.data.code == 200) {
        setTimeout(() => {
          this.isShowSetPassword = false;
          this.$confirm("已经设置好宝户密码？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }).then(async () => {
            this.checkUserBHInfo();
          });
        }, 500);
        if (this.$common.isMobile()) {
          window.location.href = res.data.data.pwUrl;
        } else {
          window.open(res.data.data.pwUrl);
        }
      } else {
        this.$message.error(res.data.message);
      }
      //
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.btn-group {
  margin-top: 15px;
}

.m-success-wrap {
  text-align: center;
  .ui-title {
    color: #333333;
    text-align: center;
    margin: 6px auto 15px;
  }
  .icon-success {
    width: 180px;
    margin: 0 auto;
  }
}
.text-left {
  text-align: left;
}
</style>
