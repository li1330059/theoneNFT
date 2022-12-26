<template>
  <div class="goods-img-wrap">
    <img
      class="frame frame-top"
      src="//static.theone.art/pc/market-2/frame-top.png"
    />
    <img
      class="frame frame-bottom"
      src="//static.theone.art/pc/market-2/frame-bottom.png"
    />
    <img
      class="frame frame-left"
      src="//static.theone.art/pc/market-2/frame-left.png"
    />
    <img
      class="frame frame-right"
      src="//static.theone.art/pc/market-2/frame-right.png"
    />

    <div class="frame-content hand">
      <div
        v-if="goods.honorList && goods.honorList.length > 0"
        class="honor-img"
      ></div>
      <div class="img-preview-wrap">
        <div class="img-preview">
          <div v-if="videoSrc" class="video-wrap">
            <video-player
              :events="['fullscreenchange']"
              class="cus-video video"
              :class="{ 'full-btn': isShowFullBtn, 'video-pause': !isPause }"
              ref="videoPlayer"
              :options="playerOptions"
              :playsinline="true"
              @fullscreenchange="handlefullscreenchange"
              @ended="videoEnded"
              @pause="videoPause"
              @timeupdate="videoTimeupdate"
            >
              <template v-slot="{ player, state }">
                <div class="player-custom-controls">
                  <player-custom-controls
                    :player="player"
                    :state="state"
                    :config="config"
                  />
                </div>
              </template>
            </video-player>

            <div class="disabled-mask bg-img">
              <div
                v-if="goods.commodity.typeFile == 3 && videoStop"
                class="poster bg-img"
                :style="`background-image:url(${goods.commodity.cover})`"
              ></div>
              <div class="preview-img-handle" @click="onPlayVideo(goods)"></div>
              <!--        <img
                v-else
                class="preview-img-handle"
                :large="goods.commodity.actualPicture"
                preview="goods.commodity.id"
                preview-text="缩略图与大图模式"
              /> -->
              <div class="play-btn-wrap" @click="playVideo" v-if="isShowPayBtn">
                <span class="ui-icon"></span>
              </div>
            </div>
          </div>
          <!--     <div v-if="goods.commodity.typeFile == 3" @click="onPlayVideo(goods)">
            <div class="icon icon-play"></div>
            <img v-lazy="goods.commodity.cover" />
          </div> -->
          <div
            class="img-wrap"
            v-else
            :style="`background-image:url(${loadImgObj.src})`"
          >
            <img
              ref="cover"
              v-lazy="loadImgObj"
              :large="goods.commodity && goods.commodity.actualPicture"
              preview="1"
            />
          </div>
        </div>
      </div>

      <div class="frame-footer">
        <div class="detail-wrap">
          <div class="name hidden-1">
            {{ goods.commodity && goods.commodity.name }}
          </div>
          <commodity-num :treasure="goods"></commodity-num>
        </div>
        <prepay-sign
          class="prepay-sign"
          size="md"
          :text="`流程：1.付定金 - 2.付尾款`"
          v-if="goods.typeSale == 2"
        />
      </div>
    </div>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";

