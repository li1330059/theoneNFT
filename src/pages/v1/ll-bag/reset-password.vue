<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <div class="body-content">
      <div class="input-line">
        <div class="label">姓名：</div>
        <div class="input-box">
          {{ userInfo.realname }}
        </div>
      </div>
      <div class="input-line hand" @click="showBankList">
        <div class="label">银行卡：</div>
        <div class="v-code-wrap">
          {{ selectedBank.bankName }}({{
            selectedBank.acctNo && selectedBank.acctNo.replace(/\*/gi, "")
          }})
        </div>
        <span class="ll-icon icon-p-right"></span>
      </div>
      <div class="input-line">
        <div class="label">手机号：</div>
        <div class="input-box">
          <div>{{ selectedBank.phone }}</div>
        </div>
      </div>
      <div class="input-line">
        <div class="label">验证码：</div>
        <div class="input-box code-wrap">
          <el-input palceholder="请输入验证码" v-model="code" />
          <g-verification-code
            :getCode="getCode"
            :isCheck="false"
            :isReason="true"
          ></g-verification-code>
        </div>
      </div>
    </div>

    <selecte-bank
      :bank-list="bankList"
      :bank-idx="bankIdx"
      ref="selectBankRef"
      @listen="listenSelectBank"
      class="fixed-bottom"
    ></selecte-bank>
    <div class="fixed-bottom">
      <div
        class="ll-btn ll-btn-full"
        :class="[isPass ? 'll-btn-primary' : 'll-btn-default']"
        @click="submit"
      >
        下一步
      </div>
      <ll-footer />
    </div>
  </div>
</template>
<script>
import llFooter from "./components/ll-footer.vue";
import SelecteBank from "./components/selecte-bank.vue";
import MHead from "./components/m-head.vue";
export default {
  components: { llFooter, SelecteBank, MHead },
  data() {
    return {
      bankList: [],
      code: "",
      bankIdx: 0,
      token: "",
      listParams: {
        pageCount: 1,
        pageSize: 20,
        statusList: [],
      },
    };
  },

  computed: {
    isPass() {
      return this.code;
    },
    userInfo() {
      return this.$store.state.user_info;
    },
    selectedBank() {
      return this.bankList[this.bankIdx] || {};
    },
  },
  created() {
    this.getBankList();
  },
  methods: {
    submit() {
      if (!this.isPass) {
        this.$message.warning("请输入验证码");
        return;
      }
      if (!this.token) {
        this.$message.warning("参数错误(请发送验证码)");
        return;
      }
      this.$router.push(
        `/ll_bag/reset_password_verify/${this.code}/${this.token}`
      );
    },
    showBankList() {
      this.$refs.selectBankRef.show();
    },
    listenSelectBank(info, idx) {
      this.bankIdx = idx;
    },
    async getCode() {
      const res = await this.$api.service.ll_resetPwd_apply({
        uuid: this.selectedBank.uuid,
      });
      if (res.data.code == 200) {
        if (res.data.data.success) {
          this.token = res.data.data.token;
        } else {
        }
      } else {
      }
      return res;
    },
    async getBankList() {
      //获取用户绑定的银行卡
      const res = await this.$api.service.ll_bindCard_list(this.listParams);
      if (res.data.code == 200) {
        this.bankList = res.data.data.records;
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.icon-p-right {
  width: 14px;
  height: 14px;
}
.ll-bag-body {
  padding: 32px 20px 49px;
  .body-content {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .text {
    font-size: 16px;
    color: #999999;
  }
}
.code-wrap {
  display: flex;
  align-items: center;
  ::v-deep .el-input__inner {
    padding: 0;
  }
}
.v-code-wrap {
  flex: 1;

  .link-btn {
    text-align: right;
  }
}
</style>
