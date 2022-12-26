<template>
  <div class="success-dialog-body" v-if="isShow">
    <div class="mask"></div>
    <div class="main">
      <img
        class="t-img"
        src="//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/success-title-img.png"
      />
      <div class="res-content active-blind-box-dialog-bg-color">
        <div class="get-goods-wrap">
          <div class="goods-box">
            <div
              class="goods-wrap bg-img"
              :style="`background-image:url(${
                goodsObj.commodity && goodsObj.commodity.cover
              })`"
            ></div>
          </div>
          <!--       <div class="goods-box">
            <div class="goods-wrap"></div>
          </div> -->
        </div>
        <div class="footer">
          <div class="left ui-icon icon-border"></div>
          <div class="info">
            <div class="goods-name">
              {{ goodsObj.commodity && goodsObj.commodity.name }}
            </div>
            <div class="txt">
              <span class="smal">去</span
              ><span class="link hand" @click="goCollect">我的藏品</span
              ><sapn class="small">查看</sapn>
            </div>
          </div>
          <div class="right ui-icon icon-border icon-rotate"></div>
        </div>
      </div>
      <img
        class="close hand"
        @click="hide"
        src="//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-success-close.png"
      />
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      isShow: false,
      goodsObj: {},
    };
  },
  created() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    hide() {
      this.isShow = false;
    },
    show(goodsObj) {
      this.goodsObj = goodsObj;
      this.isShow = true;
    },
    goCollect() {
      this.$router.push(`/mine/treasure`);
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-border {
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/golden-key-blind-box/icon-border.png");
}
.icon-rotate {
  transform: rotateY(180deg);
}
.success-dialog-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.main {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  max-width: 698px;
  transform: translate(-50%, -50%);

  .t-img {
    display: block;
    margin: 0 auto -110px;
    width: 338px;
  }
  .res-content {
    // background: #e1ecf2;
    border-radius: 10px;
    padding: 140px 100px 120px;
    .get-goods-wrap {
      display: flex;
      .goods-box {
        flex: 1;
        padding: 5px;
        .goods-wrap {
          height: 276px;
          background-size: contain;
        }
        .small-goods {
          padding-bottom: 45%;
        }
      }
    }
  }
  .footer {
    margin-top: 76px;
    display: flex;
    .icon-border {
      width: 35px;
      height: 75px;
    }
    .info {
      flex: 1;
    }
    .goods-name {
      font-size: 16px;
      font-weight: 500;
      color: #222222;
      text-align: center;
      margin-bottom: 13px;
    }
    .txt {
      font-weight: 400;
      color: #222222;
      text-align: center;
      .small {
        font-size: 16px;
      }
      .link {
        font-size: 24px;
        text-decoration: underline;
      }
    }
  }
  .close {
    display: block;
    width: 79px;
    margin: 52px auto 0;
  }
  @media screen and (max-width: 540px) {
    .t-img {
      display: block;
      margin: 0 auto -0.7rem;
      width: 2.14rem;
    }
    .res-content {
      border-radius: 0.1rem;
      padding: 1.4rem 0.2rem 0.74rem;
      .get-goods-wrap {
        display: flex;
        .goods-box {
          flex: 1;
          padding: 5px;
          .goods-wrap {
          }
          .small-goods {
            padding-bottom: 45%;
          }
        }
      }
    }
    .close {
      width: 0.6rem;
      margin-top: 0.4rem;
    }
    .footer {
      margin-top: 0.58rem;
      .goods-name {
        font-size: 0.24rem;
        font-weight: 500;
        color: #222222;
        text-align: center;
        margin-bottom: 0.15rem;
      }
      .txt {
        font-weight: 400;
        color: #222222;
        text-align: center;
        .small {
          font-size: 0.16rem;
        }
        .link {
          font-size: 0.24rem;
        }
      }
    }
  }
}
</style>
