<template>
  <div class="ui-body">
    <img class="bg" src="//static.theone.art/pc/images/bg-vip-complimentary-ticket.jpg">
    <img class="qr-code" v-if="qrcodeUrl" :src="qrcodeUrl" />
    <canvas id="qrcode-canvas" class="qr-code-canvas" />
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      qrcodeUrl: "",
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.createQrCode();
    });
  },
  methods: {
    createQrCode() {
      const canvas = document.getElementById("qrcode-canvas");
      QRCode.toCanvas(canvas, this.$route.params.txt, {
        margin: 0,
      });
      const data = canvas.toDataURL("image/png", 1);
      this.qrcodeUrl = data;
    },
  },
};
</script>
<style lang="scss" scoped>
.qr-code-canvas {
  opacity: 0;
}
.qr-code {
  display: block;
  position: absolute;
  width: 20%;
  left: 14%;
  top: 56%;
  @media screen and (max-width: 540px) {
    margin: 0 auto;
    width: 1.6rem;
    top: 9.3rem;
    left: 1rem;
  }
}
.bg{
  display: block;
  width:100%;
}
.ui-body {
  position: relative;
  top: 0;
  left: 0;
  width: 680px;
  margin: 0 auto;
  background-color:#000;
  overflow-x:hidden;
  @media screen and (max-width: 540px) {
    width: 100%;
  }
}
</style>