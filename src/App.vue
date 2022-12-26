<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <setPassword />
    <GLoading />
    <g-video-player></g-video-player>
    <g-vcode-tip></g-vcode-tip>
    <g-wx-tip></g-wx-tip>
    <customer-service></customer-service>
    <community-service></community-service>
  </div>
</template>

<script>
import setPassword from "@/components/v1/setPassword.vue";
import GLoading from "@/components/v1/g-loading";
export default {
  components: { setPassword, GLoading },
  mounted() {},
};
</script>

<style></style>
<style lang="scss">
@media screen and (min-width: 0px) and (max-width: 540px) {
  #app {
    min-height: 100vh;
  }
}
</style>
