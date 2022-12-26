<template>
  <div>
    <div class="mode-mobile"><m-header :title="'我买到的'" /></div>
    <div class="page-mobile-mine-buy">
      <van-tabs v-model="activeTab" sticky>
        <van-tab
          v-for="(item, index) in searchOption[type]"
          title-class="trade-van-tab"
          :title="item.name"
          :key="index"
        >
        </van-tab>
      </van-tabs>

      <page-template
        ref="PageT"
        :is_empty="
          !(orderListResult.records && orderListResult.records.length > 0)
        "
      >
        <common-card :records="orderListResult.records" :type="type" />
        <div class="v1-pagination" style="padding-bottom: 10vh">
          <g-paging
            :pageChange="handleCurrentChange"
            :list="orderListResult.records"
            :pageSize="10"
            :current-page="orderListResult.current"
          />
        </div>
      </page-template>
    </div>
  </div>
</template>
<script>
// import empty from "@/components/v1/empty";
// import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";
import commonCard from "./commonCard";
/* import Empty from "../../../../../components/v1/empty.vue"; */
export default {
  components: { mHeader, commonCard },
  props: {
    orderListResult: {
      type: Object,
    },
    type: String, //我买到的，我发布的，我卖出的
    searchOption: {
      type: Object,
    },
  },
  data() {
    return {
      loading: true,
      showEmpty: false,
      activeTab: 0,
      attentionListParam: {
        pageCount: 1,
        pageSize: 12,
        type: this.$route.params.type,
      },
      attentionListResult: null,
    };
  },
  computed: {},
  watch: {
    async activeTab(val, oldVal) {
      console.log(val);
      this.$refs.PageT.showLoading();
      await this.$parent.search(this.type, val);
      this.$refs.PageT.hideLoading();
    },
  },
  created() {},
  methods: {
    handleCurrentChange(val) {
      this.$parent.handleCurrentChange(val);
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mobile-mine-buy {
    background: #fafafa;
    padding-top: 1.08rem;
    height: 70vh;

    .people-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .v1-people-card {
        width: 3.24rem;
        height: 4.72rem;
        margin-bottom: 0.34rem;
        &:nth-child(odd) {
          margin-left: 0.34rem;
        }
        &:nth-child(even) {
          margin-right: 0.34rem;
        }
      }
    }
  }
}
</style>
