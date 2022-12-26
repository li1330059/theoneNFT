<template>
  <div class="m-index grayscale">
    <div class="info">
      <div
        class="avatar"
        :style="`background-image:url('${
          user_info.avatar || '/static/img/avatars.svg'
        }')  `"
      >
        <span v-if="user_info.isAuthor" class="icon-author"></span>
      </div>
      <div class="content">
        <div class="name">
          {{ user_info.stagename || user_info.nickname || "未设置" }}
        </div>
        <div v-if="user_info.introduce" class="code">
          {{ user_info.introduce }}
        </div>
        <div
          class="ip-address-wrap"
          v-if="user_info.ipAddress"
          @click="onIpTip"
        >
          <span>IP属地：{{ user_info.ipAddress }}</span
          ><span class="ui-icon icon-ip-mobile" />
        </div>
        <copy
          v-if="loginChain && loginChain.address"
          class="code"
          :txt="loginChain && $common.formatAddress(loginChain.address, 6)"
        />
      </div>
    </div>

    <div class="panel noborder">
      <div @click="goPage('/mine/attention/1')" class="block-wrap">
        <div class="icon icon-m-follow"></div>
        <span>我的关注</span>
      </div>
      <div @click="goPage('/mine/attention/2')">
        <div class="icon icon-m-fans"></div>
        <span>我的粉丝</span>
      </div>
      <div @click="goPage('/mine/collect')">
        <div class="icon icon-m-collection"></div>
        <span>我的收藏</span>
      </div>
      <!--    <div @click="goPage('/mine/history')">
        <div class="icon icon-m-history"></div>
        <span>历史浏览</span>
      </div>  -->
    </div>

    <div class="panel noborder border-top">
      <div @click="goPage('/mine/opus')" v-if="user_info.isAuthor == 1">
        <div>
          <div class="bg">
            <div class="icon icon-work"></div>
          </div>
        </div>
        <span>我的作品</span>
      </div>
      <div @click="goPage('/mine/gift')">
        <div>
          <div class="bg">
            <div class="icon icon-gift"></div>
          </div>
        </div>
        <span>我的礼物</span>
      </div>

      <div @click="goPage('/mine/gift_manage')">
        <div>
          <div class="bg">
            <div class="icon icon-gift-m"></div>
          </div>
        </div>
        <span>赠与管理</span>
      </div>
	  <div @click="goPage('/mine/virtual_coupon')">
	    <div>
	      <div class="bg">
	        <div class="icon icon-virtual-coupon"></div>
	      </div>
	    </div>
	    <span>我的卡券</span>
	  </div>
      <div @click="goPage('/mine/treasure')">
        <div>
          <div class="bg">
            <div class="icon i2"></div>
          </div>
        </div>
        <span>我的藏品</span>
      </div>
      <div @click="goPage('/mine/wallet/index')">
        <div>
          <div class="bg">
            <div class="icon i5"></div>
          </div>
        </div>
        <span>支付管理</span>
      </div>
      <div @click="goPage('/mine/setting/index')">
        <div>
          <div class="bg">
            <div class="icon i7"></div>
          </div>
        </div>
        <span>个人设置</span>
      </div>
      <div></div>
      <div></div>
    </div>

    <div class="panel noborder border-top flex-3" style="padding-top: 0.04rem">
      <span class="m-title">我的订单</span>
      <div @click="goPage('/mine/buy')">
        <div class="icon i8"></div>
        <span>我买到的</span>
      </div>
      <div @click="goPage('/mine/release')">
        <div class="icon i9"></div>
        <span>我发布的</span>
      </div>
      <div @click="goPage('/mine/sold')">
        <div class="icon i10"></div>
        <span>我卖出的</span>
      </div>
      <!--    <div @click="goPage('/mine/withdraw')">
        <div class="icon i11"></div>
        <span>我提取的</span>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      loginChain: null,
      isArtist: true,
    };
  },
  computed: {
    user_info() {
      return this.$store.state.user_info;
    },
  },
  created() {},
  methods: {
    onIpTip() {
      this.$confirm(`根据网络运营商数据，展示用户IP属地信息`, "提示", {
        confirmButtonText: "我知道了",
        showCancelButton: false,
        customClass: "mobile-btn-center",
      })
        .then(async () => {})
        .catch(() => {});
    },
    goPage(url) {
      this.$router.push({ path: url });
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.block-wrap {
}
.panel {
  .m-title {
    position: absolute;
    top: 0.2rem;
    left: 0.4rem;
    font-weight: 500;
    color: #000000;
    font-size: 0.28rem;
    display: inline-block;
  }
}
.icon-m-follow {
  background-image: url("//static.theone.art/pc/icons/icon-m-follow.png");
}
.icon-m-fans {
  background-image: url("//static.theone.art/pc/icons/icon-m-fans.png");
}
.icon-m-collection {
  background-image: url("//static.theone.art/pc/icons/icon-m-collection.png");
}
.icon-m-history {
  background-image: url("//static.theone.art/pc/icons/icon-m-history.png");
}
.icon-author {
  position: absolute;
  bottom: 0rem;
  right: -0.14rem;
  width: 0.5rem;
  height: 0.5rem;
}
.ip-address-wrap {
  display: flex;
  align-items: center;
  font-size: 0.24rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  .ui-icon {
    margin-left: 0.03rem;
  }
}
.m-index {
  padding-bottom: 2rem;
  min-height: 100vh;
  .info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: #fff;
    padding: 0.64rem 0.32rem 0rem;
    .avatar {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      margin-right: 0.32rem;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      position: relative;
      top: 0;
      left: 0;
    }
    .content {
      .name {
        font-size: 0.32rem;
        font-weight: bold;
        color: #000000;
      }
      .code {
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba($color: #000000, $alpha: 0.4);
      }
    }
  }

  .panel {
    display: flex;
    align-items: center;
    text-align: center;
    position: relative;
    padding-bottom: 0.42rem;
    background-color: #fff;
    flex-wrap: wrap;
    > div {
      width: 33.33%;
      padding-top: 30px;
      h3 {
        font-size: 0.28rem;
        font-weight: bold;
        color: #000000;
      }
      .bg {
        width: 0.92rem;
        height: 0.92rem;
        border-radius: 50%;
        background-position: center center;
        margin: 0 auto;
        background: rgba($color: #000000, $alpha: 0.03);
        margin-bottom: 0.1rem;
      }
      .icon {
        /*     background: url("")
          no-repeat; */

        width: 0.48rem;
        height: 0.92rem;
        margin: 0 auto;

        @for $i from 2 through 11 {
          &.i#{$i} {
            background: url("~@/assets/1.0/images/header-operate-icon#{$i}.png")
              no-repeat;
            background-size: 100% 0.48rem;
            background-position: center center;
          }
        }

        @for $i from 8 through 11 {
          &.i#{$i} {
            margin-bottom: -0.1rem;
          }
        }
      }
      span {
        font-size: 0.24rem;
        font-weight: 400;
        color: rgba($color: #000000, $alpha: 0.4);
      }

      &.title {
        top: 0.18rem;
        left: 0.48rem;
        position: absolute;
        font-size: 0.28rem;
        font-weight: 500;
        color: #000000;
      }
    }
    &.flex-3 {
      > div {
        width: inherit;
        flex: 1;
      }
    }

    &.noborder {
      border-bottom: none;

      > div {
        span {
          color: rgba($color: #000000, $alpha: 0.7);
        }
      }
    }

    &:nth-child(4) {
      > div {
        &:not(:first-child) {
        }
      }
    }
  }
}
.border-top {
  border-top: 0.16rem solid #fafafa;
}
.v1-mine-banner {
  width: 100%;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: 400;
  color: #ffffff;

  .mine-bg {
    background: rgba($color: #000000, $alpha: 0.3);
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9;
  }

  .mine-avatar {
    z-index: 99;
    position: relative;
    i {
      position: absolute;
      background: url("//static.theone.art/pc/images/yishujia%402x.png")
        no-repeat;
      width: 30px;
      height: 30px;
      background-size: 100% 100%;
      z-index: 999;
      right: 0;
      bottom: 0;
    }
  }

  .mine-content {
    padding-top: 8px;
    z-index: 99;
    &.title {
      font-size: 16px;
      font-weight: bold;
      padding-top: 16px;
    }
  }
}
.icon-work {
  background-image: url("//static.theone.art/pc/images/pic-home/header-operate-icon1.png");
}
.icon-gift {
  background-image: url("//static.theone.art/pc/icons/icon-gift.png");
}
.icon-gift-m {
  background-image: url("//static.theone.art/pc/icons/icon-give-manage.png");
}
.icon-virtual-coupon {
  background-image: url("//static.theone.art/pc/icons/icon-virtual-coupon.png");
}
</style>
