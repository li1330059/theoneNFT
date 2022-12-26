<template>
  <transition name="fade">
    <div class="success-dialog-body animate" v-if="isShow">
      <div class="mask filter-mask"></div>
      <div class="main" :class="[isType ? 'main-border' : '']">
        <div
          class="res-content"
          :class="{ 'content-wrap-aniamte': palyAnimate }"
          :style="`background:${borderColor}`"
        >
          <img class="title-img" :src="successTitle" />
          <img class="coloured-top" :src="top" />
          <img class="coloured-bottom" :src="bottom" />
          <div
            class="content-wrap"
            :style="`background-image:url(${bg});background-color:${ctxColor}`"
          >
            <div class="" v-if="goodsArr.length == 1">
              <div class="get-goods-wrap">
                <div class="goods-box" style="width: 100%">
                  <div
                    class="goods-wrap bg-img"
                    :style="`background-image:url(${
                      goodsArr[0].commodity && goodsArr[0].commodity.cover
                    })`"
                  ></div>
                  <div class="hidden-one goods-name">
                    <div class="txt hidden-one">
                      {{ goodsArr[0].commodity.name }}
                    </div>
                    <div class="num">*1</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="" v-else>
              <swiper ref="marketSwiperRef" :options="swiperOption">
                <swiper-slide v-for="(item1, idx) in goodsArr" :key="idx">
                  <div class="get-goods-wrap">
                    <div
                      class="goods-box"
                      v-for="(item, idx) in item1"
                      :key="idx"
                    >
                      <div
                        class="goods-wrap bg-img"
                        :style="`background-image:url(${
                          item.commodity && item.commodity.cover
                        })`"
                      ></div>
                      <div class="goods-name">
                        <div class="txt hidden-one">
                          {{ item.commodity.name }}
                        </div>
                        <div class="num">*1</div>
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
              <div class="j-prev s-prev ui-icon s-btn" slot="button-prev"></div>
              <div
                class="j-next s-next ui-icon s-btn icon-rotate"
                slot="button-next"
              ></div>
            </div>

            <div class="footer">
              <!--             <div class="left ui-icon icon-border"></div> -->
              <div class="info">
                <!--      <div class="goods-name">
                {{ goodsArr.commodity && goodsArr.commodity.name }}
              </div> -->
                <!-- <div class="message" v-if="isTip">
                  奖品已被抽空，已为您兑换成相应的积分。
                </div> -->
                <div class="txt">
                  <span class="small">去</span
                  ><span class="link hand" @click="goCollect">我的藏品</span
                  ><sapn class="small">查看</sapn>
                </div>
              </div>
              <!--       <div class="right ui-icon icon-border icon-rotate"></div> -->
            </div>
          </div>
        </div>
        <img
          class="close hand"
          @click="hide"
          src="//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-success-close.png"
        />
      </div>
    </div>
  </transition>
</template>
<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
export default {
  components: { Swiper, SwiperSlide },
  props: {
    top: {
      type: String,
      default: "",
    },
    bottom: {
      type: String,
      default: "",
    },
    successTitle: {
      type: String,
      default: "",
    },
    bg: {
      type: String,
      default: "",
    },
    borderColor: {
      type: String,
      default: "#ffd49d",
    },
    ctxColor: {
      type: String,
      default: "#fff5e6",
    },
    activeObj: {
      type: String,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      palyAnimate: false,
      swiperOption: {
        paginationClickable: true,
        spaceBetween: 0,
        slidesPerView: 1,
        updateTranslate: true,
        prevButton: `.j-prev`,
        nextButton: `.j-next`,
        /* 
        autoplay: 5000, */
      },
      isShow: false,
      isTip: false,
      goodsArr: [],
    };
  },
  created() {
    console.log(this.goodsArr);
    /*     this.goodsArr = this.splitGroup(this.goodsArr, 4); */
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
    isType() {
      return this.activeObj.luckySpinType !== "LOTTERY";
    },
  },
  methods: {
    splitGroup(arr, size) {
      // arr是一维数组 size是二维数组包含几条数据
      let arr2 = [];
      for (let i = 0; i < arr.length; i = i + size) {
        arr2.push(arr.slice(i, i + size));
      }
      return arr2; // 新的二维数组
    },

    hide() {
      this.isShow = false;
    },
    show() {
      this.isShow = true;
      if (this.activeObj.luckySpinType !== "LOTTERY") {
        this.$nextTick(() => {
          this.palyAnimate = true;
        });
      }
    },
    init(goodsArr) {
      this.goodsArr = goodsArr;
      if (goodsArr && goodsArr.length > 1) {
        this.isTip = this.goodsArr.find((item) => {
          return item.awardType == 2;
        })
          ? true
          : false;
        this.goodsArr = this.splitGroup(goodsArr, 4);
      } else {
        this.isTip = this.goodsArr[0].awardType == 2;
      }

      this.show();
    },
    goCollect() {
      this.$router.push(`/mine/treasure`);
    },
  },
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.content-wrap-aniamte {
  animation: content-rotate 0.6s linear;
}
@keyframes content-rotate {
  0% {
    transform: scale(0.1);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.icon-border {
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-border.png");
}

.s-btn {
  position: absolute;
  cursor: pointer;
  width: 40px;
  height: 40px;
  top: 45%;
  z-index: 9;
  /*   transform: translate(120%, -50%); */
  @media screen and (max-width: 540px) {
    width: 0.5rem;
    height: 0.5rem;
    top: 48%;
  }
}
.s-next {
  right: 30px;

  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-p-left-normal.svg");
  &.swiper-button-disabled {
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-p-left.svg");
  }
}
.s-prev {
  left: 30px;
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-p-left-normal.svg");
  &.swiper-button-disabled {
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-p-left.svg");
  }
}
.icon-rotate {
  transform: rotateY(180deg);
}
.coloured-top {
  display: block;
  position: absolute;
  top: -7px;
  left: -13px;
  width: 108px;
}
.coloured-bottom {
  display: block;
  position: absolute;
  bottom: -15px;
  right: -18px;
  width: 84px;
}
.main-border {
  .res-content {
    background: #ffefd4 !important;
    .content-wrap {
      border: 1px solid rgba(255, 177, 0, 1);
      background: #ffefd4 !important;
    }
  }
  @media screen and (max-width: 540px) {
    .res-content {
      padding: 0.2rem 0.2rem !important;
      .content-wrap {
        padding-top: 0.62rem !important;
      }
    }
  }
}
@media screen and (max-width: 540px) {
  .coloured-top {
    top: -0.08rem;
    left: -0.16rem;
    width: 1.39rem;
  }
  .coloured-bottom {
    bottom: 0.4rem;
    right: -0.25rem;
    width: 1.1rem;
  }
}
.success-dialog-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.main {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  max-width: 478px;
  transform: translate(-50%, -50%);

  .t-img {
    display: block;
    margin: 0 auto -110px;
    width: 338px;
  }
  .res-content {
    border-radius: 10px;
    padding: 10px;
    position: relative;
    top: 0;
    left: 0;
    .title-img {
      display: block;
      width: 247px;
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      @media screen and (max-width: 540px) {
        width: 54%;
        top: -0.14rem;
      }
    }
    .content-wrap {
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: 10px;
      padding: 58px 30px 33px;
    }
    .get-goods-wrap {
      display: flex;
      flex-wrap: wrap;
      padding: 0 55px;
      .goods-box {
        width: 50%;
        padding: 12px;
        .goods-name {
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          text-align: center;
          margin-top: 8px;
          display: flex;
          justify-content: center;
          .txt {
          }
        }
        .goods-wrap {
          padding-bottom: 100%;
          background-size: contain;
        }
        .small-goods {
          padding-bottom: 45%;
        }
      }
    }
  }
  .footer {
    display: flex;
    .icon-border {
      width: 35px;
      height: 75px;
    }
    .info {
      flex: 1;
      .message {
        font-size: 16px;
        font-weight: 500;
        color: #666666;
        text-align: center;
        margin-top: 10px;
      }
    }
    .goods-name {
      font-size: 16px;
      font-weight: 500;
      color: #222222;
      text-align: center;
      margin-bottom: 13px;
    }
    .txt {
      font-weight: 400;
      color: #222222;
      text-align: center;
      margin-top: 10px;
      .small {
        font-size: 16px;
      }
      .link {
        font-size: 24px;
        text-decoration: underline;
      }
    }
  }
  .close {
    display: block;
    width: 53px;
    margin: 52px auto 0;
  }
  @media screen and (max-width: 540px) {
    .t-img {
      display: block;
      margin: 0 auto -0.7rem;
      width: 2.14rem;
    }
    .res-content {
      border-radius: 0.1rem;
      padding: 1.4rem 0.2rem 0.2rem;
      .content-wrap {
        padding: 0.58rem 0.3rem 0.33rem;
      }
      .get-goods-wrap {
        display: flex;
        .goods-box {
          flex: 1;
          padding: 5px;
          .goods-wrap {
          }
          .goods-name {
            font-size: 0.22rem;
          }
          .small-goods {
            padding-bottom: 45%;
          }
        }
      }
    }
    .close {
      width: 0.6rem;
      margin-top: 0.4rem;
    }
    .footer {
      .goods-name {
        font-size: 0.24rem;
        font-weight: 500;
        color: #222222;
        text-align: center;
        margin-bottom: 0.15rem;
      }
      .info {
        .message {
          font-size: 0.24rem;
        }
      }
      .txt {
        font-weight: 400;
        color: #222222;
        text-align: center;
        .small {
          font-size: 0.22rem;
        }
        .link {
          font-size: 0.32rem;
        }
      }
    }
  }
}
</style>
