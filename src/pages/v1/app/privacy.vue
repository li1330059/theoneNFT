<template>
  <div class="news">
    <div class="mode-mobile">
      <m-header :title="`详情`" />
    </div>
    <div class="news-banner bg-img"></div>
    <status-template
      :list="newsDetail.details"
      api="/base/api/dynamicNews/findNews"
      :init="getNewsInfo"
    >
      <div class="news-content">
        <div class="news-title">
          <h2>{{ newsDetail.name }}</h2>
          <p>{{ newsDetail.releaseTime }}</p>
        </div>
        <div class="news-detail" v-html="newsDetail.details"></div>
      </div>
    </status-template>
  </div>
</template>
<script>
import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { mHeader },
  data() {
    return {
      id: null,
      loading: false,
      newsDetail: {},
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getNewsInfo();
  },
  methods: {
    async getNewsInfo() {
      try {
        this.loading = true;
        let result = await this.$api.service.dynamicNews_findNews({
          uuid: this.id,
        });
        this.newsDetail = result.data.data;
        if (result.data.code == 500) {
          this.$message.error("请稍后重试");
          this.loading = false;
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style lang="scss">
.news {
  min-height: 70vh;
  padding-bottom: 100px;
  .news-detail {
    word-break: break-all;
    white-space: pre-wrap;
    img {
      max-width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
.news-banner {
  height: 200px;
  background-image: url("//static.theone.art/pc/news/news-detail-banner.png");
}
.news-content {
  max-width: 830px;
  margin: 0 auto;
}

.news-title {
  h2 {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    line-height: 26px;
    padding: 20px 0;
  }
  p {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
  }
}
.news-detail {
  color: #333333;
  margin: 20px auto;
  box-sizing: border-box;
  line-height: 30px;
}
//     @media screen and (min-width: 541px) and (max-width: 960px) {

//   }
@media screen and (max-width: 540px) {
  .news-content {
    padding: 0 0.3rem;
  }
  .news-banner {
    display: none;
  }
  .news-title {
    padding-top: 70px;
    h2 {
      font-size: 0.28rem;
      padding: 0;
    }
    p {
      font-size: 0.24rem;
      color: #999999;
    }
  }
  .news-detail {
    font-size: 0.26rem;
    font-weight: 400;
    color: #666666;
    line-height: 0.4rem;
    margin: 0.2rem auto;
    img {
      max-width: 100%;
    }
  }
}
</style>