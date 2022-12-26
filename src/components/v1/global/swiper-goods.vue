<template>
  <div
    :class="`page-goods-relationship ${type}`"
    v-if="list && list.length > 0"
  >
    <div class="content">
      <div class="mode-PC">
        <div class="series-swiper">
          <swiper :options="swiperOption">
            <swiper-slide
              v-for="(item, index) in list"
              :key="index"
              class="goos-wrap"
            >
              <goods-frame
                :goods-info="item"
                @listenLike="likeGoods"
                :index="index"
                :isShowPreview="true"
                @listenCoverClick="listenCoverClick"
              >
              </goods-frame>
            </swiper-slide>
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
      </div>

      <div class="mode-mobile">
        <div class="v1-goods-list">
          <div class="goods-wrap" v-for="(item, index) in list" :key="index">
            <goods-frame
              :goods-info="item"
              @listenLike="likeGoods"
              :index="index"
              :isShowPreview="true"
              @listenCoverClick="listenCoverClick"
            >
            </goods-frame>
          </div>
          <div class="goods-wrap" v-if="isShowMore">
            <div @click="go" class="placehaldle bg-img"></div>
          </div>
        </div>
      </div>
    </div>
    <goodsDetail ref="goodsDetail" />
  </div>
</template>
<script>
if (window.e) {
  window.e = "4tBlCLWFZ3eD93CvDE2lpw==";
}
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import goodsDetail from "@/components/v1/modalfor3d/index";
import "swiper/dist/css/swiper.css";
import aes from "@/utils/aes";
export default {
  components: { Swiper, SwiperSlide, goodsDetail },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    isShowMore() {
      if (!this.$common.isMobile()) {
        return false;
      }
      const num = this.list.length;
      if (num % 2 === 0) {
        return false;
      } else {
        //奇数
        return true;
      }
    },
    swiperChangeButton() {
      return this.list.length > 4;
    },
  },
  data() {
    return {
      title: "",
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 30,
        prevButton: `.${this.type} .goods-relationship-swiper-button-prev`,
        nextButton: `.${this.type} .goods-relationship-swiper-button-next`,
      },
      goodsListParam: {
        authorId: "",
        chainContract: "",
        commodityCategoryId: "",
        commodityId: "",
        highPrice: "",
        lowPrice: "",
        like: "",
        pageCount: 1,
        pageSize: 20,
        seriesWorks: "",
        seriesWorksId: "",
        sort: {
          field: 1,
          upOrDown: 2,
        },
        statusSell: "",
        topicId: "",
        typeMarket: "",
      },
    };
  },
  created() {},
  methods: {
    go() {
      this.$router.push("/market?type=derive");
    },
    listenCoverClick(info) {
		this.$sensors.track('homepage_click', {
			module_name: "衍生品"
		});
      console.log(info);
      if (info.jumpLevel == 4) {
        this.$common.goPage(
          `/market?type=2&category_id=${info.commodity.commodityCategoryUuid}&name_id=${info.commodity.uuid}`,
          "_blank"
        );
      } else if (info.jumpLevel == 3) {
        this.$common.goPage(
          `/market?type=2&category_id=${info.l3CategoryUuid}`,
          "_blank"
        );
      } else {
        this.$message.warning("参数错误");
      }
    },

    //商品喜欢与取消
    async likeGoods(info) {
        const { id, like, index } = info;
        console.log(info);
      let likeGoodsParm = {
        dataId: id,
        type: 2,
        dataType: 2,
      };
      if (like) {
		  this.$sensors.track('homepage_click', {
			module_name:"衍生品",
		  	derivation_save: "取消收藏"
		  });
        let message2 = `取消成功！`;
        /*   this.$confirm(message1, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(async () => {
      
        }); */
        let result = await this.$api.service.userLike_operation(likeGoodsParm);
        if (result.data.code == 200) {
          this.$message.success(message2);
          this.list[index].like = false;
          this.list[index].commodity.amountLike--;
        } else if (result.data.code !== 401) {
          this.$message.error("失败,请稍后重试");
        }
      } else {
		  this.$sensors.track('homepage_click', {
			module_name:"衍生品",
		  	derivation_save: "收藏"
		  });
        likeGoodsParm.type = 1;
        let result = await this.$api.service.userLike_operation(likeGoodsParm);
        if (result.data.code == 200) {
          this.$message.success("成功");
          this.list[index].like = true;
          this.list[index].commodity.amountLike++;
        } else if (result.data.code !== 401) {
          this.$message.error("失败,请稍后重试");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.goos-wrap {
  padding: 16px 0;
  ::v-deep .goods-frame-box {
    &:hover {

    }
  }
}
.placehaldle {
  height: 100%;
  background-image: url("//static.theone.art/pc/index/icon-placehaldle.png");
  background-size: cover;
}
.v1-goods-cover {
  .cover-wrap {
    position: absolute;
  }
}
.page-goods-relationship {
  .v1-module-title {
    margin-bottom: 60px;
  }
  .v1-goods {
    width: 100%;
    margin: 0px;
  }

  .series-swiper {
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
    transform: translate(-170%, -50%);
    z-index: 99;
  }
  .goods-relationship-swiper-button-next {
    background-image: url("//static.theone.art/pc/images/pic-home/goods-right.png");
    right: 0;
    transform: translate(170%, -50%);
  }
  .v1-goods-line {
    .v1-title,
    .v1-icon-skuno {
      display: inline-block;
    }
  }
}
.v1-goods-line h1 {
  align-items: center;
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 541px) {
  .v1-goods-list {
    padding: 0 0.25rem;
  }
  .goods-wrap {
    width: 50%;
    padding: 0.07rem;
  }
  .page-goods-relationship {
    .v1-module-title {
      margin-bottom: 0.6rem;
    }
    .v1-goods {
      width: auto;
      margin: 0.32rem;
    }
  }
}
</style>
