<template>
  <div>
    <div id="wx_code_img"></div>
    <div>请使用微信扫码</div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";

export default {
  components: {  },
  data() {
    return {};
  },
  mounted() {
      
    new QRCode("wx_code_img", {
      width: 80,
      height: 80,
      text: ``,
    });
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
