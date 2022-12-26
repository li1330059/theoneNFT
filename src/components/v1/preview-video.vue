<template>
  <div class="video-body">
    <video-player
      class="video video-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      @ready="onPlayerCanplay"
      @ended="videoEnded"
      @pause="videoPause"
      @timeupdate="videoTimeupdate"
      customEventName="customstatechangedeventname"
    >
    </video-player>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";

export default {
  components: { videoPlayer },
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
    player() {
      return this.$refs.videoPlayer && this.$refs.videoPlayer.player;
    },
    playerOptions() {
      return {
        language: "zh-CN",
        autoplay: true,
        loop: true,
        fluid: false,
        fill: true,
        muted: true,
        sources: [
          {
            type: "video/mp4",
            src: this.src,
          },
        ],
        poster: "//static.theone.art/pc/icons/img-loading.png",
        controlBar: {
          // 设置控制条组件
          children: [
            { name: "currentTimeDisplay" }, // 当前已播放时间
            { name: "progressControl" }, // 播放进度条
            { name: "durationDisplay" }, // 总时间
            { name: "remainingTimeDisplay" }, // timeDivider
            { name: "timeDivider" },
            { name: "fullscreenToggle" },
          ],
        },
      };
    },
  },
  mounted() {
    const self = this;
    this.$nextTick(() => {
      const observer = this.$lozad(this.$refs.videoRef, {
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
  position: relative;
  top: 0;
  left: 0;
  ::v-deep.video-box {
    height: 100%;
    width: 100%;
  }
  /*  background-color: #000; */
}
</style>
