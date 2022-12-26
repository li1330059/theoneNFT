<template>
  <div>
    <div class="mode-mobile"><m-header :title="'我喜欢的'" /></div>
    <div class="page-mine-collect">
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <empty v-else-if="showEmpty"></empty>

      <div v-else>
        <div class="v1-goods-list">
          <div
            class="v1-goods-wrap"
            v-for="(item, index) in collectListResult.records"
            :key="index"
          >
            <goods-frame
              :goods-info="item"
              :index="index"
              :isShowPrice="false"
              :isShowNumber="false"
              @listenCoverClick="listenCoverClick"
            >
            </goods-frame>
          </div>
        </div>
        <div class="v1-pagination">
          <g-paging
            :pageChange="handleCurrentChange"
            :list="collectListResult.records"
            :pageSize="collectListParam.pageSize"
            :current-page="collectListResult.current"
          />
        </div>
      </div>
    </div>
    <goodsDetail ref="goodsDetail" />
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";
import goodsDetail from "@/components/v1/modalfor3d/index";
export default {
  components: { empty, loading, mHeader, goodsDetail },
  data() {
    return {
      loading: true,
      showEmpty: false,
      collectListParam: {
        pageCount: 1,
        pageSize: 20,
        dataType: 2,
      },
      collectListResult: null,
    };
  },
  created() {
    this.collectList();
  },
  methods: {
    listenCoverClick(info) {
      if (info.saleRecord) {
        this.$common.goPage(`/goods/${info.saleRecord.id}`, "_blank");
      }
    },
    async collectList() {
      this.loading = true;
      let result = await this.$api.service.userLike_list(this.collectListParam);
      this.loading = false;
      this.collectListResult = result.data.data;
      this.showEmpty = !result.data.data.records.length > 0;
    },
    handleCurrentChange(val) {
      this.collectListParam.pageCount = val;
      this.collectList();
    },
    //喜欢及取消喜欢
    async likeGoods(id, name, dataType, idx) {
      let message1 = `您确定取消喜欢【${name}】吗?`;
      let message2 = `您已成功取消对【${name}】的喜欢！`;
      let collectParam = {
        dataId: id,
        type: 2,
        dataType: dataType,
      };
      let result = await this.$api.service.userLike_operation(collectParam);
      if (result.data.code == 200) {
        this.$message.success(message2);
        this.collectList();
        //this.collectListResult.records.splice(idx, 1);
      } else if (result.data.code !== 401) {
        this.$message.error("失败,请稍后重试");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.v1-goods-line h1 {
  display: inline-block;
}
.v1-goods-wrap {
  padding: 12px;
}
@media screen and (min-width: 541px) {
  .page-mine-collect {
    .loading {
      height: 500px;
    }
    .people-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .v1-people-card {
        margin: 0 12px 25px;
      }
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .v1-pagination {
    padding-bottom: 1.2rem;
  }
  .page-mine-collect {
    background: #fafafa;
    padding-top: 1.42rem;
    .loading {
      height: 8rem;
    }
  }
}
</style>
