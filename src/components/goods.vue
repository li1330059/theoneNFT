<template>
  <div :class="`com-goods ${styleName}`">
    <div class="goods-search-panel">
      <h1>艺术品</h1>
      <div class="search">
        <el-form
          :inline="true"
          :model="goodsListParam"
          class="index-search-form"
        >
          <el-form-item>
            <el-select
              @change="changeParam($event, 'stateList')"
              v-model="searchOption.provinceValue"
              placeholder="作品状态"
            >
              <el-option
                v-for="(item, index) in searchOption.provinceList"
                :key="index"
                :value="item.value"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              @change="changeParam($event, 'goodsCategoryIdList')"
              v-model="searchOption.goodsCategoryIdList"
              placeholder="作品类型"
            >
              <el-option
                v-for="(item, index) in categoryList"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              @change="changeParam($event, 'worksSeriesList')"
              v-model="searchOption.worksSeriesListValue"
              placeholder="作品形式"
            >
              <el-option
                v-for="(item, index) in searchOption.worksSeriesList"
                :label="item.label"
                :key="index"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="one-select-price" @click="showSearchPrice">
              <span>价格范围</span>
              <div v-if="windowPrice" class="price-input" @click.stop="">
                <input
                  v-model="goodsListParam.lowPrice"
                  placeholder="最低价"
                />-<input
                  v-model="goodsListParam.highPrice"
                  placeholder="最高价"
                /><button @click.stop="searchPriceCommit">确定</button>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="form-item-order">
            <div class="search-order">
              <div
                @click="searchOrder('orderTime')"
                :class="{
                  starttime: true,
                  uptime: searchOption.orderTime === 1,
                  downtime: searchOption.orderTime === 2,
                }"
              >
                时间
              </div>
              <div
                @click="searchOrder('orderPrice')"
                :class="{
                  starttime: true,
                  uptime: searchOption.orderPrice === 1,
                  downtime: searchOption.orderPrice === 2,
                }"
              >
                价格
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <goodsList ref="goodsListRef"></goodsList> -->
    <div class="goods-main">
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <empty
        v-if="
          !loading && goodsListResult && goodsListResult.records.length == 0
        "
      ></empty>

      <div
        v-if="!loading && goodsListResult && goodsListResult.records.length > 0"
      >
        <div class="theone-goods-list">
          <div
            class="theone-goods-item"
            v-for="(item, index) in goodsListResult.records"
            :key="index"
          >
            <router-link :to="{ path: '/goods/' + item.id }" target="_blank">
              <div
                :class="{
                  'goods-cover': true,
                  soldout: item.sell == 3,
                  nosell: item.sell == 0,
                }"
                :style="`background-image:url(&quot;${item.cover}&quot;)`"
              >
                <a class="zoom hidden">
                  <img :src="item.cover" class="selfimg" />
                </a>
              </div>
              <div class="goods-title">{{ item.name }}</div>
              <div class="goods-info">
                <span>{{ item.authorStageName }}</span>
                <span
                  v-if="(item.sell == 1 || item.sell == 4) && item.price"
                  class="goods-text"
                  >¥{{ item.price }}</span
                >
                <span v-else-if="item.sell == 0" class="goods-text">私藏</span>
                <span v-else-if="item.sell == 3" class="goods-text soldou-text"
                  >售罄</span
                >
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="theone-page">
        <g-paging
          :pageChange="handleCurrentChange"
          :pageSize="goodsListParam.pageSize"
          :list="goodsListResult.records"
      
          :current-page="goodsListResult.current"
        />
      </div>
    </div>
  </div>
