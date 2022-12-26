<template>
  <div class="v1-page-index-banner">
    <status-template
      :list="bannerListResult && bannerListResult.records"
      api="/market/api/banner/list"
      :init="bannerList"
    >
      <div class="mode-PC">
        <div class="content">
          <swiper
            class="banner"
            :options="swiperOption"
            v-if="
              bannerListResult.records && bannerListResult.records.length > 0
            "
          >
            <swiper-slide
              v-for="(item, index) in bannerListResult.records"
              :key="index"
            >
              <div
                class="banner-item mode-PC"
                :style="`background-image:url(${item.cover})`"
              ></div>
              <div class="banner-main">
                <div class="sub">
                  <div class>
                    <h1>{{ item.name }}</h1>
                    <h2 v-html="item.describe"></h2>
                    <div class="btn-buy" @click="openUrl(item)">
                      {{ item.buttonText || "立即购买" }}
                    </div>
                  </div>
                </div>
                <div
                  class="smallbg"
                  :style="`background-image:url(${item.cover})`"
                ></div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
          <div
            v-if="swiperChangeButton"
            class="goods-relationship-swiper-button-prev button-prev"
            slot="button-prev"
          ></div>
          <div
            v-if="swiperChangeButton"
            class="goods-relationship-swiper-button-next button-next"
            slot="button-next"
          ></div>
        </div>
      </div>
      <div class="mode-mobile">
        <swiper
          class="banner"
          :options="swiperOption"
          v-if="bannerListResult.records && bannerListResult.records.length > 0"
        >
          <swiper-slide
            v-for="(item, index) in bannerListResult.records"
            :key="index"
          >
            <a :href="item.returnUrl">
              <div class="banner-main">
                <div
                  class="smallbg"
                  :style="`background-image:url(${item.cover})`"
                >
                  <div class="sub">
                    <div class>
                      <h1>{{ item.name }}</h1>
                      <h2 v-html="item.describe"></h2>
                      <div class="btn-buy-custome">
                        {{ item.buttonText || "立即购买" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div
          v-if="swiperChangeButton"
          class="goods-relationship-swiper-button-prev"
          slot="button-prev"
        ></div>
        <div
          v-if="swiperChangeButton"
          class="goods-relationship-swiper-button-next"
          slot="button-next"
        ></div>
      </div>
    </status-template>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      loading: true, //加载
      showEmpty: false, //空数据
      swiperChangeButton: true,
      statusErr: false, //接口异常
      swiperOption: {
        loop: true,
        updateTranslate: true,
        autoplay: 5000,
        threshold: 50,
        pagination: ".swiper-pagination",
        paginationClickable: true,
        prevButton: `.goods-relationship-swiper-button-prev`,
        nextButton: `.goods-relationship-swiper-button-next`,
        on: {
          click: (v) => {
            console.log(v);
          },
        },
      },
      bannerListResult: {
        records: [],
      },
    };
  },

  created() {
    this.bannerList();
  },
  methods: {
    async bannerList() {
      try {
        let result = await this.$api.service.banner_list({
          pageCount: 1,
          pageSize: 20,
        });
        this.bannerListResult = result.data.data;
        this.showEmpty = !this.bannerListResult.records.length > 0;
        this.loading = false;
        this.swiperChangeButton = true;
        if (result.data.code == 200) {
          this.statusErr = false;
        } else {
          this.statusErr = true;
        }
      } catch (error) {
        this.statusErr = true;
        console.log(error);
      }
    },
    openUrl(item) {
		this.$sensors.track('homepage_click', {
			module_name: "顶部banner",
			button_name:item.name
		});
      window.open(item.returnUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
.loading-err {
  .txt {
    text-align: center;
    padding-top: 38px;
    span {
      color: rgba(226, 89, 73, 1);
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.v1-page-index-banner {
  width: 100%;
  height: 561px;

  .loading {
    height: 561px;
    padding-top: 15%;
    img {
      display: block;
      margin: 0 auto;
      width: 100%;
      max-width: 244px;
    }
  }

  .banner {
    height: 561px;

    ::v-deep .swiper-pagination-bullet {
      background: rgba($color: #000, $alpha: 0.3);
    }

    ::v-deep .swiper-pagination-bullet-active {
      width: 40px;
      height: 8px;
      background: #e61f1a;
      border-radius: 4px;
      background: rgba($color: #e61f1a, $alpha: 0.8);
    }
  }
  .content {
    position: relative;
  }
  .goods-relationship-swiper-button-prev,
  .goods-relationship-swiper-button-next {
    width: 46px;
    height: 46px;
    background: url("//static.theone.art/pc/images/pic-home/goods-left.png")
      no-repeat center center;
    background-size: 46px 46px;
    position: absolute;
    cursor: pointer;
    top: 50%;
    transform: translate(-120%, -50%);
    z-index: 99;
    left: 100px;
  }
  .goods-relationship-swiper-button-next {
    background-image: url("//static.theone.art/pc/images/pic-home/goods-right.png");
    right: 100px;
    left: auto;
    transform: translate(120%, -50%);
  }
  .banner-item {
    position: absolute;
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center center;
    background-color: rgb(255, 255, 255);
    opacity: 0.3;
    filter: blur(8px);
    z-index: 99;
    -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
  }
  .banner-main {
    max-width: 1180px;
    display: flex;
    margin: 0 auto;
    flex-wrap: wrap;
    padding-top: 80px;
    justify-content: space-between;
    z-index: 999;
    position: relative;

    > div {
      &:nth-child(1) {
        padding: 0 20px;
        // margin-right: 82px;
        h1 {
          margin-top: 73px;
          margin-bottom: 49px;
          height: 24px;
          font-size: 18px;
          color: #000000;
          line-height: 24px;
          position: relative;
          &::before {
            content: "";
            width: 50px;
            height: 4px;
            background: #e61f1a;
            border-radius: 4px;
            position: absolute;
            bottom: -21px;
          }
        }
        h2 {
          font-size: 26px;
          font-weight: bold;
          color: #000000;
          line-height: 35px;
          margin-bottom: 68px;
        }
        .btn-buy {
          width: 200px;
          height: 46px;
          background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
          border-radius: 23px;
          font-size: 14px;
          color: #ffffff;
          line-height: 46px;
          padding-left: 30px;
          position: relative;
          cursor: pointer;
          &::after {
            content: "";
            background: url("//static.theone.art/pc/images/arrowright4%402x.png")
              no-repeat;
            width: 25px;
            height: 24px;
            background-size: 100% auto;
            position: absolute;
            right: 24px;
            top: 50%;
            transform: translateY(-50%);
          }

          &:hover {
            opacity: 0.8;
          }
        }
      }
      &.smallbg {
        width: 599px;
        height: 416px;
        opacity: 1;
        overflow: hidden;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 10px;
        // margin-left: 82px;
      }

      // @media screen and (min-width: 0px) and (max-width: 540px) {
      //   &.smallbg {
      //     // display: none;
      //   }
      // }
    }
  }
}
@media screen and (min-width: 1000px) {
  .sub {
    max-width: 400px;
    overflow: auto;
    h2 {
      -webkit-line-clamp: 6;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 1000px) {
  .sub {
    h2 {
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .mode-PC {
    display: none !important;
  }
  .mode-mobile {
    display: block !important;
  }
  .v1-page-index-mhead,
  .v1-page-index-search {
    display: none;
  }
  .v1-page-index-banner {
    height: 7.5rem;
    //  height: auto;
    .goods-relationship-swiper-button-prev,
    .goods-relationship-swiper-button-next {
      display: none;
    }
    .banner {
      height: 7.5rem;
      padding-top: 0.5rem;

      ::v-deep .swiper-pagination-bullet {
        width: 0.08rem;
        height: 0.08rem;
        background: rgba($color: #000, $alpha: 0.3);
      }

      ::v-deep .swiper-pagination-bullet-active {
        width: 0.3rem;
        height: 0.08rem;
        background: #e61f1a;
        border-radius: 0.08rem;
        background: rgba($color: #e61f1a, $alpha: 0.8);
      }
    }

    .banner-main {
      max-width: 11rem;
      padding-top: 0;
      > div {
        &:nth-child(1) {
          padding: 0;
          text-align: center;
          width: 100%;
          h1 {
            margin-top: 0;
            font-size: 0.24rem;
            font-weight: 500;
            color: #ffffff;
            line-height: 0.28rem;
            margin-bottom: 0;
            position: relative;
            // display: flex;
            // justify-content: center;
            &::before {
              content: "";
              width: 0.2rem;
              height: 0.06rem;
              background: #e61f1a;
              border-radius: 0.07rem;
              vertical-align: middle;
              position: absolute;
              top: 0.1rem;
              margin-left: -0.3rem;
            }
            &::after {
              content: "";
              width: 0.2rem;
              height: 0.06rem;
              background: #e61f1a;
              border-radius: 0.07rem;
              vertical-align: middle;
              position: absolute;
              top: 0.1rem;
              margin-left: 0.1rem;
            }
          }
          h2 {
            font-size: 0.32rem;
            margin-bottom: 0;
            color: #fff;
            font-weight: 500;
          }
          .btn-buy-custome {
            height: 0.4rem;
            background: linear-gradient(270deg, #e61f1a 0%, #ff7a64 100%);
            border-radius: 0.1rem;
            padding: 0 0.22rem;
            display: inline-block;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.2rem;
            font-weight: 500;
            color: #ffffff;
            margin-top: 0.2rem;
          }
        }

        &.smallbg {
          width: 11rem;
          height: 6.4rem;
          background-size: cover;
          position: relative;
          margin: 0;
        }
      }

      .sub {
        height: 2.32rem;
        background: rgba($color: #000, $alpha: 0.3);
        width: 100%;
        position: absolute;
        bottom: 0;
        padding: 0.14rem;
      }
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .loading-err {
    .txt {
      padding-top: 0.38rem;
      span {
      }
    }
  }
  .sub {
    h2 {
      -webkit-line-clamp: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .v1-page-index-mhead,
  .v1-page-index-search {
    display: block;
  }
  .v1-page-index-banner {
    height: 6.1rem;
    .banner {
      height: 6.1rem;
      padding: 0;
      .banner-main {
        max-width: 6.84rem;
        > div {
          &.smallbg {
            width: 6.84rem;
            height: 5.4rem;
          }
        }
      }
    }
  }
}
// @media screen and (min-width: 0px) and (max-width: 540px) {
//   .v1-page-index-banner {
//     height: 6.1rem;
//     //  height: auto;
//     .goods-relationship-swiper-button-prev,
//   .goods-relationship-swiper-button-next{
//     display: none;
//   }
//     .banner {
//       height: 6.1rem;

//       ::v-deep .swiper-pagination-bullet {
//         width: 0.08rem;
//         height: 0.08rem;
//         background: rgba($color: #000, $alpha: 0.3);
//       }

//       ::v-deep .swiper-pagination-bullet-active {
//         width: 0.3rem;
//         height: 0.08rem;
//         background: #e61f1a;
//         border-radius: 0.08rem;
//         background: rgba($color: #e61f1a, $alpha: 0.8);
//       }
//     }

//     .banner-main {
//       max-width: 6.84rem;
//       padding-top: 0;
//       > div {
//         &:nth-child(1) {
//           padding: 0;
//           text-align: center;
//           width: 100%;
//           h1 {
//             margin-top: 0;
//             font-size: 0.24rem;
//             font-weight: 500;
//             color: #ffffff;
//             line-height: 0.28rem;
//             margin-bottom: 0;
//             position: relative;
//             // display: flex;
//             // justify-content: center;
//             &::before {
//               content: "";
//               width: 0.2rem;
//               height: 0.06rem;
//               background: #e61f1a;
//               border-radius: 0.07rem;
//               vertical-align: middle;
//               position: absolute;
//               top: 0.1rem;
//               margin-left: -0.3rem;
//             }
//             &::after {
//               content: "";
//               width: 0.2rem;
//               height: 0.06rem;
//               background: #e61f1a;
//               border-radius: 0.07rem;
//               vertical-align: middle;
//               position: absolute;
//               top: 0.1rem;
//               margin-left: 0.1rem;
//             }
//           }
//           h2 {
//             font-size: 0.32rem;
//             margin-bottom: 0;
//             color: #fff;
//             font-weight: 500;
//           }
//           .btn-buy-custome {
//             height: 0.4rem;
//             background: linear-gradient(270deg, #e61f1a 0%, #ff7a64 100%);
//             border-radius: 0.1rem;
//             padding: 0 0.22rem;
//             display: inline-block;
//             line-height: 0.4rem;
//             text-align: center;
//             font-size: 0.2rem;
//             font-weight: 500;
//             color: #ffffff;
//             margin-top: 0.2rem;
//           }
//         }

//         &.smallbg {
//           width: 6.84rem;
//           height: 5.4rem;
//           background-size: cover;
//           position: relative;
//         }
//       }

//       .sub {
//         height: 2.02rem;
//         background: rgba($color: #000, $alpha: 0.3);
//         width: 100%;
//         position: absolute;
//         bottom: 0;
//         padding: 0.14rem;
//       }
//     }
//   }
// }
</style>

