<template>
  <div class="com-goods-card">
    <div class="goods-card">
      <el-tooltip content="点击查看原图" placement="right">
        <div class="goods-cover" @click="showBigPic()">
          <img ref="cover" :src="goods.cover" :large="goods.cover" preview="1" />
        </div>
      </el-tooltip>
      <div class="goods-info">
        <div class="goods-info-main">
          <div class="title">
            <h1>{{ goods.name }}</h1>
            <div class="operate">
              <div
                class="v1-btn v1-btn-heart no-border"
                @click="collection(1)"
                v-if="!this.isCollection"
              ></div>
              <div
                class="v1-btn v1-btn-broken-heart no-border"
                @click="collection(0)"
                v-else
              ></div>
              <div class="share-btn">
                <div class="v1-btn v1-btn-share no-border"></div>
                <div class="share-bar">
                  <div
                    class="share-item"
                    v-for="(itemShare, indexShare) in shareOptions"
                    :key="indexShare"
                    @click="shareClick(itemShare)"
                    :class="itemShare.icon"
                  >
                    {{ itemShare.name }}

                    <div
                      id="qrcode"
                      class="share-code"
                      v-if="itemShare.key == 'wechat'"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="series" v-if="goods.worksSeriesName || goods.label">
            <div class="name">{{ goods.worksSeriesName }}</div>
            <div class="label" v-if="goods.label">
              <span v-for="(item, index) in goods.label" :key="index">{{ item }}</span>
            </div>
          </div>
          <div class="v1-price">{{ $common.formatMoney(goods.price) }}</div>
          <div class="" v-if="goods.sell == 0 || goods.sell == 3 || goods.sum == 0">
            已售罄
          </div>
          <div v-else-if="goods.resaleUserUuid">在售数量 {{ goods.sum }}</div>
          <!-- <div class="content">{{ goods.introduce }}</div> -->
        </div>
        <div>
          <div class="address" v-if="goods.contractAddress">
            <div class="addr-title">
              <span
                >合约地址
                <div class="message">
                  智能合约是存储在区块链网络中的一段代码，它界定了各方使用合同的条件。
                  所以如果需要的条件被满足，就被自动执行。合约地址是指该智能合约的合同编号（ID）
                </div></span
              >
            </div>
            <div
              class="con"
              v-clipboard:copy="goods.contractAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
            >
              {{ goods.contractAddress }}
            </div>
          </div>
          <div class="address" v-if="goods.tokenId">
            <div class="addr-title">
              <span
                >Token ID
                <div class="message">
                  每一个数字艺术品拥有独特且唯一的标识-Token ID，每一个Token
                  ID都对应着链上的一个数字艺术品（非同质化资产/通证）
                </div></span
              >
            </div>
            <div
              class="con"
              v-clipboard:copy="goods.tokenId"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
            >
              {{ goods.tokenId }}
            </div>
          </div>
        </div>
        <div class="goods-operate">
          <div
            :class="{
              'v1-btn': true,
              disable: goods.sell == 0 || goods.sell == 3 || goods.sum == 0,
            }"
            @click="buyClick"
          >
            立即购买
          </div>
        </div>
      </div>
    </div>
    <div v-if="goods.introduce">
      <div class="v1-card-title">艺术品鉴赏</div>
      <div class="goods-introduce">{{ goods.introduce }}</div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
