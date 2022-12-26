<template>
  <div class="v1-page-index-swiper">
    <status-template
      :list="topicListResult"
      api="/market/api/saleRecord/listTopic"
      :init="topicList"
    >
      <div>
        <swiper class="swiper-wrapper" :options="swiperOption">
          <swiper-slide
            class="swiper-slide"
            v-for="(item, index) in topicListResult"
            :key="index"
          >
            <div style="margin: 0 auto">
              <div class="swiper-title">{{ item.topic.name }}</div>
            <!--   <div class="swiper-line"></div> -->
       <!--        <div class="swiper-desc">
                <h1 class="hidden">{{ item.topic.description }}</h1>
              </div>  -->
              <div
                class="swiper-imglist pointer"
              >
                <div
                  :class="[
                    'single-img',
                    item.transform ? 'single-img-transform' : '',
                  ]"
                  ref="single-img"
                  :style="`background-image:url('${item.topic.cover}')`"
                ></div>
                <div
                  :class="[
                    'img-list',
                    item.transform ? 'img-list-transform' : '',
                  ]"
                >
                  <goods-frame
                    class="img-item pointer"
                    :goods-info="mitem"
                    @listenLike="_likeGoods"
                    :index="mindex"
                    :params="{ index2: index }"
                    :isShowPreview="true"
                    v-for="(mitem, mindex) in item.list"
                    :key="mindex"
                    v-show="mindex <= 3"
                    @listenCoverClick="listenCoverClick(mitem)"
                  >
                  </goods-frame>
     
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-button-prev" slot="button-prev_swiper">
          <div class="button-prev"></div>
        </div>
        <div class="swiper-button-next" slot="button-next_swiper">
          <div class="button-next"></div>
        </div>
        <div class="btn-item" @click="goMarket">
          探索更多画作
        </div>
      </div>
    </status-template>

    <!-- <goodsDetail ref="goodsDetail" /> -->
  </div>
</template>

