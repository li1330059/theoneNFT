<template>
  <div class="page-index">
    <div class="theone-main">
      <goods chainContract="erc721" resale="1"></goods>
    </div>
  </div>
</template>
<script>
import goods from "@/components/goods";

export default {
  components: {
    goods,
  },
  data() {
    return {};
  },
  created() {
    localStorage.setItem("loginMark", false);
  },
  methods: {
    pagewechat() {
      window.open(
        "https://www.yuque.com/books/share/9034652a-92b5-4175-b8c7-bc3435c6e6c6"
      );
    },
    pageInit() {
      this.getSeriesList();
      this.getGoodsListMain();
    },
    showSearchPrice() {
      this.windowPrice = !this.windowPrice;
    },
    searchPriceCommit() {
      this.windowPrice = false;
      this.goodsListMainParam.pageCount = 1;
      this.getGoodsListMain();
    },
    changeParam(item, key) {
      if (item == 0) {
        this.goodsListMainParam[key] = null;
      } else {
        this.goodsListMainParam[key] = [item];
      }
      this.goodsListMainParam.pageCount = 1;
      this.getGoodsListMain();
    },
    searchOrder(type) {
      this.searchOption[type] = this.searchOption[type] + 1;
      if (this.searchOption[type] == 3) {
        this.searchOption[type] = 0;
      }
      let orderList = [];
      if (this.searchOption.orderTime != 0) {
        orderList.push({ field: 1, upOrDown: this.searchOption.orderTime });
      }
      if (this.searchOption.orderPrice != 0) {
        orderList.push({ field: 2, upOrDown: this.searchOption.orderPrice });
      }
      if (orderList) {
        this.goodsListMainParam.sortList = orderList;
      }
      this.getGoodsListMain();
    },
    goPageGoods(item) {
      this.$router.push({
        path: `/goods/${item.id}`,
      });
    },
    async handleCurrentChange(val) {
      this.goodsListMainParam.pageCount = val;
      this.getGoodsListMain();
    },
    async handleSizeChange(val) {
      this.goodsListMainParam.pageCount = val;
      this.getGoodsListMain();
    },
    async getGoodsListMain() {
      let goodsListMainResult = await this.$api.goodsService.list(
        this.goodsListMainParam
      );
      if (goodsListMainResult.data.data.records != "") {
        this.goodsListMain = goodsListMainResult.data.data.records;
        this.goodsdata = goodsListMainResult.data.data;
        this.isloading = false;
        this.isgoods = true;
      } else if (goodsListMainResult.data.data.records == "") {
        this.isempty = true;
        this.isgoods = false;
        this.isloading = false;
      }
    },
    async getSeriesList() {
      let seriesListResult = await this.$api.goodsService.seriesList();
      this.seriesList = seriesListResult.data.data;
    },
    Lookmore() {
      this.$router.push({
        path: `/more/${this.goodsListTopParam.type}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
