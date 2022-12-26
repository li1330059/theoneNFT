<template>
  <div class="ll-bag-body ll-max-width">
    <set-user-info
      v-show="page == 'user-info'"
      @listen="next"
      :res-params="resParams"
      next-page="id-card"
      @listenBack="changePage"
    >
    </set-user-info>
    <set-idcard
      v-show="page == 'id-card'"
      @listen="next"
      :res-params="resParams"
      next-page="bind-bank"
      @listenBack="changePage"
    ></set-idcard>
    <set-bind-bank
      v-show="page == 'bind-bank'"
      :res-params="resParams"
      next-page="pay-password"
      @listen="next"
      @listenBack="changePage"
    ></set-bind-bank>
    <set-pay-password
      v-show="page == 'pay-password'"
      @listen="submit"
      @listenBack="changePage"
      ref="setPayPassword"
    ></set-pay-password>
    <nameVerified
      class="name-verified-box"
      ref="nameVerified"
      @listen="listenNameVerified"
    ></nameVerified>
  </div>
</template>
<script>
import SetUserInfo from "./components/set-user-info.vue";
import SetIdcard from "./components/set-idcard.vue";
import SetBindBank from "./components/set-bind-bank.vue";
import SetPayPassword from "./components/set-pay-password.vue";
import nameVerified from "./components/ll-name-verified";

export default {
  components: {
    SetUserInfo,
    SetIdcard,
    SetBindBank,
    SetPayPassword,
    nameVerified,
  },
  data() {
    return {
      page: "",
      llWalletAccountDTO: {},
      resParams: {},
      isInitKeyboard: false,
    };
  },
  async created() {
    this.isInitKeyboard = false;
    /*   if (this.$route.query.redirect) {
      this.redirect = this.$route.query.redirect;
    } else {
      this.redirect = "";
    } */
    /*     window.location.href = `/ll_bag/res_status/open_success`;
    return; */
    if (
      this.userInfo &&
      JSON.stringify(this.userInfo) != "{}" &&
      this.userInfo.statusVerified != 1
    ) {
      this.$nextTick(() => {
        this.$refs.nameVerified.init();
      });
    } else {
      this.getAccountStatus();
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    listenNameVerified(info) {
      if (info.result) {
        this.$message.success("认证成功");
        this.getAccountStatus();
      } else {
        this.$message.error("认证失败");
      }
    },

    async getAccountStatus() {
      const res = await this.$api.service.ll_queryWalletAccountStatus();
      localStorage.setItem("test11", JSON.stringify(res));
      if (res.data.code == 200) {
        this.llWalletAccountDTO = res.data.data.llWalletAccountDTO;
        if (this.llWalletAccountDTO.status == 10) {
          /*  this.$router.replace("/ll_bag"); */
        }

        if (this.llWalletAccountDTO.status == -1) {
          this.page = "user-info";
        }
        if (res.data.data.llWalletAccountDTO.step == 0) {
          this.page = "id-card";
        }
        if (res.data.data.llWalletAccountDTO.step == 1) {
          this.page = "bind-bank";
        }
        if (this.llWalletAccountDTO.extraInfo) {
          const params = JSON.parse(this.llWalletAccountDTO.extraInfo);
          const isOvertime = window.localStorage.getItem("LLOvertime");

          if (isOvertime && isOvertime == "yes") {
            //连连支付开户超时
            this.resParams = {};
          } else {
            this.resParams = {
              bankCardNum: params.bankCardNo,
              idCardBack: params.idCardFrontUrl,
              idCardFront: params.idCardBackUrl,
              idCardFrontId: params.idCardBackUuid,
              idCardBackId: params.idCardFrontUuid,
              password: "",
              payChannel: "ll",
              phone: params.phone,
              token: params.token,
              verifyCode: params.infoCode,
            };
          }
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    next(info) {
      this.page = info.page;
      if (info.data && JSON.stringify(info.data) != "{}") {
        this.resParams = { ...this.resParams, ...info.data };
      }

      if (info.page == "pay-password") {
        if (!this.isInitKeyboard) {
          this.$refs.setPayPassword.init();
          this.isInitKeyboard = true;
        }

        this.$refs.setPayPassword.updateCss();
      }
    },
    changePage(page) {
      this.page = page;
    },
    async submit(passwordInfo) {
      delete this.resParams.idCardBack;
      delete this.resParams.idCardFront;
      const res = await this.$api.service.ll_walletAccount_confirmBindCard({
        ...this.resParams,
        password: passwordInfo.password,
        randomKey: passwordInfo.randomKey,
        payChannel: "ll",
      });
      if (res.data.code == 200) {
        if (res.data.data.success) {
          if (this.$route.query.back) {
            window.location.href = `/ll_bag/res_status/open_success?back=${this.$route.query.back}`;
          } else {
            window.location.href = `/ll_bag/res_status/open_success`;
          }

          /*   window.location.href = `/ll_bag/res_status/open_success${
            this.redirect
              ? `?redirect=${encodeURIComponent(this.redirect)}`
              : ""
          }`; */
        } else {
          window.location.href = `/ll_bag/res_status/open_fail?msg=${res.data.data.reason}`;
          /*       window.location.href = `/ll_bag/res_status/open_fail?msg=${
            res.data.data.reason
          }&redirect=${this.redirect ? encodeURIComponent(this.redirect) : ""}`; */
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.name-verified-box {
}
</style>
