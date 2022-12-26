<template>
  <div id="app">
    <pageHeader></pageHeader>
    <router-view />
  </div>
</template>

<script>
import pageHeader from "@/components/layout/header";
import pageFooter from "@/components/layout/footer";
import "@/assets/css/theoneBase.scss";
import "@/assets/css/theoneBaseAdap.scss";
import "@/assets/css/agreement.scss";
import "@/assets/css/1.0/scss/common.scss";
import "@/assets/css/1.0/scss/adapterPad.scss";
import "@/assets/css/1.0/scss/adapterMobile.scss";

export default {
  name: "App",
  components: {
    pageHeader,
  },
};
</script>

<style>
* {
  padding: 0px;
  margin: 0px;
}
/*包含以下四种的链接*/
a {
  text-decoration: none;
}
/*正常的未被访问过的链接*/
a:link {
  text-decoration: none;
}
/*已经访问过的链接*/
a:visited {
  text-decoration: none;
}
/*鼠标划过(停留)的链接*/
a:hover {
  text-decoration: none;
}
/* 正在点击的链接*/
a:active {
  text-decoration: none;
}
</style>
<style lang="scss">
@media screen and (max-width: 541px) {
  .html-goods-detail {
    #app {
      padding-bottom: 50px;
    }
  }
}
</style>
