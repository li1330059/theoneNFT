<template>
  <div class="index-derive-body">
    <div class="block-title">衍生品</div>
    <status-template
      :list="list"
      api="/om-goods/api/recommend/list"
      :init="init"
    >
      <g-swiper-goods :list="list"></g-swiper-goods>
    </status-template>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      list: [],
    };
  },
  props: {},

  created() {
    this.init();
  },

  methods: {
    init() {
      this.getList();
    },
    async getList() {
      const res = await this.$api.service.recommend_list();
      if (res.data.code == 200) {
        this.list = res.data.data;
        console.log(this.list);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/1.0/scss/index/index.scss";
.block-title {
  margin-top: 118px;
  margin-bottom: 42px;
}
@media screen and (max-width: 540px) {
  .block-title {
    margin-top: 0;
    padding-top: 0.32rem;
    margin-bottom: 0.48rem;
  }
  .index-derive-body {
    background-color: #fff;
    margin-top: -10px;
    padding-bottom: 0.32rem;
  }
}
</style>