</template>
<script>
import empty from "../components/empty.vue";
import loading from "../components/loading/loading.vue";
// import goodsList from "@/components/goods/goodsList.vue"
export default {
  components: {
    loading,
    empty,
  },
  // components:{
  //   goodsList
  // },
  props: ["styleName", "chainContract", "resale"],
  data() {
    return {
      windowPrice: false,
      loading: true,
      pList:[],
      goodsListParam: {
        type: 5,
        lowPrice: "",
        highPrice: "",
        pageCount: 1,
        pageSize: 16,
        stateList: [1],
        worksSeriesList: null,
        worksSeriesIdList: null,
        sortList: null,
        name: "",
        chainContract: this.chainContract,
      },
      searchOption: {
        orderTime: 0,
        orderPrice: 0,
        worksSeriesListValue: "",
        goodsCategoryIdList: "",
        provinceValue: 1,
        provinceList: [
          {
            value: 0,
            label: "不限",
          },
          {
            value: 1,
            label: "售卖",
          },
          {
            value: 2,
            label: "售罄",
          },
          {
            value: 3,
            label: "私藏",
          },
        ],
        worksSeriesValue: "",
        worksSeriesList: [
          {
            label: "不限",
            id: 0,
          },
          {
            label: "单品",
            id: 2,
          },
          {
            label: "系列",
            id: 1,
          },
        ],
      },
      seriesList: [],
      categoryList: [],
      goodsListResult: null,
      statusImg: "",
    };
  },
  mounted() {
    this.getCategoryList();
    // this.getSeriesList();
    this.getGoodsList();
  },
  methods: {
    showSearchPrice() {
      this.windowPrice = !this.windowPrice;
    },
    searchPriceCommit() {
      this.windowPrice = false;
      this.goodsListParam.pageCount = 1;
      this.getGoodsList();
    },
    changeParam(item, key) {
      if (
        (key == "worksSeriesList" && item == 0) ||
        (key == "stateList" && item == 0) ||
        (key == "goodsCategoryIdList" && item == 0)
      ) {
        this.goodsListParam[key] = null;
      } else {
        this.goodsListParam[key] = [item];
      }

      this.goodsListParam.pageCount = 1;
      this.getGoodsList();
    },
    searchOrder(type) {
      this.searchOption[type] = this.searchOption[type] + 1;
      if (this.searchOption[type] == 3) {
        this.searchOption[type] = 0;
      }
      let orderList = [];
      if (type == "orderTime") {
        this.searchOption.orderPrice = 0;
        orderList = [];
        if (this.searchOption.orderTime != 0) {
          orderList.push({ field: 1, upOrDown: this.searchOption.orderTime });
        }
      } else if (type == "orderPrice") {
        this.searchOption.orderTime = 0;
        orderList = [];
        if (this.searchOption.orderPrice != 0) {
          orderList.push({ field: 2, upOrDown: this.searchOption.orderPrice });
        }
      }
      if (orderList) {
        this.goodsListParam.sortList = orderList;
      }
      this.getGoodsList();
    },
    async handleCurrentChange(val) {
      this.goodsListParam.pageCount = val;
      this.getGoodsList();
    },
    async handleSizeChange(val) {
      this.goodsListParam.pageCount = val;
      this.getGoodsList();
    },
    async getGoodsList() {
      if (this.$route.params.name) {
        this.goodsListParam.name = this.$route.params.name;
        this.goodsListParam.type = 5;
      }

      this.goodsListParam.resale = this.resale;

      // this.$refs.goodsListRef.init(this.goodsListParam);
      this.loading = true;
      this.goodsListResult = (
        await this.$api.goodsService.list(this.goodsListParam)
      ).data.data;
      this.loading = false;
    },
    async getSeriesList() {
      let seriesListResult = await this.$api.goodsService.seriesList();
      this.seriesList = seriesListResult.data.data;
    },
    async getCategoryList() {
      let params = {};
      params.fid = 1;
      let categoryListResult = await this.$api.goodsService.categoryList(
        params
      );
      let categoryList = [{ id: "0", name: "不限" }];
      if (categoryListResult.data.code == 200) {
        this.categoryList = categoryList.concat(categoryListResult.data.data);
      } else {
        this.categoryList = categoryList;
      }
    },
  },
  watch: {
    $route: function (to, from) {
      // 执行需要更新的方法
      this.getCategoryList();
      this.getGoodsList();
    },
  },
};
</script>
<style lang="scss" scoped>
.one-select-price {
  width: 113px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid rgba($color: #000000, $alpha: 0.4);
  background: url("//static.theone.art/pc/images/pic-home/down.png")
    no-repeat 88px center;
  background-size: 16px 9px;
  position: relative;
  padding-left: 18px;
  cursor: pointer;

  span {
    display: block;
    line-height: 30px;
    font-size: 16px;
    color: rgba($color: #000000, $alpha: 0.4);
  }

  .price-input {
    display: flex;
    position: absolute;
    background: #ffffff;
    box-shadow: 0px 2px 5px 4px rgba(152, 152, 152, 0.2);
    border-radius: 2px;
    padding: 20px 20px;
    top: 42px;
    left: 0px;
    align-items: center;
    z-index: 1;

    input {
      width: 60px;
      height: 30px;
      margin: 0 10px;
      padding-left: 5px;
      border: 1px solid rgba(0, 0, 0, 0.4);
    }

    button {
      display: block;
      width: 60px;
      height: 30px;
      background: #111111;
      box-shadow: 0px 2px 4px 0px rgba(127, 127, 127, 0.5);
      border-radius: 5px;
      color: #ffffff;
      font-size: 16px;
    }
  }
}

.index-search-form {
  ::v-deep .el-select .el-input .el-select__caret {
    background: url("//static.theone.art/pc/images/pic-home/down.png")
      no-repeat center center;
    background-size: 16px 9px;
    height: 30px;
    transform: rotateZ(0);

    &::before,
    &::after {
      display: none;
    }
  }

  ::v-deep .el-select {
    height: 30px;
    line-height: 30px;
    width: 113px;
    .el-input__inner {
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      border: 1px solid rgba($color: #000000, $alpha: 0.4);
      color: rgba(0, 0, 0, 0.4);

      &::-webkit-input-placeholder {
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }

  &.el-form--inline .el-form-item {
    margin-bottom: 0px;
  }
}

.com-goods {
  margin-bottom: 100px;
  &.search-no-border {
    .goods-search-panel {
      margin-bottom: 0px;
      border: none;
    }
  }
  .loading {
    height: 500px;
  }
  .goods-search-panel {
    display: flex;
    justify-content: space-between;
    padding: 30px 0px;
    border-bottom: 1px solid rgba($color: #979797, $alpha: 0.2);
    margin-bottom: 56px;
    h1 {
      font-size: 18px;
      line-height: 36px;
      color: #000000;
      font-weight: normal;
    }
    .price-input {
      z-index: 2;
    }
    .search-order {
      display: flex;
      font-size: 18px;
      .starttime {
        background: url("//static.theone.art/pc/images/pic-home/order.png")
          no-repeat right center;
        background-size: 20px 19px;
      }
      .uptime {
        background: url(../assets/img/goup.png) no-repeat right center;
        background-size: 20px 19px;
      }
      .downtime {
        background: url("//static.theone.art/pc/images/pic-home/down.png")
          no-repeat right center;
        background-size: 20px 19px;
      }
      div {
        margin-left: 29px;
        color: rgba($color: #000000, $alpha: 0.4);
        // background: url(https://static.theone.art/pc/images/pic-home/order.png) no-repeat right center;
        // background-size: 20px 19px;
        padding-right: 32px;
        cursor: pointer;
      }
    }
  }
  ::v-deep .el-form-item__content {
    line-height: 30px;
  }

  @media screen and (min-width: 541px) and (max-width: 960px) {
    .hidden {
      display: none;
    }
  }
}
.imgClass {
  position: absolute;
  left: 0 !important;
  top: 0 !important;
  transform: translate(-43%, -47%) !important;
}
</style>
<style lang="sass" scoped>
@import "@/assets/css/mobile/comGoods"
</style>
