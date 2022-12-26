<template>
  <div class="m-phone-header" v-if="isShow">
    <div class="main">
      <div class="icon-direction" @click="onCancel"></div>
      <div class="txt">{{ title }}</div>
	  <slot></slot>
    </div>
  </div>
</template>
<script>
import App from "@/utils/app/index";
export default {
  data() {
    return {
		isShow: true,
	};
  },
  props: {
    go: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  watch: {
    $route: function (to, from) {
      this.checkHeaderStatus(to.meta);
    },
  },
  created() {
		if (App.browser.theone&&App.browser.theone.isTheOne) {
			this.isShow = false
		}
  },
  computed: {},
  methods: {
    onCancel() {
		if (App.browser.theone&&App.browser.theone.isTheOne) {
			if (App.browser.os.ios) {
				App.ios.authLogin(JSON.stringify({message:'error'}));
			}else if(App.browser.os.android){
				App.android.authLogin({message:'error'});
			}
		}else {
			window.location.href = this.go;
		}
    }
  },
};
</script>
<style lang="scss" scoped>
.m-phone-header {
  display: none;
  height: 1.08rem;
  @media screen and (max-width: 540px) {
    display: block;
    .main {
      width: 100%;
      height: 1.08rem;
      position: fixed;
      z-index: 999;
      padding: 0 0.32rem;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.36rem;
      font-weight: 500;
      color: #333333;
	  box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.06);
      .icon-direction {
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("//static.theone.art/pc/icons/icon-left-direction.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .placeholder {
        width: 0.4rem;
      }
      .txt {
        flex: 1;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