<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      loading: true, //加载
      showEmpty: false, //空数据
      statusErr: false,
      swiperOption: {
        loop: false,
        slidesPerView: 2,
        spaceBetween: 91,
        prevButton: ".swiper-button-prev",
        nextButton: ".swiper-button-next",
      },
      topicListResult: null,
      screenWidth: null,
    };
  },

  created() {
    this.topicList();
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    if (this.screenWidth <= 960) {
      this.swiperOption.slidesPerView = 1;
      this.swiperOption.spaceBetween = 0;
    } else {
      this.swiperOption.slidesPerView = 2;
      this.swiperOption.spaceBetween = 91;
    }
    window.onresize = () => {
      return (() => {
        window.ecreenWidth = document.body.clientWidth;
        this.screenWidth = window.ecreenWidth;
        if (this.screenWidth <= 960) {
          this.swiperOption.slidesPerView = 1;
          this.swiperOption.spaceBetween = 0;
        } else {
          this.swiperOption.slidesPerView = 2;
          this.swiperOption.spaceBetween = 91;
        }
      })();
    };
  },
  watch: {
    /* 监听*/
    screenWidth(val) {
      this.screenWidth = val;
      if (this.screenWidth <= 960) {
        this.swiperOption.slidesPerView = 1;
        this.swiperOption.spaceBetween = 0;
      } else {
        this.swiperOption.slidesPerView = 2;
        this.swiperOption.spaceBetween = 91;
      }
    },
  },
  methods: {
    listenCoverClick(mitem) {
		this.$sensors.track('homepage_click', {
			module_name: "版权品"
		});
      this.$common.goPage(`/goods/${mitem.id}`, "_blank");
    },
	goMarket(){
		this.$sensors.track('homepage_click', {
			module_name: "探索更多画作"
		});
		this.$common.goPage(`/market`);
	},
    async topicList() {
      this.loading = true;
      this.$nextTick(() => {
        this.getTopicListGo();
      });
    },

    async getTopicListGo() {
      try {
        let result = await this.$api.service.topic_list();
        this.loading = false;
        result = result.data.data;
        this.showEmpty = result.length == 0;
        if (result.length > 0) {
          let topicMap = {};
          result.forEach((element) => {
            if (!topicMap[element.topic.id]) {
              topicMap[element.topic.id] = {
                topic: element.topic,
                list: [element],
                transform: true,
              };
            } else {
              topicMap[element.topic.id].list.push(element);
            }
          });
          this.topicListResult = topicMap;
          // console.log(`主题`, this.topicListResult);
          this.$emit("sendTopicResult", this.topicListResult);
          this.statusErr = false;
        } else {
          this.statusErr = true;
        }
      } catch (error) {
        this.statusErr = true;
        console.log(error);
      }
    },

    _likeGoods(info) {
		if (info.like) {
			this.$sensors.track('homepage_click', {
				module_name:"版权品",
				rights_save: "取消收藏"
			});
		}else{
		  this.$sensors.track('homepage_click', {
			module_name:"版权品",
		  	rights_save: "收藏"
		  });
		}
      this.$parent.likeGoods(
        info.id,
        info.like,
        info.name,
        2,
        info.index,
        2,
        info.index2
      );
    },
    likeGoods(id, index, type, listId) {
      this.topicListResult[listId].list[index].like = type;
      if (type) {
        this.topicListResult[listId].list[index].commodity.amountLike++;
      } else {
        this.topicListResult[listId].list[index].commodity.amountLike--;
      }
    },

    showCover(cover) {
      this.$parent.showCover(cover);
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  width: 220px;
  margin: 0 auto;
  padding: 100px 0;
  .txt {
    text-align: center;
    padding-top: 20px;
    color: #666666;
    span {
      color: rgba(226, 89, 73, 1);
      text-decoration: underline;
      cursor: pointer;
    }
  }
  img {
    display: block;
    width: 100%;
    margin: 0 auto;
  }
}
.loading-err {
  width: inherit;
  img {
    width: 220px;
  }
}
.v1-page-index-swiper {
  width: 1183px;

  margin: 0 auto;
  position: relative;
  // background-color: #ff000f;

  padding-bottom: 77px;
  z-index: 9999;

  .swiper-button-prev,
  .swiper-container-rtl .swiper-button-next {
    background-image: none;
    width: 46px;
    height: 46px;
    left: -82px;
  }

  .swiper-button-next,
  .swiper-container-rtl .swiper-button-prev {
    background-image: none;
    width: 46px;
    height: 46px;
    right: -82px;
  }

  .button-prev {
    background: url("//static.theone.art/pc/images/prev%402x.png")
      no-repeat;
    width: 46px;
    height: 46px;
    background-size: 100% auto;
    &:hover {
      background: url("//static.theone.art/pc/images/prev-active%402x.png")
        no-repeat;
      background-size: 100% auto;
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    margin-top: -13px;
  }

  .button-next {
    background: url("//static.theone.art/pc/images/pic-home/next%402x.png")
      no-repeat;
    width: 46px;
    height: 46px;
    background-size: 100% auto;
    &:hover {
      background: url("//static.theone.art/pc/images/pic-home/next-active%402x.png")
        no-repeat;
      background-size: 100% auto;
    }
  }

  .swiper-slide {
    display: flex;
    flex-direction: column;
    text-align: center;
    // width: 637px;

    .swiper-title {
      font-size: 20px;
      width: 546px;
      font-weight: bold;
      color: #e61f1a;
      position: relative;
      &:before {
        content: "";
        background: url("//static.theone.art/pc/images/yh%402x.png")
          no-repeat;
        width: 24px;
        height: 24px;
        background-size: 100% auto;
        display: inline-block;
        vertical-align: middle;
        margin-right: 4px;
        margin-top: -4px;
      }
    }

    .swiper-line {
      width: 51px;
      height: 1px;
      margin: 0 auto;
      background: #e3e3e3;
      margin-top: 11px;
      opacity: 0;
    }

    .swiper-desc {
      width: 546px;
      opacity: 0;
      h1 {
        line-height: 30px;
        height: 30px;
        background: rgba($color: #000000, $alpha: 0.08);
        border-radius: 15px;
        font-size: 12px;
        font-weight: 400;
        color: rgba($color: #000000, $alpha: 0.4);
        margin: 0 auto;
        margin-top: 16px;
        margin-bottom: 40px;
        min-width: 150px;
        display: inline-block;
        padding: 0 15px;
        max-width: 546px;
      }
    }

    .swiper-imglist {
      height: 840px;
      .single-img {
        background: url("//static.theone.art/pc/mine/pic_home_haibao%402x.png")
          no-repeat center center;
        width: 546px;
        height: 840px;
        background-size: cover;
        backface-visibility: hidden;
        transition: 1.5s;
        position: absolute;
        top: 125px;
        left: 0;
        z-index: 10000;
        border-radius: 4px;
      }

      .img-list {
        display: flex;
        flex-wrap: wrap;
        transform: rotateY(-180deg);
        backface-visibility: hidden;
        transition: 1.5s;
        z-index: 9999;
        position: absolute;
        top: 80px;
        left: 0;

        .img-item {
          width: 260px;
          height: 374px;
          padding: 16px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #e3e3e3;
          &:hover {
            background: #ffffff;
            box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }
          &:nth-child(odd) {
            margin-right: 24px;
          }
          &:nth-child(1),
          &:nth-child(2) {
            margin-bottom: 24px;
          }

          .img {
            position: relative;
            width: 228px;
            height: 228px;
            overflow: hidden;
            background: #eee;
            .view {
              display: inline-block;
              background: url("//static.theone.art/pc/images/user1%402x.png");
              width: 24px;
              height: 24px;
              background-size: 100% 100%;
              position: absolute;
              right: 0;
              bottom: 0;
              z-index: 10;
            }
            .collect {
              min-width: 56px;
              height: 28px;
              background: rgba($color: #000000, $alpha: 0.7);
              border-radius: 4px;
              position: absolute;
              line-height: 28px;
              font-size: 12px;
              font-weight: 400;
              color: #ffffff;
              right: 8px;
              top: 8px;
              padding: 0 8px;

              i {
                background: url("//static.theone.art/pc/images/pic-home/heart%402x.png")
                  no-repeat;
                width: 18px;
                height: 18px;
                background-size: 100% auto;
                display: inline-block;
                vertical-align: middle;
                margin-right: 4px;
                margin-top: -4px;
                &.active {
                  background: url("//static.theone.art/pc/images/pic-home/heart-active%402x.png")
                    no-repeat;
                  background-size: 100% auto;
                }
              }
            }
            .imgurl {
              height: 100%;
              width: 100%;
              background-size: cover;
              position: relative;
            }
          }
          .img-title {
            font-size: 16px;
            color: #000000;
            margin-top: 16px;
            margin-bottom: 14px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            h1 {
              font-size: 12px;
              color: rgba($color: #000000, $alpha: 0.4);
              line-height: 16px;
            }
            span {
              font-size: 14px;
              color: rgba($color: #000000, $alpha: 0.7);
              line-height: 22px;

              &::before {
                content: "";
                background: url("//static.theone.art/pc/images/user5%402x.png")
                  no-repeat;
                background-size: 14px 14px;
                width: 14px;
                height: 14px;
                display: inline-block;
                vertical-align: middle;
                margin-top: -2px;
                margin-right: 4px;
              }

              &.money {
                color: #f4a33a;
                &::before {
                  display: none;
                }
              }

              &.sold {
                &::before {
                  content: "";
                  background: url("//static.theone.art/pc/images/sold%402x.png")
                    no-repeat;
                  width: 38px;
                  height: 20px;
                  background-size: 38px 20px;
                }
              }
            }
          }
        }
      }

      .hidden {
        display: none;
      }

      // &:hover {
      //   .single-img {
      //     transform: rotateY(180deg);
      //   }

      //   .img-list {
      //     transform: rotateY(0deg);
      //   }
      // }
      .single-img-transform {
        transform: rotateY(180deg);
      }
      .img-list-transform {
        transform: rotateY(0deg);
      }
    }
  }
  .btn-item {
    width: 200px;
    height: 46px;
    border-radius: 23px;
    border: 1px solid #e61f1a;
    text-align: center;
    line-height: 46px;
    font-size: 14px;
    color: #e61f1a;
    margin: 0 auto;
    cursor: pointer;
    margin-top: 70px;
    &:after {
      content: "";
      background: url("//static.theone.art/pc/images/arrowright3%402x.png")
        no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% auto;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 0 0 8px;
    }
  }
}
@media screen and (min-width: 541px) and (max-width: 960px) {
  .v1-page-index-swiper {
    width: 549px;
  }
  .swiper-slide {
    width: 549px;
  }
  .v1-page-index-swiper {
    padding-top: 70px;
  }
}
</style>
