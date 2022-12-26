<template>
  <div class="page-order-success"></div>
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
    this.postMessage();
  },

  methods: {
    postMessage() {
      this.theOne = App.browser.theone;
      if (App.browser.theone.isTheOne) {
        App.$methods.goBack();
      } else {
      App.$methods.callApp('')
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
