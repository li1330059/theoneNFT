<template>
  <div
    class="page-body active-turntable-lottery-txt-color"
    :style="`background:${dataJson.bgColor}`"
  >
    <div class="loading-wrap" v-if="loading">
      <loading></loading>
    </div>
    <empty :title="errorMessage" v-else-if="empty" class="cus-empty"></empty>
    <div v-else>
      <section class="m-banner">
        <img class="responsive-img" :src="dataJson.mobileImg" />
        <div
          class="banner-box"
          :style="`background-image:url(${dataJson.pcImg})`"
        ></div>
      </section>
      <div class="main">
        <section class="m-title-wrap">
          <div class="t1">幸运转盘抽奖活动</div>
          <div class="date active-turntable-lottery-title-date-color">
            {{ activeTime }}
          </div>
        </section>

        <section class="m-box-list active-turntable-lottery-main-bg bg-img">
          <title-block
            :title="activeName"
            :right="dataJson.titleright"
            :left="dataJson.titleLeft"
            :md="dataJson.titleMd"
            :icon="dataJson.titleIcon"
            :color="dataJson.titleColor"
            class="bg-full"
          ></title-block>
          <div class="turntable-wrap">
            <turntable
              :prizes="prizes"
              ref="turntableRef"
              :blocks="roundBlocks"
              :buttons="roundButtons"
              @listen="listenTurntableOver"
            ></turntable>
          </div>
          <!--      <img
            class="responsive-img turntable-table"
            src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/turntable-table.png"
          /> -->
          <picture>
            <source
              :srcset="dataJson.tableBgMobile"
              media="(max-width: 540px)"
            />

            <img
              class="responsive-img turntable-table"
              :srcset="dataJson.tableBg"
              alt="pic"
            />
          </picture>
          <div class="draw-btn-group">
            <div
              class="btn active-turntable-lottery-btn-one hand"
              @click="onDraw(1)"
            ></div>
            <div
              class="btn active-turntable-lottery-btn-ten hand"
              @click="onDraw(2)"
            ></div>
          </div>
        </section>

        <section
          v-if="activeRule"
          class="m-active-rule active-turntable-lottery-active-rule-color"
        >
          <title-block
            title="活动说明"
            :right="dataJson.titleright"
            :left="dataJson.titleLeft"
            :md="dataJson.titleMd"
            :icon="dataJson.titleIcon"
            :color="dataJson.titleColor"
            class="bg-full"
          ></title-block>
          <div class="txt" v-html="activeRule"></div>
        </section>

        <section
          v-if="dataJson.activeMessage"
          class="m-active-rule m-active-message active-turntable-lottery-active-message-color"
        >
          <title-block
            title="活动须知"
            :color="dataJson.titleColor"
            :right="dataJson.titleright"
            :left="dataJson.titleLeft"
            :md="dataJson.titleMd"
            :icon="dataJson.titleIcon"
            class="bg-full"
          ></title-block>
          <div class="txt" v-html="dataJson.activeMessage"></div>
        </section>
      </div>
      <div class="slider-navigation">
        <div
          class="menu-block active-turntable-lottery-slider-menu-color active-turntable-lottery-slider-menu-bgcolor"
          @click="onOpenLogs"
        >
          <span class="iconfont icon-hechengjilu"></span>
          <div class="txt">开启记录</div>
        </div>
        <div
          class="menu-block active-turntable-lottery-slider-menu-color active-turntable-lottery-slider-menu-bgcolor"
          @click="goCollect"
        >
          <span class="iconfont icon-icon_wanfahezi"></span>
          <div class="txt">我的藏品</div>
        </div>
      </div>
    </div>

    <success-dialog
      ref="successRef"
      :successTitle="dataJson.successTitle"
      :top="dataJson.successTop"
      :bottom="dataJson.successBottom"
      :bg="dataJson.successBg"
      :borderColor="dataJson.successBorderColor"
      :ctxColor="dataJson.successCtxColor"
    ></success-dialog>
    <select-treasurelist
      ref="selectTreasurelistRef"
      @listen="draw"
      :activeId="active_uuid"
      :drawType="drawType"
    ></select-treasurelist>
    <logs ref="logsRef"></logs>
  </div>
