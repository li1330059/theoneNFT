<template>
  <div
    :class="`page-goods-relationship ${type}`"
    v-if="goodsListResult && goodsListResult.length > 0"
  >
    <div class="v1-module-title">{{ title }}</div>
    <div class="content">
      <div class="mode-PC">
        <div class="series-swiper">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item, index) in goodsListResult" :key="index">
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
          <div
            class="v1-goods-wrap"
            v-for="(item, index) in goodsListResult"
            :key="index"
          >
            <goods-frame
              class="v1-goods"
              :goods-info="item"
              @listenLike="likeGoods"
              :index="index"
              :isShowPreview="true"
              @listenCoverClick="listenCoverClick"
            >
            </goods-frame>
         
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
    type: String,
    id: String,
    data_value: String,
  },
  data() {
    return {
      title: "",
      swiperChangeButton: false,
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
      goodsListResult: null,
    };
  },
  created() {
    if (this.type == "same") {
      this.title = "相关作品";
      this.goodsListParam.commodityId = this.data_value;
    } else if (this.type == "author") {
      this.title = "同作家作品";
      this.goodsListParam.authorId = this.data_value;
    } else if (this.type == "like") {
      this.title = "猜你喜欢";
      this.goodsListParam.like = true;
    }
    this.goodsList();
  },
  methods: {
    listenCoverClick(info) {
      this.$common.goPage(`/goods/${info.id}`, "_blank");
    },
    async goodsList() {
      try {
        let sigData = "";
        let sig = await this.$api.service.goods_key();
        if (sig.data.code == 200) {
          let dataresult = aes.decrypt(sig.data.data);
          let dataResultFun = dataresult.split(",")[0].substr(4);
          let dataResultId = dataresult.split(",")[1].split("=")[1];
          let sigresult = eval(dataResultFun);
          sigData = aes.encryptSelf(dataResultId, sigresult);
        }
        let result = await this.$api.service.saleRecord_list_v2(
          this.goodsListParam,
          null,
          sigData
        );
        if (result && result.data.data) {
          this.goodsListResult = result.data.data.records;
          if (this.goodsListResult.length > 4) {
            this.swiperChangeButton = true;
          }
        }
      } catch (error) {}
    },
    //商品喜欢与取消
    async likeGoods({ id, like, name, index }) {
      let likeGoodsParm = {
        dataId: id,
        type: 2,
        dataType: 2,
      };
      if (like) {
        let message1 = `您将取消喜欢【${name}】?`;
        let message2 = `您已成功取消对【${name}】的喜欢！`;
        /*   this.$confirm(message1, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(async () => {
      
        }); */
        let result = await this.$api.service.userLike_operation(likeGoodsParm);
        if (result.data.code == 200) {
          this.$message.success(message2);
          this.goodsListResult[index].like = false;
          this.goodsListResult[index].commodity.amountLike--;
        } else if (result.data.code !== 401) {
          this.$message.error("失败,请稍后重试");
        }
      } else {
        likeGoodsParm.type = 1;
        let result = await this.$api.service.userLike_operation(likeGoodsParm);
        if (result.data.code == 200) {
          this.$message.success("成功");
          this.goodsListResult[index].like = true;
          this.goodsListResult[index].commodity.amountLike++;
        } else if (result.data.code !== 401) {
          this.$message.error("失败,请稍后重试");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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
    transform: translate(-120%, -50%);
    z-index: 99;
  }
  .goods-relationship-swiper-button-next {
    background-image: url("//static.theone.art/pc/images/pic-home/goods-right.png");
    right: 0;
    transform: translate(120%, -50%);
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
