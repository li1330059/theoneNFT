<template>
  <div>
    <div class="mode-mobile"><m-header :title="'我的作品'" /></div>
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
              class="v1-goods ui-goods-frame"
              :isShowGoodsName="false"
              :isShowNumber="false"
              :isShowPrice="false"
              :goods-info="{
                commodity: item,
                ...item,
              }"
              @listenLike="toggleLike"
              :params="{ goods: item, idx: index }"
              :index="index"
              :isShowPreview="true"
              @listenCoverClick="goPage"
            >
              <div class="cus-goods-line" slot="footer">
                <div class="goods-name">{{ item.name }}</div>
              </div>
            </goods-frame>
            <!--         <div
              class="v1-goods"
              @click="goPage(`/goods/${item.id}`, '_blank')"
            >
              <div
                :class="{
                  'v1-goods-cover': true,
                }"
                :style="`background-image:url('${item.cover}')  `"
              >
                <div
                  class="like"
                  :class="{ 'like-active': item.like }"
                  @click.stop="toggleLike(item, index)"
                >
                  {{ item.amountLike }}
                </div>
                <div class="view" @click.stop="showGoodsAnimate(item)"></div>
              </div>

              <div class="v1-goods-line">
                <h1>{{ item.name }}</h1>
              </div>
            </div> -->
          </div>
        </div>
        <div class="v1-pagination">
          <g-paging
            :pageChange="handleCurrentChange"
            :pageSize="collectListParam.pageSize"
            :list="collectListResult.records"
            :current-page="collectListResult.current"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { empty, loading, mHeader },
  data() {
    return {
      loading: true,
      showEmpty: false,
      collectListParam: {
        pageCount: 1,
        pageSize: 20,
        authorId: "",
        seriesWorksId: "",
      },
      collectListResult: null,
    };
  },
  created() {
    const uuid = this.$store.state.user_info.userUuid;
    this.collectListParam.authorId = uuid;
    this.collectList();
  },

  methods: {
    goPage(info) {
      /*     window.location.href = `/goods/${info.id}`; */
    },
    async collectList() {
      this.loading = true;
      let result = await this.$api.service.commodity_list(
        this.collectListParam
      );
      this.loading = false;
      if (result && result.data.code == 200) {
        this.collectListResult = result.data.data;
        this.showEmpty = !this.collectListResult.records.length > 0;
      }
    },
    handleCurrentChange(val) {
      this.collectListParam.pageCount = val;
      this.collectList();
    },
    showGoodsAnimate(item) {
      this.$refs["goodsDetail"].open(item.commodity.cover);
    },
    async toggleLike(goods) {
      const idx = goods.idx;
      const type = goods.like ? 2 : 1;

      const goods_name = goods.name || "";
      let collectParam = {
        dataId: goods.id,
        type,
        dataType: 1,
      };
      if (type == 2) {
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.$message.success(`您已成功取消对【${goods_name}】的喜欢！`);
          this.collectListResult.records[idx].like = !goods.like;
          this.collectListResult.records[idx].amountLike--;
        } else {
          this.$message.error("失败,请稍后重试");
        }
      } else {
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.collectListResult.records[idx].like = !goods.like;
          this.collectListResult.records[idx].amountLike++;
        } else {
          this.$message.error("失败,请稍后重试");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.goods-name {
  font-weight: bold;
  color: #333333;
  font-size: 16px;
  margin-top: 0.18rem;
  padding-bottom: 0;
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
  .page-mine-collect {
    background: #fafafa;
    padding-top: 1.42rem;
    .loading {
      height: 8rem;
    }
  }
  .v1-pagination {
    padding-bottom: 1.2rem;
  }
}
</style>
