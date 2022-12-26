<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    lock-scroll
    center
    width="400px"
    :fullscreen="isPc ? false : true"
    title="修改安全锁密码"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <div v-if="!(user_info.realname && user_info.idNumber)">
          <div class="form-line">
            <h1 class="title">真实姓名</h1>
            <div class="input-line">
              <el-input
                v-model="realName"
                placeholder="请输入真实姓名"
                type="text"
              ></el-input>
            </div>
          </div>
          <div class="form-line">
            <h1 class="title">身份证号</h1>
            <div class="input-line">
              <el-input
                v-model="idcard"
                placeholder="请输入身份证号"
                type="text"
              ></el-input>
            </div>
          </div>
        </div>
        <bank-select class="bank-select" ref="bankSelect"></bank-select>

        <div class="form-line">
          <h1 class="title">银行卡号</h1>
          <div class="input-line">
            <el-input
              v-model="bankAccount"
              placeholder="请输入银行卡号"
              type="text"
            ></el-input>
          </div>
        </div>
        <div class="form-line">
          <h1 class="title">银行卡预留手机号</h1>
          <div class="input-line">
            <el-input
              v-model="phone"
              placeholder="请输入银行卡预留手机号"
              type="text"
            ></el-input>
          </div>
        </div>
        <!--        <div class="form-line">
          <h1 class="title">验证码</h1>
          <div class="input-line phone-code-wrap">
            <el-input v-model="phoneCode" placeholder="请输入验证码"></el-input>
            <getphonecode
              :phone="phone"
              :type="4"
              api="login_getAuthCode"
              class="code-wrap"
            />
          </div>
        </div> -->
        <div v-if="isPc">
          <div class="form-line">
            <h1 class="title">请输入6位数字安全锁密码</h1>
            <count-letters ref="payNum" />
            <div class="input-line password-number"></div>
          </div>
          <div class="form-line" style="margin-bottom: 20px">
            <h1 class="title">再次输入</h1>
            <count-letters ref="repeatPayNum" />
          </div>
        </div>
        <div v-else>
          <h1 class="title">确认密码</h1>
          <el-input
            v-model="payPassword"
            placeholder="请输入6位安全锁密码"
          ></el-input>
          <el-input
            v-model="agianPassword"
            placeholder="请再次输入6位安全锁密码"
          ></el-input>
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
import getphonecode from "@/components/v1/getphonecode";
import BankSelect from "./bank-select.vue";
import Encryption from "@/utils/encryption";
export default {
  components: { BankSelect },
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
      payPassword: null,
      agianPassword: null,
      phone: "",
      realName: "", //真实姓名
      phoneCode: "",
      idcard: "", //身份证号
      bankAccount: "", //银行卡号
      isPc: true,
      isClick:true,
    };
  },
  computed: {
    user_info() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    async init() {
      this.dialogVisible = true;
      this.restInput();

      this.isPc = !this.$common.isMobile();
    },
    restInput() {
      this.payPassword = null;
      this.agianPassword = null;
      this.phone = "";
      this.realName = ""; //真实姓名
      this.phoneCode = "";
      this.idcard = ""; //身份证号
      this.bankAccount = ""; //银行卡号
      this.$nextTick(() => {
        this.$refs.bankSelect.init();
        this.$refs.repeatPayNum.init();
         this.$refs.payNum.init();
      });
    },
    async onSendCode() {
      let result = await this.$api.service.operation_authCode({ type: 4 });
      if (result.data.code == 200) {
        this.$message.success("操作成功");
      } else {
        this.$message.warning(result.data.message);
      }
    },
    async submit() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isClick = true;
      }, 10*1000);
      if (!this.isClick) {
        this.$message.warning('您点击过快了');
        return;
      }
      this.isClick=false;
      const { bankUuid } = this.$refs.bankSelect.getBankInfo();
      if (!bankUuid) {
        this.$message.warning("请选择银行信息");
        return;
      }
      let password, agianPassword;
      if (this.isPc) {
        password = this.$refs.payNum.getLetters().join("");
        agianPassword = this.$refs.repeatPayNum.getLetters().join("");
      } else {
        password = this.payPassword;
        agianPassword = this.agianPassword;
      }
      if (password.length !== 6) {
        this.$message.warning("安全锁密码为6位");
        return;
      }

      if (password == agianPassword) {
        let params = {};
        if (this.$store.state.user_info.statusVerified == 1) {
          if (!this.phone || !this.bankAccount) {
            this.$message.warning("请填写完整");
            return;
          }
          params = {
            bankAccount: this.bankAccount,
            newPassword: password,
            phone: this.phone,
            phoneCode: 111111,
          };
        } else {
          if (
            !this.phone ||
            !this.realName ||
            !this.idcard ||
            !this.bankAccount
          ) {
            this.$message.warning("请填写完整");
            return;
          }
          params = {
            bankAccount: this.bankAccount,
            idcard: this.idcard,
            newPassword: password,
            phone: this.phone,
            realName: this.realName,
            phoneCode: 111111,
          };
        }
        const resPassword = await Encryption.getPassword(params.newPassword);
        if (!resPassword) {
          this.$message.warning("密码加密错误");
          return;
        }
        params.newPassword=resPassword;
        let result = await this.$api.service.userAttribute_changePayPw({
          ...params,
          bankUuid,
        });
        if (result && result.data.code == 200 && result.data.data) {
          this.dialogVisible = false;
          localStorage.removeItem("PAY-PASSWORD");
          this.$parent.upPayPwd({ result: true });
        } else {
          this.$message.warning(result.data.message);
        }
      } else {
        this.$message.warning("确认密码与密码不一致");
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
@media screen and (max-width: 540px) {
  .bank-select {
    ::v-deep .title {
      font-size: 0.28rem;
      font-weight: 400;
      color: #000000;
      line-height: 1.04rem;
      padding: 0 0.32rem;
      margin: 0;
    }
  }
}
</style>
