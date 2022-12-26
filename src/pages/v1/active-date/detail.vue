<template>
  <div
    class="body"
    :style="`background-image:url(${
      $common.isMobile()
        ? styleJson.collectionBg_img_mobile
        : styleJson.collectionBg_img_pc
    })`"
  >
    <m-head title="活动日历"></m-head>
    <status-template
      :list="dataObj"
      api="/activity/api/activityCalendar/detail"
      :init="init"
    >
      <div class="max-width">
        <section class="ui-banner">
          <picture class="goods-img-wrap">
            <source
              class="responsive-img"
              :srcset="styleJson.collection_img_mobile"
              media="(max-width: 540px)"
            />

            <img
              class="responsive-img"
              :srcset="styleJson.collection_img_pc"
              alt="pic"
            />
          </picture>
          <!--      <picture class="goods-img-bg-wrap">
          <source
            class="responsive-img"
            :srcset="styleJson.collectionBg_img_mobile"
            media="(max-width: 540px)"
          />

          <img
            class="responsive-img"
            :srcset="styleJson.collectionBg_img_pc"
            alt="pic"
          />
        </picture> -->
        </section>
        <section class="list-block">
          <div class="active-info-wrap">
            <div class="info-title">
              <div class="block" v-if="actKey">
                <div class="txt">
                  {{ dataObj.commodity && dataObj.commodity.name }}
                </div>
                <div>
                  <div
                    class="user-status user-status-3"
                    v-if="dataObj.userCalendarStatus == 1"
                  >
                    未报名
                  </div>
                  <div
                    class="user-status user-status-3"
                    v-if="dataObj.userCalendarStatus == 2"
                  >
                    已报名
                  </div>
                  <div
                    class="user-status user-status-2"
                    v-if="dataObj.userCalendarStatus == 3"
                  >
                    中签
                  </div>
                  <div
                    class="user-status user-status-1"
                    v-if="dataObj.userCalendarStatus == 4"
                  >
                    未中签
                  </div>
                  <div
                    class="user-status user-status-3"
                    v-if="dataObj.userCalendarStatus == 5"
                  >
                    未开签
                  </div>
                </div>
              </div>
              <div class="block j-phone-hide">
                <g-share :qq-path="qqPath"></g-share>
              </div>
            </div>
            <div class="line-info">
              <div
                class="face"
                :style="`background-image:url(${
                  dataObj.commodity && dataObj.commodity.photo
                })`"
              ></div>
              <div class="key">首发方：</div>
              <div class="val">
                {{ dataObj.commodity && dataObj.commodity.authorName }}
              </div>
            </div>
            <div class="line-bar">
              <div class="money" v-if="dataObj.commodity">
                {{
                  $common.formatMoney(
                    dataObj.commodity.price ? dataObj.commodity.price / 100 : 0
                  )
                }}
              </div>
              <div class="num">
                限量{{ dataObj.amount ? `${dataObj.amount}份` : "" }}
              </div>
            </div>
            <div class="time-wrap">
              <div class="left">
                <div
                  class="time-block"
                  :class="{ 'block-one': !isShowBuyTime }"
                >
                  <div class="time-bar">
                    <div class="key">抽签报名时间：</div>
                    <div class="val">
                      {{ dataObj.signStartTime }} - {{ dataObj.signEndTime }}
                    </div>
                  </div>
                  <div class="time-bar" v-if="isShowBuyTime">
                    <div class="key">优先购买时间：</div>
                    <div class="val">
                      {{ dataObj.startPriorityTime }} -
                      {{ dataObj.endPriorityTime }}
                    </div>
                  </div>
                </div>
                <div class="ui-btn-wrap" v-if="actKey">
                  <div class="ui-btn ui-btn-disabled" v-if="_sign == 1">
                    已报名
                  </div>
                  <div class="ui-btn ui-btn-disabled" v-if="_sign == 3">
                    报名
                  </div>
                  <div
                    class="ui-btn ui-btn-red"
                    v-if="_sign == 4"
                    @click="goSign"
                  >
                    报名
                  </div>
                </div>
              </div>
              <div class="line"></div>
              <div class="right">
                <div class="time-block">
                  <div class="time-bar">
                    <div class="key">正式购买时间：</div>
                    <div class="val">
                      {{ dataObj.startBuyTime }} -
                      {{ dataObj.endBuyTime }}
                    </div>
                  </div>
                  <div class="time-bar">
                    <div class="key">{{ dataObj.saleTimeStr }}：</div>
                    <div class="val">
                      {{ dataObj.blindBoxOpenTime?dataObj.blindBoxOpenTime:'-' }}
                    </div>
                  </div>
                </div>
                <div class="ui-btn-wrap">
                  <div
                    class="ui-btn ui-btn-red"
                    v-if="buyStatus"
                    @click="goBuy"
                  >
                    购买
                  </div>
                  <div class="ui-btn ui-btn-disabled" v-else>购买</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="list-block">
          <img
            class="pc-list"
            :src="item.value"
            v-for="(item, idx) in styleJson.saleImgPcList"
            :key="idx"
          />
          <img
            class="phone-list"
            :src="item.value"
            v-for="(item, idx) in styleJson.saleImgMobileList"
            :key="idx"
          />
        </section>
      </div>
    </status-template>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      signStatus: false,
      dataList: null,
      href: window.location.href,
      key: null,
      dataObj: {},
      actKey: "",
      qqPath: "",
      styleJson: {},
      signed: false,
    };
  },
  async created() {
    this.uuid = this.$route.params.key;
    this.init();
  },
  mounted() {},
  computed: {
    isShowBuyTime() {
      return this.dataObj.startPriorityTime && this.dataObj.endPriorityTime;
    },
    userInfo() {
      return this.$store.state.user_info;
    },
    buyStatus() {
      if (this.dataObj.endBuyTime) {
        const startTime = new Date(
          this.dataObj.startBuyTime.replace(/-/gi, "/")
        ).getTime();
        const endTime = new Date(
          this.dataObj.endBuyTime.replace(/-/gi, "/")
        ).getTime();
        const nowTime = new Date().getTime();
        if (nowTime < endTime && nowTime > startTime) {
          if (this.dataObj.commodity && this.dataObj.commodity.saleRecordUuid) {
            return true;
          } else {
            return false;
          }
        } else {
          //过时
          return false;
        }
      } else {
        //不能购买
        return false;
      }
    },
    _sign() {
      if (this.signStatus) {
        return 1;
      }
      if (this.signed) {
        //报名了
        return 1;
      } else {
        //没报名
        if (this.dataObj.signEndTime) {
          const startTime = new Date(
            this.dataObj.signStartTime.replace(/-/gi, "/")
          ).getTime();
          const endTime = new Date(
            this.dataObj.signEndTime.replace(/-/gi, "/")
          ).getTime();
          const nowTime = new Date().getTime();
          if (nowTime < endTime && nowTime > startTime) {
            //可报名
            return 4;
          } else {
            //过时
            return 3;
          }
        } else {
          //没报名&&过时
          return 3;
        }
      }
    },
  },

  methods: {
    goLogin() {
      this.$router.push("/login");
    },
    init() {
      this.getDetail();
    },
    goBuy() {
      this.$router.push(`/goods/${this.dataObj.commodity.saleRecordUuid}`);
    },
    async getDetail() {
      const res = await this.$api.service.activityCalendar_detail({
        uuid: this.uuid,
      });
      if (res.data.code == 200) {
        this.dataObj = res.data.data;
        this.actKey = this.dataObj.activityConfigKey;
        this.styleJson = res.data.data.styleJson
          ? JSON.parse(res.data.data.styleJson)
          : {};
        console.log(this.styleJson);
        if (this.actKey) {
          this.getUserSignStatus();
          this.getActivityDetail();
        }

        this.qqPath = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(
          window.location.href
        )}&sharesource=qzone&title=活动日历&pics=${
          this.styleJson.collection_img_mobile
        }&summary=${this.dataObj.commodity.name}&desc=${
          this.dataObj.commodity.name
        }`;
      } else {
        this.$message.error(res.data.message);
      }
    },
    // 查看是否已报名
    async getUserSignStatus() {
      if (this.userInfo.userUuid) {
        await this.$api.service
          .activity_getResult({ actKey: this.actKey })
          .then((res) => {
            if (res.data.code == 200 && res.data.data) {
              this.signStatus = res.data.data;
            }
          });
      }
    },
    // 报名
    async onSign() {
      if (this.signStatus) {
        this.$message.warning("您已报名！");
        return;
      }
      this.sign();
    },
    async sign() {
      await this.$api.service
        .activity_signUp({ actKey: this.actKey })
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.getUserSignStatus();
            this.$message.success("报名成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 校验是否为活动有效期
    async activityValid() {
      // 活动是否有效
      await this.$api.service
        .activity_valid({ actKey: this.actKey })
        .then((res) => {
          if (res.data.data.status == 1) {
            // 有效
          } else if (res.data.data.status == 2) {
            // 活动未开始
            this.$message.error("活动未开始，请耐心等待！");
          } else if (res.data.data.status == 3) {
            // 活动已结束
            this.$message.error("活动已结束！");
          }
        });
    },
    // 获取活动详情
    async getActivityDetail() {
      const res = await this.$api.service.activity_getResultV2({
        actKey: this.actKey,
      });
      if (res.data.code == 200 && res.data.data) {
        this.signed = res.data.data;
      } else {
        console.log("抽签活动已停用！");
      }
    },
    goSign() {
      this.onSign();
    },
  },
};
</script>
<style lang="scss" scoped>
.body {
  padding-bottom: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
}
.pc-list {
  display: block;
  width: 100%;
  margin-top: 30px;
}
.phone-list {
  display: none;
}
.ui-banner {
  position: relative;
  top: 0;
  left: 0;
  margin-bottom: 38px;
}
.goods-img-wrap {
  max-width: 600px;
  width: 100%;
  margin: 30px auto 80px;
}
.goods-img-bg-wrap {
  width: 100%;
}
.max-width {
  max-width: 1100px;
  margin: 0 auto;
}

