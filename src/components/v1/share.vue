<template>
  <div class="">
    <el-popover :placement="placement" width="200" trigger="hover">
      <div class="share-list-wrap">
        <div
          class="way"
          v-clipboard:copy="shareLink"
          v-clipboard:success="onCopySuccess"
          v-clipboard:error="onCopyError"
        >
          <div class="ui-icon icon-copy"></div>
          <div class="">复制链接</div>
        </div>

        <div class="way wx-way" slot="reference">
          <div class="ui-icon icon-wx"></div>
          <div class="">微信</div>
          <div class="wx_code_img" id="wx_code_img"></div>
        </div>

        <div class="way" @click="shareQQ">
          <div class="ui-icon icon-qq"></div>
          <div class="">QQ</div>
        </div>
      </div>
      <div class="share-txt-wrap" slot="reference">
        <div v-if="!$slots.share">
          分享<span class="ui-icon icon-share"></span>
        </div>
        <slot name="share"> </slot>
      </div>
    </el-popover>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  data() {
    return {
      shareLink: "",
    };
  },
  props: {
    placement: { type: String, default: "left-start" },
    qqPath: {
      type: String,
      default: "",
    },
  },
  created() {
    this.init();
  },
  watch: {
    $route: function (to, from) {
      this.init();
    },
  },

  methods: {
    init() {
      this.shareLink = window.location.href;
      this.$nextTick(() => {
        this.wx_code = new QRCode(document.getElementById("wx_code_img"), {
          width: 80,
          height: 80,
          text: window.location.href,
        });
      });
    },
    onCopySuccess() {
      this.$message.success("复制成功");
    },
    onCopyError() {
      this.$message.warning("复制失败");
    },
    shareQQ() {
      let path = this.qqPath;
      if (this.$common.isMobile()) {
        window.location.href = path;
      } else {
        window.open(path, "_blank");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-share {
  background-image: url("//static.theone.art/pc/images/share.png");
}
.icon-qq {
  background-image: url("//static.theone.art/pc/images/qq.svg");
}
.icon-wx {
  background-image: url("//static.theone.art/pc/images/wechat.svg");
}
.icon-copy {
  background-image: url("//static.theone.art/pc/images/pic-home/link.svg");
}
.wx_code_img {
  position: absolute;
  top: 52px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  opacity: 0;
  transition: all ease-in 0.16s;
}
.wx-way:hover {
  .wx_code_img {
    opacity: 1;
  }
}
.share-list-wrap {
  display: flex;
  .way {
    color: rgba(0, 0, 0, 0.8);
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    flex: 1;
    cursor: pointer;
    position: relative;

    padding: 0;
    min-width: 50px;
    .ui-icon {
      width: 20px;
      height: 20px;
      margin-bottom: 2px;
    }
  }
}
.share-txt-wrap {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  cursor: pointer;
}
</style>
