<template>
  <div>
    <div class="page-mine-index mode-PC">
      <div class="wallet" v-if="userWalletResult">
        <div class="title-line">
          <h1>我的零钱</h1>
          <!--    <div class="v1-btn-link blue" @click="onRecharge">充值</div> -->
          <div class="flex1"></div>
          <div
            :class="{ 'v1-btn-eye': true, hidden: hiddenMoney }"
            @click="changeHidden"
          ></div>
        </div>
        <div class="content-line">
          <div>
            <p>恒信通账户金额（元）</p>
            <h1>
              {{
                hiddenMoney
                  ? "***"
                  : $common.formatMoney(userWalletResult.amount)
              }}
            </h1>
          </div>
          <!--       <div>
            <p>恒信通账户提现待审核金额(元)</p>
            <h1>
              {{
                hiddenMoney
                  ? "***"
                  : $common.formatMoney(userWalletResult.freezeAmount)
              }}
            </h1>
          </div> -->
          <div>
            <p>宝付账户金额（元)</p>
            <h1>
              {{
                hiddenMoney
                  ? "***"
                  : $common.formatMoney(userWalletResult.baofooAmount)
              }}
            </h1>
          </div>
          <div>
            <p>汇元账户金额（元)</p>
            <h1>
              {{ hiddenMoney ? "***" : $common.formatMoney(hyInfo.amount) }}
            </h1>
          </div>
          <div>
            <p>易宝账户金额（元)</p>
            <h1>
              {{ hiddenMoney ? "***" : $common.formatMoney(ybInfo.amount) }}
            </h1>
          </div>
          <!--        <div>
            <p>宝付账户提现待审核金额(元)</p>
            <h1>
              {{
                hiddenMoney
                  ? "***"
                  : $common.formatMoney(userWalletResult.baofooFreezeAmount)
              }}
            </h1>
          </div> -->
        </div>
      </div>
      <div class="v1-card-title-mycenter">
        <h1>我的藏品</h1>
        <span @click="goMore" class="see-more">查看更多</span>
      </div>
      <div class="treasure-swiper grayscale">
        <swiper :options="swiperOption" v-if="category_arr.length > 0">
          <swiper-slide v-for="(item, index) in category_arr" :key="index">
            <!--       <div
              @click="goSee(item)"
              :style="`background-image:url(${item.commodity.cover})`"
            ></div> -->
            <router-link :to="{ path: `/mine/treasure/${item.id}` }">
              <preview-img
                v-if="item.commodity"
                class="cover-wrap"
                :cover="(item.commodity && item.commodity.cover) || item.cover"
                :picture="
                  (item.commodity && item.commodity.actualPicture) ||
                  item.actualPicture
                "
                :info="item"
                :isShowPreview="false"
              ></preview-img
            ></router-link>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="mode-mobile">
      <m-index />
    </div>
    <!-- 充值 -->
    <recharge ref="recharge" @listen="listenRecharge"></recharge>
    <!-- 实名认证 -->
    <nameVerified
      ref="nameVerified"
      @listen="listenNameVerified"
    ></nameVerified>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import mIndex from "./components/mobileIndex";
import recharge from "@/pages/v1/mine/wallet/recharge";
import nameVerified from "@/pages/v1/mine/setting/nameVerified";
export default {
  components: { Swiper, SwiperSlide, mIndex, recharge, nameVerified },
  data() {
    return {
      hyInfo: {},
      hiddenMoney: true,
      swiperOption: {
        initialSlide: 2,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflow: {
          rotate: 30,
          stretch: 10,
          depth: 60,
          modifier: 2,
          slideShadows: true,
        },
      },
      userWalletResult: null,

      category_arr: [], //我的收藏列表
    };
  },
  created() {
    this.getUserWallet();
    // this.getUserAttr();
    this.getCategory();
  },
  computed: {
    userAttrResult() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    goSee(item) {
      this.$router.push(`/mine/treasure/${item.id}`);
    },
    async getCategory() {
      const res = await this.$api.service.treasure_list_v2({
        blindBoxDraw: 0,
        pageCount: 1,
        pageSize: 16,
      });

      if (res.data.code == 200 && res.data.data.records) {
        this.category_arr = res.data.data.records;
      }
    },
    goMore() {
      this.$router.push("/mine/treasure");
    },
    // 获取账户信息
    async getUserWallet() {
      let result = await this.$api.service.userWallet_get();
      this.userWalletResult = result.data.data;
      this.getUserHyWallet();
    },
    // 获取汇元账户信息
    async getUserHyWallet() {
      let result = await this.$api.service.notecase_query({});
      if (result.data.code == 200) {
        this.hyInfo = result.data.data.hy ? result.data.data.hy : {};
        this.ybInfo = result.data.data.yb ? result.data.data.yb : {};
      }
    },
    // 获取用户属性
    async getUserAttr() {
      let result = await this.$api.service.userattribute_queryByUserUuid();
      this.userAttrResult = result.data.data;
    },
    // 隐藏显示钱包
    changeHidden() {
      this.hiddenMoney = !this.hiddenMoney;
    },
    // 充值
    onRecharge() {
      // 判断是否已经实名认证
      if (this.userAttrResult.statusVerified != 1) {
        this.$refs.nameVerified.init();
      } else {
        this.$refs.recharge.init();
      }
    },
    listenRecharge() {},
    listenNameVerified(result) {
      if (result.result) {
        console.log(`认证通过`);
        this.$refs.recharge.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.see-more {
  cursor: pointer;
}
.page-mine-index {
  .wallet {
    background: #ffffff;
    box-shadow: 0px 2px 16px 0px rgba(180, 180, 180, 0.4);
    border-radius: 4px;
    padding: 0 32px;
    margin-bottom: 37px;
    .title-line {
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
      height: 51px;
      h1 {
        font-size: 14px;
        color: rgba($color: #000000, $alpha: 0.7);
        margin-right: 20px;
      }
    }
    .content-line {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 26px 0 33px;
      div {
        flex: 1;
        // text-align: center;
        h1 {
          color: #000000;
          font-size: 16px;
        }
        p {
          font-size: 14px;
          color: rgba($color: #000000, $alpha: 0.4);
          margin-bottom: 7px;
        }
      }
    }
  }

  .treasure-swiper {
    padding-top: 84px;
    width: 1120px;
    .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 300px;
      height: 300px;
      div {
        width: 300px;
        height: 300px;
        position: relative;
        background: no-repeat center center;
        background-size: cover;
        img {
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}
</style>
