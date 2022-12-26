<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    width="500px"
    :title="`实名认证`"
    :fullscreen="isPc ? false : true"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <!--  <h1 class="message title" style="line-height:1.4">
          数字藏品为虚拟数字商品，仅限经实名认证为年满18周岁的大陆用户购买
        </h1> -->
        <div class="form-line">
          <h1 class="title">姓名</h1>
          <div class="input-line">
            <el-input
              v-model="verified.realname"
              placeholder="请填写您的真实姓名"
            ></el-input>
          </div>
        </div>
        <div class="form-line">
          <h1 class="title">身份证号</h1>
          <div class="input-line">
            <el-input
              v-model="verified.idNumber"
              placeholder="请填写您的身份证号"
            ></el-input>
          </div>
        </div>
        <div class="form-line" v-if="userPhone">
          <h1 class="title">手机号</h1>
          <div class="input-line">
            <el-input v-model="userPhone" disabled placeholder=""></el-input>
          </div>
        </div>
        <!-- <div class="form-line">
          <h1>验证码</h1>
          <div class="input-line phone-code-wrap">
            <el-input
             maxlength="6"
              v-model="verified.phoneCode"
              placeholder="请输入验证码"
            ></el-input>
            <getphonecode :type="3" :is_check="0" class="code-wrap" />
          </div>
        </div> -->

        <div class="tip">
          应国家法律法规要求，购买前请完成实名认证。实名认证完成后，您的提现账户将与此实名信息进行绑定，请知晓！
        </div>
        <div class="tip" style="color: #e61f1a">
          实名认证一经审核通过，非平台认可的法定事由不得修改
        </div>
        <div class="form-btns">
          <div class="v1-btn mycenter pc-show" @click="dialogVisible = false">
            取消
          </div>
          <div class="v1-btn v1-red" @click="submit()">保存</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
// import getphonecode from "@/components/v1/getphonecode";
export default {
  // components: { getphonecode },
  props: {},
  data() {
    return {
      dialogVisible: false,
      isPc: true,
      userPhone: "",
      verified: {
        idNumber: "",
        phoneCode: "",
        realname: "",
      },
    };
  },
  mounted() {
    this.isPc = !this.$common.isMobile();
  },
  methods: {
    async init(wallet) {
      this.dialogVisible = true;
      this.restInput();
      this.isPc = !this.$common.isMobile();
      this.getUserPhone();
    },
    restInput() {
      this.verified = {
        idNumber: "",
        phoneCode: "",
        realname: "",
      };
    },
    async getUserPhone() {
      const res = await this.$api.service.userAttribute_getPhone();
      console.log(res);
      if (res.data.code == 200) {
        this.userPhone = res.data.data;
      }
    },
    async onSendCode() {
      let result = await this.$api.service.operation_authCode({ type: 3 });
      if (result.data.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.warning(result.data.message);
      }
    },
    async submit() {
      if (!this.verified.realname) {
        this.$message.warning("请输入姓名");
        return;
      } else if (!this.verified.idNumber) {
        this.$message.warning("请输入身份证号");
        return;
      }
      let result = await this.$api.service.userattribute_verifiedIdcard(
        this.verified
      );
      if (result.data.code == 200) {
        if (result.data.data) {
          await this.$store.dispatch("getUserInfo");
          this.$emit("listen", { result: true });
          this.dialogVisible = false;
        } else {
          this.$message.warning("认证失败");
        }
      } else {
        this.$message.warning(result.data.message);
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

.page-mine-setting-nameVerified .message {
  color: rgba($color: #000000, $alpha: 0.7);
}
.tip {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  padding-bottom: 16px;
}
.v1-red {
  background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
  color: #fff;
  min-width: 96px;
  line-height: 30px;
  height: 30px;
  font-size: 14px;
}
@media screen and (max-width: 540px) {
  .tip {
    font-size: 0.24rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    padding: 0.32rem;
  }
  .pc-show {
    display: none;
  }
  .v1-btn {
    width: 93%;
    margin: 20vh 0 !important;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 0.3rem;
  }
}
</style>
