<template>
  <div class="page-mine-wallet-blockchain">
    <div class="mode-mobile"><m-header :title="'区块链钱包'" /></div>
    <div class="loading" v-if="loading">
      <loading></loading>
    </div>
    <div v-else-if="showEmpty" class="empty-wrap">
      <div class="img"></div>
      <div class="des">尚未登录钱包</div>
      <div class="btn" @click="onShowWallet">登录钱包</div>
    </div>
    <div v-else>
      <div
        class="chain"
        v-for="(item, index) in getBlockchainListResult"
        :key="index"
      >
        <span class="chain-lf">钱包地址</span>
        <span class="chain-address">{{ mdMoney(item.address) }}</span>
        <div
          class="v1-icon-copy"
          v-clipboard:copy="item.address"
          v-clipboard:success="onCopy"
          v-clipboard:error="onCopyError"
        ></div>
      </div>
    </div>

  </div>
</template>
<script>
/* import empty from "@/components/v1/empty"; */

import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";

export default {
  components: { loading, mHeader },
  data() {
    return {
      loading: true,
      showEmpty: false,
      getBlockchainListResult: null,
      loginChain: null,
    };
  },
  created() {
    this.getBlockchainList();
  },
  computed: {
    mdMoney() {
      return function (address) {
        address =
          address.substr(0, 4) + "****" + address.substr(address.length - 4);
        return address;
      };
    },
  },
  methods: {
    onShowWallet() {
      this.$refs.loginChain.init();
      /*      this.$nextTick(() => {
        this.$refs.loginChain.init();
      }); */
    },
    async getBlockchainList() {
  
    },
    async listenLoginChain() {
    
    },
    onCopy(e) {
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    onCopyError() {
      this.$message({
        message: "浏览器不支持",
        type: "error",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.page-mine-wallet-blockchain {
  .loading {
    height: 500px;
  }
  .chain-info {
    flex: 1;
  }
  .chain {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 19px 0;
    box-sizing: border-box;
    display: flex;
    &:first-child {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    &-lf {
      color: rgba(0, 0, 0, 0.4);
      font-size: 14px;
      margin-right: 10%;
    }
    &-address {
      flex: 1;
    }
  }
}
.empty-wrap {
  .img {
    width: 200px;
    height: 140px;
    background-image: url("//static.theone.art/pc/icons/pic-ch-1.png");
    background-size: contain;
    background-repeat: no-repeat;
    margin: 10vh auto 0;
  }
  .des {
    color: rgba(0, 0, 0, 0.4);
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    margin-top: 32px;
  }
  .btn {
    width: 96px;
    line-height: 30px;
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 15px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    margin: 8px auto 0;
    cursor: pointer;
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mine-wallet-blockchain {
    padding-top: 1.24rem;
    .chain {
      padding: 0.32rem 0.32rem;
      background: #fff;
    }
  }
}
</style>
