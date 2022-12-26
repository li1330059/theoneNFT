<template>
  <div class="ui-body synthesis-base-color synthesis-body-bg-color">
    <div class="loading-wrap" v-if="loading">
      <loading></loading>
    </div>
    <div v-else-if="playOptions.length > 0">
      <div class="m-banner grayscale">
        <div class="banner" v-lazy:background-image="templateInfo.banner"></div>
        <img
          class="banner-phone"
          :src="
            templateInfo.bannerAdapter
              ? templateInfo.bannerAdapter
              : templateInfo.banner
          "
        />
      </div>
      <div class="content-w grayscale">
        <img
          class="responsive-img block-des"
          :src="templateInfo.ipDescription"
        />

        <div class="m-tab-wrap">
          <div
            class="tab synthesis-tab-color"
            v-for="(item, idx) in playOptions"
            :key="idx"
            :class="{ selected: currentPlay == idx }"
            @click="onChangePlay(item, idx)"
          >
            <div class="tab-icon iconfont icon-icon_wanfahezi"></div>
            <div class="txt">{{ item.name }}</div>
          </div>
        </div>
        <div class="m-content synthesis-content-bg-img">
          <div class="swiper-container swiper j-page-swiper">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(item, idx) in playOptions"
                :key="idx"
              >
                <dh-play-1
                  v-if="item.list.length > 1"
                  class="j-page1"
                  @listen="compose"
                  :list="item.list"
                  :playInfo="item"
                ></dh-play-1>
                <dh-play-2
                  v-else
                  class="j-page2"
                  @listen="createCompose"
                  :list="item.list"
                  :playInfo="item"
                ></dh-play-2>
              </div>
            </div>
          </div>
        </div>

        <div class="m-title synthesis-active-txt-color">
          <span class="iconfont icon-icon_wanfahezi" />
          <div class="txt">活动须知</div>
          <span class="iconfont icon-icon_wanfahezi" />
        </div>
        <div class="ui-activity-instructions synthesis-active-txt-color">
          <div v-html="description"></div>
        </div>
      </div>

      <div
        class="m-collection synthesis-icon-collection-color synthesis-collection-bgcolor grayscale"
        @click="$common.goPage('/mine/treasure')"
      >
        <div class="icon-collection iconfont icon-icon_wanfahezi" />
        我的藏品
      </div>
      <dh-loading
        ref="refDhLoading"
        :name="commodity.commodity && commodity.commodity.name"
      ></dh-loading>
      <dh-select-material
        ref="refDhSelectMaterial"
        width="360"
        @listen="compose"
        @upList="upList"
      ></dh-select-material>
      <!--     <dh-compound ref="refDhCompound" :commodity="createCommodity"></dh-compound> -->
      <el-dialog
        class="v1-dialog-mycenter content-responsive"
        title="提示"
        width="300px"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
      >
        <div class="dialog-txt-wrap">已经购买成功？</div>
        <div class="form-btns">
          <div class="v1-btn mycenter" @click="dialogVisible = false">
            未购买
          </div>
          <div class="v1-btn mycenter red" @click="onUpListInfo">已购买</div>
        </div>
      </el-dialog>
      <dh-compose-animate
        ref="refDhCompound"
        :commodity="createCommodity"
      ></dh-compose-animate>
    </div>
    <div v-else>
      <dh-empty></dh-empty>
    </div>
  </div>
</template>
<script>
import DhPlay1 from "./component/dh-play-1.vue";
import DhPlay2 from "./component/dh-play-2.vue";
import Swiper from "swiper";
import DhLoading from "./component/dh-loading.vue";
import DhSelectMaterial from "./component/dh-select-material.vue";
import DhComposeAnimate from "./component/dh-compose-animate.vue";
import writeThemeStyle from "./component/create-theme-css";
import DhEmpty from "./component/dh-empty";
import Loading from "../../../../components/v1/loading/loading.vue";
const toChinesNum = (num) => {
  let changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]; //changeNum[0] = "零"
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum =
        (i == 0 && strArr[i] == 0
          ? ""
          : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
          ? ""
          : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) +
        newNum;
    }
    return newNum;
  };
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) noWan = "0" + noWan;
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
};

