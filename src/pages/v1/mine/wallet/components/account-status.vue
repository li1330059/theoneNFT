<template>
  <div class="m-status">
    <div
      class="ui-icon"
      :class="{
        'icon-success': status == 1,

        'icon-round': status === null || status == 2 || status == 0,
      }"
    ></div>
    <div class="txt-name" :class="{ 'success-txt': status == 1 }">
      {{ (status!==1&&keyInfo.key=="status" )?keyInfo.errorName:keyInfo.name }}
    </div>

    <div v-if="check()">
      <div class="link-btn" v-if="status == 0 || status == null" @click="onSub">
        {{ keyInfo.btn }}
      </div>
    </div>

    <div class="link-btn" v-if="status == 2">
      {{ keyInfo.status }}
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    status: {
      type: String,
      default: "",
    },
    account: {
      type: Object,
      default: () => {
        return {};
      },
    },
    keyInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  created() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    check() {
      //是否显示按钮
      /*      (account.info && account.info.status == 1) ||
        keyInfo.key == "status" ||
        !keyInfo.isJump; */
      if (this.keyInfo.check) {
        for (let i = 0; i < this.keyInfo.check.length; i++) {
          if (this.account.info[this.keyInfo.check[i]] !== 1) {
            return false;
          }
        }
      }
      return true;
    },
    onSub() {
      this.$emit("listen", {
        keyInfo: this.keyInfo,
        status: this.status,
        account: this.account,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-success {
  background-image: url("//static.theone.art/pc/pay-manage/icon-success.png");
}
.icon-fail {
  background-image: url("//static.theone.art/pc/pay-manage/icon-fail.png");
}

.icon-round {
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 100px;
  background-color: #fff;
}
.round-point {
  width: 8px;
  height: 8px;
  background: #29c445;
  display: inline-block;
  border-radius: 100px;
}
.link-btn {
  font-size: 14px;
  font-weight: 400;
  color: #397fe7;
  cursor: pointer;
}
.m-status {
  position: relative;
  top: 0;
  left: 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  background-color: #fff;
  z-index: 2;
  padding: 0 12px;
  margin: 0 -12px;
  display: flex;
  align-items: center;

  .ui-icon {
    margin-right: 6px;
    position: relative;
    top: -2px;
    left: 0;
  }
  .link-btn {
    position: absolute;
    top: 24px;
    left: 32px;
    word-break: keep-all;
  }
  .success-txt {
    color: #333333;
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .m-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: transparent;
    .ui-icon {
      margin: 0 auto;
      margin: 0;
      top: 0;
    }
    .link-btn {
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
    }
    .txt-name {
      word-break: break-all;
      white-space: normal;
      word-wrap: break-word;
      width: 100%;
      text-align: center;
      padding-top: 6px;
    }
  }
}
</style>
