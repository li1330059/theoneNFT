<template>
  <div class="ui-big-pay-wrap" v-if="isShow">
    <div class="ui-main">
      <div class="ui-head">
        <div class="title">{{payInfo.name}}</div>
        <div class="des">请选择对应的银行进行支付</div>
        <!--    <div class="warning">
         
        </div> -->
      </div>
      <div class="m-select-cards">
        <div class="label">请选择支付银行卡：</div>
        <div class="cards-wrap">
          <div class="input-line select-line">
            <el-input
              v-model="cardParams.bankName"
              placeholder="请选择银行"
              @input="onSearchBank"
            ></el-input>

            <ul v-if="isShowBankResult">
              <li
                v-for="(item, index) in userBankCards.records"
                :key="index"
                @click="chooseBank(item)"
              >
                {{ item.bankName
                }}{{
                  bankType(item.bankType)
                    ? `（${bankType(item.bankType)}）`
                    : ""
                }}
              </li>
              <li v-if="userBankCards.total == 0">未能查询到此银行有关信息</li>
            </ul>
          </div>
          <!--    <el-select
            v-model="userSelectedCardUuid"
            placeholder="请选择支持网银支付的银行"
          >
            <el-option
              v-for="item in userBankCards.records"
              :key="item.uuid"
              :label="item.bankName"
              :value="item.uuid"
            >
            </el-option>
          </el-select> -->
        </div>
        <div class="link" @click="$parent.showBaohuCards">
          查看网银支付支持的银行卡和额度
        </div>
      </div>
      <div class="btn-right">
        <div class="btn btn-default" @click="hide">取消</div>
        <div class="btn btn-red" @click="onSubmit">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      userBankCards: { records: [] },
      userSelectedCardUuid: "",
      userSelectedCardInfo: {},
      cardParams: {
        bankName: "",
        bankType: "",
        pageCount: 1,
        pageSize: 12,
      },
      isShowBankResult: false,
    };
  },
  props:{
    payInfo:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  created() {},
  methods: {
    bankType(key) {
      if (key == 1) {
        return "储蓄卡";
      } else if (key == 2) {
        return "信用卡";
      }
      return "";
    },
    onSearchBank() {
      this.isShowBankResult = true;
      this.getCards();
    },
    chooseBank(item) {
      this.cardParams.bankName = `${item.bankName}${
        this.bankType(item.bankType)
          ? `（${this.bankType(item.bankType)}）`
          : ""
      }`;
      this.userSelectedCardInfo = item;
      this.isShowBankResult = false;
    },
    show() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    onSubmit() {
      if (this.userSelectedCardInfo.uuid) {
        this.$parent.orderSubmitAndPay({
          payBankUuid: this.userSelectedCardInfo.uuid,
        });
      } else {
        this.$message.warning("请选择银行卡");
      }
    },

    async getCards() {
      const res = await this.$api.service.baofooPayBank_findPageList(
        this.cardParams
      );
      if (res.data.code == 200) {
        this.userBankCards = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/treasure.scss";
.ui-big-pay-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fbfbfb;
  z-index: 3;
  padding: 80px 0 200px;
  .ui-main {
    max-width: 1200px;
    margin: 54px auto 0;
    background: #ffffff;
    border-radius: 10px;
    padding: 28px 46px 35px;
  }
  @media screen and (max-width: 540px) {
    .ui-main{
      margin-top:0;
    }
  }
}
.ui-head {
  font-size: 14px;
  font-weight: 400;
  .title {
    font-weight: bold;
    color: #000000;
    margin-bottom: 19px;
  }
  .des {
    color: #333333;
    margin-bottom: 20px;
  }
  .warning {
    color: #eb3229;
  }
}
.m-select-cards {
  display: flex;
  font-weight: 400;
  align-items: center;
  font-size: 14px;
  padding: 20px 0 160px;
  .label {
    font-weight: 400;
    color: #999999;
    padding-right: 10px;
  }
  .input-line{
    margin-bottom:0;
  }
  .link {
    color: #397fe7;
    cursor: pointer;
  }
  .cards-wrap {
    padding-right: 24px;
  }
  @media screen and (max-width: 540px) {
    display: block;
  }
}
.btn-default {
  background: #e5e5e5;
}
.btn-right {
  .btn {
    margin-left: 24px;
  }
}
.input-line {
  margin-bottom: 16px;
  border-radius: 4px;
  min-width: 260px;

  &.select-line {
    position: relative;

    ul {
      position: absolute;
      width: 100%;
      z-index: 100;
      background: #fff;
      border: 1px solid rgba($color: #409eff, $alpha: 1);
      border-top: 0;

      li {
        line-height: 40px;
        padding: 0 20px;
        cursor: pointer;
        &:hover {
          background: rgba($color: #000000, $alpha: 0.1);
        }
      }
    }
  }

  &.password-number {
    display: flex;
    justify-content: space-between;

    &.adjacent {
      justify-content: start;

      .number-input {
        margin-right: 16px;
      }
    }

    .number-input {
      width: 34px;
      height: 40px;
      background: #ffffff;
      border-radius: 4px;
    }

    .el-input__inner {
      padding: 0;
      text-align: center;
    }
  }
}
</style>
