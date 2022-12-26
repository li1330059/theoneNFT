<template>
  <div class="page-common-card">
    <div class="commoncard-list">
      <div
        class="commoncard-item"
        v-for="(item, index) in records"
        :key="index"
      >
        <div class="c1">
          <div class="time">{{ item.createTime }}</div>
          <div class="wmiddle">
            <div class="state" v-if="item.statusTrade == 0">待支付</div>
            <div class="state" v-if="item.statusTrade == 3">已完成</div>
            <div class="state" v-if="item.statusTrade == 4">已取消</div>
            <div class="state" v-if="item.statusTrade == 0">
              <span
                class="state"
                v-if="item.depositObj && item.depositObj.statusTrade == 0"
              >
                待付定金
              </span>
              <span
                class="state"
                v-else-if="item.balanceObj && item.balanceObj.statusTrade == 0"
              >
                待付尾款
              </span>
              <span class="state" v-else>待支付</span>
            </div>
            <div class="state" v-if="item.statusTrade == 5">
              已关闭
              <span v-if="item.refundObj && item.refundObj.statusTrade == 1">
                有退款
              </span>
              <span v-else> 尾款超时 </span>
            </div>
          </div>
        </div>

        <div class="c2">
          <!--         <div
            class="img"
            :style="`background-image:url(${
              item.commodity && item.commodity.cover
            })`"
          /> -->
          <div class="img">
            <simple-frame :goodsObj="item" />
            <!--             <preview-img
              v-if="item.commodity"
              class="cover-wrap"
              :cover="(item.commodity && item.commodity.cover) || item.cover"
              :picture="
                (item.commodity && item.commodity.actualPicture) ||
                item.actualPicture
              "
              :info="item"
              :isShowPreview="false"
            ></preview-img>
            <div class="honor-img" v-if="item.honorFlag&&item.honorFlag==1"></div> -->
          </div>
          <div class="info">
            <div class="line-group">
              <div class="com-name">
                {{ item.commodity && item.commodity.name }}
              </div>
              <div class="money">
                {{ $common.formatMoney(item.price) }}
              </div>
            </div>
            <div class="line-group padding">
              <div>
                <div class="author">
                  {{ item.author && item.author.nickname }}
                </div>
                <!--         <commodity-num
                  class="ui-commodity-num"
                  :treasure="item"
                  v-if="item.statusTrade == 3||type!='statusTrade'"
                ></commodity-num> -->
              </div>
              <!--      <div class="account-name">
                {{ $common.tranPayChannel(item.channel) }}
              </div> -->
            </div>

            <div class="line-group">
              <!--      <div class="author">
                {{ item.author && item.author.nickname }}
              </div> -->
              <div class="money"></div>
            </div>
          </div>
        </div>
        <section
          class="prepay-date warning-color radius text-center"
          v-if="
            item.statusTrade == 0 &&
            item.balanceObj &&
            item.balanceObj.statusTrade == 0
          "
        >
          尾款支付时间：{{ item.balanceObj.limitStartTime }} -
          {{ item.balanceObj.limitEndTime }}
        </section>

        <div
          class="prepay-date radius"
          v-if="
            item.statusTrade == 5 &&
            item.refundObj &&
            item.refundObj.statusTrade == 1
          "
        >
          退款金额：{{ $common.formatMoney(reMoney(item)) }}
        </div>
        <div class="c3">
          <!--     <div class="pending-payment" v-if="item[type] == 0">
            <div class="btn btn-default" @click="onOrderCancel(item)">取消</div>
            <div class="btn btn-default" @click="onOrderPay(item)">支付</div>
          </div> -->
          <div class="pending-payment">
            <div style="flex: 1">
              <div v-if="item.statusTrade == 0" class="pending-payment">
                <div
                  class="btn btn-default"
                  @click="onOrderCancel(item)"
                  v-if="
                    (item.depositObj && item.depositObj.statusTrade == 0) ||
                    !item.depositObj
                  "
                >
                  取消
                </div>
                <div class="btn-flex-end">
                  <div
                    v-if="item.depositObj && item.depositObj.statusTrade == 0"
                    class="btn btn-primary"
                    @click="onOrderPay(item)"
                  >
                    支付定金
                  </div>
                  <div
                    v-else-if="
                      item.balanceObj && item.balanceObj.statusTrade == 0
                    "
                    class="btn btn-primary"
                    @click="onOrderPay(item)"
                  >
                    支付尾款
                  </div>
                  <div class="btn btn-primary" @click="onOrderPay(item)" v-else>
                    支付
                  </div>
                </div>
              </div>
            </div>
            <div
              class="btn btn-default"
              v-if="item[type] == 3 || item[type] == 4 || item.statusTrade == 5"
              @click="$common.goPage(`/mine/order/${item.id}`, '_blank')"
            >
              查看订单
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const BigNumber = require("bignumber.js");
// import empty from "@/components/v1/empty";
// import loading from "@/components/v1/loading/loading";

export default {
  components: {},
  props: {
    records: {
      type: Array,
    },
    type: String,
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    reMoney(item) {
      //退款金额
      return new BigNumber(item.refundObj.presaleAmountExt.refundAmount).plus(
        item.refundObj.presaleAmountExt.depositAmount
      );
    },
    onOrderPay(item) {
      this.$parent.$parent.$parent.onOrderPay(item);
      /*     this.$router.push(`/mine/trade/pay/${item.id}`); */
    },
    onOrderCancel(item) {
      this.$parent.$parent.$parent.onOrderCancel(item);
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-flex-end {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}
.wmiddle {
  display: flex;
  justify-content: flex-end;
  > * {
    display: inline-block;
    margin-left: 0.1rem;
  }
}

.prepay-date {
  font-size: 0.24rem;
  font-weight: 400;
  color: #333333;
  background: #fafafa;
  padding: 0.16rem;
  margin-bottom: 0.3rem;
  &.warning-color {
    color: #e61f1a;
  }
}

.line-group {
  display: flex;
  justify-content: space-between;
  .author {
    font-size: 0.24rem;
    font-weight: 400;
    color: #999999;
  }
  .com-title {
    font-size: 0.28rem;
    font-weight: 400;
    color: #4d4d4d;
  }
  .account-name {
    font-size: 0.24rem;
    font-weight: 400;
    color: #999999;
  }
  .money {
    font-size: 0.28rem;
    font-weight: 500;
    color: #f4a33a;
  }
}
.padding {
  padding: 0.16rem 0;
}
.page-common-card {
  margin-top: 0.32rem;
  padding-bottom: 1rem;
  .commoncard-list {
    .commoncard-item {
      background: #fff;
      padding: 0.2rem 0.32rem;
      margin-bottom: 0.16rem;
      display: flex;
      flex-direction: column;
      .c1 {
        display: flex;
        justify-content: space-between;
        border-bottom: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
        padding-bottom: 0.2rem;
        .time {
          font-size: 0.24rem;
          font-weight: 400;
          color: rgba($color: #000000, $alpha: 0.4);
        }
        .state {
          font-size: 0.24rem;
          font-weight: 400;
          color: #397fe7;
          &.finish {
            color: rgba($color: #000000, $alpha: 0.7);
          }
          &.cancel {
            color: rgba($color: #000000, $alpha: 0.4);
          }
        }
      }
      .c2 {
        padding: 0.32rem 0;
        display: flex;
        flex-wrap: wrap;
        .img {
          width: 1.28rem;
          height: 1.28rem;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-width: 1.28rem;
          position: relative;
          .honor-img {
            background-image: url("~@/assets/1.0/images/honor-icon.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            width: 16px;
            height: 18px;
            position: absolute;
            top: 0;
            left: 2px;
            z-index: 1;
          }
        }
        .info {
          margin-left: 0.16rem;
          flex: 1;
          width: 0;
          .top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            &-text {
              width: 70%;
            }
          }
          h1 {
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
            margin-bottom: 0.12rem;
          }
          h2 {
            font-size: 0.24rem;
            font-weight: 400;
            color: rgba($color: #000000, $alpha: 0.4);
            margin-bottom: 0.12rem;
            i {
              background: url("//static.theone.art/pc/images/pic-home/copy2.png")
                no-repeat;
              width: 0.28rem;
              height: 0.28rem;
              background-size: 100% auto;
              display: inline-block;
              vertical-align: middle;
              margin-top: -0.02rem;
              margin-left: 0.08rem;
            }
          }
        }
        .amount {
          justify-content: flex-start;
          display: flex;
          flex-direction: column;
          text-align: right;
          span {
            font-size: 0.24rem;
            font-weight: 800;
            color: #f4a33a;
          }
          i {
            font-style: normal;
            font-size: 0.24rem;
            font-weight: 400;
            color: rgba($color: #000000, $alpha: 0.7);
            margin-top: 0.16rem;
          }
        }
      }
      .c3 {
        border-top: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
        padding-top: 0.16rem;
        display: flex;
        justify-content: flex-end;
        .pending-payment {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
        }
        .btn {
          width: 3.28rem;
          height: 0.72rem;
          line-height: 0.72rem;
          border-radius: 0.36rem;
          text-align: center;
          font-size: 0.28rem;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
