<template>
  <div class="video-body">
    <video
      class="lozad video-box"
      autoplay="autoplay"
      muted="false"
      loop="loop"
      x5-playsinline
      webkit-playsinline="true"
      playsinline="true"
      ref="videoRef"
      poster="//static.theone.art/pc/icons/img-loading.png"
    >
      <!--    <source :data-src="webpSrc" type="video/webp" /> -->
      <source :src="src" type="video/mp4" />
      <!--     <source :data-src="src" type="video/mp4" /> -->
    </video>
  </div>
</template>

<script>
import lozad from "lozad";
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    webpSrc: {
      type: String,
      default: "",
    },
  },
  computed: {
    videoPlayTime() {
      return this.$store.state.videoTime;
    },
  },
  mounted() {
    const self = this;
    this.$nextTick(() => {
      const observer = lozad(this.$refs.videoRef, {
        loaded: function (el) {
          //实例化视频对象，
          //监听播放进度，超过配置时间则重新播放
          self.$refs.videoRef.addEventListener("loadedmetadata", () => {
            //视频的总长度
            if (parseInt(el.duration) > self.videoPlayTime) {
              self.listenTimeupdate();
            }
          });
        },
      }); // 元素默认为 '.lozad'
      observer.observe();
    });
  },
  beforeDestroy() {
    this.$refs.videoRef.removeEventListener(
      "timeupdate",
      this.listenTimeUpdate,
      false
    );
  },
  methods: {
    getVideoCurrentTime() {
      return this.$refs.videoRef.currentTime;
    },
    listenTimeupdate() {
      this.$refs.videoRef.addEventListener("timeupdate", this.listenTimeUpdate);
    },
    listenTimeUpdate() {
      if (parseInt(this.$refs.videoRef.currentTime) > this.videoPlayTime) {
        this.$refs.videoRef.currentTime = 0;
      }
    },
    scroll() {
      const isInViewPort = this.isInViewPort(this.$refs.videoRef);
      console.log(isInViewPort);
    },
    isInViewPort(element) {
      const viewWidth =
        window.innerWidth || document.documentElement.clientWidth;
      const viewHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const { top, right, bottom, left } = element.getBoundingClientRect();

      return (
        top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.video-body {
  width: 100%;
  height: 100%;
  /*  background-color: #000; */
}
</style>
