<template>
  <div class="news news-body" :class="ifApp ? 'news-app' : ''">
    <div class="mode-mobile" v-if="isShowTitle">
      <m-head :title="`详情`" :show="isShowTitle" />
    </div>
    <div class="news-banner bg-img"></div>

    <div class="news-content">
      <div :class="['news-title', isShowTitle ? '' : 'news-title-top']">
        <h2>{{ newsDetail.name }}</h2>
        <p>{{ newsDetail.releaseTime }}</p>
      </div>
      <div
        class="news-detail"
        v-html="newsDetail.details"
        v-if="newsDetail && newsDetail.details"
      ></div>
      <div v-if="isEmpty" class="news-detail">暂无内容</div>
      <div class="news-share">
        <div>分享至：</div>
        <div class="news-share-way news-share-wx">
          <div class="news-share-code">
            <div id="qrcode"></div>
            <div class="wx-lead">
              打开微信“扫一扫” 打开网页后点击屏幕 右上角分享按钮
            </div>
          </div>
        </div>
        <div class="news-share-way news-share-wb" @click="shareWb"></div>
      </div>
    </div>
  </div>
</template>
<script>
// import mHeader from "@/components/v1/layout/mobileHeader";
import App from "@/utils/app/index";
import QRCode from "qrcodejs2";
import wx from "weixin-js-sdk";
export default {
  components: {},
  data() {
    return {
      isEmpty: false,
      id: null,
      loading: false,
      newsDetail: {},
      isShowTitle: true, //默认展示
      ifApp: false,
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getNewsInfo();
    //分享 微信二维码
    new QRCode("qrcode", {
      width: 70,
      height: 70,
      text: window.location.href,
    });
    this.init();
    this.checkTitle();
  },
  beforeRouteEnter(to, from, next) {
    if (from.meta.hideMoblieFooter) {
      to.meta.hideMoblieFooter = true;
    }
    next();
  },
  methods: {
    checkTitle() {
      const browser = App.browser.browser;
      this.isShowTitle = true;
      if (this.$route.query.is_show) {
        this.isShowTitle = true;
        return;
      }
      if (browser.theone && browser.theone.isTheOne) {
        this.isShowTitle = false;
      }
      if (browser.wechat) {
        //微信内
        this.isShowTitle = false;
      }
      if (browser.weibo) {
        //微博内
        this.isShowTitle = false;
      }
      if (this.$route.meta.hideMoblieFooter) {
        // this.isShowTitle = true;
        if (App.browser.theone && App.browser.theone.isTheOne) {
          document.title = "详情";
        }
      }
      if (App.browser.theone && App.browser.theone.isTheOne) {
        this.ifApp = true;
      }
    },
    async getNewsInfo() {
      try {
        this.loading = true;
        let result = await this.$api.service.dynamicNews_findNews({
          uuid: this.id,
        });
        this.newsDetail = result.data.data || {};
        if (!result.data.data) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
        if (result.data.code == 500) {
          this.$message.error("请稍后重试");
          this.loading = false;
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    shareWb() {
      let path =
        "http://service.weibo.com/share/share.php?url=" +
        window.location.href +
        "&sharesource=weibo&title=" +
        this.newsDetail.name +
        "&pic=" +
        this.newsDetail.cover +
        "&ralateUid=7612430345";
      window.open(path, "_blank");
    },
    async init() {
      let _that = this;
      // const shareData = {
      //   title: _that.newsDetail.name,
      //   desc: "",
      //   link: window.location.href,
      //   imgUrl: _that.newsDetail.cover,
      //   success: function() {}
      // };
      const res = await this.$api.service.weixin_shareConfig({
        shareUrl: window.location.href,
      });
      if (res.data.code == 200) {
        wx.config({
          debug: false, // 开启调试模式
          appId: res.data.data.appId, // 必填，公众号的唯一标识
          timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.data.nonce, // 必填，生成签名的随机串
          signature: res.data.data.signature, // 必填，签名
          jsApiList: ["updateTimelineShareData", "updateAppMessageShareData"],
        });
        wx.ready(function () {
          _that.wxShareAppMessage();
          _that.appMessageShareData();
        });
      }
    },
    wxShareAppMessage() {
      wx.updateTimelineShareData({
        title: this.newsDetail.name,
        desc: "",
        link: window.location.href,
        imgUrl: this.newsDetail.cover,
        success: () => {},
        fail: () => {},
      });
    },
    appMessageShareData() {
      wx.updateAppMessageShareData({
        title: this.newsDetail.name,
        desc: "",
        link: window.location.href,
        imgUrl: this.newsDetail.cover,
        success: function () {},
      });
    },
  },
};
</script>
<style lang="scss">
.news-body {
  min-height: 100vh;
  -webkit-text-size-adjust: 100%;
  background: linear-gradient(0deg, #1b1830, #41425a);
}
.news {
  margin-top: constant(safe-area-inset-top);
  margin-top: env(safe-area-inset-top);

  padding-bottom: 40px;
  .news-detail {
    word-wrap: break-word;
    img {
      max-width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
.news-share {
  display: flex;
  align-content: center;
  margin-top: 36px;
  display: none;
}
::v-deep table {
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
  width: 100%;
}
::v-deep table td {
  border-left: 1px solid #333;
  border-top: 1px solid #333;
}
.news-share-way {
  margin-left: 16px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
}
.news-share-wx {
  background: url("https://static.theone.art/pc/hotspot/icon-wx.png") no-repeat
    center;
  background-size: contain;
  position: relative;
  .news-share-code {
    width: 190px;
    background: #ffffff;
    box-shadow: 0px 2px 20px 0px rgba(87, 87, 87, 0.14);
    border-radius: 4px;
    display: none;
    align-content: flex-start;
    padding: 8px;
    position: absolute;
    right: -175px;
    bottom: -97px;
    color: #666;
  }
  .wx-lead {
    margin-left: 5px;
  }
  &:hover {
    background: url("https://static.theone.art/pc/hotspot/icon-wx1.png")
      no-repeat center;
    background-size: contain;
    .news-share-code {
      display: flex;
    }
  }
}
.news-share-wb {
  background: url("https://static.theone.art/pc/hotspot/icon-wb.png") no-repeat
    center;
  background-size: contain;
  &:hover {
    background: url("https://static.theone.art/pc/hotspot/icon-wb1.png")
      no-repeat center;
    background-size: contain;
  }
}

.news-banner {
  height: 200px;
  background-image: url("//static.theone.art/pc/news/news-detail-banner.png");
}
.news-content {
  max-width: 830px;
  margin: 0 auto;
}

.news-title {
  h2 {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    line-height: 26px;
    padding: 20px 0;
  }
  p {
    font-size: 12px;
    font-weight: 400;
    color: #fff;
  }
}
.news-detail {
  color: #fff;
  margin: 20px auto;
  box-sizing: border-box;
  line-height: 30px;
}
//     @media screen and (min-width: 541px) and (max-width: 960px) {

//   }
@media screen and (max-width: 540px) {
  .news-content {
    padding: 0 15px;
  }
  .news-banner {
    display: none;
  }
  .news-title {
    // padding-top: 70px;
    h2 {
      font-size: 14px;
      padding: 0;
    }
    p {
      font-size: 12px;
      color: rgb(255, 255, 255, 0.8);
    }
  }
  .news-title-top {
    padding-top: 20px;
  }
  .news-detail {
    font-size: 13px;
    font-weight: 400;
    color: #fff;
    line-height: 1.8;
    margin: 20px auto;
    img {
      max-width: 100%;
    }
  }
  .news-share {
    display: none;
  }
}
.news-app {
  padding-top: 20px;
  @media screen and (max-width: 540px) {
    .news-content {
      padding: 0 30px;
    }
    .news-banner {
      display: none;
    }
    .news-title {
      // padding-top: 70px;
      h2 {
        font-size: 14px;
        padding: 0;
      }
      p {
        font-size: 12px;
        color: rgb(255, 255, 255, 0.8);
      }
    }
    .news-title-top {
      padding-top: 20px;
    }
    .news-detail {
      font-size: 13px;
      font-weight: 400;
      color: #fff;
      line-height: 1.8;
      margin: 20px auto;
      img {
        max-width: 100%;
      }
    }
    .news-share {
      display: none;
    }
  }
  @media screen and (min-width: 541px) {
    .news-content {
      padding: 0 15px;
    }
    .news-banner {
      display: none;
    }
    .news-title {
      // padding-top: 70px;
      h2 {
        font-size: 14px;
        padding: 0;
      }
      p {
        font-size: 12px;
        color: rgb(255, 255, 255, 0.8);
      }
    }
    .news-title-top {
      padding-top: 20px;
    }
    .news-detail {
      font-size: 13px;
      font-weight: 400;
      color: #fff;
      line-height: 20px;
      margin: 10px auto;
      img {
        max-width: 100%;
      }
    }
    .news-share {
      display: none;
    }
  }
}
</style>
