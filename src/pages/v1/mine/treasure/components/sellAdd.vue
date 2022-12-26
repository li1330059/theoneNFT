<template>
  <div>
    <el-dialog
      class="v1-dialog-mycenter page-mine-sell-add"
      :visible.sync="dialogVisible"
      append-to-body
      :width="$common.isMobile() ? '90%' : '500px'"
      :center="$common.isMobile() ? true : false"
      title="寄售"
    >
      <div class="dialog-content" v-if="treasureSku">
        <div>
          <div class="dialog-form">
            <div class="form-line hov">
              <commodity-num style="flex: 1" :treasure="treasureSku">
                <h1>编号：</h1></commodity-num
              >
              <!--   <div class="v1-icon-skuno">
              {{ treasureSku.commoditySku.number }}/{{
                treasureSku.commoditySku.amountNumber
              }}
            </div> -->
            </div>
            <div class="form-line hov">
              <h1>购买价格：</h1>
              <div class="money-color">
                {{ $common.formatMoney(treasureSku.priceBuy) }}
              </div>
            </div>
            <section class="prepay-wrap" v-if="payTabList.length > 1">
              <div class="title-wrap flex-x-between flex-y-center flex">
                <div class="name">销售方式：</div>
                <div class="val" v-if="prepayTxtObj.name">
                  <div
                    class="help flex flex-y-center hand"
                    @click="showTxt(prepayTxtObj)"
                  >
                    {{ prepayTxtObj.name
                    }}<span class="ui-icon icon-help"></span>
                  </div>
                </div>
              </div>
              <div class="swipch-wrap flex flex-x-between">
                <div
                  class="tab"
                  v-for="(item, idx) in payTabList"
                  :key="idx"
                  @click="onPaywayHandle(item, idx)"
                >
                  <div
                    class="tab-wrap radius"
                    :class="{ 'tab-wrap-checked': idx == payTabIdx }"
                  >
                    <span
                      class="ui-icon"
                      :class="[
                        idx == payTabIdx
                          ? 'icon-prepay-radius-checked'
                          : 'icon-prepay-radius',
                      ]"
                    ></span
                    >{{ item.name }}
                  </div>
                </div>
              </div>
            </section>
            <div
              v-show="prepayOptions.length > 0"
              :class="{ 'flex-prepay-wrap': !isShowPrepayOption }"
            >
              <div class="deposit-txt-wrap">
                <div
                  class="help flex flex-y-center hand"
                  @click="showTxt(depositTxtObj)"
                >
                  {{ depositTxtObj.name
                  }}<span class="ui-icon icon-help"></span>
                </div>
              </div>

              <div class="prepay-options-wrap" v-show="isShowPrepayOption">
                <el-select
                  v-model="prepayOptionsIdx"
                  placeholder="请选择"
                  @change="prepayOptionsHandle"
                >
                  <el-option
                    v-for="(item, idx) in prepayOptions"
                    :key="idx"
                    :label="item.depositRatio"
                    :value="idx"
                  >
                    <span style="float: left">{{ item.depositRatio }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    ></span>
                  </el-option>
                </el-select>
              </div>
              <div v-show="!isShowPrepayOption">
                {{ prepayCurrentOption && prepayCurrentOption.depositRatio }}
              </div>
            </div>
            <div class="form-line">
              <h1>您想要寄售的价格：</h1>
              <div class="input-line">
                <el-input
                  v-model="param.price"
                  maxlength="8"
                  @input="userPriceHandle"
                  :placeholder="sellPlaceholder"
                >
                  <span slot="prefix" class="el-input__icon">¥</span>
                </el-input>
              </div>
              <div class="message">
                <!--  预定金各种收费比例 -->
                <div v-if="sellTypeObj && sellTypeObj.typeSale == 2">
                  <div v-if="prepayFeeList" style="margin-top: 8px">
                    <div
                      class="txt prepay-money-flex"
                      v-for="(item, idx) in prepayFeeList"
                      :key="idx"
                    >
                      <div>
                        <div>{{ item.name }}:</div>
                        {{ item.tips }}
                      </div>
                      <div>{{ item.ratio }}</div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="flex-y-center flex" style="margin-top: 8px">
                    <div
                      class="txt"
                      :class="{ through: discountInfo.royaltyChange }"
                    >
                      作品许可费2.5%
                    </div>
                    <span class="line">|</span>

                    <div
                      class="txt"
                      :class="{ through: discountInfo.infoServiceChange }"
                    >
                      信息服务费5%
                    </div>
                  </div>
                </div>

                <div
                  class="txt"
                  v-if="sellTypeObj && sellTypeObj.typeSale == 2"
                >
                  <div
                    class="prepay-income-wrap"
                    v-if="
                      !isNaN(prepayMoneyObj.income) && prepayMoneyObj.income > 0
                    "
                  >
                    <span>{{ prepayMoneyObj.incomeName }}</span>
                    <span class="moeny-color">{{
                      $common.formatMoney(prepayMoneyObj.income)
                    }}</span>
                  </div>
                </div>
                <div
                  v-show="
                    (sellTypeObj && sellTypeObj.typeSale == 1) || !sellTypeObj
                  "
                >
                  <div class="txt" v-if="discountInfo.royaltyChange">
                    使用作品许可费折扣卡后作品许可费为{{ royaltyRate }}
                    具体折扣以商品售罄时间为准
                  </div>
                  <div
                    v-show="
                      (sellTypeObj && sellTypeObj.typeSale == 1) || !sellTypeObj
                    "
                  >
                    <div class="txt" v-if="discountInfo.infoServiceChange">
                      <div v-if="discountInfo.discountCommodityNameList">
                        使用【{{
                          discountInfo.discountCommodityNameList.join(",")
                        }}】折扣信息服务费为{{ infoServiceChange }}
                      </div>
                      具体折扣以商品售罄时间为准
                    </div>
                  </div>

                  <div
                    class="txt flex flex-x-between flex-y-center text-money"
                    v-if="!isNaN(realAmount) && realAmount > 0"
                  >
                    预计此次出售实际可得
                    <span class="moeny-color">{{
                      $common.formatMoney(realAmount)
                    }}</span>
                  </div>
                </div>
              </div>

              <!--       <div class="m-consignment-wrap" @click="onClick">
                <span
                  class="icon"
                  :class="{ selected: isAgreecConsignment }"
                />我知晓并同意<span class="link" @click.stop="showConsignment"
                  >《商家入驻协议》</span
                >
              </div> -->
            </div>
            <div v-if="prepayMoneyObj && prepayMoneyObj.depositAmount > 0">
              <div class="prepay-wrap" v-show="prepayOptions.length > 0">
                <div class="money-wrap">
                  <div class="line">
                    <div class="key">{{ prepayMoneyObj.depositName }}</div>
                    <div class="val">
                      {{ $common.formatMoney(prepayMoneyObj.depositAmount) }}
                    </div>
                  </div>
                  <div class="line">
                    <div class="key">{{ prepayMoneyObj.balanceName }}</div>
                    <div class="val">
                      {{ $common.formatMoney(prepayMoneyObj.balanceAmount) }}
                    </div>
                  </div>
                  <div
                    class="warning-txt-2"
                    v-if="prepayCurrentOption && prepayCurrentOption.depositDay"
                  >
                    定金担保期间为：定金支付后{{
                      prepayCurrentOption.depositDay
                    }}天内
                  </div>
                </div>
              </div>
            </div>
            <div
              class="pay-way-message"
              v-if="sellTypeObj && sellTypeObj.typeSale == 2"
            >
              <div>
                1.参与定金预售模式的商家必须开通且完成易宝(快捷支付)认证。
              </div>
              <div>
                2.版权品市场、衍生品市场，用户如选择恒信通余额购买预售藏品，目前系统仅支持与同样完成恒信通认证的商家进行交易。
              </div>
            </div>
            <div
              class="pay-way-message"
              v-show="
                (sellTypeObj && sellTypeObj.typeSale !== 2) || !sellTypeObj
              "
            >
              <div>
                1.您当前店铺支持的结算渠道为
                <span v-for="(item, index) in havePayArr" :key="index"
                  >{{ item.name }}，</span
                >您可在【结算账户管理】中选择开通相应的第三方结算渠道。
              </div>
              <div>
                2.寄售时，商家需至少完成连连钱包的开通（认证），否则无法进行寄售。
              </div>
              <div>
                3.恒信通（余额支付）、宝付（网银支付)、易宝（快捷支付）、连连钱包如未完成开户认证，则无法进行收款。
              </div>
              <div>4.请您及时关注第三方支付渠道结算规则的变更。</div>
            </div>
            <div
              class="pay-way-list"
              v-if="payWayTypeArr && payWayTypeArr.length > 0"
            >
              <div class="title">结算渠道</div>
              <div class="pay-way-block">
                <div
                  class="pay-way-bar flex flex-x-between flex-y-center"
                  v-for="(item, index) in payWayTypeArr"
                  :key="index"
                >
                  <div class="name flex flex-x-center flex-y-center">
                    <span
                      class="ui-icon"
                      :class="[`icon-${item.payChannel}`]"
                    />{{ item.name }}
                  </div>
                  <div>
                    <div class="disable" v-if="item.status == 0">已开通</div>
                    <div class="link-btn hand" @click="goOpenPay(item)" v-else>
                      立即开通>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="footer-wrap">
        <div
          class="m-consignment-wrap"
          @click="onPrepayAgreement"
          v-if="sellTypeObj && sellTypeObj.typeSale == 2"
        >
          <span
            class="icon"
            :class="{ selected: isAgreePrepayConsignment }"
          />我知晓并同意<span
            class="link"
            @click.stop="onPrepayConsignment('sale_deposit_rules')"
            >《数字艺术品售卖定金担保规则》</span
          ><span
            class="link"
            @click.stop="onPrepayConsignment('deposit_technology_service')"
            >《数字艺术品定金技术服务协议》</span
          >
        </div>
        <div class="m-consignment-wrap" @click="onClick" v-else>
          <span
            class="icon"
            :class="{ selected: isAgreecConsignment }"
          />我知晓并同意<span class="link" @click.stop="showConsignment"
            >《商家入驻协议》</span
          >
        </div>
        <div class="form-btns">
          <div class="v1-btn mycenter" @click="dialogVisible = false">取消</div>
          <div class="v1-btn mycenter red" @click="addSubmit()">确定</div>
        </div>
      </section>
    </el-dialog>
    <!--     <el-dialog
      class="v1-dialog-mycenter"
      :visible.sync="isShowConsignment"
      append-to-body
      width="600px"
      :title="agreementTitle"
    >
      <div class="content consignment-content">
        <div
          class="c-html"
          v-html="consignmentHtml"
          @scroll="onScroll($event)"
        ></div>
        <div class="btn-group">
          <div class="btn btn-default" @click="onCancelC">不同意</div>

          <div
            class="btn btn-red"
            v-if="isBottom && isDownOver"
            @click="onIAgree()"
          >
            我同意
          </div>
          <div class="btn btn-default" v-else>
            {{ btnTxt }}
          </div>
        </div>
      </div>
    </el-dialog> -->
    <agreement
      ref="consignmentRef"
      :text="consignmentHtml"
      title="商家入驻协议"
      :isShowBtn="true"
      @agree="onIAgreeMerchantSettlement"
      @cancel="onICancelMerchantSettlement"
    />
    <agreement
      ref="depositAgreementRef"
      :text="depositHtml"
      :title="prepayAgreementTitle"
      :isShowBtn="isShowAgreementBtn"
      @agree="onIAgreeDeposit"
      @cancel="onICancelDeposit"
    />
    <!-- 低价寄售提醒 -->
    <small-consignment
      ref="smallConsignmentRef"
      :listen="listenGetVCode"
    ></small-consignment>
  </div>
