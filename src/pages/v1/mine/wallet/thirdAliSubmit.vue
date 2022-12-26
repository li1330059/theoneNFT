<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-wallet-third-submit"
    :visible.sync="dialogVisible"
    append-to-body
    width="570px"
    :title="`设置支付宝`"
  >
    <div class="dialog-content" v-if="userAttr">
      <div class="dialog-form">
        <div class="form-line" v-if="userAttr.statusVerified != 1">
          <h1>真实姓名</h1>
          <div class="input-line">
            <el-input
              v-model="verifiedIdcardParam.realname"
              placeholder="请输入真实姓名"
            ></el-input>
          </div>
        </div>
        <div class="form-line" v-if="userAttr.statusVerified != 1">
          <h1>身份证号</h1>
          <div class="input-line">
            <el-input
              v-model="verifiedIdcardParam.idNumber"
              placeholder="请输入身份证号"
            ></el-input>
          </div>
        </div>
        <div class="form-line">
          <h1>支付宝账号</h1>
          <div class="input-line">
            <el-input
              v-model="changeAliAccountParam.alipayAccount"
              :placeholder="`请输入支付宝`"
            ></el-input>
          </div>
          <div class="form-btns">
            <div class="v1-btn mycenter" @click="dialogVisible = false">取消</div>
            <div class="v1-btn mycenter red" @click="submit()">确定</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
const BigNumber = require("bignumber.js");
export default {
  data() {
    return {
      dialogVisible: false,
      userAttr: null,
      changeAliAccountParam: {
        alipayAccount: "",
      },
      verifiedIdcardParam: {
        idNumber: "",
        phoneCode: "111111",
        realname: "",
      },
    };
  },
  methods: {
    async init(value) {
      this.dialogVisible = true;
      this.userAttr = value;
      this.restInput();
      this.changeAliAccountParam.alipayAccount = this.userAttr.alipayAccount;
    },
    restInput() {
      this.verifiedIdcardParam = {
        idNumber: "",
        phoneCode: "111111",
        realname: "",
      };
    },
    async submit() {
      if (!this.changeAliAccountParam.alipayAccount) {
        this.$message.error("请输入支付宝");
        return;
      }
      if (this.userAttr.statusVerified != 1) {
        if (!this.verifiedIdcardParam.realname) {
          this.$message.error("请输入真实姓名");
          return;
        } else if (!this.verifiedIdcardParam.idNumber) {
          this.$message.error("请输入身份证号");
          return;
        }
        let verifiedResult = await this.$api.service.userattribute_verifiedIdcard(
          this.verifiedIdcardParam
        );
        if (verifiedResult.data.code == 200) {
          if (!verifiedResult.data.data) {
            this.$message.error("实名认证失败！");
            return;
          }
        } else {
          this.$message.error(verifiedResult.data.message);
          return;
        }
      }

      let result = await this.$api.service.userAttribute_changeAliAccount(
        this.changeAliAccountParam
      );
      if (result.data.code == 200) {
        this.$message.success("操作成功");
        this.dialogVisible = false;
        this.$store.commit("setUserInfo", {
          alipayAccount: this.changeAliAccountParam.alipayAccount,
        });
        this.$emit("listen", { result: true });
      } else {
        this.$message.error(result.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-mine-wallet-third-submit {
  .message {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #123ce1;
    padding-top: 10px;
    margin-bottom: 20px;
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 540px) {
}
</style>
