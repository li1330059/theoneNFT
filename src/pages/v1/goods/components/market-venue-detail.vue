<template>
  <div class="">
    <div
      class="ui-venue-detail"
      :style="`background-image:url(${data.coverExpand01})`"
      v-if="data && data.childrens.length > 0"
    >
      <div class="content">
        <div
          class="m-venue-detail-block"
          v-for="(item, idx) in data.childrens"
          :key="idx"
          @click="goMarket(item)"
        >
          <div class="detail-block-border">
            <div class="detail-block-content">
              <div class="left">
                <div class="cover">
                  <div
                    class="bg preview-img"
                    v-lazy:background-image="item.cover"
                    :key="item.cover"
                  ></div>
                  <div
                    class="preview preview-img"
                    v-lazy:background-image="item.cover"
                    :key="item.cover"
                  ></div>
                </div>
              </div>
              <div class="right">
                <div class="title hidden-one">{{ item.name }}</div>
                <div class="line"></div>
                <div class="des hidden-one">
                  {{ item.description }}
                </div>
                <div class="more-btn">
                  查看更多<span class="icon icon-right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else><Empty></Empty></div>
  </div>
</template>
<script>
import Empty from "@/components/v1/empty";
export default {
  props: {
    goMarket: {
      type: Function,
      default: () => {},
    },
    data: {},
  },
  components: { Empty },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    /*  goMarket(info) {
      this.$parent.goMarket(info);
    }, */
  },
};
</script>
<style lang="scss" scoped>
.ui-venue-detail {
  padding: 170px 9px 9px 9px;
  border-radius: 20px;
  background-size: 100% auto;
  background-position: top center;
  background-repeat: no-repeat;
  .content {
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 10px;
    border-radius: 20px;
  }
  @media screen and (max-width: 540px) {
    padding: 1.3rem 0.24rem 0.76rem;
    .content {
      padding: 0.05rem;
    }
  }
}
.m-venue-detail-block {
  width: 50%;
  padding: 10px;
  .detail-block-border {
    padding: 1px;
    border-radius: 20px;
    background-image: linear-gradient(
      90deg,
      rgba(192, 121, 229, 1),
      rgba(112, 158, 247, 0.4)
    );
  }
  .detail-block-content {
    display: flex;
    background: #ffffff;
    box-shadow: 0px 0px 14px 0px rgba(182, 182, 182, 0.3);
    cursor: pointer;
    border-radius: 20px;

    padding: 10px;
    &:hover {
      box-shadow: 0px 0px 14px 0px rgba(182, 182, 182, 0.3);
    }
    @media screen and (max-width: 540px) {
      display: block;
      .cover {
        margin-bottom: 0.2rem;
      }
    }
  }

  .left {
    flex: 2;
    .cover {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      padding-bottom: 60%;
      overflow: hidden;
      border-radius: 16px;
    }
    .bg {
      filter: blur(30px);
    }
    .preview-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    .preview {
      width: 80%;
      height: 70%;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      border-radius: 8px;
    }
    @media screen and (max-width: 540px) {
      .cover {
        border-radius: 0.16rem;
      }
      .preview {
         border-radius:.08rem;
      }
    }
  }
  .right {
    flex: 3;
    padding-left: 15px;
    .title {
      font-size: 20px;
      font-weight: 500;
      color: #000000;
      margin-bottom:6px;
    }
    .line {
      background-image: url("//static.theone.art/pc/market/icon-line.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      width: 120px;
      height: 6px;
    }
    .des {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      padding: 16px 0;
      height:50px;
    }
    .more-btn {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      .icon {
        display: block;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }
      .icon-right {
        margin-left: 4px;
        background-image: url("//static.theone.art/pc/market/icon-right.png");
      }
    }
  }
  @media screen and (max-width: 540px) {
    .right {
      .more-btn {
        font-size: 0.24rem;
      }
      .des {
        font-size: 0.24rem;
        padding:.16rem 0;
        height:.7rem;
      }
      .icon {
        width: 0.24rem;
        height: 0.24rem;
      }
      .title {
        font-size: 0.24rem;
        margin-bottom: 0.1rem;
      }
      .line {
        width: 90%;
      }
    }
  }
}
</style>
