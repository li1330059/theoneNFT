<template>
  <div class="more-wrap">
    <img :class="{ hide: src?false:true }" class="bar" :src="src?src:'//static.theone.art/pc/category/count-0.png'" />
  </div>
</template>
<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isShowDialog: false,
    };
  },
  computed: {
    src() {
      const count = this.count;
      if (count == 2) {
        return `//static.theone.art/pc/category/count-1.png`;
      }else if(count>2){
         return `//static.theone.art/pc/category/count-2.png`;
      }
      return ``;
    },
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.more-wrap {
  .bar {
    width: 100%;
    border-radius: 4px 4px 0 0;
  }
  .hide {
    opacity: 0;
  }
}
</style>
