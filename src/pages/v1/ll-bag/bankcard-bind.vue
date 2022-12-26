<template>
  <div class="ll-bag-body ll-max-width">
    <m-head></m-head>
    <div class="body-content">
      <div class="text">请添加持卡人本人的银行卡</div>
      <div class="input-line">
        <div class="label">持卡人姓名：</div>
        <div class="input-box">
          <el-input v-model="name" type="txt" placeholder="请输入姓名" />
        </div>
      </div>
      <div class="input-line">
        <div class="label">银行卡号：</div>
        <div class="v-code-wrap">
          <el-input
            type="txt"
            placeholder="请输入银行卡号"
            v-model="bankCardNum"
          />
          <div class="ui-btn link-btn" @click="goTable">支持银行</div>
        </div>
      </div>
      <div class="input-line">
        <div class="label">预留手机号：</div>
        <div class="input-box">
          <el-input v-model="phone" type="txt" placeholder="请输入预留手机号" />
        </div>
      </div>
    </div>
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
import MHead from "./components/m-head.vue";
export default {
  components: { MHead, llFooter },
  data() {
    return { bankCardNum: "", phone: "", name: "" };
  },
  computed: {
    isPass() {
      if (
        this.bankCardNum &&
        this.$common.checkPhoneNumber(this.phone) &&
        this.name
      ) {
        return true;
      }
      return false;
    },
  },
  created() {},
  mounted() {
 
    this.rest();
  },

  methods: {
    rest() {
      this.bankCardNum = "";
      this.phone = "";
      this.name = "";
    },
    submit() {
      if (this.isPass) {
        this.$router.push(
          `/ll_bag/bankcard_bind_confirm?phone=${this.phone}&bankcard=${this.bankCardNum}`
        );
      }
    },
    goTable() {
      this.$router.push({
        path: `/ll_bag/bankcards_info`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.ll-bag-body {
  padding: 32px 20px 49px;
  .body-content {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
  }
  .text {
    font-size: 16px;
    color: #999999;
  }
}
.v-code-wrap {
  flex: 1;
  .link-btn {
    text-align: right;
  }
}

</style>
