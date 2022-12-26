<template>
  <div
    class="goods-frame-box hand fade-transition"
    v-if="goodsInfo"
    @click.stop="onCoverClick"
  >
    <div
      class="frame-box"
      :class="{
        'ui-ban': goodsInfo.commodity && goodsInfo.commodity.typeMarket == 1,
        'ui-yan': goodsInfo.commodity && goodsInfo.commodity.typeMarket == 2,
        'ui-shu': goodsInfo.commodity && goodsInfo.commodity.typeMarket == 3,
      }"
    >
      <div class="frame-content" v-if="$slots.content">
        <slot name="content"></slot>
      </div>

      <div class="sum-total-box" v-if="isShowTotal">
        共{{
          goodsInfo.amount +
          goodsInfo.amountLockSold +
          (goodsInfo.amountLockGive ? goodsInfo.amountLockGive : 0)
        }}幅
        <img
          class="right-img"
          src="//static.theone.art/pc/active/compose/bar-right.png"
        />
        <img
          class="left-img"
          src="//static.theone.art/pc/active/compose/bar-left.png"
        />
      </div>

      <div class="img-box">
        <preview-img
          class="cover-wrap"
          :cover="
            (goodsInfo.commodity && goodsInfo.commodity.cover) ||
            goodsInfo.cover
          "
          :picture="
            (goodsInfo.commodity && goodsInfo.commodity.actualPicture) ||
            goodsInfo.actualPicture
          "
          :info="goodsInfo"
          :isShowPreview="isShowPreview"
        ></preview-img>
        <div
          class="honor-img"
          v-if="goodsInfo.honorFlag && goodsInfo.honorFlag == 1"
        ></div>

        <div
          class="prepay-sign-block"
          v-if="
            (isShowPrepaySign && goodsInfo.typeSale == 2) ||
            (isShowPrepaySign &&
              goodsInfo.tags &&
              goodsInfo.tags.search(/presale/gi) != -1)
          "
        >
          <prepay-sign />
        </div>

        <div class="like-box" @click.stop="onToggleLike" v-if="isShowLike">
          <span
            class="ui-icon ui-icon-xin"
            :class="{ 'ui-icon-like': goodsInfo.like }"
          ></span>
          <span class="num">
            {{
              $common.formatFansNumber(
                (goodsInfo.commodity && goodsInfo.commodity.amountLike) ||
                  goodsInfo.amountLike
              ) || 0
            }}</span
          >
        </div>
        <img
          v-if="goodsInfo.showStatus == 4 && isCheckPaying"
          class="pay-ing-wrap"
          src="//static.theone.art/pc/icons/icon-pay-ing.png"
        />
      </div>
      <div class="goods-name hidden-1" v-if="isShowGoodsName">
        {{ goodsInfo.commodity && goodsInfo.commodity.name }}
      </div>
      <div class="commodity-num-box" v-if="isShowNumber">
        <commodity-num :treasure="goodsInfo"></commodity-num>
      </div>
      <div
        class="ui-icon type-market"
        v-if="isShowTypeMarket"
        :class="{
          ban: goodsInfo.commodity && goodsInfo.commodity.typeMarket == 1,
          yan: goodsInfo.commodity && goodsInfo.commodity.typeMarket == 2,
          shu: goodsInfo.commodity && goodsInfo.commodity.typeMarket == 3,
        }"
      ></div>
    </div>

    <slot name="footer"></slot>
    <div v-if="!$slots.footer">
      <div
        class="line-group hand"
        @click.stop="$common.goPage(`/user/${goodsInfo.author.id}`, '_blank')"
      >
        <div class="key">艺术家</div>
        <div class="info">
          <span
            class="ui-icon face"
            :style="`background-image:url(//static.theone.art/pc/icons/icon-author.png)`"
          ></span>
          <div class="artist hidden-1">
            {{
              (goodsInfo.author && goodsInfo.author.nickname) ||
              goodsInfo.authorName ||
              (goodsInfo.commodity && goodsInfo.commodity.authorName)
            }}
          </div>
        </div>
      </div>
      <div class="line-group" v-if="isShowPrice">
        <div class="key">价格</div>
        <div class="info">
          <div
            class="v1-goods-line-status soldout"
            v-if="goodsInfo.showStatus == 2"
          ></div>
          <div class="v1-price hidden" v-else>
            {{
              $common.formatMoney(
                goodsInfo.price ||
                  (goodsInfo.commodity && goodsInfo.commodity.price)
              )
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    isCheckPaying: {
      type: Boolean,
      default: false,
    },
    goodsInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isShowTotal: {
      type: Boolean,
      default: false,
    },
    isShowLike: {
      type: Boolean,
      default: true,
    },
    isShowPrice: {
      type: Boolean,
      default: true,
    },
    isShowPreview: {
      type: Boolean,
      default: true,
    },
    index: {
      type: Number,
      default: 0,
    },
    isShowTypeMarket: {
      type: Boolean,
      default: true,
    },
    isShowGoodsName: {
      type: Boolean,
      default: true,
    },
    isShowNumber: {
      type: Boolean,
      default: true,
    },
    isShowPrepaySign: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {},
  created() {},
  methods: {
    goNextPage(event) {
      if (!event.target.src) {
        this.$common.goPage(`/goods/${this.goodsInfo.id}`, "_blank");
      }
    },
    onCoverClick(e) {
      this.$emit("listenCoverClick", this.goodsInfo, e);
    },
    onToggleLike() {
      this.$emit("listenLike", {
        ...this.goodsInfo,
        index: this.index,
        ...this.params,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.prepay-sign-block {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.ui-icon-xin {
  background-image: url("//static.theone.art/pc/images/pic-home/market-like.png");
}
.ui-icon-like {
  background-image: url("//static.theone.art/pc/images/user3%402x.png");
}
.frame-content {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 3;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  display: none;
}
.goods-frame-box {
  padding: 16px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e3e3e3;

  &:hover {
    .frame-content {
      display: block;
    }
    box-shadow: 0px 2px 16px 0px rgba(182, 182, 182, 0.3);
  }
  .frame-box {
    box-shadow: 0px 0px 4px 0px #e6eff6, inset 0px 0px 14px 2px #e6eff6;
    background-color: #fafdff;
    border: 4px solid #ffffff;
    padding: 12px 12px 4px;
    position: relative;
    .honor-img {
      background-image: url("~@/assets/1.0/images/honor-icon.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 25px;
      height: 28px;
      position: absolute;
      top: 0;
      left: 8px;
      z-index: 1;
    }
    .type-market {
      width: 25px;
      height: 19px;
      position: absolute;
      bottom: 0;
      right: 0;
    }
    .ban {
      background-image: url("//static.theone.art/pc/market-2/ban.png");
    }
    .yan {
      background-image: url("//static.theone.art/pc/market-2/yan.png");
    }

    .shu {
      background-image: url("~@/assets/img/icon/shu@2x.png");
    }
    .img-box {
      position: relative;
      top: 0;
      left: 0;
      padding-bottom: 100%;
    }
    ::v-deep .ui-preview-wrap {
      position: absolute;
    }
    .goods-name {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.7);
      line-height: 24px;
      margin-top: 4px;
      height: 24px;
      text-align: left;
    }
  }
  .ui-yan {
    box-shadow: 0px 0px 4px 0px rgba(237, 230, 248, 0.5),
      inset 0px 0px 14px 2px rgba(237, 230, 248, 0.5);
    background-color: #fcfaff;
  }
  .ui-shu {
    box-shadow: 0px 0px 4px 0px #ffe5e5, inset 0px 0px 14px 2px #ffe5e5;
    background-color: #fcfaff;
    // background-color: rgba(141, 157, 178, 0.14);
  }
  @media screen and (max-width: 540px) {
    padding: 0.16rem;
  }
}
.like-box {
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  padding: 5px 8px;
  .ui-icon {
    width: 18px;
    height: 18px;
  }
  .num {
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    padding-left: 4px;
  }
}
.commodity-num-box {
  margin-top: 4px;
  height: 20px;
  ::v-deep .m-num-wrap {
    padding: 0;
  }
}
.line-group {
  display: flex;
  align-items: center;
  margin-top: 8px;
  .key {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }
  .info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
    padding-left: 10px;
    .face {
      width: 14px;
      height: 14px;
      border-radius: 100%;
      background-size: cover;
    }
    .artist {
      padding-left: 7px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.7);
    }
    .v1-price {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
.sum-total-box {
  position: absolute;
  top: 11px;
  right: 0px;
  height: 38px;
  font-size: 12px;
  color: #333330;
  line-height: 38px;
  z-index: 2;
  padding: 0 10px 0 8px;
  background-image: url("//static.theone.art/pc/active/compose/bar-ctx.png");
  background-size: auto 100%;
  padding-top: 1px;
  .left-img {
    position: absolute;
    left: -8px;
    height: 100%;
    bottom: 0;
  }
  .right-img {
    display: block;
    height: 100%;
    position: absolute;
    bottom: 0px;
    right: -13px;
  }
}
</style>