export default {
  props: ["goods"],
  components: {},
  data() {
    return {
      isCollection: false,
      shareOptions: [
        { icon: "link", name: "复制链接", key: "copy" },
        { icon: "wechat", name: "微信", key: "wechat" },
        { icon: "qq", name: "QQ", key: "QQ" },
      ],
    };
  },
  mounted() {
    //分享 微信二维码
    new QRCode("qrcode", {
      width: 80,
      height: 80,
      text: window.location.href,
    });
    this.getGoodsFocusByUuid();
  },
  methods: {
    shareClick(item) {
      let url = window.location.href;
      if (item.key == "copy") {
        var domUrl = document.createElement("input");
        domUrl.value = url;
        domUrl.id = "creatDom";
        document.body.appendChild(domUrl);
        domUrl.select();
        document.execCommand("Copy");
        let creatDom = document.getElementById("creatDom");
        creatDom.parentNode.removeChild(creatDom);
        this.$message.success("复制成功，粘贴给小伙伴们吧~");
      } else if (item.key == "weibo") {
        let path =
          "http://service.weibo.com/share/share.php?url=" +
          url +
          "&sharesource=weibo&title=" +
          this.goods.name +
          "&pic=" +
          this.goods.cover +
          "&appkey=";
        window.open(path, "_blank");
      } else if (item.key == "wechat") {
      } else if (item.key == "QQ") {
        let path =
          "http://connect.qq.com/widget/shareqq/index.html?url=" +
          encodeURIComponent(url) +
          "&sharesource=qzone&title=" +
          this.goods.name +
          "&pics=" +
          this.goods.cover +
          "&summary=" +
          this.goods.introduce +
          "&desc=" +
          this.goods.name;
        window.open(path, "_blank");
      }
    },
    async collection(operate) {
      let localMember = localStorage.getItem("THEONE_MEMBER");
      if (!localMember) {
        document.getElementById("phoneLogin").click();
        return;
      }
      let collectionParam = {
        type: 1,
        uuid: this.goods.id,
      };
      let result = null;
      if (operate == 1) {
        result = await this.$api.userService.goodsFocus(collectionParam);
      } else if (operate == 0) {
        result = await this.$api.userService.cancelGoodsFocus(collectionParam);
      }
      if (result.data.code == 200) {
        this.$message.success("操作成功");
        if (operate == 1) {
          this.isCollection = true;
        } else if (operate == 0) {
          this.isCollection = false;
        }
      } else {
        this.$message.error(result.data.message);
      }
    },
    // 是否已经收藏
    async getGoodsFocusByUuid() {
      let loginMember = localStorage.getItem("THEONE_MEMBER");
      if (loginMember) {
        let result = await this.$api.userService.getGoodsFocusByUuid({
          uuid: this.goods.id,
          type: 1,
        });
        this.isCollection = result.data.data;
      }
    },
    buyClick() {
      // this.$router.push({
      //   name: "update",
      // });
      // return;
      if (this.goods.sell == 0 || this.goods.sell == 3 || this.goods.sum == 0) {
        return;
      }
      let localMember = localStorage.getItem("THEONE_MEMBER");
      if (localMember) {
        this.$router.push({
          path: `/order/${this.goods.id}`,
        });
      } else {
        document.getElementById("phoneLogin").click();
      }
    },
    showBigPic() {
      this.$refs.cover.click();
    },
    onCopy(e) {
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    onCopyError() {
      this.$message({
        message: "浏览器不支持",
        type: "error",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.com-goods-card {
  .share-bar {
    transition: all 0.3s;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #fff;
    box-shadow: 0px 2px 8px 3px rgba(217, 217, 217, 0.28);
    border-radius: 4px;
    font-size: 12px;
    line-height: 20px;
    width: 200px;
    padding: 10px;
    .share-item {
      position: relative;
      background: url("//static.theone.art/pc/images/pic-home/link.svg") no-repeat top center;
      background-size: 20px 20px;
      padding-top: 20px;
      cursor: pointer;
      color: rgba($color: #000000, $alpha: 0.8);
      &.link {
        background-image: url("//static.theone.art/pc/images/pic-home/link.svg");
      }
      &.qq {
        background-image: url("//static.theone.art/pc/images/qq.svg");
      }
      &.wechat {
        background-image: url("//static.theone.art/pc/images/wechat.svg");
      }
      .share-code {
        display: none;
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      &:hover {
        .share-code {
          display: block;
        }
      }
    }
  }
  .share-btn {
    position: relative;
    &:hover {
      .share-bar {
        display: flex;
      }
    }
    .share-bar {
      display: none;
      right: 40px;
      top: -10px;
    }
  }
  .goods-introduce {
    box-shadow: 0px 2px 8px 4px rgba(153, 153, 153, 0.4);
    padding: 20px;
    font-size: 16px;
    color: #666666;
    background: #ffffff;
    box-shadow: 0px 2px 8px 3px rgba(217, 217, 217, 0.28);
    border-radius: 4px;
  }
  .goods-card {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .goods-cover {
      flex: 1;
      margin-right: 3%;
      overflow: hidden;
      box-shadow: 0px 2px 8px 4px rgba(153, 153, 153, 0.4);
      height: 570px;
      position: relative;
      cursor: pointer;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        border: 1px solid #dcdcdc;
      }
    }
    .goods-info {
      flex: 1;
      margin-left: 3%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 16px;
      color: rgba($color: #000000, $alpha: 0.4);

      .goods-info-main {
        padding-bottom: 20px;
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
      }
      .title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        h1 {
          font-size: 34px;
          font-weight: 500;
          color: #000000;
          line-height: 40px;
        }
        .operate {
          display: flex;
          height: 40px;
        }
      }
      .series {
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .name {
          margin-right: 15px;
        }
        .label {
          display: flex;
          span {
            padding: 2px 15px;
            display: block;
            border-radius: 4px;
            margin-right: 15px;
            &:nth-child(1) {
              background: rgba($color: #6282ff, $alpha: 0.3);
              color: #6282ff;
            }
            &:nth-child(2) {
              background: rgba($color: #ff864d, $alpha: 0.3);
              color: #ff864d;
            }
            &:nth-child(3) {
              background: rgba($color: #909090, $alpha: 0.3);
              color: #909090;
            }
          }
        }
      }
      .v1-price {
        font-size: 22px;
        background-size: 20px 21px;
        padding-left: 25px;
        margin-bottom: 20px;
      }
      .content {
        max-height: 120px;
        overflow-y: auto;
        padding-right: 13px;
      }
      .address {
        margin-bottom: 20px;
        .addr-title {
          span {
            cursor: pointer;
            display: inline-block;
            margin-bottom: 18px;
            background: url("//static.theone.art/pc/images/question-mark.png") no-repeat
              right center;
            padding-right: 20px;
            background-size: 14px 14px;
            position: relative;
            &:hover {
              .message {
                display: block;
              }
            }
          }
          .message {
            transition: all 0.3s;
            display: none;
            position: absolute;
            background: #fff;
            width: 300px;
            right: 0px;
            transform: translateX(100%);
            bottom: 30px;
            padding: 20px;
            box-shadow: 0px 2px 8px 4px rgba(153, 153, 153, 0.4);
          }
        }
        .con {
          display: inline-block;
          color: #000000;
          background: url("//static.theone.art/pc/images/pic-home/copy.png") no-repeat right center;
          padding-right: 20px;
          background-size: 12px 12px;
          cursor: pointer;
          word-break: break-all;
        }
      }
      .goods-operate {
        .v1-btn {
          height: 64px;
          line-height: 64px;
          font-size: 22px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 541px) {
  .com-goods-card {
    .goods-card {
      flex-direction: column;
      .goods-cover {
        flex: initial;
        margin-bottom: 20px;
      }
      .goods-info .goods-operate .v1-btn {
        position: fixed;
        width: 100%;
        bottom: 0px;
        left: 0px;
        z-index: 99;
      }
    }
  }
}
</style>
