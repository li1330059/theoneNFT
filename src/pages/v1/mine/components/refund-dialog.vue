<template>
  <el-dialog
    custom-class="shadow-dialog"
    class="dialog"
    :visible="visible"
    append-to-body
    title="违约退赔"
    width="1040px"
    :fullscreen="$common.isMobile()"
    :destroy-on-close="true"
    :before-close="handleClose"
  >
    <div class="dialog-content">
      <section class="goods-detail flex-x-between flex-y-center flex">
        <simple-frame :goodsObj="goodsObj" />
        <div class="block">
          <div class="line goods">
            <div class="key goods-name hidden-1">
              {{ (goodsObj.commodity && goodsObj.commodity.name) || "" }}
            </div>
            <div class="val color-1 no-wrap">
              {{ $common.formatMoney(goodsObj.pricePay) }}
            </div>
          </div>
          <div class="line">
            <div class="key">
              {{
                (goodsObj.commodity &&
                  goodsObj.author &&
                  goodsObj.author.nickname) ||
                ""
              }}
            </div>
            <div class="val color-2">X {{ goodsObj.amount || "" }}</div>
          </div>
        </div>
      </section>
      <div class="line-bar"></div>

      <div class="title-2">支付方式</div>
      <div class="pay-wrap-wrap">
        <pay-way-menu
          :payWayList="payWayList"
          :index="payWayIdx"
          @change="payWayChange"
        ></pay-way-menu>
      </div>

      <div class="message-wrap">
        如您滥用本规则或平台技术，包括但不限于多次、高频恶意违约，多次发起退赔但未实际完成退赔，在定金担保期间即将结束时恶意发起退赔但未实际完成退赔导致用户违约，及其他妨害平台运营、管理及/或经营秩序的，平台将对上述行为做出独立判断并限制商家使用平台的定金技术服务，或参照
        <span class="link hand" @click="goLink('risk_account_rule')"
          >《关于风险账号分级处理暂行规则》</span
        >将前述商家或用户的账户列为I至III级风险账户。
      </div>

      <div class="line-bar mobile-show"></div>

      <section class="moeny-wrap">
        <div class="content">
          <div class="line">
            <div class="key">退款金额</div>
            <div class="val money-color">
              {{
                $common.formatMoney(
                  balanceObj.presaleAmountExt &&
                    balanceObj.presaleAmountExt.refundAmount
                )
              }}
            </div>
          </div>
          <div class="line">
            <div class="key">赔偿金额</div>
            <div class="val money-color">
              {{
                $common.formatMoney(
                  balanceObj.presaleAmountExt &&
                    balanceObj.presaleAmountExt.breachAmount
                )
              }}
            </div>
          </div>
          <div class="line">
            <div class="key">定金技术服务费</div>
            <div class="val money-color">
              {{
                $common.formatMoney(
                  balanceObj.presaleAmountExt &&
                    balanceObj.presaleAmountExt.indemnityFee
                )
              }}
            </div>
          </div>
          <section class="payway-wrap">
            <div class="line">
              <div class="key">
                <div
                  class="flex-y-center hand flex txt-color-sign"
                  @click="showTxt(sumTextObj)"
                >
                  {{ sumTextObj.name }}<span class="ui-icon icon-help"></span>
                </div>
              </div>
              <div class="val">
                <span class="tip">合计支付：</span
                ><span class="money-color font">
                  {{
                    $common.formatMoney(
                      balanceObj.presaleAmountExt &&
                        balanceObj.presaleAmountExt.indemnityAmount
                    )
                  }}</span
                >
              </div>
            </div>
          </section>
        </div>
      </section>
      <section class="warning-message">
        尾款支付时间：{{ balanceObj.limitStartTime }}-{{
          balanceObj.limitEndTime
        }}
      </section>

      <section class="footer flex-x-end flex-y-center flex">
        <div class="btn btn-default" @click="visible = false">取消</div>
        <div class="btn btn-primary" @click="onPay">确认退赔</div>
      </section>
    </div>
    <inPayPassword
      ref="inPayPassword"
      @listen="listenInPayPassword"
      :isRemember="false"
    ></inPayPassword>
  </el-dialog>
