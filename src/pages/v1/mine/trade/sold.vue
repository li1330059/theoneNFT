/* 我卖出的 */
<template>
  <div class="page-mine-release page-min-width">
    <div class="mode-PC">
      <div class="v1-tabs">
        <ul>
          <li
            :class="{ active: orderListParam.statusTrade == item.value }"
            v-for="(item, index) in searchOption.statusTrade"
            :key="index"
          >
            <a @click="search('statusTrade', item.value)">{{ item.name }}</a>
          </li>
        </ul>
        <div class="v1-font-message">
          历史订单正在搬家赶来的路上，路途遥远请耐心等待哦
        </div>
      </div>
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <empty v-else-if="showEmpty"></empty>
      <div v-else>
        <div class="v1-trade">
          <div
            class="trade-item"
            v-for="(item, index) in orderListResult.records"
            :key="index"
          >
            <div class="title-line">
              <div class="time">{{ item.createTime }}</div>
              <div class="title">单据编号：</div>
              <copy :txt="item.orderBuyNo" />
            </div>
            <div class="content-line">
              <div class="goods goods-flex">
                <div class="goods">
                  <simple-frame :goodsObj="item" />
                  <div class="info">
                    <h1>
                      <div class="txt hidden-1">
                        {{ (item.commodity && item.commodity.name) || "" }}
                      </div>
                      <div class="wsmall">
                        X {{ (item.commodity && item.amount) || "" }}
                      </div>
                    </h1>
                    <!--     <commodity-num class="ui-commodity-num" :treasure="item" v-if="item.statusTrade == 3"></commodity-num> -->
                    <p class="hidden">
                      {{
                        (item.commodity &&
                          item.author &&
                          item.author.nickname) ||
                        ""
                      }}
                    </p>
                  </div>
                </div>
                <!--    <div class="wsmall">X {{ item.amount }}</div> -->
              </div>
              <!-- <div class="wsmall">
                <div class="hidden-more">
                  买家：{{ item.buyUser && item.buyUser.nickname }}
                </div>
              </div> -->
              <div class="price wsmall">
                <div
                  class="v1-price"
                  v-if="item.tags && item.tags.search(/presale/gi) != -1"
                >
                  <!--      <span v-if="item.depositObj.statusTrade==0"> </span>
                  <span> item.depositObj</span> -->
                  {{ $common.formatMoney(item.pricePay) }}
                  <!--     <div class="account-name">
                    {{ $common.tranPayChannel(item.channel) }}
                  </div> -->
                </div>
                <div class="v1-price" v-else>
                  {{ $common.formatMoney(item.pricePay) }}
                  <!--   <div class="account-name">
                    {{ $common.tranPayChannel(item.channel) }}
                  </div> -->
                </div>
              </div>
              <div class="wmiddle">
                <div v-if="item.tags && item.tags.search(/presale/gi) != -1">
                  <sold-status :data="item" @refund="listenRefund" />
                </div>
                <div v-else>
                  <div v-if="item.statusTrade == 0">
                    待支付
                    <br />
                    下单时间：{{ item.createTime }}
                  </div>
                  <div v-if="item.statusTrade == 1">
                    待发货
                    <br />
                    下单时间：{{ item.createTime }}
                  </div>
                  <div v-if="item.statusTrade == 2">
                    已发货
                    <br />
                    下单时间：{{ item.createTime }}
                  </div>
                  <div v-if="item.statusTrade == 3">
                    已完成
                    <br />
                    支付时间：{{ item.payTime }}
                  </div>
                  <div v-if="item.statusTrade == 4">
                    已取消
                    <br />
                    下单时间：{{ item.createTime }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="v1-pagination">
          <g-paging
            :pageChange="handleCurrentChange"
            :pageSize="orderListParam.pageSize"
            :list="pListInfo.records"
            :current-page="orderListResult.current"
          />
        </div>
      </div>
    </div>

    <div class="mode-mobile">
      <mSold
        :orderListResult="orderListResult"
        :searchOption="searchOption"
        :showEmpty="showEmpty"
        type="statusTrade"
      />
    </div>
    <refund-dialog :goodsObj="currentGoodsObj" ref="RefundRef" />
  </div>
</template>
<script>
import SoldStatus from "./components/sold-status.vue";
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import mSold from "./v1/sold";
import RefundDialog from "../components/refund-dialog.vue";
export default {
  components: { empty, loading, mSold, RefundDialog, SoldStatus },
  data() {
    return {
      isShowRefund: false, //是否显示退款
      loading: true,
      showEmpty: false,
      pListInfo: {},
      currentGoodsObj: {},
      searchOption: {
        statusTrade: [
          { name: "已完成", value: "3" },
          { name: "待支付", value: "0" },
          { name: "已关闭", value: "5" },
          { name: "全部", value: "" },
        ],
      },
      orderListParam: {
        pageCount: 1,
        pageSize: 12,
        statusTrade: "3",
      },
      orderListResult: {
        orders: [],
        records: [],
      },
    };
  },
  created() {
    this.orderList();
  },
  methods: {
    listenRefund(data) {
      //触发退款
      this.currentGoodsObj = data;
      this.$confirm(
        `<div>违约退赔需<span style="color:rgba(230, 31, 26, 1)">退一赔一</span>，是否继续退赔？</div>
        <div>您知悉，如您存在多次、高频违约或恶意解约的行为，您的账号可能被判定为风险账号。</div>`,
        "提示",
        {
          customClass: "confirm-btn-between",
          confirmButtonText: "继续退赔",
          cancelButtonText: "我再想想",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(async () => {
          this.$refs.RefundRef.init();
        })
        .catch(() => {});
    },
    // 我发布的列表
    async orderList() {
      let result = await this.$api.service.orderBuy_listSale(
        this.orderListParam
      );

      this.loading = false;
      this.showEmpty = false;
      if (result && result.data.code == 200) {
        console.log(this.pListInfo);
        this.pListInfo = result.data.data;
        if (result.data.data.records && result.data.data.records.length > 0) {
          let listObj = result.data.data;
          listObj.records = listObj.records.map((item) => {
            item.depositObj = ""; //定金
            item.balanceObj = ""; //尾款
            item.refundObj = ""; //退款
            if (item.orderBuySubs && item.orderBuySubs.length > 0) {
              item.depositObj = item.orderBuySubs.find(
                (item) => item.orderType == 10
              );
              item.balanceObj = item.orderBuySubs.find(
                (item) => item.orderType == 20
              );
              item.refundObj = item.orderBuySubs.find(
                (item) => item.orderType == 30
              );
            }

            return item;
          });
          this.orderListResult = listObj;
          console.log(this.orderListResult);
        } else {
          if (this.orderListParam.pageCount == 1) {
            this.showEmpty = true;
          }
        }
        /*  this.showEmpty = !this.orderListResult.records.length > 0; */
      } else {
        this.$message({
          message: "获取数据失败",
          type: "error",
        });
      }
    },
    // 翻页
    handleCurrentChange(val) {
      this.orderListParam.pageCount = val;
      this.orderList();
    },
    async search(type, val) {
      this.orderListParam.pageCount = 1;
      this.orderListParam.statusTrade = val;
      await this.orderList();
    },
  },
};
</script>
<style lang="scss" scoped>
.page-mine-release {
  .loading {
    height: 500px;
  }
}
.wsmall {
  > div {
    width: 100%;
  }
}
.content-line {
  .goods {
    width: 0;
    .cover {
      min-width: 70px;
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
  }
  .goods-flex {
    min-width: 300px;
  }
  .info {
    width: 70%;
  }
}
</style>
