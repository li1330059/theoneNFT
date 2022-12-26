<template>
  <div class="page-order-detail">
    <m-head title="订单详情"></m-head>
    <div class="v1-main">
      <div
        class="send-cont"
        v-if="
          orderInfoResult &&
          orderInfoResult.postInfo &&
          orderInfoResult.postInfo.sendType
        "
      >
        <div
          class="address-cont"
          v-if="
            orderInfoResult.postInfo.sendType == 2 ||
            orderInfoResult.postInfo.sendType == 3
          "
        >
          <div class="label">收货地址：</div>
          <div class="icon-address"></div>
          <div class="info">
            <span class="mr-12">{{ orderInfoResult.postInfo.name }}</span
            ><span class="mr-12">{{ orderInfoResult.postInfo.phone }}</span
            ><span class="address-text">{{
              orderInfoResult.postInfo.address
            }}</span>
          </div>
        </div>
        <div class="address-cont" v-if="orderInfoResult.statusPost == 1">
          <div class="info-text">
            您的实体画作已装裱完成！请凭订单详情尽快与展览会工作人员联系，带走您的专属实体画作。
          </div>
        </div>
        <div class="other-info">
          <div class="info-item">
            <div
              class="label f-w"
              v-if="orderInfoResult.postInfo.sendType == 1"
            >
              用户自提
            </div>
            <div
              class="label f-w"
              v-else-if="orderInfoResult.postInfo.sendType == 2"
            >
              邮寄到付
            </div>
            <div
              class="label f-w"
              v-else-if="orderInfoResult.postInfo.sendType == 3"
            >
              邮寄现付
            </div>
            <div class="info warn" v-if="orderInfoResult.statusPost == 1">
              待自提
            </div>
            <div
              class="info warn-r"
              v-else-if="orderInfoResult.statusPost == 2"
            >
              已自提
            </div>
            <div class="info warn" v-else-if="orderInfoResult.statusPost == 3">
              待邮寄
            </div>
            <div
              class="info warn-r"
              v-else-if="orderInfoResult.statusPost == 4"
            >
              已邮寄
            </div>
          </div>
          <div class="info-item" v-if="orderInfoResult.postInfo.sendType != 1">
            <div class="label">物流信息：</div>
            <div class="info" v-if="!orderInfoResult.postInfo.logistics">
              暂无
            </div>
            <div class="info copy" v-else>
              <copy :txt="orderInfoResult.postInfo.logistics" />
            </div>
          </div>
          <div class="info-item">
            <div class="label">更新时间：</div>
            <div class="info">{{ orderInfoResult.postInfo.updateTime }}</div>
          </div>
        </div>
      </div>

      <div class="loading" v-if="loading">
        <loading></loading>
      </div>

      <empty v-else-if="showEmpty"></empty>

      <div class="order-info" v-else-if="orderInfoResult">
        <h1 class="phone-hide">
          <span class="order-des">订单信息</span
          ><copy :txt="orderInfoResult.orderBuyNo" />
        </h1>

        <div class="goods-info">
          <div class="img-wrap">
            <goods-frame
              :goods-info="orderInfoResult"
              :index="index"
              :isShowPreview="true"
              :isShowLike="false"
              :isShowGoodsName="false"
              :isShowNumber="false"
              :isShowPrepaySign="true"
              @listenCoverClick="listenCoverClick"
            >
              <span slot="footer"></span>
            </goods-frame>
          </div>
          <div class="info">
            <div class="goods-name-wrap">
              <div class="left">
                <div class="goods-name hidden-1">
                  {{ orderInfoResult.commodity.name }}
                </div>
                <div>
                  <!--           <commodity-num
                    v-for="(item,idx) in orderInfoResult.commoditySkuList" :key="idx"
                    class="ui-commodity-num"
                    :treasure="{...orderInfoResult,commoditySku:item}"
                  ></commodity-num> -->
                </div>
              </div>

              <h2 class="price">
                {{ $common.formatMoney(orderInfoResult.pricePay) }}
              </h2>
            </div>
            <div class="line phone-line">
              <h1>价格</h1>
              <p></p>
              <h2 class="price">
                {{ $common.formatMoney(orderInfoResult.pricePay) }}
              </h2>
            </div>
            <div class="line">
              <h1>艺术家</h1>
              <p>
                {{ orderInfoResult.author && orderInfoResult.author.nickname }}
              </p>
              <h3>
                <div>X {{ orderInfoResult.amount }}</div>
              </h3>
            </div>
            <div class="line" v-if="orderInfoResult.saleUser">
              <h1>寄售方</h1>
              <p v-if="orderInfoResult.saleUser.type == 1">官方</p>
              <p v-else>{{ orderInfoResult.saleUser.nickname }}</p>
            </div>
            <div class="line pc-hide">
              <h1 class="order-des">订单信息</h1>
              <p><copy :txt="orderInfoResult.orderBuyNo" /></p>
            </div>

            <div class="line" v-if="orderInfoResult.commodity.chainName">
              <h1>认证网络</h1>
              <p>{{ orderInfoResult.commodity.chainName }}</p>
            </div>
            <div class="line" v-if="orderInfoResult.commodity.contractAddress">
              <h1>合约地址</h1>
              <p>
                <copy
                  v-if="$authInfomation.contractAddress(orderInfoResult)"
                  class="m-copy-blue"
                  @listen="
                    $authInfomation.goContractAddress(
                      $authInfomation.getChainName(orderInfoResult),
                      $authInfomation.contractAddress(orderInfoResult),
                      $authInfomation.getChainContract(orderInfoResult)
                    )
                  "
                  :is-full="false"
                  :short="6"
                  :txt="$authInfomation.contractAddress(orderInfoResult)"
                />
                <span v-else>上链确认中</span>
              </p>
            </div>
          </div>
        </div>
        <div class="order-money">
          <div class="line">
            <h1>
              <span>{{ orderInfoResult.amount }}</span
              >件商品，总商品金额：
            </h1>
            <p
              class="warning-color"
              :class="{
                'through-line':
                  orderInfoResult.discountAmountInfo.soldDiscountInfo &&
                  orderInfoResult.discountAmountInfo.soldDiscountInfo.length >
                    0,
              }"
            >
              {{ $common.formatMoney(orderInfoResult.price) }}
            </p>
          </div>
          <div v-if="isPrepay">
            <div class="line">
              <h1>定金：</h1>
              <p class="warning-color">
                {{
                  $common.formatMoney(
                    depositAmount.presaleAmountExt.depositAmount
                  )
                }}
                (
                <span v-if="orderInfoResult.statusTrade == 4">未付款</span>
                <span v-else>
                  <span v-if="depositAmount.statusTrade == -1">未付款</span>
                  <span v-else-if="depositAmount.statusTrade == 0">待支付</span>
                  <span v-else-if="depositAmount.statusTrade == 1">已付款</span>
                  <span v-else-if="depositAmount.statusTrade == 2">已退款</span>
                  <span v-else-if="depositAmount.statusTrade == 3">已取消</span>
                  <span v-else>未付款</span>
                </span>

                )
              </p>
            </div>
            <div
              class="line"
              v-if="
                depositAmount.statusTrade == 1 &&
                orderInfoResult.statusTrade !== 4
              "
            >
              <h1></h1>
              <p class="gray">
                结算渠道 | {{ $common.tranPayChannel(depositAmount.channel) }}
              </p>
            </div>
            <div class="line">
              <h1>尾款：</h1>
              <p class="warning-color">
                {{
                  $common.formatMoney(
                    balanceAmount.presaleAmountExt.balanceAmount
                  )
                }}
                (
                <span v-if="orderInfoResult.statusTrade == 4">未付款</span>
                <span v-else>
                  <span v-if="balanceAmount.statusTrade == -1">未付款</span>
                  <span v-else-if="balanceAmount.statusTrade == 0">待支付</span>
                  <span v-else-if="balanceAmount.statusTrade == 1">已付款</span>
                  <span v-else-if="balanceAmount.statusTrade == 2">已退款</span>
                  <span v-else-if="balanceAmount.statusTrade == 3">已取消</span>
                  <span v-else>未付款</span>
                </span>

                )
              </p>
            </div>
            <div
              class="line"
              v-if="
                balanceAmount.statusTrade == 1 &&
                orderInfoResult.statusTrade !== 4
              "
            >
              <h1></h1>
              <p class="gray">
                结算渠道 | {{ $common.tranPayChannel(balanceAmount.channel) }}
              </p>
            </div>

            <div class="blok-bar"></div>
            <div class="line">
              <h1>订单类型：</h1>
              <p class="">定金预售类型</p>
            </div>
          </div>

          <!--     <div class="line" v-if="orderInfoResult.pricePayWallet != 0">
            <h1>余额支付：</h1>
            <div class="down choose">
              <span v-if="orderInfoResult.pricePayWallet > 0">使用</span>
              <span v-else>不使用</span>
            </div>
          </div> -->
          <div class="line" v-if="orderInfoResult.appendPrice > 0">
            <h1>实体画作：</h1>
            <p class="warning-color">
              {{ $common.formatMoney(orderInfoResult.appendPrice) }}
            </p>
          </div>

          <div class="line" v-if="orderInfoResult.postPrice > 0">
            <h1>运费：</h1>
            <p class="warning-color">
              {{ $common.formatMoney(orderInfoResult.postPrice) }}
            </p>
          </div>
          <div class="line" v-if="isDiscount">
            <h1>
              使用【<span class="hidden-1 discount-names">{{
                discountNames
              }}</span
              >】：
            </h1>
            <p class="warning-color">
              -{{ $common.formatMoney(discountMoeny) }}
            </p>
          </div>
          <div class="line" v-if="isDiscount">
            <h1>使用余额：</h1>
            <p class="warning-color">
              {{ $common.formatMoney(orderInfoResult.pricePayWallet) }}
            </p>
          </div>
          <div v-if="!isPrepay">
            <div class="line" v-if="orderInfoResult.channel">
              <h1>结算渠道：</h1>
              <p>{{ $common.tranPayChannel(orderInfoResult.channel) }}</p>
            </div>
          </div>

          <div class="line" v-if="orderInfoResult.pricePayThird > 0">
            <h1>第三方付款额：</h1>
            <p class="money">
              {{ $common.formatMoney(orderInfoResult.pricePayThird) }}
            </p>
          </div>
          <div class="line" v-if="orderInfoResult.pricePayThird != 0">
            <h1>支付方式：</h1>
            <div class="down">
              <span
                v-if="
                  orderInfoResult.typePayThird == 0 ||
                  orderInfoResult.typePayThird == null
                "
                >钱包余额</span
              >
              <span v-if="orderInfoResult.typePayThird == 1">微信</span>
              <span v-if="orderInfoResult.typePayThird == 2">支付宝</span>
              <span v-if="orderInfoResult.typePayThird == 3">银行卡支付</span>
              <span v-if="orderInfoResult.typePayThird == 4">收银台支付</span>
            </div>
          </div>
          <div class="line">
            <h1>订单状态：</h1>
            <div class="" v-if="orderInfoResult.statusTrade == 0">
              <p v-if="orderInfoResult.statusPay == 0">待支付</p>
              <p v-else>待支付</p>
            </div>
            <div class="" v-else-if="orderInfoResult.statusTrade == 3">
              <!--     <p v-if="orderInfoResult.statusPay == 1">已支付</p> -->

              <p>已完成</p>
            </div>
            <div class="" v-else-if="orderInfoResult.statusTrade == 4">
              <p v-if="orderInfoResult.typeCancel == 1">超时取消</p>
              <p v-if="orderInfoResult.typeCancel == 2">您已主动取消订单</p>
              <p v-if="orderInfoResult.typeCancel == 3">订单被关闭</p>
            </div>
            <div class="" v-else-if="orderInfoResult.statusTrade == 5">
              <p v-if="balanceAmount.statusTrade == 4">已关闭 超时取消</p>
              <p
                v-if="
                  balanceAmount.statusTrade == 3 &&
                  breachAmount.statusTrade == 1
                "
              >
                已关闭 卖家主动退款
              </p>
            </div>
          </div>
          <div class="line">
            <h1>创建时间：</h1>
            <p>{{ orderInfoResult.createTime }}</p>
          </div>
          <div class="line" v-if="orderInfoResult.statusPay == 1">
            <h1>支付时间：</h1>
            <p>{{ orderInfoResult.payTime }}</p>
          </div>
          <div class="line" v-if="orderInfoResult.statusTrade == 4">
            <h1>取消时间：</h1>
            <p>{{ orderInfoResult.cancelTime }}</p>
          </div>
          <div
            v-if="
              isPrepay &&
              orderInfoResult.statusTrade == 5 &&
              balanceAmount.statusTrade == 3 &&
              breachAmount.statusTrade == 1
            "
          >
            <div class="blok-bar"></div>
            <div class="line">
              <h1><b>合计退赔：</b></h1>
              <p class="warning-color bold-money">
                {{ $common.formatMoney(refreseAmount) }}
              </p>
            </div>
            <div
              class="line"
              v-if="
                isPrepay &&
                orderInfoResult.statusTrade == 5 &&
                balanceAmount.statusTrade == 3 &&
                breachAmount.statusTrade == 1
              "
            >
              <h1></h1>
              <p class="gray">
                退回路径：{{ $common.tranPayChannel(breachAmount.channel) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import BigNumber from "bignumber.js";
export default {
  components: { loading, empty },
  data() {
    return {
      loading: true,
      showEmpty: false, //空数据
      orderInfoResult: null,
      presaleAmountExt: {}, //定金信息
    };
  },
  computed: {
    isPayDeposit() {
      return 1;
    },
    depositAmount() {
      //定金信息
      if (
        this.orderInfoResult.orderBuySubs &&
        this.orderInfoResult.orderBuySubs.length > 0
      ) {
        return this.orderInfoResult.orderBuySubs.find(
          (item) => item.orderType == 10
        );
      }
      return {};
    },
    balanceAmount() {
      //尾款信息
      if (
        this.orderInfoResult.orderBuySubs &&
        this.orderInfoResult.orderBuySubs.length > 0
      ) {
        return this.orderInfoResult.orderBuySubs.find(
          (item) => item.orderType == 20
        );
      }
      return {};
    },
    breachAmount() {
      //违约金信息
      if (
        this.orderInfoResult.orderBuySubs &&
        this.orderInfoResult.orderBuySubs.length > 0
      ) {
        return this.orderInfoResult.orderBuySubs.find(
          (item) => item.orderType == 30
        );
      }
      return {};
    },
    refreseAmount() {
      //退赔合计
      return new BigNumber(
        this.breachAmount.presaleAmountExt.depositAmount
      ).multipliedBy(2);
    },
    isPrepay() {
      return (
        this.orderInfoResult &&
        this.orderInfoResult.tags &&
        this.orderInfoResult.tags.search(/presale/) != -1
      );
    },
    discountNames() {
      const str = this.orderInfoResult.discountAmountInfo.soldDiscountInfo
        ? this.orderInfoResult.discountAmountInfo.soldDiscountInfo
            .map((item) => item.commodityName)
            .join(",")
        : "优惠卡";
      return str ? str : "优惠卡";
    },
    isDiscount() {
      return (
        this.orderInfoResult.discountAmountInfo.soldDiscountInfo &&
        this.orderInfoResult.discountAmountInfo.soldDiscountInfo.length > 0
      );
    },
    discountMoeny() {
      return new BigNumber(this.orderInfoResult.price).minus(
        this.orderInfoResult.discountAmountInfo.discountAmount
      );
    },
  },
  created() {
    let orderId = this.$route.params.id;
    if (orderId) {
      this.getOrderInfo(orderId);
    } else {
      this.$router.push({
        path: "/",
      });
    }
  },
  methods: {
    async getOrderInfo(orderId) {
      try {
        this.loading = true;
        let result = await this.$api.service.orderBuy_detail({
          id: orderId,
        });
        /*   let result = {
          data: {
            code: 200,
            message: "成功",
            data: {
              orderBuyNo: "OB1589194849574293505",
              amount: 1,
              price: "1.00",
              pricePay: "1.00",
              pricePayThird: "0.00",
              pricePayWallet: "0.00",
              typePay: null,
              typePayThird: null,
              typeCancel: null,
              statusPay: 1,
              statusTrade: 5,
              statusPost: null,
              payTime: "2022-11-06 17:58:45",
              cancelTime: null,
              createTime: "2022-11-06 17:55:52",
              finishTime: "2022-11-06 17:58:45",
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
              commoditySkuList: null,
              author: {
                name: "夏艺丹",
                nickname: "夏夏",
                cover:
                  "https://qa-theoneart-common.oss-cn-qingdao.aliyuncs.com/api/file/2022-10-12/c19d2bd58735d609b7dabb607cb09a8b1665553392838.JPG",
                id: "2ce0aa4d8dabefac40968325f56bed24",
              },
              saleUser: { nickname: "唯*****" },
              buyUser: { nickname: "唯艺6811" },
              channel: "yb",
              postInfo: null,
              discountAmountInfo: {
                soldDiscountInfo: null,
                discountAmount: null,
              },
              appendPrice: null,
              postPrice: null,
              honorFlag: 0,
              shopName: "正*****",
              orderBuySubs: [
                {
                  orderBuyNo: "OB1589194849574293505",
                  orderNoSub: "OBS1589195509766131713",
                  orderType: 30,
                  price: "1.00",
                  pricePayThird: "0.42",
                  transactionId: "1013202211060000004701457394",
                  statusPay: 1,
                  statusTrade: 1,
                  statusDivide: 2,
                  refundStatus: 1,
                  payTime: "2022-11-06 17:58:45",
                  limitStartTime: null,
                  limitEndTime: null,
                  channel: "yb",
                  createTime: "2022-11-06 17:58:30",
                  uuid: "a160ac74272859c4a2cb504d74c643f4",
                  saleUuid: "55c633ace46f97831f8d5055e9d467b3",
                  buyUuid: "2ce0aa4d8dabefac40968325f56bed24",
                  extra:
                    '{"balanceAmount":80,"breachWithdrawal":40,"depositAmount":20,"depositDay":10,"depositEarningFee":1,"depositRatio":20,"depositWithdrawal":19,"finalEarningFee":7,"finalWithdrawal":73,"indemnityAmount":42,"indemnityFee":2,"saleRecordUuid":"c5c1ff075a5eb540853de47473e89e95","uuid":"e7c774217860df5c126f05c8fad78510"}',
                  presaleAmountExt: {
                    depositAmount: "0.20",
                    balanceAmount: "0.80",
                    refundAmount: "0.20",
                    breachAmount: "0.20",
                    indemnityAmount: "0.42",
                    indemnityFee: "0.02",
                  },
                },
                {
                  orderBuyNo: "OB1589194849574293505",
                  orderNoSub: "OBS1589194849624625153",
                  orderType: 10,
                  price: "1.00",
                  pricePayThird: "0.20",
                  transactionId: "1013202211060000004701441341",
                  statusPay: 1,
                  statusTrade: 1,
                  statusDivide: 2,
                  refundStatus: 1,
                  payTime: "2022-11-06 17:56:56",
                  limitStartTime: null,
                  limitEndTime: null,
                  channel: "yb",
                  createTime: "2022-11-06 17:55:53",
                  uuid: "4eed0b0d1a5974ed7c7b49743131816a",
                  saleUuid: "2ce0aa4d8dabefac40968325f56bed24",
                  buyUuid: "55c633ace46f97831f8d5055e9d467b3",
                  extra:
                    '{"balanceAmount":80,"breachWithdrawal":40,"depositAmount":20,"depositDay":10,"depositEarningFee":1,"depositRatio":20,"depositWithdrawal":19,"finalEarningFee":7,"finalWithdrawal":73,"indemnityAmount":42,"indemnityFee":2,"saleRecordUuid":"c5c1ff075a5eb540853de47473e89e95","uuid":"e7c774217860df5c126f05c8fad78510"}',
                  presaleAmountExt: {
                    depositAmount: "0.20",
                    balanceAmount: "0.80",
                    refundAmount: "0.20",
                    breachAmount: "0.20",
                    indemnityAmount: "0.42",
                    indemnityFee: "0.02",
                  },
                },
                {
                  orderBuyNo: "OB1589194849574293505",
                  orderNoSub: "OBS1589194849624625154",
                  orderType: 20,
                  price: "1.00",
                  pricePayThird: null,
                  transactionId: null,
                  statusPay: 0,
                  statusTrade: 3,
                  statusDivide: 0,
                  refundStatus: 1,
                  payTime: null,
                  limitStartTime: "2022-11-06 17:56:56",
                  limitEndTime: "2022-11-16 17:56:56",
                  channel: null,
                  createTime: "2022-11-06 17:55:53",
                  uuid: "0672a16071cef2c0ec3e38a4f09ca14e",
                  saleUuid: "2ce0aa4d8dabefac40968325f56bed24",
                  buyUuid: "55c633ace46f97831f8d5055e9d467b3",
                  extra:
                    '{"balanceAmount":80,"breachWithdrawal":40,"depositAmount":20,"depositDay":10,"depositEarningFee":1,"depositRatio":20,"depositWithdrawal":19,"finalEarningFee":7,"finalWithdrawal":73,"indemnityAmount":42,"indemnityFee":2,"saleRecordUuid":"c5c1ff075a5eb540853de47473e89e95","uuid":"e7c774217860df5c126f05c8fad78510"}',
                  presaleAmountExt: {
                    depositAmount: "0.20",
                    balanceAmount: "0.80",
                    refundAmount: "0.20",
                    breachAmount: "0.20",
                    indemnityAmount: "0.42",
                    indemnityFee: "0.02",
                  },
                },
              ],
              tags: "presale",
              id: "a8e47b442ee097dfbd1e17cbc799f353",
              saleRecordId: "c5c1ff075a5eb540853de47473e89e95",
            },
          },
        }; */

        this.orderInfoResult = result.data.data;
        console.log(this.orderInfoResult);
        this.showEmpty = this.orderInfoResult == null;
        this.loading = false;
        if (
          this.orderInfoResult.orderBuySubs &&
          this.orderInfoResult.orderBuySubs.length > 0
        ) {
          this.presaleAmountExt =
            this.orderInfoResult.orderBuySubs[0].presaleAmountExt;
        }
      } catch (error) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.blok-bar {
  border-top: 1px dashed #e5e5e5;
  margin: 20px 0 20px;
}
.through-line {
  text-decoration: line-through;
}
.v1-main {
  margin-top: 20px;
}

.goods-name-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 17px;
  .left {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    .goods-name {
      font-size: 12px;
      color: #000000;
      padding-right: 6px;
    }
  }
}
.m-copy-blue {
  ::v-deep .m-copy {
    .txt {
      color: rgb(32, 129, 226);
    }
  }
}
.warning-color {
  color: #e61f1a !important;
}
.bold-money {
  font-size: 16px;
  font-weight: bold;
}
.page-order-detail {
  padding: 0 0 1.2rem;
  .loading {
    height: 500px;
  }
  .order-des {
    display: inline-block;
    padding-right: 6px;
  }

  .order-info {
    padding: 0 32px 44px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 4px rgba(164, 164, 164, 0.1);
    border-radius: 4px;
    h1 {
      font-size: 14px;
      color: #333333;
      line-height: 68px;
    }
    .goods-info {
      display: flex;
      padding-bottom: 18px;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
      margin-bottom: 24px;
      .img-wrap {
        width: 220px;
        padding-right: 24px;
        ::v-deep .goods-frame-box {
          padding: 0;
          border: 0;
          .frame-box {
            padding: 12px;
          }
        }
      }
      .info {
        flex: 1;
        color: #666666;
        line-height: 17px;
        display: flex;
        flex-direction: column;
        .line {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 10px;
        }

        .pc-hide {
          display: none;
        }
        .phone-line {
          display: none;
        }
        h1 {
          width: 24px + 48px;
          font-size: 12px;
          line-height: 17px;
          color: #999999;
        }
        h2 {
          font-size: 14px;
          line-height: 17px;
          font-weight: 500;
          color: #e61f1a;
        }
        .price {
          color: #f4a33a;
          font-weight: 500;
          font-size: 16px;
        }
        h3 {
          font-size: 12px;
          line-height: 17px;
          color: #666666;
        }
        p {
          flex: 1;
        }
      }
    }
    .order-money {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .line {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 10px;
        .warn {
          color: #e61f1a;
          p {
            color: #e61f1a;
          }
        }
        h1 {
          line-height: 17px;
          color: rgba(153, 153, 153, 1);
          span {
            color: #e61f1a;
          }
          .discount-names {
            display: inline-block;
            max-width: 180px;
            color: #666666;
            position: relative;
            top: 3px;
            @media screen and (max-width: 540px) {
              max-width: 1.9rem;
            }
          }
        }
        p {
          width: 230px;
          text-align: right;
          color: #4d4d4d;
          &.money {
            color: rgba(230, 31, 26, 1);
          }
          @media screen and (max-width: 540px) {
            width: inherit;
          }
        }
        .gray {
          color: #999999;
          font-size: 12px;
        }
        .down {
          width: 230px;
          position: relative;
          text-align: right;
          cursor: pointer;
          @media screen and (max-width: 540px) {
            width: inherit;
          }
          &.choose {
            background: url("//static.theone.art/pc/images/pic-home/arrowright2%402x.png")
              no-repeat right center;
            background-size: 18px 18px;
            padding-right: 20px;
          }
          ul {
            display: none;
            position: absolute;
            left: 50%;
            transform: translateX(-25%);
            top: 20px;
            width: 230px;
            line-height: 30px;
            background: #ffffff;
            box-shadow: 0px 2px 6px 0px rgba(102, 102, 102, 0.26);
            border-radius: 2px;
            z-index: 99;
            @media screen and (max-width: 540px) {
              width: inherit;
            }
            li {
              height: 30px;
              text-align: center;
              color: rgba($color: #000000, $alpha: 0.4);
              cursor: pointer;
              &.active {
                color: #000000;
              }
            }
          }
          &:hover {
            ul {
              display: block;
            }
          }
        }
      }
    }
  }
  .order-btn {
    padding: 40px 0px 0px;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    .v1-btn {
      width: 160px;
    }
    .v1-btn-link {
      margin-left: 40px;
      line-height: 40px;
    }
  }
  .order-update {
    padding-top: 18px;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    color: #666666;
    font-size: 14px;
    .v1-btn-link.blue {
      background: url("//static.theone.art/pc/images/pic-home/order_update.png")
        no-repeat left center;
      background-size: 14px 14px;
      padding-left: 20px;
    }
    p {
      margin-left: 12px;
    }
  }
  .order-paytime {
    padding-top: 18px;
    text-align: right;
    font-size: 12px;
    color: #666666;
    span {
      color: #e61f1a;
    }
  }
}
@media screen and (min-width: 541px) {
  .send-cont {
    padding: 24px 32px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 4px rgba(164, 164, 164, 0.1);
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 16px;
    .address-cont {
      padding-bottom: 24px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
    }
    .other-info {
      padding-top: 8px;
      .info-item {
        margin-top: 16px;
        display: flex;
      }
    }
    .icon-address {
      display: none;
    }
    .label {
      color: #999999;
      width: 60px;
      margin-right: 24px;
    }
    .mr-12 {
      margin-right: 12px;
    }
    .info {
      color: #4d4d4d;
    }
    .info-text {
      color: #999999;
    }
    .copy {
      color: #397fe7;
    }
    .f-w {
      color: #000000;
    }
    .warn {
      color: #f4a33a;
    }
    .warn-r {
      color: #e61f1a;
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 541px) {
  .send-cont {
    font-size: 0.24rem;
    margin-bottom: 0.16rem;
    .address-cont {
      padding: 0.32rem;
      margin-bottom: 0.16rem;
      display: flex;
      background: #ffffff;
      box-shadow: 0px 0px 9px 4px rgba(164, 164, 164, 0.1);
      border-radius: 4px;
      .label {
        display: none;
      }
      .icon-address {
        width: 0.36rem;
        margin-right: 0.26rem;
        background-image: url("~@/assets/1.0/images/icon-address.png");
        background-repeat: no-repeat;
        background-size: 100%;
      }
      .info {
        flex: 1;
        .address-text {
          display: block;
          margin-top: 0.16rem;
          color: #999999;
        }
      }
    }
    .other-info {
      background: #ffffff;
      box-shadow: 0px 0px 9px 4px rgba(164, 164, 164, 0.1);
      border-radius: 4px;
      padding: 0.16rem;
      .info-item {
        padding: 0.16rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .label {
      color: #999999;
      width: 1.2rem;
    }
    .mr-12 {
      margin-right: 0.24rem;
    }
    .info {
      color: #4d4d4d;
    }
    .info-text {
      color: #999999;
    }
    .copy {
      color: #397fe7;
    }
    .f-w {
      color: #000000;
    }
    .warn {
      color: #f4a33a;
    }
    .warn-r {
      color: #e61f1a;
    }
  }
  .v1-main {
    margin: 0.32rem;
  }
  .phone-hide {
    display: none;
  }
  .page-order-detail {
    .order-info {
      padding: 0;
      .goods-info {
        flex-direction: column;
        .img-wrap {
          width: 100%;
          padding-right: 0;
          ::v-deep .goods-frame-box {
            padding: 0;
            border: 0;
          }
          margin-bottom: 0.32rem;
        }
        .cover {
          width: 100%;
          margin: 0 auto 0.2rem;
        }
        .info {
          padding: 0 0.32rem;

          .line {
            justify-content: space-between;
            margin-bottom: 0.2rem;
            align-items: self-start;
            h1 {
              width: 1rem;
              word-break: keep-all;
            }
            p {
              flex: 1;
              text-align: right;
              word-break: break-all;
              ::v-deep .m-copy {
                justify-content: flex-end;
              }
            }
          }
          .pc-hide {
            display: flex;
          }
          .phone-line {
            display: flex;
          }
        }
      }
      .order-money {
        padding: 0 0.32rem 0.2rem;
        .line {
          justify-content: space-between;
        }
      }
    }
  }
  .goods-name-wrap {
    .left {
      justify-content: space-between;
      .goods-name {
        font-size: 0.28rem;
      }
    }
    .price {
      display: none;
    }
  }
}
</style>
