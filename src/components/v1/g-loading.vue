<template>
  <div class="com-loading" v-if="isShow">
    <div class="loading-wrap">
      <div class="div-animation">
        <div :class="{ animation: showIndex == 1 }">
          <img
            v-for="(item, index) in 4"
            :key="index"
            :src="`/static/img/title/title${index + 1}.png`"
          />
        </div>
        <div :class="{ animation: showIndex == 2 }">
          <img
            v-for="(item, index) in 6"
            :key="index"
            :src="`/static/img/title/title${index + 5}.png`"
          />
        </div>
        <div :class="{ animation: showIndex == 3 }">
          <img
            v-for="(item, index) in 1"
            :key="index"
            :src="`/static/img/title/title${index + 11}.png`"
          />
        </div>
        <div :class="{ animation: showIndex == 4 }">
          <img
            v-for="(item, index) in 3"
            :key="index"
            :src="`/static/img/title/title${index + 12}.png`"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showIndex: -1,
    };
  },
  computed:{
    isShow(){
        return this.$store.state.is_show_loading;
    }
  },
  created() {
    setInterval(() => {
      this.showIndex++;
      if (this.showIndex == 5) {
        this.showIndex = 0;
      }
    }, 500);
  },
};
</script>
<style lang="scss" scoped>
.com-loading {
  position: fixed;
  height: 100%;
  width:100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  top:0;
  left:0;
  .loading-wrap {
    transform: scale(0.25);
    height: 100%;
    img {
      display: inline-block;
    }
    .div-animation {
      display: flex;
      justify-content: flex-start;
      position: absolute;
      left: 50%;
      top: 50%;
      white-space: nowrap;
      transform: translate(-50%, -50%);
      > div {
      }
    }
    .div-animation .animation {
      animation: loading 0.5s infinite;
    }
  }
}

@keyframes loading {
  0% {
    transform: translateY(0%) scale(1);
  }
  50% {
    transform: translateY(-120%) scale(1.2);
  }
  100% {
    transform: translateY(0%) scale(1);
  }
}
</style>
