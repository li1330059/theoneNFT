<template>
  <div class="anti-brush">
    <el-dialog
      title="验证"
      :visible.sync="dialogVisible"
      width="410px"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <div class="ui-dialog-content">
        <div class="txt">
          您的操作过于频繁，我们将向您的注册手机号发送短信验证码，请先获取验证码进行验证。
        </div>
        <div class="txt red">每日验证次数有限，请不要频繁刷新！</div>
        <div class="txt">
          若存在恶意刷新的情况，平台将会冻结用户账户，严重将进行封号处理。
        </div>
        <div class="line-input">
          <el-input placeholder="请输入验证码" v-model="vCode"></el-input>
          <verification-code
            :is_check="0"
            :type="1"
            api="limit_getCode"
          ></verification-code>
        </div>
      </div>
      <div class="ui-btn-group ui-btn-end">
        <div class="ui-btn ui-btn-default" @click="handleClose">取消</div>
        <div class="ui-btn ui-btn-red" @click="onsubmit">确定</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import verificationCode from "../verification-code.vue";
export default {
  components: { verificationCode },
  data() {
    return {
      vCode: "",
    };
  },
  props: {
    init: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    dialogVisible() {
      return this.$store.state.isShowLoggedIn;
    },
  },
  methods: {
    handleClose() {
      this.vCode = "";
      this.$store.commit("setAntiBrush", {
        code: 1007,
        isShow: false,
      });
    },
    async onsubmit() {
      if (!this.vCode) {
        this.$message.warning("请输入正确的验证码！");
        return;
      }
      const res = await this.$api.service.limit_valid({
        type: 1,
        code: this.vCode,
      });
      if (res.data.code == 200 && res.data.data) {
        this.init();
        this.vCode = "";
        this.$store.commit("setmarketBtnDisabledInfo", {
          code: -1,
          time: "",
        });
        this.$store.commit("setAntiBrush", {
          code: 1007,
          isShow: false,
        });
      } else {
        this.$message.warning(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.line-input {
  display: flex;
  align-items: center;
}
.ui-dialog-content {
  .txt {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    margin-bottom: 8px;
  }
  .red {
    color: #e61f1a;
  }
}
.line-input {
  margin: 8px 0;
}
.ui-btn-group {
  padding-top: 24px;
  .ui-btn {
    margin-left: 30px;
  }
}
.anti-brush {
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
