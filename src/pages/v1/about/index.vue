// 关于唯一艺术
<template>
  <div class="content" v-if="pageInfo">
    <!-- <div class="mode-mobile">
      <m-header :title="pageInfo.name" />
    </div> -->
    <div class="img" :style="`background: url(${pageInfo.cover?pageInfo.cover:''}) no-repeat center;background-size: cover`"></div>
    <div class="v1-module-title">{{pageInfo.name}}</div>
    <div class="text" v-html="pageInfo.details"></div>
  </div>
</template>
<script>
// import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: {  },
  data() {
    return {
      pageInfo: null
    };
  },
  created() {
    this.getDetails();
  },
  methods: {
    async getDetails() {
      let result = await this.$api.service.dynamicNews_list({
        location: "about_us"
      });
      if (result.data.code == 200) {
        this.pageInfo = result.data.data[0];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.loading {
  height: 500px;
}
.img {
  width: 100%;
  height: 280px;
  background: url("//static.theone.art/pc/images/about.png") no-repeat center;
  background-size: cover;
  margin-bottom: 80px;
}
p {
  color: rgba(102, 102, 102, 1);
  font-size: 14px;
  margin-bottom: 16px;
  text-indent: 2em;
}
.text {
  max-width: 967px;
  margin: 0px auto 250px;
  line-height: 25px;
}
@media screen and (min-width: 541px) and (max-width: 960px) {
  .img {
    height: 155px;
    margin-bottom: 30px;
  }
  .text {
    margin: 0 30px 100px;
    font-size: 10px;
    line-height: 25px;
  }
}
@media screen and (max-width: 541px) {
  .content {
    // margin-top: 55px;
  }
  .img {
    height: 115px;
    margin-bottom: 30px;
  }
  .text {
    margin: 0 16px 100px;
    font-size: 10px;
    line-height: 20px;
  }
}
</style>
