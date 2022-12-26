<template>
  <div>
    <div class="mode-mobile"><m-header :title="'我发布的'" /></div>
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
      <page-template
        ref="PageT"
        :is_empty="
          !(orderListResult.records && orderListResult.records.length > 0)
        "
      >
        <div class="page-common-card">
          <div class="m-tool">
            <div class="main" v-if="Number(releaseListParam.statusSale) == 1">
              <div>
                <span class="batch-cancel" @click="$parent.toggleBatchStatus">{{
                  batchStatus ? "退出批量取消" : "批量取消"
                }}</span>
              </div>
              <div>
                <div
                  class="batch-btn-wrap"
                  @click="$parent.onToggleBatch"
                  v-if="batchStatus"
                >
                  全选<span
                    class="icon-checkbox icon-checkbox-default"
                    :class="{ 'icon-checkbox-selected-bg': batchSelectStatus }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="commoncard-list">
            <div
              class="commoncard-item"
              v-for="(item, index) in orderListResult.records"
              :key="index"
              @click="$parent.select(item, index)"
              :class="{ 'trade-item-selected': item.selected }"
            >
              <div class="c1">
                <div class="info">
                  <div class="time">{{ item.createTime }}</div>
                  <div class="wmiddle">
                    <div
                      class="state"
                      v-if="item.approve && item.approve.statusAudit == 2"
                    >
                      <span class="icon examine-fail" />
                      审核被拒绝({{ item.approve.auditMessage }})
                    </div>

                    <div class="state" v-if="item.statusSale == 0">
                      <span class="icon examine" />审核中
                    </div>
                    <div class="state" v-else-if="item.statusSale == 1">
                      <span class="icon examine-success" />审核通过
                    </div>
                    <div class="state" v-else-if="item.statusSale == 2">
                      <span class="icon" />已售罄
                    </div>
                    <div class="state" v-else-if="item.statusSale == 3">
                      <span class="icon examine-cancel" />已取消
                    </div>
                    <div class="state" v-else-if="item.statusSale == 4">
                      <span class="icon" />
                      被拒绝寄售
                    </div>
                    <div class="state" v-else-if="item.statusSale == 5">
                      <span
                        v-if="item.presaleInfo && item.presaleInfo.status == 4"
                        >被锁定 待付定金</span
                      >
                      <span
                        v-else-if="
                          item.presaleInfo && item.presaleInfo.status == 1
                        "
                        >被锁定 待付尾款</span
                      >
                      <span v-else>被锁定</span>
                    </div>
                    <div class="state" v-else-if="item.statusSale == 11">
                      <span
                        v-if="item.presaleInfo && item.presaleInfo.status == 3"
                        >已关闭 退款成功</span
                      >
                      <!--       <span
                        v-else-if="
                          item.presaleInfo && item.presaleInfo.status == 2
                        "
                        >已关闭 尾款支付超时</span
                      > -->
                      <span
                        v-else-if="
                          item.presaleInfo &&
                          item.presaleInfo.status == 1 &&
                          item.presaleInfo.statusCancel == 2
                        "
                        >已关闭 尾款支付超时</span
                      >
                      <span
                        v-else-if="
                          item.presaleInfo &&
                          item.presaleInfo.status == 1 &&
                          item.presaleInfo.statusCancel == 3
                        "
                        >已关闭 主动退款</span
                      >
                      <span
                        v-else-if="
                          item.presaleInfo &&
                          item.presaleInfo.status == 1 &&
                          item.presaleInfo.statusCancel == 4
                        "
                        >已关闭 买家取消</span
                      >
                      <span v-else>已关闭</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    class="icon-checkbox icon-checkbox-default"
                    :class="{ 'icon-checkbox-selected': item.selected }"
                    v-if="batchStatus"
                  ></span>
                </div>
              </div>

              <div class="c2">
                <div class="img">
                  <simple-frame :goodsObj="item" />
                </div>
                <div class="info">
                  <div class="top">
                    <div class="top-text">
                      <h1 class="hidden">
                        {{ item.commodity && item.commodity.name }}
                      </h1>
                      <!--       <commodity-num
                        class="ui-commodity-num"
                        :treasure="item"
                      ></commodity-num> -->
                      <h2 class="hidden">
                        {{ item.author && item.author.nickname }}
                      </h2>
                    </div>

                    <div class="amount">
                      <span> {{ $common.formatMoney(item.price) }}</span>
                      <!--         <i>x{{ item.amount }}</i> -->
                    </div>
                  </div>

                  <!--        <h2>发布单号：<copy :txt="item.saleRecordNo" /></h2> -->
                </div>
              </div>

              <div class="c3 btn-group">
                <div>
                  <div
                    v-if="item.statusSale == 1 || item.statusSale == 0"
                    class="v1-btn mycenter"
                    @click.stop="cancel(item)"
                  >
                    取消发布
                  </div>
                </div>

                <div>
                  <div
                    v-if="
                      item.statusSale == 1 ||
                      item.statusSale == 2 ||
                      item.statusSale == 3
                    "
                    class="v1-btn mycenter"
                    @click.stop="$parent.seeGoods(item)"
                  >
                    查看作品
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="m-selected-info" v-if="batchStatus">
          <div class="txt">已选择：{{ cancelList.length }}</div>
          <div
            class="btn"
            :class="{ disabled: cancelList.length <= 0 }"
            @click="$parent.batchSubmit"
          >
            确定
          </div>
        </div>
        <div class="v1-pagination" style="padding-bottom: 10vh">
          <g-paging
            :pageChange="handleCurrentChange"
            :list="orderListResult.records"
            :pageSize="10"
            :current-page="orderListResult.current"
          />
          <!--    <div
            class="page-icon"
            :class="{
              selected: prevStatus && releaseListParam.pageCount !== 1,
            }"
            @click="$parent.onPrev"
          >
            <span class="icon icon-left" />
            上一页
          </div>
          <div
            class="page-icon"
            :class="{ selected: nextStatus }"
            @click="$parent.onNext"
          >
            下一页
            <span class="icon icon-right" />
          </div> -->
        </div>
      </page-template>
    </div>
  </div>
