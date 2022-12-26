<template>
  <div class="page-modalfor3d-index" v-if="isShow" @click.stop="close">
    <div class="main">
      <div class="wrap">
        <div class="cube">
          <div class="front">
            <div class="img">
              <el-image
                :src="image"
                alt=""
                fit="cover"
              />
            </div>
          </div>
          <div class="back"></div>
          <div class="top"></div>
          <div class="bottom"></div>
          <div class="left"></div>
          <div class="right"></div>
        </div>
        <div class="bottomdesk"></div>
      </div>
    </div>
    <div class="close" @click.stop="close"></div>
  </div>
</template>
<script>

export default {
  name: "modal3dIndex",
  props: {},
  data() {
    return {
      isShow: false,
      image: '//static.theone.art/pc/mine/2.png',
    };
  },
  methods: {
    open(image) {
      this.image = image || '//static.theone.art/pc/mine/2.png';
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-modalfor3d-index {
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.6);
  display: flex;
  justify-content: center;
  align-items: center;

  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    .bottomdesk {
      background: url("../../../assets/1.0/3d/round.png") center center
        no-repeat;
      width: 233px;
      height: 70px;
      background-size: 100% 70px;
      position: absolute;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999999;
    }
  }

  .wrap {
    perspective: 800px;
    perspective-origin: 50% 152px;
    margin-top: -100px;
    .cube {
      width: 304px;
      height: 268px;
      position: relative;
      transform-style: preserve-3d;
      > div {
        position: absolute;
      }

      .back {
        transform: translateZ(-14px) rotateY(180deg);
        background: url("../../../assets/1.0/3d/back.png") no-repeat;
        width: 304px;
        height: 268px;
        background-size: 100% 268px;
      }
      .right {
        transform: rotateY(-270deg) translateX(304px);
        transform-origin: top right;
        background: url("../../../assets/1.0/3d/lr2.png") no-repeat;
        width: 304px;
        height: 268px;
        background-size: 14px 268px;
      }
      .left {
        transform: rotateY(270deg) translateX(-14px);
        transform-origin: center left;
        background: url("../../../assets/1.0/3d/lr2.png") no-repeat;
        width: 14px;
        height: 268px;
        background-size: 100% 268px;
      }
      .top {
        transform: rotateX(-90deg) translateY(0);
        transform-origin: top center;
        background: url("../../../assets/1.0/3d/updown2.png") no-repeat;
        width: 304px;
        height: 14px;
        background-size: 100% 14px;
      }
      .bottom {
        transform: rotateX(90deg) translateY(254px) translateX(0);
        transform-origin: bottom center;
        background: url("../../../assets/1.0/3d/updown2.png") no-repeat;
        width: 304px;
        height: 268px;
        background-size: 100% 14px;
      }
      .front {
        transform: translateZ(0);
        background: url("../../../assets/1.0/3d/front.png") no-repeat;
        width: 304px;
        height: 268px;
        background-size: 100% 268px;
        overflow: hidden;

        .img {
          width: 274px;
          height: 238px;
          overflow: hidden;
          margin-top: 15px;
          margin-left: 15px;
          border-radius: 20px;
          .el-image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  @keyframes spin {
    from {
      transform: rotateY(0);
    }
    to {
      transform: rotateY(360deg);
    }
  }

  .cube {
    animation: spin 20s infinite linear;
  }

  .close {
    background: url("//static.theone.art/pc/images/search-close.png") no-repeat;
    width: 36px;
    height: 36px;
    background-size: 100% auto;
    position: absolute;
    right: 10px;
    z-index: 9999999;
    top: 10px;
    cursor: pointer;
  }
}
</style>
