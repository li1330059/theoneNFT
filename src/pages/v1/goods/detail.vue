<template>
  <div class="page-goods-detail">
    <div class="mode-mobile">
      <m-header :title="'商品详情'" />
    </div>
    <!-- {{goods.commodity}} -->
    <div class="loading" v-if="loading">
      <loading></loading>
    </div>
    <div class="m-empty" v-else-if="showImpty">
      <div>
        <img src="//static.theone.art/pc/icons/goods-empty.png" />
        <div class="txt" v-html="errorMessage"></div>
      </div>
    </div>
    <div class="page-wrap" v-else>
      <div class="mode-mobile">
        <div class="mobile-goods-name">
          <h1 class="mobile-goods-flex">{{ goods.commodity.name }}</h1>
          <div class="operate">
            <commodity-num :treasure="goods"></commodity-num>

            <div class="hert-wrap">
              <div
                :class="['heart', isCollection ? 'heart-active' : '']"
                @click="collection(goods.commodity.name)"
              >
                {{ $common.formatFansNumber(goods.commodity.amountLike) || 0 }}
              </div>
              <div class="share-btn">
                <div class="share"></div>
                <div class="share-bar">
                  <div
                    class="share-item"
                    v-for="(itemShare, indexShare) in shareOptions"
                    :key="indexShare"
                    @click="shareClick(itemShare)"
                    :class="itemShare.icon"
                  >
                    {{ itemShare.name }}
                    <div
                      v-if="itemShare.icon == 'wechat'"
                      id="wx_code_img_mobile"
                      class="share-code"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="label" v-if="goods.commodity.label">
          <span v-for="(item, index) in goods.commodity.label" :key="index">{{
            item
          }}</span>
        </div>
      </div>

      <div class="goods-wrap">
        <div class="ui-goods-wrap">
          <detail-goods-view :goods="goods"></detail-goods-view>
        </div>

        <div class="goods-info">
          <div class="mode-PC">
            <div class="name">
              <h1>
                {{ goods.commodity.name }}
                <commodity-num :treasure="goods"></commodity-num>
              </h1>
              <div class="operate">
                <div
                  :class="['heart', isCollection ? 'heart-active' : '']"
                  @click="collection(goods.commodity.name)"
                >
                  {{
                    $common.formatFansNumber(goods.commodity.amountLike) || 0
                  }}
                </div>
                <div class="share-btn">
                  <div class="share"></div>
                  <div class="share-bar">
                    <div
                      class="share-item"
                      v-for="(itemShare, indexShare) in shareOptions"
                      :key="indexShare"
                      @click="shareClick(itemShare)"
                      :class="itemShare.icon"
                    >
                      {{ itemShare.name }}
                      <div
                        v-if="itemShare.icon == 'wechat'"
                        id="wx_code_img"
                        class="share-code"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="label" v-if="goods.commodity.label">
              <span
                v-for="(item, index) in goods.commodity.label"
                :key="index"
                >{{ item }}</span
              >
            </div>
          </div>

          <div class="arrt">
            <div>
              <h1>权益属性</h1>
              <p v-if="goods.commodity.typeMarket == 1">版权品</p>
              <p v-else-if="goods.commodity.typeMarket == 2">衍生品</p>
              <p v-else-if="goods.commodity.typeMarket == 3">
                数字身份标识艺术品
              </p>
            </div>
            <div v-if="goods.author && goods.author.nickname">
              <h1>艺术家：</h1>
              <div class="v1-icon-people people">
                {{ goods.author && goods.author.nickname }}
              </div>
            </div>
            <div v-if="!goods.author && goods.authorName">
              <h1>作者：</h1>
              <div class="v1-icon-people people">
                {{ goods.authorName }}
              </div>
            </div>
            <div v-if="artist && goods.commodity.typeMarket == 3">
              <h1>首发方：</h1>
              <div class="v1-icon-people people">
                {{ artist }}
              </div>
              <!-- <div class="v1-icon-people people" v-else>
                {{ goods.author && goods.author.nickname }}
              </div> -->
            </div>
            <div
              v-if="
                goods.commodity.typeMarket != 3 &&
                (goods.commodity.seller ||
                  (goods.author && goods.author.nickname))
              "
            >
              <h1>首发方：</h1>
              <div class="v1-icon-people people" v-if="goods.commodity.seller">
                {{ goods.commodity.seller }}
              </div>
              <div class="v1-icon-people people" v-else>
                {{ goods.author && goods.author.nickname }}
              </div>
            </div>
            <div v-if="goods.caster">
              <h1>铸造者：</h1>
              <div class="v1-icon-people people">
                {{ goods.caster }}
              </div>
            </div>
            <div v-if="goods.issuer">
              <h1>发行方：</h1>
              <div class="v1-icon-people people">
                {{ goods.issuer }}
              </div>
            </div>
            <div class="volume-pc" v-if="marketVolume.commodityTotalFlag">
              <h1>市场总量：</h1>
              <p class="volume-num">
                {{ marketVolume.commodityTotal }}
                <!-- <span @click="goVolume()">查看</span> -->
              </p>
            </div>
          </div>
          <div
            class="arrt volume-m hand"
            v-if="marketVolume.commodityTotalFlag"
            @click="showTxt(marketVolumeTip)"
          >
            <h1>市场流通量<span class="v1-icon-question"></span></h1>
            <div class="volume-num">
              {{ marketVolume.commodityTotal }}
              <!-- <div class="go-volume" @click="goVolume()"></div> -->
            </div>
          </div>
          <!--          <div class="arrt-panel pay-wrap">
            <div class="con">
              <div class="line hor" v-if="goods.publisher&&goods.publisher.type==2">
                <div class="line-item">
                  <h1>出售方：</h1>
                  <p>{{ goods.publisher && goods.publisher.nickname }}的店铺</p>
                  </div>
              </div>
              <div class="line hor"> -->
          <!-- <div class="between"> -->
          <!--                  <h1>店铺支持的结算方式：</h1>
                 <div class="pay-way">
                    <li class="pay-way-item"  v-for="(item,index) in payWayInfo" :key="index">
                      <div class="pay-way-img" :style="'background-color:'+item.info.bgColor2">
                        <img :src="item.info.src" alt />
                      </div>
                      <span>{{item.simpleName}}</span>
                    </li>
                  </div> -->
          <!-- </div> -->
          <!--              </div>
            </div>
          </div> -->
          <div class="prepay-block" v-if="goods.typeSale == 2">
            <div class="price-calculation-wrap">
              <div class="b1">
                <div class="b-money">
                  {{
                    $common.formatMoney(
                      goods.presaleInfo && goods.presaleInfo.depositAmount
                    )
                  }}
                </div>
                <div class="b-label">定金</div>
              </div>
              <div class="ui-icon icon-add">+</div>
              <div class="b1">
                <div class="b-money">
                  {{
                    $common.formatMoney(
                      goods.presaleInfo && goods.presaleInfo.balanceAmount
                    )
                  }}
                </div>
                <div class="b-label">尾款</div>
              </div>
              <div class="ui-icon icon-to">=</div>
              <div class="b1 b1-bg">
                <div class="b-bg-money">
                  {{ $common.formatMoney(prepayMoney) }}
                </div>
                <div class="b-label">总价</div>
              </div>
            </div>
            <div class="warning-text warning-margin-bottom">
              尾款请在支付定金后{{
                goods.presaleInfo && goods.presaleInfo.depositDay
              }}天内完成支付
            </div>
          </div>

          <div class="v1-price v1-price-left" v-else>
            {{ $common.formatMoney(goods.price) }}
          </div>
          <!--          <div class="ifonline" v-if="!goods.online">
            当前画作正在线下展览中
          </div> -->
          <div class="ui-line-wrap" v-if="isShowBtn">
            <div
              class="btn-buy"
              :class="{ disabled: buy_disabled }"
              @click="onBuy"
              v-html="statusSale"
            ></div>
            <div class="message" v-if="goods.showStatus == 4">
              {{ tipText }}
            </div>
          </div>

          <div class="arrt-panel authentication">
            <h1>认证信息</h1>
            <div class="con">
              <div class="line m-line" style="align-items: center">
                <h1>
                  <el-popover
                    placement="top-start"
                    title
                    width="260"
                    trigger="hover"
                    content=" 智能合约是存储在区块链网络中的一段代码，它界定了各方使用合同的条件。
                      所以如果需要的条件被满足，就被自动执行。合约地址是指该智能合约的合同编号（ID）"
                  >
                    <div slot="reference">
                      <div class="v1-icon-question">合约地址</div>
                    </div>
                  </el-popover>
                </h1>
                <div>
                  <copy
                    v-if="$authInfomation.contractAddress(goods)"
                    class="m-copy-blue"
                    @listen="
                      $authInfomation.goContractAddress(
                        $authInfomation.getChainName(goods),
                        $authInfomation.contractAddress(goods),
                        $authInfomation.getChainContract(goods)
                      )
                    "
                    :is-full="false"
                    :short="6"
                    :txt="$authInfomation.contractAddress(goods)"
                  />
                  <div v-else>上链确认中</div>
                </div>
              </div>

              <div class="line m-line" style="align-items: center">
                <h1>
                  <el-popover
                    placement="top-start"
                    title
                    width="260"
                    trigger="hover"
                    content="数字艺术品在链上的唯一序号。"
                  >
                    <div slot="reference">
                      <div class="v1-icon-question">认证标识</div>
                    </div>
                  </el-popover>
                </h1>

                <copy
                  v-if="$authInfomation.getNftId(goods)"
                  class="m-copy-blue"
                  @listen="
                    $authInfomation.goNftId(
                      $authInfomation.getChainName(goods),
                      $authInfomation.contractAddress(goods),
                      $authInfomation.getNftId(goods),
                      $authInfomation.getChainContract(goods)
                    )
                  "
                  :short="6"
                  :is-full="false"
                  :txt="$authInfomation.getNftId(goods)"
                />
                <div v-else>上链确认中</div>
              </div>

              <div class="line m-line">
                <h1>认证标准</h1>
                <div class="letter-uppercase">
                  {{
                    $authInfomation.getChainContract(goods)
                      ? $authInfomation.getChainContract(goods)
                      : "上链确认中"
                  }}
                </div>
              </div>
              <div class="line m-line">
                <h1>认证网络</h1>
                <div
                  class="pointer"
                  @click="
                    $authInfomation.goChain($authInfomation.getChainName(goods))
                  "
                >
                  {{
                    $authInfomation.getChainName(goods)
                      ? $authInfomation.getChainName(goods)
                      : "上链确认中"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        class="trade-list"
        v-if="orderBuyListPublic && orderBuyListPublic.records.length > 0"
      >
        <div class="title">交易记录</div>
        <div class="mode-PC">
          <div class="mode-PC-trade">
            <div
              class="line"
              v-for="(item, index) in orderBuyListPublic.records"
              :key="index"
            >
              <div class="people">
                购买人
                <h1 class="">@{{ item.buyUser && item.buyUser.nickname }}</h1>
              </div>
              <div class="v1-price">{{ $common.formatMoney(item.price) }}</div>
              <div class="time">{{ item.createTime }}</div>
            </div>
          </div>
        </div>
        <div class="mode-mobile">
          <div class="mode-mobile-trade">
            <div
              class="line"
              v-for="(item, index) in orderBuyListPublic.records"
              :key="index"
            >
              <div class="people">
                <h1>@{{ item.buyUser && item.buyUser.nickname }}</h1>
                购买人
              </div>
              <div class="price">
                <div class="v1-price">
                  {{ $common.formatMoney(item.price) }}
                </div>
                <div class="time">{{ item.createTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>-->
      <div class="element-wrap" v-if="elements.length > 0">
        <div class="title">
          <el-popover
            placement="top-start"
            title
            width="260"
            trigger="hover"
            content="商品特性指商品图片的组成元素，占比指特性占所属分类等级下商品总数的比例"
          >
            <div slot="reference">
              <div class="v1-icon-question">
                商品特性
                <span class="ui-icon"></span>
              </div>
            </div>
          </el-popover>
        </div>
        <div class="main">
          <div
            class="box"
            v-for="(item, idx) in elements"
            :key="idx"
            @click="goMarket(item)"
          >
            <div class="bar">
              <div class="l1 hidden-1">{{ item.traitType }}</div>
              <div class="l2 hidden-1">{{ item.traitValue }}</div>
              <div class="l3 hidden-1">占比：{{ item.ratio }}</div>
            </div>
          </div>
        </div>
      </div>
      <artistBar
        v-if="goods && goods.author"
        :artist="goods.author"
        :authorInstitution="goods.authorInstitution"
      ></artistBar>
      <div>
        <div class="v1-module-title">商品详情</div>
        <div class="goods-introduce">
          <div class="content">
            <div v-if="goods.commodityAttr">
              <h1>权益须知</h1>
              <div class="txt" v-html="goods.commodityAttr.rights"></div>
            </div>
            <div v-if="goods.seriesWorks && goods.seriesWorks.description">
              <h1>作品系列（背景）简介</h1>
              <div class="txt" v-html="goods.seriesWorks.description"></div>
            </div>
            <div>
              <h1>单品介绍</h1>
              <div class="txt" v-html="goods.commodity.description"></div>
            </div>
            <div v-if="goods.commodityAttr">
              <h1>购买须知</h1>
              <div class="txt" v-html="goods.commodityAttr.purchase"></div>
            </div>
            <div v-if="goods.honorList && goods.honorList.length > 0">
              <h1>荣誉属性</h1>
              <honor :honorList="goods.honorList" />
            </div>
          </div>
        </div>
      </div>
      <!-- TODO 数字身份、捏脸和自己创作的作品，均不展示「相关作品」和「同类型作品」模块 -->
      <div v-if="goods.commodity.sourcePlatform !== 3">
        <relationship
          type="same"
          :data_value="goods.commodity.id"
        ></relationship>
      </div>
      <div v-if="goods.commodity.sourcePlatform !== 3">
        <relationship
          type="author"
          :data_value="goods.author && goods.author.id"
        ></relationship>
      </div>
      <!-- <div>
        <relationship type="like"></relationship>
      </div>-->
    </div>
    <!-- 微信浏览器支付弹窗 -->
    <wxPayPop ref="wxPayPop" />
  </div>
</template>
<script>
import detailGoodsView from "./components/detail-goods-view.vue";
import QRCode from "qrcodejs2";
import relationship from "@/pages/v1/goods/components/relationship";
import artistBar from "@/pages/v1/artist/components/bar";
import loading from "@/components/v1/loading/loading";
import honor from "@/components/v1/honor";
import mHeader from "@/components/v1/layout/mobileHeader";
import wxPayPop from "./components/wxPayPop";
const BigNumber = require("bignumber.js");
export default {
  components: {
    artistBar,
    loading,
    mHeader,
    wxPayPop,
    relationship,
    detailGoodsView,
    honor,
  },
  data() {
    return {
      marketVolumeTip: {
        name: "市场流通量",
        text: "为平台用户持有的，处于非锁定，非冻结，未销毁等影响数字藏品交易的该数字艺术品总数量。提醒您注意的是，该数量可能收到首发方库存藏品投放，发售，销毁，数字藏品特殊状态产生，解除等因素的影响而发生变化。",
      },
      isShowBtn: true,
      orderDetail: {},
      elements: [],
      loading: false,
      showImpty: false,
      errorMessage: "抱歉，该商品不存在或已下架，<br />看看我们最新的画作吧~",
      id: null,
      goods: {
        commodity: {}, //商品信息
        author: {}, //作者信息
        publisher: {},
      },
      buy_disabled: false,
      isCollection: false,
      shareOptions: [
        { icon: "link", name: "复制链接", key: "copy" },
        { icon: "wechat", name: "微信", key: "wechat" },
        { icon: "qq", name: "QQ", key: "QQ" },
      ],
      orderBuyListPublic: null, //出售记录列表
      payWayInfo: null, //支持的支付方式
      orderStatus: "",
      payChannelInfo: {
        balance: {
          bgColor1: "rgba(255, 174, 67, 0.1)",
          bgColor2: "rgba(255, 174, 67, 0.1)",
          src: "https://static.theone.art/pc/mine/icon-hxt.png",
        },
        hxt: {
          bgColor1: "rgba(255, 174, 67, 0.1)",
          bgColor2: "rgba(255, 174, 67, 0.1)",
          src: "https://static.theone.art/pc/mine/icon-hxt.png",
        },
        baofoo: {
          bgColor1: "rgba(28, 117, 181, 0.1)",
          bgColor2: "rgba(28, 117, 181, 0.1)",
          src: "https://static.theone.art/pc/mine/icon-bf.png",
        },
        hy: {
          bgColor1: "rgba(67, 121, 255, 0.1)",
          bgColor2: "rgba(67, 121, 255, 0.1)",
          src: "https://static.theone.art/pc/mine/icon-hy.png",
        },
        yb: {
          bgColor1: "rgba(30, 120, 66, 0.07)",
          bgColor2: "rgba(30, 120, 66, 0.07)",
          src: "https://static.theone.art/pc/mine/icon-yb.png",
        },
      },
      marketVolume: {},
      statusAvailable: 1,
    };
  },
  computed: {
    tipText() {
      if (this.orderStatus.statusSale == 5 && this.orderStatus.status == 4) {
        return ``;
      }

      return "当前有人正在支付";
    },
    artist() {
      return this.goods.commodity && this.goods.commodity.seller
        ? this.goods.commodity.seller
        : this.goods.commodity &&
            this.goods.commodity.extendsData &&
            this.goods.commodity.extendsData.creator;
    },
    statusSale() {
      switch (Number(this.goods.statusSale)) {
        case 0:
          return "待处理";
        case 1:
          if (this.goods.typeSale == 2) {
            return `立即支付定金：<span style="font-size:18px;display:inline-block;padding-left:4px;">${this.$common.formatMoney(
              this.goods.presaleInfo && this.goods.presaleInfo.depositAmount
            )}</span>`;
          }

          return "立即购买";
        case 2:
          return "已售罄";
        case 3:
          return "已下架";
        case 4:
          return "审核不通过";
        case 5:
          return "已锁定";

        default:
          return "立即购买";
      }
    },
    prepayMoney() {
      //预定金总价
      return new BigNumber(
        (this.goods.presaleInfo && this.goods.presaleInfo.depositAmount) || 0
      ).plus(
        (this.goods.presaleInfo && this.goods.presaleInfo.balanceAmount) || 0
      );
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.active_id = this.$route.query.active_id;
    this.getGoodsInfo();
    this.shareInit();
    this.getpayWayInfo();
    this.getActiveInfo();
    this.getMarketVolumeTip();
    if (this.$route.query.status) {
      try {
        this.orderStatus = JSON.parse(this.$route.query.status);
        this.orderStatus.status = 1;
        console.log(this.orderStatus);
      } catch (error) {}
    }
  },
  methods: {
    async getMarketVolumeTip() {
      const res = await this.$api.service.getByKey_marketVolumeTip();
      if (res.data.code == 200) {
        this.marketVolumeTip = res.data.data;
      }
    },
    showTxt(obj) {
      this.$confirm(obj.text, `市场流通量说明`, {
        confirmButtonText: "我知道了",
        showCancelButton: false,
        customClass: "mobile-btn-center text-left",
      })
        .then(async () => {})
        .catch(() => {});
    },

    goMarket(info) {
      this.$router.push(
        `/market?type=copyright&category_id=${
          this.goods.commodity.commodityCategoryUuid
        }&trait_type=${encodeURIComponent(
          info.traitType
        )}&value_name=${encodeURIComponent(info.traitValue)}`
      );
    },
    onPlayVideo(info) {
      if (info.commodity && info.commodity.actualPicture) {
        this.$store.commit("setGoodsVideoInfo", {
          isShow: true,
          src: info.commodity.actualPicture,
        });
      } else {
        this.$message.warning("暂无视频");
      }
    },
    createNum(num) {
      return `${new BigNumber(num).multipliedBy(100).toNumber()}%`;
    },
    async getElements(commodityId) {
      const res = await this.$api.service.commodityTrait_ratio({ commodityId });

      if (res.data.code == 200) {
        this.elements = res.data.data;
      }
    },
    async getGoodsInfo() {
      this.loading = true;
      this.showImpty = false;
      let result = await this.$api.service.saleRecord_detail({ id: this.id });
      /*     result = {
        data: {
          code: 200,
          message: "成功",
          data: {
            price: "0.00",
            amount: 1,
            amountAvailable: 1,
            amountLock: 0,
            statusSale: 1,
            commodity: {
              name: "1",
              cover:
                "https://qa-theoneart-public-shenzhen.oss-cn-shenzhen.aliyuncs.com/watermark/8f2a6edd9bb73383b50dad8ed2f1000e/b39009d6ea7dec456519ab1ffb4e68e1-1656089096495.png",
              actualPicture:
                "https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/test/normal%20video%20(1).mp4",
              coverGifVideo:
                "https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/test/normal%20video%20(1).mp4",
              chainName: null,
              chainContract: null,
              tradeHash: null,
              contractAddress: null,
              nftId: null,
              amountLike: 1,
              typeMarket: 1,
              typeCommodity: 1,
              typeFile: 3,
              label: "",
              description: "",
              price: "0.00",
              amountSku: 1,
              statusNumber: 1,
              sharePic: "",
              statusGive: 0,
              gifFirstImageUrl: null,
              seller: null,
              saleQuantity: 0,
              commodityCategoryUuid: "3bdd421719acb75686fa574e3bdb4fa0",
              id: "4a101a3c597fadcab9d91f32090146a9",
            },
            commoditySku: {
              number: 1,
              amountNumber: null,
              name: "1",
              cover: null,
              actualPicture: null,
              amountLike: 1,
              chainName: null,
              chainContract: null,
              contractAddress: null,
              nftId: null,
              dataJson: null,
              id: "1b8a84fa9bc656026f9f8251d380c65e",
              commodityId: "4a101a3c597fadcab9d91f32090146a9",
            },
            author: {
              name: "李玉玺",
              nickname: "唯艺702651",
              cover:
                "https://resource.theone.art/author/f74018b06f4082a3f49d32165ad6469d1649225219056.jpeg",
              level: null,
              description: null,
              id: "8f2a6edd9bb73383b50dad8ed2f1000e",
            },
            publisher: { name: null, nickname: null, type: 1 },
            seriesWorks: { name: null, type: 2, description: null },
            commodityAttr: null,
            discountAmountInfo: { discountInfo: [], discountAmount: "0.00" },
            like: false,
            online: true,
            id: "35110a13f3ce49d81c2d710312b8a5f8",
          },
        },
      }; */

      this.loading = false;
      if (result && result.data.code == 200) {
        const showStatus = result.data.data.showStatus;
        if (this.$route.query.from == "release") {
          this.isShowBtn = false;
          this.buy_disabled = true;
        } else {
          this.isShowBtn = true;
          this.buy_disabled = showStatus !== 1;
        }

        this.goods = result.data.data;
        if (!this.goods) {
          this.showImpty = true;
        } else {
          this.getElements(this.goods.commodity.id);
          if (this.goods.commodity.label) {
            this.goods.commodity.label = this.goods.commodity.label.split(",");
          }
        }

        await this.getGoodsFocusByUuid();
        this.getMarketVolume();
      } else {
        this.showImpty = true;
        this.errorMessage = result.data.message;
        //this.$message.error(result.data.message);
      }
      // this.getOrderBuyListPublic();
    },
    onBuy() {
      // 拉新：如果有邀请码带上邀请码query参数
      const inviteCodeCache = sessionStorage.getItem("inviteCode");
      if(inviteCodeCache) {
        this.$router.push({
          query: {
            ...this.$route.query,
            inviteCode: inviteCodeCache
          }
        })
      }
      if (!this.statusAvailable) {
        this.$message.warning("该活动已停用");
        return;
      }
      if (!this.buy_disabled) {
        if (this.$common.browserIsWeChat()) {
          this.$refs.wxPayPop.show();
          return;
        }
        this.$sensors.track("goodsdetail_click", {
          button_name: "立即购买",
        });
        let path = `/buy/${this.id}`;
        if (this.active_id) {
          path = `/buy/${this.id}?active_id=${this.active_id}`;
        }
        this.$router.push({
          path: path,
        });
      }
    },
    async getActiveInfo() {
      //获取活动信息
      if (this.active_id) {
        const res = await this.$api.service.exhibition_getConfiguration({
          uuid: this.active_id,
        });
        if (res.data.code == 200) {
          this.statusAvailable = res.data.data.statusAvailable;
        }
      }
    },
    shareInit() {
      //分享 微信二维码
    },
    shareClick(item) {
      this.$sensors.track("goodsdetail_click", {
        button_name: "顶部分享",
      });
      let url = window.location.href;
      if (item.key == "copy") {
        var domUrl = document.createElement("input");
        domUrl.value = url;
        domUrl.id = "creatDom";
        document.body.appendChild(domUrl);
        domUrl.select();
        document.execCommand("Copy");
        let creatDom = document.getElementById("creatDom");
        creatDom.parentNode.removeChild(creatDom);
        this.$message.success("复制成功，粘贴给小伙伴们吧~");
      } else if (item.key == "weibo") {
        let path =
          "http://service.weibo.com/share/share.php?url=" +
          url +
          "&sharesource=weibo&title=" +
          this.goods.name +
          "&pic=" +
          this.goods.cover +
          "&appkey=";
        window.open(path, "_blank");
      } else if (item.key == "wechat") {
        if (!this.wx_code) {
          let dom_id = "wx_code_img";
          if (window.innerWidth <= 540) {
            dom_id = "wx_code_img_mobile";
          }
          this.wx_code = new QRCode(document.getElementById(dom_id), {
            width: 80,
            height: 80,
            text: window.location.href,
          });
        }
      } else if (item.key == "QQ") {
        let path =
          "http://connect.qq.com/widget/shareqq/index.html?url=" +
          encodeURIComponent(url) +
          "&sharesource=qzone&title=" +
          this.goods.name +
          "&pics=" +
          this.goods.cover +
          "&summary=" +
          this.goods.introduce +
          "&desc=" +
          this.goods.name;
        window.open(path, "_blank");
      }
    },
    //喜欢取消喜欢
    async collection(name) {
      let collectionParam = {
        dataType: 2,
        dataId: this.id,
        type: null,
      };
      if (this.isCollection) {
        collectionParam.type = 2;
      } else {
        collectionParam.type = 1;
      }
      let result = null;
      if (collectionParam.type == 1) {
        this.$sensors.track("goodsdetail_click", {
          button_name: "顶部收藏",
        });
        result = await this.$api.service.userLike_operation(collectionParam);
        if (result.data.code == 200) {
          this.$message.success("成功");
          this.getGoodsFocusByUuid();
          this.goods.commodity.amountLike++;
        } else if (result.data.code !== 401) {
          this.$message.error(result.data.message);
        }
      } else {
        result = await this.$api.service.userLike_operation(collectionParam);
        if (result.data.code == 200) {
          this.$sensors.track("goodsdetail_click", {
            button_name: "顶部取消收藏",
          });
          this.$message.success("取消成功");
          this.getGoodsFocusByUuid();
          this.goods.commodity.amountLike--;
        } else if (result.data.code !== 401) {
          this.$message.error(result.data.message);
        }
      }
    },
    // 是否已经收藏
    async getGoodsFocusByUuid() {
      let loginMember = localStorage.getItem("THEONE_MEMBER");
      if (loginMember) {
        let result = await this.$api.service.userLike_like({
          dataId: this.id,
          dataType: 2,
        });
        this.isCollection = result.data.data;
      }
    },
    showBigPic() {
      this.$refs.cover.click();
    },
    //商品公开交易记录
    async getOrderBuyListPublic() {
      let params = { pageCount: 1, pageSize: 20, saleRecordId: this.id };
      if (
        this.goods &&
        this.goods.publisher &&
        this.goods.publisher.type == 1
      ) {
        //官方
      } else if (
        this.goods.commodity.amountSku == 1 &&
        this.goods.commodity.statusNumber == 1
      ) {
        //出售sku有一个且带编号的情况下，以商品sku维度展示历史记录
        params = {
          pageCount: 1,
          pageSize: 20,
          commoditySkuId: this.goods.commoditySku.id,
        };
      } else if (
        this.goods.commodity.amountSku > 1 ||
        this.goods.commodity.statusNumber == 2
      ) {
        //出售sku有多个或无编号情况下，以商品维度展示历史记录
        params = {
          pageCount: 1,
          pageSize: 20,
          commodityId: this.goods.commoditySku.commodityId,
        };
      }

      let result = await this.$api.service.orderBuy_listPublic(params);
      this.orderBuyListPublic = result.data.data;
    },
    //获取支持的支付的方式
    async getpayWayInfo() {
      const res = await this.$api.service.thirdAccount_sellerChannel({
        saleRecordId: this.id,
        needWallet: false,
        needLl: true,
      });
      if (res.data.code == 200) {
        res.data.data.forEach((item) => {
          item.info = this.payChannelInfo[item.payChannel];
        });
        this.payWayInfo = res.data.data;
      }
    },
    goVolume() {
      this.$router.push({
        path: "/volumeList",
        query: {
          goods: encodeURIComponent(JSON.stringify(this.goods)),
        },
      });
    },
    async getMarketVolume() {
      const res = await this.$api.service.getMarketVolume({
        commodityUuid: this.goods.commodity.id,
      });
      if (res.data.code == 200) {
        this.marketVolume = res.data.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.warning-text {
  font-size: 12px;
  font-weight: 400;
  color: #e61f1a;
}
.prepay-block {
  .warning-text {
    margin: 16px 0;
  }
}
.price-calculation-wrap {
  margin-top: 24px;
  display: flex;
  background: #fef0ed;
  border: 1px solid rgba(230, 31, 26, 0.5);
  border-radius: 6px;
  align-items: center;
  color: #e61f1a;
  width: 80%;
  @media screen and (max-width: 541px) {
    width: 100%;
  }

  .icon-to {
    padding-right: 26px;
  }

  .b1 {
    flex: 1;
    padding: 10px 0;
    text-align: center;
    .b-money {
      font-size: 16px;
      color: #e61f1a;
    }
    .b-bg-money {
      font-size: 16px;
      color: #ffffff;
    }
    .b-label {
      padding-top: 4px;
      font-size: 12px;
      color: #ec5c57;
    }
  }
  .b1-bg {
    background-color: #fb615a;
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/prepay/icon-cn-money.png");
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: 26%;
    position: relative;
    top: 0;
    left: 0;
    margin: -1px;
    border-radius: 6px;
    .b-label {
      color: #fbd1ce;
    }
    &::after {
      content: "";
      display: block;
      border: 7px solid transparent;
      border-right: 6px solid #fb615a;
      width: 0px;
      height: 0px;
      margin: auto;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(-100%, -50%);
    }
  }
}
.goods-img-wrap {
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  padding: 26px;
  .frame-top {
    top: 0px;
    left: 0;
    width: 100%;
    height: 26px;
  }
  .frame-left {
    top: 0px;
    left: 0;
    height: 100%;
    width: 26px;
  }
  .frame-right {
    top: 0px;
    right: 0;
    height: 100%;
    width: 26px;
  }
  .frame-bottom {
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 26px;
  }
  .frame-footer {
    position: absolute;
    bottom: 4px;
    left: 0;
    width: 100%;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    .name {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.7);
    }
  }
  .frame-content {
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    .img-preview-wrap {
      padding: 16px;
      height: 100%;
    }
    .img-preview {
      position: relative;
      top: 0;
      left: 0;
      height: calc(100% - 30px);
    }
    img {
      cursor: pointer;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
      overflow: hidden;
    }
  }
  .frame {
    position: absolute;
  }
  @media screen and (max-width: 540px) {
    padding: 0.32rem;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .frame-footer {
      position: absolute;
      bottom: 6px;
      left: 0;
      width: 100%;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      .name {
      }
    }
    .frame-content {
      position: relative;
      top: 0;
      left: 0;
      height: 100%;
      .img-preview-wrap {
        padding: 0.16rem;
        height: 100%;
      }
      .img-preview {
        position: relative;
        top: 0;
        left: 0;
      }
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        cursor: pointer;
      }
    }
    .frame {
      position: absolute;
    }
    .frame-top {
      top: 0px;
      left: 0;
      width: 100%;
      height: 0.32rem;
    }
    .frame-left {
      top: 0px;
      left: 0;
      height: 100%;
      width: 0.32rem;
    }
    .frame-right {
      top: 0px;
      right: 0;
      width: 0.32rem;
      height: 100%;
    }
    .frame-bottom {
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 0.32rem;
    }
  }
}
.element-wrap {
  .title {
    font-size: 14px;
    color: #000000;
    display: flex;
    margin-bottom: 8px;
    .v1-icon-question {
      padding-right: 2px;
    }
  }
  .main {
    display: flex;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e3e3e3;
    margin-bottom: 32px;
    padding: 8px;
    overflow: hidden;

    .box {
      flex: 1;
      padding: 8px;
      overflow: hidden;
    }

    .bar {
      overflow: hidden;
      border-radius: 4px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      background: #f9f9f9;
      border-radius: 4px;

      padding: 10px 0 16px;
      .l1 {
        color: #397fe7;
        margin-bottom: 4px;
      }
      .l2 {
        color: #333333;
        margin-bottom: 4px;
      }
      .l3 {
        color: #999999;
      }
    }
  }
  @media screen and (max-width: 541px) {
    padding: 0 0.32rem;
    .main {
      display: flex;
      flex-wrap: wrap;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e3e3e3;
      margin-bottom: 32px;
      padding: 8px;
      overflow: hidden;
      .box {
        width: 50%;
        flex: inherit;
        padding: 8px;
        overflow: hidden;
      }

      .bar {
        border-radius: 4px;
        font-size: 0.26rem;
        text-align: center;

        background: #f9f9f9;
        border-radius: 4px;

        padding: 10px 0 16px;
        .l1 {
          color: #397fe7;
          margin-bottom: 4px;
        }
        .l2 {
          color: #333333;
          margin-bottom: 4px;
        }
        .l3 {
          color: #999999;
        }
      }
    }
  }
}
.ui-line-wrap {
  display: flex;
  align-items: center;

  margin-bottom: 60px;
  .message {
    padding-left: 8px;
    color: rgba(0, 0, 0, 0.7);
  }
  @media screen and (max-width: 541px) {
    display: block;
    margin-bottom: 0.6rem;
    .message {
      padding: 0.1rem 0 0;
    }
  }
}
.icon-play {
  width: 109px;
  height: 109px;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
  background-image: url("//static.theone.art/pc/icons/icon-detail-play.png");
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
.video-cover {
  display: flex;
  align-items: center;
  justify-content: center;
}
.m-empty {
  min-height: 56vh;
  display: flex;
  justify-content: center;
  margin-top: 6vh;
  img {
    display: block;
    width: 403px;
  }
  .txt {
    padding-top: 14px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 24px;
  }
  @media screen and (max-width: 541px) {
    margin-top: 10vh;
    min-height: inherit;
    img {
      width: 80%;
      margin: 0 auto;
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
.letter-uppercase {
  text-transform: Uppercase;
}
.pc-wrap {
  display: block;
}
.m-wrap {
  display: none;
}
.page-goods-detail {
  padding-top: 80px;
  .loading {
    height: 500px;
  }
  .page-wrap {
    max-width: 1170px;
    margin: 0 auto;
  }
  .page-artist-bar {
    margin-bottom: 100px;
  }
  .page-goods-relationship {
    margin-bottom: 140px;
  }
  .trade-list {
    line-height: 50px;
    border: 1px solid #e3e3e3;
    border-bottom: none;
    margin-bottom: 32px;
    border-radius: 4px;
    .title {
      height: 50px;
      background: #f5f5f5;

      font-size: 14px;
      padding-left: 16px;
      border-bottom: 1px solid rgba($color: #979797, $alpha: 0.2);
    }
    .mode-PC-trade {
      max-height: 300px;
      background: #fff;
      overflow: auto;
    }
    .line {
      border-bottom: 1px solid rgba($color: #979797, $alpha: 0.2);
      height: 50px;
      display: flex;
      padding: 0 24px;
      justify-content: space-between;
      .people {
        width: 30%;
        font-size: 14px;
        color: rgba($color: #000000, $alpha: 0.4);
        display: flex;
        background: url("//static.theone.art/pc/images/point.png") no-repeat
          left center;
        background-size: 13px 13px;
        padding-left: 20px;
        white-space: nowrap;
        h1 {
          color: #000000;
          font-size: 14px;
        }
      }
    }
  }
  .v1-icon-skuno {
    display: inline-block;
    margin-left: 5px;
    line-height: 18px;
  }
  .ui-goods-wrap {
    width: 47%;
  }
  .goods-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    .goods-cover {
      background: #f5f5f5;
      box-shadow: 0px 2px 18px 0px rgba(5, 5, 5, 0.16);
      border-radius: 4px;
      width: 47%;
      position: relative;
      cursor: pointer;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        // border: 1px solid #dcdcdc;
      }
    }
    .goods-info {
      flex: 1;
      margin-left: 32px;
      .name h1 {
        display: flex;
        align-items: center;
      }
      .btn-buy {
        width: 300px;
        height: 46px;
        line-height: 46px;
        background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
        border-radius: 23px;
        color: #ffffff;
        padding-left: 24px;
        font-size: 14px;
        line-height: 46px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        .sign {
          font-size: 14px;
        }
        &:after {
          content: "";
          background: url("//static.theone.art/pc/images/pic-home/buy.png")
            no-repeat left center;
          background-size: 24px 24px;
          position: absolute;
          right: 24px;
          width: 24px;
          height: 100%;
        }
      }
      .disabled {
        background: rgba(0, 0, 0, 0.1);
        cursor: inherit;
      }

      .arrt-panel {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0px;
        }
        &:first-child {
          margin-top: 19px;
        }
        &.authentication {
          .line {
            div {
            }
          }
        }
        > h1 {
          font-size: 14px;
          color: #000000;
          line-height: 19px;
          margin-bottom: 8px;
        }
        .con {
          padding: 16px;
          border-radius: 4px;
          border: 1px solid #e3e3e3;
          font-size: 14px;
          color: rgba($color: #000000, $alpha: 0.7);
          .line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0px;
            }
            &.hor {
              div {
                display: flex;
                justify-content: center;
              }
              p {
                font-size: 12px;
                line-height: 1.7;
                @media screen and (max-width: 541px) {
                  font-size: 0.24rem;
                }
              }
            }
            h1 {
              font-size: 12px;
              color: rgba($color: #000000, $alpha: 0.4);
              line-height: 20px;
              white-space: nowrap;
            }
            .pay-way {
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-end !important;
              @media screen and (max-width: 541px) {
                justify-content: flex-start !important;
              }
            }
            .pay-way-item {
              width: 70px;
              height: 70px;
              border-radius: 4px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin: 0 5px 10px;
              div {
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 24px;
                height: 24px;
              }
              span {
                font-size: 12px;
                line-height: 1;
                padding-top: 10px;
                @media screen and (max-width: 541px) {
                  font-size: 0.24rem;
                }
              }
              img {
                width: 15px;
                height: 15px;
              }
            }
          }
          .v1-icon-question {
            position: relative;
            cursor: pointer;
            min-width: 80px;
            display: flex;
            align-items: center;
            margin-right: 10px;
            &:hover {
              .message {
                display: block;
              }
            }
            .message {
              transition: all 0.3s;
              display: none;
              position: absolute;
              background: #fff;
              width: 100px;
              height: 200px;
              right: 0px;
              top: 0;
              transform: translateX(100%);
              bottom: 30px;
              padding: 20px;
              box-shadow: 0px 2px 8px 4px rgba(153, 153, 153, 0.4);
              word-break: break-all;
            }
          }
        }
      }
      .pay-wrap {
        margin-top: 20px;
      }
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 7px;
        h1 {
          font-size: 26px;
          font-weight: bold;
          color: #000000;
          line-height: 40px;
        }
      }
      .arrt {
        display: flex;
        padding: 18px 0px 24px;
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
        color: rgba($color: #000000, $alpha: 0.7);
        h1 {
          color: rgba($color: #000000, $alpha: 0.4);
          line-height: 18px;
          font-size: 12px;
          white-space: nowrap;
        }
        > div {
          border-right: 1px solid rgba($color: #000000, $alpha: 0.1);
          padding: 0px 20px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          // align-items: center;
          // white-space: nowrap;
          &:nth-child(1) {
            padding-left: 0;
          }
          &:last-child {
            border-right: 0px;
          }
        }
        .people {
          background: url("//static.theone.art/pc/icons/icon-author.png")
            no-repeat left center;
          background-size: 14px 14px;
        }
        .volume-num {
          span {
            color: #397fe7;
            margin-left: 4px;
            cursor: pointer;
          }
        }
      }
      .volume-m {
        display: none !important;
      }
      .volume-pc {
        display: flex !important;
      }
      > .v1-price {
        height: 68px;
        line-height: 68px;
        font-size: 26px;
        font-weight: bold;
        background-size: 24px 24px;
        // padding-left: 30px;
        &-left {
          text-align: left;
        }
      }
    }
  }
  .goods-introduce {
    max-width: 1220px;
    margin: 0 auto 160px;
    background: url("//static.theone.art/pc/images/pic-home/goods-detail-title.png")
      no-repeat center top;
    background-size: 100% auto;
    padding-top: 26px;
    .content {
      margin: 0 28px;
      padding: 54px 40px 38px 40px;
      box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.05);
      background: #ffffff;
      > div {
        padding: 28px 50px;
        background: #f5f5f5;
        border-radius: 4px;
        border: 1px solid #e3e3e3;
        margin-bottom: 24px;
        font-size: 12px;
        color: rgba($color: #000000, $alpha: 0.4);
        line-height: 24px;
        h1 {
          color: #000000;
          font-size: 14px;
          margin-bottom: 24px;
          position: relative;
          &::before {
            width: 8px;
            height: 8px;
            background: #000000;
            opacity: 0.4;
            content: "";
            position: absolute;
            left: -20px;
            top: 8px;
            border-radius: 100%;
          }
        }
      }
    }
  }
  .label {
    display: flex;
    span {
      padding: 2px 15px;
      display: block;
      border-radius: 4px;
      margin-right: 15px;
      &:nth-child(1) {
        background: rgba($color: #6282ff, $alpha: 0.3);
        color: #6282ff;
      }
      &:nth-child(2) {
        background: rgba($color: #ff864d, $alpha: 0.3);
        color: #ff864d;
      }
      &:nth-child(3) {
        background: rgba($color: #909090, $alpha: 0.3);
        color: #909090;
      }
    }
  }
  .operate {
    display: flex;
    height: 40px;
    .heart {
      background: url("//static.theone.art/pc/images/pic-home/love.png")
        no-repeat left center;
      background-size: 18px 18px;
      color: #000000;
      line-height: 40px;
      padding-left: 20px;
      cursor: pointer;
      &-active {
        background: url("//static.theone.art/pc/images/pic-home/heart-active%402x.png")
          no-repeat left center;
        background-size: 18px 18px;
      }
    }
    .share-btn {
      width: 40px;
      background: url("//static.theone.art/pc/images/share.png") no-repeat
        center center;
      background-size: 18px 18px;
      position: relative;
      cursor: pointer;
    }
  }
  .share-bar {
    transition: all 0.3s;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #fff;
    box-shadow: 0px 2px 8px 3px rgba(217, 217, 217, 0.28);
    border-radius: 4px;
    font-size: 12px;
    line-height: 20px;
    width: 200px;
    padding: 10px;
    .share-code {
      display: none;
      position: absolute;
      top: 50px;
      left: 50%;
      width: 80px;
      height: 80px;
      transform: translate(-50%, 0);
      z-index: 10;
    }
    .wechat {
      &:hover {
        .share-code {
          display: block;
        }
      }
    }
    .share-item {
      position: relative;
      background: url("//static.theone.art/pc/images/pic-home/link.svg")
        no-repeat top center;
      background-size: 20px 20px;
      padding-top: 20px;
      cursor: pointer;
      color: rgba($color: #000000, $alpha: 0.8);

      &.link {
        background-image: url("//static.theone.art/pc/images/pic-home/link.svg");
      }
      &.qq {
        background-image: url("//static.theone.art/pc/images/qq.svg");
      }
      &.wechat {
        background-image: url("//static.theone.art/pc/images/wechat.svg");
      }
    }
  }
  .share-btn {
    position: relative;
    &:hover {
      .share-bar {
        display: flex;
      }
    }
    .share-bar {
      display: none;
      right: 40px;
      left: inherit;
      top: -10px;
      @media screen and (max-width: 541px) {
        left: 40px;
        right: inherit;
      }
    }
  }
  .line-item {
    width: 100%;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }
  .ifonline {
    margin-bottom: 16px;
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 541px) {
  .pc-wrap {
    display: none;
  }
  .m-wrap {
    display: block;
  }
  .page-goods-detail {
    padding-top: 1.08rem;
    width: 100vw;
    .loading {
      height: 5rem;
    }
    .page-artist-bar {
      margin-bottom: 1.2rem;
    }
    .page-goods-relationship {
      margin-bottom: 1rem;
    }
    .trade-list {
      margin: 0rem 0.32rem 0.48rem;
      .title {
        height: 0.98rem;
        line-height: 0.98rem;
        font-size: 0.28rem;
        padding-left: 0.32rem;
      }
      .mode-mobile {
        line-height: 0.34rem;
        &-trade {
          max-height: 140px;
          background: #fff;
          overflow: auto;
        }
        .time {
          font-size: 0.2rem;
          color: rgba($color: #000000, $alpha: 0.4);
          white-space: nowrap;
        }
        .price {
          display: flex;
          flex-direction: column;
          div {
            text-align: right;
          }
        }
      }
      .line {
        height: 1.1rem;
        padding: 0.24rem;
        .people {
          width: auto;
          flex-direction: column;
          font-size: 0.24rem;
          line-height: 0.34rem;
          padding-left: 0.4rem;
          h1 {
            color: #000000;
            font-size: 0.24rem;
          }
        }
      }
    }
    .goods-wrap {
      flex-direction: column;
      margin: 0.32rem 0.32rem 0.48rem;
      .goods-cover {
        width: 100%;
        padding-bottom: 100%;
      }
      .goods-info {
        width: 100%;
        margin-left: 0;
        .btn-buy {
          width: 6rem;
          height: 0.92rem;
          border-radius: 0.46rem;
          padding-left: 0.48rem;
          font-size: 0.28rem;

          &:after {
            background-size: 0.48rem 0.48rem;
            right: 0.48rem;
            width: 0.48rem;
          }
        }
        .arrt-panel {
          margin-bottom: 0.32rem;
          &.authentication {
            .line {
              div {
              }
            }
          }
          > h1 {
            font-size: 0.28rem;
            line-height: 0.4rem;
            margin-bottom: 0.32rem;
          }
          .con {
            padding: 0.2rem 0.32rem;
            font-size: 0.24rem;
            line-height: 0.4rem;
            white-space: nowrap;
            .line {
              display: block;
              margin-bottom: 0.16rem;
              flex-wrap: wrap;
              .between {
                justify-content: space-between !important;
                padding: 0.1rem 0;
              }
              .line-item {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0.1rem 0;
              }
              h1 {
                font-size: 0.24rem;
                line-height: 0.4rem;
                white-space: nowrap;
              }
              .pay-way {
                margin-top: 0.2rem;
              }
              .pay-way-item {
                margin: 0 0.25rem 0.25rem 0;
                &:nth-child(4n) {
                  margin-right: 0;
                }
              }
            }
            .m-line {
              display: flex;
            }
          }
        }
        .arrt {
          padding: 0.15rem 16px 0.15rem;
          border: none;
          background: #fff;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          margin: 0.2rem auto;
          display: flex;
          flex-direction: column;
          h1 {
            line-height: 0.56rem;
            font-size: 0.24rem;
            white-space: nowrap;
            // width: 100%;
          }
          p,
          h1,
          .people {
            // width: 100%;
          }
          p,
          .people {
            text-align: right;
            white-space: nowrap !important;
          }
          > div {
            // flex: 1;
            font-size: 0.24rem;
            line-height: 0.32rem;
            padding: 0 0rem;
            white-space: nowrap;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-right: none;
          }
          .people {
            word-break: break-all;
            white-space: nowrap;
            width: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 2.4;
          }
        }
        .volume-pc {
          display: none !important;
        }
        .volume-m {
          display: flex !important;
          align-items: center;
          justify-content: space-between;
          flex-direction: row;
          padding-right: 0.12rem;
          .volume-num {
            display: flex;
            align-items: center;
            .go-volume {
              background-image: url("~@/assets/1.0/images/arrowright2@2x.png");
              background-size: 0.48rem 0.48rem;
              background-repeat: no-repeat;
              background-position: right;
              width: 0.48rem;
              height: 0.48rem;
              margin-left: 0.1rem;
            }
          }
        }
        > .v1-price {
          height: auto;
          font-size: 0.52rem;
          background-size: 0.48rem 0.48rem;
          // padding-left: 0.68rem;
          line-height: 0.52rem;
          margin-bottom: 0.42rem;
        }
      }
    }
    .ui-goods-wrap {
      width: 100%;
      padding-bottom: 100%;
      position: relative;
      top: 0;
      left: 0;
      .goods-img-wrap {
      }
    }
    .goods-introduce {
      padding-top: 0.18rem;
      margin: 0 0.14rem 1rem;
      .content {
        margin: 0 0.18rem;
        padding: 0.54rem 0.32rem 0.48rem;
        > div {
          padding: 0.48rem 0.32rem 1rem 0.56rem;
          margin-bottom: 0.32rem;
          font-size: 0.28rem;
          line-height: 0.44rem;
          h1 {
            font-size: 0.28rem;
            margin-bottom: 0.2rem;
            &::before {
              width: 0.16rem;
              height: 0.16rem;
              left: -0.3rem;
              top: 0.12rem;
            }
          }
        }
      }
    }
  }
  .mobile-goods-name {
    margin: 0.5rem 0.32rem 0.48rem;
    display: block;
    justify-content: space-between;
    align-items: center;
    .operate {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .hert-wrap {
        display: flex;
        align-items: center;
      }
      .share-btn {
        height: 50px;
      }
    }
  }
  .mobile-goods-flex {
    display: flex;
    align-items: center;
    margin-right: 5px;
    font-size: 0.48rem;
    font-weight: 500;
    color: #000000;
    margin-bottom: 0.3rem;
  }
  .label {
    margin: 0 0.32rem;
    span {
      padding: 0.08rem 0.15rem;
    }
  }
  .ifonline {
    margin-bottom: 0.32rem;
  }
}
</style>
