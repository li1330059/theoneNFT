<template>
  <div>
    <div class="mode-PC" v-if="is_pc">
      <mine-banner />
      <div class="m-mine-content">
        <div class="v1-mine-content">
          <div class="v1-mine-left">
            <mine-left-menu />
          </div>
          <div class="v1-mine-right">
            <router-view />
          </div>
        </div>
      </div>
    </div>

    <div class="mode-mobile" v-else>
      <router-view />
    </div>
  </div>
</template>
<script>
import mineBanner from "./components/banner.vue";
import mineLeftMenu from "./components/leftmenu.vue";
export default {
  components: {
    mineBanner,
    mineLeftMenu,
  },
  data() {
    return {
      is_pc: true,
    };
  },
  created() {
    this.previous = 0;
    this.is_pc = window.innerWidth >= 540;
    window.addEventListener("resize", this.checkWindowResize, false);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkWindowResize, false);
  },
  methods: {
    checkWindowResize() {
      let now = new Date().getTime();
      if (now - this.previous >= 500) {
        //每隔500ms执行一次
        this.previous = now;
        const is_pc = window.innerWidth >= 540;
        if (this.is_pc != is_pc) {
          this.is_pc = is_pc;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.v1-mine-content {
  display: flex;

  max-width: 1440px;
  margin: auto;
  .v1-mine-left {
    width: 256px;
    min-height: 800px;
    border-right: rgba(0, 0, 0, 0.1) 1px solid;
    // max-height: 500px;
    // overflow-y: auto;

    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.1);
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border: rgba(0, 0, 0, 0.1) 1px solid;
    }
  }
  .v1-mine-right {
    flex: 1;
    padding: 30px;
    position: relative;
  }
}
.m-mine-content {
  background-color: rgba(251, 251, 251, 1);
}
</style>