</template>
<script>
import SuccessDialog from "./component/success-dialog.vue";
import Logs from "./component/logs.vue";
import Loading from "@/components/v1/loading/loading";
import Empty from "@/components/v1/empty";
import createStyle from "./create-style";
import Turntable from "./component/turntable.vue";
import TitleBlock from "./component/title-block.vue";
import SelectTreasurelist from "./component/select-treasurelist.vue";
export default {
  components: {
    SuccessDialog,
    Logs,
    Loading,
    Empty,
    Turntable,
    TitleBlock,
    SelectTreasurelist,
  },
  data() {
    return {
      openDisabled: false,
      active_uuid: "",
      drawType: "",
      activeName: "", //活动名字
      prizes: [], //转盘奖品设置
      activeRule: "",
      activeObj: {},
      loading: true,
      empty: false,
      errorMessage: "",
      openBoxDisabled: false,
      openObj: {},
      drawDisabled: false,
      roundButtons: [],
      roundBlocks: [],
      dataJson: {
        boxImg: "", //盲盒图片
        bgColor: "linear-gradient(180deg, #FFDDE3 0%, #FFF2F5 100%)", //body背景色
        txtColor: "#333333", //默认字色
        iconLine:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-line.png",
        mainBg:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/1.png", //背景图
        activeRuleColor: "#A60A2A", //活动说明字色
        activeMessageColor: "#A60A2A", //活动须知字色
        activeRule: "", //活动说明
        successBorderColor: "linear-gradient(180deg, #FFCED0 0%, #FFD6D5 100%)",
        successCtxColor: "#FFFAF9",
        successTitle:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/2.png",
        successTop:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/3.png",
        successBottom:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/4.png",
        successBg:
          "https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/colors.png",
        titleColor: "#A60A2A",

        titleLeft:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/6.png",
        titleright:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/5.png",
        titleMd:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/7.png",
        titleIcon:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/8.png",
        tableBgMobile:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/9.png",
        tableBg:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/12.png",
        btnOne:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/16.png",
        btnOneMobile:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/14.png",
        btnTen:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/15.png",
        btnTenMobile:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/13.png",
        roundShadow:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/10.png",
        roundBg:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/11.png",
        roundButton:
          "//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/love/20.png",

        activeMessage: `为更好服务唯一艺术平台的各位用户，唯一艺术特此公告数字藏品的二次交易细则。鉴于不同属性的数字艺术的二次交易细则各有不同，请各位用户务必审慎阅读并同意相关规则后进行相应操作，以免造成不必要损失。<br>

1、依据我国法律要求，特定条件下的数字藏品的二次交易不支持任何形式的变相炒作，我们坚决反对数字藏品炒作、场外交易、欺诈，或以任何其他非法、侵权方式使用的违法违规行为，请大家注意甄别上述涉嫌网络欺诈的行为及其相关风险。<br>

2、数字藏品为虚拟数字商品，购买以及寄售前请先完成实名认证。<br>

3、未满18周岁用户禁止参与。<br>

4、数字藏品一经售出不支持退换。`, //活动须知
        sliderMenuColor: "#333333", //右侧悬浮导航字色
        sliderMenuBgColor: "#fff", //右侧悬浮导航背景色
        warningColor: "#E61F1A",
        /*    titleColor: "red", //标题字色
        titleDateColor: "red", //活动时间字色
        tabColor: "red", //活动标题字色
        tipTxtColor: "red", //点击下方礼盒开启字色
        //警告颜色 */
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

    isConditions() {
      if (this.activeObj.ownsInfo) {
        return this.activeObj.ownsInfo.find((item) => {
          return item.amount > 0;
        });
      }
      return false;
    },
    activeTime() {
      if (this.activeObj.startTime && this.activeObj.endTime) {
        if (
          this.$common.formatDate(this.activeObj.startTime, "yyyy") ==
          this.$common.formatDate(this.activeObj.startTime, "yyyy")
        ) {
          return `${this.$common.formatDate(
            this.activeObj.startTime,
            "MM月dd日HH:mm"
          )} - ${this.$common.formatDate(
            this.activeObj.endTime,
            "MM月dd日HH:mm"
          )}`;
        } else {
          return `${this.$common.formatDate(
            this.activeObj.startTime,
            "yyyy年MM月dd日HH:mm"
          )} - ${this.$common.formatDate(
            this.activeObj.endTime,
            "yyyy年MM月dd日HH:mm"
          )}`;
        }
      }
      return "";
    },
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
      const res = await this.$api.service.lottery_spin_detail({
        uuid: this.active_uuid,
      });
      /*         const res = {
        data: {
          code: 200,
          message: "成功",
          data: {
            dataJson:
              '{"boxImg":"https://theoneart-common.oss-cn-qingdao.aliyuncs.com/author/e8d89020aeadb7e1135c14f5e38daf8a1658739506793.jpg","banner":"https://theoneart-common.oss-cn-qingdao.aliyuncs.com/author/c88d5e4dc6372f7ce7341adf94402cc71658739520540.jpg","bannerMobile":"https://theoneart-common.oss-cn-qingdao.aliyuncs.com/author/1ad3174e10505a3da5f3218467ac2b7b1658739524433.jpg"}',
            name: "国潮博物馆超级联动盲盒活动",
            startTime: "2022-07-25 18:00:00",
            endTime: "2022-07-27 18:00:00",
            restTime: null,
            spinAreaList: [{}, {}, {}, {}],
            awardRow: 3,
            awardColumn: 3,
            awardCount: 9,
            info: "活动规则：每消耗使用1个金钥匙，开启1个超级联动盲盒。活动期间购买的金钥匙同样可以参与活动。\n\n盲盒内容：\n1）1个金钥匙可以开启1个国潮博物馆超级联动盲盒，1个超级联动盲盒中随机开出以下1个福利。\n2）唯一艺术国潮博物馆纪念徽章，共896个。每持有1个纪念徽章，获得国潮博物馆指定藏品发售的5份优先购买资格+版权市场指定版权品2份优先购买资格，国潮博物馆的优先购买资格与最终合成款叠加。\n3）A级卡，共999个，每持有1个，获得6份国潮博物馆指定藏品发售的优先购买资格，仅限在指定发售款中使用一次，与最终合成款优先购买资格叠加。\n4）B级卡，共2500个，每持有1个，获得4份国潮博物馆指定藏品发售的优先购买资格，仅限在指定发售款中使用一次，与最终合成款优先购买资格叠加。\n5）C级卡，共3000个，每持有1个，获得2份国潮博物馆指定藏品发售的优先购买资格，仅限在指定发售款中使用一次，与最终合成款优先购买资格叠加。\n6）嫦娥元宇宙系列。\n7）衍生品库存盲盒，1个超级联动盲盒可随机开出若干个已发售的衍生品库存盲盒。（唯一艺术平台从IP方购买了已中签但未购买的盲盒，用于本次超级盲盒联动活动，这些盲盒简称为“库存盲盒”。）\n\n*开出衍生品库存盲盒的用户将获得空投凭证，平台将在活动结束后为持有凭证的用户空投对应的衍生品。\n\n其他说明\n1）持有多个国潮博物馆纪念徽章，多个或多款优先购买福利卡，优先购买数量可叠加。\n2）国潮博物馆纪念徽章、优先购买福利卡次数使用完后，将被回收。",
          },
        },
      }; */
      this.loading = false;
      if (res.data.code == 200) {
        this.empty = false;
        this.activeObj = res.data.data;
        this.activeName = this.activeObj.name;

        let prizes = this.activeObj.spinAreaList.map((item, idx) => {
          item.background = idx % 2 == 0 ? "#FFEFE8" : "#FFE8E6";
          const prizeImg = {
            src: item.areaUrl,
            width: "32%",
            top: "30%",
          };
          item.imgs = [prizeImg];
          return item;
        });
        if (prizes.length % 2 != 0) {
          prizes[prizes.length - 1].background = "#FFF2F3";
        }
        this.prizes = prizes;
        if (this.activeObj.dataJson) {
          this.dataJson = {
            ...this.dataJson,
            ...JSON.parse(this.activeObj.dataJson),
          };
        }
        this.roundBlocks = [
          {
            padding: ".4rem",
            imgs: [
              {
                src: this.dataJson && this.dataJson.roundShadow,
                width: "100%",
                height: "100%",
              },
            ],
          },
          {
            padding: ".48rem",
            imgs: [
              {
                src: this.dataJson && this.dataJson.roundBg,
                width: "100%",
                height: "100%",
              },
            ],
          },
        ];

        this.roundButtons = [
          {
            radius: "50%",
            imgs: [
              {
                src: this.dataJson && this.dataJson.roundButton,
                width: "30%",
                top: "-130%",
              },
            ],
          },
        ];
        this.activeRule = this.activeObj.info
          ? this.activeObj.info.replace(/\n/gi, "<br>")
          : "";

        createStyle({
          ...this.dataJson,
        });
      } else {
        this.empty = true;
        this.errorMessage = res.data.message;
      }
    },
    onDraw(drawType) {
      if (this.drawDisabled) {
        return;
      }
      this.drawDisabled = true;
      setTimeout(() => {
        this.drawDisabled = false;
      }, 1000);
      if (drawType == 1) {
        if (this.activeObj.emptyStockFlag) {
          this.$message.error("活动太火爆啦，奖池数量不足");
          return;
        }
      } else if (drawType == 2) {
        if (this.activeObj.emptyStockFlag) {
          this.$message.error("活动太火爆啦，奖池数量不足");
          return;
        }
        if (this.activeObj.lowStockFlag) {
          this.$message.error("活动太火爆啦，奖池数量不足请单抽");
          return;
        }
      }
      this.drawType = drawType;
      this.$refs.selectTreasurelistRef.show(drawType);
    },
    async draw(consumeList) {
      if (this.openDisabled) {
        return;
      }
      this.openDisabled = true;
      const params = {
        consumeList,
        uuid: this.active_uuid,
      };
      if (this.drawType == 1) {
        const res = await this.$api.service.lottery_spin_openOne(params);
        this.openDisabled = false;
        if (res.data.code == 200 && res.data.data) {
          this.drawHandle([res.data.data], res.data.data.areaUuid);
        } else {
          this.$message.error(res.data.message);
        }
      } else if (this.drawType == 2) {
        const res = await this.$api.service.lottery_spin_openTen(params);
        this.openDisabled = false;
        if (res.data.code == 200 && res.data.data) {
          this.drawHandle(res.data.data, res.data.data[0].areaUuid);
        } else {
          this.$message.error(res.data.message);
        }
      } else {
        this.$message.warning("未识别的抽奖类型");
      }
      this.openDisabled = false;
    },
    drawHandle(res, areaUuid) {
      this.$refs.selectTreasurelistRef.hideAll();
      const idx = this.prizes.findIndex((item) => item.areaUuid == areaUuid);
      console.log(idx);
      if (idx != -1) {
        this.drawRes = res;
        this.$refs.turntableRef.start(idx);
      } else {
        this.$message.warning("未找到奖品");
      }
    },
    listenTurntableOver() {
      this.$refs.successRef.init(this.drawRes);
    },
    onOpenLogs() {
      this.$refs.logsRef.show(this.active_uuid);
    },
  },
};
</script>
<style lang="scss" scoped>
.bg-full {
  background-size: 100%;
  max-width: 560px;
  margin: 0 auto;
  @media screen and (max-width: 540px) {
  }
}
.turntable-wrap {
  display: flex;
  justify-content: center;
}
.turntable-table {
  margin-top: -60px;
  @media screen and (max-width: 540px) {
    margin-top: -0.8rem;
  }
}
.draw-btn-group {
  display: flex;
  justify-content: space-around;
  max-width: 740px;
  margin: -95px auto 0;

  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
  .btn {
    width: 320px;
    height: 79px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .btn-one {
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/btn-one.png");
  }
  .btn-batch {
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/btn-bacth.png");
  }
  @media screen and (max-width: 540px) {
    margin-top: -1.5rem;
    padding-bottom: 0.2rem;
    margin-bottom: 0.9rem;
    .btn {
      width: 3.2rem;
      height: 0.96rem;
    }
    .btn-one {
      background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/btn-one-m.png");
    }
    .btn-batch {
      background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/btn-bacth-m.png");
    }
  }
}
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
  z-index: 11;
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
    min-width: 640px;
    margin: 0 auto;
    padding: 0 16px;
  }
  @media screen and (max-width: 540px) {
    .main {
      min-width: inherit;
    }
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
  border-radius: 10px;
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
  padding: 0px 40px 40px;
  margin-top: 58px;
  background-position: -10px -10px;
  background-color: #fff8f6;
  .title {
    font-size: 20px;
    text-align: center;
    margin-bottom: 24px;
  }
  .txt {
    word-break: break-all;
    font-size: 12px;
    line-height: 28px;
  }
  @media screen and (max-width: 540px) {
    padding: 0 0.22rem 0.16rem;
    margin-top: 0.6rem;
    border-radius: 0.1rem 0.1rem 0 0;
    background-position: -0.1rem -0.1rem;
    .title {
      font-size: 0.26rem;
      text-align: center;
      margin-bottom: 0.24rem;
    }
    .txt {
      font-size: 0.24rem;
      line-height: 0.4rem;
      padding-top: 0.3rem;
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
