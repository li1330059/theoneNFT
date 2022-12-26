<template>
  <div
    class="page-body active-blind-box-bg"
    :style="`background:${dataJson.bgColor}`"
  >
    <div class="loading-wrap" v-if="loading">
      <loading></loading>
    </div>
    <empty :title="errorMessage" v-else-if="empty" class="cus-empty"></empty>
    <div v-else>
      <section class="m-banner">
        <img class="responsive-img" :src="dataJson.bannerMobile" />
        <div
          class="banner-box"
          :style="`background-image:url(${dataJson.banner})`"
        ></div>
        <!--       </<picture>
          <source :srcset="dataJson.bannerMobile" media="(max-width: 540px)" />

          <img class="responsive-img" :srcset="dataJson.banner" alt="pic" />
        </picture> -->
      </section>
      <div class="main">
        <section class="m-title-wrap">
          <div class="t1 active-blind-box-title-color">
            {{ activeObj.name }}
          </div>
          <!-- <div class="date active-blind-box-title-date-color">
            {{ $common.formatDate(activeObj.startTime, "MM月dd日HH:mm") }} -
            {{ $common.formatDate(activeObj.endTime, "MM月dd日HH:mm") }}
          </div> -->
        </section>
        <section class="m-active-condition active-blind-box-warning-color">
          <!--       <div>剩余开启次数：{{ activeObj.restTime || 0 }}</div> -->
          <div>拥有：{{ ownsInfo }}</div>
        </section>
        <section class="m-tab-wrap active-blind-box-tab-color">
          <span class="iconfont icon-icon_wanfahezi"></span>{{ activeObj.name }}
        </section>
        <section class="m-box-list active-blind-box-main-bg">
          <div class="msg active-blind-box-tip-txt-color">点击下方礼盒开启</div>
          <div class="list-wrap">
            <div
              class="blind-box"
              v-for="item in activeObj.awardRow * activeObj.awardColumn"
              :key="item"
              :style="`width:${(1 / activeObj.awardColumn) * 100}%`"
            >
              <div
                class="content bg-img hand"
                :style="`background-image:url(${dataJson.boxImg})`"
                :class="{ opend: item > activeObj.awardCount }"
                @click="onOpenBox(item > activeObj.awardCount)"
              ></div>
            </div>
            <!--        <div class="blind-box">
            <div class="content"></div>
          </div>
          <div class="blind-box">
            <div class="content bg-img opend"></div>
          </div> -->
          </div>
        </section>
        <section class="m-adorn-line" v-if="activeRule">
          <img :src="styleJson.iconLine" />
          <img :src="styleJson.iconLine" />
        </section>
        <section
          v-if="activeRule"
          class="m-active-rule active-blind-box-active-rule-color active-blind-box-active-rule-bg-color"
        >
          <div class="title">活动说明</div>
          <div class="txt" v-html="activeRule"></div>
        </section>

        <section
          v-if="dataJson.activeMessage"
          class="m-active-rule m-active-message active-blind-box-active-message-color"
        >
          <div class="title">
            <span
              class="iconfont icon-icon_wanfahezi active-blind-box-active-message-icon-color"
            ></span
            ><span class="t-txt">活动须知</span
            ><span
              class="iconfont icon-icon_wanfahezi active-blind-box-active-message-icon-color"
            ></span>
          </div>
          <div class="txt" v-html="dataJson.activeMessage"></div>
        </section>
      </div>
      <div class="slider-navigation">
        <div
          class="menu-block active-blind-box-logs-color active-blind-box-logs-bgcolor"
          @click="onOpenLogs"
        >
          <span class="iconfont icon-hechengjilu"></span>
          <div class="txt">开启记录</div>
        </div>
        <div
          class="menu-block active-blind-box-collection-color active-blind-box-collection-bgcolor"
          @click="goCollect"
        >
          <span class="iconfont icon-icon_wanfahezi"></span>
          <div class="txt">我的藏品</div>
        </div>
      </div>
    </div>

    <success-dialog ref="successRef"></success-dialog>
    <logs ref="logsRef"></logs>
  </div>
