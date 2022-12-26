<template>
  <el-dialog
    class="theone-dialog"
    :visible.sync="isShow"
    append-to-body
    width="570px"
    title="提现申请"
  >
    <div class="form-wrap">
      <div class="input-group">
        <div class="label">请选择需要提现的账户</div>
        <el-select v-model="accountIdx" placeholder="请选择提现账户">
          <el-option
            v-for="(item, idx) in accountList"
            :key="item.value"
            :label="item.label"
            :value="idx"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <div class="label">请输入您的提现金额</div>
        <el-input type="text" placeholder="请输入您的提现金额"></el-input>
      </div>
      <div class="account-tip">当前恒信通余额：</div>
      <div class="input-group">
        <div class="label">请选择需要提现的账户</div>
        <el-select
          v-model="bankIdx"
          placeholder="请选择收款银行卡"
          size="medium"
        >
          <el-option
            v-for="(item, idx) in bankList"
            :key="item.value"
            :label="item.label"
            :value="idx"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <div class="label">安全锁密码</div>
        <count-letters ref="payNum"></count-letters>
      </div>

      <div class="pay-message">
        提现须知：提现金额低于100元每15天可提现2次，高于100元每日仅可提现1次，申请成功后会在次日24时前到账，请及时关注到账信息。
      </div>
      <div class="btn-group">
        <div class="ui-btn ui-btn-default" @click="isShow = false">取消</div>
        <div class="ui-btn ui-btn-red" @click="onSubmit">确定</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Encryption from "@/utils/encryption";
export default {
  components: {},
  data() {
    return {
      accountIdx: "",
      accountList: [
        {
          value: "选项1",
          label: "黄金糕",
        },
      ],
      bankIdx: "",
      bankList: [
        {
          value: "选项1",
          label: "黄金糕",
        },
      ],
      isShow: false,
    };
  },
  created() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    async onSubmit() {
      const account = this.accountList[this.accountIdx];
      const bank = this.bankList[this.bankIdx];
      let password = this.$refs.payNum.getLetters().join("");
      console.log(password);
      const resPassword = await Encryption.getPassword(password);
      if (!resPassword) {
        this.$message.warning("密码加密错误");
        return;
      }

      if (!account) {
        this.$message.warning("请选择账户");
        return;
      }
      if (!bank) {
        this.$message.warning("请选择银行卡");
        return;
      }
      if (password.length !== 6) {
        this.$message.warning("请输入6位安全锁密码");
        return;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.input-group {
  margin-bottom: 16px;
  .label {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    margin-bottom: 8px;
  }
  ::v-deep .el-select {
    width: 100%;
    input {
      line-height: 40px;
      height: 40px;
    }
  }
  ::v-deep .letters-wrap{
      justify-content: flex-start;
  }
}
.account-tip {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
}
.pay-message {
  font-size: 14px;
  font-weight: 400;
  color: #e61f1a;
  line-height: 20px;
}
.btn-group {
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
  .ui-btn {
    margin-left: 12px;
  }
}
</style>
