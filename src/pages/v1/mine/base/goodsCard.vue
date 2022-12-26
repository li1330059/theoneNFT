<template>
  <div class="v1-goods-wrap" @click="go(goods)">
    <div
      class="v1-goods"
    >
      <!-- @click="$common.goPage(`/goods/${goods.commodity.id}`, '_blank')" -->
      <div
        :class="{
          'v1-goods-cover': true,
        }"
        :style="`background-image:url('${goods.commodity&&goods.commodity.cover}')  `"
      >
        <!-- like-active -->
    <!--     <div class="like" @click.stop="toggleLike(goods)">
          {{ goods.commodity.amountLike }}
        </div> -->
      <!--   <div class="view" @click.stop="showGoodsAnimate(goods)"></div> -->
           <preview-img class="img-wrap" :cover="goods.commodity&&goods.commodity.cover" :info="goods"></preview-img>
      </div>
 
      <div class="v1-goods-line">
        <h1 class="hidden">{{ goods.commodity&&goods.commodity.name }}</h1>
      </div>
      <div class="v1-goods-line">
        <div class="v1-goods-line-title hidden">艺术家</div>
        <div
          class="v1-goods-line-people hand hidden"
          @click.stop="$common.goPage(`/user/${goods.author.id}`, '_blank')"
        >
          {{ goods.author&&goods.author.nickname }}
        </div>
      </div>
      <div class="v1-goods-line" v-if="isPrice">
        <div class="v1-goods-line-title hidden">价格</div>

        <div
          class="v1-goods-line-price hidden"
          v-if="
            (goods.saleRecord &&
              goods.saleRecord.amountAvailable == 0 &&
              goods.saleRecord.amountLock == 0) ||
            !goods.saleRecord
          "
        >
          {{ $common.formatMoney(goods.commodity&&goods.commodity.price) }}
        </div>
        <div
          v-else
          :class="{
            'v1-goods-line-status': true,
            soldout: true,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    goods: {
      type: Object,
    },
    isPrice:{
      type:Boolean,
      default:true
    },
    go:{
      type:Function,
      default:()=>{}
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
 
    showGoodsAnimate(goods) {
      this.$parent.showGoodsAnimate(goods);
    },
    toggleLike(goods) {
      this.$parent.toggleLike(goods);
    },
  },
};
</script>
<style lang="scss" scoped>
.v1-goods-cover{
  position: relative;
  .img-wrap{
    position:absolute;
  }
}
.v1-goods-line h1 {
  display: inline-block;
}
</style>