</template>
<script>
import SuccessDialog from "./component/success-dialog.vue";
import Logs from "./component/logs.vue";
import Loading from "@/components/v1/loading/loading";
import Empty from "@/components/v1/empty";
import createStyle from "./create-style";
export default {
  components: { SuccessDialog, Logs, Loading, Empty },
  data() {
    return {
      activeRule: "",
      activeObj: {},
      loading: true,
      empty: false,
      errorMessage: "",
      openBoxDisabled: false,
      openObj: {},
      dataJson: {
        // 活动内容对象
        boxImg: "", //盲盒图片
        // bgColor: "#f5f2ec", //body背景色
        // txtColor: "#333333", //默认字色
        // iconLine:
        //   "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-line.png",
        mainBg: "", // 盒子背景图
        // activeRuleColor: "#333333", //活动说明字色
        // activeMessageColor: "#333333", //活动须知字色
        banner: "", // 广告位 - pc
        bannerMobile: "", // 广告位 - 移动端
        // activeRule: "", //活动说明
        activeMessage: `为更好服务唯一艺术平台的各位用户，唯一艺术特此公告数字藏品的二次交易细则。鉴于不同属性的数字艺术的二次交易细则各有不同，请各位用户务必审慎阅读并同意相关规则后进行相应操作，以免造成不必要损失。<br>

1、依据我国法律要求，特定条件下的数字藏品的二次交易不支持任何形式的变相炒作，我们坚决反对数字藏品炒作、场外交易、欺诈，或以任何其他非法、侵权方式使用的违法违规行为，请大家注意甄别上述涉嫌网络欺诈的行为及其相关风险。<br>

2、数字藏品为虚拟数字商品，购买以及寄售前请先完成实名认证。<br>

3、未满18周岁用户禁止参与。<br>

4、数字藏品一经售出不支持退换。`, //活动须知
        //         sliderMenuColor: "#333333", //右侧悬浮导航字色
        //         sliderMenuBgColor: "#fff", //右侧悬浮导航背景色
        //         warningColor: "#E61F1A",
        /*    titleColor: "red", //标题字色
        titleDateColor: "red", //活动时间字色
        tabColor: "red", //活动标题字色
        tipTxtColor: "red", //点击下方礼盒开启字色
        //警告颜色 */
      },
      styleJson: {
        // 皮肤样式对象
        activeTitleColor: "#333", // 活动名称字色
        bgColor: "#E1ECF2", // 整体活动背景色
        attTxtColor: "#E61F1A", // 拥有消耗信息字色
        iconLine:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-line.png", // 连接插图
        activeRuleColor: "#333", // 活动说明字色
        activeRuleBgColor: "#C3E5F7", // 活动说明背景色
        activeMessageColor: "#333", // 活动须知字色
        activeMessageIconColor: "#333", // icon颜色
        logIconColor: "#333", // 开启记录字色
        logBgColor: "#fff", // 开启记录背景色
        iconCollectionColor: "#333", // 我的藏品字色
        collectionBgColor: "#fff", // 我的藏品背景色
        dialogBgColor: "#fff", // 弹窗底色（适用所有弹窗）
        dialogBtnBgColor: "linear-gradient(90deg, #FF7A64 0%, #E61F1A 100%)", // 弹窗按钮底色（适用所有弹窗按钮）
        dialogBtnColor: "#fff", // 弹窗按钮字色（适用所有弹窗按钮）
        logTitleBgColor: "#FF5A4A", // 开启记录列表表头底色
        logTitleColor: "#fff", // 开启记录列表表头字色
      },
    };
  },
  created() {
    this.loading = true;
    this.active_uuid = this.$route.params.active_uuid;
    this.init();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
    ownsInfo() {
      //拥有
      if (this.activeObj.ownsInfo) {
        let arr = [];
        this.activeObj.ownsInfo.forEach((item) => {
          arr.push(`${item.commodityName}*${item.amount}`);
        });
        return arr.join(",");
      }
      return "";
    },
    consumeInfo() {
      //消耗
      if (this.activeObj.consumeInfo) {
        let arr = [];
        this.activeObj.consumeInfo.commodityList.forEach((item) => {
          arr.push(`${item.commodityName}*${item.amount}`);
        });
        let joinStr = ",";
        if (this.activeObj.consumeInfo.consumeType == 1) {
          joinStr = "或";
        }
        return arr.join(joinStr);
      }
      return "";
    },
    isConditions() {
      if (this.activeObj.ownsInfo) {
        return this.activeObj.ownsInfo.find((item) => {
          return item.amount > 0;
        });
      }
      return false;
    },
    /*     isConditions() {
      const checkUserGoodsNeed = (goodsId) => {
        //检查某个商品用户是否拥有
        return (
          this.activeObj.ownsInfo &&
          this.activeObj.ownsInfo.find((item) => {
            return item.commodityUuid == goodsId;
          })
        );
      };
      //是否满足条件
      if (
        this.activeObj.consumeInfo &&
        this.activeObj.consumeInfo.consumeType == 1
      ) {
        //或
        return (
          this.activeObj.consumeInfo &&
          this.activeObj.consumeInfo.commodityList.find((item) => {
            const userGoods = checkUserGoodsNeed(item.commodityUuid);
            return userGoods && userGoods.amount >= item.amount;
          })
        );
      } else {
        //且
        this.activeObj.consumeInfo &&
          this.activeObj.consumeInfo.commodityList.every((item) => {
            const userGoods = checkUserGoodsNeed(item.commodityUuid);
            return userGoods && userGoods.amount >= item.amount;
          });
      }
    }, */
  },
  methods: {
    init() {
      this.getConfig();
    },
    goCollect() {
      this.$router.push(`/mine/treasure`);
    },
    async getConfig() {
      this.loading = true;
      const res = await this.$api.service.om_goods_lottery_detail({
        uuid: this.active_uuid,
      });
      this.loading = false;
      if (res.data.code == 200) {
        this.empty = false;

        this.activeObj = res.data.data;
        if (this.activeObj.dataJson) {
          this.dataJson = {
            ...this.dataJson,
            ...JSON.parse(this.activeObj.dataJson),
          };
        }
        if (this.activeObj.styleJson) {
          this.styleJson = {
            ...this.styleJson,
            ...JSON.parse(this.activeObj.styleJson),
          };
        }
        this.activeRule = this.activeObj.info
          ? this.activeObj.info.replace(/\n/gi, "<br>")
          : "";

        createStyle({
          ...this.dataJson,
          ...this.styleJson,
        });
      } else {
        this.empty = true;
        this.errorMessage = res.data.message;
      }
    },
    onOpenBox(isOpend) {
      if (isOpend) {
        return;
      }

      this.$confirm(
        `需要您消耗：<span style="color:#E61F1A">${this.consumeInfo}</span><br>确定是否开启该礼盒？`,
        "开启礼盒",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          customClass: "golden-key-box-dialog active-blind-box-dialog-bg-color",
          confirmButtonClass:
            "active-blind-box-dialog-btn-bg-color active-blind-box-dialog-btn-color",
          // type: "warning",
        }
      )
        .then(async () => {
          this.openBox();
        })
        .catch(() => {});
      /*      if (this.activeObj.restTime && this.activeObj.restTime > 0) {
      } else {
        this.$message.warning("暂无开启次数，无法开启");
      } */
    },
    async openBox() {
      if (this.openBoxDisabled) {
        return;
      }
      this.openBoxDisabled = true;
      const res = await this.$api.service.om_goods_lottery_open({
        uuid: this.active_uuid,
      });
      this.openBoxDisabled = false;
      if (res.data.code == 200) {
        this.openObj = res.data.data;
        this.$refs.successRef.show(this.openObj);
        this.init();
      } else {
        this.$message.error(res.data.message);
      }
    },
    onOpenLogs() {
      this.$refs.logsRef.show(this.active_uuid);
    },
  },
};
</script>
<style lang="scss" scoped>
.m-banner {
  .banner-box {
    height: 350px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    display: block;
  }
  img {
    display: none;
  }
  @media screen and (max-width: 540px) {
    padding: 0.6rem 0.3rem 0;
    .banner-box {
      display: none;
    }
    img {
      display: block;
    }
  }
}
.cus-empty {
  ::v-deep .empty p {
    color: #666666;
  }
}
.loading-wrap {
  height: 50vh;
}
.icon-blind-box {
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-blind-box.png");
}
.icon-record {
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-record.png");
}
.icon-collection {
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-blind-box.png");
}
.slider-navigation {
  position: fixed;
  top: 30vh;
  right: 0;
  z-index: 3;
  .menu-block {
    width: 100px;
    height: 100px;

    border-radius: 6px 0px 0px 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    cursor: pointer;
    .iconfont {
      font-size: 26px;
    }
    .txt {
      font-size: 12px;
      font-weight: 500;
      margin-top: 7px;
    }
  }
  @media screen and (max-width: 540px) {
    .menu-block {
      width: 1.24rem;
      height: 1.24rem;
      border-radius: 0.06rem 0px 0px 0.06rem;

      .iconfont {
        font-size: 0.4rem;
      }
      .txt {
        font-weight: 500;
        font-size: 0.24rem;
        text-align: center;
        margin-top: 0.01rem;
      }
    }
  }
}
.page-body {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding-bottom: 100px;
  .main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
}
.m-adorn-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -30px auto;
  padding: 0 90px;
  img {
    display: block;
    height: 90px;
  }
  @media screen and (max-width: 540px) {
    margin: -0.34rem auto;

    padding: 0 0.4rem;
    img {
      height: 1.2rem;
    }
  }
}
.m-title-wrap {
  margin-bottom: 50px;
  text-align: center;
  margin-top: 60px;
  .t1 {
    font-size: 32px;
    font-weight: bold;
  }
  .date {
    font-size: 24px;
    font-weight: 500;
    line-height: 33px;
    margin-top: 6px;
  }
  @media screen and (max-width: 540px) {
    margin-bottom: 0.5rem;
    margin-top: 0.6rem;
    .t1 {
      font-size: 0.3rem;
    }
    .date {
      font-size: 0.24rem;
      margin-top: 0;
    }
  }
}
.m-active-condition {
  font-size: 18px;
  margin-bottom: 24px;

  text-align: right;
  @media screen and (max-width: 540px) {
    font-size: 0.24rem;
    margin-bottom: 0.16rem;
  }
}
.m-tab-wrap {
  position: relative;
  z-index: 1;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  height: 60px;
  background: #ffffff;
  border-radius: 10px;
  .iconfont {
    font-size: 22px;
    margin-right: 4px;
  }
  @media screen and (max-width: 540px) {
    height: 0.6rem;
    font-size: 0.24rem;
    border-radius: 0.1rem;
    .iconfont {
      font-size: 0.26rem;
    }
  }
}
.m-box-list {
  margin-top: -6px;
  border-radius: 0 0 10px 10px;
  .msg {
    text-align: center;
    font-size: 20px;
    line-height: 33px;
    padding: 50px 0 20px;
  }

  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    padding: 0 60px 70px;
    justify-content: center;
    .blind-box {
      width: 33.33%;
      padding: 30px 50px;
      max-width: 360px;
      .content {
        background-color: #ffffff;
        border-radius: 10px;
        padding-bottom: 100%;
        background-size: 76%;
      }
      .opend {
        background-size: 76%;
        background-position: center;
        background-repeat: no-repeat;
        background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/opend-box.png") !important;
      }
    }
  }
  @media screen and (max-width: 540px) {
    border-radius: 0.1rem;
    margin-top: 0.09rem;
    .msg {
      padding: 0.48rem 0 0.2rem;
      font-size: 0.2rem;
    }
    .list-wrap {
      padding: 0.12rem 0.12rem 0.5rem;

      .blind-box {
        padding: 0.1rem;
        max-width: initial;
        .content {
          border-radius: 0.1rem;
        }
        .opend {
          background-size: 76%;
        }
      }
    }
  }
}
.m-active-rule {
  border-radius: 10px;
  padding: 50px 40px 40px;
  .title {
    font-size: 20px;
    text-align: center;
    margin-bottom: 24px;
  }
  .txt {
    font-size: 12px;
    line-height: 28px;
  }
  @media screen and (max-width: 540px) {
    padding: 0.6rem 0.22rem 0.16rem;
    .title {
      font-size: 0.26rem;
      text-align: center;
      margin-bottom: 0.24rem;
    }
    .txt {
      font-size: 0.24rem;
      line-height: 0.4rem;
    }
  }
}
.m-active-message {
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    .t-txt {
      margin: 0 20px;
    }
    span {
      display: inline-block;
      padding: 0 2px;
    }
    .iconfont {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 540px) {
    padding: 0.6rem 0 0.16rem;
    .title {
      .t-txt {
        margin: 0 0.2rem;
      }
      .iconfont {
        font-size: 0.24rem;
      }
    }
  }
}
</style>
