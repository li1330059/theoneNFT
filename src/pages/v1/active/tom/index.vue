<template>
  <div class="ui-body">
    <div class="m-banner">
      <div
        class="banner"
        :style="`background-image:url('${oBanner.banner}')`"
      ></div>
    </div>
    <div class="content-w">
      <div class="m-content">
        <div class="m-tab-wrap">
          <div
            class="tab"
            v-for="(item, idx) in playOptions"
            :key="idx"
            :class="{ selected: currentPlay == idx }"
            @click="onChangePlay(item, idx)"
          >
            <div class="icon"></div>
            <div class="txt">{{ item.name }}</div>
          </div>
        </div>

        <div class="swiper-container swiper j-page-swiper">
          <div class="swiper-wrapper">
            <div
              class="swiper-slide"
              v-for="(item, idx) in playOptions"
              :key="idx"
            >
              <dh-play-2
                class="j-page2"
                @listen="createCompose"
                :list="item.list"
              ></dh-play-2>
            </div>
          </div>
        </div>
      </div>

      <dh-title>活动须知</dh-title>
      <div class="ui-activity-instructions">
        <div v-html="description"></div>
      </div>
    </div>

    <div class="m-collection" @click="$common.goPage('/mine/treasure')">
      <div class="icon-collection" />
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
        <div class="v1-btn mycenter" @click="dialogVisible = false">未购买</div>
        <div class="v1-btn mycenter red" @click="onUpListInfo">已购买</div>
      </div>
    </el-dialog>
    <dh-compose-animate
      ref="refDhCompound"
      :commodity="createCommodity"
    ></dh-compose-animate>
  </div>
