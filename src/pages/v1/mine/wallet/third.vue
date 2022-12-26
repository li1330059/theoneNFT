<template>
  <div>
    <div class="mode-mobile">
      <m-header :title="'第三方支付'" />
    </div>

    <div class="page-mine-wallet-third">
      <div class="list" v-for="(item, index) in setting" :key="index">
        <div :class="`title  ${item.icon}`">{{ item.name }}</div>
        <div class="content">
          {{
            (item.value && $common.formatAliAcount(item.value)) || "暂无设置"
          }}
        </div>
        <div class="v1-btn-link blue" @click="bindWallet({ type: 2 })">
         <span v-if="item.value"> 修改</span>
         <span v-else>绑定</span>
        </div>
      </div>
      <thirdAliSubmit
        ref="thirdAliSubmit"
        @listen="listenthirdAliSubmit"
      ></thirdAliSubmit>
    </div>
  </div>
</template>
<script>
import thirdAliSubmit from "./thirdAliSubmit";
import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { thirdAliSubmit, mHeader },
  data() {
    return {
      setting: [],
    };
  },
  created() {
    this.getUserAttr();
  },
  computed: {
    userAttrResult() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    // 绑定钱包
    bindWallet(value) {
      if (value.type == 2) {
        this.$refs.thirdAliSubmit.init(this.userAttrResult);
      }
    },
    async listenthirdAliSubmit() {
      await this.$store.dispatch("getUserInfo");
      this.getUserAttr();
    },
    async getUserAttr() {
      /*   let result = await this.$api.service.userattribute_queryByUserUuid();
      this.userAttrResult = result.data.data; */
      this.setting = [];
      this.setting.push({
        key: "alipay",
        icon: "alipay",
        name: "支付宝账号",
        value: this.$store.state.user_info.alipayAccount,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.page-mine-wallet-third {
  max-width: 790px;
  .list {
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
    display: flex;
    align-items: center;
    height: 60px;
    &:first-child {
      border-top: 1px solid rgba($color: #000000, $alpha: 0.1);
    }
    .title {
      width: 150px;
      font-size: 14px;
      color: rgba($color: #000000, $alpha: 0.4);
      padding-left: 20px;
      background: url("//static.theone.art/pc/images/wallet-alipay.png") no-repeat left
        center;
      background-size: 18px 18px;
      &.wechat {
        background-image: url("//static.theone.art/pc/images/wallet-wechat.png");
      }
    }
    .content {
      flex: 1;
      color: #000000;
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mine-wallet-third {
    padding-top: 1.24rem;
    .list {
      padding: 0 0.32rem;
      background: #fff;
    }

    .v1-card-title-mycenter {
      padding: 0.32rem;
      font-size: 0.28rem;
      font-weight: 500;
      color: #000000;
      border-bottom: none;
    }
  }
}
</style>
