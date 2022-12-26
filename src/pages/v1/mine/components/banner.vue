<template>
  <div class="v1-mine-banner">
    <div class="mine-bg grayscale">
      <div class="bg-hover-wrap" @click="onShowEditorBanner">
        <span class="icon-hand" />点此编辑背景图
      </div>
      <!--       <swiper
        class="swiper j-swiper"
        :options="swiperOption"
        :auto-update="true"
        :auto-destroy="true"
        v-if="bannerList.length > 0"
      >
        <swiper-slide v-for="item in bannerList" :key="item.uuid">
          <div
            class="img-wrap"
            :style="`background-image:url(${item.cover})`"
          />
        </swiper-slide>

        <div class="swiper-pagination" slot="pagination"></div>
      </swiper> -->
      <div class="swiper-container swiper j-banner-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in bannerList" :key="item.uuid">
            <div
              class="img-wrap"
              :style="`background-image:url(${item.cover})`"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mine-avatar">
      <el-avatar
        class="avatar mine-avatar-head"
        :size="100"
        :src="user_info.avatar || '/static/img/avatars.svg'"
      ></el-avatar>
      <div class="mine-change-portrait">
        <span>修改头像</span
        ><input
          @change="onUpUserFaceImg"
          type="file"
          style="opacity: 0"
          accept="image/*"
        />
      </div>
      <i v-if="user_info.isAuthor"></i>
    </div>
    <div class="mine-content title">
      {{ user_info.stagename || user_info.nickname || "未设置" }}
    </div>
    <div class="mine-content" v-if="user_info">
      {{ user_info.introduce || "他好像对元宇宙没有什么话想说" }}
    </div>
    <div class="mine-content" v-if="user_info">
      {{ $common.formatDate(user_info.verifiedTime, "yyyy年 MM月 dd日") }}
    </div>
    <div
      class="mine-content ip-address hand"
      v-if="user_info.ipAddress"
      @click="onIpTip"
    >
      <span>IP属地：{{ user_info.ipAddress }}</span
      ><span class="ui-icon icon-ip-tip" />
    </div>
    <banner-setting
      :banner-list="bannerList"
      ref="refBannerSetting"
    ></banner-setting>
  </div>
</template>
<script>
/* import { Swiper, SwiperSlide } from "vue-awesome-swiper"; */
import Swiper from "swiper";
import store from "@/store";
import BannerSetting from "./banner-setting.vue";
/* import "swiper/dist/css/swiper.css"; */
export default {
  components: { BannerSetting },
  data() {
    return {
      loginMember: null,
      loginChain: null,
      bannerList: [],
      userAttr: {},
      swiperOption: {
        autoplay: 1000,
        speed: 300,
        disableOnInteraction: false,
        waitForTransition: false,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
        },
      },
    };
  },
  created() {
    // this.getLoginMember();
    this.getUserBannerList();
  },
  computed: {
    user_info() {
      return this.$store.state.user_info;
    },
  },

  methods: {
    onIpTip() {
      this.$confirm(`根据网络运营商数据，展示用户IP属地信息`, "提示", {
        confirmButtonText: "我知道了",
        showCancelButton: false,
        customClass: "mobile-btn-center",
      })
        .then(async () => {})
        .catch(() => {});
    },
    onShowEditorBanner() {
      this.$refs.refBannerSetting.init();
    },
    async getUserBannerList() {
      const res = await this.$api.service.userBanner_list({
        pageCount: 1,
        pageSize: 12,
      });

      if (res && res.data.code == 200) {
        this.bannerList = res.data.data.records;
        this.$nextTick(() => {
          if (this.swiper) {
            this.swiper.destroy(false);
          }
          this.swiper = new Swiper(".j-banner-swiper", {
            loop: true, // 循环模式选项
            autoplay: this.bannerList.length > 1 ? 5000 : false,
            autoplayDisableOnInteraction: false,
            waitForTransition: false,
          });
        });
      } else {
        this.$message.error(res.data.message);
      }
    },
    async onUpUserFaceImg(e) {
      const file = e.target.files[0];

      if (file && file.size < 1024 * 1024) {
        const params = new FormData();
        params.append("file", file);
        params.append("type", "image");
        const res = await this.$api.service.upload_uploadFile(params);
        if (res.data.code == 200 && res.data.data) {
          const avatar_res = await this.$api.service.userattribute_change({
            avatar: res.data.data,
            nickname: this.user_info.nickname,
          });
          if (avatar_res.data.code == 200 && avatar_res.data.data) {
            let loginMember = localStorage.getItem("THEONE_MEMBER");
            loginMember = JSON.parse(loginMember);
            loginMember.photo = res.data.data;
            this.$store.dispatch("getUserInfo");
            localStorage.setItem("THEONE_MEMBER", JSON.stringify(loginMember));
            this.$message({
              message: "头像已更新",
              type: "success",
            });
          } else {
            this.$message({
              message: avatar_res.data.message,
              type: "error",
            });
          }
        } else {
          this.$message({
            message: res.data.message || "图片上传失败",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "文件大小不得大于1M",
          type: "warning",
        });
      }
      /*   */
    },
    async getLoginMember() {},
    onChangePortrait() {
      //更改用户头像
      console.log("更改用户头像");
    },
  },
};
</script>
<style lang="scss">
.mine-avatar-head > img {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.img-wrap {
  width: 100%;
  height: 300px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.swiper {
  height: 300px;
}
.v1-mine-banner {
  width: 100%;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: 400;
  color: #ffffff;

  .mine-bg {
    background: url("//static.theone.art/pc/mine/banner1.png") center no-repeat;
    background-size: cover;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9;
    .bg-hover-wrap {
      display: none;
      align-items: center;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.7);
      position: absolute;
      top: 21px;
      right: 21px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      z-index: 99;
      .icon-hand {
        background: url("//static.theone.art/pc/icons/icon-hand.png") no-repeat
          center;
        background-size: contain;
        width: 14.5px;
        height: 21.5px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    &:hover {
      .bg-hover-wrap {
        display: flex;
      }
    }
  }

  .mine-avatar {
    z-index: 99;
    position: relative;
    border: 3px solid #fff;
    border-radius: 100px;
    cursor: pointer;
    width: 106px;
    height: 106px;
    &:hover {
      .mine-change-portrait {
        opacity: 1;
        width: 100%;
        height: 100%;
        z-index: 10;
      }
    }
    .mine-change-portrait {
      cursor: pointer;
      user-select: none;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity ease-out 0.26s;
      opacity: 0;
      input {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        cursor: pointer;
      }
    }
    i {
      position: absolute;
      background: url("//static.theone.art/pc/images/yishujia%402x.png")
        no-repeat;
      width: 30px;
      height: 30px;
      background-size: 100% 100%;
      z-index: 999;
      right: 0;
      bottom: 0;
    }
  }

  .mine-content {
    padding-top: 8px;
    z-index: 99;
    color: rgba(255, 255, 255, 0.8);
    &.ip-address {
      display: flex;
      align-items: center;
      justify-content: center;
      .ui-icon {
        margin-left: 6px;
      }
    }
    &.title {
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      padding-top: 16px;
    }
  }
}
</style>
