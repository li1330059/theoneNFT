<template>
  <div class="ui-body">
    <m-head title="藏品详情"></m-head>
    <status-template
      :list="goodsInfo"
      api="/goods/api/treasureSku/detail"
      :init="init"
    >
      <div class="ui-nav">
        <span @click="goBack" class="ui-icon ui-icon-back"></span>
        <span @click="goBack">藏品详情</span>
      </div>
      <section class="phone-goods-title hidden-2">
        {{ goodsInfo.commodity && goodsInfo.commodity.name }}
      </section>
      <section class="phone-wrap">
        <div>
          <commodity-num :treasure="goodsInfo"></commodity-num>
        </div>
        <div class="goods-status">
          <span class="status c1" v-if="goodsInfo.operationType == 1"
            >在售</span
          >
          <span class="status c2" v-if="goodsInfo.operationType == 0"
            >私藏</span
          >
          <span class="status c3" v-if="goodsInfo.operationType == 8"
            >赠与中</span
          >
        </div>
      </section>
      <div class="goods-info-wrap">
        <div class="goods-frame">
          <detail-goods-view :goods="goodsInfo"></detail-goods-view>
          <!--         <goods-frame :goods-info="goodsInfo"></goods-frame> -->
        </div>
        <div class="goods-info">
          <goods-info :goods-info="goodsInfo"></goods-info>
          <section class="ui-btn-wrap">
            <div class="block" v-if="isExpire">
              <div
                class="ui-btn ui-btn-red"
                :class="{ 'ui-btn-disabled': true }"
              >
                已过期
              </div>
            </div>
            <div class="block" v-else>
              <div
                class="ui-btn ui-btn-red"
                v-if="isSale"
                @click="onConsignment"
              >
                寄售
              </div>
            </div>
            <div class="block">
              <div
                class="ui-btn ui-btn-border"
                @click="onDown"
                v-if="
                  goodsInfo.commodity && goodsInfo.commodity.typeMarket == 1
                "
              >
                下载源文件
              </div>
            </div>
          </section>
        </div>
      </div>

      <goods-features
        :goods-info="goodsInfo"
        ref="GoodsFeaturesRef"
      ></goods-features>
      <!--     <section class="artist-wrap">
      <div class="left">
        <div class="face-img"></div>
        <div class="n1"></div>
        <div class="n2"></div>
      </div>
      <div class="right">
        <div class="txt"></div>
        <div class="see-more">查看主页</div>
      </div>
    </section> -->
      <artist-bar
        class="artist-wrap"
        :artist="goodsInfo.author"
		:authorInstitution="goodsInfo.authorInstitution"
        :hide-follow="true"
        v-if="goodsInfo.author"
      ></artist-bar>
      <section
        class="introduce-wrap"
        v-if="goodsInfo.seriesWorks && goodsInfo.seriesWorks.description"
      >
        <div class="t2"><span class="icon"></span>系列介绍</div>
        <div
          class="text"
          v-html="goodsInfo.seriesWorks && goodsInfo.seriesWorks.description"
        ></div>
      </section>
      <section
        class="introduce-wrap"
        v-if="goodsInfo.commodity && goodsInfo.commodity.description"
      >
        <div class="t2"><span class="icon"></span>藏品介绍</div>
        <div
          class="text"
          v-html="goodsInfo.commodity && goodsInfo.commodity.description"
        ></div>
      </section>
	  <section
	    class="introduce-wrap"
	    v-if="goodsInfo.honorList&&goodsInfo.honorList.length>0"
	  >
	    <div class="t2"><span class="icon"></span>荣誉属性</div>
	    <honor :honorList="goodsInfo.honorList" />
	  </section>
    </status-template>

    <bankSubmit
      v-if="userAttrResult"
      ref="bankSubmit"
      :userInfo="userAttrResult"
      @listen="listenBankSubmit"
    ></bankSubmit>
    <!-- 设置支付密码 -->
    <setPayPassword
      ref="setPayPassword"
      @listen="listenSetPayPassword"
    ></setPayPassword>
    <!--  密码验证 -->
    <verified-pay-pw ref="verifiedPayPw" />
    <sellAdd ref="sellAdd" @listen="listenSellAdd"></sellAdd>
    <!-- 设置邮箱 -->
    <initMailBox ref="initMailBox" />
    <!-- 发送源文件到邮箱 -->
    <sendEmail
      ref="sendEmail"
      @listen="setEmail"
      :id="downLoadGoodsId"
      :userInfo="userAttrResult"
    />
    <el-dialog title="寄售成功" :visible="isShowSuccess" width="460px">
      <div class="m-success-wrap">
        <img src="//static.theone.art/pc/icons/icon-treasure-success.png" />
        <div class="txt">恭喜您寄售成功</div>
        <div class="btn-center">
          <div
            class="ui-btn btn-large ui-btn-red"
            @click="isShowSuccess = false"
          >
            我知道了
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import GoodsFeatures from "./components/goods-features.vue";
import GoodsInfo from "./components/goods-info.vue";
import GoodsFrame from "./components/goods-frame.vue";
import artistBar from "@/pages/v1/artist/components/bar";
import honor from "@/components/v1/honor";
import bankSubmit from "@/pages/v1/mine/wallet/bankSubmit";
import setPayPassword from "@/pages/v1/mine/setting/setPayPassword";
import sellAdd from "@/pages/v1/mine/treasure/components/sellAdd";
import initMailBox from "@/pages/v1/mine/setting/initMailBox.vue";
import sendEmail from "@/pages/v1/mine/treasure/components/sendEmail.vue";
import fileDownload from "js-file-download";
import axios from "axios";
import detailGoodsView from "@/pages/v1/goods/components/detail-goods-view";
export default {
  components: {
    GoodsFeatures,
    GoodsInfo,

    artistBar,
    bankSubmit,
    setPayPassword,
    sellAdd,
    initMailBox,
    sendEmail,
    detailGoodsView,
    honor
  },
  data() {
    return {
      isExpire: false,
      discountStatus: 0,
      downLoadGoodsId: "",
      goodsInfo: {},
      isShowSuccess: false,
    };
  },
  created() {
    this.init();
  },
  computed: {
    isSale() {
      //是否显示寄售按钮
      return (
        this.goodsInfo.commodity &&
        this.goodsInfo.commodity.statusSale == 1 &&
        this.goodsInfo.operationType == 0
      );
      if (this.userAttrResult.isAuthor) {
        return (
          this.goodsInfo.commodity.statusSell == 1 &&
          this.goodsInfo.operationType == 0
        );
      } else {
        return (
          this.goodsInfo.commodity.statusSale == 1 &&
          this.goodsInfo.operationType == 0
        );
      }
    },
    userAttrResult() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    init() {
      this.skuId = this.$route.params.id;
      this.isShowSuccess = false;
      this.getGoodsInfo();
    },
    async getDiscountStatus() {
      if (this.goodsInfo.commodity.typeCommodity == 6) {
        const res = await this.$api.service.discountCommodityDiscountInfo({
          commodityUuid: this.goodsInfo.commodity.id,
        });
        this.isExpire = false;
        if (res.data.code == 200) {
          this.discountStatus = res.data.data.discountStatus;
          if (res.data.data.discountStatus == 3) {
            this.isExpire = true;
          }
        }
      }
    },
    goBack() {
      this.$router.back();
    },
    setEmail() {
      this.$refs.initMailBox.init();
    },
    onDown() {
      /*      console.log(this.goodsInfo.commodity);
      return  */
      const BASE_URL = process.env.VUE_APP_API_BASE_URL;

      if (this.goodsInfo.commodity.typeFile == 3) {
        axios.defaults.headers["authorization"] =
          localStorage.getItem("authorization");
        axios
          .get(
            `${BASE_URL}/goods/api/commodityDownload/commodityDownloadVideo?id=${item.commodity.id}`,
            { responseType: "blob" }
          )
          .then((res) => {
            if (res && res.data) {
              fileDownload(res.data, `${this.commodity.name}.mp4`);
            }
          });
      } else {
        this.downLoadGoodsId = this.goodsInfo.commodity.id;
        this.$refs.sendEmail.init();
      }
    },
    onConsignment() {
      if (this.goodsInfo.operationType !== 0 || this.discountStatus != 0) {
        return;
      }
      //寄售
      if (this.userAttrResult.statusBankVerified != 1) {
        this.$refs.bankSubmit.init();
      } else if (this.userAttrResult.isPayPwd == 0) {
        this.$refs.setPayPassword.init();
      } else {
        this.$refs.verifiedPayPw.init((passwowrd) => {
          this.$refs.sellAdd.init(this.goodsInfo, passwowrd);
        });
      }
    },
    listenBankSubmit(result) {
      if (result.result) {
        this.$store.commit("setUserInfo", {
          ...this.userAttrResult,
          statusBankVerified: 1,
        });
        this.onConsignment();
      }
    },
    listenSellAdd() {
      this.init();
      this.isShowSuccess = true;
    },
    // 设置支付密码
    listenSetPayPassword(result) {
      if (result.result) {
        this.$store.commit("setUserInfo", {
          ...this.userAttrResult,
          isPayPwd: 1,
        });
        this.onConsignment();
      }
    },
    async getGoodsInfo() {
      const res = await this.$api.service.treasureSku_detail({
        id: this.skuId,
      });
      if (res.data.code == 200) {
        this.goodsInfo = res.data.data;
        this.$refs.GoodsFeaturesRef.getElements(this.goodsInfo.commodity.id);
        this.getDiscountStatus();
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.phone-wrap {
  display: none;
}
.phone-goods-title {
  display: none;
}
.artist-wrap {
  margin-bottom: 24px;
}
.ui-body {
  width: 1170px;
  margin: 0 auto;
  padding-top: 51px;
  min-height: 60vh;
}
.goods-info-wrap {
  display: flex;
  margin-bottom: 32px;
  .goods-frame {
    flex: 1;
    padding-right: 45px;
  }
  .goods-info {
    flex: 1;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    display: block;
    .goods-frame {
      position: relative;
      top: 0;
      left: 0;
      padding-bottom: 100%;
      flex: 1;
      padding-right: 0;
    }
    .goods-info {
      flex: 1;
    }
  }
}
.introduce-wrap {
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e3e3e3;
  margin-bottom: 24px;
  padding: 28px 32px;
  overflow: hidden;
  .t2 {
    font-size: 14px;
    color: #000000;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    .icon {
      width: 8px;
      height: 8px;
      background: rgba(0, 0, 0, 0.4);
      opacity: 0.4;
      display: inline-block;
      margin-right: 5px;
      border-radius: 100px;
    }
  }
  .text {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}
.ui-btn-wrap {
  display: flex;
  margin: 0 -12px;
  .block {
    flex: 1;
    padding: 0 12px;
  }
  .ui-btn {
    width: 100%;
    line-height: 46px;
    height: 46px;
    border-radius: 100px;
  }
  .ui-btn-border {
    border: 1px solid rgba(230, 32, 27, 0.6);
    color: #e6201b;
  }
}
.ui-btn-disabled {
  color: #fff;
}
.m-success-wrap {
  img {
    display: block;
    width: 60%;
    margin: 0 auto;
    max-width: 260px;
  }
  .txt {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
  .btn-center {
    display: flex;
    justify-content: center;
    padding: 31px 0 0;
  }

  @media screen and (min-width: 0px) and (max-width: 540px) {
  }
}
.ui-nav {
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  align-content: center;
  span {
    cursor: pointer;
  }
}
.ui-icon-back {
  background-image: url("//static.theone.art/pc/icons/icon-left-direction.png");
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .ui-btn-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 2;
    padding: 0.32rem 0.16rem;
    margin: 0;
  }
  .artist-wrap {
    margin: 0;
    margin-bottom: 24px;
  }
  .ui-body {
    width: 100%;
    margin: 0 auto;
    padding: 0.22rem 0.32rem 1.5rem;
  }
  .ui-nav {
    display: none;
  }
  .phone-goods-title {
    display: block;
    font-size: 24px;
    font-weight: 500;
    color: #000000;
    line-height: 40px;
    margin-bottom: 0.22rem;
  }
  .phone-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.4rem;
    ::v-deep .m-num-wrap {
      padding-left: 0;
    }
  }
  .goods-status {
    .status {
      line-height: 24px;
      border-radius: 4px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }
    .c1 {
      color: rgba(255, 134, 77, 1);
      background-color: rgba(255, 134, 77, 0.3);
    }
    .c2 {
      color: rgba(255, 77, 77, 1);
      background-color: rgba(255, 77, 77, 0.3);
    }
    .c3 {
      color: rgba(255, 197, 77, 1);
      background-color: rgba(255, 222, 77, 0.3);
    }
  }
}
</style>
