<template>
  <div class="page-order-success">
    <div class="order-successs">
      <div class="icon"></div>
	  <div class="score" v-if="score">
		  <div class="tit">恭喜你获得 {{score}} 个积分</div>
		  <div>更多精彩活动可前往 APP-我的-积分中心</div>
	  </div>
      <div class="btns">
        <div class="v1-btn grey h30" @click="goPage">查看订单</div>
        <div class="v1-btn h30" @click="onGoMarket">继续浏览</div>
      </div>
      <!--       <div>TheOne:{{ theOne }}</div> -->
    </div>
  </div>
</template>
<script>
import App from "@/utils/app/index";
export default {
  data() {
    return {
      theOne: {},
      score:"",
      jumpPage: "",
    };
  },
  created() {
    this.postMessage();
    this.getScore();
    //order/success
    this.jumpPage = this.$localStorage.getItem("jump-page");
    this.$localStorage.removeItem("jump-page");
  },

  methods: {
    async getScore() {
      let result = await this.$api.service.scoreByOrder({orderNo:localStorage.getItem("orderNo")});
      if (result.data.code == 200) {
        this.score = result.data.data;
      }
    },
    onGoMarket() {
      const url = localStorage.getItem("VISITOR-LINK");

      this.$router.push(url ? url : "/market?type=copyright");
    },
    goPage() {
      this.$common.goPage(this.jumpPage ? this.jumpPage : "/mine/buy");
    },
    postMessage() {
      this.theOne = App.browser.theone;
      if (App.browser.theone.isTheOne) {
        if (App.browser.os.ios) {
          App.ios.payResult("success");
        } else {
          App.android.payResult("success");
        }
      } else {
        setTimeout(() => {
          uni.redirectTo({
            url: "/pages/order/success",
          });
        }, 200);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-order-success {
  height: calc(100vh - 390px);
  display: flex;
  align-items: center;
  justify-content: center;
  .order-successs {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 222px;
    .icon {
      background: url("//static.theone.art/pc/images/pic-home/order-success.png")
        no-repeat center center;
      width: 222px;
      height: 145px;
      margin-bottom: 12px;
      background-size: contain;
    }
    .btns {
      display: flex;
      justify-content: space-between;
      .v1-btn {
        width: 96px;
      }
    }
  }
  .score{
	  font-size: 12px;
	  color: #999999;
	  margin-bottom: 32px;
	  text-align: center;
	  div{
		  margin-top: 6px;
		  line-height: 24px;
	  }
	  .tit{
		  font-size: 14px;
		  color: #4D4D4D;
		  text-align: center;
	  }
  }
}
</style>