</template>
<script>
import DhPlay1 from "./component/dh-play-1.vue";
import DhPlay2 from "./component/dh-play-2.vue";
import DhPlay3 from "./component/dh-play-3.vue";
import DhTitle from "./component/dh-title.vue";
import Swiper from "swiper";
import DhLoading from "./component/dh-loading.vue";
import DhSelectMaterial from "./component/dh-select-material.vue";
import DhComposeAnimate from "./component/dh-compose-animate.vue";
export default {
  name: "dunhuang",
  components: {
    DhPlay2,
    DhLoading,
    DhTitle,
    DhSelectMaterial,
    DhComposeAnimate,
  },
  data() {
    return {
      dialogVisible: false,
      playOptions: [
        {
          name: "玩法一",
          key: "dunhuang-game2",
          list: [],
        },
        {
          name: "玩法二",
          key: "dunhuang-game2",
          list: [],
        },
        {
          name: "玩法三",
          key: "dunhuang-game2",
          list: [],
        },
      ],
      currentPlay: 1, //默认显示哪种玩法(0,1,2)
      noticeArr: [
        "恭喜藏家张***，成功合成了C款三人坐姿奏乐组（静态）！！",
        "testtest！",
      ],
      oBanner: {
        description: "",
      },
      commodity: {}, //当前选中的合成目标信息
      currentMaterial: {}, //当前操作的材料
      createCommodity: {}, //合成成功后的信息
    };
  },
  created() {
    this.getPlayInfo();
    this.getBannerInfo();
    this.$nextTick(() => {
      this.createPlaySwiper();
      this.createNoticeSwiper();
    });
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

          window.open(`/market?key=${material.name}&id=${material.id}`);
          return;
        }

        this.commodity = commodity;
        this.currentMaterial = material;
        const playInfo = this.playOptions[this.currentPlay];
        if (material.amountCurrent > material.amountNeed) {
          //选择框
          this.$refs.refDhSelectMaterial.show(material, playInfo);
        } else if (material.amountCurrent == material.amountNeed) {
          //刚好满足条件，
          //玩法1直接合成
          //玩法2不做处理，
          //玩法3直接合成
          switch (playInfo.key) {
            case "dunhuang-game1":
              //获取用户详细材料数据
              this.getUserMaterial([material.id], material.amountNeed);
              break;
            case "dunhuang-game2":
              break;

            case "dunhuang-game3":
              this.getUserMaterial([material.id], material.amountNeed);
              break;
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
      return this.oBanner.description.replace(/\n/gi, "<br>") || "";
    },
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    onUpListInfo() {
      this.dialogVisible = false;
      this.getPlayInfo();
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
    async getPlayInfo() {
      const playInfo = this.playOptions[this.currentPlay];
      const playRes = await this.$api.$service.synthesis_list({
        playsKey: playInfo.key,
      });
      if (playRes.code == 200) {
        this.playOptions[this.currentPlay].list = playRes.data;
        setTimeout(() => {
          if (this.playSwiper) {
            this.playSwiper.update();
          }
        }, 100);
      } else {
       // this.$router.push("/404");
        /*   this.$message.error(playRes.message); */
      }
    },
    async getBannerInfo() {
      const res = await this.$api.$service.activityTemplate_detail({
        key: "dunhuang-banner",
      });
      if (res.code == 200) {
        this.oBanner = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    compose(materialList) {
      //来自选择框
      //玩法一直接合成
      //玩法二每次选择一个
      //玩法三一次选完
      const playInfo = this.playOptions[this.currentPlay];

      switch (playInfo.key) {
        case "dunhuang-game1":
          this.toCompose(materialList);
          break;
        case "dunhuang-game2":
          //用户获取的材料id
          const data = JSON.parse(JSON.stringify(this.playOptions));
          const idx = data[this.currentPlay].list[0].commodityList.findIndex(
            (item) => item.id == this.currentMaterial.id
          );
          if (idx != -1) {
            data[this.currentPlay].list[0].commodityList[idx].userSelect =
              materialList[0];
            this.playOptions = data;
            this.playSwiper.update();
          }
          this.$refs.refDhSelectMaterial.hide();
          break;
        case "dunhuang-game3":
          this.toCompose(materialList);
          break;
      }
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
            this.getPlayInfo();
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
        this.getPlayInfo();
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
        threshold: 100,
        onSlideChangeStart: function (swiper) {
          self.currentPlay = swiper.activeIndex;
          self.getPlayInfo();
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
@import "@/assets/1.0/scss/active/tom.scss";
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

.ui-body {
  background: #2b3358;
  @media screen and (max-width: 540px) {
  }
}
.m-content {
  width: 100%;
  background: url("//static.theone.art/pc/tom/bg.png")
    center no-repeat;
  background-size: cover;
  padding-bottom: 108px;
  border-radius: 10px;
  .swiper-slide {
    padding: 0 80px;
  }
  @media screen and (max-width: 540px) {
    .swiper-slide {
      padding: 0;
    }
  }
}
.m-banner {
  position: relative;
  top: 0;
  left: 0;
  margin-bottom: 60px;
  .banner {
    min-height: 350px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  @media screen and (max-width: 540px) {
    margin: 0 0.3rem 1.2rem;
    .banner {
      min-height: 3rem;
    }
  }
}

.m-tab-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto 38px;
  user-select: none;
  .tab {
    flex: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 18px 0;
    .icon {
      width: 21px;
      height: 24px;
      margin-right: 10px;
      background: url("//static.theone.art/pc/tom/icon-box.png")
        no-repeat center;
      background-size: contain;
      transition: all ease-out 0.16s;
    }
    .txt {
      text-align: center;
      font-size: 24px;
      color: $base-font-color;
    }
  }
  .selected {
    background-color: $white;
  }
  @media screen and (max-width: 540px) {
  }
}

.ui-activity-instructions {
  font-size: 12px;
  font-weight: normal;
  color: $white;
  line-height: 2.4;
  padding:0 40px 200px;
}
.m-collection {
  width: 100px;
  height: 100px;
  background: #d3583f;
  border-radius: 6px 0px 0px 6px;
  position: fixed;
  top: 60vh;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #ffebc8;
  cursor: pointer;
  z-index: 99;
  user-select: none;
  .icon-collection {
    margin-bottom: 8px;
    width: 30px;
    height: 30px;

    background: url("//static.theone.art/pc/dunhuang/icon-collection.png")
      no-repeat center;
    background-size: contain;
  }
}
@media screen and (max-width: 540px) {
  .m-banner {
    height: 3.7rem;
    margin-bottom: 0.2rem;
    .banner {
      width: 6.9rem;
      height: 3rem;
      min-height: 3rem;
      margin: 0 auto;
    }
  }

  .m-collection {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 0.12rem 0 0 0.12rem;
    top: 36vh;
    font-size: 0.2rem;
    .icon-collection {
      width: 0.58rem;
      height: 0.58rem;
      background-size: contain;
    }
  }
}
</style>