<template>
  <div>
    <div class="mode-mobile"><m-header :title="'我的粉丝'" /></div>
    <div class="page-mine-attention">
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <empty v-else-if="showEmpty"></empty>
      <div v-else>
        <div class="people-list">
          <div
            class="v1-people-card"
            v-for="(item, index) in attentionListResult.records"
            :key="index"
          >
            <div :class="`avatar bg${Math.floor(Math.random() * 10) + 1}`">
              <div class="img">
                <img :src="item.photo || '/static/img/avatars.svg'" alt="" />
              </div>
            </div>
            <h1>{{ item.stageName }}</h1>
            <h2>2021年9月</h2>
            <div class="amount-wrap">
              <div>
                <h1>510</h1>
                <h2>粉丝</h2>
              </div>
              <div>
                <h1>36</h1>
                <h2>关注</h2>
              </div>
            </div>
            <div class="v1-btn" @click="cancel(item)">取消关注</div>
          </div>
        </div>
        <div class="v1-pagination" v-if="attentionListResult.pages > 1">
          <g-paging
            :pageChange="handleCurrentChange"
            :pageSize="attentionListParam.pageSize"
            :list="attentionListResult.records"
            :current-page="attentionListResult.current"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
// import mAttention from '../components/mobileAttention'
import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { empty, loading, mHeader },
  data() {
    return {
      loading: true,
      showEmpty: false,
      attentionListParam: {
        pageCount: 1,
        pageSize: 20,
        sort: "",
      },
      attentionListResult: null,
    };
  },
  created() {
    this.attentionList();
  },
  methods: {
    async attentionList() {
      this.loading = true;
      let result = await this.$api.service.user_findAuthorFocusList(
        this.attentionListParam
      );
      this.loading = false;
      this.attentionListResult = result.data.data;
      this.showEmpty = !this.attentionListResult.records.length > 0;
    },
    handleCurrentChange(val) {
      this.attentionListParam.pageCount = val;
      this.attentionList();
    },
    cancel(item) {
      this.$confirm(`您将取消关注【${item.stageName}】?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          let result = await this.$api.service.user_cancelGoodsFocus({
            type: 2,
            uuid: item.userUuid,
          });
          if (result.data.data) {
            this.$message.success(
              `您已成功取消对【${item.stageName}】的关注！`
            );
            this.attentionList();
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 541px) {
  .page-mine-attention {
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
  .page-mine-attention {
    background: #fafafa;
    padding-top: 1.42rem;
    .loading {
      height: 8rem;
    }

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
