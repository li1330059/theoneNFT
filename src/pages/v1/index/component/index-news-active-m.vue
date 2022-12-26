<template>
  <div class="news-active-body">
    <status-template
      :list="categoryList.length > 0"
      api="/market/api/category/findList"
      :init="getCategoryList"
    >
      <div class="news-main">
        <div class="see-more-wrap">
          <span class="" @click="goHospot">查看更多</span>
        </div>
        <div class="ui-content">
          <img
            src="//static.theone.art/pc/hotspot/icon-round-1.png"
            class="round round-1"
          />
          <img
            src="//static.theone.art/pc/hotspot/icon-round.png"
            class="round round-2"
          />
          <div class="main">
            <div class="left">
              <picture>
                <source
                  srcset="//static.theone.art/pc/hotspot/notice-title-2.png"
                  media="(max-width: 540px)"
                />

                <img
                  srcset="//static.theone.art/pc/hotspot/notice-title.png"
                  alt="pic"
                />
              </picture>
            </div>
            <div class="right">
              <swiper ref="marketSwiperRef" :options="swiperOption">
                <swiper-slide v-for="(item, idx) in categoryList" :key="idx">
                  <div class="m-news-block" @click="go(item)">
                    <div class="title">
             <!--          <span
                        v-if="item.categoryName"
                        class="ui-icon"
                        :class="{
                          'icon-type-1': item.categoryName == '教程帮助',
                          'icon-type-2': item.categoryName == '平台活动',
                          'icon-type-3': item.categoryName == '平台通知',
                          'icon-type-4': item.categoryName == '新闻动态',
                        }"
                      ></span> -->
                      <span class="hidden-2">
                        {{ item.name }}
                      </span>
                    </div>
                <!--     <div class="des-wrap">
                      <div class="des hidden-2">{{ item.summarize }}</div>
                    </div> -->
                    <div class="time">{{ $common.formatDate(item.releaseTime,'yyyy-MM-dd HH:mm:ss') }}</div>
                  </div>
                </swiper-slide>
              </swiper>
              <div class="phone-see-more" @click="goHospot">
                查看更多<span class="line" />
              </div>
              <div class="swiper-btn-group">
                <div class="swiper-button j-prev" slot="button-prev_swiper">
                  <div class="s-btn ui-icon s-btn-prev"></div>
                </div>
                <div class="swiper-button j-next" slot="button-next_swiper">
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
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      swiperOption: {
        paginationClickable: true,
        spaceBetween: 0,
        slidesPerView: 1,
        updateTranslate: true,
/* 
        autoplay: 5000, */
        prevButton: `.j-prev`,
        nextButton: `.j-next`,
      },
    };
  },
  props: {
    categoryList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  created() {},
  /*      this.$nextTick(() => {
        this.$refs.marketSwiperRef.$swiper.slideTo(0);
      }); */
  methods: {
    goHospot() {
      this.$router.push(`/hotspot`);
    },
    go(item) {
      console.log(item);
      this.$router.push(`/news/${item.uuid}`);
    },
  },
};
</script>

<style lang="scss" scoped>
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
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0.5;
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
.news-main {
  display: none;
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
    padding: 0 100px 0 40px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 2;
    background-color: #fff;
    border-radius: 4px;

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
  .phone-see-more {
    display: block;
    font-size: 0.24rem;
    color: #ff0200;
    position: relative;
    top: 0;
    left: 0;
    span {
      display: block;
      width: 1.1rem;
      height: 0.1rem;
      background: #e61f1a;
      opacity: 0.1;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .see-more-wrap {
    display: none;
  }
  .s-btn-prev {
    position: relative;
    top: 0.01rem;
    transform: rotate(180deg);
    margin-right: 6px;
    background-image: url("//static.theone.art/pc/hotspot/icon-s-right.png");
  }
  .s-btn-next {
    background-image: url("//static.theone.art/pc/hotspot/icon-s-right.png");
  }
  .s-btn {
    width: 0.32rem;
    height: 0.32rem;
    cursor: pointer;
    opacity: 0.4;
  }
  .swiper-button-disabled {
    opacity: 0.2;
  }
  .swiper-btn-group {
    position: absolute;
    display: flex;
    bottom: 14px;
    top: inherit;
    right: 16px;
    z-index: 9;
  }
  .news-main {
    display: block;
    background-image: url("//static.theone.art/pc/hotspot/notice-bg.png");
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: 30%;
    padding: 0;
  }
  .ui-content {
    position: relative;
    top: 0;
    left: 0;
    .round {
      display: none;
    }
    .round-1 {
      z-index: 3;
    }
    .round-2 {
      z-index: 1;
    }
    .main {
      width: 100%;
      margin: 0 auto 0.32rem;
      display: flex;
      justify-content: center;
      padding: 0;
      padding-bottom: 0.2rem;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 2;
      background-color: #fff;
      overflow: hidden;
      border-radius: 4px;

      .left {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
        flex: 1;
        justify-content: flex-start;
        img {
          display: block;
          width: 2rem;
        }
      }
      .right {
        width: 60vw;
      }
    }
  }
  .news-active-body {
    max-width: 1290px;
    margin: 0 auto;
    position: relative;
    z-index: 997;
  }
  .m-news-block {
    padding: 0.34rem 0.01rem 0;
    overflow: hidden;
    cursor: pointer;
    .title {
      height:1rem;
      font-size: 0.26rem;
      display: block;
      padding-right:.02rem;
      line-height: .4rem;
      .ui-icon {
        width: 46px;
        height: 21px;
        position: relative;
        top: 6px;
      }
    }
    .time {
      font-size: 0.24rem;
      color: #999999;
      padding: 0.01rem 0 0.18rem;
    }
    .des {
      font-size: 12px;
      color: #999999;
      margin-top: 14px;
      display: none;
    }
    .des-wrap {
      height: 0.3rem;
    }
  }
}
</style>

