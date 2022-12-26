<template>
  <div>
    <div class="mode-mobile"><m-header :title="'我卖出的'" /></div>
    <div class="page-mobile-mine-buy">
      <van-tabs v-model="activeTab" sticky>
        <van-tab
          v-for="(item, index) in searchOption[type]"
          title-class="trade-van-tab"
          :title="item.name"
          :key="index"
        >
        </van-tab>
      </van-tabs>
      <page-template ref="PageT" :is_empty="showEmpty">
        <div class="page-common-card">
          <div class="commoncard-list">
            <div
              class="commoncard-item"
              v-for="(item, index) in orderListResult.records"
              :key="index"
            >
              <div class="c1">
                <div class="time">{{ item.createTime }}</div>
                <div class="wmiddle">
                  <div
                    class="state"
                    v-if="item.tags && item.tags.search(/presale/gi) != -1"
                  >
                    {{ soldStatus(item).txt }}
                  </div>
                  <div v-else>
                    <div class="state" v-if="item.statusTrade == 0">待付款</div>
                    <div class="state" v-if="item.statusTrade == 3">已完成</div>
                  </div>
                </div>
              </div>

              <div class="c2">
                <simple-frame :goodsObj="item" />
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
                        v-if="item.statusTrade == 3"
                        class="ui-commodity-num"
                        :treasure="item"
                      ></commodity-num> -->
                    </div>
                    <!--         <div class="account-name">
                      {{ $common.tranPayChannel(item.channel) }}
                    </div> -->
                  </div>

                  <div class="line-group">
                    <!--      <div class="author">
                      {{ item.author && item.author.nickname }}
                    </div> -->
                    <div class="money"></div>
                  </div>
                  <!--     <div class="top">
                    <div class="top-text">
                      <h1 class="hidden">{{ item.author&&item.author.nickname }}</h1>
                      <h2 class="hidden">{{ item.commodity&&item.commodity.name }}</h2>
                    </div>

                    <div class="amount">
                      <span> {{ $common.formatMoney(item.price) }}</span>
                      <i>x{{ item.amount }}</i>
                    </div>
                  </div> -->

                  <!--   <h2 class="line-group">订单号：<copy :txt="item.orderBuyNo" /></h2> -->
                </div>
              </div>

              <div class="c3">
                <div
                  v-if="item.statusSale == 1"
                  class="v1-btn-link blue"
                  @click="cancel(item)"
                >
                  取消发布
                </div>
                <div
                  v-if="item.statusSale == 1 || item.statusSale == 2"
                  class="v1-btn mycenter"
                  @click="$common.goPage(`/goods/${item.id}`, '_blank')"
                >
                  查看作品
                </div>
                <div
                  class="v1-btn mycenter"
                  @click="onRefund(item)"
                  v-if="soldStatus(item).isRefund"
                >
                  违约退赔
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="v1-pagination" style="padding-bottom: 10vh">
          <g-paging
            :pageChange="handleCurrentChange"
            :list="orderListResult.records"
            :pageSize="attentionListParam.pageSize"
            :current-page="orderListResult.current"
          />
        </div>
      </page-template>
    </div>
  </div>
</template>
<script>
// import empty from "@/components/v1/empty";
// import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";
import { soldStatus } from "../components/sold-status.js";
export default {
  components: { mHeader },
  props: {
    orderListResult: {
      type: Object,
    },
    showEmpty: Boolean,
    type: String, //我买到的，我发布的，我卖出的
    searchOption: {
      type: Object,
    },
  },
  data() {
    return {
      loading: true,
      activeTab: 0,
      attentionListParam: {
        pageCount: 1,
        pageSize: 12,
        type: this.$route.params.type,
      },
      attentionListResult: null,
    };
  },
  computed: {},
  watch: {
    async activeTab(val, oldVal) {
      this.$refs.PageT.showLoading();
      await this.$parent.search(
        this.type,
        this.searchOption[this.type][val].value
      );
      this.$refs.PageT.hideLoading();
    },
  },
  created() {},
  methods: {
    soldStatus(data) {
      return soldStatus(data);
    },
    onRefund(data) {
      this.$parent.listenRefund(data);
    },
    handleCurrentChange(val) {
      this.$parent.handleCurrentChange(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.com-name {
  flex: 1;
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
          color: #333;
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
          background: #e5e5e5;
          border-radius: 0.36rem;
          text-align: center;
          font-size: 0.28rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.7);
        }
      }
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mobile-mine-buy {
    background: #fafafa;
    padding-top: 1.08rem;
    .loading {
      height: 8rem;
    }

    .people-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .v1-people-card {
        width: 3.24rem;
        height: 4.72rem;
        margin-bottom: 0.34rem;
        &:nth-child(odd) {
          margin-left: 0.34rem;
        }
        &:nth-child(even) {
          margin-right: 0.34rem;
        }
      }
    }
  }
}
</style>
