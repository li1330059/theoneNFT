<template>
  <!-- 发送源文件到邮箱 -->
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    width="500px"
    top="22vh"
    :title="`下载源文件到邮箱`"
    :fullscreen="isPc ? false : true"
  >
    <div v-if="!sendIng" class="dialog-content">
      <p v-if="type == 0" class="text">您还没有邮箱,去设置邮箱</p>
      <p v-if="type == 1" class="text">
        <span class="color1">邮箱：</span
        ><span class="color2">{{ userInfo.email }}</span>
      </p>
      <p v-if="type == 2" class="text">{{ mailText.text || "" }}</p>
      <div class="form-btns">
        <div v-if="type == 0" class="v1-btn mycenter red" @click="setEmail()">
          去设置
        </div>
        <div v-if="type == 1" class="v1-btn mycenter red" @click="submit()">
          发送
        </div>
        <div
          v-if="type == 2"
          class="v1-btn mycenter red"
          @click="dialogVisible = false"
        >
          确定
        </div>
      </div>
    </div>
    <div v-else class="loading">
      <div class="loadEffect">
        <span v-for="(item, index) in 8" :key="index"></span>
      </div>
      <p>正在发送，请耐心等待...</p>
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  props: {
    userInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      mailText: {},
      dialogVisible: false,
      isPc: true,
      type: 2, //0:没有邮箱 1:有邮箱  2:发送成功
      sendIng: false, //是否正在发送邮件
    };
  },

  methods: {
    async init(wallet) {
      this.dialogVisible = true;
      this.isPc = !this.$common.isMobile();
      this.getTxt();
      if (this.userInfo.email && this.userInfo.email !== "") {
        //发送邮件
        this.type = 1;
      } else {
        //设置邮箱
        this.type = 0;
      }
    },
    async getTxt() {
      const res = await this.$api.service.getByKey_collectionImgSuccessToast();
      if (res.data.code == 200) {
        this.mailText = res.data.data;
      }
    },
    // 设置邮箱
    setEmail() {
      this.$emit("listen");
      this.dialogVisible = false;
    },
    async submit() {
      // 发送邮件接口然后加载中
      // this.$emit("sendLoading");
      this.sendIng = true;
      let result = await this.$api.service.commodityDownload_commodityDownload({
        id: this.id,
      });
      if (result.data.code == 200) {
        this.type = 2;
      } else {
        this.$message({
          message: result.data.message,
          type: "error",
        });
      }
      this.sendIng = false;
      // this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/mineSettings.scss";
.page-mine-setting-nameVerified .message {
  color: rgba($color: #000000, $alpha: 0.7);
}
.text {
  color: rgba(0, 0, 0, 1);
  margin-bottom: 16px;
  text-align: center;
}
.form-btns {
  display: flex;
  justify-content: center;
}
.color1 {
  color: rgba(0, 0, 0, 0.4);
}
.color2 {
  color: rgba(0, 0, 0, 0.79);
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.loadEffect {
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 auto;
  margin: 60px auto;
}
.loadEffect span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #aaa;
  position: absolute;
  -webkit-animation: load 1.04s ease infinite;
}
@-webkit-keyframes load {
  0% {
    -webkit-transform: scale(1.5);
    background: #d3583f;
  }
  50% {
    -webkit-transform: scale(1);
    background: #d3583f;
  }
  51% {
    -webkit-transform: scale(1);
    background: #aaa;
  }
  100% {
    -webkit-transform: scale(1);
    background: #aaa;
  }
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -5px;
  -webkit-animation-delay: 0.13s;
}
.loadEffect span:nth-child(2) {
  left: 14px;
  top: 14px;
  -webkit-animation-delay: 0.26s;
}
.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -5px;
  -webkit-animation-delay: 0.39s;
}
.loadEffect span:nth-child(4) {
  top: 14px;
  right: 14px;
  -webkit-animation-delay: 0.52s;
}
.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -px;
  -webkit-animation-delay: 0.65s;
}
.loadEffect span:nth-child(6) {
  right: 14px;
  bottom: 14px;
  -webkit-animation-delay: 0.78s;
}
.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -6px;
  -webkit-animation-delay: 0.91s;
}
.loadEffect span:nth-child(8) {
  bottom: 14px;
  left: 14px;
  margin-top: -5px;
  -webkit-animation-delay: 1.04s;
}

@media screen and (max-width: 541px) {
  .dialog-content {
    margin-top: 5vh;
  }
}
</style>
