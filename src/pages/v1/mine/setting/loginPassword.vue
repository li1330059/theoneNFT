<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    width="500px"
    :title="`修改登录密码`"
    :fullscreen="isPc ? false : true"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <h1 class="message"></h1>
        <!--         <div class="phone-num title">手机号：{{ phone }}</div> -->
        <div class="form-line">
          <h1 class="title">请输入旧密码</h1>
          <div class="input-line">
            <el-input
              v-model="old_password"
              placeholder="请输入旧密码"
              type="password"
            ></el-input>
          </div>
        </div>

        <div class="form-line">
          <h1 class="title">请输入新密码</h1>
          <div class="input-line">
            <el-input
              v-model="password"
              placeholder="请输入8-18位新密码"
              type="password"
            ></el-input>
          </div>
        </div>
        <div class="form-line">
          <h1 class="title">请确认新密码</h1>
          <div class="input-line">
            <el-input
              v-model="confirm_password"
              placeholder="请确认新密码"
              type="password"
            ></el-input>
          </div>
        </div>
        <!--         <div class="form-line">
          <h1 class="title">验证码</h1>
          <div class="input-line phone-code-wrap">
            <el-input
             maxlength="6"
              v-model="phone_code"
              placeholder="请输入验证码"
            ></el-input>
            <getphonecode :phone="phone" :type="4" class="code-wrap" />
          </div>
        </div> -->
        <div class="form-btns">
          <div class="v1-btn mycenter" @click="dialogVisible = false">取消</div>
          <div class="v1-btn mycenter red" @click="submit()">确定</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import getphonecode from "@/components/v1/getphonecode";
import { checkUserPassword } from "@/utils/common";
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
      password: "",
      old_password: "",
      phone_code: "",
      confirm_password: "",
      phone: "",
      isPc: true,
    };
  },

  methods: {
    async init(wallet) {
      this.dialogVisible = true;
      this.restInput();
      this.isPc = !this.$common.isMobile();
      const user_member = localStorage.getItem("THEONE_MEMBER");
      if (user_member) {
        this.phone = JSON.parse(user_member).phone;
      }
    },
    restInput() {
      this.password = "";
      this.phone_code = "";
      this.confirm_password = "";
      this.phone = "";
      this.old_password = "";
    },
    async loginOut() {
      const res = await this.$api.service.auth_logout();
      if (res.data.code == 200) {
        this.$message({
          message: "已安全退出",
          type: "info",
        });
        localStorage.removeItem("THEONE_MEMBER");
        localStorage.removeItem("authorization");
           localStorage.removeItem('THEONE_USER');
           localStorage.removeItem('VERIFY-LIST-V2');

        setTimeout(() => {
          window.location.href = "/";
        }, 600);
      } else {
        this.$message({
          message: "退出失败",
          type: "error",
        });
      }
    },

    async submit() {
      const self = this;
      if (!this.old_password) {
        this.$message({
          message: "请填写旧密码",
          type: "warning",
        });
        return;
      }
      if (checkUserPassword(this.password)) {
        if (this.password == this.confirm_password) {
          const res = await this.$api.service.operation_changePwByOldPw({
            newPassword: self.password,
            oldPassword: self.old_password,
          });
          if (res && res.data.code == 200 && res.data.data) {
            //退出登录

            this.$message({
              message: "修改成功,正在安全退出登录",
              type: "success",
            });
            this.loginOut();
            this.$emit("upLoginPasswordStatus", { result: true });
            this.dialogVisible = false;
          } else {
            this.$message({
              message: res ? res.data.message : "error",
              type: "error",
            });
          }
        } else {
          this.$message({
            message: "两次密码不一致",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "密码英文数字下划线，至少8位",
          type: "warning",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/mineSettings.scss";
.phone-code-wrap {
  display: flex;
  align-items: center;
  .code-wrap {
    width: 110px;
  }
}
.phone-num {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 16px;
}
.page-mine-setting-nameVerified .message {
  color: rgba($color: #000000, $alpha: 0.7);
}
</style>
