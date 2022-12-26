<template>
  <div class="ui-preview-wrap">
    <!--     <div class="preview-img" :style="`background-image:url(${coverImg})`" ></div> -->
    <!--     <div v-if="videoSrc" class="video-box-wrap">
      <previewVideo
        ref="videoRef"
        :src="videoSrc"
        :webpSrc="info.commodity.coverAppGifVideo"
      />
    </div> -->
    <div
      class="preview-img"
      v-lazy:background-image="loadImgObj"
      :key="coverImg"
    ></div>
    <!--   显示右下角icon -->
    <div v-if="isShowPreview">
      <div class="icon-preview-wrap" @click.stop="onPlayVideo" v-if="videoSrc">
        <div class="icon-play icon" />
      </div>

      <div v-else>
        <div class="icon-preview-wrap" @click.stop="onStop">
          <img
            class="img"
            v-lazy="coverImg"
            :large="largeImg"
            :preview="info.id"
            preview-text="缩略图与大图模式"
          />
          <div class="icon-preview icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import previewVideo from "./preview-video.vue";
export default {
  name: "PreviewImg",
  components: {},
  data() {
    return {};
  },
  props: {
    cover: String,
    picture: String,
    go: Function,
    isShowPreview: {
      type: Boolean,
      default: true,
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    loadImgObj() {
      return {
        src: this.coverImg,
        error: this.info.commodity && this.info.commodity.cover,
        loading: "//static.theone.art/pc/icons/img-loading.png",
      };
    },
    videoSrc() {
      let videoSrc = "";
      if (this.info.commodity && this.info.commodity.typeFile == 3) {
        videoSrc = this.info.commodity.actualPicture;
      }
      return videoSrc;

      if (this.info.commodity && this.info.commodity.typeFile == 3) {
        videoSrc = this.info.commodity.actualPicture;
      } else if (this.info.commodity && this.info.commodity.coverGifVideo) {
        videoSrc = this.info.commodity.coverGifVideo;
      }
      return videoSrc;
    },
    coverImg() {
      let videoSrc =
        (this.info.commodity && this.info.commodity.cover) || this.picture;
      if (this.info.commodity && this.info.commodity.typeFile == 3) {
        videoSrc = this.info.commodity.coverAppGifVideo
          ? this.info.commodity.coverAppGifVideo
          : videoSrc;
      } else if (this.info.commodity && this.info.commodity.coverAppGifVideo) {
        videoSrc = this.info.commodity.coverAppGifVideo;
      }

      return videoSrc;
      return (
        this.cover ||
        "https://source.theone.art/watermarkResize/8c6269d60edafe3a31785fa7bdf31563/4346296d6f2c3b4b3c4daa0d5abc23ca-16362781979580.9.jpg"
      );
    },
    previewJpg() {
      return this.info.commodity && this.info.commodity.cover;
    },
    previewWebp() {
      return this.info.commodity && this.info.commodity.coverAppGifVideo;
    },
    largeImg() {
      return this.info.commodity && this.info.commodity.actualPicture;
    },
  },
  mounted() {},

  methods: {
    onStop(e) {
      return false;
    },
    onPlayVideo() {
      if (this.videoSrc) {
        //  const currentTime = this.$refs.videoRef.getVideoCurrentTime();
        this.$store.commit("setGoodsVideoInfo", {
          isShow: true,
          src: this.videoSrc,
          startTime: 0,
        });
      } else {
        this.$message.warning("暂无视频");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.video-box-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  ::v-deep.video-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
  }
}
.video-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999999;
}
.ui-preview-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  .preview-img {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.icon-preview-wrap {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25px;
  height: 25px;
  z-index: 2;
  .icon {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .icon-preview {
    background-image: url("//static.theone.art/pc/images/user1%402x.png");
  }
  .icon-play {
    background-image: url("//static.theone.art/pc/icons/icon-video-play.png");
  }
  .img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: 0;
  }
}
</style>
