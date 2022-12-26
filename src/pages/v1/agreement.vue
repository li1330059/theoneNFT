<template>
  <div>
    <div class="ui-body">
      <status-template
        :list="pageInfo.details"
        api="/market/api/dynamicNews/list"
        :init="getArticle"
      >
        <div class="html-wrap" v-html="pageInfo.details"></div>
      </status-template>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      isShow: false,
      id: null,
      location: "",
      pageInfo: {},
    };
  },
  mounted() {
    this.location = this.$route.params.location;
    this.isShow = this.$route.query.is_show;
    this.getArticle();
  },
  methods: {
    back() {
      this.$router.back();
    },
    async getArticle() {
      let result = await this.$api.service.dynamicNews_list({
        location: this.location,
      });
      if (result.data.code == 200) {
        this.pageInfo = result.data.data[0] || {};
        if (this.pageInfo.name) {
          document.title = this.pageInfo.name;
        }
      }
    },
  },
};
</script>
<style lang="scss">
.m-phone-header {
  margin-top: constant(safe-area-inset-top);
  margin-top: env(safe-area-inset-top);
  z-index: 999;
  height: 1.08rem;

  @media screen and (max-width: 540px) {
    display: block;
    .main {
      width: 100%;
      background: #fff;
      height: 1.08rem;
      position: fixed;
      z-index: 999;
      padding: 0 0.32rem;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.36rem;
      font-weight: 500;
      color: #333333;
      margin-top: constant(safe-area-inset-top);
      margin-top: env(safe-area-inset-top);
      .icon-direction {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("//static.theone.art/pc/icons/icon-left-direction.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .placeholder {
        width: 0.4rem;
      }
      .txt {
        flex: 1;
        margin-left: -0.64rem;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.ui-body {
  max-width: 830px;
  margin: 0 auto;
}
.html-wrap {
  color: #333333;
  margin: 20px auto;
  box-sizing: border-box;
  line-height: 30px;
  padding: 30px 16px 100px;
}
@media screen and (max-width: 540px) {
  .ui-body {
    padding: 0 0.3rem;
  }

  .html-wrap {
    max-width: inherit;
    padding: 0.4rem 0.16rem 2rem;
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
