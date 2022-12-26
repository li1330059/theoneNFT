<template>
  <div class="ui-content">
    <treasure-sku
      v-show="pages[currentPage].key == 1"
      ref="SkuRef"
    ></treasure-sku>
    <!-- 绑定银行卡 -->
    <bank-card
      v-show="pages[currentPage].key == 2"
      :userBankCards="userBankCards"
      :submit="goConsignment"
      :userSelectedBankCardIdx="userSelectedBankCardIdx"
      :tip="`您正在开通宝付账户支付通道，请完成银行卡绑定验证来完成寄售。订单交易成功后，您可在支付管理-宝付账户余额账户来完成提现。`"
    ></bank-card>
    <!-- 银行卡选择 -->
    <sku-select-bankcard
      v-show="pages[currentPage].key == 3"
      :userBankCards="userBankCards"
      :userSelectedBankCardIdx="userSelectedBankCardIdx"
      :cancel="goBank"
      :sure="bankHandle"
    ></sku-select-bankcard>
    <!-- 寄售成功弹窗 -->
    <el-dialog
      title="寄售成功"
      :visible.sync="isShowSuccess"
      :before-close="onHideSuccessTip"
      width="460px"
    >
      <div class="m-success-wrap">
        <img
          src="//static.theone.art/pc/icons/icon-treasure-success.png"
        />
        <div class="txt">恭喜您寄售成功</div>
        <div class="btn-center">
          <div class="btn btn-large btn-red" @click="onHideSuccessTip">
            我知道了
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TreasureSku from "./components/treasure-sku.vue";
import BankCard from "./components/bank-card.vue";
import SkuSelectBankcard from "./components/sku-select-bankcard.vue";
export default {
  components: {
    TreasureSku,
    BankCard,
    SkuSelectBankcard,
  },
  data() {
    return {
      isShowSuccess: false,
      pages: [
        {
          title: "我的藏品",
          key: 1,
        },
        {
          title: "寄售",
          key: 2,
        },
        {
          title: "选择银行卡",
          key: 3,
        },
      ],
      currentPage: 0,
      userBankCards: [],
      userSelectedBankCardIdx: 0,
    };
  },

  created() {},
  computed: {
    isBigPay() {
      return this.$store.state.isBigPay;
    },
  },
  methods: {
    goBank() {
      this.changePage(1);
    },
    showBanks() {
      this.changePage(2);
    },
    async checkBHUserInfo(amount) {
      this.goConsignment();
    },
    changePage(val) {
      //切换页面显示
      this.currentPage = val;
    },
    updateSkuList() {},
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
          this.changePage(1);
        } else {
          this.$refs.SkuRef.showBindBank();
          this.changePage(0);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    bankHandle(idx) {
      //用户更换银行卡
      this.userSelectedBankCardIdx = idx;
    },
    goConsignment() {
      //寄售
      this.$refs.SkuRef.goConsignment();
    },
    showSuccess() {
      this.isShowSuccess = true;
    },
    hideConsignmentTip() {
      this.$refs.SkuRef.hideSellAdd();
    },
    onHideSuccessTip() {
      this.$refs.SkuRef.getTreasureSkuList();
      this.isShowSuccess = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.ui-content {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
}
.m-success-wrap {
  img {
    display: block;
    width: 60%;
    margin: 0 auto;
    max-width: 260px;
  }
  .txt {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
  .btn-center {
    display: flex;
    justify-content: center;
    padding: 31px 0 0;
  }

  @media screen and (min-width: 0px) and (max-width: 540px) {
  }
}
</style>

