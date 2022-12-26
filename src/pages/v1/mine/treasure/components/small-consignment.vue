
<template>
  <div class="more-wrap">
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="410px"
      :before-close="handleClose"
      class="ui-dialog"
      :destroy-on-close="true"
    >
      <div class="ui-dialog-content">
        <div class="txt">
          为保证您的藏品安全，我们将向您注册的手机号发送短信验证码。请输入验证码，确认是您本人操作后再进行寄售。
        </div>
        <div class="label">手机号：{{ phone }}</div>
        <div class="ui-line-input">
          <el-input placeholder="请输入验证码" v-model="vCode"></el-input>

          <g-verification-code
            :getCode="getCode"
            :isCheck="false"
          ></g-verification-code>
        </div>
        <div class="ui-btn-group ui-btn-end">
          <div class="ui-btn ui-btn-default" @click="onCancel">取消</div>
          <div class="ui-btn ui-btn-red" @click="onSubmit">确定</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* 低价寄售提醒; */
export default {
  props: {
    listen: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisible: false,
      vCode: "",
      phone: "",
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  created() {},
  methods: {
    onCancel() {
      this.dialogVisible = false;
    },
    hide() {
      this.dialogVisible = false;
    },
    async getCode() {
      return await this.$api.service.saleRecord_sendCode({});
    },
    onSubmit() {
      if (!this.vCode ) {
        this.$message.warning("请输入正确的验证码！");
        return;
      }
      this.listen(this.vCode);
    },
    init(phone) {
      this.show();
      this.vCode = "";
      this.phone = phone;
    },
    show() {
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.label {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  padding: 8px 0;
}
.ui-btn-group {
  padding: 24px 0 0;
  .ui-btn {
    margin-left: 24px;
  }
}
</style>
