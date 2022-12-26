<template>
  <div class="vueBox">
    <div class="font-600 text-danger-color">测试</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      img: "",
    };
  },
  created() {
    this.img = this.$route.query.img;
  },
  methods: {
    go() {
      window.location.href = `/test?img=https://theoneart-public.oss-cn-qingdao.aliyuncs.com/ui/colors.png`;
    },
  },
};
</script>
<style lang="scss">
@media screen and (max-width: 540px) {
  video {
    display: block;
    width: 100%;
  }
}
</style>
