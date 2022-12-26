<template>
  <div class="ui-body">
    <div class="m-info">
      <img
        class="title responsive-img"
        src="//static.theone.art/pc/app-download/title.png"
      />
      <div class="line"></div>
      <div class="txt">数字艺术电商平台，更多精彩尽在APP。</div>
      <div class="ui-banner mobile-banner">
        <img
          class="responsive-img"
          src="//static.theone.art/pc/app-download/banner-phone.png"
        />
      </div>
      <div class="btn-group">
        <div class="btn" @click="download('android')">
          <span class="icon android" /> 立即下载
          <div class="code-wrap">
            <div class="triangle-up" />
            <img
              class="responsive-img"
              src="https://static.theone.art/pc/app-download/qrcode-oss.png"
            />
          </div>
        </div>
        <!--         <div class="btn disabled"><span class="icon ios" /> 敬请期待</div> -->
        <div class="btn" @click="download('ios')">
          <span class="icon ios" /> 立即下载
          <div class="code-wrap">
            <div class="triangle-up" />
            <img
              class="responsive-img"
              src="//static.theone.art/pc/app-download/ios-code.png"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="ui-banner">
      <img
        class="responsive-img"
        src="//static.theone.art/pc/app-download/banner-phone.png"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      configInfo: {},
    };
  },
  created() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      let result = await this.$api.service.config_getConfigByType({ type: 1 });
      if (result && result.data.code == 200) {
        this.configInfo = result.data.data;
      }
    },
    download(type) {
      if (type == "android") {
        if (this.$common.isMobile()) {
          window.location.href = `https://static.theone.art/app/uniapp/apk/theone-220.apk`;
        } else {
          if (this.configInfo.confValue5) {
            window.location.href = this.configInfo.confValue5;
          } else {
            this.$message.warning("没有文件可供下载");
          }
        }
      } else {
        if (this.$common.isMobile()) {
          window.location.href = `https://apps.apple.com/cn/app/%E5%94%AF%E8%89%BA%E5%8D%A1%E5%8C%85/id1602366246`;
        } else {
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.responsive-img {
  width: 100%;
  display: block;
}
.ui-body {
  background: url("//static.theone.art/pc/app-download/bg.png")
    no-repeat center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 90px 170px;
  min-height:65vh;
}
.icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.android {
  background-image: url("//static.theone.art/pc/app-download/android.png");
}
.ios {
  background-image: url("//static.theone.art/pc/app-download/ios.png");
}
.ui-banner {
  max-width: 413px;
  min-width: 244px;
}
.mobile-banner {
  display: none;
}
.btn-group {
  display: flex;
  .btn:first-child {
    margin-right: 16px;
  }
}
.btn {
  width: 136px;
  line-height: 46px;
  cursor: pointer;
  position: relative;
  top: 0;
  left: 0;
  background-image: linear-gradient(
    90deg,
    rgba(192, 121, 229, 1) 0%,
    rgba(112, 158, 247, 1) 100%
  );
  border-radius: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  .icon {
    margin-right: 6px;
  }
  .code-wrap {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    padding: 6px;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    line-height: inherit;
    text-align: center;
    .triangle-up {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &:hover {
    .code-wrap {
      display: block;
    }
  }
  @media screen and (max-width: 540px) {
    &:hover {
      .code-wrap {
        display: none;
      }
    }
  }
}
.disabled {
  background: #a7a7a7;
}
.triangle-up {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 10px solid rgba(255, 255, 255, 0.4);
}

.m-info {
  max-width: 400px;
  margin-right: 80px;
  .title {
    margin-bottom: 32px;
  }
  .line {
    width: 77px;
    height: 8px;
    border-radius: 50px;
    background-image: linear-gradient(
      90deg,
      rgba(192, 121, 229, 1) 0%,
      rgba(112, 158, 247, 1) 100%
    );
    margin-bottom: 32px;
  }
  .txt {
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    line-height: 28px;
    letter-spacing: 3px;
    margin-bottom: 48px;
  }
}
@media screen and (max-width: 540px) {
  .ui-body {
    display: block;
    padding: 0.8rem 0.3rem;
    .m-info {
      max-width: inherit;
      margin: 0;
      padding-bottom: 1.4rem;
      padding-top: 1rem;
      .title {
        width: 70%;
        margin: 0 auto;
      }
      .line {
        margin: 0.28rem auto;
      }
      .txt {
        font-size: 0.32rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 0.6rem;
      }
    }
  }
  .btn-group {
    justify-content: center;
  }
  .ui-banner {
    display: none;
  }
  .mobile-banner {
    display: block;
    width: 70%;
    margin: 0 auto 0.6rem;
  }
}
</style>