</template>
<script>
const BigNumber = require("bignumber.js");
import countDown from "@/utils/countDown";
import SmallConsignment from "./small-consignment.vue";
import Encryption from "@/utils/encryption";
const KEY = "AgreecConsignment";
const PREPAY_KEY = "prepay";
import Agreement from "./agreement.vue";
const depositMaxMoney = 49999.99;
const prepayAgreementObj = {
  sale_deposit_rules: "《数字艺术品售卖定金担保规则》",
  deposit_technology_service: "《数字艺术品定金技术服务协议》",
};
export default {
  components: { SmallConsignment, Agreement },

  data() {
    return {
      prePayRealAmount: "",
      prepayFeeList: [], //预定金
      isReadPrepay: 0,
      isShowAgreementBtn: true,
      prepayAgreementTitle: "预定金协议",
      vCode: null,
      isAgreePrepayConsignment: false,
      payTabList: [],
      isPrepayLow: false, //预定金寄售价格是否太低
      prepayTxtObj: {
        text: "指用户在购买预售数字艺术品时，预先支付的一定数额的金钱，主要用于担保在定金担保期间内向商家支付价款。定金的数额由双方自行确定，但不得超过该数字艺术品预售价格的百分之二十。如果交付定金一方违约，定金不退；如果收取定金一方违约，双倍返还。",
        name: "什么是定金预售",
      },
      depositTxtObj: {
        text: "定金预售活动处于试运行阶段，目前仅支持“定金收取比例10%，尾款支付周期30天”的选项，后续将向商家开放所有可选项，敬请期待！",
        name: "定金收取比例",
      },
      salePriceTexObj: {
        text: "金额超出",
      },
      prepayMoneyObj: {
        depositAmount: "0", //定金
        balanceAmount: "0", //尾款
      },
      payTabIdx: 0,
      prepayOptionsIdx: 0, //定金预售比例

      prepayOptionVal: "",
      payList: {},
      isShowConsignment: false,
      isAgreecConsignment: false,
      dialogVisible: false,
      btnTxt: "",
      ybWalletStatus: -1,
      showAgreeBtnDown: false,
      isDownOver: false,
      isBottom: false,
      consignmentHtml: "",
      depositHtml: "",
      treasureSku: null,
      ybBalance: 0,
      flag: { agreement: false },
      param: {
        price: "",
      },
      treasureAddSaleRecordParam: {
        saleMessage: "",
        treasureId: "",
        treasureSkuIdList: [],
      },
      getPoundageResult: {
        rate: "7.5",
      },
      /*    realAmount: 0, */
      payWayInfo: null, //支持的支付方式
      discountInfo: {
        infoServiceChange: false,
        infoServiceRate: 0,
        royaltyChange: false,
        royaltyRate: 0,
      },
    };
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  computed: {
    havePayArr() {
      //支持的通道
      if (this.payWayInfo && this.payWayInfo.length > 0) {
        return this.payWayInfo.filter((item) => item.status == 0);
      }
      return [];
    },
    payWayTypeArr() {
      if (this.payWayInfo && this.payWayInfo.length > 0) {
        if (this.sellTypeObj && this.sellTypeObj.typeSale == 2) {
          //定金预售
          return [];
          let pays = {
            hxt: true,
            ll: true,
            balance: true,
            yb: true,
          };
          return this.payWayInfo.filter((item) => pays[item.payChannel]);
        } else {
          return this.payWayInfo;
        }
      }
      return [];
    },
    sellPlaceholder() {
      if (this.sellTypeObj && this.sellTypeObj.typeSale == 2) {
        const lowPriceCent =
          new BigNumber(this.prepayCurrentOption.lowPriceCent).div(100) || 0;
        return `请输入出售价格：${lowPriceCent}-${depositMaxMoney}`;
      }
      return "请输入出售价格";
    },
    isShowPrepayOption() {
      return this.prepayOptions.length > 1;
    },
    isPrepay() {
      return this.payTabList.length > 1;
    },
    prepayCurrentOption() {
      //当前选择的定金比例信息
      return this.prepayOptions[this.prepayOptionsIdx];
    },
    prepayOptions() {
      const obj = this.payTabList[this.payTabIdx];

      if (obj && obj.configList && obj.configList.length > 0) {
        return obj.configList;
      }
      return [];
    },
    sellTypeObj() {
      //寄售方式
      return this.payTabList[this.payTabIdx];
    },
    isShowNum() {
      return (
        (this.treasureSku.commoditySku.chainContract &&
          this.treasureSku.commoditySku.chainContract.toLowerCase() ==
            "erc721") ||
        (this.treasureSku.commodity.chainContract &&
          this.treasureSku.commodity.chainContract.toLowerCase() == "erc721")
      );
    },
    royaltyRate() {
      //作品许可费
      return `${new BigNumber(this.discountInfo.royaltyRate).times(100)}%`;
    },
    infoServiceChange() {
      //信息服务费
      return `${new BigNumber(this.discountInfo.infoServiceRate).times(100)}%`;
    },
    realAmount() {
      //总金额
      const charge = new BigNumber(this.discountInfo.infoServiceRate).plus(
        this.discountInfo.royaltyRate
      );
      const p1 = this.formatMoeny(
        new BigNumber(this.param.price).times(this.discountInfo.infoServiceRate)
      );
      const p2 = this.formatMoeny(
        new BigNumber(this.param.price).times(this.discountInfo.royaltyRate)
      );
      return new BigNumber(this.param.price).minus(p1).minus(p2);
    },

    userInfo() {
      return this.$store.state.user_info;
    },
  },
  created() {},
  watch: {
    /*     param: {
      handler(val, oldVal) {
        if (this.getPoundageResult) {
          let charge = new BigNumber(val.price)
            .times(this.getPoundageResult.rate)
            .div(100);
          this.realAmount = new BigNumber(val.price).minus(charge);
        }
      },
      deep: true, //true 深度监听
    }, */
  },
  methods: {
    async getAgeTips() {
      const res = await this.$api.service.getByKey_hxtLimitAgeTips();
      console.log(res);
      /*       const res2 = await this.$api.service.getByKey_supportedChannelTip();
      console.log(res2); */
    },
    goOpenPay(info) {
      if (info.payChannel == "ll") {
        this.$router.push(`/ll_bag/account_opening`);
      } else {
        this.$router.push(`/mine/wallet/account_manage`);
      }
      console.log(info);
    },
    goHxt() {
      this.$router.push(`/mine/wallet/account_manage`);
    },
    async getSaleChannel() {
      const res = await this.$api.service.thirdAccount_saleChannel_v2({
        saleUuid: this.userInfo.userUuid,
        version: 1,
      });
      if (res.data.code == 200) {
        this.payWayInfo = res.data.data;
      }
    },
    showTxt(obj) {
      this.$confirm(obj.text, obj.name, {
        confirmButtonText: "我知道了",
        showCancelButton: false,
        customClass: "mobile-btn-center text-left",
      })
        .then(async () => {})
        .catch(() => {});
    },
    goNews(key) {
      this.$router.push(`/agreement/${key}`);
    },
    prepayConsignment() {
      //定金协议
      this.isAgreePrepayConsignment = !this.isAgreePrepayConsignment;
    },

    userPriceHandle() {
      clearTimeout(this.userPriceTimer);
      this.userPriceTimer = setTimeout(() => {
        this.computedPreapay();
      }, 360);
    },
    checkUserPrice() {
      //检查用户出售价格是否小于最小值
      if (this.sellTypeObj.typeSale != 2) {
        //定金预售类型才校验
        return;
      }
      if (!this.prepayCurrentOption) {
        //有定金比例时才校验
        return;
      }
      const lowPriceCent =
        new BigNumber(this.prepayCurrentOption.lowPriceCent).div(100) || 0;

      this.isPrepayLow =
        new BigNumber(this.param.price || 0).minus(lowPriceCent) < 0;
      if (this.sellTypeObj && this.sellTypeObj.typeSale != 2) {
        //只有预定金时才做校验
        this.isPrepayLow = false;
      }
      if (this.isPrepayLow) {
        this.prepayMoneyObj = {
          depositAmount: "0", //定金
          balanceAmount: "0", //尾款
        };
      }
      return {
        isPrepayLow: this.isPrepayLow,
        message: `寄售价格太低，寄售价格不应低于${this.$common.formatMoney(
          lowPriceCent
        )}`,
      };
    },
    prepayPriceCheck() {
      //预定金寄售价格校验
      let isPass = true,
        message = "";
      if (this.param.price) {
        if (this.param.price.search(/\.$/) !== -1) {
          isPass = false;
          message = "寄售价格有误";
        }
      } else {
        isPass = false;
        this.prepayMoneyObj = {
          depositAmount: "0", //定金
          balanceAmount: "0", //尾款
        };
        message = "请输入寄售价格";
      }
      return {
        isPass,
        message,
      };
    },
    computedPreapay() {
      //实时计算定金尾款
      if (this.sellTypeObj && this.sellTypeObj.typeSale == 2) {
        //只有预定金类型才进行计算

        const { isPass } = this.prepayPriceCheck();
        if (!isPass) {
          return;
        }

        //检查用户输入金额是否超过最大值
        if (
          new BigNumber(this.param.price).minus(depositMaxMoney) > 0 &&
          this.sellTypeObj.typeSale == 2
        ) {
          this.prepayMoneyObj = {
            depositAmount: "0", //定金
            balanceAmount: "0", //尾款
          };

          this.$message.warning(this.salePriceTexObj.text);
          return;
        }

        const { isPrepayLow, message } = this.checkUserPrice();
        if (isPrepayLow && this.param.price) {
          this.$message.warning(message);
          return;
        }
        this.getPrepayMoneyDetail();
      }
    },
    async getPrepayMoneyDetail() {
      const res = await this.$api.service.saleRecord_calculatePrice({
        typeSale: 2, //2-预售,目前只有2
        salePrice: this.param.price,
        depositRatioInt: this.prepayCurrentOption.depositRatioInt, //定金比例Int
      });
      if (res.data.code == 200) {
        let data = res.data.data;
        if (data.feeList && data.feeList.length > 0) {
          data.feeList = data.feeList.map((item) => {
            if (item.tips) {
              item.tips = item.tips.replace(/\（|\(/gi, "");
              item.tips = item.tips.replace(/\）|\)/gi, "");
              item.tips = `( ${item.tips} )`;
            }
            return item;
          });
          this.prepayFeeList = data.feeList;
        }

        this.prepayMoneyObj = data;
        this.prePayRealAmount = (res.data.data && res.data.data.income) || 0;
      } else {
        if (this.param.price > 0) {
          this.$message.error(res.data.message);
        }
      }
    },
    prepayOptionsHandle(item) {
      if (this.payTabList.length > 1) {
        this.computedPreapay();
      }
    },
    onPaywayHandle(info, idx) {
      this.payTabIdx = idx;
      this.param.price = null;
      this.computedPreapay();
      if (info.typeSale == 2) {
        //暂不支持单个tab自动调用的情况
        if (this.prepayFeeList && this.prepayFeeList.length > 0) {
        } else {
          this.getPrepayMoneyDetail();
        }
      }
    },
    formatMoeny(num) {
      return num.toFormat(2, BigNumber.ROUND_FLOOR, {
        prefix: "",
        decimalSeparator: ".",
        groupSeparator: "",
        groupSize: "",
        secondaryGroupSize: "",
      });
    },
    listenGetVCode(vCode) {
      this.treasureAddSaleRecordParam.authCode = vCode;
      this.goOn();
    },

    onICancelMerchantSettlement() {
      this.isAgreecConsignment = false;
      localStorage.removeItem(`${KEY}${this.userInfo.userUuid}`);
    },

    onIAgreeMerchantSettlement() {
      this.isAgreecConsignment = true;
      localStorage.setItem(`${KEY}${this.userInfo.userUuid}`, "1");
    },
    onClick() {
      if (this.isAgreecConsignment) {
        this.isAgreecConsignment = false;
        localStorage.removeItem(`${KEY}${this.userInfo.userUuid}`);
      } else {
        this.showConsignment();
      }
    },
    showConsignment() {
      this.getConsignment();
      this.$refs.consignmentRef.show();
    },

    async getConsignment() {
      try {
        const res = await this.$api.service.news_list({
          location: "consignment_agreement",
          pageCount: 1,
          pageSize: 20,
        });
        const resInfo = await this.$api.service.dynamicNews_findNews({
          uuid: res.data.data.records[0].uuid,
        });
        this.consignmentHtml = resInfo.data.data.details;
      } catch (error) {
        this.$message.warning("获取协议失败");
      }
    },
    onPrepayAgreement() {
      if (this.isAgreePrepayConsignment) {
        this.isAgreePrepayConsignment = false;
        localStorage.removeItem(`${PREPAY_KEY}${this.userInfo.userUuid}`);
      } else {
        this.showPrepayAgreement();
      }
    },
    async onPrepayConsignment(key) {
      this.isShowAgreementBtn = false;
      this.prepayAgreementTitle = prepayAgreementObj[key] || "预定金协议";
      try {
        const res = await this.$api.service.news_list({
          location: key,
          pageCount: 1,
          pageSize: 20,
        });

        const resInfo = await this.$api.service.dynamicNews_findNews({
          uuid: res.data.data.records[0].uuid,
        });

        this.depositHtml = resInfo.data.data.details;
      } catch (error) {
        this.depositHtml = "";
      }

      this.$refs.depositAgreementRef.show();
    },
    showPrepayAgreement() {
      this.getPrepayAgreement();
      this.$refs.depositAgreementRef.show();
    },
    onIAgreeDeposit() {
      this.isAgreePrepayConsignment = true;
      localStorage.setItem(`${PREPAY_KEY}${this.userInfo.userUuid}`, "1");
    },
    onICancelDeposit() {
      this.isAgreePrepayConsignment = false;
      localStorage.removeItem(`${PREPAY_KEY}${this.userInfo.userUuid}`);
    },
    async getPrepayAgreement() {
      this.isShowAgreementBtn = true;
      try {
        const res = await this.$api.service.news_list({
          location: "sale_deposit_rules",
          pageCount: 1,
          pageSize: 20,
        });
        const res2 = await this.$api.service.news_list({
          location: "deposit_technology_service",
          pageCount: 1,
          pageSize: 20,
        });
        const resInfo = await this.$api.service.dynamicNews_findNews({
          uuid: res.data.data.records[0].uuid,
        });
        const resInfo2 = await this.$api.service.dynamicNews_findNews({
          uuid: res2.data.data.records[0].uuid,
        });
        this.depositHtml =
          resInfo.data.data.details + resInfo2.data.data.details;
      } catch (error) {
        this.depositHtml = "";
      }
    },
    async getTxt() {
      //定金收取比例
      const depositProportionCharge =
        await this.$api.service.getByKey_depositProportionCharge();
      if (depositProportionCharge.data.code == 200) {
        this.depositTxtObj = depositProportionCharge.data.data;
      }
      //什么是定金预售
      const DepositPresellRule =
        await this.$api.service.getByKey_DepositPresellRule();
      if (DepositPresellRule.data.code == 200) {
        this.prepayTxtObj = DepositPresellRule.data.data;
      }
      //定金活动寄售最大金额

      const salePriceTexObj =
        await this.$api.service.getByKey_depositBigSalePrice();

      if (salePriceTexObj.data.code == 200) {
        this.salePriceTexObj = salePriceTexObj.data.data;
      }
    },
    async init(treasureSku, password) {
      this.dialogVisible = true;

      this.treasureSku = treasureSku;
      this.payTabIdx = 0;
      this.prepayOptionsIdx = 0;
      this.password = password;
      this.getSaleChannel();

      console.log(`treasureSku`, this.treasureSku);
      this.param.price = "";
      this.treasureAddSaleRecordParam.authCode = "";
      this.treasureAddSaleRecordParam.treasureId = this.treasureSku.treasureId;
      this.treasureAddSaleRecordParam.treasureSkuIdList = [];
      this.treasureAddSaleRecordParam.treasureSkuIdList.push(
        this.treasureSku.id
      );

      const isAgree = localStorage.getItem(`${KEY}${this.userInfo.userUuid}`);
      const isAgreePrepayConsignment = localStorage.getItem(
        `${PREPAY_KEY}${this.userInfo.userUuid}`
      );
      if (isAgreePrepayConsignment) {
        this.isAgreePrepayConsignment = true;
      }

      if (isAgree) {
        this.isAgreecConsignment = true;
      }
      this.getDiscount();
      this.getYbBalance();
      this.getPayList();
      this.getPrepayConfig();
      this.getAgeTips();
    },
    async getPrepayConfig() {
      //获取预支付配置
      const res = await this.$api.service.saleRecord_getSaleConfig({
        treasureSkuId: this.treasureSku.treasureId,
        commodityId: this.treasureSku.commodity.id,
        commodityCategoryUuid: this.treasureSku.commodity.commodityCategoryUuid,
      });

      if (res.data.code == 200 && res.data.data.sellList.length > 0) {
        if (res.data.data.sellList.find((item) => item.typeSale == 2)) {
          this.getTxt();
        }

        this.payTabList = res.data.data.sellList.map((item, idx) => {
          if (item.typeSale == 1) {
            item.name = "全款销售";
          }
          if (item.typeSale == 2) {
            item.name = "定金预售";
          }

          return item;
        });
      }
    },
    async getDiscount() {
      //获取优惠信息
      const res = await this.$api.service.discountQueryUserDiscountSell();
      if (res.data.code == 200) {
        console.log(res.data);
        this.discountInfo = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
    async getYbInfo() {
      //获取易宝钱包
      const res = await this.$api.service.ybWallet_getInfo();

      //-1无账号0正常1冻结2到期关闭3注销
      if (res && res.data.code == 200) {
        this.ybWalletStatus = res.data.data.status;
      }
    },
    async getYbBalance() {
      //易宝快捷余额

      const res = await this.$api.service.getBalance_yb();

      if (res && res.data.code == 200) {
        this.ybBalance = res.data.data.amount;
      }
    },
    async getPayList() {
      let res = await this.$api.service.payChannel_accountInfoList([
        {
          payChannel: "baofoo",
        },
        {
          payChannel: "hy",
        },
        {
          payChannel: "hxt",
        },
        {
          payChannel: "yb",
        },
      ]);
      if (res && res.data.code == 200) {
        this.payList = res.data.data;
      }
    },

    hide() {
      this.dialogVisible = false;
      this.$refs.smallConsignmentRef.hide();
    },
    async addSubmit() {
      if (this.isPrepay && this.sellTypeObj && this.sellTypeObj.typeSale == 2) {
        //检查用户输入金额是否超过最大值
        if (
          new BigNumber(this.param.price).minus(depositMaxMoney) > 0 &&
          this.sellTypeObj.typeSale == 2
        ) {
          this.$message.warning(this.salePriceTexObj.text);
          return;
        }
        const PrepayPriceStatus = this.prepayPriceCheck();
        if (!PrepayPriceStatus.isPass) {
          this.$message.warning(PrepayPriceStatus.message);
          return;
        }

        const { isPrepayLow, message } = this.checkUserPrice();
        if (isPrepayLow) {
          this.$message.warning(message);
          return;
        }
        if (!this.isAgreePrepayConsignment) {
          this.$message.warning(
            "请先阅读并勾选《数字艺术品售卖定金担保规则》《数字艺术品定金技术服务协议》"
          );
          return;
        }
        if (this.payList.yb.status != 1) {
          //易宝快捷账户
          this.$confirm(`您没有开通易宝账户，无法完成预售模式寄售。`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(async () => {
              window.open(`/mine/wallet/account_manage?page=yb_account`);
            })
            .catch(() => {});
          return;
        }
      } else {
        //全款
        if (!this.isAgreecConsignment) {
          this.$message.warning("请先阅读并勾选《商户入驻协议》");
          return;
        }
        const checkLLStatus = () => {
          let llStatus = 1; //默认未开通
          if (this.payWayInfo) {
            let llObj = this.payWayInfo.find((item) => item.payChannel == "ll");
            if (llObj) {
              return llObj.status;
            }
          }
          return llStatus;
        };

        if (checkLLStatus() == 1) {
          this.$confirm(`为了保证您的交易权益，请完成连连钱包的注册`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(async () => {
              window.location.href = `/ll_bag/account_opening`;
            })
            .catch(() => {});
          return;
        }
      }

      if (
        !/^\d+(.\d+)?$/.test(this.param.price.replace(/,/g, "")) ||
        Number(this.param.price) <= 0
      ) {
        this.$message.error("请输入正确的价格");
        return;
      }

      /* 跟易宝调整一起上线      if (
        this.havePayArr.length <= 0 ||
        !this.havePayArr.find((item) => item.payChannel == "yb")
      ) {
        this.$message.warning("您必须开通易宝（快捷支付）才能完成寄售");
        return;
      } */

      /*       await this.getYbInfo();

      if (this.param.price >= 50000 && this.ybWalletStatus !== 0) {
        this.$confirm(
          `大额交易需开通易宝钱包，请前往app端完成易宝钱包注册或续费。`,
          "提示",
          {
            confirmButtonText: "我知道了",
            showCancelButton: false,
          }
        )
          .then(async () => {})
          .catch(() => {});
        return;
      } else if (this.param.price < 50000 && this.ybWalletStatus !== 0) {
        const checkStatus = () => {
          //判断除易宝hxt，hy外其他账户是否开户
          for (let item in this.payList) {
            if (
              this.payList[item].status == 1 &&
              item !== "yb" &&
              item != "hxt" &&
              item != "hy"
            ) {
              return true;
            }
          }
          return false;
        };

        if (
          !checkStatus() &&
          this.ybBalance > 0 &&
          this.payList.yb.statusBankCard != 1
        ) {
          //易宝快捷账户
          this.$confirm(`请完成易宝账户认证，否则无法完成寄售`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(async () => {
              window.open(`/mine/wallet/account_manage?page=yb_account`);
            })
            .catch(() => {});
          return;
        }
      } */
      let confirmTxt = {
        text: `是否确认以<span style="color:#f4a33a">${this.$common.formatMoney(
          this.param.price
        )}</span>价格出售<span style="color:#f4a33a">${
          this.treasureSku.commodity.name
        }</span>商品`,
        sureTxt: "确定",
        cancelTxt: "取消",
      };
      if (this.sellTypeObj.typeSale == 2) {
        confirmTxt = {
          text: `预售藏品，买方支付定金后，不允许取消寄售，取消需承担退一赔一责任。且交易双方都需要开通易宝账户。`,
          sureTxt: "继续寄售",
          cancelTxt: "我再想想",
        };
        this.$confirm(confirmTxt.text, "提示", {
          customClass: "confirm-btn-between",
          confirmButtonText: confirmTxt.sureTxt,
          cancelButtonText: confirmTxt.cancelTxt,
          // type: "warning",
          dangerouslyUseHTMLString: true,
        })
          .then(async () => {
            this.goOn();

            return;
          })
          .catch(() => {});
      } else {
        this.$confirm(confirmTxt.text, "", {
          confirmButtonText: confirmTxt.sureTxt,
          cancelButtonText: confirmTxt.cancelTxt,
          // type: "warning",
          dangerouslyUseHTMLString: true,
        })
          .then(async () => {
            const res = await this.$api.service.saleRecord_checkSalePrice({
              id: this.treasureSku.treasureId,
              price: this.param.price,
            });
            /*        this.$refs.smallConsignmentRef.init(123);
          return;  */
            if (res.data.code == 200 && res.data.data.result) {
              //低价
              this.$refs.smallConsignmentRef.init(res.data.data.phone);
            } else {
              this.goOn();
            }

            return;
          })
          .catch(() => {});
      }
    },
    goOn() {
      //继续流程
      this.treasureAddSaleRecordParam.price = this.param.price;
      this.consignment();
      /* this.$parent.$parent.checkBHUserInfo(this.param.price); */
    },
    async consignment() {
      //支付密码校验
      this.consignmentAuth();

      /*    this.$common.initGeetest({
        success: this.consignmentAuth,
        id: 3,
        api:'/goods/api/saleRecord/add'
      }); */
    },
    async consignmentAuth() {
      const resPassword = await Encryption.getPassword(this.password);
      if (!resPassword) {
        this.$message.warning("密码加密错误");
        return;
      }
      this.treasureAddSaleRecordParam.password = resPassword;
      if (this.sellTypeObj.typeSale == 2) {
        this.treasureAddSaleRecordParam = {
          ...this.treasureAddSaleRecordParam,
          ...{
            typeSale: this.sellTypeObj.typeSale, //寄售方式类型，不传缺省为1
            depositRatioInt: this.prepayCurrentOption.depositRatioInt, //定金比例
            depositAmount: this.prepayMoneyObj.depositAmount, //定金金额，校验用：确保用户看到和服务端计算一致
            balanceAmount: this.prepayMoneyObj.balanceAmount,
          },
        };
      }

      let result = await this.$api.service.treasure_addSaleRecord(
        this.treasureAddSaleRecordParam
      );
      if (result.data.code == 200) {
        //  this.$message.success("操作成功");
        this.hide();
        this.$emit("listen", result.data);
        if (this.$parent.$parent.showSuccess) {
          this.$parent.$parent.showSuccess();
        }
      } else {
        this.$message.error(result.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-balance {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/pay/hxt.png");
}
.icon-baofoo {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/pay/baofu.png");
}
.icon-yb {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/pay/yb.png");
}
.icon-ll {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/pay/ll.png");
}
.pay-way-list {
  .title {
    font-size: 14px;
    color: #333333;
    padding: 15px 0;
  }
  .pay-way-bar {
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: 400;
    color: #4d4d4d;
  }
  .ui-icon {
    margin-right: 4px;
  }
  .disable {
    font-weight: 400;
    color: #999999;
  }
  .link-btn {
    font-weight: 400;
    color: #397fe7;
  }
}
.text-money {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
}
.moeny-color {
  color: #e61f1a;
}
.pay-way-message {
  padding: 15px 0;
  font-size: 12px;
  font-weight: 400;
  color: #b1b1b1;
  line-height: 17px;
  border-top: 1px dashed rgba(151, 151, 151, 0.3);
  /*   border-bottom: 1px dashed rgba(151, 151, 151, 0.3); */
  margin-top: 10px;
  > div {
    margin-bottom: 8px;
  }
  > div:last-child {
    margin-bottom: 0;
  }
}
.prepay-channel-info {
  font-size: 12px;
  font-weight: 400;
  color: #b1b1b1;
  line-height: 17px;
  padding: 15px 0 15px;
  border-top: 1px dotted rgba(151, 151, 151, 0.3);
  > div {
    margin-bottom: 8px;
  }
  > div:last-child {
    margin-bottom: 0;
  }
  .link-blue {
    font-weight: 500;
    color: #397fe7;
  }
}
.prepay-money-flex {
  display: flex;
  justify-content: space-between;
}
.flex-prepay-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-prepay-radius {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-round-default.png");
}
.icon-prepay-radius-checked {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-selected.png");
}
.icon-help {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/prepay/icon-help.png");
}
.footer-wrap {
  padding: 24px 24px 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.deposit-txt-wrap {
  font-size: 12px;
  color: #333333;
  margin-bottom: 14px;
}
.form-btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  > div {
    margin-left: 24px;
  }
  @media screen and (max-width: 540px) {
    justify-content: space-between;
  }
}
.prepay-options-wrap {
  margin: 0 0 16px;
  :deep(.el-select) {
    width: 100%;
  }
}
.swipch-wrap {
  margin: -8px;
  margin-bottom: 8px;
  .tab {
    flex: 1;
    padding: 8px;
  }
  .tab-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 400;
    color: #999999;
    width: 100%;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    .ui-icon {
      width: 13px;
      height: 13px;
      margin-right: 9px;
    }
  }
}
.prepay-wrap {
  .title-wrap {
    margin-bottom: 16px;
  }
  .tab-wrap-checked {
    border-color: #397fe7;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .help {
    font-size: 12px;
    font-weight: 400;
    color: #666666;
  }
  .deposit-txt-wrap {
    margin-bottom: 16px;
    .help {
      color: #333333;
    }
  }
  .money-wrap {
    margin-top: 10px;
    .line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;
      .key {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
      }
      .val {
        font-size: 12px;
        color: #e61f1a;
      }
    }
    .warning-txt {
      font-size: 12px;
      font-weight: 400;
      color: #e61f1a;
      margin-bottom: 14px;
    }
    .warning-txt-2 {
      font-size: 12px;
      font-weight: 400;
      color: #f4a33a;
      margin-bottom: 16px;
    }
  }
}
.form-line {
  ::v-deep .m-num-wrap {
    padding-left: 0;
  }
}
.v1-dialog-mycenter {
  .input-line {
    margin-bottom: 0;
    :deep(.el-input__inner) {
      color: #e61f1a;
      padding-left: 22px;
      font-size: 16px;
    }
    :deep(.el-input__prefix) {
      color: #e61f1a;
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }
  h1 {
    font-size: 14px;
    color: #333333;
  }
}
.m-consignment-wrap {
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  cursor: pointer;
  margin-bottom: 24px;
  .icon {
    width: 12px;
    height: 12px;
    position: relative;
    top: 1px;

    background-image: url("//static.theone.art/pc/icons/icon-select.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    display: inline-block;
    margin-right: 2px;
  }
  .selected {
    background-image: url("//static.theone.art/pc/icons/icon-selected.png");
  }
  .link {
    color: #397fe7;
  }
}
.pay-way-info {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
  padding-bottom: 15px;
}
.consignment-content {
  .c-html {
    max-height: 240px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    overflow-y: auto;
  }
  .btn-group {
    display: flex;
    align-items: right;
    justify-content: flex-end;
    padding-top: 26px;
    .btn {
      display: inline-block;
      line-height: 30px;
      background: #e5e5e5;
      border-radius: 15px;
      font-size: 14px;
      text-align: center;
      padding: 0 36px;
      margin-left: 24px;
      cursor: pointer;
    }
    .btn-default {
      background-color: #e5e5e5;
      color: rgba(0, 0, 0, 0.7);
    }
    .btn-red {
      background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
      color: #fff;
    }
  }

  @media screen and (max-width: 540px) {
    .btn-group {
      justify-content: space-between;
      .btn {
        margin: 0;
        padding: 0;
        text-align: center;
        font-size: 0.28rem;
      }

      .btn-default {
        width: 46%;
      }
      .btn-red {
        width: 50%;
      }
    }
  }
}
.page-mine-sell-add {
  h1 {
    font-size: 14px;
    color: #333333;
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
  .dialog-content {
    max-height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px 24px 0;
  }
  .message {
    font-size: 12px;
    font-weight: 400;
    color: #397fe7;
    .prepay-income-wrap {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .moeny-color {
        font-size: 12px;
        color: #e61f1a;
      }
    }

    .line {
      display: inline-block;
      padding: 0 3px;
    }

    .txt {
      padding: 4px 0;
    }
    .through {
      color: rgba(0, 0, 0, 0.4);
      text-decoration: line-through;
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 540px) {
  .v1-form-line {
    flex-direction: column;
    width: 100%;
    align-items: baseline;
    .message {
      align-items: baseline;
    }
  }
  .v1-btn {
    &.mycenter {
      width: 2.76rem;
      height: 0.72rem;
      line-height: 0.72rem;
      border-radius: 0.36rem;
      background: #e5e5e5;
      font-size: 0.28rem;
      color: rgba($color: #000000, $alpha: 0.7);
      font-weight: 500;
      padding: 0;
      border: none;
      margin-left: 0 !important;
      &.red {
        margin-left: 10px !important;
        background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
        color: #ffffff;
      }
    }
  }
  .page-mine-sell-add {
    .dialog-content {
      max-height: 50vh;
    }
  }
}
</style>
