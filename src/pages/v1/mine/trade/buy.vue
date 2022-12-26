<template>
  <div class="page-mine-release page-min-width">
    <div class="mode-PC">
      <div class="v1-tabs">
        <ul>
          <li
            :class="{ active: index == currentIdx }"
            v-for="(item, index) in searchOption.statusTrade"
            :key="index"
          >
            <a @click="search(item, index)">{{ item.name }}</a>
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
              </div>
              <div class="price wsmall">
                <div class="v1-price">
                  <span> {{ $common.formatMoney(createPayMoney(item)) }}</span>
                  <!-- 
                  <div class="account-name">
                    {{ $common.tranPayChannel(item.channel) }}
                  </div> -->
                </div>
              </div>
              <div class="wsmall">
                <p class="hidden-more" v-if="item.saleUser.type == 1">
                  卖家：官方
                </p>
              </div>
              <div class="wmiddle padding-sm">
                <div v-if="item.statusTrade == 0">
                  <span
                    v-if="item.depositObj && item.depositObj.statusTrade == 0"
                  >
                    待付定金
                  </span>
                  <span
                    v-else-if="
                      item.balanceObj && item.balanceObj.statusTrade == 0
                    "
                  >
                    待付尾款
                  </span>
                  <span v-else>待支付</span>
                </div>
                <div v-if="item.statusTrade == 3">
                  已完成<br />{{ item.payTime }}
                </div>
                <div v-if="item.statusTrade == 4">
                  已取消<br />
                  <span v-if="item.cancelTime">{{ item.cancelTime }}</span>
                </div>
                <div v-if="item.statusTrade == 5">
                  已关闭
                  <span
                    v-if="item.refundObj && item.refundObj.statusTrade == 1"
                  >
                    有退款
                  </span>
                  <span v-else> 尾款超时 </span>
                </div>
                <div
                  class="prepay-date"
                  v-if="
                    item.statusTrade == 0 &&
                    item.balanceObj &&
                    item.balanceObj.statusTrade == 0
                  "
                >
                  尾款支付时间：{{ item.balanceObj.limitStartTime }} -
                  {{ item.balanceObj.limitEndTime }}
                </div>
              </div>
              <!--   按钮组 -->
              <div class="operate">
                <div
                  v-if="
                    item.statusTrade == 3 ||
                    item.statusTrade == 4 ||
                    item.statusTrade == 5
                  "
                  class="v1-btn mycenter"
                  @click="seeOrder(item)"
                >
                  查看订单
                </div>

                <div
                  v-if="
                    item.statusTrade == 5 &&
                    item.refundObj &&
                    item.refundObj.statusTrade == 1
                  "
                >
                  退款金额：{{ $common.formatMoney(reMoney(item)) }}
                </div>
                <div v-if="item.statusTrade == 0">
                  <div
                    v-if="item.depositObj && item.depositObj.statusTrade == 0"
                    class="v1-btn mycenter"
                    @click="onOrderPay(item)"
                  >
                    支付定金
                  </div>
                  <div
                    v-else-if="
                      item.balanceObj && item.balanceObj.statusTrade == 0
                    "
                    class="v1-btn red mycenter"
                    @click="onOrderPay(item)"
                  >
                    支付尾款
                  </div>
                  <div class="v1-btn mycenter" @click="onOrderPay(item)" v-else>
                    支付
                  </div>
                  <div
                    class="v1-btn-link blue"
                    @click="onOrderCancel(item)"
                    v-if="
                      (item.depositObj && item.depositObj.statusTrade == 0) ||
                      !item.depositObj
                    "
                  >
                    取消
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="v1-pagination">
          <g-paging
            :pageChange="handleCurrentChange"
            :list="orderListResult.records"
            :pageSize="orderListParam.pageSize"
            :current-page="orderListResult.current"
          />
        </div>
      </div>
    </div>
    <div class="mode-mobile">
      <m-buy
        :orderListResult="orderListResult"
        :searchOption="searchOption"
        type="statusTrade"
      />
    </div>
  </div>
