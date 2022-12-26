<template>
  <div class="market-body">
    <div class="moblie-head-wrap">
      <div class="moblie-head">
        <div class="return">
          <div class="icon icon-return" @click="$router.back()"></div>
        </div>
        <div class="title">市场</div>
        <div class="editor">
          <div class="icon icon-search" @click="showSearch"></div>
        </div>
      </div>
    </div>
    <div class="ui-market-content">
      <status-template
        :list="options.childrens"
        api="/market/api/commodityCategory/list"
        :init="init"
        class="page-status"
      >
        <div>
          <div class="ui-type-tab">
            <div
              class="block"
              v-for="(item, idx) in options.childrens"
              :key="idx"
            >
              <div
                class="tab"
                :class="{ selected: marketTypeIdx == idx }"
                @click="marketTypeChange(idx)"
              >
                {{ item.name }}
              </div>
              <div class="line" v-if="idx < options.childrens.length - 1"></div>
            </div>
          </div>
          <div class="ui-venue-wrap">
            <swiper
              ref="marketSwiperRef"
              :options="swiperOption"
              v-if="
                options.childrens &&
                options.childrens[marketTypeIdx] &&
                options.childrens[marketTypeIdx].childrens
              "
            >
              <swiper-slide
                v-for="(item, idx) in options.childrens[marketTypeIdx]
                  .childrens"
                :key="idx"
              >
                <div
                  class="venue-block"
                  :class="{ selected: idx === venueIdx }"
                  @click="venueChange(idx)"
                >
                  <div class="content">
                    <div
                      class="venue-icon"
                      :style="`background-image:url(${item.cover})`"
                    ></div>
                    <div class="name hidden-one">{{ item.name }}</div>
                  </div>
                  <div class="icon-down"></div>
                </div>
              </swiper-slide>
            </swiper>
            <div class="swiper-button-prev swiper-btn" slot="button-prev"></div>
            <div class="swiper-button-next swiper-btn" slot="button-next"></div>
          </div>
          <market-venue-detail
            v-if="!pagehide"
            :data="venueDetailList"
            :goMarket="goMarket"
          ></market-venue-detail>
        </div>
      </status-template>
    </div>

    <mobile-market-search ref="MobileMarketSearchRef"></mobile-market-search>
    <div class="market-tip-wrap" v-if="showFigLeaf">
      <div class="content">
        <div class="message">{{ marketMessage }}</div>
        <div class="ui-btn-center">
          <div class="ui-btn ui-btn-red" @click="showFigLeaf = false">
            继续看看
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MarketVenueDetail from "./components/market-venue-detail.vue";
import MobileMarketSearch from "@/components/v1/mobile-market-search.vue";
/* import Swiper from "swiper"; */
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  components: { MarketVenueDetail, Swiper, SwiperSlide, MobileMarketSearch },
  data() {
    return {
      marketMessage: "",
      showFigLeaf: false,
      marketTypeIdx: 0,
      venueIdx: 0,
      swiperOption: {
        paginationClickable: true,
        spaceBetween: 0,
        slidesPerView: 4,
        updateTranslate: true,

        prevButton: `.swiper-button-prev`,
        nextButton: `.swiper-button-next`,
      },

      options: { childrens: [] },
      pagehide: false,
    };
  },
  computed: {
    venueDetailList() {
      if (
        this.options.childrens &&
        this.options.childrens[this.marketTypeIdx] &&
        this.options.childrens[this.marketTypeIdx].childrens
      ) {
        return this.options.childrens[this.marketTypeIdx].childrens[
          this.venueIdx
        ];
      }
      return null;
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    $route: function (to, from) {
      this.init();
    },
  },
  methods: {
    async init() {
      this.getConfig();
      let marketType = this.$route.query.market_type;
      let res = await this.$api.service.commodityCategory_list({
        fid: "561f30937d5798f6da1de70c14546f99",
      });
      if (res.data.code == 200) {
        const resData = res.data.data[0];
        if (marketType == "derive") {
          this.marketTypeIdx =
            resData &&
            resData.childrens.findIndex(
              (item) => item.id == "7928dcb378475f97688da730ef0e0658"
            );
        } else if (marketType == "copyright") {
          this.marketTypeIdx =
            resData &&
            resData.childrens.findIndex(
              (item) => item.id == "f34b047edd05ddcd7d39df4ca106d214"
            );
        }
        this.options = resData;
        this.pagehide = false;
        this.marketTypeChange(this.marketTypeIdx);
      } else {
        this.pagehide = true;
      }
    },
    showSearch() {
      this.$refs.MobileMarketSearchRef.show();
    },
    goMarket(info) {
      const marketType = this.options.childrens[this.marketTypeIdx];
      const venueType =
        this.options.childrens[this.marketTypeIdx].childrens[this.venueIdx];
      this.$router.push(
        `/market?id=${info.id}`
      );
    },
    createVenueSwiper() {
      this.venueSwiper = new Swiper(".j-venue-swiper", {
        paginationClickable: true,
        spaceBetween: 0,
        slidesPerView: 4,
        updateTranslate: true,
        onSlideChangeStart: function (swiper) {
          self.currentPlay = swiper.activeIndex;
        },
      });
    },
    marketTypeChange(idx) {
      this.marketTypeIdx = idx;
      this.venueIdx = 0;
      this.$nextTick(() => {
        this.$refs.marketSwiperRef.$swiper.slideTo(0);
      });
    },
    venueChange(idx) {
      this.venueIdx = idx;
      const venueType =
        this.options.childrens[this.marketTypeIdx].childrens[this.venueIdx];
      console.log(venueType);
    },
    async getConfig() {
      const res = await this.$api.service.config_getConfigByType({
        type: 4,
      });
      if (
        res.data.code == 200 &&
        res.data.data.confValue3 &&
        res.data.data.confValue3.toUpperCase() == "ON"
      ) {
        this.marketMessage = res.data.data.confValue4;

        this.showFigLeaf = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper-btn {
  width: 46px;
  height: 46px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url("//static.theone.art/pc/market/icon-market-left.png");
  @media screen and (max-width: 540px) {
    display: none;
  }
}
.swiper-button-next {
  transform: rotate(180deg);
}
.swiper-slide {
  padding-bottom: 20px;
}
.swiper-button-prev,
.swiper-button-next {
  margin-top: -33px;
}
.swiper-button-prev {
}
.market-body {
  max-width: 1170px;

  margin: 0 auto;
  padding: 0 0 60px;
  @media screen and (max-width: 540px) {
    min-height: 100vh;
  }
}
.ui-market-content {
  .page-status {
    min-height: 70vh;
  }
}

.ui-venue-wrap {
  display: flex;
  justify-content: center;
  margin: 40px auto 30px;
  position: relative;
  top: 0;
  left: 0;
  padding: 0 60px;
  @media screen and (max-width: 540px) {
    padding: 0;
    margin: 0.32rem 0;
  }
}
.venue-block {
  max-width: 270px;
  height: 132px;
  flex: 1;
  margin: 0 10px;
  cursor: pointer;
  position: relative;
  top: 0;
  left: 0;
  .icon-down {
    background-image: url("//static.theone.art/pc/market/icon-down-venue.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 35px;
    height: 14px;
    position: absolute;
    bottom: -13px;
    left: 50%;
    transform: translateX(-50%);
    display: none;
  }
  .name {
    text-align: center;
    padding-top: 16px;
  }
  border-radius: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  .venue-icon {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 60px;
    height: 60px;
    margin: 0 auto;
  }
  .content {
    width: 100%;
    height: 100%;

    background: #f5f5f5
      linear-gradient(
        90deg,
        rgba(192, 121, 229, 0.1) 0%,
        rgba(112, 158, 247, 0.1) 100%
      );
    border-radius: 20px;
    padding: 18px 30px 16px;
  }
  &:hover {
    box-shadow: 0px 0px 14px 0px rgba(182, 182, 182, 0.3);
  }
  &.selected {
    background: #abbde1;
    .content {
      width: 99%;
      height: 98%;
    }
    .icon-down {
      display: block;
    }
  }
  @media screen and (max-width: 540px) {
    margin: 0 0.1rem;
    max-width: inherit;
    height: 1.8rem;
    .venue-icon {
      width: 0.76rem;
      height: 0.76rem;
    }
    .icon-down {
      width: 0.36rem;
      height: 0.14rem;
      bottom: -0.13rem;
    }
    .content {
      padding: 0.22rem 0 0;
    }
    .name {
      padding-top: 0.16rem;
      font-size: 0.2rem;
    }
    &.selected {
      .content {
        width: 98%;
      }
    }
  }
}
.ui-type-tab {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  padding-top: 40px;
  .block {
    display: flex;
    align-items: center;
  }

  .selected {
    color: rgba(0, 0, 0, 1);
  }
  .tab {
    padding: 0 40px;
    cursor: pointer;
    transition: all ease-out 0.16s;
  }
  .line {
    width: 1px;
    height: 16px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  @media screen and (max-width: 540px) {
    padding-top: 0.32rem;
    font-size: 0.28rem;
    .selected {
      color: rgba(0, 0, 0, 1);
      font-size: 0.32rem;
    }
  }
}

.icon-venue-1 {
  background-image: url("//static.theone.art/pc/market/icon-venue-1.png");
}
.icon-venue-2 {
  background-image: url("//static.theone.art/pc/market/icon-venue-2.png");
}
.icon-venue-3 {
  background-image: url("//static.theone.art/pc/market/icon-venue-3.png");
}
.icon-venue-4 {
  background-image: url("//static.theone.art/pc/market/icon-venue-4.png");
}
.moblie-head {
  display: none;
}
.market-tip-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  .content {
    width: 338px;
    height: 338px;
    background-image: url("//static.theone.art/pc/market/market-tip.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin: 20vh auto;
    .message {
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      line-height: 20px;
      padding: 210px 50px 0;
      margin-bottom: 20px;
      word-break: break-all;
    }
  }
}
@media screen and (max-width: 540px) {
  .moblie-head-wrap {
    height: 1.1rem;
  }
  .moblie-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.36rem;
    font-weight: 500;
    color: #000000;
    padding: 0.3rem;
    background-color: #fff;
    .icon {
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
    .icon-return {
      width: 0.48rem;
      height: 0.48rem;
      background-image: url("//static.theone.art/pc/market/icon-return.png");
    }
    .icon-search {
      width: 0.36rem;
      height: 0.36rem;
      background-image: url("//static.theone.art/pc/market/icon-search.png");
    }
  }
}
</style>
