<template>
  <div class="goods-body">
    <div
      class="cover bg-img"
      :style="`background-image:url(${goodsObj.commodity.cover})`"
    >
     <div
        v-if="goodsObj.statusSale == 2"
        class="status-cover bg-img"
        :style="`background-image:url(https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icon-sell-2.png)`"
      ></div>
      <div
        v-else-if="goodsObj.statusSale == 3"
        class="status-cover bg-img"
        :style="`background-image:url(https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icon-sell-3.png)`"
      ></div>
    </div>
    <div class="goods-name hidden-1">{{ goodsObj.commodity.name }}</div>
    <div class="num-wrap">
      <commodity-num :treasure="goodsObj"></commodity-num>
      <div class="market-type">
        {{ goodsObj.commodity.typeMarket == 1 ? "版权品" : "衍生品" }}
      </div>
    </div>
    <div class="user-wrap">
      <span class="ui-icon icon-face"></span>
      <span class="user-name hidden-1">{{ goodsObj.author.nickname }}</span>
    </div>
    <div class="price">{{ $common.formatMoney(goodsObj.price) }}</div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    goodsObj: {
      type: Object,
      default: () => {
        return {
          commodity: {},
        };
      },
    },
  },
  created() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.goods-body {
  border-radius: 35px;
  padding: 17px;
  cursor: pointer;
  .cover {
    padding-bottom: 100%;
    margin-bottom: 15px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    .status-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: 50%;
      background-color: rgba(91, 91, 110, 0.8);
    }
  }
  .goods-name {
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 15px;
  }
  &:hover {
    background: #2e3757;
  }
  @media screen and (max-width: 540px) {
    padding: 0;
    &:hover {
      background: inherit;
    }
  }
}
.market-type {
  font-size: 10px;
  font-weight: 500;
  color: #e7aa71;
  background: linear-gradient(154deg, #282828 0%, #484848 100%);
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
}

.num-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  ::v-deep .m-num-wrap {
    padding-left: 0;
  }
}
.user-wrap {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  .icon-face {
    width: 16px;
    height: 16px;
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/exhibition/icon-face.png");
  }
  .user-name {
    font-size: 12px;
    font-weight: 400;
    color: #9fa0bb;
    padding-left: 1px;
  }
}
.price {
  font-size: 16px;
  font-weight: bold;
  color: #ffda87;
  padding-bottom: 10px;
}
</style>
