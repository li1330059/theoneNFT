<template>
  <div class="join-us">
    <div class="banner">
      <div class="fg">
        <h1>加入我们</h1>
        <p>Join us</p>
      </div>
    </div>
    <div class="content">
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <div class="center" v-else v-html="pageInfo&&pageInfo.details"></div>
    </div>
  </div>
</template>
<script>
import loading from "@/components/v1/loading/loading";
export default {
  components: { loading },
  data() {
    return {
      loading: false,
      pageInfo: null,
    };
  },
  created() {
    this.getPageInfo();
  },
  methods: {
    async getPageInfo() {
      let result = await this.$api.service.dynamicNews_list({
        location: "join_us"
      });
      if (result.data.code == 200) {
        this.pageInfo = result.data.data[0];
        let html = this.pageInfo.details;
        html = html.replace(/<pre><code class="Html"><xmp>/g,'')
        html = html.replace(/<\/xmp><\/code><\/pre>/g,'')
        this.pageInfo.details = html;
      }
    }
  }
};
</script>
<style lang="scss">
.join-us {
  .loading {
    height: 500px;
  }
  .box {
    background-color: #fdfdfd;
    padding-bottom: 72px;
    box-sizing: border-box;
  }
  .banner {
    width: 100%;
    height: 230px;
    background: url("//static.theone.art/pc/JoinUs/bg%402x.png")
      no-repeat center;
    background-size: cover;
    position: relative;
    .fg {
      width: 1173px;
      height: 171px;
      background: url("//static.theone.art/pc/JoinUs/fg%402x.png")
        no-repeat center;
      background-size: cover;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      padding-top: 65px;
      h1,
      p {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        color: #fff;
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.28);
        margin-left: -20px;
      }
    }
  }
  .content {
    max-width: 1170px;
    background-color: #fff;
    margin: 0 auto;
    padding: 80px 76px 0;
    box-sizing: border-box;
    border-radius: 0 0 4px 4px;
    box-shadow: 0px 16px 38px 0px rgba(180, 180, 180, 0.14),
      0px 1px 33px 0px rgba(255, 255, 255, 0.4);
    .center {
      li {
        display: flex;
        align-items: flex-start;
        padding-bottom: 140px;
        position: relative;
        .num {
          width: 290px;
          height: 180px;
        }
        &::after {
          display: inline-block;
          content: "";
          width: 30px;
          height: 32px;
          background: url("//static.theone.art/pc/JoinUs/icon-arrows.png")
            no-repeat center;
          background-size: contain;
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
        }
        &:nth-child(2n) {
          .num {
            margin-left: 10%;
          }
        }
        &:nth-child(2n + 1) {
          .num {
            margin-right: 10%;
          }
        }
        &:last-child {
          padding-bottom: 80px;
          &::after {
            display: none;
          }
        }
        .title {
          display: inline-block;
          font-size: 20px;
          font-weight: 800;
          color: #78112b;
          background: linear-gradient(
            to bottom,
            #fff 0%,
            #fff 70%,
            rgba(230, 31, 26, 0.1) 71%,
            rgba(230, 31, 26, 0.1) 100%
          );
        }
        .title-span {
          font-size: 30px;
          margin: 0 15px;
          position: relative;
          &::before,
          &::after {
            display: inline-block;
            content: "";
            width: 11px;
            height: 8px;
            background: url("//static.theone.art/pc/JoinUs/icon-symbol.png")
              no-repeat center;
              background-size: contain;
            position: absolute;
          }
          &::before {
            left: -13px;
          }
          &::after {
            transform: rotateY(180deg);
            bottom: -2px;
            right: -12px;
          }
        }
      }
      .text {
        margin: 15px 0 30px;
        font-size: 12px;
        line-height: 24px;
        p {
          &:first-child {
            text-indent: 2em;
          }
        }
        span {
          font-weight: 700;
        }
      }
      .icon {
        display: flex;
        text-align: center;
        div {
          margin-right: 10%;
          font-size: 20px;
          color: #78112b;
        }
        img {
          width: 88px;
          height: 88px;
          margin: 0 auto;
        }
      }
    }
  }
  @media screen and (max-width: 760px) {
    .content {
      padding: 0.2rem 0.12rem 0;
      li {
        flex-direction: column;
        &:nth-child(2n) {
          flex-direction: column-reverse;
          .num {
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>