<template>
  <div
    class="screen-full active-exhibition-base-color"
    :style="`background-color:${datajson.bgColor}`"
  >
    <section class="m-banner">
      <picture>
        <source :srcset="datajson.bannerMobile" media="(max-width: 540px)" />
        <img
          class="banner responsive-img"
          :srcset="datajson.bannerPc"
          alt="pic"
        />
      </picture>
      <div class="introdution-img">
        <picture
          v-if="
            datajson.activeIntroductionBgImgMobile ||
            datajson.activeIntroductionBgImgPc
          "
        >
          <source
            :srcset="datajson.activeIntroductionBgImgMobile"
            media="(max-width: 540px)"
          />
          <img
            class="banner responsive-img"
            :srcset="datajson.activeIntroductionBgImgPc"
            alt="pic"
          />
        </picture>
      </div>
    </section>
    <section class="introdution-wrap px max-width z-index-1">
      <active-title
        title="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/t4.png"
      ></active-title>
      <div class="txt" v-html="datajson.activeIntroduction"></div>
    </section>
    <section class="px max-width z-index-1">
      <active-title
        :isRight="false"
        title="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/t2.png"
        des="排名不分先后，点击头像可查看艺术家主页"
      ></active-title>
    </section>

    <section
      class="art-wrap px max-width z-index-1"
      :class="{ 'open-art': isOpenArtList }"
    >
      <div
        class="art-face-box hand"
        v-for="item in authorList"
        :key="item"
        @click="openArt(item)"
      >
        <div class="box">
          <div class="frame bg-img" />
          <div
            class="user-face"
            :style="`background-image:url(${item.avator})`"
          ></div>
        </div>
        <div class="name hidden-1">{{ item.name }}</div>
      </div>
    </section>

    <div class="toggle-open-wrap art-open-btn" v-if="isAuthorListBtn">
      <div class="toggle-open" @click="toggleArts">
        <span class="ui-icon icon-p-righ"></span>
        <div class="txt">{{ isOpenArtList ? "收起全部" : "展开全部" }}</div>
        <span class="ui-icon icon-p-righ rotate"></span>
      </div>
    </div>
    <section class="px max-width z-index-1">
      <active-title
        title="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/t1.png"
        :des="`购买以下画作，可<span>${appendPrice}元</span>加购实体画作`"
      ></active-title>
    </section>
    <section
      class="goods-wrap px max-width z-index-1"
      :class="{ 'open-goods-wrap': isOpenGoods }"
    >
      <div
        class="goods-box"
        v-for="item in saleRecordList"
        :key="item"
        @click="openGoodsDetail(item)"
      >
        <goods-box :goodsObj="item"></goods-box>
      </div>
    </section>
    <div
      class="toggle-open-wrap goods-toggle-btn"
      v-if="isShowSaleRecordListBtn"
    >
      <div class="toggle-open" @click="toggleGoods">
        <span class="ui-icon icon-p-righ"></span>
        <div class="txt">{{ isOpenGoods ? "收起全部" : "展开全部" }}</div>
        <span class="ui-icon icon-p-righ rotate"></span>
      </div>
    </div>
    <div v-if="datajson.activeSceneImgs && datajson.activeSceneImgs.length > 0">
      <section class="px max-width z-index-1">
        <active-title
          :isRight="false"
          title="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/t3.png"
          des="可左右滑动查看现场图片"
        ></active-title>
      </section>
      <section class="px max-width z-index-1 swiper-wrap">
        <div class="swiper-block">
          <swiper :options="swiperOption">
            <swiper-slide
              v-for="(item, index) in datajson.activeSceneImgs"
              :key="index"
              class="swiper-slide"
            >
              <div
                class="bg-img img"
                :style="`background-image:url(${item.url})`"
              >
                <img
                  class="preview-img hand"
                  v-lazy="item.url"
                  :large="item.url"
                  preview="1"
                  preview-text="缩略图与大图模式"
                />
              </div>
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
      </section>
    </div>
  </div>
