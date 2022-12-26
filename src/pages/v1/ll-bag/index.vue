<template>
  <div class="ll-bag-body ll-max-width">
    <m-head :back="goBack"></m-head>
    <loading v-if="loading"></loading>
    <section class="money-wrap">
      {{ redirect }}
      <div class="label hand money-flex" @click="toggleMoney">
        可用余额(元)<span
          class="ll-icon"
          :class="isShowMoeny ? `icon-open-eye` : `icon-close-eye`"
        ></span>
      </div>
      <div class="money">
        {{ isShowMoeny ? $common.formatMoney(useMoney) : `***`
        }}<span class="ll-icon icon-eye-close"></span>
      </div>
      <div class="line"></div>
      <div class="money-list-wrap">
        <div class="block border-right">
          <div class="t-label">
            <el-popover
              placement="top-start"
              popper-class="ll-popover"
              title
              width="260"
              trigger="hover"
              content="待结算余额预计次日10点前自动转为可提现余额"
            >
              <div slot="reference">
                <div class="ll-q-wrap">
                  待结算余额(元)<span class="ll-icon icon-q-white"></span>
                </div>
              </div>
            </el-popover>
          </div>
          <div class="block-money">
            {{ isShowMoeny ? $common.formatMoney(waitMoney) : `***` }}
          </div>
        </div>
        <div class="block">
          <div class="t-label">可提现余额(元)</div>
          <div class="block-money">
            {{ isShowMoeny ? $common.formatMoney(amtMoney) : `***` }}
          </div>
        </div>
      </div>
    </section>
    <section class="ui-btn-group ui-btn-between">
      <div
        class="ll-btn ll-btn-primary"
        @click="goWithDraw"
        :class="{ 'll-btn-disabled': isDrawDisable }"
      >
        <span class="ll-icon icon-draw" /><span>提现</span>
      </div>
      <div class="ll-btn ll-btn-warning" @click="recharge">
        <span class="ll-icon icon-recharge" /><span>充值</span>
      </div>
    </section>
    <section class="ui-list-wrap">
      <div
        class="list-bar"
        v-for="(item, idx) in list"
        :key="idx"
        @click="goLink(item)"
      >
        <div class="info">
          <div class="ll-icon" :class="[item.icon]"></div>
          {{ item.name }}
        </div>
        <div class="ll-icon icon-p-right"></div>
      </div>
    </section>
    <ll-footer class="fixed-bottom"></ll-footer>
  </div>
