<template>
  <div>
    <m-head :title="`活动日历`" />

    <div class="ui-banner">
      <picture>
        <source
          srcset="//static.theone.art/pc/active-date/active-banner-220*752.png"
          media="(max-width: 540px)"
        />

        <img
          class="banner responsive-img"
          srcset="//static.theone.art/pc/active-date/active-banner.png"
          alt="pic"
        />
      </picture>
    </div>
    <status-template
      :list="list"
      api="/activity/api/activityCalendar/page"
      :init="init"
    >
      <div class="active-date-main">
        <div class="nav-wrap">
          <div class="bar">发售日历<span></span></div>
        </div>
        <div class="active-date-list-wrap">
          <div
            class="active-box"
            @click="seeDetail(1, item)"
            v-for="(item, idx) in list"
            :key="idx"
          >
            <div class="active-bar">
              <div class="a-title">
                <div class="left">
                  <span
                    class="active-status active-status-2"
                    v-if="item.activityStatus == 1"
                  >
                    等待抽签
                  </span>
                  <span
                    class="active-status active-status-1"
                    v-if="item.activityStatus == 2"
                  >
                    抽签报名中
                  </span>
                  <span
                    class="active-status active-status-2"
                    v-if="item.activityStatus == 3"
                  >
                    等待正式购买
                  </span>
                  <span
                    class="active-status active-status-1"
                    v-if="item.activityStatus == 4"
                  >
                    正式购买中
                  </span>
                  <span
                    class="active-status active-status-2"
                    v-if="item.activityStatus == 5"
                  >
                    等待开启盲盒
                  </span>
                  <span
                    class="active-status active-status-1"
                    v-if="item.activityStatus == 6"
                  >
                    盲盒可开启
                  </span>
                </div>
                <div class="right">
                  <div
                    class="user-status user-status-3"
                    v-if="item.userCalendarStatus == 1"
                  >
                    未报名
                  </div>
                  <div
                    class="user-status user-status-3"
                    v-if="item.userCalendarStatus == 2"
                  >
                    已报名
                  </div>
                  <div
                    class="user-status user-status-2"
                    v-if="item.userCalendarStatus == 3"
                  >
                    中签
                  </div>
                  <div
                    class="user-status user-status-1"
                    v-if="item.userCalendarStatus == 4"
                  >
                    未中签
                  </div>
                  <div
                    class="user-status user-status-3"
                    v-if="item.userCalendarStatus == 5"
                  >
                    未开签
                  </div>
                </div>
              </div>
              <div
                class="img-view"
                v-lazy:background-image="
                  item.imgInfo && item.imgInfo.collection_img_pc
                "
              >
                <div v-if="item.prioritySaleRecordUuid">
                  <img
                    src="//static.theone.art/pc/active-date/icon-buy-waiting.png"
                    class="privilege"
                    v-if="item.priorityStatus == 'WAIT_BUY'"
                  />
                  <img
                    @click.stop="goBuy(item)"
                    v-if="item.priorityStatus == 'BUYING'"
                    src="//static.theone.art/pc/active-date/icon-buying.png"
                    class="privilege hand"
                  />
                </div>
              </div>
              <div class="name hidden-1">
                {{ item.commodity && item.commodity.name }}
              </div>
              <div class="info-wrap">
                <div>
                  <div
                    class="face-img"
                    :style="`background-image:url(${
                      item.commodity && item.commodity.photo
                    })`"
                  ></div>
                </div>

                <div class="key">首发方：</div>
                <div class="val hidden-1">
                  {{ item.commodity && item.commodity.authorName }}
                </div>
              </div>
              <div class="line-bar">
                <div class="money">
                  {{
                    $common.formatMoney(
                      item.commodity && item.commodity.price
                        ? item.commodity.price / 100
                        : 0
                    )
                  }}
                </div>
                <div class="num">
                  限量{{ item.amount ? `${item.amount}份` : "" }}
                </div>
              </div>
              <div class="message">
                <swiper :list="createTime(item)"></swiper>
              </div>
              <div class="see-btn hand" @click.stop="seeDetail(2, item)">
                查看详情>
              </div>
            </div>
          </div>
        </div>
      </div>
    </status-template>
    <div class="g-paging-wrap">
      <g-paging
        :pageChange="handleCurrentChange"
        :list="listDataInfo.records"
        :pageSize="listParams.pageSize"
        :current-page="listDataInfo.current"
        :pages="listDataInfo.pages"
      />
    </div>
  </div>
</template>
<script>
import Swiper from "./components/swiper.vue";
export default {
  components: { Swiper },
  data() {
    return {
      listDataInfo: {},
      listParams: { pageIndex: 1, pageSize: 9, uuid: "" },
      list: [],
    };
  },
  mounted() {},
  created() {
    this.init();
	this.$sensors.track('main_pageview', {
		module_name: "活动日历"
	});
  },
  methods: {
    init() {
      this.list = [];
      this.listParams.pageIndex = 1;
      this.getList();
    },
    async getList() {
      const res = await this.$api.service.activityCalendar_page(
        this.listParams
      );

      if (res.data.code == 200) {
        this.listDataInfo = res.data.data;
        if (res.data.data.records.length > 0) {
          this.list = res.data.data.records.map((item) => {
            try {
              item.imgInfo = item.styleJson ? JSON.parse(item.styleJson) : {};
            } catch {}

            return item;
          });
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    createTime(info) {
      const checkNull = (val) => {
        return val ? val : "";
      };
      let arr = [
        {
          isShow: true,
          key: "正式购买时间",
          val: `${checkNull(info.startBuyTime)}-${checkNull(info.endBuyTime)}`,
        },
        {
          isShow: true,
          key: info.saleTimeStr,
          val: checkNull(info.blindBoxOpenTime) || "-",
        },
        {
          key: "优先购时间",
          isShow: info.startPriorityTime && info.endPriorityTime,
          val: `${checkNull(info.startPriorityTime)}-${checkNull(
            info.endPriorityTime
          )}`,
        },
        {
          isShow: true,
          key: "抽签时间",
          val: `${checkNull(info.signStartTime)}-${checkNull(
            info.signEndTime
          )}`,
        },
      ];
      return arr.filter((item) => item.isShow);
    },
    goBuy(info) {
      if (!info.prioritySaleRecordUuid) {
        this.$message.warning("缺少参数");
        return;
      }
      this.$router.push(`/goods/${info.prioritySaleRecordUuid}`);
    },
    seeDetail(type, info) {
		this.$sensors.track('activitydetail_click');
      /*     if (!info.activityConfigKey) {
        this.$message.warning("缺少活动key");
        return;
      } */

      if (this.$common.isMobile()) {
        this.$router.push(`active_date/detail/${info.uuid}`);
      } else {
        if (type == 2) {
          this.$router.push(`active_date/detail/${info.uuid}`);
        }
      }
    },
    handleCurrentChange(val) {
      this.listParams.pageIndex = val;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.g-paging-wrap {
  padding: 41px 0 52px;
  display: flex;
  justify-content: center;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding-bottom: 1.8rem;
  }
}
.ui-banner {
  img {
    display: block;
    width: 100%;
  }
}
.active-status {
  line-height: 32px;
  height: 32px;
  border-radius: 6px;
  position: relative;
  top: 0;
  left: 0;
  display: inline-block;
}
.active-status-1 {
  background: #e8f9f1;
  padding: 0 14px 0 10px;
  color: rgba(47, 186, 142, 1);
  &::after {
    display: block;
    content: "";
    position: absolute;
    right: -20px;
    top: 0;
    height: 32px;
    width: 30px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("//static.theone.art/pc/active-date/icon-blue-right.png");
  }
}
.active-status-2 {
  background: rgba(255, 234, 208, 1);
  padding: 0 14px 0 10px;
  color: #ff952f;
  &::after {
    display: block;
    content: "";
    position: absolute;
    right: -20px;
    top: 0;
    height: 32px;
    width: 30px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("//static.theone.art/pc/active-date/icon-yellow-right.png");
  }
}
.user-status {
  border-radius: 12px 0px 12px 0px;
  padding: 2px 8px;
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

.nav-wrap {
  display: flex;
  padding: 30px 0;
  .bar {
    position: relative;
    top: 0;
    left: 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #e61f1a;
    padding: 6px 0;
    span {
      display: block;
      width: 60%;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 2px;
      background: #e61f1a;
      border-radius: 2px;
    }
  }
}
.active-date-main {
  max-width: 1150px;
  margin: 0 auto 100px;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding: 0 0.32rem;
  }
}
.active-date-list-wrap {
  display: flex;
  margin: -12px;
  flex-wrap: wrap;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    margin: -0.32rem;
  }
}
.active-box {
  width: 33.3%;
  padding: 12px;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 100%;
    padding: 0.32rem;
  }
}
.active-bar {
  background: #fff;
  box-shadow: 0px 6px 30px 0px rgba(204, 204, 204, 0.44),
    inset 0px -6px 15px 0px #ffffff,
    inset 0px -3px 8px 0px rgba(255, 255, 255, 0.82);
  border-radius: 4px;
  padding: 16px;
  .a-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      height: 30px;
    }
  }
  .img-view {
    position: relative;
    top: 0;
    left: 0;
    padding-bottom: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin: 10px 0;
    .privilege {
      position: absolute;
      bottom: 16px;
      right: 16px;
      width: 122px;
    }
  }
  .name {
    font-size: 14px;
    color: #333333;
    margin-bottom: 8px;
  }
  .info-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    overflow: hidden;
    .face-img {
      width: 22px;
      height: 22px;
      border: 1px solid #949495;
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
    margin-bottom: 16px;
    .money {
      font-size: 16px;
      font-weight: bold;
      color: #f4a33a;
    }
    .num {
      font-size: 12px;
      color: #949495;
    }
  }
  .message {
    background: #f6f6f6;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    color: #333333;
    padding: 0px 11px;
  }
  .see-btn {
    line-height: 36px;
    background: #f6f6f6;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    color: #333333;
    margin-top: 12px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding: 0.32rem;
    .see-btn {
      display: none;
    }
  }
}
</style>
