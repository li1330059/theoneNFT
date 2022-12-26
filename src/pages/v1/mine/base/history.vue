<template>
  <div>
    <div class="mode-mobile"><m-header :title="'历史浏览'" /></div>
    <div class="page-mine-history">
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <empty v-else-if="showEmpty"></empty>

      <div v-else>
        <div class="v1-goods-list">
          <!--     <goodsCard
            v-for="(item, index) in collectListResult.records"
            :key="index"
            :goods="item"
            :isPrice="false"
            :go="go"
          /> -->
          <preview-img
            v-for="(item, index) in collectListResult.records"
            :key="index"
            class="img-wrap"
            :cover="item.commodity && item.commodity.cover"
            :info="item"
          ></preview-img>
        </div>
        <div class="v1-pagination">
          <g-paging
            :pageChange="handleCurrentChange"
            :pageSize="collectListParam.pageSize"
            :list="collectListResult.records"
            :current-page="collectListResult.current"
          />
        </div>

        <goodsDetail ref="goodsDetail" />
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";
import goodsCard from "./goodsCard.vue";
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
        dataType: 1, //1商品 2出售记录 3商品sku
      },
      collectListResult: null,
    };
  },
  created() {
    this.collectList();
  },
  methods: {
    go(info) {
      this.$router.push(
        `/market?key=${info.commodity.name}&id=${info.commodity.id}`
      );
    },
    async collectList() {
      this.loading = true;
      let result = await this.$api.service.userHistory_list(
        this.collectListParam
      );
      this.loading = false;
      this.collectListResult = result.data.data;
      this.$previewRefresh();
      this.showEmpty = !this.collectListResult.records.length > 0;
    },
    handleCurrentChange(val) {
      this.collectListParam.pageCount = val;
      this.collectList();
    },
    showGoodsAnimate(item) {
      this.$refs["goodsDetail"].open(item.commodity.cover);
    },
    toggleLike(goods) {
      return;
      /* 
      const type = goods.like ? 2 : 1;

      const goods_name = goods.name || "";
      let collectParam = {
        dataId: goods.id,
        type,
        dataType: 1,
      };
      if (type == 2) {
        this.$confirm(`您确定取消喜欢【${goods_name}】吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(async () => {
          let result = await this.$api.service.userLike_operation(collectParam);
          if (result.data.code == 200) {
            this.$message.success(`您已成功取消对【${goods_name}】的喜欢！`);
            this.collectListResult.records[idx].like = !goods.like;
          } else {
            this.$message.error("失败,请稍后重试");
          }
        });
      } else {
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.collectListResult.records[idx].like = !goods.like;
        } else {
          this.$message.error("失败,请稍后重试");
        }
      } */
    },
  },
};
</script>
<style lang="scss" scoped>
.img-wrap {
  width: 100px;
  height: 100px;
}
.v1-goods-list {
  padding-bottom: 100px;
}
@media screen and (min-width: 541px) {
  .page-mine-history {
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
    padding-bottom: 1.4rem;
  }
  .v1-goods-list {
    padding-bottom: 0.1rem;
  }
  .page-mine-history {
    background: #fafafa;
    padding-top: 1.42rem;
    .loading {
      height: 8rem;
    }
  }
}
</style>
