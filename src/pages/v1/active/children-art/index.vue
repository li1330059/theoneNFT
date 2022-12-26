<template>
  <div class="ui-body">
    <div class="loading-wrap" v-if="isLoading">
      <loading></loading>
    </div>

    <div
      class="main"
      v-else
      :style="`background-image:url(${dataJson.homeBgImg})`"
    >
      <picture>
        <source
          :srcset="dataJson.homeBannerMobile"
          media="(max-width: 540px)"
        />

        <img
          class="banner responsive-img"
          :srcset="dataJson.homeBannerPc"
          alt="pic"
        />
      </picture>
      <section class="max-width">
        <div class="time-down-wrap">
          <div class="content">
            <img
              v-lazy="
                `//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/1-decorate.png`
              "
              class="left-img"
            />
            <div class="time-wrap">
              <div class="title">
                <!--   <img
                  src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/title-1.png"
                /> -->
                <div class="time-txt">{{ timeTitle }}</div>
                <div class="ui-icon icon-time"></div>
              </div>
              <time-down ref="timeDownRef"></time-down>
            </div>
            <div class="right-block">
              <div class="ui-icon icon-draw hand" @click="goList"></div>
            </div>
          </div>
        </div>
      </section>
      <section class="max-width" v-if="activeRule">
        <div
          class="rule-wrap children-art-rule-bg-color children-art-rule-color"
        >
          <img
            src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/rule-title.png"
            class="title"
          />
          <div v-html="activeRule"></div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import TimeDown from "./components/time-down.vue";
import loading from "@/components/v1/loading/loading";
import createstyle from "./create-style";
export default {
  components: {
    TimeDown,
    loading,
  },
  data() {
    return {
      activeRule: "",
      isLoading: true,
      activeObj: {},
      dataJson: {},
    };
  },
  created() {
    this.active_uuid = this.$route.params.active_uuid;

    this.init();
  },
  mounted() {},
  computed: {
    timeTitle() {
      console.log(this.activeObj);
      if (this.activeObj.statusActivity == 1) {
        return "距离投票开始";
      }
      if (this.activeObj.statusActivity == 2) {
        return "距离投票结束";
      }
      return "距离投票结束";
    },
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
  },
  methods: {
    init() {
      this.isLoading = true;
      this.getActiveDetail();
    },
    async getActiveDetail() {
      this.isLoading = true;
      const res = await createstyle(this, this.active_uuid);
      this.isLoading = false;
      if (res.code == 200) {
        this.activeObj = res.data;
        this.dataJson = res.data.dataJson;
        this.activeRule = this.activeObj.voteRule.replace(/\n/gi, "<br>");
        this.startTime();
      } else {
        this.$message.error(res.message);
      }
    },
    startTime() {
      this.$nextTick(() => {
        this.$refs.timeDownRef.start({
          endTime:
            this.activeObj.statusActivity == 1
              ? this.activeObj.startTime
              : this.activeObj.endTime,
          startTime: this.activeObj.nowDate,
        });
      });
    },
    goList() {
      this.$router.push(`/active/children_art/works/${this.active_uuid}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.ui-body {
  min-height: 100vh;
}
.loading-wrap {
  padding-top: 30vh;
}
.main {
  min-height: 100vh;
  background: #5481c0;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
  padding-bottom: 100px;
  @media screen and (max-width: 540px) {
    padding-bottom: 1.5rem;
  }
}
.max-width {
  max-width: 900px;
  margin: 0 auto;
  @media screen and (max-width: 540px) {
    padding: 0 0.3rem;
  }
}
.rule-wrap {
  margin-top: 75px;
  padding: 55px 30px 24px;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  position: relative;
  top: 0;
  left: 0;
  box-shadow: 0px 0px 6px 0px rgba(105, 145, 206, 0.38);
  border-radius: 10px;
  .title {
    width: 218px;
    position: absolute;
    top: 0;
    transform: translateY(-50%);
    left: -10px;
  }
  @media screen and (max-width: 540px) {
    .title {
      width: 3.2rem;
      left: -0.18rem;
    }
  }
}

.icon-draw {
  width: 126px;
  height: 126px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-37%, -50%);
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-draw.png");
  @media screen and (max-width: 540px) {
    width: 1.52rem;
    height: 1.52rem;
  }
}

.icon-time {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-time.png");
}

.time-down-wrap {
  background: linear-gradient(171deg, #7aade4 0%, #71c3e9 100%);
  box-shadow: 0px 0px 6px 0px rgba(105, 145, 206, 0.38);
  padding: 8px;
  border-radius: 20px;
  .content {
    position: relative;
    top: 0;
    left: 0;
    background: #e2e9f5;
    display: flex;
    .time-wrap {
      flex: 1;
      padding-left: 233px;
      padding-top: 30px;
      padding-bottom: 30px;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 17px;

        .time-txt {
          font-size: 22px;
          font-weight: bold;
          color: #4585e6;
          line-height: 30px;
          background: linear-gradient(270deg, #6aa7ff 0%, #2271e8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .icon-time {
          height: 22px;
          width: 22px;
          margin-left: 7px;
        }
      }
    }

    .left-img {
      display: block;
      width: 153px;
      position: absolute;
      bottom: -22px;
      left: -8px;
    }
    .right-block {
      background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/2-decorate.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 287px;
      margin: -14px -16px;
      position: relative;
      top: 0;
      left: 0;
    }
  }
  @media screen and (max-width: 540px) {
    padding: 0.1rem;
    .content {
      .time-wrap {
        padding-left: 1.77rem;
        padding-top: 0.4rem;
        padding-bottom: 0.34rem;
        .title {
          margin-bottom: 0.19rem;

          .time-txt {
            font-size: 0.32rem;
          }
          .icon-time {
            height: 0.36rem;
            width: 0.36rem;
            margin-left: 0.08rem;
          }
        }
      }

      .left-img {
        width: 1.87rem;
        bottom: -0.26rem;
        left: -0.1rem;
      }
      .right-block {
        width: 2.1rem;
        margin: -0.17rem -0.17rem;
      }
    }
  }
}
</style>