</template>
<script>
import buyStatus from "./components/buy-status.vue";
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import mBuy from "./v1/buy";
const BigNumber = require("bignumber.js");
const carMessage = "PC端购物车功能暂未开放，请前往app操作";
export default {
  components: { empty, loading, mBuy },
  data() {
    return {
      loading: true,
      showEmpty: false,
      currentIdx: 0,
      searchOption: {
        statusTrade: [
          { name: "已完成", value: "3" },
          { name: "待付款", value: "0" },
          { name: "已取消", value: "4" },
          { name: "已关闭", value: "5" },
          { name: "全部", value: "" },
        ],
      },
      orderListParam: {
        pageCount: 1,
        pageSize: 12,
        statusTrade: 3,
      },
      orderListResult: {
        orders: [],
        records: [],
      }, //订单列表
    };
  },

  created() {
    this.currentIdx = this.$route.query.page || 0;
    this.orderList();
  },
  methods: {
    seeOrder(item) {
      if (item.tags && item.tags.search(/shoppingCart/gi) == -1) {
        this.$confirm(carMessage, "提示", {
          customClass: "mobile-btn-center",
          confirmButtonText: "我知道了",
          showCancelButton: false,
        })
          .then(async () => {})
          .catch(() => {});
        return;
      }
      this.$common.goPage(`/mine/order/${item.id}`, "_blank");
    },
    reMoney(item) {
      //退款金额
      return new BigNumber(item.refundObj.presaleAmountExt.refundAmount).plus(
        item.refundObj.presaleAmountExt.depositAmount
      );
    },
    createPayMoney(item) {
      return item.price;
      //返回商品价格
      if (
        item.statusTrade == 0 &&
        item.depositObj &&
        item.depositObj.statusTrade == 0
      ) {
        return item.depositObj.presaleAmountExt.depositAmount;
      }
      if (
        item.statusTrade == 0 &&
        item.balanceObj &&
        item.balanceObj.statusTrade == 0
      ) {
        return item.balanceObj.presaleAmountExt.balanceAmount;
      }
      return item.price;
    },
    // 我发布的列表
    check(item) {
      //return item.tags.search(/presale/gi) == -1;
      return !(item.tags && item.tags.search(/presale/gi) !== -1);
    },
    formatData(data) {
      let listObj = data;
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
      return listObj;
    },

    async orderList() {
      this.orderListParam.statusTrade =
        this.searchOption.statusTrade[this.currentIdx].value;
      /*        this.orderListParam.statusSale =
        this.searchOption.statusTrade[this.currentIdx].statusSale || "";  */
      let result = await this.$api.service.orderBuy_list(this.orderListParam);
      this.loading = false;
      /*       let result = {
        data: {
          code: 200,
          message: "成功",
          data: {
            records: [
              {
                orderBuyNo: "OB1588806244058083329",
                amount: 1,
                price: "3.00",
                pricePay: "0.00",
                pricePayThird: "0.00",
                pricePayWallet: "0.00",
                typePay: null,
                typePayThird: null,
                typeCancel: null,
                statusPay: 0,
                statusTrade: 0,
                statusPayBig: 0,
                payTime: null,
                cancelTime: null,
                createTime: "2022-11-05 16:11:41",
                commodity: {
                  name: "预定金测试01",
                  cover:
                    "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermarkResize/2ce0aa4d8dabefac40968325f56bed24/75d32d7b05fa435960f79b83939e42d6-16673919838010.9.jpg",
                  coverGifVideo: null,
                  coverAppGifVideo: null,
                  chainName: null,
                  chainContract: null,
                  tradeHash: null,
                  contractAddress: null,
                  nftId: null,
                  typeFile: 1,
                  amountSku: 40,
                  statusNumber: 1,
                  id: "b1dc41532f8a642e4aeeff0e632d9c11",
                },
                author: {
                  name: "夏艺丹",
                  nickname: "夏夏",
                  cover:
                    "https://qa-theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2022-10-12/c19d2bd58735d609b7dabb607cb09a8b1665553392838.JPG",
                  id: "2ce0aa4d8dabefac40968325f56bed24",
                },
                saleUser: { nickname: "唯*****", type: 2 },
                channel: null,
                commoditySku: null,
                onlineType: null,
                sendType: null,
                honorFlag: 0,
                orderBuySubs: null,
                tags: "order_cancel_msg,shoppingCart",
                id: "dfa6d86c3b9065045f4b20353a83340f",
              },
            ],
            total: 0,
            size: 12,
            current: 1,
            pages: 0,
          },
        },
      }; */

      if (result.data.code == 200) {
        this.orderListResult = this.formatData(result.data.data);
        console.log(this.orderListResult);
      } else {
        this.$message.warning(result.data.message);
      }

      this.showEmpty = !this.orderListResult.records.length > 0;
    },
    // 翻页
    handleCurrentChange(val) {
      this.orderListParam.pageCount = val;
      this.orderList();
    },
    // 搜索
    async search(item, idx) {
      this.orderListParam.pageCount = 1;
      this.currentIdx = idx;
      await this.orderList();
    },
    // 取消支付
    onOrderCancel(item) {
      if (item.tags && item.tags.search(/shoppingCart/gi) != -1) {
        this.$confirm(carMessage, "提示", {
          customClass: "mobile-btn-center",
          confirmButtonText: "我知道了",
          showCancelButton: false,
        })
          .then(async () => {})
          .catch(() => {});
        return;
      }
      let name = item.commodity ? item.commodity.name : "神秘商品";
      this.$confirm(`您将取消【${name}】的订单信息?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          let result = await this.$api.service.orderBuy_cancel({
            id: item.id,
            orderBuyNo: item.orderBuyNo,
          });
          if (result.data.code == 200) {
            this.$message.success(`您已成功取消对【${name}】的出售信息！`);
            this.orderList();
          } else {
            this.$message.error(result.data.message);
          }
        })
        .catch(() => {});
    },
    // 去支付
    onOrderPay(item) {
      if (item.tags && item.tags.search(/shoppingCart/gi) != -1) {
        this.$confirm(carMessage, "提示", {
          customClass: "mobile-btn-center",
          confirmButtonText: "我知道了",
          showCancelButton: false,
        })
          .then(async () => {})
          .catch(() => {});
        return;
      }
      if (item.tags && item.tags.search(/presale/gi) != -1) {
        if (item.balanceObj && item.balanceObj.limitEndTime) {
          const endTime = new Date(
            item.balanceObj.limitEndTime.replace(/\-/gi, "/")
          ).getTime();
          const nowTime = new Date().getTime();
          if (nowTime - endTime > 0) {
            this.$message.warning("已超过支付最后时间");
            this.orderList();
            return;
          }
        }
      }

      this.$router.push(`/mine/trade/pay/${item.id}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.prepay-date {
  font-size: 12px;
  line-height: 16px;
  color: #e61f1a;
}
.v1-trade {
  overflow-x: auto;
}
.copy {
  cursor: pointer;
}
.page-mine-release {
  .loading {
    height: 500px;
  }
}
.wsmall span {
  display: inline-block;
  width: 100%;
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
