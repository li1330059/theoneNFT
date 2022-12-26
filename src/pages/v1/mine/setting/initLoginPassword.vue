<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    width="500px"
    :title="`设置登录密码`"
    :fullscreen="isPc ? false : true"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <div class="form-line">
          <h1 class="title">密码</h1>
          <div class="input-line">
            <el-input
              v-model="password"
              placeholder="请输入8-18位新密码"
              type="password"
            ></el-input>
          </div>
        </div>
        <div class="form-line">
          <h1 class="title">确认密码</h1>
          <div class="input-line">
            <el-input
              v-model="confirm_password"
              placeholder="请确认新密码"
              type="password"
            ></el-input>
          </div>
        </div>

        <div class="form-btns">
          <div class="v1-btn mycenter" @click="dialogVisible = false">取消</div>
          <div class="v1-btn mycenter red" @click="submit()">确定</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
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
      confirm_password: "",
      isPc: true,
    };
  },

  methods: {
    async init(wallet) {
      this.dialogVisible = true;
      this.restInput();
        this.isPc=!this.$common.isMobile()
    },
    restInput() {
      this.password = "";
      this.confirm_password = "";
    },

    async submit() {
      const self = this;
      if (checkUserPassword(this.password)) {
        if (this.password == this.confirm_password) {
          const res = await this.$api.service.operation_initialPw({
            password: self.password,
          });
          if (res && res.data.code == 200 && res.data.data) {
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
