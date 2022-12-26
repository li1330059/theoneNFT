<template>
  <div class="mobile-search-body" v-if="isShow">
    <div class="ui-head">
      <div class="search-wrap">
        <div class="icon icon-search"></div>
        <input
          :value="searchGoodsParams.name"
          @input="handleChange"
          type="txt"
          placeholder=""
        />
      </div>
      <div class="cancel" @click="isShow = false">取消</div>
    </div>

    <div class="search-result-wrap">
      <div
        v-for="(item, idx) in goodsResult"
        :key="idx"
        @click="onSearch(item)"
        class="bar hidden-one"
      >
        {{ item.name }}
      </div>
      <div class="empty" v-if="isEmpty">暂无该作品信息</div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  name: "MobileMarketSearch",
  props: {
    search: Function,
    commodityCategoryId: {
      type: String,
    },
  },
  data() {
    return {
      isEmpty: false,
      isShow: false,
      timer: null,
      searchGoodsParams: {
        commodityCategoryId: "",
        pageCount: 1,
        pageSize: 12,
        name: "",
      },
      goodsResult: [],
    };
  },
  beforeDestroy() {},
  methods: {
    handleChange(e) {
      this.searchGoodsParams.name = e.target.value;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getGoods();
        //
      }, 500);
    },
    show() {
      this.isEmpty=false;
      this.isShow = true;
      this.goodsResult = [];
      this.searchGoodsParams.name = "";
    },
    onSearch(info) {
      if (this.search) {
        this.search(info);
      } else {
        this.$router.push(
          `/market?id=${info.id}&&key=${info.name}&&type=${info.typeMarket}`
        );
      }
      this.isShow = false;
    },
    async getGoods() {
      if (this.commodityCategoryId) {
        this.searchGoodsParams.commodityCategoryUuid = this.commodityCategoryId;
      }
      let goodsRes = await this.$api.service.commodity_search(
        this.searchGoodsParams
      );
      if (goodsRes.data.code == 200 && goodsRes.data.data.records.length > 0) {
        this.goodsResult = goodsRes.data.data.records;
        this.isEmpty = false;
      } else {
        this.goodsResult = [];
        this.isEmpty = true;
      }
    },
    async getA() {
      let goodsRes = await this.$api.service.commodity_search(
        this.searchGoodsParams
      );
      console.log(goodsRes);
    },
  },
};
</script>

<style lang='scss' scoped>
.ui-head {
  display: flex;
  align-items: center;
  .search-wrap {
    flex: 1;
  }
  .cancel {
    padding-left: 0.2rem;
    color: rgba(0, 0, 0, 0.7);
  }
}
.icon-search {
}
.icon {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.search-wrap {
  line-height: 0.72rem;
  border-radius: 0.36rem;
  border: 0.02rem solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  padding: 0 0.3rem;
  input {
    display: block;
    outline: none;
    border: none;
    flex: 1;
    padding-left: 0.2rem;
  }
  .icon-search {
    width: 0.36rem;
    height: 0.36rem;
    background-image: url("//static.theone.art/pc/market/icon-search.png");
  }
}
.mobile-search-body {
  padding: 0.3rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #fff;
}
.search-result-wrap {
  padding: 0.2rem 0;
  .bar {
    padding: 0.16rem 0;
  }
}
.empty {
  color: rgba(0, 0, 0, 0.7);
}
@media screen and (max-width: 540px) {
}
</style>