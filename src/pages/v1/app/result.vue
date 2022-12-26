<template>
  <div class="page-order-success">
    <!--   <el-button @click="postMessage">open</el-button> -->
  </div>
</template>
<script>
import App from "@/utils/app/index";

export default {
  data() {
    return {
      theOne: {},
    };
  },
  created() {
    this.$nextTick(() => {
      this.postMessage();
    });
  },

  methods: {
    postMessage() {
      this.theOne = App.browser.theone;
      if (App.browser.theone.isTheOne) {
        App.$methods.goBack();
      } else {
        App.$methods.callApp(`theone.art?path=${this.$route.params.key}`);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
