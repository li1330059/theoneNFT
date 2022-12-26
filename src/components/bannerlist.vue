<template>
  <div class="com-banner">
    <div class="banner-con">
      <swiper
        v-if="bannerList.length > 0"
        class="banner"
        :options="swiperOption"
      >
        <swiper-slide v-for="(item, index) in bannerList" :key="index">
          <div class="banner-item">
            <div
              class="pic"
              :style="`background-image:url(${item.cover})`"
            ></div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
// import "swiper/css/swiper.css";
import "swiper/dist/css/swiper.css";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: ["bannerList"],
  data() {
    return {
      swiperOption: {
        loop: true,
        autoplay: 2000,
        pagination: ".swiper-pagination",
      },
      loading: true,
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.com-banner {
  height: 313px;
  margin-bottom: 20px;
  .banner-con,
  .banner {
    height: 100%;
  }
  .banner-item {
    position: relative;
    height: 100%;
    .pic {
      width: 100%;
      height: 100%;
      background: no-repeat center center #000;
      // background-size: cover;
      background-size: 100%;
    }
  }
}
//
.iconClass {
  width: 30px;
  height: 30px;
  margin: 3% 8%;
  position: absolute;
  z-index: 2;
}
@media screen and (max-width: 1200px) {
  .com-banner {
    height: 38vw;
  }
}
@media screen and (min-width: 541px) and (max-width: 960px) {
  .com-banner {
    margin-bottom: 40px;
  }
}

@media screen and (max-width: 540px) {
  .com-banner {
    margin-bottom: 20px;
    margin-top: 28px;
  }
}
</style>
