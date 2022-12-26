<template>
  <div class="ui-body">
    <div class="m-banner">
      <picture>
        <source
          media="(max-width: 540px)"
          srcset="
            https://static.theone.art/pc/looking-for-luck/m-banner.png
          "
        />
        <img
          class="responsive-img"
          src="//static.theone.art/pc/DunHuang/laoshijie.png"
          alt="banenr"
        />
      </picture>

      <!--       <div class="m-notice">
        <div class="content">
          <div class="swiper-container swiper j-notice-swiper">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(item, idx) in noticeArr"
                :key="idx"
              >
                <div class="txt">{{ item }}</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <page-template ref="PageT" :is_empty="!(list && list.length > 0)">
      <dh-play-2
        class="j-page2"
        @listen="createCompose"
        :list="list"
        @upList="upList"
        @upListInfo="getPlayInfo"
      ></dh-play-2>
    </page-template>

    <!--     <dh-title>活动须知</dh-title>
    <div class="ui-activity-instructions content-w">
      <p>5.5商品的合成</p>
      <p>
        介绍：针对敦煌合成的需求设计的功能，本次敦煌活动有三种3种玩法。为了拓展，我们需要灵活调配合成玩法。功能点：1、合成商品和合成材料均先入库。2、以uuid确定商品。3、合成商品后，形成的编号，按照合成时间先后对应编号大小顺序发放，eg：合成越早，编号越小。4、合成商品不可撤回。5、合成商品后，合成材料消失。
      </p>
      <p>6、用户所需材料如果有编号可以自行选择材料编号进行合成。</p>
      <p>
        7、支持一条件对一合成，多条件对一合成，不迟支持一/多条件对多商品合成。
      </p>
      <p>5.5.1合成商品 合成后的商品。 5.5.2合成材料 合成商品所需要的材料。</p>
      <p>5.5.3合成条件 每一个uuid和数量组成一个条件。 5.5.3合成逻辑</p>
      <p>1、确定合成商品的标题。</p>
      <p>
        2、确定合成商品所需要的合成条件，既合成材料是什么（uuid和数量组成一个条件，每一个商品可以有多个合成条件存在）
      </p>
    </div> -->
    <div class="m-collection" @click="goCollection">
      <div class="icon-collection" />
      我的藏品
    </div>
    <dh-loading ref="refDhLoading"></dh-loading>
    <!--     <dh-select-material
      ref="refDhSelectMaterial"
      @listen="toCompose"
    
    ></dh-select-material> -->

    <dh-compound ref="refDhCompound" :commodity="createCommodity"></dh-compound>
    <!--     <el-dialog
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
    </el-dialog> -->
    <dh-compose-animate></dh-compose-animate>
  </div>
