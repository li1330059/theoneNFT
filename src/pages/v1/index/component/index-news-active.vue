<template>
  <div class="news-active-body">
    <status-template
      :list="categoryList.length > 0"
      api="/market/api/category/findList"
      :init="getCategoryList"
    >
      <index-news-active-m
        :categoryList="categoryList"
        :swiperOption="swiperOption"
      ></index-news-active-m>
      <div class="news-main">
        <div class="ui-content">
          <div class="main shadow-block">
            <div class="right txt-info-wrap">
              <div class="info-wrap">
                <img
                  class="t1"
                  src="//static.theone.art/pc/index/t2.png"
                />
                <swiper ref="marketSwiperRef" :options="swiperOption">
                  <swiper-slide v-for="(item, idx) in categoryList" :key="idx">
                    <div class="hand txt-info-block" @click="go(item)">
                      <div class="des hidden-2">
                        {{ item.name }}
                      </div>
                      <div class="date">{{ $common.formatDate(item.releaseTime,'yyyy-MM-dd HH:mm') }}</div>
                    </div>
                  </swiper-slide>
                </swiper>
                <div class="ui-btn ui-btn-red" @click="goHospot()">查看更多</div>
              </div>

              <div class="swiper-btn-group">
                <div class="swiper-button j-prev-1" slot="button-prev_swiper">
                  <div class="s-btn ui-icon s-btn-prev"></div>
                </div>
                <div class="swiper-button j-next-1" slot="button-next_swiper">
                  <div class="s-btn ui-icon s-btn-next"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </status-template>
  </div>
</template>
<script>
import IndexNewsActiveM from "./index-news-active-m.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
export default {
  components: { Swiper, SwiperSlide, IndexNewsActiveM },
  data() {
    return {
      categoryList: [],
      swiperOption: {
        paginationClickable: true,
        spaceBetween: 0,
        slidesPerView: 1,
        updateTranslate: true,

        autoplay: 5000,
        prevButton: `.j-prev-1`,
        nextButton: `.j-next-1`,
      },
    };
  },
  props: {
    artistResult: {},
  },

  created() {
    this.getRecommend();
  },
  /*      this.$nextTick(() => {
        this.$refs.marketSwiperRef.$swiper.slideTo(0);
      }); */
  methods: {
    goHospot() {
		this.$sensors.track('homepage_click', {
			module_name: "次级banner-唯艺热点查看更多"
		});
		this.$router.push(`/hotspot`);
    },
    go(item) {
      this.$sensors.track('homepage_click', {
      	module_name: "次级banner-唯艺热点滚动",
      	button_name:item.name
      });
      this.$router.push(`/news/${item.uuid}`);
    },

    async getRecommend() {
      let res = await this.$api.service.dynamicNews_toplist({
        count: 8,
        type: 2,
      });
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.categoryList = res.data.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/index/active.scss";
.icon-type-1 {
  background-image: url("//static.theone.art/pc/hotspot/icon-news1.png");
}
.icon-type-2 {
  background-image: url("//static.theone.art/pc/hotspot/icon-news2.png");
}
.icon-type-3 {
  background-image: url("//static.theone.art/pc/hotspot/icon-news3.png");
}
.icon-type-4 {
  background-image: url("//static.theone.art/pc/hotspot/icon-news4.png");
}
.icon-type {
  display: inline-block;
  width: 46px;
  height: 21px;
  margin-right: 10px;
}
.see-more-wrap {
  text-align: right;
  font-size: 16px;
  color: #e61f1a;
  padding: 0 60px 10px 0;
  cursor: pointer;
}
.s-btn-prev {
  transform: rotate(180deg);
  margin-right: 6px;
  background-image: url("//static.theone.art/pc/hotspot/icon-s-right.png");
}
.s-btn-next {
  background-image: url("//static.theone.art/pc/hotspot/icon-s-right.png");
}
.s-btn {
  width: 23px;
  height: 23px;
  cursor: pointer;
  opacity: 0.4;
}
.swiper-button-disabled {
  opacity: 0.2;
}
.swiper-btn-group {
  position: absolute;
  display: flex;
  top: 14px;
  right: 16px;
}

.ui-content {
  position: relative;
  top: 0;
  left: 0;
  .round {
    width: 273px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 180px;
  }
  .round-1 {
    z-index: 3;
  }
  .round-2 {
    z-index: 1;
  }
  .main {
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 0 100px 0 0px;
    position: relative;
    z-index: 2;
    background-color: #fff;
    border-radius: 4px;
    background-image: url("//static.theone.art/pc/index/t2-icon.png");
    background-size: 200px;
    background-position: 84% center;
    background-repeat: no-repeat;

    .left {
      position: relative;
      top: 0;
      left: 0;

      display: flex;
      align-items: center;
      img {
        display: block;
        width: 262px;
      }
    }
    .right {
      width: 479px;
    }
  }
}
.news-active-body {
  margin: 0 auto;
  position: relative;
  z-index: 10;
}
.m-news-block {
  padding: 34px 6px 0;
  cursor: pointer;
  .title {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    .ui-icon {
      width: 46px;
      height: 21px;
      position: relative;
      top: 4px;
    }
  }
  .time {
    font-size: 12px;
    color: #999999;
    padding-bottom: 30px;
  }
  .des {
    font-size: 12px;
    color: #999999;
    margin-top: 14px;
    line-height: 22px;
  }
  .des-wrap {
    height: 70px;
  }
}
.phone-see-more {
  display: none;
}

@media screen and (max-width: 540px) {
  .news-main {
    display: none;
  }
}
</style>

