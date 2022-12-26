<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <loading v-if="loading"></loading>
    <section class="bankcard-list-block" v-else>
      <div class="list" v-for="(item, idx) in bankList" :key="idx">
        <van-swipe-cell right-width="80">
          <div class="bar bg-img">
            <div class="head">
              <div class="bank-name">{{ item.bankName }}</div>
              <span class="ll-icon icon-bank-sign"></span>
            </div>

            <div class="foot">
              <div class="bank-num">{{ item.acctNo }}</div>
              <div class="right phone-hide">
                <span
                  class="ll-icon ll-icon-delete"
                  @click="deleteCard(item)"
                ></span>
                <span @click="deleteCard(item)">解绑</span>
              </div>
            </div>
          </div>
          <template #right>
            <div class="hot-point" @click="deleteCard(item)"></div>
          </template>
        </van-swipe-cell>
        <div class="bg-img-back"><div>解绑</div></div>
      </div>

      <div class="bind-wrap hand" @click="goAdd()">
        <span class="ll-icon icon-add"></span>
        绑定新卡
      </div>
    </section>
    <pay-password-input-dialog
      ref="payPasswordInputRef"
      title="请输入支付密码"
      @success="listenPasswordSuccess"
      @error="passwordError"
    ></pay-password-input-dialog>
    <ll-footer class="fixed-bottom"></ll-footer>
  </div>
</template>
<script>
import PayPasswordInputDialog from "./components/pay-password-input-dialog.vue";
import Loading from "./components/loading.vue";
import MHead from "./components/m-head.vue";
import llFooter from "./components/ll-footer.vue";
export default {
  components: { PayPasswordInputDialog, Loading, MHead, llFooter },
  data() {
    return {
      loading: true,
      bankListParams: {
        pageCount: 1,
        pageSize: 20,
        statusList: [],
      },
      bankList: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getList();
    },
    initList() {
      this.bankListParams.pageCount = 1;
      this.bankList = [];
      this.getList();
    },
    async listenPasswordSuccess(obj) {
      const res = await this.$api.service.ll_bindCard_unbind({
        password: obj.password,
        randomKey: obj.randomKey,
        uuid: this.selectedBank.uuid,
      });
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.initList();
        } else {
          this.$message.error(res.data.data.reason);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    passwordError(obj) {
      this.$message.warning(obj.code);
    },
    goAdd() {
      /*       this.$router.push({
        path: `/ll_bag/bankcard_bind`,
      }); */
      window.location.href = `/ll_bag/bankcard_bind`;
    },
    async getList() {
      this.loading = true;
      const res = await this.$api.service.ll_bindCard_list(this.bankListParams);
      this.loading = false;
      if (res.data.code == 200) {
        if (res.data.data.records && res.data.data.records.length > 0) {
          this.bankList = [...this.bankList, ...res.data.data.records];
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    deleteCard(info) {
      if (this.bankList.length == 1) {
        this.$message.error("连连钱包账户需保留一张银行卡");
        return;
      }
      this.selectedBank = info;
      this.$refs.payPasswordInputRef.init();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.icon-bank-sign {
  opacity: 0;
  background-image: url("//static.theone.art/pc/ll-bag/icon-bank-sign.png");
}
.ll-icon-delete {
  background: url("~@/assets/1.0/images/delete-white.png") no-repeat;
}
.icon-add {
  background-image: url("//static.theone.art/pc/ll-bag/icon-bank-add.png");
}
.bankcard-list-block {
  overflow-y: auto;
  max-height: 670px;
  position: relative;
  ::v-deep .van-swipe-cell__wrapper {
    margin: 0 !important;
  }
  .list {
    margin-bottom: 16px;
  }

  .bar {
    border-radius: 20px;
    background-image: url("https://static.theone.art/pc/ll-bag/bankcard-bg-2.png");
    padding: 26px 32px 16px;
    background-position: center -6px;
    .head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 49px;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      .icon-bank-sign {
        width: 32px;
        height: 32px;
      }
    }
    .bank-num {
      font-size: 16px;
      color: #ffffff;
    }
    .foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height:20px;
      .txt {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.4);
      }
      .right {
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        display: flex;
        align-items: center;
        .ll-icon-delete {
          background-size: 100% auto;
          margin-right: 5px;
        }
      }
    }
  }
  .list:nth-child(2n) {
    .bar {
      background-image: url("//static.theone.art/pc/ll-bag/bankcard-bg-1.png");
    }
  }
  .hot-point {
    width: 80px;
    height: 40px;
  }
  .bg-img-back {
    position: absolute;
    top: 0;
    width: calc(100% - 32px);
    z-index: -1;
    background: #da3621;
    border-radius: 20px;
    height: 143px;
    margin: 0px 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    div {
      margin-right: 27px;
      color: #fff;
    }
  }
  ::v-deep  .van-swipe-cell__right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  ::v-deep  .van-swipe-cell__wrapper {
    margin: 0px 16px;
  }
  @media screen and (max-width: 540px) {
    overflow-y: initial;
    max-height: initial;
    padding-bottom: 1rem;
  }
}
.bind-wrap {
  height: 60px;
  background: #e4e6ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #343edf;
  .ll-icon {
    margin-right: 12px;
    width: 30px;
    height: 30px;
  }
}
@media screen and (max-width: 540px) {
  .phone-hide{
    display: none !important;
  }
  .fixed-bottom {
/*     position: initial; */
  }
}
</style>