</template>
<script>
// import empty from "@/components/v1/empty";
// import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { mHeader },
  props: {
    orderListResult: {
      type: Object,
    },
    cancelList: {
      type: Array,
    },
    releaseListParam: {
      type: Object,
    },
    batchSelectStatus: {
      type: Boolean,
    },
    batchStatus: {
      type: Boolean,
    },
    type: String, //我买到的，我发布的，我卖出的
    searchOption: {
      type: Object,
    },
    prevStatus: {
      type: Boolean,
    },
    nextStatus: {
      type: Boolean,
    },
  },
  data() {
    return {
      loading: true,
      showEmpty: false,
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
    handleCurrentChange(val) {
      this.$parent.handleCurrentChange(val);
    },
    cancel(item) {
      this.$parent.cancel(item);
    },
  },
};
</script>
<style lang="scss" scoped>
.ui-commodity-num {
  margin-bottom: 0.1rem;
}
.page-icon {
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0 10px;
  margin-left: 10px;
  cursor: pointer;
  user-select: none;
  color: rgba(0, 0, 0, 0.2);
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .icon-left {
    background-image: url("//static.theone.art/pc/mine/icon-left.png");
  }
  .icon-right {
    background-image: url("//static.theone.art/pc/mine/icon-right.png");
  }
  &.selected {
    color: #397fe7;
    .icon-left {
      background-image: url("//static.theone.art/pc/mine/icon-left-selected.png");
    }
    .icon-right {
      background-image: url("//static.theone.art/pc/mine/icon-right-selected.png");
    }
  }
}
.page-common-card {
  padding-bottom: 0.8rem;
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
        .icon-checkbox {
          margin-left: 0.4rem;
        }
        .info {
          display: flex;
          justify-content: space-between;
          flex: 1;
        }
        .time {
          font-size: 0.24rem;
          font-weight: 400;
          color: rgba($color: #000000, $alpha: 0.4);
        }
        .state {
          font-size: 0.24rem;
          font-weight: 400;
          color: rgba($color: #000000, $alpha: 0.7);
          display: flex;
          align-items: center;
          .icon {
            width: 0.28rem;
            height: 0.28rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            display: inline-block;
            margin-right: 0.1rem;
          }
          .examine-fail {
            background-image: url("//static.theone.art/pc/images/pic-home/examine-fail.png");
          }
          .examine {
            background-image: url("//static.theone.art/pc/images/pic-home/examine.png");
          }
          .examine-cancel {
            background-image: url("//static.theone.art/pc/images/pic-home/examine-cancel.png");
          }
          .examine-success {
            background-image: url("//static.theone.art/pc/images/pic-home/examine-success.png");
          }
          /*  &.finish {
            color: rgba($color: #000000, $alpha: 0.7);
          }
          &.cancel {
            color: rgba($color: #000000, $alpha: 0.4);
          } */
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
          .top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
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
      .btn-group {
        justify-content: space-between;
      }
    }
  }
}
.m-selected-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0.3rem;

  .txt {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    padding-right: 16px;
  }
  .btn {
    width: 96px;
    line-height: 30px;
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 15px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
  }
  .disabled {
    background: #e5e5e5;
    color: rgba(0, 0, 0, 0.7);
  }
}
.trade-item-selected {
  border: 1px solid #e61f1a !important;
}
.title-line {
  justify-content: space-between;
  .info {
    display: flex;
    align-items: center;
  }
}
.icon-checkbox {
  width: 18px;
  height: 18px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: inline-block;
  cursor: pointer;
}
.m-tool {
  padding: 0 0.3rem;
  height: 0.8rem;
  display: flex;
  align-items: center;

  .main {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.batch-cancel {
  font-size: 14px;
  font-weight: 500;
  color: #397fe7;
  text-decoration: underline;
  cursor: pointer;
}
.batch-btn-wrap {
  display: flex;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  .icon-checkbox {
    margin-left: 9px;
  }
}
.v1-trade {
  padding-top: 0;
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
  .top-text {
    width: 69%;
  }
  .info {
    width: 0;
  }
}
.icon-checkbox-default {
  background-image: url("//static.theone.art/pc/icons/checkbox.png");
}
.icon-checkbox-selected {
  background-image: url("//static.theone.art/pc/icons/checkbox-selected.png");
}
.icon-checkbox-selected-bg {
  background-image: url("//static.theone.art/pc/icons/checkbox-selected-bg.png");
}
</style>