</template>
<script>
import PayWayMenu from "@/components/v1/pay-way-menu";
import inPayPassword from "@/pages/v1/mine/setting/inPayPassword";
import Encryption from "@/utils/encryption";
import BigNumber from "bignumber.js";
export default {
  components: { PayWayMenu, inPayPassword },
  props: {
    goodsObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      payPassword: "",
      payWayList: [],
      payWayIdx: -1,

      disable: false,
      sumTextObj: {
        name: "计算方式",
        text: "根据平台规则，您应当根据使用定金技术服务所涉金额的5%向平台实时支付定金技术服务费，即您在违约时支付的总金额包含了双倍返还用户的费用和定金技术服务费。比如定金金额为100元，您违约应支付给用户费用为200元，该笔费用占总金额的95%，需支付给平台的定金技术服务费为200/95%*5%=10.53元。",
      },
      visible: false,
    };
  },

  computed: {
    balanceObj() {
      if (this.goodsObj.orderBuySubs && this.goodsObj.orderBuySubs.length > 0) {
        return (
          this.goodsObj.orderBuySubs.find((item) => item.orderType == 20) || {}
        );
      }
      return {};
    },
  },

  created() {},
  methods: {
    goLink(key) {
      window.open(`/agreement/${key}`);
    },
    // 获取钱包余额
    async getWallet() {
      let result = await this.$api.service.userWallet_get();
      let userWalletResult = result.data.data;
      console.log(`钱包余额`, userWalletResult);
      this.userWalletResult = userWalletResult;
    },
    // 输入支付密码
    async listenInPayPassword(result) {
      if (result.result) {
        this.payPassword = result.result;
        console.log(`支付密码`, this.payPassword);
        this.orderPay();
      }
    },
    showTxt(obj) {
      console.log(obj);
      this.$confirm(obj.text, obj.name, {
        confirmButtonText: "我知道了",
        showCancelButton: false,
        customClass: "mobile-btn-center text-left",
      })
        .then(async () => {})
        .catch(() => {});
    },
    async getTxt() {
      //计算方式
      const txtRes =
        await this.$api.service.getByKey_newRefundCalculationMethod();
      if (txtRes.data.code == 200) {
        this.sumTextObj = txtRes.data.data;
      }
    },
    handleClose() {
      this.visible = false;
    },
    async init() {
      this.visible = true;
      await this.getWallet();
      this.getPayWay();
      this.getTxt();
    },
    payWayChange(idx, item) {
      this.payWayIdx = idx;
    },
    async getPayWay() {
      let res = await this.$api.service.thirdAccount_sellerChannel_v2({
        saleRecordId: this.goodsObj.saleRecordId,
        needWallet: false,
        needLl: true,
        isBreachOrder: 1,
        buyerUuid: this.goodsObj.depositObj.buyUuid,
        version: 1,
      });
      this.payWayIdx = -1;
      if (res.data.code == 200) {
        this.payWayList = res.data.data.map((item, idx) => {
          item.index = idx;
          item.disable = false;
          if (item.buyerStatus == 0) {
            item.disable = false;
          } else {
            item.disable = true;
          }
          if (item.payChannel == "balance") {
            const walletAmount = this.userWalletResult.amount || 0;
            const payMoney =
              (this.balanceObj.presaleAmountExt &&
                this.balanceObj.presaleAmountExt.indemnityAmount) ||
              0;
            if (item.buyerStatus == 0) {
              if (new BigNumber(walletAmount).minus(payMoney) < 0) {
                item.disable = true;
                item.desc = "余额不足";
              }
            }
          }
          if (!item.desc) {
            item.desc = "不支持";
          }

          return item;
        });
        const ybObj = this.payWayList.find((item) => item.payChannel == "yb");
        if (ybObj && ybObj.buyerStatus == 0) {
          this.payWayIdx = this.payWayList.findIndex(
            (item) => item.payChannel == "yb"
          );
        } else {
          this.payWayIdx = this.payWayList.findIndex((item) => !item.disable);
        }
      }
    },
    async onPay() {
      if (this.disable) {
        return;
      }
      this.disable = true;
      const payWayObj = this.payWayList[this.payWayIdx];

      if (!payWayObj) {
        this.$message.warning("请选择可用的支付方式");
        return;
      }
      if (payWayObj.payChannel == "balance") {
        this.$refs.inPayPassword.init();
        this.disable = false;
        return;
      }
      this.orderPay();
    },
    async orderPay() {
      const payWayObj = this.payWayList[this.payWayIdx];
      const amountPay = this.balanceObj.presaleAmountExt.indemnityAmount;

      const orderRes = await this.$api.service.orderBuy_add([
        {
          amountPay: this.$common.formatMoneyNum(amountPay),
          orderType: 2,
          onlineType: 2,
          saleRecordAmount: this.goodsObj.amount,
          saleRecordId: this.goodsObj.saleRecordId,
          sendType: 0,
        },
      ]);

      if (orderRes.data.code == 200) {
        let resPassword = "";
        if (this.payPassword) {
          //如果需要支付密码则进行加密
          resPassword = await Encryption.getPassword(this.payPassword);
          if (!resPassword) {
            this.$message.warning("密码加密错误");
            return;
          }
        }
        const payParam = {
          amountPay: this.$common.formatMoneyNum(amountPay),
          bankCardUUID: "",
          brandName: "",
          clientType: this.$common.isMobile() ? 2 : 1,
          orderNo: orderRes.data.data,
          payBankUuid: "",
          payChannel: payWayObj.payChannel,
          payPw: resPassword,
          payType: payWayObj.payType,
          preOrderType: 30, //预售订单类型 10-定金单 20-尾款单 30-违约单 null或不传 为默认的普通全款订单
          randomKey: "",
        };
        if (payWayObj.payChannel == "ll") {
          let link = `/ll_bag/pay?order_no=${
            payParam.orderNo
          }&amount_pay=${amountPay}&show_amount=${
            payParam.amountPay
          }&goods_name=${encodeURIComponent(
            this.goodsObj.commodity && this.goodsObj.commodity.name
          )}`;
          if (payParam.preOrderType) {
            link = `${link}&pre_order_type=${payParam.preOrderType}`;
          }
          window.location.href = link;
          return;
        }
        let payRes = await this.$api.service.v3_pay(payParam);
        this.disable = false;
        if (payRes.data.code == 200) {
          const payResultInfo = payRes.data.data;
          switch (payResultInfo.payChannel) {
            case "balance":
              if (payResultInfo.detail.status == "SUCCESS") {
                this.$message.success("支付成功");
                this.$router.push({
                  path: "/order/success",
                });
              } else {
                this.$message.error("支付失败");
              }
              break;
            case "yb":
              if (payResultInfo.status == "jump") {
                //
                this.$localStorage.setItem(
                  "jump-page",
                  "/mine/sold",
                  1 * 60 * 60 * 1000
                );
                window.location.href = payResultInfo.detail;
              } else {
                this.$message.error(payResultInfo.errorMessage);
              }
              break;
          }
        } else {
          this.$message.error(payRes.data.message);
        }
      } else {
        this.disable = false;
        this.$message.warning(orderRes.data.message);
      }
    },
    //创建订单orderType：2
    //v3pay
  },
};
</script>
<style lang="scss" scoped>
.link {
  color: rgba(57, 127, 231, 1);
}
.warning-message {
  text-align: right;
  font-size: 12px;
  font-weight: 400;
  color: #e61f1a;
  @media screen and (max-width: 541px) {
    font-size: 0.24rem;
    text-align: left;
  }
}
.message-wrap {
  background: #fafafa;
  border-radius: 4px;
  border: 1px solid #eeeeee;
  padding: 12px;
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  margin-top: 28px;
  margin-bottom: 34px;
  @media screen and (max-width: 541px) {
    margin-bottom: 24px;
  }
}
.pay-wrap-wrap {
  margin: -10px -8px;
}
.title-2 {
  padding-top: 24px;
  padding-bottom: 10px;
}
.no-wrap {
  word-break: keep-all;
}
.color-1 {
  color: #f4a33a;
}
.color-2 {
  color: #4d4d4d;
}
.money-color {
  color: #e61f1a;
}
.icon-help {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/prepay/icon-help.png");
}
.line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999999;
  .txt-color-sign {
    color: #666666;
  }
  .key {
  }
  .val {
  }
  @media screen and (max-width: 541px) {
    font-size: 0.28rem;
  }
}
.goods-detail {
  margin-bottom: 16px;
  .block {
    flex: 1;
  }
  .goods {
    overflow: hidden;
    margin-bottom: 6px;
    font-size: 14px;
  }
  .goods-name {
    font-size: 14px;
    color: #4d4d4d;
    flex: 1;
  }
  @media screen and (max-width: 541px) {
    .goods-name {
      max-width: 2.8rem;
    }
  }
}
.line-bar {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}
.moeny-wrap {
  margin-bottom: 8px;
  display: flex;
  justify-content: flex-end;
  .content {
  }
  .line {
    padding: 8px 0;
    .val {
      min-width: 230px;
      text-align: right;
    }
  }
  @media screen and (max-width: 541px) {
    margin-top: 23px;
    .content {
      width: 100%;
    }
  }
}
.payway-wrap {
  .font {
    font-size: 14px;
  }
  .tip {
    color: #333333;
  }
  .line {
    padding: 8px 0;
  }
  @media screen and (max-width: 541px) {
  }
}
.dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  :deep(.el-dialog__title) {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }
}
.footer {
  margin-top: 16px;
  .btn {
    margin-left: 24px;
  }
}
.btn {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  min-width: 100px;
  line-height: 30px;
  padding: 0 15px;
  border-radius: 100px;
  cursor: pointer;
  user-select: none;
}
.mobile-show {
  display: none;
}
@media screen and (max-width: 541px) {
  .btn {
    line-height: 0.72rem;
  }
  .mobile-show {
    display: block;
  }
  .footer {
    justify-content: space-between;

    .btn {
      margin: 0;
      width: 47%;
    }
  }
  .dialog {
    :deep(.el-dialog__title) {
      text-align: center;
      display: inline-block;
      width: 100%;
    }
    /*     :deep(.el-dialog) {
      width: 100% !important;
      margin: inherit;
      position: absolute;
      left: 0;
      bottom: 0;
    } */
  }
}
</style>