</template>
<script>
import DhPlay2 from "./component/dh-play-2.vue";
import Swiper from "swiper";
import DhLoading from "./component/dh-loading.vue";
import DhComposeAnimate from './component/dh-compose-animate.vue';
import DhCompound from "./component/dh-compound.vue";
export default {
  name: "dunhuang",
  components: {
    DhPlay2,
    DhLoading,
    DhCompound,
    DhComposeAnimate
  },
  data() {
    return {
      dialogVisible: false,
      list: [], //合成数据
      currentPlay: 1, //默认显示哪种玩法(0,1,2)
      noticeArr: [
        "恭喜藏家张***，成功合成了C款三人坐姿奏乐组（静态）！！",
        "testtest！",
      ],
      oBanner: {},
      createCommodity: {}, //合成成功后的信息
    };
  },
  created() {
    this.getPlayInfo();
    /*    this.$nextTick(() => {
      this.createNoticeSwiper();
    }); */
  },
  mounted() {},
  methods: {
    upList(newList) {
      this.list = newList;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    onUpListInfo() {
      this.getPlayInfo();
    },
    async getPlayInfo() {
      this.$nextTick(() => {
        this.$refs.PageT.showLoading();
      });
      const playRes = await this.$api.$service.synthesis_list({
        playsKey: "looking-for-luck",
      });
      this.$refs.PageT.hideLoading();
      if (playRes.code == 200) {
        this.list = playRes.data;
      } else {
        this.$message.error(playRes.message);
      }
    },

    async createCompose(treasureSkuIdList, synthesisId) {
    /*   if (treasureSkuIdList.length <= 0) {
        this.$message.warning("请选择材料");
        return;
      } */
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
          if (between_time >= delay) {
            fRes();
          } else {
            setTimeout(() => {
              fRes();
            }, delay - between_time);
          }
        } else {
          this.$refs.refDhLoading.hide();
          this.$message.error(res.message);
        }
      });
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
    goCollection() {
      this.$router.push(`/mine/treasure`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/profiteer-pub.scss";
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
  background: url("//static.theone.art/pc/looking-for-luck/bg.png");
}
.m-banner {
  position: relative;
  top: 0;
  left: 0;
  margin-bottom: 60px;
  .banner {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  @media screen and (max-width: 540px) {
  }
}
.m-notice {
  position: absolute;
  bottom: -21px;
  left: 50%;
  transform: translateX(-50%);
  height: 42px;
  overflow: hidden;
  background-size: contain contain;
  padding: 0 10px;
  max-width: 600px;
  width: 100%;

  .content {
    height: 42px;
    background: #fff;
  }
  .txt {
    font-size: 12px;
    color: #f8a00f;
    font-weight: bold;
    line-height: 42px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  @media screen and (max-width: 540px) {
    bottom: -1rem;
  }
}
.m-tab-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 38px;
  user-select: none;

  .tab {
    flex: 1;
    cursor: pointer;
    .icon-modification {
      width: 53px;
      height: 10px;
      margin: 0 auto 23px;
      background: url("//static.theone.art/pc/dunhuang/icon-1.png")
        no-repeat center;
      background-size: contain;
      opacity: 0;
      transition: all ease-out 0.16s;
    }
    .txt {
      text-align: center;
      font-size: 14px;
      color: #d3583f;
      padding-bottom: 14px;
    }
    .bar {
      background: #fff6d9;
      height: 10px;
      display: flex;
      justify-content: center;
      transition: all ease-out 0.16s;
      .icon-triangle {
        transition: all ease-out 0.16s;
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-top: 16px solid #d3583f;
        margin-top: 10px;
        opacity: 0;
      }
    }
  }
  .selected {
    .bar {
      background: #d3583f;
      .icon-triangle {
        opacity: 1;
      }
    }
    .icon-modification {
      opacity: 1;
    }
  }
  @media screen and (max-width: 540px) {
    .tab {
      flex: 1;
      cursor: pointer;
      .icon-modification {
        margin-bottom: 0.12rem;
      }
      .txt {
        text-align: center;
        font-size: 0.24rem;
        color: #d3583f;
        padding-bottom: 0.12rem;
      }
      .bar {
        background: #fff6e7;
        height: 0.08rem;
        .icon-triangle {
          border-left: 0.14rem solid transparent;
          border-right: 0.14rem solid transparent;
          border-top: 0.18rem solid #d3583f;
          margin-top: 0.08rem;
          opacity: 0;
        }
      }
    }
    .selected {
      .bar {
        background: #d3583f;
        .icon-triangle {
          opacity: 1;
        }
      }
    }
  }
}

.ui-activity-instructions {
  font-size: 12px;
  font-weight: normal;
  color: #c55234;
  line-height: 2.4;
  padding-bottom: 200px;
}
.m-collection {
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 6px 0px 0px 6px;
  position: fixed;
  top: 60vh;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99;
  user-select: none;
  font-size: 12px;
  font-weight: 500;
  color: #fab722;
  .icon-collection {
    margin-bottom: 8px;
    width: 30px;
    height: 30px;
    background-size: contain;
    background: url("//static.theone.art/pc/looking-for-luck/icon-collect.png")
      no-repeat center;
  }
}
@media screen and (max-width: 540px) {
  .m-banner {
  }
  .m-collection {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 0.12rem 0 0 0.12rem;
    top: 30vh;
    font-size: 0.2rem;
    .icon-collection {
      width: 0.58rem;
      height: 0.58rem;
      background-size: contain;
    }
  }
}
</style>