</template>
<script>
import Loading from "./components/loading.vue";
import llFooter from "./components/ll-footer.vue";
import MHead from "./components/m-head.vue";
import App from "@/utils/app/index";
export default {
  components: { Loading, llFooter, MHead },
  data() {
    return {
      redirect: "",
      loading: true,
      isShowMoeny: false,
      list: [
        {
          icon: "icon-bill",
          name: "账单明细",
          key: "bill",
          link: "/ll_bag/billing_list",
        },
        {
          icon: "icon-bank",
          name: "银行卡",
          link: "/ll_bag/bankcard_manage",
        },
        {
          icon: "icon-security",
          name: "安全设置",
          link: "/ll_bag/security_setting",
        },
      ],
      accountInfo: {},
    };
  },
  computed: {
    isDrawDisable() {
      return !Number(this.amtMoney);
    },
    useMoney() {
      //可以用
      return (
        this.accountInfo.totalBalaval ||
        this.accountInfo.totalBalcur ||
        this.accountInfo.totalBalfrz
      );
    },

    amtMoney() {
      //可提现
      return (
        this.accountInfo.amtBalaval ||
        this.accountInfo.amtBalcur ||
        this.accountInfo.amtBalfrz
      );
    },
    waitMoney() {
      //待结算
      return (
        this.accountInfo.waitBalaval ||
        this.accountInfo.waitBalcur ||
        this.accountInfo.waitBalfrz
      );
    },
  },
  created() {
    /*     const redirect = `${window.location.origin}${window.location.pathname}`;
    this.redirect = redirect; */

    /*     const redirect = `/ll_bag/pay?order_no=OB1562057385617199105&amount_pay=2.34&show_amount=2.34&goods_name=惊喜空投R-06`;
    this.$router.replace(
      `/ll_bag/account_opening?redirect=${encodeURIComponent(redirect)}`
    );
    return; */
    /*     window.location.href = "/ll_bag/bankcard_manage"; */
    /*     const redirect = `/ll_bag/pay?order_no=OB1562057385617199105&amount_pay=2.34&show_amount=2.34&goods_name=惊喜空投R-06`;
    console.log(encodeURIComponent(redirect));
    const t2 = encodeURIComponent(encodeURIComponent(redirect));

    console.log(t2);
    console.log(decodeURIComponent(decodeURIComponent(t2))); */

    if (this.$store.state.llWalletAccountInfo.status != 10) {
      const redirect = `/ll_bag`;
      this.$localStorage.setItem("ll-redirect", redirect, 1 * 60 * 60 * 1000);
      this.$router.replace(`/ll_bag/account_opening`);
    } else {
      this.loading = true;
      this.init();
    }
  },
  methods: {
    goBack() {
      if (App.browser.theone.isTheOne) {
        App.$methods.goBack();
      } else {
        this.$router.back();
      }
    },
    init() {
      this.getBalance();
    },
    goLink(item) {
      if (item.key && item.key == "bill") {
        window.location.href = item.link;
      } else {
        this.$router.push(item.link);
      }
    },

    goWithDraw() {
      if (this.isDrawDisable) {
        return;
      }
      this.$router.push(`/ll_bag/withdraw`);
    },
    recharge() {
      this.$router.push(`/ll_bag/recharge`);
    },
    toggleMoney() {
      this.isShowMoeny = !this.isShowMoeny;
    },
    async getBalance() {
      const res = await this.$api.service.ll_balance_get();
      this.loading = false;
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.accountInfo = res.data.data;
        } else {
          this.$message.error(res.data.data.reason || "获取余额失败");
          /*  this.$router.replace("/ll_bag/account_opening"); */
        }
      } else if (res.data.code == 1000) {
        this.$router.replace("/ll_bag/account_opening");
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.border-right {
  border-right: 1px solid #414be7;
}
.ll-bag-body {
  overflow-y: hidden;
}
.ll-q-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .ll-icon {
    margin-left: 2px;
  }
}
.icon-eye-close {
}
.ll-btn-primary {
  box-shadow: 0px 9px 23px 0px rgba(52, 62, 223, 0.35);
}
.icon-draw {
  background-image: url("//static.theone.art/pc/ll-bag/icon-draw.png");
}
.icon-recharge {
  background-image: url("//static.theone.art/pc/ll-bag/icon-recharge.png");
}
.icon-bill {
  background-image: url("https://static.theone.art/pc/ll-bag/icon-bill.png");
}
.icon-bank {
  background-image: url("https://static.theone.art/pc/ll-bag/icon-card.png");
}
.icon-security {
  background-image: url("https://static.theone.art/pc/ll-bag/icon-security.png");
}
.icon-open-eye {
  background-image: url("//static.theone.art/pc/ll-bag/icon-eye-open.png");
}
.icon-close-eye {
  background-image: url("//static.theone.art/pc/ll-bag/icon-eye-close.png");
}
.money-wrap {
  background: #343edf;
  box-shadow: 0rem 14px 32px 0rem rgba(52, 62, 223, 0.4);
  border-radius: 20px;
  color: #ffffff;
  .money-flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .line {
    border-top: 1px solid #414be7;
    width: 50%;
    margin: 0 auto;
  }
  .money-list-wrap {
    display: flex;
    margin-top: 10px;
    padding-bottom: 16px;
    .block {
      flex: 1;
      text-align: center;
      .t-label {
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 6px;
      }
      .block-money {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
  .label {
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    padding-top: 24px;
    margin-bottom: 12px;
  }
  .money {
    font-size: 24px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 16px;
  }
}
.ui-btn-group {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ll-btn {
    width: 47%;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: inherit;
    .ll-icon {
      width: 32px;
      height: 32px;
      margin-right: 4px;
    }
  }
}
.ui-list-wrap {
  margin-top: 60px;
  .list-bar {
    height: 60px;
    background: #f7f7f7;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 16px;
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      .ll-icon {
        width: 30px;
        height: 30px;
        margin-right: 6px;
      }
    }
  }
}
.footer {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  text-align: center;
  padding: 16px 0;
}
</style>
