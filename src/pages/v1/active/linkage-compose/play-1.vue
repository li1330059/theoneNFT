<template>
  <div>
    <div class="ui-body">
      <div class="banner grayscale"></div>
      <div class="title grayscale">
        <p>动漫二次元馆联动</p>
        <p>合成活动</p>
      </div>
      <div class="material grayscale">
        <!-- <div class="material-title color">合成活动</div> -->
        <tab :playInfo="playInfo" :playList="page"></tab>
        <div class="content">
          <div class="content-top">
            <div class="content-title color">合成条件</div>
            <div class="content-lead color">
              <p>每5个动漫二次元馆内的任意数字藏品+30个平台限定空投</p>
              <p>即可消耗合成1个联动盲盒。</p>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="item" v-for="(item, index) in materialArr" :key="index">
            <div class="item-box">
              <div
                class="img"
                :style="'background-image:url(' + item.img + ')'"
              ></div>
              <div class="item-text">
                <div class="item-tl color padding-top">{{ item.title }}</div>
                <div class="item-num padding-top">
                  需要：任意{{ item.value1 }}个
                </div>
                <div class="color padding-top">
                  已选择：{{ item.selectNum }}个
                </div>
              </div>
              <div
                @click="goSelect(item)"
                :class="[
                  'item-btn color',
                  item.selectNum < item.value1 ? '' : 'item-btn-bg',
                ]"
              >
                {{ item.btnText }}
              </div>
            </div>
          </div>
          <!--   <div class="ui-icon icon-add"></div> -->
        </div>
        <div class="icon"></div>
        <div class="linkage">
          <div class="linkage-bg img"></div>
          <p class="linkage-tl item-tl color padding-top">联动盲盒</p>
          <div
            :class="['linkage-btn', isCompound ? 'item-btn-bg' : '']"
            @click="toCompound()"
          >
            合成
          </div>
        </div>
      </div>
      <div class="m-title synthesis-active-txt-color grayscale" v-if="notice">
        <span class="iconfont icon-icon_wanfahezi" />
        <div class="txt">活动须知</div>
        <span class="iconfont icon-icon_wanfahezi" />
      </div>
      <div class="ui-activity-instructions synthesis-active-txt-color">
        <div v-html="notice"></div>
      </div>
    </div>

    <treasure-list
      ref="TreasureListRef"
      @listen="listenUserSelectedSku"
    ></treasure-list>
    <dh-compose-animate
      :commodity="createCommodity"
      ref="refDhCompound"
      @listen="reset"
    ></dh-compose-animate>
    <bankSubmit
      v-if="userInfo"
      ref="bankSubmit"
      :userInfo="userInfo"
      @listen="listenBankSubmit"
    ></bankSubmit>
    <nameVerified
      ref="nameVerified"
      @listen="listenNameVerified"
    ></nameVerified>
    <compose-tips
      ref="composeTips"
      :nameInfo="nameInfo"
      @listen="listenComposeTips"
    ></compose-tips>
  </div>
