<template>
  <div class="bh-improve-body" v-if="isShow">
    <up-user-card
      v-if="page == 'up-card'"
      @listenUpCardSuccess="listenUpCardSuccess"
      @cancel="cancel"
      title="为保证您的资金安全请先按照宝付账户要求进行身份证资料补充。"
    ></up-user-card>
    <!--     绑定银行卡 -->
    <bh-bind-bank
      v-if="page == 'bind-bank'"
      @cancel="cancel"
      @success="success"
    ></bh-bind-bank>
  </div>
</template>
<script>
import upUserCard from "../up-user-card.vue";
import BhBindBank from "./bh-bind-bank.vue";
export default {
  name: "宝户完善资料流程",
  components: { upUserCard, BhBindBank },
  data() {
    return {
      isShow: false,
      page: "",
    };
  },
  props: {},

  created() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    init() {},
    changePage() {
      //
    },
    show() {
      this.isShow = true;
    },
    cancel() {
      this.isShow = false;

      this.$emit("cancel");
    },
    success() {
      this.isShow = false;
      this.$emit("success");
    },
    async listenUpCardSuccess(info) {
      //宝户身份证认证
      if (this.checkCardDisabled) {
        return;
      }
      this.checkCardDisabled = true;
      info.idCardBack = info.idCardBack.id;
      info.idCardFront = info.idCardFront.id;
      const res = await this.$api.service.baofooInfo_idcardImage(info);
      this.checkCardDisabled = false;
      if (res.data.code == 200 && res.data.data) {
        this.success();
      } else {
        this.$message.error(res.data.message);
      }
    },
    SETstatusRealName() {
      //上传宝户身份证
      this.show();
      this.page = "up-card";
    },
    SETstatusBankCard() {
      //绑定银行卡
      console.log('bang');
      this.show();
      this.page = "bind-bank";
    },
    async SETstatusPassword() {
      //宝户设置支付密码
      if (this.statusPasswordDisabled) {
        return;
      }
      this.statusPasswordDisabled = true;
      const res = await this.$api.service.payChannel_transactionPassword({
        payChannel: "baofoo",
      });
      this.statusPasswordDisabled = false;
      if (res.data.code == 200&&res.data.data.transactionPasswordFlag) {
        setTimeout(() => {
          this.isShowSetPassword = false;
          this.$confirm("已经设置好宝户密码？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }).then(async () => {
            const setRes = await this.$api.service.payChannel_confirmPassword({
              payChannel: "baofoo",
            });
            if (setRes.data.code == 200) {
              if (setRes.data.data.transactionPasswordFlag) {
                this.success();
              }else{
                 this.$message.warning('设置失败');
              }
            } else {
              this.$message.error(setRes.data.message);
            }
          });
        }, 500);
        if (this.$common.isMobile()) {
          window.location.href = res.data.data.pwUrl;
        } else {
          window.open(res.data.data.pwUrl);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
