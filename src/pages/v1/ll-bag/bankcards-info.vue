<template>
  <div class="ll-bag-body ll-max-width">
    <m-head :back="back" v-if="isShowHead"></m-head>
    <div class="body-content">
      <div v-if="newsDetail"><div v-html="newsDetail"></div></div>
      <div v-else class="des">暂无数据</div>
    </div>
  </div>
</template>
<script>
import MHead from "./components/m-head.vue";
export default {
  components: { MHead },
  data() {
    return { newsDetail: "" };
  },
  props: {
    back: {
      type: Function,
    },
    isShowHead: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  created() {
    if (this.back) {
    } else {
      this.getInfo();
    }
  },
  methods: {
    init() {
      this.getInfo();
    },
    async getInfo() {
      const res = await this.$api.service.dynamicNews_findNewsList({
        location: "ll_bank_list",
        pageCount: 1,
        pageSize: 10,
      });
      if (
        res.data.code == 200 &&
        res.data.data &&
        res.data.data.records.length > 0
      ) {
        const news_id = res.data.data.records[0].uuid;
        this.getDetail(news_id);
      } else {
        /*         this.$message.warning("没有数据"); */
      }
    },
    async getDetail(id) {
      let result = await this.$api.service.dynamicNews_findNews({
        uuid: id,
      });
      if (result.data.code == 200) {
        this.newsDetail = result.data.data.details;
      } else {
        /*     this.$message.warning(result.data.message); */
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.ll-bag-body {
  .body-content {
    overflow: auto;
    max-height: 700px;
    ::v-deep table {
      border: none;
      width: 100%;
      td {
        border: 1px solid #ffffff;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
        background: #f7f7f7;
        padding: 16px 10px;
      }
      tr:first-child {
        td {
          background: #eeeffa;
          font-weight: 600;
        }
      }
    }
  }
  @media screen and (max-width: 540px) {
    .body-content {
      max-height: inherit;
      overflow-y: initial;
      padding-bottom: 1rem;
    }
  }
}
.des {
  text-align: center;
  margin-top: 10vh;
}
</style>
