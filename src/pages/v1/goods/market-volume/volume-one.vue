<template>
  <div class="volume-wrap">
    <m-head v-if="info.onDate" :title="info.onDate + '市场流通量记录'"></m-head>
    <m-head v-else title="市场流通量记录"></m-head>
    <div class="head-wrap">
      <div class="volume-head">
        <div class="cont">
          <div class="img" :style="`background-image:url(${info.cover})`"></div>
          <div class="info">
            <div class="name">{{ info.commodityName }}</div>
            <div class="num">
              总量记录:
              <span v-if="info.addNumber">新增+{{ info.addNumber }}</span>
              <span v-if="info.addNumber && info.minusNumber">，</span>
              <span v-if="info.minusNumber">销毁-{{ info.minusNumber }}</span>
              <span v-if="info.frozenNumber"
                ><span v-if="info.addNumber || info.minusNumber">，</span
                >冻结-{{ info.frozenNumber }}</span
              >
            </div>
            <div class="num">
              时间：<span>{{ info.onDate }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="th">
        <div>编号</div>
        <div class="center">总量记录</div>
      </div>
    </div>
    <status-template
      :list="list"
      api="/goods/api/commodityTotal/queryCommodityTotalList"
      :init="getList"
    >
      <div class="volume-cont">
        <div class="tbody">
          <div class="tr" v-for="(item, index) in list" :key="index">
            <div>{{ item.commodityNumber }}/{{ item.maxNumber }}</div>
            <div class="center" v-if="item.commodityFlag == 1">
              新增+{{ item.addMinusNumber }}
            </div>
            <div class="center" v-else-if="item.commodityFlag == 2">
              冻结{{ item.addMinusNumber }}
            </div>
            <div class="center" v-else>销毁{{ item.addMinusNumber }}</div>
          </div>
          <!-- <div class="load" v-if="loading">加载中...</div> -->
          <div class="load" v-if="noMore && list.length > 0">
            展示最近100条数据
          </div>
        </div>
      </div>
    </status-template>
  </div>
</template>

<script>
export default {
  name: "volumeList",
  data() {
    return {
      date: "",
      commodityUuid: "",
      info: {},
      list: [],
      pageCount: 1,
      pageSize: 20,
      loading: false,
      noMore: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.date = this.$route.query.date;
    this.commodityUuid = this.$route.query.commodityUuid;
    this.getList();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    async getList() {
      this.loading = true;
      const res = await this.$api.service.queryCommodityTotalList({
        pageCount: this.pageCount,
        pageSize: this.pageSize,
        commodityUuid: this.commodityUuid,
        onDate: this.date,
      });
      if (res.data.code == 200) {
        this.loading = false;
        if (!res.data.data) {
          this.noMore = true;
          return;
        }
        if (res.data.data.commodityTotalDetailList.length < 20) {
          this.noMore = true;
        }
        this.pageCount++;
        this.info = res.data.data;
        this.list = this.list.concat(res.data.data.commodityTotalDetailList);
      } else {
        this.loading = false;
        this.noMore = true;
      }
    },
    handleScroll() {
      if (this.$common.isMobile()) {
        // scrollDom = document.documentElement;
        var scrollTop =
          document.documentElement.scrollTop ||
          window.pageYOffset ||
          document.body.scrollTop;
        var scrollHeight = document.body.scrollHeight;
        var windowHeight = document.body.clientHeight;
      } else {
        var scrollDom = document.getElementsByClassName("tbody");
        scrollDom = scrollDom && scrollDom[0];
        var scrollTop = scrollDom.scrollTop;
        var windowHeight = scrollDom.clientHeight;
        var scrollHeight = scrollDom.scrollHeight;
      }
      if (
        scrollHeight - scrollTop - windowHeight < 100 &&
        !this.noMore &&
        !this.loading
      ) {
        this.getList();
      }
    },
  },
};
</script>

<style lang="scss" scoped="">
.volume-wrap {
  @media screen and (min-width: 541px) {
    background: #fbfbfb;
    .head-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      .volume-head {
        height: 388px;
        background-image: url("~@/assets/1.0/images/volume-bg.png");
        width: 100%;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .cont {
          display: flex;
          flex-direction: column;
          align-items: center;
          .img {
            width: 160px;
            height: 160px;
            border-radius: 4px;
            margin-bottom: 24px;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          .info {
            text-align: center;
            .name {
              font-size: 18px;
              font-weight: bold;
              color: #333333;
              margin-bottom: 8px;
            }
            .num {
              font-size: 14px;
              color: #999999;
              span {
                color: #4d4d4d;
              }
            }
          }
        }
      }
      .th {
        width: 1040px;
        display: flex;
        height: 48px;
        line-height: 48px;
        justify-content: space-around;
        padding-left: 40px;
        margin-top: -24px;
        background: linear-gradient(180deg, #fdfdff 0%, #ffffff 100%);
        box-shadow: 0px 5px 24px 0px rgba(204, 204, 204, 0.44),
          inset 0px -5px 12px 0px #ffffff,
          inset 0px -2px 6px 0px rgba(255, 255, 255, 0.82);
        border-radius: 4px;
        backdrop-filter: blur(5.600000000000001px);
        div {
          width: 100px;
          text-align: left;
        }
        .set {
          flex: none;
          width: 103px;
        }
      }
    }
    .volume-cont {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #4d4d4d;
      font-size: 14px;
      background: #fbfbfb;
      .tr {
        width: 1040px;
        display: flex;
        height: 48px;
        line-height: 48px;
        justify-content: space-around;
        padding-left: 40px;
      }
      .tbody {
        background-color: #ffffff;
        margin-top: 20px;
        max-height: 500px;
        min-height: 250px;
        overflow-y: overlay;
        overflow-x: hidden;
        margin-bottom: 100px;
        .tr {
          div {
            width: 100px;
            text-align: left;
          }
          .set {
            flex: none;
            width: 103px;
            color: #397fe7;
            cursor: pointer;
          }
        }
      }
      .load {
        width: 1040px;
      }
    }
  }
  @media screen and (max-width: 540px) {
    background: #fafafa;
    .head-wrap {
      position: fixed;
      width: 100%;
      background: #fafafa;
      z-index: 1;
      .volume-head {
        padding: 0.32rem;
        margin-top: 0.16rem;
        background: #ffffff;
        box-shadow: 0rem 0.04rem 0.12rem 0rem rgba(229, 229, 229, 0.4);
        .cont {
          display: flex;
          .img {
            width: 1.52rem;
            height: 1.52rem;
            border-radius: 0.04rem;
            margin-right: 0.2rem;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          .info {
            .name {
              font-size: 0.28rem;
              font-weight: 400;
              color: #4d4d4d;
              margin-bottom: 0.08rem;
              margin-top: 0.06rem;
            }
            .num {
              font-size: 0.24rem;
              margin-bottom: 0.08rem;
              color: #999999;
            }
          }
        }
      }
      .th {
        width: 100%;
        display: flex;
        justify-content: space-around;
        height: 0.76rem;
        line-height: 0.76rem;
        padding-left: 0.4rem;
        color: #999999;
        background: #ffffff;
        margin-top: 0.16rem;
        box-shadow: 0rem 0.04rem 0.12rem 0rem rgba(229, 229, 229, 0.4);
        div {
          width: 1.4rem;
          text-align: left;
        }
        .set {
          flex: none;
          width: 1.08rem;
        }
      }
    }
    .volume-cont {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #4d4d4d;
      font-size: 0.24rem;
      background: #ffffff;
      margin-top: 0.16rem;
      padding-top: 3.2rem;
      .tbody {
        width: 100%;
        padding-bottom: 0.6rem;
        .tr {
          width: 100%;
          display: flex;
          justify-content: space-around;
          height: 0.76rem;
          line-height: 0.76rem;
          padding-left: 0.4rem;
          border-bottom: 1px solid #e5e5e5;
          div {
            width: 1.4rem;
            text-align: left;
          }
          .set {
            flex: none;
            width: 1.08rem;
            color: #397fe7;
            cursor: pointer;
          }
        }
      }
    }
  }
  .center {
    text-align: center !important;
  }
  .load {
    text-align: center;
    padding: 20px 0;
    color: #999999;
  }
}
</style>
