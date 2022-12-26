<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    width="500px"
    :title="`设置邮箱`"
	center="true"
    :fullscreen="isPc ? false : true"
    @close="closeDialog()"
  >
    <div class="dialog-content">
      <p class="text">邮箱是您下载商品源文件的唯一地址，请仔细填写</p>
      <div class="dialog-form">
        <div :class="['form-line', emailFalse ? 'form-line-color' : '']">
          <h1 class="title">邮箱</h1>
          <div class="input-line">
            <el-input
              v-model="email"
              placeholder="请输入邮箱地址"
              type="email"
            ></el-input>
          </div>
          <div v-if="emailFalse" class="text-color">与原邮箱相同</div>
        </div>
        <div class="form-line">
          <h1 class="title">验证码</h1>
          <div class="code">
            <div class="input-line input-code">
              <el-input
                v-model="emailCode"
                placeholder="请输入邮箱里的验证码"
              ></el-input>
            </div>
            <div class="send-btn">
              <div
                v-show="!verification_code_disabled"
                class="btn pointer"
                @click="sendEmailCode"
              >
                {{ isPc ? "发送" : "发送验证码" }}
              </div>
              <div
                v-show="verification_code_disabled"
                class="btn countdown disabled"
              >
                {{ code_down_count }}s后重新发送
              </div>
            </div>
          </div>
        </div>

        <div class="form-btns">
          <div class="v1-btn mycenter red" @click="submit()">确定</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import countDown from "@/utils/countDown";
export default {
  components: {},
  props: {
    userInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      email: "",
      emailCode: "",
      isPc: true,
      emailFalse: false,
      isSendEmailCode: true,
      verification_code_disabled: false,
      code_down_count: 60,
    };
  },
  beforeDestroy() {
    if (this.countDown) {
      this.countDown.stop();
    }
    this.verification_code_disabled = true;
    this.code_down_count = 60;
  },
  methods: {
    async init(wallet) {
      this.dialogVisible = true;
      this.restInput();
      this.isPc = !this.$common.isMobile();
    },
    restInput() {
      this.email = "";
      this.emailCode = "";
    },
    closeDialog() {
      if (this.countDown) {
        this.countDown.stop();
        this.verification_code_disabled = false;
        this.code_down_count = 60;
      }
    },
    //邮箱输入框验证
    checkEmailInput() {
      if (this.email.trim() == "") {
        this.$message({
          message: "邮箱不能为空",
          type: "error",
        });
        return false;
      } else if (this.userInfo.email && this.userInfo.email.trim() != "") {
        if (this.userInfo.email == this.email.trim()) {
          this.emailFalse = true;
          return false;
        } else {
          this.emailFalse = false;
          return true;
        }
      } else {
        return true;
      }
    },
    //发送邮箱验证
    async sendEmailCode() {
      if (this.checkEmailInput() && this.isSendEmailCode) {
        this.isSendEmailCode = false;
        let result = await this.$api.service.commodityDownload_sendEmailCode({
          email: this.email.trim(),
        });
        if (result.data.code == 200) {
          this.verification_code_disabled = true;
          this.countDown = new countDown({
            cdTime: 60,
            tickCall: (obj) => {
              this.code_down_count = obj.cdTime;
            },
            endCall: () => {
              this.verification_code_disabled = false;
            },
          });
          this.$message({
            message: "验证码发送成功",
            type: "success",
          });
          this.$message({
            message: "发送成功",
            type: "success",
          });
        } else {
          this.$message({
            message: result.data.message,
            type: "error",
          });
        }
        this.isSendEmailCode = true;
      }
    },
    //设置邮箱
    async submit() {
      if (this.checkEmailInput()) {
        if (this.emailCode.trim() == "") {
          this.$message({
            message: "验证码不能为空",
            type: "error",
          });
          return false;
        }
        let result = await this.$api.service.userAttribute_updateEamil({
          eamil: this.email.trim(),
          emailCode: this.emailCode.trim(),
        });
        if (result.data.code == 200) {
          this.$message({
            message: "设置成功",
            type: "success",
          });
          this.$store.commit("setUserInfo", { email: this.email.trim() });
          this.dialogVisible = false;
          this.$emit("listen", { result: true });
        } else {
          this.$message({
            message: result.data.message,
            type: "error",
          });
        }
      }
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
}
.input-code {
  width: 69%;
}
.code {
  display: flex;
  align-content: center;
  // justify-content: space-between;
  position: relative;
}
.btn {
  line-height: 40px;
  // padding-right: 20px;
  // box-sizing: border-box;
  color: #4687e8;
}

.text-color {
  color: #e7211c;
  text-align: right;
  margin: -10px 10px 0 0;
}
.countdown {
  color: #999;
}
.send-btn {
  display: flex;
  justify-content: center;
  flex: 1;
}
@media screen and (max-width: 541px) {
  .btn,
  .text {
    font-size: 0.28rem;
    line-height: 1.04rem;
    padding: 0 0.32rem;
  }
  .input-code {
    width: 100%;
  }
  .btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.32rem;
  }
  .text-color {
    margin: 0.1rem 0.32rem 0 0;
  }
}
</style>
<style>
.form-line-color .el-input__inner {
  border: 1px solid #e7211c;
}
</style>