.pointer {
  cursor: pointer;
}
.user-status {
  border-radius: 12px 0px 12px 0px;
  padding: 2px 8px;
  display: inline-block;
}
.user-status-1 {
  background: #bbbbbb;
  color: #feffff;
}
.user-status-2 {
  background: #2fba8e;
  color: #feffff;
}
.user-status-3 {
  background: #ff952f;
  color: #feffff;
}
.active-info-wrap {
  background: #fff;
  box-shadow: 0px 6px 30px 0px rgba(204, 204, 204, 0.44),
    inset 0px -3px 8px 0px rgba(255, 255, 255, 0.82);
  border-radius: 4px;
  padding: 0.32rem;
  margin: 0.32rem 0;
  .info-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    .block {
      display: flex;
      align-items: center;
      .txt {
        margin-right: 16px;
        font-size: 18px;
        font-weight: bold;
        color: #333333;
      }
    }
  }
  .line-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .face {
      width: 22px;
      height: 22px;
      border: 1px solid #949495;
      display: inline-block;
      border-radius: 100px;
      margin-right: 4px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    .key {
      font-size: 12px;
      color: #949495;
    }
    .val {
      font-size: 12px;
      color: #333333;
    }
  }
  .line-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    .money {
      font-size: 20px;
      font-weight: bold;
      color: #f4a33a;
    }
    .num {
      font-size: 12px;
      font-weight: bold;
      color: #333333;
    }
  }
  .time-wrap {
    display: flex;
    border-top: 1px dashed #dddddd;
    padding-top: 28px;
    > div {
      flex: 1;
      display: flex;
    }
    .ui-btn-wrap {
      display: flex;
      align-items: center;
    }
    .line {
      width: 2px;
      border-right: 1px dashed #dddddd;

      flex: inherit;
      margin: 0 36px;
    }
    .time-block {
      flex: 1;
      .time-bar {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .key {
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          word-break: keep-all;
        }
        .val {
          font-size: 12px;
          color: #333333;
          word-break: keep-all;
        }
      }
    }
    .block-one {
      display: flex;
      align-items: center;
      .time-bar {
        margin-bottom: 0;
      }
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    .info-title {
      .block {
        display: block;
        align-items: center;
        .txt {
          margin-bottom: 0.16rem;
          margin-right: 0;
          font-size: 18px;
          font-weight: bold;
          color: #333333;
        }
      }
      margin-bottom: 0.3rem;
    }
    .time-wrap {
      display: block;
      > div {
        flex: inherit;
        display: block;
      }
      .line {
        width: 100%;
        border-right: none;
        border-bottom: 1px dashed #dddddd;

        flex: inherit;
        margin: 0.36rem 0;
      }
      .ui-btn {
        width: 100%;
        line-height: 0.9rem;
        border-radius: 100px;
      }
      .time-block {
        flex: 1;

        .time-bar {
          display: flex;
          margin-bottom: 12px;
          .key {
            font-size: 14px;
            font-weight: bold;
            color: #333333;
          }
          .val {
            font-size: 12px;
            color: #333333;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .list-block {
    padding: 0 0.32rem;
  }
  .j-phone-hide {
    display: none !important;
  }
  .pc-list {
    display: none;
  }
  .phone-list {
    display: block;
    width: 100%;
    margin-top: 0.32rem;
  }
}

// -----------------------------------------------------------
</style>
