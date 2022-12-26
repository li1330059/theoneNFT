<template>
  <div class="">
    <div class="cover" :class="{ 'prepay-active': isPrepay }">
      <div class="border">
        <preview-img
          v-if="goodsObj.commodity"
          class="cover-wrap"
          :info="goodsObj"
          :isShowPreview="false"
        ></preview-img>
        <div
          class="honor-img"
          v-if="goodsObj.honorFlag && goodsObj.honorFlag == 1"
        ></div>
      </div>

      <div class="prepay-sign-wrap" v-if="isPrepay">
        <prepay-sign size="sm"></prepay-sign>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    goodsObj: {
      type: Object,
      default: () => {
        return;
      },
    },
  },
  created() {},
  computed: {
    isPrepay() {
      return (
        (this.goodsObj.tags && this.goodsObj.tags.search(/presale/) !== -1) ||
        this.goodsObj.typeSale == 2
      );
    },
  },

  methods: {},
};
</script>
<style lang="scss" scoped>
.cover {
  width: 70px;
  height: 70px;
  margin-right: 16px;
  border: 1px solid rgba($color: #000000, $alpha: 0.1);
  position: relative;
  border-radius: 2px;
  .border {
    width: 100%;
    height: 100%;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.prepay-active {
  position: relative;
  top: 0;
  left: 0;

  overflow: hidden;
  .border {
    border: 2px solid #fe857f !important;
  }
  .prepay-sign-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