</template>
<script>
import TreasureList from "./components/treasure-list.vue";
import DhComposeAnimate from "./components/dh-compose-animate";
import bankSubmit from "../../mine/wallet/bankSubmit";
import nameVerified from "../../mine/setting/nameVerified";
import composeTips from "./components/compose-tips";
import Tab from "./components/tab";
export default {
  components: {
    TreasureList,
    DhComposeAnimate,
    bankSubmit,
    nameVerified,
    composeTips,
    Tab,
  },
  props: {
    playInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    page: {
      type: Array,
      default: () => {
        return [];
      },
    },
    notice: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      materialArr: [
        {
          img: "//static.theone.art/pc/active/compose/goods-1.png",
          title: "5个动漫二次元馆内的任意数字藏品",
          uuid: null,
          value1: null,
          selectNum: 0,
          btnText: "去选择",
          selectList: [],
        },
        {
          img: "https://static.theone.art/pc/active/linkage/linkage-img2.png",
          title: "30个平台限定空投",
          uuid: null,
          value1: null,
          selectNum: 0,
          btnText: "去选择",
          selectList: [],
        },
      ],
      treasureSkuIdList: [], //已选择物料
      createCommodity: {}, //合成成功后的信息
      nameInfo: [], //选择的终极合成
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    isCompound() {
      return this.materialArr.every((item) => {
        if (item.selectNum >= item.value1) {
          item.btnText = "已选择";
        } else {
          item.btnText = "去选择";
        }
        return item.value1 == item.selectNum;
      });
    },
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    async init() {
      const result = await this.$api.service.config_get({
        key: this.playInfo.key,
      });
      if (result.data.code == 200) {
        const data = result.data.data;
        if (data) {
          this.materialArr[0].value1 = data.confValue2;
          // this.materialArr[0].value1 = 2;
          this.materialArr[0].uuid = data.confValue1;
          this.materialArr[1].value1 = data.confValue4;
          // this.materialArr[1].value1 = 3;
          this.materialArr[1].uuid = data.confValue3;
        } else {
          this.$message.warning("活动尚未配置");
        }
      } else {
        this.$message.error(result.data.message);
      }
    },
    // 数据重置
    reset() {
      this.materialArr.forEach((item) => {
        item.selectNum = 0;
        item.btnText = "去选择";
        item.selectList = [];
      });
      this.treasureSkuIdList = [];
      this.createCommodity = {};
      this.nameInfo = [];
    },
    goSelect(info) {
      if (this.userInfo.userUuid && this.userInfo.userUuid.length > 0) {
        this.$refs.TreasureListRef.init(info);
      } else {
        this.$message.error("请先登录！");
        const redirect = `${window.location.href}`;
        this.$router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      }
    },
    //用户选择完成的回调
    listenUserSelectedSku(info) {
      console.log(`回调`, info);
      this.materialArr.forEach((item) => {
        if (item.uuid == info.type.uuid) {
          item.selectList = info.selectedSkuList;
          item.selectNum = info.selectedSkuList.length;
        }
      });
    },

    //判断是否实名认证并绑卡
    toCompound() {
      if (this.isCompound) {
        if (this.userInfo.statusVerified != 1) {
          this.$refs.nameVerified.init();
          return;
        } else if (this.userInfo.statusBankVerified != 1) {
          this.$refs.bankSubmit.init();
          return;
        } else {
          this.isUltimateSynthesis();
        }
      }
    },
    //绑定银行卡
    listenBankSubmit(result) {
      if (result.result) {
        this.$store.commit("setUserInfo", {
          ...this.userInfo,
          statusBankVerified: 1,
        });
      }
    },
    //实名认证结果
    listenNameVerified(info) {
      if (info.result) {
        this.$message.success("认证成功");
        if (this.userInfo.statusBankVerified != 1) {
          this.$refs.bankSubmit.init();
          return;
        }
      } else {
        this.$message.error("认证失败");
      }
    },
    //判断是否包含终极合成
    isUltimateSynthesis() {
      this.treasureSkuIdList = []; //选择的所有id
      this.nameInfo = []; //已选择的终极合成
      this.materialArr.forEach((item) => {
        item.selectList.forEach((item1) => {
          this.treasureSkuIdList.push(item1.id);
          if (item1.commodity.typeCommodity == 4) {
            this.nameInfo.push(item1.commoditySku.name);
          }
        });
      });
      if (this.nameInfo.length > 0) {
        this.$refs.composeTips.show(this.nameInfo);
      } else {
        this.linkageFun();
      }
    },
    //终极合成弹窗回调
    listenComposeTips(info) {
      if (info) {
        this.linkageFun();
      }
    },
    //合成
    async linkageFun() {
      const result = await this.$api.$service.treasureSku_synthesisV2({
        treasureSkuIdList: this.treasureSkuIdList,
      });
      if (result.code == 200) {
        this.createCommodity = result.data;
        this.$refs.refDhCompound.show();
      } else {
        this.$message.error(result.message);
      }
    },
    async getNotice() {
      const result = await this.$api.$service.config_get({
        key: "love512con",
      });
      if (result.code == 200) {
        this.notice = result.data.confValue1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-add {
  background-image: url("//static.theone.art/pc/active/compose/icon-add.png");
}
.ui-body {
  background: #b0d4a8;
  padding-bottom: 100px;
  text-align: center;
  @media screen and (max-width: 540px) {
    padding: 0.6rem 0.3rem 1.3rem;
    box-sizing: border-box;
  }
  .title {
    font-size: 0.36rem;
    padding: 40px 0;
    color: #fff;
  }
  .color {
    color: #453524;
  }
  .linkage {
    .linkage-tl {
      font-weight: bold;
    }
    .linkage-btn {
      width: 40%;
      margin: 73px auto 0;
      padding: 18px 0;
      color: #666;
      border-radius: 50px;
      background-color: #cccccc;
      @media screen and (max-width: 540px) {
        width: 4rem;
        padding: 0.17rem 0;
        margin-top: 0.36rem;
      }
    }
  }
  .material {
    max-width: 1200px;
    margin: 0 auto;
    background-color: #ffe290;
    border-radius: 10px;
    padding-bottom: 90px;
    .material-title {
      background-color: #ffebc6;
      border-radius: 10px 10px 0 0;
      font-size: 0.24rem;
      font-weight: bold;
      padding: 25px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &::before {
        width: 0.26rem;
        height: 0.27rem;
        content: "";
        display: inline-block;
        background: url("https://static.theone.art/pc/active/linkage/linkage-icon0.png")
          no-repeat center;
        background-size: contain;
        margin-right: 8px;
      }
      @media screen and (max-width: 540px) {
        padding: 0.14rem 0;
        box-sizing: border-box;
      }
    }
    .list {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 0 50px;
      @media screen and (max-width: 540px) {
        padding: 0 0.13rem;
      }
    }
    .item {
      width: 50%;
      padding: 0 0%;
      text-align: left;
      display: flex;
      justify-content: center;
    }
    .img {
      width: 2.46rem;
      height: 2.46rem;
      background-color: rgba(255, 255, 255, 0.39);
      background-size: cover;
      background-position: 50%;
      border-radius: 4px;
      @media screen and (max-width: 540px) {
        width: 3rem;
        height: 3rem;
      }
    }
    .linkage-bg {
      margin: 23px auto 7px;
      background: url("https://static.theone.art/pc/active/linkage/linkage_box.png")
        no-repeat center;
      background-size: cover;
      background-position: 50%;
      width: 360px;
      height: 360px;
      @media screen and (max-width: 540px) {
        width: 3.46rem;
        height: 3.46rem;
      }
    }
    .item-num {
      color: rgba(43, 51, 88, 0.6);
    }
    .item-tl {
      font-weight: bold;
    }
    .padding-top {
      padding-top: 10px;
    }
    .item-text {
      width: 2.46rem;
      height: 100px;
      // overflow-y: scroll;
    }
    .item-btn {
      width: 2.46rem;
      margin-top: 17px;
      border-radius: 50px;
      border: 1px solid #453524;
      padding: 13px 0;
      box-sizing: border-box;
      text-align: center;
      cursor: pointer;
      @media screen and (max-width: 540px) {
        padding: 0.11rem 0;
      }
    }
    .item-btn-bg {
      background-color: #e4a516;
      color: #fff;
      border: 1px solid #e4a516;
      cursor: pointer;
    }
  }
  .content {
    .content-top {
      padding: 52px 0;
      @media screen and (max-width: 540px) {
        padding: 0.63rem 0;
      }
    }
    .content-title {
      padding-bottom: 30px;
      font-size: 20px;
      font-weight: bold;
    }
    .content-lead {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .icon {
    margin: 50px auto;
    width: 0.64rem;
    height: 0.65rem;
    background: url("https://static.theone.art/pc/active/compose/icon-p-bottom.png");
    background-size: contain;
    @media screen and (max-width: 540px) {
      margin: 0.39rem auto;
    }
  }
  .m-title {
    text-align: center;
    font-size: 16px;
    padding: 49px 0 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    .txt {
      padding: 0 15px;
    }
    span {
      display: inline-block;
    }
  }
  .synthesis-active-txt-color {
    width: 80%;
    max-width: 1100px;
    margin: 0px auto;
    color: #453524;
    text-align: left;
    line-height: 2;
    font-size: 12px;
    p {
      padding: 5px 0;
    }
    @media screen and (max-width: 540px) {
      width: 100%;
    }
  }
}
.banner {
  width: 100%;
  height: 350px;
  background: url("//static.theone.art/pc/active/compose/banner-1.png")
    no-repeat center;
  background-size: cover;
  background-position: 50%;
  @media screen and (max-width: 540px) {
    width: 6.9rem;
    height: 3rem;
    box-sizing: border-box;
    background: url("//static.theone.art/pc/active/compose/phone-banner.png")
      no-repeat center;
    background-size: contain;
  }
}
@media screen and (max-width: 540px) {
}
</style>
<style>
.el-message-box .el-button.el-button--primary {
  background-color: linear-gradient(90deg, #e4a516 0%, #e4a516 100%) !important;
}
</style>