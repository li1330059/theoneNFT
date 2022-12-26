<template>
  <div class="lottery-body">
    <div class="loading-wrap"
         v-if="loading">
      <loading></loading>
    </div>
    <div class="tip-message"
         v-else-if="isDeactivate">活动已停用</div>
    <div v-else
         class="page-lottery grayscale">
      <div class="page-body pc-content"
           :style="`background-image:url(${dataList.pc.bgUrl});background-color:${dataList.bgColor}`"
           v-if="dataList">
        <!-- head -->
        <div class="bg-img">
          <div class="section ui-head">
            <div class="img1">
              <img :src="dataList.pc.bgTitle"
                   class="pc-content" />
              <img :src="dataList.mobile.bgTitle"
                   class="mobile-content" />
            </div>
          </div>
        </div>
        <!-- box -->
        <div class="box-shadow section bottom1"
             :style="`background:${dataList.boxShadowColor}`">
          <div class="title"
               :style="`color:${dataList.boxTxtColor}`">
            {{ dataList.boxTitle
            }}<img class="icon"
                 :src="dataList.boxTitleIcon" />
          </div>
          <div v-if="dataList.boxTxtListType == 'string'"
               class="txt"
               v-html="getHref(dataList.boxTxtList)">
          </div>
          <div v-else
               class="txt"
               :style="`color:${dataList.boxTxtColor}`"
               v-for="(item, index) in dataList.boxTxtList"
               :key="index">
            {{ item }}
          </div>
          <!-- <div class="detail"
               v-if="key =='tiantanpark3'"
               @click="goDetail">活动详情：点击跳转</div>
          <div class="detail"
               v-if="key =='tiantanpark4'"
               @click="goDetail_tiantanpark4">活动详情：点击跳转</div> -->
        </div>
        <!-- sign -->
        <div class="box-shadow section section2"
             :style="`background:${dataList.boxShadowColor}`">
          <div class="title"
               :style="`color:${dataList.boxTxtColor}`">
            报名抽签购买资格
          </div>
          <div class="txt"
               :style="`color:${dataList.boxTxtColor}`"
               v-if="userInfo.userUuid">
            {{ userInfo.nickname }}，您好
          </div>
          <div class="txt"
               :style="`color:${dataList.boxTxtColor}`"
               v-else>
            您还未登录，请去<span class="pointer"
                  @click="goLogin"> 登录</span>
          </div>
        </div>
        <div class="sign-btn"
             :style="`background:${dataList.boxBtnBgColor};color:${dataList.boxBtnColor}`"
             :class="{ 'sign-btn-disabled': signStatus }"
             @click="onSign">
          <div class="icon"
               :style="`background-image:url(${dataList.boxBtnIcon});`" />
          <span v-if="signStatus">已抽签</span>
          <span v-else>报名</span>
        </div>
        <!-- photo -->
        <div class="photo pc-content"
             v-for="(item, index) in dataList.contentCount"
             :key="index">
          <img :src="`//static.theone.art/pc/active/${dataList.folder}/pc${
              index + 1
            }${dataList.picType}`"
               alt="" />
        </div>
        <div class="photo mobile-content"
             v-for="(item, index) in dataList.contentCount"
             :key="index">
          <img :src="`//static.theone.art/pc/active/${dataList.folder}/mobile${
              index + 1
            }${dataList.picType}`"
               alt="" />
        </div>
      </div>
      <div class="page-body mobile-content"
           :style="`background-image:url(${dataList.mobile.bgUrl});background-color:${dataList.bgColor}`"
           v-if="dataList">
        <!-- head -->
        <div class="bg-img">
          <div class="section ui-head">
            <div class="img1">
              <img :src="dataList.pc.bgTitle"
                   class="pc-content" />
              <img :src="dataList.mobile.bgTitle"
                   class="mobile-content" />
            </div>
          </div>
        </div>
        <!-- box -->
        <div class="box-shadow section bottom1"
             :style="`background:${dataList.boxShadowColor}`">
          <div class="title"
               :style="`color:${dataList.boxTxtColor}`">
            {{ dataList.boxTitle
            }}<img class="icon"
                 :src="dataList.boxTitleIcon" />
          </div>
          <div v-if="dataList.boxTxtListType == 'string'"
               class="txt"
               v-html="getHref(dataList.boxTxtList)">
          </div>
          <div v-else
               class="txt"
               :style="`color:${dataList.boxTxtColor}`"
               v-for="(item, index) in dataList.boxTxtList"
               :key="index">
            {{ item }}
          </div>
          <!-- <div class="detail"
               v-if="key =='tiantanpark3'"
               @click="goDetail">活动详情：点击跳转</div>
          <div class="detail"
               v-if="key =='tiantanpark4'"
               @click="goDetail_tiantanpark4">活动详情：点击跳转</div> -->
        </div>
        <!-- sign -->
        <div class="box-shadow section section2"
             :style="`background:${dataList.boxShadowColor}`">
          <div class="title"
               :style="`color:${dataList.boxTxtColor}`">
            报名抽签购买资格
          </div>
          <div class="txt"
               :style="`color:${dataList.boxTxtColor}`"
               v-if="userInfo.userUuid">
            {{ userInfo.nickname }}，您好
          </div>
          <div class="txt"
               :style="`color:${dataList.boxTxtColor}`"
               v-else>
            您还未登录，请去<span class="pointer"
                  @click="goLogin"> 登录</span>
          </div>
        </div>
        <div class="sign-btn"
             :style="`background:${dataList.boxBtnBgColor};color:${dataList.boxBtnColor}`"
             :class="{ 'sign-btn-disabled': signStatus }"
             @click="onSign">
          <div class="icon"
               :style="`background-image:url(${dataList.boxBtnIcon});`" />
          <span v-if="signStatus">已抽签</span>
          <span v-else>报名</span>
        </div>
        <!-- photo -->
        <div class="photo pc-content"
             v-for="(item, index) in dataList.contentCount"
             :key="index">
          <img :src="`//static.theone.art/pc/active/${dataList.folder}/pc${
              index + 1
            }${dataList.picType}`"
               alt="" />
        </div>
        <div class="photo mobile-content"
             v-for="(item, index) in dataList.contentCount"
             :key="index">
          <img :src="`//static.theone.art/pc/active/${dataList.folder}/mobile${
              index + 1
            }${dataList.picType}`"
               alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "../../../components/v1/loading/loading.vue";
export default {
  components: { Loading },
  data () {
    return {
      loading: true,
      signStatus: false,
      dataList: null,
      href: window.location.href,
      key: null,
      isDeactivate: false,
    };
  },
  async created () {
    this.isDeactivate = false;
    if (this.href !== null || this.href !== "") {
      this.key = this.$route.params.key;
      this.getActivityDetail();
    }
  },
  mounted () {
    this.activityValid();
    this.getUserSignStatus();
  },
  computed: {
    userInfo () {
      return this.$store.state.user_info;
    },
  },
  watch: {
    userInfo () {
      this.getUserSignStatus();
    },
  },
  methods: {
    goLogin () {
      this.$router.push("/login");
    },
    // goDetail () {
    //   let path = "/news/2e46b5b4128bc58734700ea641e4fb11"
    //   if (this.$common.isMobile()) {
    //     window.location.href = path;
    //   } else {
    //     window.open(path, "_blank");
    //   }
    // },
    // goDetail_tiantanpark4 () {
    //   let path = "/news/3df8cc7e5070e68b5f7d600fafec2c47"
    //   if (this.$common.isMobile()) {
    //     window.location.href = path;
    //   } else {
    //     window.open(path, "_blank");
    //   }
    // },
    // 查看是否已报名
    async getUserSignStatus () {
      if (this.userInfo.userUuid) {
        await this.$api.service
          .activity_getResult({ actKey: this.key })
          .then((res) => {
            if (res.data.code == 200 && res.data.data) {
              this.signStatus = res.data.data;
            }
          });
      }
    },
    // 报名
    async onSign () {
      if (this.signStatus) {
        this.$message.warning("您已报名！");
        return;
      }
      this.sign();
    },
    async sign () {
      await this.$api.service
        .activity_signUp({ actKey: this.key })
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.getUserSignStatus();
            this.$message.success("报名成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 校验是否为活动有效期
    async activityValid () {
      // 活动是否有效
      await this.$api.service
        .activity_valid({ actKey: this.key })
        .then((res) => {
          if (res.data.data.status == 1) {
            // 有效
          } else if (res.data.data.status == 2) {
            // 活动未开始
            this.$message.error("活动未开始，请耐心等待！");
          } else if (res.data.data.status == 3) {
            // 活动已结束
            this.$message.error("活动已结束！");
          }
        });
    },
    // 获取活动详情
    async getActivityDetail () {
      await this.$api.service
        .activity_getActivityDetail({ actKey: this.key })
        .then((res) => {
          this.loading = false;
          if (res.data.code == 200 && res.data.data) {
            this.dataList = JSON.parse(res.data.data.dataJson);
            this.dataList.contentCount = parseInt(this.dataList.contentCount);
            if (res.data.data.signed == 0) {
              this.signStatus = true;
            };
          } else {
            this.isDeactivate = true;
            console.log("抽签活动已停用！");
            /*       this.goLogin(); */
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getHref (content) {
      if (!content) {
        return '';
      };
      if (this.checkHtml(content)) {
        if (this.$common.isMobile()) {
          content = content.replace("_blank", "_self");
        };
        content = content.replace('<a', '<a style="color:rgb(221, 16, 16) ;"');
        content = content.replace('<p', '<p style="word-wrap: break-word;"');
      };
      return content;
    },
    // 判断是否存在a标签
    checkHtml (htmlStr) {
      var reg = /<[^>]+>/g;
      return reg.test(htmlStr);
    },
  },
};
</script>
<style lang="scss" scoped>
.lottery-body {
  min-height: 65vh;
}
.loading-wrap {
  padding-top: 20vh;
}
.tip-message {
  text-align: center;
  color: #717171;
  padding-top: 10vh;
}
.pc-content {
  display: block;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    display: none;
  }
}
.mobile-content {
  display: none;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    display: block;
  }
}
.page-body {
  padding-bottom: 100px;
  background-size: cover;
  background-position: center 0%;
}
.bg-img {
  background-repeat: no-repeat;
  background-position: center right;
  background-size: contain;
  @media screen and (min-width: 0px) and (max-width: 540px) {
    // background-image: inherit;
  }
}
.section {
  max-width: 1066px;
  margin: 0 auto;
}
.ui-head {
  padding: 100px 0 200px;
  img {
    max-width: 60%;
    margin: 0 auto;

    image-rendering: -moz-crisp-edges; /* Firefox */
    image-rendering: -o-crisp-edges; /* Opera */
    image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding: 1rem 0 1.6rem;
    img {
      max-width: 80%;
    }
  }
}
.box-shadow {
  width: 100%;
  box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.03);
  border-radius: 5px;
  padding: 57px 54px 88px;
  .title {
    font-size: 26px;
    font-weight: normal;
    color: #221606;
    display: flex;
    align-items: center;
    margin-bottom: 43px;
    .icon {
      width: 93px;
      margin-left: 20px;
      @media screen and (min-width: 0px) and (max-width: 540px) {
        width: 70px;
      }
    }
    @media screen and (min-width: 0px) and (max-width: 540px) {
      font-size: 0.32rem;
      font-weight: bold;
    }
  }
  .txt {
    font-size: 16px;
    font-weight: normal;
    color: #333333;
    margin-bottom: 30px;
    line-height: 25px;
  }
  .detail {
    font-size: 16px;
    font-weight: normal;
    color: rgb(221, 16, 16);
    cursor: pointer;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    padding: 0.5rem 0.4rem 0.8rem;
    width: 95%;
  }
}
.sign-btn {
  width: 600px;
  line-height: 60px;
  text-align: center;
  box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.03);
  border-radius: 40px;
  margin: 30px auto 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: normal;
  user-select: none;
  cursor: pointer;
  .icon {
    display: flex;
    width: 22px;
    height: 22px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-right: 6px;
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    width: 90%;
    margin: 0.3rem auto 1.6rem;
  }
}
.sign-btn-disabled {
  background: rgba(97, 97, 97, 0.4);
}
.bottom1 {
  margin-bottom: 30px;
}
.section2 {
  padding-bottom: 37px;
}
.photo {
  max-width: 1066px;
  margin: 0 auto;
  margin-bottom: 200px;
  img {
    width: 100%;
    margin: 0 auto;
    image-rendering: -moz-crisp-edges; /* Firefox */
    image-rendering: -o-crisp-edges; /* Opera */
    image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
    @media screen and (min-width: 0px) and (max-width: 540px) {
      image-rendering: -moz-crisp-edges; /* Firefox */
      image-rendering: -o-crisp-edges; /* Opera */
      image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
    }
  }
  @media screen and (min-width: 0px) and (max-width: 540px) {
    margin-bottom: 0.5rem;
  }
}
.pointer {
  cursor: pointer;
}
// -----------------------------------------------------------
</style>
