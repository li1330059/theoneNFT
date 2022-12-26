<template>
  <div class="ui-body">
    <section class="banner-wrap">
      <img src="" />
    </section>
    <section class="body-title">跨馆联动合成 活动</section>
    <section class="m-tab-wrap"></section>
    <section class="compose-main">
      <div class="compose-title">
        <div class="t1">合成条件</div>
        <div class="des">合成条件</div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {
    this.getDetail();
  },
  mounted() {},
  computed: {},
  methods: {
    async getDetail() {
      const res = await this.$api.service.activityTemplate_detailV2({
        key: this.$route.params.key,
      });
      if (res.data.code == 200) {
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.ui-body {
  min-height: 100vh;
}
.body-title {
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  line-height: 50px;
  letter-spacing: 3px;
  text-align: center;
  margin:40px 0;
}
</style>