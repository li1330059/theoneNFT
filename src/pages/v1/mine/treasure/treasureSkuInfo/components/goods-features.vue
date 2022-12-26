<template>
  <div class="goods-features-body" v-if="elements && elements.length > 0">
    <div class="element-wrap">
      <div class="title">
        <el-popover
          placement="top-start"
          title
          width="260"
          trigger="hover"
          content="商品特性指商品图片的组成元素，占比指特性占所属分类等级下商品总数的比例"
        >
          <div slot="reference">
            <div class="v1-icon-question">
              商品特性<span class="ui-icon"></span>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="main">
        <div
          class="box"
          v-for="(item, idx) in elements"
          :key="idx"
          @click="goMarket(item)"
        >
          <div class="bar">
            <div class="l1 hidden-1">{{ item.traitType }}</div>
            <div class="l2 hidden-1">{{ item.traitValue }}</div>
            <div class="l3 hidden-1">占比：{{ item.ratio }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const BigNumber = require("bignumber.js");
export default {
  components: {},
  props:{
      goodsInfo:{
          type:Object,
          default:()=>{
              return {}
          }
      }
  },

  data() {
    return { elements: [] };
  },
  created() {},
  methods: {
    init() {},
    async getElements(commodityId) {
      const res = await this.$api.service.commodityTrait_ratio({ commodityId });
      if (res.data.code == 200) {
        this.elements = res.data.data;
      }
    },
    createNum(num) {
      return `${new BigNumber(num).multipliedBy(100).toNumber()}%`;
    },
    goMarket(info) {
      this.$router.push(
        `/market?type=copyright&commodity_categoryid=${
          this.goodsInfo.commodity.commodityCategoryUuid
        }&trait_type=${encodeURIComponent(
          info.traitType
        )}&value_name=${encodeURIComponent(info.traitValue)}`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.element-wrap {
  .title {
    font-size: 14px;
    color: #000000;
    display: flex;
    margin-bottom: 8px;
    .v1-icon-question {
      padding-right: 2px;
    }
  }
  .main {
    display: flex;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e3e3e3;
    margin-bottom: 32px;
    padding: 8px;
    overflow: hidden;

    .box {
      flex: 1;
      padding: 8px;
      overflow: hidden;
    }

    .bar {
      overflow: hidden;
      border-radius: 4px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      background: #f9f9f9;
      border-radius: 4px;

      padding: 10px 0 16px;
      .l1 {
        color: #397fe7;
        margin-bottom: 4px;
      }
      .l2 {
        color: #333333;
        margin-bottom: 4px;
      }
      .l3 {
        color: #999999;
      }
    }
  }
  @media screen and (max-width: 541px) {
    padding: 0;
    .main {
      display: flex;
      flex-wrap: wrap;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e3e3e3;
      margin-bottom: 32px;
      padding: 8px;
      overflow: hidden;
      .box {
        width: 50%;
        flex: inherit;
        padding: 8px;
        overflow: hidden;
      }

      .bar {
        border-radius: 4px;
        font-size: 0.26rem;
        text-align: center;

        background: #f9f9f9;
        border-radius: 4px;

        padding: 10px 0 16px;
        .l1 {
          color: #397fe7;
          margin-bottom: 4px;
        }
        .l2 {
          color: #333333;
          margin-bottom: 4px;
        }
        .l3 {
          color: #999999;
        }
      }
    }
  }
}
</style>
