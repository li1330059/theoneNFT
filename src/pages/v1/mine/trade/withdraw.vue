<template>
  <div class="page-mine-trade-withdraw">
    <div class="v1-tabs">
      <ul>
        <li
          :class="{ active: withdrawListParam.resaleStatus == item.value }"
          v-for="(item, index) in searchOption.status"
          :key="index"
        >
          <a @click="search('resaleStatus', item.value)">{{ item.name }}</a>
        </li>
      </ul>
    </div>
    <div class="loading" v-if="loading">
      <loading></loading>
    </div>
    <empty v-else-if="showEmpty"></empty>
    <div v-else>
      <div class="v1-trade">
        <div
          class="trade-item"
          v-for="(item, index) in withdrawListResult.records"
          :key="index"
        >
          <div class="title-line">
            <div class="time">{{ item.createTime }}</div>
            <div class="title">单据编号：</div>
            <p class="copy">{{ item.extractNo }}</p>
          </div>
          <div class="content-line">
            <div class="goods">
              <div class="goods">
                <div class="cover"></div>
                <div class="info" v-if="item.goods02VO">
                  <h1>{{ item.goods02VO.name }}</h1>
                  <p>{{ item.goods02VO.authorStageName }}</p>
                </div>
              </div>
              <div class="wsmall">X {{ item.sum }}</div>
            </div>
            <div class="chain-info">
              <div>区块链：{{ item.chainName }}</div>
              <div>合约标准：{{ item.chainContract }}</div>
              <div>提取至：{{ item.chainAddress }}</div>
            </div>
            <div class="wsmall">
              <div v-if="item.status == 1">待提取</div>
              <div v-else-if="item.status == 2">提取中</div>
              <div v-else-if="item.status == 3">提取成功</div>
              <div v-else-if="item.status == 4">提取失败</div>
            </div>
          </div>
        </div>
      </div>
      <div class="v1-pagination" v-if="withdrawListResult.pages > 1">
        <g-paging
          :pageChange="handleCurrentChange"
          :list="withdrawListResult.records"
          :pageSize="withdrawListParam.pageSize"
          :current-page="withdrawListResult.current"
        />
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
export default {
  components: { empty, loading },
  data() {
    return {
      loading: true,
      showEmpty: false,
      searchOption: {
        status: [
          { name: "全部", value: "" },
          { name: "提取中", value: "1" },
          { name: "已提取", value: "3" },
          { name: "提取失败", value: "4" },
        ],
      },
      withdrawListParam: {
        chainName: "",
        pageCount: 1,
        pageSize: 12,
      },
      withdrawListResult: null,
    };
  },
  created() {
    this.withdrawList();
  },
  methods: {
    // 我发布的列表
    async withdrawList() {
      let result = await this.$api.service.assets_queryAssetsExtract(
        this.withdrawListParam
      );
      this.loading = false;
      this.withdrawListResult = result.data.data;
      this.showEmpty = !this.withdrawListResult.records.length > 0;
    },
    // 翻页
    handleCurrentChange(val) {
      this.withdrawListResult.pageCount = val;
      this.withdrawList();
    },
    // 搜索
    search(key, value) {
      this.withdrawListParam.pageCount = 1;
      this.withdrawListParam[key] = value;
      this.withdrawList();
    },
    // 取消发布
    cancel(item) {
      this.$confirm(`您将取消【？？？】的出售信息?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          let result = await this.$api.service.user_assetsResale_operation({
            id: item.id,
            operation: 1,
          });
          if (result.data.data) {
            this.$message.success(`您已成功取消对【？？？】的出售信息！`);
            this.withdrawList();
          }
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.page-mine-trade-withdraw {
  .loading {
    height: 500px;
  }
  .chain-info {
    flex: 1;
  }
}
</style>
