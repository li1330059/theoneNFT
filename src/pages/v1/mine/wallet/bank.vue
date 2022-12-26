<template>
  <div>
    <div class="mode-mobile">
      <m-head title="银行卡绑定" />
    </div>

    <div class="page-mine-wallet-bank grayscale">
      <div class="" v-if="bankList.length > 0">
        <div class="v1-card-title-mycenter">
          <h1>全部</h1>
          <div class="btns" v-if="false">
            <div
              :class="{ 'v1-btn-eye gray ': true, hidden: hiddenMoney }"
              @click="hiddenMoney = !hiddenMoney"
            ></div>
          </div>
        </div>
      </div>
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <div else class="list" v-for="(item, index) in bankList" :key="index">
        <div class="content">
          <span>{{ item.bankDetailName }}</span>
          <i :class="item.statusDefault == 1 ? 'isdefault' : ''">{{
            !hiddenMoney
              ? $common.formatCardNumber(item.bankAccont)
              : item.bankAccont
          }}</i>
        </div>

        <div class="operate">
          <div
            v-if="item.statusDefault != 1"
            class="v1-btn-link blue"
            @click="setDefault(item)"
          >
            设为默认
          </div>
          <div class="v1-btn-link" v-if="item.statusBandingBaofoo == 1">
            支持：宝付账户
          </div>
          <div class="v1-btn-link blue" @click="onSetBank(item)">
            设定开户行
          </div>
          <div class="v1-btn-link blue" @click="unbindBank(item)">解绑</div>
        </div>
      </div>

      <div class="bank-add">
        <div class="empty" v-if="showEmpty"></div>
        <div class="btns">
          <div class="v1-btn mycenter red" @click="addBank">绑定新卡</div>
        </div>
      </div>

      <bankSubmit
        ref="bankSubmit"
        :userInfo="userInfo"
        @listen="listenBankSubmit"
      ></bankSubmit>
    </div>
  </div>
</template>
<script>
import loading from "@/components/v1/loading/loading";
import bankSubmit from "./bankSubmit";


export default {
  components: { bankSubmit },
  data() {
    return {
      bankList: [],
      hiddenMoney: false,
      loading: true,
      showEmpty: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  mounted() {
    /*     this.getUserAttribute(); */
    this.findBankAccountList();
  },
  methods: {
    async getUserAttribute() {
      let result = await this.$api.service.userattribute_queryByUserUuid();
      this.userInfo = result.data.data;
    },
    async findBankAccountList() {
      this.loading = true;
      let result = await this.$api.service.userbank_findBankAccount();
      this.loading = false;
      this.bankList = result.data.data;
      this.showEmpty = this.bankList.length == 0;
    },
    setDefault(item) {
      this.$confirm(`确认设置此银行卡为默认吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          //todo 删除操作
          let result = await this.$api.service.userbank_defalutBank({
            uuid: item.uuid,
          });
          console.log("resultresult", result);
          if (result.data.code == 200) {
            this.$message.success(result.data.message);
            this.findBankAccountList();
          }
        })
        .catch(() => {});
    },
    addBank() {
      this.$refs.bankSubmit.init();
    },
    async listenBankSubmit(result) {
      if (result.result) {
        this.findBankAccountList();
      }
    },
    onSetBank(item) {
      this.$refs.bankSubmit.init(item);
    },
    unbindBank(item) {
      this.$confirm(`确认解除绑定此银行卡吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          let result = await this.$api.service.userBank_unbound({
            uuid: item.uuid,
          });
          if (result.data.code == 200) {
            this.$message.success(result.data.message);
            this.findBankAccountList();
          }else{
            this.$message.error(result.data.message);
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.page-mine-wallet-bank {
  max-width: 790px;
  .loading {
    height: 500px;
  }
  .list {
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    display: flex;
    align-items: center;
    height: 60px;
    .v1-btn-link {
      margin-left: 10px;
    }
    &:first-child {
      border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
    }
    .title {
      width: 150px;
      font-size: 14px;
      color: rgba($color: #000000, $alpha: 0.4);
    }
    .operate {
      display: flex;
    }
    .content {
      flex: 1;
      color: #000000;
      span {
        margin-right: 16px;
      }
      i {
        font-style: normal;
        position: relative;
        &.isdefault {
          &::after {
            content: "";
            background: url("//static.theone.art/pc/images/pic-home/isdefault%402x.png");
            width: 28px;
            height: 28px;
            background-size: 100% auto;
            position: absolute;
            right: -40px;
            top: 0px;
          }
        }
      }
    }
  }

  .bank-add {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 80px;
    .empty {
      background: url("//static.theone.art/pc/images/bank_empty.png")
        no-repeat center center;
      width: 342px;
      height: 202px;
      background-size: contain;
      margin-bottom: 21px;
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mine-wallet-bank {
    padding-bottom: 1rem;
    .list {
      padding: 0.32rem;
      background: #fff;
      flex-direction: column;
      align-items: flex-start;
      height: auto;
      .operate {
        justify-content: flex-end;
        width: 100%;
        .v1-btn-link {
          padding-top: 0.32rem;
        }
      }
      .title {
        width: 1.2rem;
      }
      .v1-btn-link {
    
      }
    }

    .v1-card-title-mycenter {
      padding: 0.32rem;
      h1 {
        font-size: 0.28rem;
        font-weight: 500;
        color: #000000;
      }
    }

    .bank-add {
      display: flex;
      justify-content: center;
      margin-top: 2.1rem;
      .empty {
        width: 90%;
      }
      .v1-btn.mycenter {
        width: 6.86rem;
        height: 0.72rem;
        line-height: 0.72rem;
        border-radius: 0.36rem;
        font-size: 0.28rem;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
</style>