export default {
  name: "SyntheticSystem",
  components: {
    DhPlay2,
    DhPlay1,
    DhLoading,
    DhSelectMaterial,
    DhComposeAnimate,
    DhEmpty,
    Loading,
  },
  data() {
    return {
      loading: true,
      dialogVisible: false,
      templateInfo: {}, //合成模版信息
      playOptions: [],
      currentPlay: 0, //默认显示哪种玩法(0,1,2)
      noticeArr: [
        "恭喜藏家张***，成功合成了C款三人坐姿奏乐组（静态）！！",
        "testtest！",
      ],

      commodity: {}, //当前选中的合成目标信息
      currentMaterial: {}, //当前操作的材料
      createCommodity: {}, //合成成功后的信息
    };
  },
  async created() {
    this.loading = true;
    this.activeKey = this.$route.params.activeKey;
    if (this.activeKey) {
      await this.getPlayDetail();
      if (this.playOptions && this.playOptions.length > 0) {
        this.$nextTick(() => {
          this.createPlaySwiper();
        });
      }
    }
  },

  mounted() {
    this.$bus.$on(
      "materialListen",
      async ({ material, commodity, isFinish }) => {
        //来自材料组件
        if (!isFinish) {
          setTimeout(() => {
            this.dialogVisible = true;
          }, 300);

          window.open(
            `/market?key=${material.name}&id=${material.id}&type=${material.typeMarket}`
          );
          return;
        }
        this.commodity = commodity;
        this.currentMaterial = material;

        const playInfo = this.playOptions[this.currentPlay];

        const amount = commodity.amount;
        const userSelect = commodity.commodityList.filter(
          (item) => item.userSelect && item.userSelect.length > 0
        );
        if (material.amountCurrent > material.amountNeed) {
          //选择框

          if (
            amount == 0 ||
            userSelect.length < amount ||
            (material.userSelect && material.userSelect.length > 0)
          ) {
            this.$refs.refDhSelectMaterial.show(material, playInfo);
          } else {
            this.$message.warning("已选齐材料，可以合成了");
          }
        } else if (material.amountCurrent == material.amountNeed) {
          //刚好满足条件，
          if (amount > 0) {
            if (
              userSelect.length < amount ||
              (material.userSelect && material.userSelect.length > 0)
            ) {
              this.$refs.refDhSelectMaterial.show(material, playInfo);
            } else {
              this.$message.warning("已选齐材料，可以合成了");
            }
          } else {
            if (playInfo.list.length > 1) {
              this.getUserMaterial([material.id], material.amountNeed);
            }
          }
        }
      }
    );
  },
  beforeDestroy() {
    this.$bus.$off("materialListen");
  },
  computed: {
    description() {
      return this.templateInfo.description
        ? this.templateInfo.description.replace(/\n/gi, "<br>")
        : "";
    },
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    onUpListInfo() {
      this.dialogVisible = false;
      this.getPlayDetail();
    },

    showSelectMaterial(material, btnTxt) {
      //需要当前材料信息
      this.$refs.refDhSelectMaterial.show(material, btnTxt);
    },
    upList({ newList, idx }) {
      this.playOptions[idx].list = newList;
    },
    async getUserMaterial(id_arr, size) {
      const res = await this.$api.$service.treasureSku_listMaterial({
        commodityIdList: id_arr,
        pageCount: 1,
        pageSize: size,
      });
      if (res.code == 200) {
        this.toCompose(res.data.records);
      } else {
        this.$message.error(res.message);
      }
    },
    async getPlayDetail() {
      const res = await this.$api.$service.activityTemplate_detail({
        key: this.activeKey,
      });
      this.loading = false;
      if (res.code == 200) {
        const {
          banner,
          dataJson,
          description,
          keyBackground,
          ipDescription,
          synthesisList,
          bannerAdapter,
        } = res.data;
        if (!(synthesisList && synthesisList.length > 0)) {
          this.$message.warning("尚未配置玩法");
          return;
        }
        const playInfo = this.groupPage(synthesisList, "page");
        console.log(playInfo);

        this.playOptions = playInfo;

        this.templateInfo = {
          banner,
          bannerAdapter,
          description,
          keyBackground,
          ipDescription,
        };
        try {
          this.templateInfo.dataJson = dataJson ? JSON.parse(dataJson) : {};
        } catch (e) {}
        //         , //内容区背景图
        const themeConfig = {
          themeBgColor: "#2B3358", //模版背景色
          baseFontColor: "#2B3358", //默认字体颜色【材料信息，合成物信息，】

          btnBorderColor: "#2B3358", //边框按钮【边框颜色】（去获得）
          btnBorderFontColor: "#2B3358", //边框字色

          btnBgColor: "#2B3358", //有背景色的按钮【背景色】（去选择）
          btnBgFontColor: "#fff", //【字色】

          btnSelectedBgColor:
            "linear-gradient(270deg, #94AEFF 0%, #F0D5FF 100%)", //特殊背景色按钮【背景色】（已选择）
          btnSelectedFontColor: "rgba(33, 40, 61, 1)", //【字色】

          activeTxtColor: "#fff", //活动须知文字色

          tabColor: "#2B3358", //玩法tab文字色
          iconDirectionColor: "#ecd231", //合成方向icon颜色

          iconCollectionColor: "#D6DEFF", //右侧我的藏品【字色｜icon色】
          collectionBgColor: "#475598", //右侧我的藏品【背景色】

          materialSelectColor: "#2B3358", //选择材料弹窗【边框颜色｜选择icon颜色|手机端已选择背景色】
          materialCloseColor: "#2B3358", //选择材料弹窗关闭icon【icon颜色】
          animateContentBgcolor: "#fff",
        };
        if (JSON.stringify(this.templateInfo.dataJson) == "{}") {
          this.templateInfo.dataJson = themeConfig;
        }
        writeThemeStyle({
          ...this.templateInfo.dataJson,
          contentBgImg: keyBackground,
        });
      } else {
        this.$message.error(res.message);
      }
    },
    groupPage(ary, key) {
      if (
        ary &&
        Object.prototype.toString.call(ary) == "[object Array]" &&
        ary.length > 0
      ) {
        var res = [];
        ary.sort((a, b) => a[key] - b[key]);
        for (var i = 0; i < ary.length; ) {
          var count = 0;
          let list = [];
          for (var j = i; j < ary.length; j++) {
            if (ary[i][key] == ary[j][key]) {
              list.push(ary[j]);
              count++;
            }
          }
          res.push({
            page: ary[i].page,
            count,
            list,
            name: `玩法${ary[i].page ? toChinesNum(ary[i].page) : ""}`,
            key: ary[i].playsKey,
          });

          i += count;
        }
        if (res.length == 1) {
          res[0].name = "合成玩法";
        }
        return res;
      }
      return [];
    },
    compose(userMaterialList) {
      //来自选择框
      //需要选择完成才能合成
      const playInfo = this.playOptions[this.currentPlay];
      if (playInfo.list.length > 1) {
        //多个合成=》直接合成
        this.toCompose(userMaterialList);
      } else {
        const data = JSON.parse(JSON.stringify(this.playOptions));
        const idx = data[this.currentPlay].list[0].commodityList.findIndex(
          (item) => item.id == this.currentMaterial.id
        );
        if (idx != -1) {
          data[this.currentPlay].list[0].commodityList[idx].userSelect =
            userMaterialList;
          const amount = data[this.currentPlay].list[0].amount;
          const userSelect = data[
            this.currentPlay
          ].list[0].commodityList.filter(
            (item) => item.userSelect && item.userSelect.length > 0
          );
          if (amount == userSelect.length) {
            data[this.currentPlay].list[0].commodityList.forEach((item) => {
              //当前拥有并且未选择
              if (
                (item.amountCurrent && item.amountCurrent > 0) ||
                !item.userSelect ||
                item.userSelect.length == 0
              ) {
                item.disabled = true;
              }
            });
          } else {
            data[this.currentPlay].list[0].commodityList.forEach((item) => {
              item.disabled = false;
            });
          }
          this.playOptions = data;
          this.playSwiper.update();
        }
        this.$refs.refDhSelectMaterial.hide();
      }
      return;

      //选完即能合成

      /*    switch (playInfo.key) {
        case "dunhuang-game1":
          this.toCompose(materialList);
          break;
        case "dunhuang-game2":
          //用户获取的材料id
       
          break;
        case "dunhuang-game3":
          this.toCompose(materialList);
          break;
      } */
    },
    async toCompose(materia_arr) {
      //直接合成
      //合成物所需材料，合成物id
      const treasureSkuIdList = materia_arr.map((item) => {
        return item.id;
      });

      const synthesisId = this.commodity.id;

      this.createCompose(treasureSkuIdList, synthesisId);
    },
    async createCompose(treasureSkuIdList, synthesisId) {
      this.$confirm(`确定合成？`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // type: "warning",
      }).then(async () => {
        const start_time = new Date();
        this.$refs.refDhLoading.show();
        const res = await this.$api.$service.treasureSku_synthesis({
          treasureSkuIdList,
          synthesisId,
        });
        this.$refs.refDhSelectMaterial.hide();

        if (res.code == 200) {
          const now_time = new Date();
          const between_time = now_time.getTime() - start_time.getTime();
          const delay = 1.6 * 1000; //s
          const fRes = () => {
            this.createCommodity = res.data;
            this.$refs.refDhLoading.hide();
            this.$refs.refDhCompound.show();
            this.getPlayDetail();
          };
          fRes();
          /*     if (between_time >= delay) {
            fRes();
          } else {
            setTimeout(() => {
              fRes();
            }, delay - between_time);
          } */
        } else {
          this.$refs.refDhLoading.hide();
          this.$message.error(res.message);
        }
      });
    },

    async onChangePlay(info, idx) {
      this.currentPlay = idx;
      if (this.playSwiper) {
        this.playSwiper.slideTo(idx, 200, false);
      } else {
        this.$message.warning("swiper 尚未初始化");
      }
    },
    createNoticeSwiper() {
      new Swiper(".j-notice-swiper", {
        loop: true, // 循环模式选项
        speed: 300,
        autoplay: 5000,
        height: 42,
        direction: "vertical",
        autoplayDisableOnInteraction: false,
        waitForTransition: false,
      });
    },
    createPlaySwiper() {
      const self = this;
      this.playSwiper = new Swiper(".j-page-swiper", {
        autoHeight: true,
        threshold: 50,
        onSlideChangeStart: function (swiper) {
          self.currentPlay = swiper.activeIndex;
        },
      });
      this.playSwiper.slideTo(this.currentPlay, 0, false);
    },
    closeLoadingPop() {
      this.$refs.refDhLoading.hide();
    },
    showLoadingPop() {
      this.$refs.refDhLoading.show();
    },
    closeCompoundPop() {
      this.$refs.refDhCompound.hide();
    },
    showCompoundPop() {
      this.$refs.refDhCompound.show();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/synthetic-system.scss";
.loading-wrap {
  padding-top: 20vh;
}
.form-btns {
  display: flex;
  justify-content: flex-end;
  .v1-btn {
    margin-left: 15px;
  }
}
.dialog-txt-wrap {
  padding: 0 0 30px;
}
.block-des {
  max-width: 950px;
  margin: 0 auto 32px;
  @media screen and (max-width: 540px) {
    margin: 0 auto 0.32rem;
  }
}

.ui-body {
  min-height: 65vh;
  @media screen and (max-width: 540px) {
  }
}
.m-title {
  text-align: center;
  font-size: 16px;
  padding: 63px 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  .txt {
    padding: 0 15px;
  }
  span {
    display: inline-block;
  }
}
.m-content {
  width: 100%;
  padding-bottom: 108px;
  border-radius: 10px;
  .swiper-slide {
    padding: 0 80px;
  }
  @media screen and (max-width: 540px) {
    .swiper-slide {
      padding: 0 0.29rem;
    }
  }
}
.m-banner {
  position: relative;
  top: 0;
  left: 0;
  margin-bottom: 42px;
  .banner {
    min-height: 350px;
    background-position: center;
    background-size: auto 100%;
    background-repeat: no-repeat;
  }
  .banner-phone {
    display: none;
  }
  @media screen and (max-width: 540px) {
    margin: 0 0 0.42rem;
    .banner {
      display: none;
    }
    .banner-phone {
      display: block;
      width: 100%;
    }
  }
}

.m-tab-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto 0;
  user-select: none;
  .tab {
    flex: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 0;
    border-radius: 10px;
    border: 1px solid rgba(151, 151, 151, 0.3);
    background: rgba(255, 255, 255, 1);
    opacity: 0.7;
    .tab-icon {
      margin-right: 10px;
      transition: all ease-out 0.16s;
      font-size: 22px;
    }
    .txt {
      text-align: center;
      font-size: 24px;
    }
  }
  .selected {
    background: rgba(255, 255, 255, 1);
    border-color: #fff;
    opacity: 1;
  }
  @media screen and (max-width: 540px) {
    margin-bottom: 0.2rem;
    .tab {
      padding: 0.18rem 0;
      border-radius: 0.1rem;
      .icon {
        width: 0.21rem;
        height: 0.24rem;
        margin-right: 0.03rem;
      }
      .txt {
        text-align: center;
        font-size: 0.24rem;
      }
    }
  }
}

.ui-activity-instructions {
  font-size: 12px;
  font-weight: normal;
  line-height: 2.4;
  padding: 0 40px 200px;
  @media screen and (max-width: 540px) {
    padding: 0 0 100px;
  }
}
.m-collection {
  width: 100px;
  height: 100px;

  border-radius: 6px 0px 0px 6px;
  position: fixed;
  top: 60vh;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  z-index: 99;
  user-select: none;
  .icon-collection {
    margin-bottom: 8px;
    font-size: 30px;
  }
}
@media screen and (max-width: 540px) {
  .m-collection {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 0.12rem 0 0 0.12rem;
    top: 46vh;
    font-size: 0.2rem;
    .icon-collection {
      font-size: 0.4rem;
      margin-bottom: 0.08rem;
    }
  }
}
</style>