export default {
  components: { videoPlayer },
  props: {
    goods: {
      type: Object,
      default: () => {
        return { commodity: {} };
      },
    },
  },

  computed: {
    loadImgObj() {
      return {
        src: this.coverImg,
        error: this.goods.commodity && this.goods.commodity.cover,
        loading: "//static.theone.art/pc/icons/img-loading.png",
      };
    },
    coverImg() {
      return (
        (this.goods.commodity && this.goods.commodity.coverAppGifVideo) ||
        (this.goods.commodity && this.goods.commodity.cover)
      );
    },
    videoSrc() {
      let videoSrc = "";
      if (this.goods.commodity) {
        if (this.goods.commodity.typeFile == 3) {
          videoSrc = this.goods.commodity.actualPicture;
        } else if (this.goods.commodity.coverGifVideo) {
          /*  videoSrc = this.goods.commodity.coverGifVideo; */
        }
      }

      return videoSrc;
    },
    playerOptions() {
      return {
        language: "zh-CN",
        autoplay: true,
        loop: false,
        fluid: false,
        fill: true,
        muted: true,
        sources: [
          {
            type: "video/mp4",
            src: this.videoSrc,
          },
        ],
        poster: this.goods.commodity.cover,
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
  data() {
    return {
      isShowPayBtn: true,
      isShowFullBtn: false,
      currentTime: 0,
      videoStop: true,
      isMuted: true,
      isPause: true,
    };
  },

  created() {},
  mounted() {},
  methods: {
    handlefullscreenchange(val) {
      /*       this.isMuted = !val.isFullscreen_; */
      this.isShowFullBtn = val.isFullscreen_;
      if (!val.isFullscreen_) {
        this.$refs.videoPlayer.player.volume(0);
        this.$refs.videoPlayer.player.muted(true);
      }
    },
    videoFull() {
      this.$refs.videoPlayer.player.enterFullWindow();
    },
    videoTimeupdate(obj) {
      if (this.isPause) {
        this.isPause = false;
      }
      if (this.videoStop) {
        this.videoStop = false;
      }
      this.currentTime = obj.currentTime();
      if (this.isShowPayBtn) {
        this.isShowPayBtn = false;
      }
    },
    videoPause() {
      this.isPause = true;
      this.isShowPayBtn = true;
    },
    videoEnded(obj) {
      console.log("over");
      obj.currentTime(0);

      setTimeout(() => {
        this.videoStop = true;
        this.isPause = true;
        this.isShowPayBtn = true;
      }, 400);
    },
    playVideo() {
      this.$refs.videoPlayer.player.play();
    },
    onPlayVideo(info) {
      this.$refs.videoPlayer.player.volume("100%");
      this.$refs.videoPlayer.player.muted(false);
      this.$refs.videoPlayer.player.requestFullscreen(true);
      this.isShowFullBtn = true;
      /*       this.$store.commit("setGoodsVideoInfo", {
        isShow: true,
        src: this.videoSrc,
        startTime: this.currentTime,
      }); */
      /*    if (info.commodity.typeFile == 3) {

      } else {
        this.$message.warning("暂无视频");
      } */
    },
  },
};
</script>
<style lang="scss" scoped>
.prepay-sign {
  :deep(.txt) {
    overflow: hidden;
    .txt-main {
      padding-left: 10%;
      @media screen and (max-width: 540px) {
        padding-left: 4%;
      }
    }
  }
}
.video-close {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999999999;
  color: #fff;
  background-color: red;
}

.cus-video {
  ::v-deep.vjs-current-time {
    display: block;
  }
  ::v-deep.vjs-fullscreen-control {
    display: none !important;
    position: relative;
    top: 4px;
    z-index: 3;
  }
  ::v-deep.vjs-play-progress:before {
    top: 50%;
    transform: translateY(-50%);
  }
  ::v-deep.vjs-big-play-button {
    display: block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    background: rgba(131, 162, 192, 0.4);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 100px;
    @media screen and (max-width: 540px) {
      width: 1rem;
      height: 1rem;
    }
    .vjs-icon-placeholder {
      background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-detail-play.png");
      display: block;
      width: 100%;
      height: 100%;
      background-size: 20px 24px;
      background-repeat: no-repeat;
      background-position: 26px center;
      @media screen and (max-width: 540px) {
        background-size: 0.3rem auto;
        background-position: 0.36rem center;
      }
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
.video-pause {
  ::v-deep.vjs-big-play-button {
    display: none;
  }
}
.full-btn {
  ::v-deep.vjs-fullscreen-control {
    display: block !important;
  }
}
.video-wrap {
  height: 100%;
  overflow: hidden;
  .video {
    height: 100%;
  }
}
.goods-img-wrap {
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  padding: 26px;
  .frame-top {
    top: 0px;
    left: 0;
    width: 100%;
    height: 26px;
  }
  .frame-left {
    top: 0px;
    left: 0;
    height: 100%;
    width: 26px;
  }
  .frame-right {
    top: 0px;
    right: 0;
    height: 100%;
    width: 26px;
  }
  .frame-bottom {
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 26px;
  }
  .frame-footer {
    width: 100%;

    .detail-wrap {
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      padding-bottom: 6px;
    }
    .name {
      font-size: 18px;
      font-weight: 500;
      color: #000000;
      margin-bottom: 6px;
    }
  }
  .frame-content {
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    .honor-img {
      background-image: url("~@/assets/1.0/images/honor-icon.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 37px;
      height: 41px;
      position: absolute;
      top: 0;
      left: 20px;
      z-index: 1;
    }
    .img-preview-wrap {
      padding: 16px;
      flex: 1;
    }
    /*     .img-preview-height {
      height: calc(100% - 30px);
    }
    .img-preview- */
    .img-preview {
      position: relative;
      top: 0;
      left: 0;
      height: 100%;

      margin: 0 auto;
      display: block;
      .img-wrap {
        width: 100%;
        height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        overflow: hidden;
        position: relative;
        top: 0;
        left: 0;
        img {
          display: block;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: inherit;
        }
      }
      .disabled-mask {
        position: absolute;

        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        .poster {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .preview-img-handle {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: inherit;
          opacity: 0;
        }
        .play-btn-wrap {
          opacity: 1;
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
            left: 51%;
            transform: translate(-50%, -50%);
            background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/icons/icon-detail-play.png");
          }
          @media screen and (max-width: 540px) {
            width: 1rem;
            height: 1rem;
            .ui-icon {
              width: 0.3rem;
              height: 0.34rem;
              top: 50%;
              left: 51%;
            }
          }
        }
      }
    }
    img {
      cursor: pointer;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
      overflow: hidden;
    }
  }
  .frame {
    position: absolute;
  }
  @media screen and (max-width: 540px) {
    padding: 0.32rem;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .frame-footer {
      width: 100%;
      .name {
        font-size: 0.28rem;
      }
    }
    .frame-content {
      position: relative;
      top: 0;
      left: 0;
      height: 100%;
      .img-preview-wrap {
        padding: 0.16rem;
        height: 100%;
      }
      .img-preview {
        position: relative;
        top: 0;
        left: 0;
      }
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        cursor: pointer;
      }
    }
    .frame {
      position: absolute;
    }
    .frame-top {
      top: 0px;
      left: 0;
      width: 100%;
      height: 0.32rem;
    }
    .frame-left {
      top: 0px;
      left: 0;
      height: 100%;
      width: 0.32rem;
    }
    .frame-right {
      top: 0px;
      right: 0;
      width: 0.32rem;
      height: 100%;
    }
    .frame-bottom {
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 0.32rem;
    }
  }
}
</style>
