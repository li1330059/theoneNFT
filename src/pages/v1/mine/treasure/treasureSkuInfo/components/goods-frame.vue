<template>
  <div class="ui-goods-wrap">
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
		  <div class="honor-img" v-if="goodsInfo.honorList&&goodsInfo.honorList.length>0"></div>
        <div class="img-preview-wrap">
          <div class="img-preview">
            <div
              v-if="goodsInfo.commodity && goodsInfo.commodity.typeFile == 3"
              @click="onPlayVideo(goodsInfo)"
            >
              <div class="icon icon-play"></div>
              <img v-lazy="goodsInfo.commodity && goodsInfo.commodity.cover" />
            </div>

            <img
              v-else
              ref="cover"
              :src="goodsInfo.commodity && goodsInfo.commodity.actualPicture"
              :large="goodsInfo.commodity && goodsInfo.commodity.actualPicture"
              preview="1"
            />
          </div>
        </div>

        <div class="frame-footer">
          <div class="name hidden-1">
            {{ goodsInfo.commodity && goodsInfo.commodity.name }}
          </div>
          <commodity-num :treasure="goodsInfo"></commodity-num>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    goodsInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {};
  },
  created() {},
  methods: {
    onPlayVideo(info) {
      if (info.commodity && info.commodity.actualPicture) {
        this.$store.commit("setGoodsVideoInfo", {
          isShow: true,
          src: info.commodity.actualPicture,
        });
      } else {
        this.$message.warning("暂无视频");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.ui-goods-wrap {
  height: 100%;
  .goods-img-wrap {
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    padding: 26px;
    .frame-footer {
      position: absolute;
      bottom: 8px;
      left: 0;
      width: 100%;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      .name {
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.7);
      }
    }
    .frame-content {
      position: relative;
      top: 0;
      left: 0;
      height: 100%;
	  .honor-img{
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
        height: 100%;
      }
      .img-preview {
        position: relative;
        top: 0;
        left: 0;
        height: calc(100% - 30px);
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
    .frame-top {
      top: 0px;
      left: 0;
      width: 100%;
      height: 26px;
    }
    .frame-left {
      top: 0px;
      left: 0;
      width: 26px;
      height: 100%;
    }
    .frame-right {
      top: 0px;
      right: 0;
      width: 26px;
      height: 100%;
    }
    .frame-bottom {
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 26px;
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .ui-goods-wrap {
      position: relative;
      top:0;
      left:0;
      width: 100%;
      padding-bottom:100%;
    
    .goods-img-wrap {
      height: 100%;
      width:100%;
      position: absolute;
      top: 0;
      left: 0;
      padding: 26px;
      .frame-footer {
        position: absolute;
    
        left: 0;
        width: 100%;
        display: flex;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        .name {
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.7);
        }
      }
      .frame-content {
        position: relative;
        top: 0;
        left: 0;
        height: 100%;
        .img-preview-wrap {
          padding: 16px;
          height: 100%;
        }
        .img-preview {
          position: relative;
          top: 0;
          left: 0;
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
      .frame-top {
        top: 0px;
        left: 0;
        width: 100%;
        height: 26px;
      }
      .frame-left {
        top: 0px;
        left: 0;
        width: 26px;
        height: 100%;
      }
      .frame-right {
        top: 0px;
        right: 0;
        width: 26px;
        height: 100%;
      }
      .frame-bottom {
        bottom: 0px;
        left: 0;
        width: 100%;
        height: 26px;
      }
    }
  }
}
</style>
