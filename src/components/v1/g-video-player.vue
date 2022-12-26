<template>
  <div>
    <div class="ui-video-wrap" v-if="videoInfo.isShow">
      <div class="m-tool-wrap">
        <div class="ui-icon icon-close hand" @click="onHide"></div>
      </div>
      <video-player
        class="video cus-video"
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
      <div class="play-btn-wrap" @click="playVideo" v-if="isShowPayBtn">
        <span class="ui-icon"></span>
      </div>
      <!--           @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)"
        @ended="onPlayerEnded($event)"
        @waiting="onPlayerWaiting($event)"
        @playing="onPlayerPlaying($event)"
        @loadeddata="onPlayerLoadeddata($event)"
        @timeupdate="onPlayerTimeupdate($event)"
        @canplay="onPlayerCanplay($event)"
        @canplaythrough="onPlayerCanplaythrough($event)"
        @statechanged="playerStateChanged($event)"
        @ready="playerReadied" -->
    </div>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
/* nodownload nofullscreen noremoteplayback noplaybackrate */
export default {
  components: { videoPlayer },
  props: {},
  computed: {
    videoInfo() {
      return this.$store.state.goodsVideoInfo;
    },
    player() {
      return this.$refs.videoPlayer && this.$refs.videoPlayer.player;
    },
    playerOptions() {
      // videojs options
      return {
        muted: false,
        language: "zh-CN",
        autoplay: true,
        width: this.$common.isMobile() ? document.body.clientWidth : "800",
        playbackRates: [0.7, 1.0, 1.5, 2],
        fluid: false,
        fill: true,
        sources: [
          {
            type: "video/mp4",
            src: this.$store.state.goodsVideoInfo.src,
          },
        ],
        poster: "",
        controlBar: {
          // 设置控制条组件
          children: [
            { name: "currentTimeDisplay" }, // 当前已播放时间
            { name: "progressControl" }, // 播放进度条
            { name: "durationDisplay" }, // 总时间
            { name: "remainingTimeDisplay" }, // timeDivider
            { name: "timeDivider" },
          ],
        },
      };
    },
  },
  data() {
    return { isShowPayBtn: false };
  },
  methods: {
    videoTimeupdate(obj) {
      if (this.isShowPayBtn) {
        this.isShowPayBtn = false;
      }
    },
    videoPause() {
      this.isShowPayBtn = true;
    },
    videoEnded(obj) {
      console.log("over");
      obj.currentTime(0);
      setTimeout(() => {
        this.isShowPayBtn = true;
      }, 600);
    },
    playVideo() {
      this.$refs.videoPlayer.player.play();
    },
    onHide() {
      this.$store.commit("setGoodsVideoInfo", { isShow: false, startTime: 0 });
    },
    onPlayerCanplay(player) {
      if (this.$store.state.goodsVideoInfo.startTime) {
        player.currentTime(this.$store.state.goodsVideoInfo.startTime);
        /*  player.play(); */
      }
    },
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log("the player is readied", player);
      // you can use it to do something...
      // player.[methods]
    },
  },
};
</script>
<style lang="scss" scoped>
.play-btn-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  background: rgba(131, 162, 192, 0.4);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 100px;

  .ui-icon {
    width: 20px;
    height: 24px;
    position: absolute;
    z-index: 4;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-detail-play.png");
  }
}
.icon-close {
  width: 30px;
  height: 30px;
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/close.png");
}

.m-tool-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  z-index: 9999;
  padding: 15px;
}
.cus-video {
  /*   max-width: 100%;
  width: 90%;
  height: 90vh; */
  width: 100%;
  height: 100%;
  ::v-deep.vjs-current-time {
    display: block;
  }
  ::v-deep.vjs-big-play-button {
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    background: rgba(131, 162, 192, 0.4);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 100px;
    .vjs-icon-placeholder {
      background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-detail-play.png");
      display: block;
      width: 100%;
      height: 100%;
      background-size: 20px 24px;
      background-repeat: no-repeat;
      background-position: center;
      &::before {
        display: none;
      }
    }
  }
  ::v-deep.vjs-control-bar {
    opacity: 1 !important;
    visibility: initial !important;
    height: 4em;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.07) 28%,
      rgba(0, 0, 0, 0.37) 100%
    );
  }
  ::v-deep.vjs-time-control {
    /*     font-size: 4em;
    line-height: 4em; */
    font-size: 1.2em;
    line-height: 3.6em;
  }
}
.ui-video-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;

  @media screen and (max-width: 525px) {
  }
  ::v-deep .video-js .vjs-big-play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
