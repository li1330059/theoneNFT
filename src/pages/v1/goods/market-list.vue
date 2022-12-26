<template>
  <div class="market-detail-body">
    <div class="moblie-head-wrap">
      <div class="moblie-head" ref="MobileHeadRef">
        <div class="return">
          <div class="icon icon-return" @click="$router.back()"></div>
        </div>
        <div class="title">市场</div>
        <div class="editor">
          <div class="icon icon-search" @click="showSearch"></div>
        </div>
      </div>
    </div>

    <div class="banner" v-if="bannerSrc && bannerSrc !== 'null'">
      <img :src="bannerSrc" />
    </div>
    <div class="ui-tool-position">
      <div class="j-ui-tool-wrap">
        <div class="ui-tool-wrap" ref="ToolWrapRef">
          <div class="left">
            <div class="section">
              <div class="search-type-key hidden-one">{{ searchName }}</div>
            </div>
          </div>

          <div class="right">
            <div class="section local-search-wrap" v-if="commodityCategoryId">
              <div class="m-search-wrap js-moblie">
                <input
                  :value="searchGoodsParams.name"
                  @input="onLocalSearch"
                  @blur="onLocalSearchBlur"
                  placeholder="请输入您想查找的藏品名称"
                />
                <span class="search-btn" @click="onSearch">搜索</span>
              </div>
              <div class="local-search-result" v-if="showLocalSearchResult">
                <div
                  class="bar hidden-one"
                  v-for="(item, idx) in localGoodsResult"
                  :key="idx"
                  @click="goLocalSearch(item)"
                >
                  {{ item.name }}
                </div>
                <div class="empty" v-if="!localGoodsResult.length > 0">
                  暂无该作品信息
                </div>
              </div>
            </div>
            <div class="section select-section">
              <el-select
                :value="sortIdx"
                placeholder="排序方式"
                @change="onSortChange"
              >
                <el-option
                  v-for="(option, idx) in sortOptions"
                  :key="idx"
                  :label="option.name"
                  :value="idx"
                >
                </el-option>
              </el-select>
            </div>
            <div class="section sale-section">
              <el-select
                :value="sellStatus"
                placeholder="在售状态"
                @change="onSellStatusChange"
              >
                <el-option
                  v-for="(option, idx) in sellStatusOptions"
                  :key="idx"
                  :label="option.name"
                  :value="option.val"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="market-list-wrap" ref="contentRef">
      <div class="v1-goods-list">
        <div
          class="v1-goods-wrap"
          v-for="(item, index) in goodsListArr"
          :key="index"
        >
          <div
            class="v1-goods"
            @click.stop="goNextPage(item, $event)"
            v-if="item.commodity"
          >
            <div
              :class="{
                'v1-goods-cover': true,
                ban: item.commodity.typeMarket == 1,
                yan: item.commodity.typeMarket == 2,
              }"
            >
              <preview-img
                class="cover-wrap"
                :cover="item.commodity && item.commodity.cover"
                :info="item"
              ></preview-img>
              <div
                :class="['like', item.like ? 'like-active' : '']"
                @click.stop="
                  likeGoods(item.id, item.like, item.commodity.name, index)
                "
              >
                {{ $common.formatFansNumber(item.commodity.amountLike) || 0 }}
              </div>
            </div>

            <div class="v1-goods-line">
              <h1 class="hidden-one">{{ item.commodity.name }}</h1>
              <commodity-num :treasure="item"></commodity-num>
            </div>
            <div class="v1-goods-line">
              <div class="v1-goods-line-title hidden">艺术家</div>
              <div
                v-if="item.author"
                class="v1-goods-line-people hand hidden"
                @click.stop="
                  $common.goPage(`/user/${item.author.id}`, '_blank')
                "
              >
                {{ item.author && item.author.nickname }}
              </div>
            </div>
            <div class="v1-goods-line">
              <div class="v1-goods-line-title hidden">价格</div>
              <div
                class="v1-goods-line-status soldout"
                v-if="item.amountAvailable == 0 && item.amountLock == 0"
              ></div>
              <div class="v1-price hidden" v-else>
                {{ $common.formatMoney(item.price) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list-bottom">
        <status-template
          :list="goodsListArr && goodsListArr"
          api="/market/api/saleRecord/list"
          :init="dataInit"
          class="cus-status"
          :emptyMessage="emptyMessage"
        ></status-template>
      </div>
    </div>
    <div class="market-tip-wrap" v-if="showFigLeaf">
      <div class="content">
        <div class="message">{{ marketMessage }}</div>
        <div class="ui-btn-center">
          <div class="ui-btn ui-btn-red" @click="showFigLeaf = false">
            继续看看
          </div>
        </div>
      </div>
    </div>
    <ab-frequently :init="dataInit"></ab-frequently>
    <ab-not-logged-in :init="dataInit"></ab-not-logged-in>
    <ab-logged-in :init="dataInit"> </ab-logged-in>
    <mobile-market-search
      ref="MobileMarketSearchRef"
      :search="goLocalSearch"
      :commodityCategoryId="commodityCategoryId"
    ></mobile-market-search>
  </div>
</template>
<script>
import aes from "@/utils/aes";
import MobileMarketSearch from "@/components/v1/mobile-market-search.vue";
export default {
  components: { MobileMarketSearch },
  data() {
    return {
      searchParamsArr: [],
      showLocalSearchResult: false,
      bannerSrc: "",
      emptyMessage: "",
      searchGoodsTxt: "",
      sortIdx: "",
      marketMessage: "",
      sortOptions: [
        {
          name: "按时间顺序",
          val: { field: 1, upOrDown: 1 },
        },
        {
          name: "价格从低到高",
          val: { field: 2, upOrDown: 1 },
        },
        {
          name: "价格从高到低",
          val: { field: 2, upOrDown: 2 },
        },
      ],
      sellStatus: 1,
      sellStatusOptions: [
        {
          name: "全部",
          val: "",
        },
        {
          name: "在售",
          val: 1,
        },
        {
          name: "已售",
          val: 2,
        },
      ],
      categoryInfo: {},
      goodsListArr: [],
      goodsListParam: {
        authorId: null,
        chainContract: null,
        commodityCategoryId: null,
        commodityId: null,
        highPrice: null,
        lowPrice: null,
        pageCount: 1,
        pageSize: 20,
        seriesWorks: null,
        seriesWorksId: null,
        sort: null,
        statusSell: null,
        topicId: null,
        typeMarket: null,
      },
      showFigLeaf: false, //是否提示遮羞布
      isBottom: false, //是否滑动到底部了
      commodityCategoryId: null,
      searchName: "",
      searchGoodsParams: {
        commodityCategoryId: "",
        name: "",
        pageCount: 1,
        pageSize: 20,
      },
      localGoodsResult: [],
      linSellStatus: null,
    };
  },
  mounted() {},
  created() {
    this.init();
  },
  watch: {
    $route: function (to, from) {
      this.init();
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scroll, false);
  },
  methods: {
    init() {
      this.goodsListParam.pageCount = 1;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      const commodity_id = this.$common.getQueryString("commodity_id");
      // this.searchName = this.$common.getQueryString("search_name");
      this.commodityCategoryId = this.$common.getQueryString("category_id"); //商品分类id
      // this.bannerSrc = this.$common.getQueryString("banner");
      this.sumSize();

      this.searchGoodsParams.commodityCategoryId = this.commodityCategoryId;
      if (this.commodityCategoryId) {
        this.sortIdx = 1;
        this.goodsListParam.sort = this.sortOptions[this.sortIdx].val;
      }

      this.goodsListParam.statusSell = this.sellStatus;
      this.goodsListParam.commodityId = commodity_id;
      this.goodsListParam.commodityCategoryId = this.commodityCategoryId;
      this.getConfig();
      this.initGetList();
      this.getCategoryInfo();
      window.addEventListener("scroll", this.scroll);
    },
    async getCategoryInfo() {
      if (this.commodityCategoryId) {
        const res = await this.$api.service.commodityCategory_detail({
          id: this.commodityCategoryId,
        });
        console.log(res);
        if (res.data.code == 200) {
          this.categoryInfo = res.data.data;

          this.bannerSrc = this.categoryInfo.coverExpand02;
          this.searchName = this.categoryInfo.name;
        }
      } else {
        this.categoryInfo = {};
      }
    },
    sumSize() {
      this.$nextTick(() => {
        setTimeout(() => {
          const toolDomPosInfo = this.$refs.ToolWrapRef.getBoundingClientRect();
          this.$toolWrap = document.querySelector(".j-ui-tool-wrap");
          this.toolWrapTop = toolDomPosInfo.top;
          console.log(toolDomPosInfo.top);
        }, 500);
      });
    },
    showSearch() {
      this.$refs.MobileMarketSearchRef.show();
    },
    onLocalSearch(e) {
      this.searchGoodsParams.name = e.target.value;
      clearTimeout(this.localSearchTimer);
      this.localSearchTimer = setTimeout(() => {
        this.searchGoodsName();
      }, 500);
    },
    onSearch() {
      if (this.searchGoodsParams.name) {
        this.searchGoodsName();
      }
    },
    goLocalSearch(info) {
      this.searchGoodsParams.name = info.name;
      this.goodsListParam.commodityId = info.id;
      this.initGetList();
    },
    onLocalSearchBlur() {
      setTimeout(() => {
        this.showLocalSearchResult = false;
      }, 160);
    },
    async searchGoodsName() {
      this.showLocalSearchResult = true;
      const goodsRes = await this.$api.service.commodity_search(
        this.searchGoodsParams
      );
      if (goodsRes.data.code == 200 && goodsRes.data.data.records.length > 0) {
        this.localGoodsResult = goodsRes.data.data.records;
      } else {
        this.localGoodsResult = [];
      }
    },
    dataInit() {
      if (this.goodsListParam.pageCount == 1) {
        this.init();
      } else {
        this.getGoodsList();
      }
    },
    scroll() {
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      const domPostion = this.$refs.contentRef.getBoundingClientRect();
      const contentHeight = this.$common.isMobile()
        ? parseInt(domPostion.height)
        : parseInt(domPostion.height);
      if (
        scrollTop + document.body.clientHeight + 100 >= contentHeight &&
        !this.isBottom
      ) {
        this.isBottom = true;
        console.log("到底了");

        this.goodsListParam.pageCount++;
        this.getGoodsList();
      }

      let h = 80;
      if (this.$common.isMobile()) {
        h = this.$refs.MobileHeadRef.getBoundingClientRect().height;
      }
      if (this.$toolWrap) {
        if (scrollTop >= parseInt(this.toolWrapTop) - h) {
          this.$toolWrap.setAttribute("class", `j-ui-tool-wrap fixed`);
        } else {
          this.$toolWrap.setAttribute("class", "j-ui-tool-wrap");
        }
      }

      /*     const toolDomPosInfo = this.$refs.ToolWrapRef.getBoundingClientRect();
      const $toolWrap = document.querySelector(".j-ui-tool-wrap");
      console.log(toolDomPosInfo.top);
      if (toolDomPosInfo.top <= 80) {
        $toolWrap.setAttribute("class", "j-ui-tool-wrap pc-fixed");
      } else {
        $toolWrap.setAttribute("class", "j-ui-tool-wrap");
      } */
    },

    async getConfig() {
      const res = await this.$api.service.config_getConfigByType({
        type: 4,
      });
      if (
        res.data.code == 200 &&
        res.data.data.confValue1.toUpperCase() == "ON"
      ) {
        this.marketMessage = res.data.data.confValue2;
        this.showFigLeaf = true;
      }
    },
    async getGoodsList() {
      let result = await this.$api.service.saleRecord_list(this.goodsListParam);
      if (result.data.code == 200) {
        const goodsListResult = result.data.data;
        if (
          goodsListResult &&
          goodsListResult.records &&
          goodsListResult.records.length > 0
        ) {
          if (goodsListResult.records.length >= this.goodsListParam.pageSize) {
            this.isBottom = false;
          }

          let resAry = [...this.goodsListArr, ...result.data.data.records];
          this.goodsListArr = this.$common.uniqueAry(resAry, "id");
        } else {
        }
      } else {
        if (result.data.code == 1005 || result.data.code == 1007) {
          this.checkBrush(result.data.code);
        } else {
        }
      }
    },
    async initGetList() {
      this.goodsListParam.pageCount = 1;
      let sigData = "";
      let sig = await this.$api.service.goods_key();
      if (sig.data.code == 200) {
        let dataresult = aes.decrypt(sig.data.data);
        let dataResultFun = dataresult.split(",")[0].substr(4);
        let dataResultId = dataresult.split(",")[1].split("=")[1];
        let sigresult = eval(dataResultFun);
        sigData = aes.encryptSelf(dataResultId, sigresult);
      }
      this.searchParamsArr.push(
        JSON.parse(JSON.stringify(this.goodsListParam))
      );
      let result = await this.$api.service.saleRecord_list(
        this.goodsListParam,
        null,
        sigData
      );
      /*      result = {
        data: {
          code: 1005,
          message: "您的操作过于频繁,请登录进行验证!",
          data: null,
        },
      }; */

      if (result.data.code == 200) {
        const goodsListResult = result.data.data;
        if (goodsListResult && goodsListResult.records) {
          if (this.linSellStatus !== null) {
            this.sellStatus = this.linSellStatus;
            this.linSellStatus = null;
          }
          if (typeof this.linSort == "number") {
            this.sortIdx = this.linSort;
            this.linSort = null;
          }
          if (goodsListResult.records.length < this.goodsListParam.pageSize) {
            this.isBottom = true;
          }

          this.goodsListArr = goodsListResult.records;
        }
      } else {
        if (this.searchParamsArr.length > 1) {
          //因为包含本次请求
          this.goodsListParam =
            this.searchParamsArr[this.searchParamsArr.length - 2];
        }
        if (result.data.code == 1005 || result.data.code == 1007) {
          if (result.data.code == 1007) {
            this.emptyMessage = `未进行验证码验证，暂时无法使用市场功能，请完成验证码验证`;
          }
          if (result.data.code == 1005) {
            this.emptyMessage = result.data.message;
          }
          this.checkBrush(result.data.code);
        } else if (result.data.code == 1006) {
        } else if (result.data.code == 1009) {
          this.emptyMessage = result.data.message;
        } else {
          this.emptyMessage = result.data.message;
        }
      }
    },
    goNextPage(item, event) {
      if (!event.target.src) {
        this.$common.goPage(`/goods/${item.id}`, "_blank");
      }
    },
    checkBrush(code) {
      this.$store.commit("setmarketBtnDisabledInfo", {
        code,
        time: new Date(),
      });
      this.$store.commit("setAntiBrush", {
        code,
        isShow: true,
      });
    },

    onSortChange(idx) {
      this.linSort = idx;
      this.goodsListParam.sort = this.sortOptions[idx].val;
      console.log(this.goodsListParam);
      this.initGetList();
      // this.sortIdx = idx;
    },
    onSellStatusChange(val) {
      this.linSellStatus = val;
      this.goodsListParam.statusSell = val;
      this.initGetList();
      // this.sellStatus = val;
    },
    //商品喜欢与取消
    async likeGoods(id, like, name, index) {
      let likeGoodsParm = {
        dataId: id,
        type: 2,
        dataType: 2,
      };
      if (like) {
        let result = await this.$api.service.userLike_operation(likeGoodsParm);
        if (result.data.code == 200) {
          this.$message.success("取消成功");
          this.goodsListArr[index].like = false;
          this.goodsListArr[index].commodity.amountLike--;
          if (this.goodsListArr[index].commodity.amountLike <= 0) {
            this.goodsListArr[index].commodity.amountLike = 0;
          }
        } else if (result.data.code !== 401) {
          this.$message.error(result.data.message);
        }
      } else {
        likeGoodsParm.type = 1;
        let result = await this.$api.service.userLike_operation(likeGoodsParm);
        if (result.data.code == 200) {
          this.$message.success("成功");
          this.goodsListArr[index].like = true;
          this.goodsListArr[index].commodity.amountLike++;
        } else if (result.data.code !== 401) {
          this.$message.error(result.data.message);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.v1-goods-line {
  h1 {
    display: block !important;
    margin:0;
  }
}
.ui-tool-position {
  height: 86px;
}
.fixed {
  position: fixed;
  z-index: 999;
  background-color: #fff;
  top: 80px;
  left: 0;
  width: 100%;
  .ui-tool-wrap {
    margin: 0 auto;
  }
}

.local-search-wrap {
  position: relative;
  top: 0;
  left: 0;
  .local-search-result {
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    z-index: 999;
    background-color: #fff;
    padding: 20px 0;
    .bar {
      padding: 5px 15px;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    .empty {
      color: rgba(0, 0, 0, 0.4);
      padding: 0 15px;
    }
    max-height: 400px;
    overflow-y: auto;
  }
}
.moblie-head {
  display: none;
}

.banner {
  img {
    display: block;
    width: 100%;
  }
}
.search-type-key {
  cursor: pointer;
  min-width: 100px;
  line-height: 30px;
  background: rgba(230, 31, 26, 0.2);
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  color: #e61f1a;
  padding: 0 15px;
  display: inline-block;
  @media screen and (max-width: 540px) {
    max-width: 1.4rem;
  }
}

.market-tip-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  .content {
    width: 338px;
    height: 338px;
    background-image: url("//static.theone.art/pc/market/market-tip.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin: 20vh auto;
    .message {
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      line-height: 20px;
      padding: 210px 50px 0;
      margin-bottom: 20px;
      word-break: break-all;
    }
  }
}
.list-bottom {
  position: relative;
  height: 160px;
  top: 0;
  left: 0;
  .cus-status {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    ::v-deep .section {
      background-color: transparent;
      img {
        width: 160px;
      }
    }
  }
}
.market-list-wrap {
  padding-bottom: 100px;
  min-height: 60vh;
  @media screen and (max-width: 540px) {
    min-height: 80vh;
  }
}
.v1-goods-list {
  min-height: 20vh;
  margin: 0;
}
.market-detail-body {
  max-width: 1170px;
  margin: 0 auto;
  min-height: 50vh;
}
.ui-tool-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 23px 0 27px;
  margin: 0 -10px;
  max-width: 1190px;
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .section {
    padding: 0 10px;
  }
  @media screen and (max-width: 540px) {
    max-width: inherit;
    width: 100%;
    margin: 0;
    padding: 0.3rem 0;
    .section {
      padding: 0 0.1rem;
    }
    .sale-section {
      max-width: 1.8rem;
    }
  }
}
.m-search-wrap {
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;

  padding: 3px;
  input {
    flex: 1;
    display: block;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 30px;
    padding: 0 15px;
    min-width: 220px;
    border-radius: 17px;
    background-color: transparent;
  }
  .search-btn {
    line-height: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    padding: 0 16px;
    display: inline-block;
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 17px;
    cursor: pointer;
  }
}

@media screen and (max-width: 540px) {
  .js-moblie {
    display: none;
  }
  .select-section {
    width: 2.8rem;
  }
  .sale-section {
    width: 2.4rem;
  }
  .fixed {
    position: fixed;
    z-index: 999;
    background-color: #fff;
    top: 1.1rem;
    left: 0;
    width: 100%;
  }
  .moblie-head-wrap {
    height: 1.1rem;
  }
  .moblie-head {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.36rem;
    font-weight: 500;
    color: #000000;
    padding: 0.3rem;
    height: 1.1rem;
    background-color: #fff;
    .icon {
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
    .icon-return {
      width: 0.48rem;
      height: 0.48rem;
      background-image: url("//static.theone.art/pc/market/icon-return.png");
    }
    .icon-search {
      width: 0.36rem;
      height: 0.36rem;
      background-image: url("//static.theone.art/pc/market/icon-search.png");
    }
  }
}
</style>
