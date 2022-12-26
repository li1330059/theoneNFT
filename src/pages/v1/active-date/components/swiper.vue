<template>
  <div class="ui-body" v-if="list.length > 0">
    <div class="m-notice">
      <div class="content">
        <div class="swiper-container swiper j-notice-swiper" ref="swiperRef">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, idx) in list" :key="idx">
              <div class="notice-content grayscale">
                <div class="txt">{{ item.key }} : {{item.val}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  created() {
    this.createNoticeSwiper();
  },
  beforeDestroy() {},

  mounted() {},
  computed: {},
  methods: {
    createNoticeSwiper() {
      this.$nextTick(() => {
        new Swiper(this.$refs.swiperRef, {
          loop: this.list.length > 1 ? true : false, // 循环模式选项
          speed: 300,
          autoplay: 5000,
          height: 36,
          direction: "vertical",
          autoplayDisableOnInteraction: false,
          waitForTransition: false,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$pc-height: 36px;

.icon-notice {
  width: 16px;
  height: 16px;
  background-image: url("//static.theone.art/pc/icons/icon-notice.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: inline-block;
}
.ui-btn-group {
  margin-top: 20px;
}

.theone-dialog {
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .content {
    max-height: 420px;
    overflow-y: auto;
    overflow-x: hidden;
    line-height: 28px;
    .time {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
    }
    ::v-deepimg {
      display: block;
      max-width: 100%;
    }
  }
  @media screen and (max-width: 540px) {
    .content {
      max-height: 4.2rem;
      ::v-deep img {
        max-width: 90%;
        margin: 0 auto;
      }
    }
  }
}
.m-notice {
  height: $pc-height;
  overflow: hidden;
  transition: all ease-in-out 0.26s;
  width: 100%;

  &.active {
  }

  .txt {
  }
  @media screen and (max-width: 540px) {
    top: 1.08rem;
    width: 100%;

    background-size: contain;
    .content {
      width: 100%;
      background-size: contain;
    }
    .swiper-slide {
    }
    .txt {
    }
  }
}
.notice-content {
  max-width: 1170px;
  margin: 0 auto;
  .icon {
  }
  height: $pc-height;
  display: flex;
  align-items: center;
  .txt {
    font-size: 12px;
    font-weight: bold;
    color: #333333;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba(0, 0, 0, 0.7);
    flex: 1;
  }
  .padding {
    padding: 0 6px;
  }
  .close {
    width: 14px;
    height: 14px;
    background-image: url("//static.theone.art/pc/icons/icon-notice-close.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    display: inline-block;
  }
  .right {
    padding-top: 1px;
  }
  .left {
    display: flex;
    align-items: center;
    .time {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .line {
      width: 1px;
      height: 20px;
      opacity: 0.1;
      border: 1px solid #333333;
      margin: 0 16px;
    }
  }
  @media screen and (max-width: 540px) {
    .icon {
      top: 0;
    }
  }
}
@media screen and (max-width: 540px) {
  .btns {
    display: none;
  }
  .time {
    display: none;
  }
  .phone-time {
    display: block;
    font-size: 0.28rem;
    font-weight: bold;
    color: #333333;
    span {
      display: block;
      font-size: 0.24rem;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.6);
      margin-top: 0.12rem;
    }
  }
}
</style>