</template>
<script>
import "@/assets/1.0/scss/common.scss";
import writeThemeStyle from "./create-style";
import ActiveTitle from "./components/active-title.vue";
import GoodsBox from "./components/goods-box.vue";
import App from "@/utils/app/index";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
var goodsNum = 8;
const artNum = 12;
export default {
  components: { ActiveTitle, GoodsBox, SwiperSlide, Swiper },
  data() {
    return {
      active_id: "",
      swiperChangeButton: this.$common.isMobile() ? false : true,
      swiperOption: {
        slidesPerView: this.$common.isMobile() ? "auto" : 3,
        spaceBetween: this.$common.isMobile() ? 12 : 27,
        prevButton: `.goods-relationship-swiper-button-prev`,
        nextButton: `.goods-relationship-swiper-button-next`,
      },
      isOpenArtList: false,
      isOpenGoods: false,
      saleRecordList: [],
      isShowSaleRecordListBtn: false,
      authorList: [],
      authorListRef: [],
	  statusEnable:"",
      isAuthorListBtn: false,
      saleRecordListRef: [],
      appendPrice: "",
      datajson: {
        bannerMobile:
          "", //手机端banner
        bannerPc:
          "", //电脑端banner
        bgColor: "#10131F", //背景色
        color: "#FFFFFF",
        activeIntroduction: "我是活动简介", //活动简介
        activeIntroductionBgImgMobile:
          "", //可选，手机端活动简介背景图
        activeIntroductionBgImgPc:
          "", //可选，电脑端活动简介背景图
        activeSceneImgs: [],
      },
    };
  },
  created() {
    this.loading = true;
	goodsNum = this.$common.isMobile() ? 8 : 16;
    this.init();
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    init() {
      writeThemeStyle({
        baseColor: { color: this.datajson.color },
      });
      this.getActiveInfo();
    },
    openArt(item) {
      if (App.browser.theone.isTheOne) {
        App.$methods.goPageArtDetail(item.id);
      } else {
        window.location.href = `/user/${item.id}`;
      }
    },
    openGoodsDetail(item) {
      if (!this.active_id) {
        this.$message.warning("未找到活动id");
        return;
      }
	  if (!this.statusEnable) {
	    this.$message.warning("该活动已停用");
	    return;
	  }
      // if (item.statusSale == 2 || item.statusSale == 3) {
      //   return;
      // }
      if (App.browser.theone.isTheOne) {
        App.$methods.goPageGoodsDetail(item.id, this.active_id);
      } else {
        window.location.href = `/goods/${item.id}?active_id=${this.active_id}`;
      }
    },
    async getActiveInfo() {
      const res = await this.$api.service.exhibition_getByKey({
        key: this.$route.params.key,
      });
      if (res.data.code == 200) {
        this.active_id = res.data.data.id;
        this.authorListRef = res.data.data.authorList;
		this.statusEnable = res.data.data.statusEnable;
        if (res.data.data.dataJson) {
          this.datajson = {
            ...this.datajson,
            ...JSON.parse(res.data.data.dataJson),
          };
        }

        if (this.authorListRef.length > artNum) {
          this.isAuthorListBtn = true;
        }
        this.authorList = JSON.parse(JSON.stringify(this.authorListRef)).splice(
          0,
          artNum
        );

        this.saleRecordListRef = res.data.data.saleRecordList;

        this.appendPrice = res.data.data.appendPrice;
        if (this.saleRecordListRef.length > goodsNum) {
          this.isShowSaleRecordListBtn = true;
        }
        this.saleRecordList = JSON.parse(
          JSON.stringify(this.saleRecordListRef)
        ).splice(0, goodsNum);
      }
    },

    toggleGoods() {
      if (this.isOpenGoods) {
        this.isOpenGoods = false;
        this.saleRecordList = JSON.parse(
          JSON.stringify(this.saleRecordListRef)
        ).splice(0, goodsNum);
      } else {
        this.saleRecordList = JSON.parse(
          JSON.stringify(this.saleRecordListRef)
        );
        this.isOpenGoods = true;
      }
    },
    toggleArts() {
      if (this.isOpenArtList) {
        this.isOpenArtList = false;
        this.authorList = JSON.parse(JSON.stringify(this.authorListRef)).splice(
          0,
          artNum
        );
      } else {
        this.authorList = JSON.parse(JSON.stringify(this.authorListRef));
        this.isOpenArtList = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.introdution-wrap{
	margin-top:32px;
}
.preview-img {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}
.goods-toggle-btn {
  margin-top: 25px;
  margin-bottom: 68px;
  @media screen and (max-width: 540px) {
	  margin-bottom: 40px;
  }
}
.introdution-wrap {
  .txt {
    padding: 37px 0 60px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    line-height: 30px;
  }
  @media screen and (max-width: 540px) {
    .txt {
		font-size: 13px;
		padding: 0.33rem 0.43rem 0.6rem;
    }
  }
}
.goods-wrap {
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
  padding-bottom: 20px;
  .goods-box {
    width: 25%;
    padding: 9px;
  }
  @media screen and (max-width: 540px) {
    padding: 0.3rem 0.3rem 0;
    .goods-box {
      width: 50%;
      padding: 0.15rem;
    }
  }
}
.swiper-wrap {
  margin-top: 45px;
  @media screen and (max-width: 540px) {
	margin-top: 30px;
    padding-left: 0.46rem;
  }
}
.swiper-block {
  .img {
    width: 100%;
    height: 234px;
    border-radius: 20px;
    border: 1px solid #00b99f;
    background-size: cover;
  }
  @media screen and (max-width: 540px) {
    .swiper-slide {
      width: 5.2rem;
    }
    .img {
		width: 5.2rem;
		height: 3.48rem;
    }
  }
}
.open-goods-wrap {
}
.toggle-open-wrap {
  display: flex;
  justify-content: center;
  .toggle-open {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 23px 40px;
    border-radius: 100px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    .txt {
      font-size: 20px;
      font-weight: 500;
      padding: 0 30px;
    }
    .ui-icon {
      width: 40px;
      height: 19px;
    }
  }
  @media screen and (max-width: 540px) {
    .toggle-open {
      padding: 0;
	  width: 3.52rem;
	  height: .9rem;
	  line-height: .9rem;
      font-size: 0.28rem;
      .ui-icon {
        width: 0.43rem;
        height: 0.23rem;
      }
	  .txt{
		  font-size: .28rem;
		  padding: 0 .24rem;
	  }
    }
  }
}
.art-open-btn {
  margin-bottom: 68px;
  position: relative;
  @media screen and (max-width: 540px) {
    margin-bottom: 0.7rem;
  }
}
.icon-p-righ {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icon-right-p.png");
}

.rotate {
  transform: rotate(-180deg);
}
.art-wrap {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  padding-top: 23px;
  margin-bottom: 10px;
}
.art-face-box {
  width: 16.66%;
  padding-bottom: 35px;
  overflow: hidden;

  .name {
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    line-height: 44px;
    text-align: center;
  }
  .box {
    position: relative;
    width: 120px;
    top: 0;
    left: 0;
    height: 120px;
    margin: 0 auto;
    overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
    .frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 100px;
      z-index: 3;
      height: 100px;
      // background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icon-frame.png");
    }
    .user-face {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      width: 100px;
      height: 100px;
	  border: 3px solid #00B99F;
	  border-radius: 100%;
    }
  }
  &:hover {
    .box {
		border: 1px solid #00B99F;
		border-radius: 100%;
      .frame {
        // background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icon-frame-hover.png");
      }
    }
  }
  @media screen and (max-width: 540px) {
    width: 25%;
    padding-bottom: 0.45rem;
    .box {
      width: 1.32rem;
      height: 1.32rem;
	  .frame {
	    // background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icon-frame-m.png");
	  }
	  .user-face {
	    width: 100%;
	    height: 100%;
	  }
    }
  }
}
.screen-full {
  min-height: 100vh;
  padding-bottom: 157px;
  @media screen and (max-width: 540px) {
	  padding-bottom: 117px;
  }
}
.z-index-1 {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
}
.max-width {
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
}
.px {
  /*   padding-right: 10px;
  padding-left: 10px; */
}
.m-banner {
  position: relative;
  top: 0;
  left: 0;
  .introdution-img {
    position: absolute;
    bottom: 1px;
    left: 0;
    width: 100%;
    transform: translateY(100%);
    z-index: 0;
  }
}
.goods-relationship-swiper-button-prev,
.goods-relationship-swiper-button-next {
  width: 46px;
  height: 46px;
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icons/icon-p-right-noraml.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 46px 46px;
  position: absolute;
  cursor: pointer;
  top: 50%;
  z-index: 99;
  &:hover {
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icons/icon-p-right-hover.png");
  }
}
.swiper-button-disabled {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icons/icon-p-right-disabled.png") !important;
}
.goods-relationship-swiper-button-prev {
  transform: translate(-120%, -50%) rotate(180deg);
}
.goods-relationship-swiper-button-next {
  right: 0;
  transform: translate(120%, -50%);
}
/* .m-content {
  position: relative;
  top: 0;
  left: 0;
} */
</style>
