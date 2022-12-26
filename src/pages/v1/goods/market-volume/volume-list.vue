<template>
  <div class="volume-wrap">
    <m-head :title="`市场流通量记录`">
      <div
        class="searchImg"
        @click="mShowSearch = true"
        v-if="!mShowSearch"
      ></div>
      <div class="no-slot" v-if="mShowSearch"></div>
    </m-head>
    <div class="volume-head">
      <div :class="[mShowSearch ? 'm-search' : '']">
        <div class="search-wrap">
          <div class="search">
            <div class="icon"></div>
            <div class="input">
              <input
                ref="inputkey"
                placeholder="请输入你想查找的商品编号，如1"
                @input="onSearchKey"
                @blur="onCloseSearch"
                @keyup.enter="getSearchInfo"
              />
            </div>
            <div class="search-btn" @click="getSearchInfo">搜索</div>
          </div>
          <!-- <div :class="{ 'search-result': true, show: searchResult }">
					  <div>
						<h1>编号</h1>
						<div class="li" v-if="searchData" @click="goDetail">{{inputVal}}</div>
						<div class="li-no" v-if="!searchData">暂无对应编号</div>
					  </div>
					</div> -->
        </div>
        <!-- 				<div class="cancel" v-if="mShowSearch" @click="cancelSearch()">取消</div> -->
      </div>

      <div class="cont">
        <div
          class="img"
          :style="`background-image:url(${goods.commodity.cover})`"
        ></div>
        <div class="info">
          <div class="name">{{ goods.commodity.name }}</div>
          <div class="num">
            市场流通量： <span>{{ list.minusDayNumber }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="volume-cont">
      <div class="th">
        <div>时间</div>
        <div>总量记录</div>
        <div>结果</div>
        <div class="set">操作</div>
      </div>
      <div class="tbody">
        <div
          class="tr"
          v-for="(item, index) in list.commodityTotalDetails"
          :key="index"
        >
          <div>{{ item.onDate }}</div>
          <div>
            <span v-if="item.addNumber">新增+{{ item.addNumber }} </span>
            <span v-if="item.minusNumber">销毁-{{ item.minusNumber }} </span>
            <span v-if="item.frozenNumber">冻结-{{ item.frozenNumber }} </span>
          </div>
          <div>{{ item.resultsNumber }}</div>
          <div class="set" @click="goVolumeOne(item)">查看</div>
        </div>
        <div
          v-if="
            !list.commodityTotalDetails ||
            list.commodityTotalDetails.length == 0
          "
          class="empty"
        >
          近10天暂无相关数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "volumeList",
  data() {
    return {
      inputVal: "",
      goods: {
        commodity: {},
      },
      list: {
        commodityTotalDetails: [],
      },
      searchResult: false, //搜索是否有结果
      searchData: null,
      mShowSearch: false,
    };
  },
  mounted() {
    this.goods = JSON.parse(decodeURIComponent(this.$route.query.goods));
    this.getList();
  },
  methods: {
    async getList() {
      const res = await this.$api.service.queryCommodityTotalDetail({
        commodityUuid: this.goods.commodity.id,
      });
      if (res.data.code == 200) {
        this.list = res.data.data;
      }
    },
    goVolumeOne(item) {
      this.$router.push({
        path: "/volumeOne",
        query: {
          date: item.onDate,
          commodityUuid: this.list.commodityUuid,
        },
      });
    },

    onCloseSearch() {
      this.searchResult = false;
      // this.$refs.inputkey.value = null;
    },
    cancelSearch() {
      this.onCloseSearch();
      this.mShowSearch = false;
    },
    goDetail() {
      this.cancelSearch();
      if (this.searchData && this.searchData.commodity) {
        this.$router.push({
          path: "/volumeDetail",
          query: {
            item: encodeURIComponent(JSON.stringify(this.searchData)),
          },
        });
      } else {
        this.$router.push({
          path: "/volumeDetail",
          query: {
            item: encodeURIComponent(JSON.stringify(this.goods)),
            isblock: 1,
          },
        });
      }
    },
    onSearchBlur() {
      this.closeTimer = setTimeout(() => {
        this.onCloseSearch();
      }, 300);
    },
    async onSearchKey(e) {
      // clearTimeout(this.timer);
      // this.timer = setTimeout(() => {
      //   this.getSearchInfo(e.target.value);
      // }, 300);
      this.searchResult = false;
      this.inputVal = e.target.value;
    },
    async getSearchInfo() {
      this.searchResult = true;
      let searchWorksResult = await this.$api.service.searchCommodityTotalList({
        commodityNumber: this.inputVal,
        commodityUuid: this.list.commodityUuid,
      });
      const res = searchWorksResult.data;
      if (res.code == 200) {
        this.searchData = res.data;
        this.goDetail();
      } else {
        this.searchData = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped="">
@import "~@/assets/1.0/scss/volume.scss";
.volume-wrap {
  @media screen and (min-width: 541px) {
    background: #fbfbfb;
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
            text-align: center;
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
      .search-wrap {
        height: 36px;
        background: #ffffff;
        border-radius: 18px;
        position: absolute;
        right: 200px;
        top: 102px;
        .search {
          display: flex;
          align-items: center;
          height: 100%;
          width: 343px;
          .icon {
            background: url("//static.theone.art/pc/images/search%402x.png")
              no-repeat;
            background-size: cover;
            width: 18px;
            height: 18px;
            margin-left: 24px;
          }
          > div.input {
            flex: 1;
            display: block;
          }
          input {
            height: 30px;
            margin-left: 10px;
            width: 90%;
          }
          .search-btn {
            width: 54px;
            height: 28px;
            background: #d8d8d8 linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
            border-radius: 18px;
            line-height: 28px;
            text-align: center;
            font-size: 14px;
            color: #ffffff;
            margin-right: 4px;
          }
        }
        .search-result {
          position: absolute;
          background: #ffffff;
          box-shadow: 0px 2px 6px 0px rgba(229, 229, 229, 0.4);
          border-radius: 4px;
          width: 100%;
          z-index: 99;
          top: 40px;
          display: none;
          &.show {
            display: block;
            height: auto;
            // max-height: 500px;
            // overflow: auto;
          }
          > div {
            border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
            &:last-child {
              border: none;
            }
            .li {
              font-size: 14px;
              padding-left: 48px;
              color: #333333;
              cursor: pointer;
              margin-bottom: 12px;
              &:hover {
                background: #f5f5f5;
              }
            }
            .li-no {
              font-size: 14px;
              padding-left: 48px;
              color: #333333;
              margin-bottom: 12px;
            }
          }
          h1 {
            font-size: 12px;
            color: #999999;
            line-height: 35px;
            padding-left: 24px;
          }
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
      width: 1040px;
      margin: 0 auto;
      .th,
      .tr {
        width: 100%;
        display: flex;
        height: 48px;
        line-height: 48px;
        padding-left: 40px;
      }
      .th {
        margin-top: -24px;
        background: linear-gradient(180deg, #fdfdff 0%, #ffffff 100%);
        box-shadow: 0px 5px 24px 0px rgba(204, 204, 204, 0.44),
          inset 0px -5px 12px 0px #ffffff,
          inset 0px -2px 6px 0px rgba(255, 255, 255, 0.82);
        border-radius: 4px;
        backdrop-filter: blur(5.600000000000001px);
        div {
          flex: 1;
          text-align: left;
        }
        .set {
          flex: none;
          width: 103px;
        }
      }
      .tbody {
        background-color: #ffffff;
        margin-top: 20px;
        width: 100%;
        max-height: 500px;
        min-height: 250px;
        overflow: auto;
        margin-bottom: 100px;
        .tr {
          div {
            flex: 1;
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
    }
  }
  @media screen and (max-width: 540px) {
    background: #fafafa;
    .searchImg {
      background: url("//static.theone.art/pc/images/search%402x.png");
      width: 18px;
      height: 18px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .no-slot {
      width: 18px;
    }
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
            margin-bottom: 0.18rem;
            margin-top: 0.06rem;
          }
          .num {
            font-size: 0.24rem;
            color: #999999;
          }
        }
      }
    }
    .search-wrap {
      display: none;
    }
    .m-search {
      height: calc(100% - 1.5rem);
      background: #ffffff;
      width: 100%;
      position: absolute;
      left: 0;
      .cancel {
        position: absolute;
        right: 0.32rem;
        top: 0.16rem;
        font-size: 0.24rem;
        font-weight: 500;
        color: #999999;
      }
      .search-wrap {
        display: block;
        height: 0.72rem;
        border: 1px solid #cccccc;
        border-radius: 0.36rem;
        width: 6.9rem;
        margin-left: 0.32rem;
        .search {
          display: flex;
          align-items: center;
          height: 100%;
          .icon {
            background: url("//static.theone.art/pc/images/search%402x.png")
              no-repeat;
            background-size: cover;
            width: 0.36rem;
            height: 0.36rem;
            margin-left: 0.32rem;
          }
          > div.input {
            flex: 1;
            display: block;
          }
          input {
            height: 0.6rem;
            margin-left: 0.2rem;
            width: 90%;
            font-size: 0.24rem;
          }
          .search-btn {
            width: 1.08rem;
            height: 0.56rem;
            background: #d8d8d8 linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
            border-radius: 0.36rem;
            line-height: 0.56rem;
            text-align: center;
            font-size: 0.28rem;
            color: #ffffff;
            margin-right: 0.08rem;
          }
        }
        .search-result {
          position: absolute;
          background: #ffffff;
          box-shadow: 0rem 0.04rem 0.12rem 0rem rgba(229, 229, 229, 0.4);
          width: 100%;
          z-index: 99;
          top: 0.92rem;
          left: 0;
          display: none;
          &.show {
            display: block;
            height: auto;
            // max-height: 500px;
            // overflow: auto;
          }
          > div {
            border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
            &:last-child {
              border: none;
            }
            .li,
            .li-no {
              font-size: 0.28rem;
              padding-left: 0.96rem;
              color: #333333;
              cursor: pointer;
              margin-bottom: 0.24rem;
              &:hover {
                background: #f5f5f5;
              }
            }
          }
          h1 {
            font-size: 0.24rem;
            color: #999999;
            padding-left: 0.48rem;
            line-height: 0.7rem;
          }
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
      .th,
      .tr {
        width: 100%;
        display: flex;
        padding: 0.2rem 0 0.2rem 0.4rem;
        align-items: center;
        line-height: 0.36rem;
      }
      .th {
        color: #999999;
        box-shadow: 0rem 0.04rem 0.12rem 0rem rgba(229, 229, 229, 0.4);
        div {
          flex: 1;
          text-align: left;
        }
        .set {
          flex: none;
          width: 1.08rem;
        }
      }
      .tbody {
        width: 100%;
        overflow: auto;
        .tr {
          border-bottom: 1px solid #e5e5e5;
          div {
            flex: 1;
            text-align: left;
          }
          .set {
            flex: none;
            width: 1.08rem;
            color: #397fe7;
            cursor: pointer;
          }
          span {
            display: block;
          }
        }
      }
    }
  }
}
</style>
