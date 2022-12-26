<template>
  <div>
    <bankSubmit
      ref="bankSubmitRef"
      :userInfo="userInfo"
      @listen="listenBankSubmit"
    ></bankSubmit>
    <nameVerified
      ref="nameVerifiedRef"
      @listen="listenNameVerified"
    ></nameVerified>
  </div>
</template>
<script>
import bankSubmit from "@/pages/v1/mine/wallet/bankSubmit";
import nameVerified from "@/pages/v1/mine/setting/nameVerified";
export default {
  components: { bankSubmit, nameVerified },
  data() {
    return {
      isShowLogin: true,
      disabled: false,
    };
  },
  props: {
    goodsObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  created() {},
  mounted() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    listenBankSubmit(result) {
      if (result.result) {
        this.$store.commit("setUserInfo", {
          ...this.userInfo,
          statusBankVerified: 1,
        });
      }
    },
    listenNameVerified(info) {
      if (info.result) {
        this.$message.success("认证成功");
      } else {
        this.$message.error("认证失败");
      }
    },
    async vote(uuid) {
      if (this.disabled) {
        return;
      }

      if (!(this.userInfo && this.userInfo.userUuid)) {
        //去登录
        this.loginTip();
        return;
      }
      this.disabled = true;

      const res = await this.$api.service.voterActivity_creation_vote({
        uuid,
      });
      this.disabled = false;
      if (res.data.code == 200) {
        this.$emit("listenSuccess", res, uuid);
      } else if (res.data.code == 10005) {
        //实名认证
        this.$refs.nameVerifiedRef.init();
      } else if (res.data.code == 10006) {
        //  去绑定银行卡
        this.$refs.bankSubmitRef.init();
      } else if (res.data.code === 10004) {
        //去登录
        this.loginTip();
      } else {
        this.$message.error(res.data.message);
      }
    },
    loginTip() {
      this.$confirm(`您还未登录，请先登录`, "提示", {
        confirmButtonText: "去登录",
        showCancelButton: false,
        customClass: "mobile-btn-center",
      })
        .then(async () => {
          const redirect = `${window.location.href}`;

          this.$router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped></style>
