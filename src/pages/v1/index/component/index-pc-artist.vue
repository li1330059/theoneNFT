<template>
  <div class="">
    <status-template
      :list="artistResult"
      api="/market/api/author/list"
      :init="$parent.artistList"
    >
      <div class="panel">
        <div class="v1-module-title">让每个艺术家都有光芒</div>
        <div class="pic-list">
          <div
            class="pic-padding"
            v-for="(item, index) in artistResult"
            :key="index"
          >
            <div class="pic-item">
              <div
                class="info pointer"
				@click.stop="artClick(item.uuid)"
              >
                <div>
                  <div
                    class="avatar bg-img"
                    v-lazy:background-image="
                      `${item.avatar ? item.avatar : '/static/img/avatars.svg'}`
                    "
                  ></div>
                  <div class="name">
                    <h3 class="hidden-one">
                      {{ item.nickname ? item.nickname : "-" }}
                    </h3>
                    <span>
                      {{ $common.formatFansNumber(item.passiveNum) || 0 }}粉丝
                    </span>
                  </div>
                  <!--    <div
                    :class="['btn-gz', item.isPassive == 1 ? 'active' : '']"
                    @click.stop="
                      $parent.focusArtist(
                        item.uuid,
                        item.nickname,
                        item.isPassive,
                        index
                      )
                    "
                  >
                    <i :class="[item.isPassive == 1 ? 'active' : '']"></i>
                    {{ item.isPassive == 1 ? "已关注" : "关注" }}
                  </div> -->
                </div>
                <div class="hidden-more">{{ item.remarks }}</div>
              </div>
              <div
                class="img"
                @click.stop="artClick(item.uuid)"
              >
                <preview-img
                  :cover="item.commodityVO && item.commodityVO.cover"
                  :info="{
                    ...item,
                    commodity: item.commodityVO,
                  }"
                ></preview-img>
              </div>
              <div
                class="content pointer"
                v-if="item.commodityVO"
                @click.stop="
                  $parent.goMarket(item.commodityVO.name, item.commodityVO.uuid)
                "
              >
                <h1 class="hidden">
                  {{ item.commodityVO ? item.commodityVO.name : "-" }}
                </h1>
                <!--        <span
                  :class="[
                    item.commodityVO && item.commodityVO.isLike == 1
                      ? 'like-active'
                      : '',
                  ]"
                  @click.stop="
                    $parent.likeGoods(
                      item.commodityVO.uuid,
                      item.commodityVO.isLike,
                      item.commodityVO.name,
                      1,
                      index,
                      1
                    )
                  "
                >
                  {{ item.commodityVO ? item.commodityVO.amountLike : 0 }}
                </span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="btn-item" @click="moreClick()">
          查看更多艺术家
        </div>
      </div>
    </status-template>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    artistResult: {},
  },

  created() {},

  methods: {
	  artClick(uuid){
		  this.$sensors.track('homepage_click', {
		  	module_name: "艺术家"
		  });
		  this.$common.goPage(`/user/${uuid}`, '_blank')
	  },
	  moreClick(){
		  this.$sensors.track('homepage_click', {
			module_name: "查看更多艺术家"
		  });
		  this.$common.goPage(`/artist`, '_blank');
	  }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/1.0/scss/artistList.scss";
.pic-list .pic-item .info {
  height: 130px;
}
.panel {
  .title {
    font-size: 20px;
    font-weight: bold;
    color: #e61f1a;
    position: relative;
    text-align: center;
    &:before {
      content: "";
      background: url("//static.theone.art/pc/images/pic_home_zuo%402x.png")
        no-repeat;
      width: 77px;
      height: 7px;
      background-size: 100% auto;
      display: inline-block;
      vertical-align: middle;
      margin: -4px 16px 0 0;
    }
    &:after {
      content: "";
      background: url("//static.theone.art/pc/images/pic-home/pic_home_you%402x.png")
        no-repeat;
      width: 77px;
      height: 7px;
      background-size: 100% auto;
      display: inline-block;
      vertical-align: middle;
      margin: -4px 0 0 16px;
    }
  }
  .btn-item {
    width: 200px;
    height: 46px;
    border-radius: 23px;
    border: 1px solid #e61f1a;
    text-align: center;
    line-height: 46px;
    font-size: 14px;
    color: #e61f1a;
    margin: 0 auto;
    cursor: pointer;
    &:after {
      content: "";
      background: url("//static.theone.art/pc/images/arrowright3%402x.png")
        no-repeat;
      width: 24px;
      height: 24px;
      background-size: 100% auto;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 0 0 8px;
    }
  }
  &.bg1 {
    width: 100%;
    height: 286px;
    background: #1e1d1d;
    margin-top: 160px;
    padding-top: 68px;
    position: relative;
    .white {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
      &:before {
        background: url("//static.theone.art/pc/images/pic-home/pic_home_you1%402x.png")
          no-repeat;
        background-size: 100% auto;
      }
      &::after {
        background: url("//static.theone.art/pc/images/pic_home_zuo1%402x.png")
          no-repeat;
        background-size: 100% auto;
      }
    }
    .text {
      font-size: 14px;
      color: rgba($color: #fff, $alpha: 0.8);
      line-height: 28px;
      max-width: 1029px;
      margin: 0 auto;
      margin-top: 49px;
    }
    &:before {
      content: "";
      background: url("//static.theone.art/pc/images/pic-home/pic_home_bj3%402x.png");
      width: 211px;
      height: 201px;
      background-size: 100% auto;
      position: absolute;
      left: 0;
      top: 0;
    }
    &::after {
      content: "";
      background: url("//static.theone.art/pc/images/pic-home/pic_home_bj4%402x.png");
      width: 463px;
      height: 286px;
      background-size: 100% auto;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  &.bg2 {
    max-width: 1190px;
    margin: 0 auto;
    margin-top: 160px;
    margin-bottom: 152px;
    .content-list {
      // max-width: 1170px;
      display: flex;
      flex-wrap: wrap;
      .content-item {
        width: 25%;
        padding: 0 28px;
        text-align: center;
        .sub {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #000000;
          line-height: 20px;
          margin-top: 32px;
          margin-bottom: 16px;
        }
        .sub-son {
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: rgba($color: #000000, $alpha: 0.4);
          line-height: 20px;
        }
        .images {
          background: url("//static.theone.art/pc/images/pic-home/pic_home_pei1%402x.png")
            center center no-repeat;
          width: 84px;
          height: 84px;
          margin: 0 auto;
          margin-top: 90px;
          background-size: 100% 100%;
          @for $i from 2 to 5 {
            &.icon#{$i} {
              background: url("../../../../assets/1.0/images/pic_home_pei#{$i}@2x.png")
                center
                center
                no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
      @media screen and (min-width: 541px) and (max-width: 960px) {
        .content-item {
          width: 50%;
        }
      }
      @media screen and (max-width: 540px) {
        .content-item {
          width: 100%;
        }
        ::v-deep .van-tabs__line {
          color: #e61f1a;
        }
      }
    }
  }
}
</style>
