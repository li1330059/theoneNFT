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
      <section class="m-banner" v-if="dataJson.mobileImg || dataJson.pcImg">
        <img
          class="responsive-img"
          :src="dataJson.mobileImg"
          v-if="dataJson.mobileImg"
        />
        <div
          v-if="dataJson.pcImg"
          class="banner-box"
          :style="`background-image:url(${dataJson.pcImg})`"
        ></div>
      </section>
      <div class="main">
        <component
          v-bind:is="currentModeObj.commont"
          :dataJson="dataJson"
          :wayArr="wayArr"
          @listenDraw="onDraw"
          @listenAnimateEnd="listenAnimateEnd"
          ref="anmateRef"
          :activeRule="activeRule"
          :activeName="activeName"
          :activeObj="activeObj"
        ></component>
      </div>
      <div class="slider-navigation">
        <div
          class="menu-block active-turntable-lottery-slider-menu-color active-turntable-lottery-slider-menu-bgcolor"
          @click="onOpenLogs"
        >
          <span class="iconfont icon-hechengjilu"></span>
          <div class="txt">{{ logsTxt }}</div>
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
      :activeObj="activeObj"
    ></select-treasurelist>
    <logs ref="logsRef" :title="logsTxt" :activeObj="activeObj"></logs>
  </div>
</template>
<script>
import Logs from "./component/logs.vue";
import Loading from "@/components/v1/loading/loading";
import Empty from "@/components/v1/empty";
import createStyle from "./create-style";
import SuccessDialog from "./component/success-dialog.vue";
import SelectTreasurelist from "./component/select-treasurelist.vue";
import { mode } from "./mode/index.js";

export default {
  components: {
    SuccessDialog,
    Logs,
    Loading,
    Empty,

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
      dataJson: {},
    };
  },
  created() {
    this.loading = true;
    this.active_uuid = this.$route.params.active_uuid;
    this.init();
  },
  computed: {
    logsTxt() {
      return this.dataJson.logsTxt || "开启记录";
    },
    currentModeObj() {
      return this.activeObj.luckySpinType == "LOTTERY" ? mode.m2 : mode.m1;
    },
    userInfo() {
      return this.$store.state.user_info;
    },
    wayArr() {
      const drawWays = {
        one: {
          type: 1,
          txt: this.activeObj.onceLotteryDesc || "单抽",
        },
        ten: {
          type: 2,
          txt: this.activeObj.tenLotteryDesc || "十抽",
        },
      };
      let wayArr;
      switch (this.activeObj.lotteryMode.toUpperCase()) {
        case "ONCE":
          wayArr = [drawWays.one];
          break;
        case "TEN":
          wayArr = [drawWays.ten];
          break;
        case "ALL":
          wayArr = [drawWays.one, drawWays.ten];
          break;
      }
      return wayArr;
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
      return "";
    },
  },
  methods: {
    init() {
      this.getConfig();
      this.getTip();
    },
    async getTip() {
      const result = await this.$api.$service.lottery_tip();
      if (result.code == 200) {
        this.lottery_tip = result.data.text;
      } else {
        this.$message.error(res.message);
      }
    },
    goCollect() {
      this.$router.push(`/mine/treasure`);
    },
    async getConfig() {
      this.loading = true;
      const res = await this.$api.service.lottery_spin_detail({
        uuid: this.active_uuid,
      });

      this.loading = false;
      if (res.data.code == 200) {
        this.empty = false;
        this.activeObj = { ...res.data.data };
        this.activeName = this.activeObj.name;

        if (this.activeObj.dataJson) {
          this.dataJson = {
            ...this.currentModeObj.config,
            ...JSON.parse(this.activeObj.dataJson),
          };
        }
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
    onDraw(info) {
      if (this.drawDisabled) {
        return;
      }
      const drawType = info.type;
      this.drawDisabled = true;
      setTimeout(() => {
        this.drawDisabled = false;
      }, 1000);

      /*       this.$refs.anmateRef.play()
      return */
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
      /*   this.drawHandle();
      return */
      this.openDisabled = true;
      const params = {
        consumeList,
        uuid: this.active_uuid,
      };
      if (this.drawType == 1) {
        const res = await this.$api.service.lottery_spin_openOne(params);
        this.openDisabled = false;
        if (res.data.code == 1009) {
          this.$message.error(this.lottery_tip);
          return;
        }
        if (res.data.code == 200 && res.data.data) {
          this.drawHandle([res.data.data], res.data.data.areaUuid);
        } else {
          this.$message.error(res.data.message);
        }
      } else if (this.drawType == 2) {
        const res = await this.$api.service.lottery_spin_openTen(params);
        this.openDisabled = false;
        if (res.data.code == 1009) {
          this.$message.error(this.lottery_tip);
          return;
        }
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
      /*     this.$refs.selectTreasurelistRef.hideAll();
      this.$refs.anmateRef.play(1);
      return */
      //抽奖成功
      this.$refs.selectTreasurelistRef.hideAll();
      if (this.activeObj.luckySpinType == "LOTTERY") {
        const idx = this.$refs.anmateRef.prizes.findIndex(
          (item) => item.areaUuid == areaUuid
        );

        if (idx != -1) {
          this.drawRes = res;
          this.$refs.anmateRef.play(idx);
        } else {
          this.$message.warning("未找到奖品");
        }
      } else {
        this.drawRes = res;
        this.$refs.anmateRef.play();
      }
    },
    listenAnimateEnd() {
      console.log(this.drawRes);
      /*   this.$refs.successRef.init(res);
      return */
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
  padding-top: 60px;
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
    border-radius: 0.1rem;
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
