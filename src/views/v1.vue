<template>
  <div>
    <div class="mode-PC">
      <pageHeader />
    </div>
    <router-view />
    <div class="mode-PC">
      <pageFooter />
    </div>
    <div class="mode-mobile">
      <pageMobileFooter />
    </div>
  </div>
</template>

<script>
import pageHeader from "@/components/v1/layout/header";
import pageFooter from "@/components/v1/layout/footer";
import pageMobileFooter from "@/components/v1/layout/mobileFooter";
import "@/assets/1.0/scss/common.scss";
import "@/assets/1.0/scss/adapterPad.scss";
import "@/assets/1.0/scss/adapterMobile.scss";

export default {
  components: {
    pageHeader,
    pageFooter,
    pageMobileFooter
  },
  data () {
    return {
      screenWidth: document.body.clientWidth,
    }
  }
};
</script>

<style lang="scss">
.el-message {
  z-index: 9999999 !important;
}
</style>
