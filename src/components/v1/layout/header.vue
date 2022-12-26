<template>
  <div>
    <div class="v1-header-main" v-if="!ifApp">
      <div class="v1-header-logo" @click="iconclick('logo')">
        <router-link to="/">
          <img src="//static.theone.art/pc/logo.svg" alt />
        </router-link>
      </div>
      <div class="v1-header-menu">
        <div class="v1-menu-item" @click="iconclick('首页')" :class="{ active: activePath == '/' }">
          <router-link to="/">首页</router-link>
        </div>
        <div
          class="v1-menu-item"
		   @click="iconclick('版权品市场')"
          :class="{
            active:
              (activePath == '/market' && query.type == 'copyright') ||
              (activePath == '/market' && query.type == 1),
          }"
        >
          <router-link slot="reference" to="/market?type=copyright"
            >版权品市场</router-link
          >
        </div>
        <div
          class="v1-menu-item"
		   @click="iconclick('衍生品市场')"
          :class="{
            active:
              (activePath == '/market' && query.type == 'derive') ||
              (activePath == '/market' && query.type == 2),
          }"
        >
          <router-link slot="reference" to="/market?type=derive"
            >衍生品市场</router-link
          >
        </div>
        <div class="v1-menu-item" @click="iconclick('艺术家')" :class="{ active: activePath == '/artist' }">
          <router-link to="/artist">艺术家</router-link>
        </div>
        <div class="v1-menu-item" @click="iconclick('唯艺热点')" :class="{ active: activePath == '/hotspot' }">
          <router-link to="/hotspot">唯艺热点</router-link>
        </div>
        <div
          class="v1-menu-item"
		  @click="iconclick('活动日历')"
          :class="{ active: activePath == '/active_date' }"
        >
          <router-link to="/active_date">活动日历</router-link>
        </div>
      </div>
      <div class="v1-header-right">
        <div :class="{ 'v1-header-search pointer': true }">
          <div class="search-wrap" :class="{ show: flag.search }">
            <div class="search" @click="iconclick('搜索')">
              <div class="icon" @click.stop="onSearch"></div>
              <div class="input">
                <input
                  ref="inputkey"
                  placeholder="请输入您想查找的内容"
                  @input="onSearchKey"
                  @blur="onSearchBlur"
                  @keydown.enter="onEnter"
                />
              </div>
              <div class="close pointer" @click="onCloseSearch"></div>
            </div>
            <div :class="{ 'search-result': true, show: flag.searchResult }">
              <div>
                <h1>作品</h1>
                <ul
                  v-if="flag.searchWorks && flag.searchWorks.length > 0"
                  class="m-scrol"
                  @scroll="pcSearchScroll($event, item)"
                >
                  <li
                    v-for="(item, index) in flag.searchWorks"
                    :key="index"
                    @click="goMarket(item)"
                  >
                    {{ item.name }}
                  </li>
                </ul>
                <div class="search-kong" v-else>暂无该作品信息</div>
              </div>
              <div>
                <h1>作家</h1>
                <ul
                  v-if="flag.searchArtist && flag.searchArtist.length > 0"
                  class="m-scrol"
                  @scroll="pcSearchAuthorScroll($event, item)"
                >
                  <li
                    v-for="(item, index) in flag.searchArtist"
                    :key="index"
                    @click="$common.goPage(`/user/${item.uuid}`, '_blank')"
                  >
                    <!-- {{ item.nickname!= item.realName?`${item.nickname}-${item.realName}`:item.nickname}} -->
                    {{ item.nickname }}
                  </li>
                </ul>
                <div class="search-kong" v-else>暂无该作家信息</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tool-wrap grayscale">
          <div class="v1-header-line"></div>
          <div class="login-btns" @click="iconclick('登录')">
            <!--     <div class="btn btn-chain">
              <div
                class="no-login"
                v-if="!loginChain"
                @click="loginChainShow"
              ></div>
              <div class="no-login login" @click="loginChainShow" v-else></div>
            </div> -->
            <div class="btn btn-phone">
              <div
                class="avatar"
                :style="`background-image:url('${
                  loginMember.avatar || '/static/img/avatars.svg'
                }')`"
                v-if="loginMember.userUuid"
                @click="goPage('/mine')"
              >
                <span v-if="loginMember.isAuthor == 1" class="icon-author" />
              </div>
              <div v-else class="no-login" @click="loginShow"></div>

              <div class="person-panel" v-if="loginMember.userUuid">
                <div class="person-panel-inner">
                  <div class="info">
                    <div
                      class="avatar"
                      :style="`background-image:url('${
                        loginMember.avatar || '/static/img/avatars.svg'
                      }')`"
                      v-if="loginMember.userUuid"
                      @click="goPage('/mine')"
                    >
                      <span
                        v-if="loginMember.isAuthor == 1"
                        class="icon-author large-author"
                      />
                    </div>
                    <div class="name" style="max-width: 60%">
                      <h1 class="hidden">
                        {{ loginMember.nickname || "唯艺" }}
                      </h1>

                      <p class="hidden">
                        {{
                          (loginChain &&
                            $common.formatAddress(loginChain.address, 6)) ||
                          loginMember.introduce ||
                          "他好像对元宇宙没有什么话想说"
                        }}
                      </p>
                    </div>
                    <div class="exit" @click="loginout">退出</div>
                  </div>

                  <div class="operate">
                    <swiper :options="swiperOption">
                      <swiper-slide
                        v-for="(item, index) in operateList"
                        :key="index"
                      >
                        <div class="operate-item" @click="goPage(item.url)">
                          <div :class="`icon ${item.icon}`"></div>
                          <h1>{{ item.name }}</h1>
                        </div>
                      </swiper-slide>
                    </swiper>
                    <div
                      class="swiper-button-prev"
                      slot="button-prev_header"
                    ></div>
                    <div
                      class="swiper-button-next"
                      slot="button-next_header"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="v1-header" v-if="!ifApp"></div>

    <!--     <loginChain
      :loginChain="loginChain"
      v-if="openLoginChain"
      ref="loginChain"
      @listen="listenLoginChain"
    ></loginChain> -->
  </div>
</template>

<script>
window.d = "5opkytHOggKj5utjZOgszg==";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import App from "@/utils/app/index";
export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      inputValue: "",
      activePath: "",
      query: {},
      openLogin: false,
      openLoginChain: true,

      loginChain: null,
      flag: {
        search: false, //搜索是否展开
        searchResult: false, //搜索是否有结果
        searchArtist: [], //作家搜索结果
        searchWorks: [], //作品搜索结果
      },
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 20,
        prevButton: ".swiper-button-prev",
        nextButton: ".swiper-button-next",
      },
      operateList: [
        // {
        //   name: "我的信件",
        //   icon: "letter-icon",
        //   url: "/mine/message",
        // },
        {
          name: "我的作品",
          icon: "icon1",
          url: "/mine/opus",
          isAuthor: 1,
        },
        {
          name: "我的藏品",
          icon: "icon2",
          url: "/mine/treasure",
        },
        // {
        //   name: "常用数据",
        //   icon: "icon3",
        //   url: "/mine/gift_manage",
        // },
        {
          name: "我的订单",
          icon: "icon4",
          url: "/mine/buy",
        },
        {
          name: "支付管理",
          icon: "icon5",
          url: "/mine/wallet/index",
        },
        {
          name: "个人设置",
          icon: "icon6",
          url: "/mine/setting/index",
        },
      ],
      isSearch: true,
      isSearchAuthor: true,
      searchOption: {
        pageCount: 1,
        pageSize: 12,
        name: "",
      },
      searchAuthorParams: {
        pageCount: 1,
        pageSize: 12,
        name: "",
      },
	  ifApp:false
    };
  },
  watch: {
    $route: function (to, from) {
      console.log(to.query, to.path);

      this.query = to.query;
      /*      if (this.query.type == 1) {
        this.query.type = "copyright";
      } else {
        this.query.type = "derive";
      } */
      this.activePath = to.path;
    },
  },
  created() {
    this.activePath = this.$route.path;
    this.query = this.$route.query;
    /*     if (this.query.type == 1) {
      this.query.type = "copyright";
    } else {
      this.query.type = "derive";
    } */
    this.getLoginMember();
    this.operateList = this.operateList.filter((item) => {
      if (item.isAuthor) {
        return item.isAuthor == this.$store.state.user_info.isAuthor;
      }
      return true;
    });
	
	if (App.browser.theone && App.browser.theone.isTheOne) {
	  //app内
	  this.ifApp = true;
	}
  },
  async mounted() {
    window.ethereum
      ? (this.isMetaMaskInstall = true)
      : (this.isMetaMaskInstall = false);
  },
  computed: {
    loginMember: {
      get(val) {
        return this.$store.state.user_info;
      },
      set(val) {},
    },
  },

  methods: {
    pcSearchScroll(e) {
      const el = e.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight && this.isSearch) {
        console.log("到底了");
        this.isSearch = false;
        this.searchOption.pageCount++;
        this.getSearchList();
        return false;
      }
    },
	iconclick(button_name){
		this.$sensors.track('icon_click', {
			button_name: button_name
		});
	},
    pcSearchAuthorScroll(e) {
      const el = e.target;
      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight &&
        this.isSearchAuthor
      ) {
        this.isSearchAuthor = false;
        this.searchAuthorParams.pageCount++;
        this.getSearchAuthorList();
        return false;
      }
    },
    onSearch() {
      this.flag.searchResult = false;
      this.flag.search = true;

      this.$nextTick(() => {
        this.$refs.inputkey.focus();
        this.$refs.inputkey.value = null;
      });
    },
    onCloseSearch() {
      if (this.flag.search) {
        this.flag.search = false;
        this.flag.searchResult = false;
        this.$refs.inputkey.value = null;
      }
    },
    async onEnter(e) {
      if (this.flag.searchWorks && this.flag.searchWorks.length > 0) {
        const commodity = this.flag.searchWorks[0];
        this.goMarket(commodity);
      } else {
        if (this.flag.searchArtist && this.flag.searchArtist.length > 0) {
          const artistInfo = this.flag.searchArtist[0];
          this.$common.goPage(`/user/${artistInfo.uuid}`, "_blank");
        }
      }
    },
    onSearchBlur() {
      if (this.flag.search) {
        this.closeTimer = setTimeout(() => {
          this.onCloseSearch();
        }, 300);
      }
    },
    async onSearchKey(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getSearchInfo(e.target.value);
      }, 300);
    },
    getSearchInfo(name) {
      this.flag.searchResult = true;
      this.searchOption.name = name;
      this.searchOption.pageCount = 1;
      this.searchAuthorParams.name = name;
      this.searchAuthorParams.pageCount = 1;
      this.flag.searchWorks = [];
      this.flag.searchArtist = [];
      this.getSearchList();
      this.getSearchAuthorList();
    },
    async getSearchList() {
      let searchWorksResult = await this.$api.service.commodity_search(
        this.searchOption
      );
      const res = searchWorksResult.data;
      if (res.code == 200 && res.data.records.length > 0) {
        const _ary = [...this.flag.searchWorks, ...res.data.records];
        this.flag.searchWorks = this.$common.uniqueAry(_ary, "id");
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    },
    async getSearchAuthorList() {
      let searchArtistResult = await this.$api.service.author_search(
        this.searchAuthorParams
      );
      if (
        searchArtistResult.data.data.records &&
        searchArtistResult.data.data.records.length > 0
      ) {
        const _ary = [
          ...this.flag.searchArtist,
          ...searchArtistResult.data.data.records,
        ];
        this.flag.searchArtist = _ary;
        this.isSearchAuthor = true;
      } else {
        this.isSearchAuthor = false;
      }
    },
    // 获取登录用户
    async getLoginMember() {
      // 登录的钱包用户
      // let loginChain = await chain.getLoginInfo();
      // if (loginChain) {
      //   this.loginChain = loginChain;
      // } else {
      //   this.loginChain = null;
      // }
    },
    // 链接钱包
    loginChainShow() {
      this.openLoginChain = true;
      this.$nextTick(() => {
        this.$refs.loginChain.init();
      });
    },
    // 用户登录
    loginShow() {
      this.$router.push("/login");
    },
    listenLogin() {
      this.getLoginMember();
    },
    listenLoginChain() {
      this.getLoginMember();
    },
    async loginout() {
      this.$confirm("确定退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async () => {
        await this.$api.service.auth_logout();

        this.$message({
          message: "已安全退出",
          type: "info",
        });
        localStorage.removeItem("THEONE_MEMBER");
        localStorage.removeItem("authorization");
        localStorage.removeItem("THEONE_USER");

        setTimeout(() => {
          window.location.href = "/";
        }, 600);
      });
    },
    goPage(path) {
      this.$router.push(path);
    },
    goMarket(info) {
      this.$store.commit("setMarketRouteChange", true);
      if (window.location.pathname.search("/market") !== -1) {
        this.$router.push(
          `/market?id=${info.id}&key=${encodeURIComponent(info.name)}&type=${info.typeMarket}`
        );
      } else {
        /*        let url = this.$router.resolve({
          path: "/market/search",
          query: {
            key: name,
            id: id,
          },
        }); */
        window.open(
          `/market?id=${info.id}&key=${info.name}&type=${info.typeMarket}`
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.m-scrol {
  max-height: 200px;
  overflow-y: auto;
}
.v1-header {
  height: 80px;
}
.avatar {
  position: relative;
  top: 0;
  left: 0;
}
.icon-author {
  position: absolute;
  bottom: 0;
  width: 12px;
  height: 12px;
  right: -2px;
}
.large-author {
  width: 20px;
  height: 20px;
  right: -4px;
}
.v1-header-main {
  height: 80px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(87, 87, 87, 0.1);
  // filter: blur(10px);
  padding: 0 40px;
  display: flex;
  -webkit-box-pack: justify;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 9999;
  .v1-header-logo {
    margin-right: 59px;
    max-width: 221px;
    img {
      width: 100%;
    }
  }
  .v1-header-menu {
    display: flex;
    flex-direction: row;
    flex: 1;
    .v1-menu-item {
      margin-right: 50px;
      word-break: keep-all;

      a {
        color: rgba(0, 0, 0, 0.4);
        text-decoration: none;
      }
      &.active {
        a {
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }
  }
  .v1-header-search {
    position: relative;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    /*  width:700px;
    height:40px; */
    height: 80px;
    .search-wrap {
      background-color: #fff;
      position: absolute;
      transition: all 0.26s ease-out;
      z-index: 99;
      right: -550px;
      transform: translateX(0px) translateY(-50%);
      top: 50%;

      &.show {
        transform: translateX(-550px) translateY(-50%);
        .search {
          > div.input {
            display: block;
          }
          .close {
            display: block;
          }
        }
      }
      .search {
        display: flex;
        align-items: center;
        width: 600px;
        height: 100%;
        .icon {
          background: url("//static.theone.art/pc/images/search%402x.png")
            no-repeat;
          background-size: cover;
          width: 18px;
          height: 18px;
          margin-left: 24px;
        }
        > div.input {
          flex: 1;
          display: block;
        }
        input {
          height: 30px;
          margin-left: 10px;
          width: 100%;
        }
        .close {
          background: url("//static.theone.art/pc/images/search-close.png")
            no-repeat center;
          background-size: 18px 18px;
          width: 28px;
          height: 28px;
          display: block;
        }
        &-kong {
          font-size: 14px;
          padding-left: 50px;
          color: rgba($color: #000000, $alpha: 0.4);
          line-height: 32px;
          padding-bottom: 10px;
        }
      }
      .search-result {
        position: absolute;
        background: #ffffff;
        box-shadow: 0px 4px 16px 0px rgba(180, 180, 180, 0.18);
        border-radius: 0px 0px 4px 4px;
        width: 100%;
        z-index: 99;
        top: 40px;
        display: none;
        &.show {
          display: block;
          height: auto;
          max-height: 500px;
          overflow: auto;
        }
        > div {
          border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
          &:last-child {
            border: none;
          }
        }
        h1 {
          font-size: 12px;
          color: rgba($color: #000000, $alpha: 0.4);
          line-height: 35px;
          padding-left: 24px;
        }
        ul {
          li {
            line-height: 32px;
            font-size: 14px;
            padding-left: 50px;
            cursor: pointer;
            &:hover {
              background: #f5f5f5;
            }
          }
        }
      }
    }
  }
  .v1-header-right {
    justify-content: flex-end;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    .tool-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      top: 0;
      left: 0;
      z-index: 99;
      background-color: #fff;
      height: 80px;
      padding-right: 40px;
      margin-right: -40px;
    }
    .v1-header-line {
      height: 24px;
      width: 1px;
      background: #979797;
      margin: 0 24px 0 24px;
    }
    .login-btns {
      display: flex;

      .btn {
        cursor: pointer;
        position: relative;

        &.btn-chain {
          margin-right: 16px;
        }
        .no-login {
          background: url("//static.theone.art/pc/images/pic-home/login-chain.png")
            no-repeat center center;
          background-size: 30px 30px;
          width: 30px;
          height: 30px;
          &.login {
            background: url("//static.theone.art/pc/images/wallet-icon-login.png")
              no-repeat center center;
            background-size: 30px 30px;
          }
        }
        &.btn-phone {
          .no-login {
            background-image: url("//static.theone.art/pc/images/pic-home/login-phone.png");
          }
          .avatar {
            width: 30px;
            height: 30px;
            border-radius: 100%;
            background: url("//static.theone.art/pc/images/pic-home/login-chain.png")
              no-repeat center center;
            background-size: cover;
          }
          &:hover {
            .person-panel {
              visibility: visible;
            }
          }
        }

        .person-panel {
          visibility: hidden;
          width: 242px;
          right: 0px;
          position: absolute;
          top: 30px;
          z-index: 99;
          padding-top: 10px;
          .person-panel-inner {
            border-radius: 0 0 4px 4px;
            height: 187px;
            background: rgba($color: #ffffff, $alpha: 0.9);
            box-shadow: 0px 2px 12px 0px rgba(120, 120, 120, 0.16);
            .info {
              padding: 29px 10px 12px 16px;
              border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
              display: flex;
              // align-items: center;
              justify-content: space-between;
              .avatar {
                width: 50px;
                height: 50px;
                margin-right: 8px;
                border-radius: 100%;
              }
              .name {
                flex: 1;
                display: flex;
                // align-items: left;
                flex-direction: column;
                h1 {
                  font-size: 14px;
                  color: #000000;
                  line-height: 20px;
                  margin-bottom: 6px;
                }
                p {
                  font-size: 14px;
                  color: rgba($color: #000000, $alpha: 0.7);
                  line-height: 20px;
                }
              }
              .exit {
                color: rgba($color: #000000, $alpha: 0.4);
                font-size: 12px;
                cursor: pointer;
              }
            }
            .operate {
              padding: 14px 30px 0px;
              position: relative;
              .swiper-button-prev,
              .swiper-button-next {
                top: 55px;
                width: 14px;
                height: 14px;
                background: url("//static.theone.art/pc/images/pic-home/header-operate-back.png")
                  no-repeat center center;
                background-size: 14px 14px;
              }
              .swiper-button-next {
                background-image: url("//static.theone.art/pc/images/pic-home/header-operate-next.png");
              }
              .operate-item {
                .icon {
                  width: 46px;
                  height: 46px;
                  background: no-repeat center center
                    rgba($color: #000000, $alpha: 0.03);
                  background-size: 24px 24px;
                  border-radius: 100%;
                  margin-bottom: 6px;
                  @for $i from 1 through 6 {
                    &.icon#{$i} {
                      background-image: url("~@/assets/1.0/images/header-operate-icon#{$i}.png");
                    }
                  }
                  &.letter-icon {
                    background-image: url("//static.theone.art/pc/images/pic-home/letter-icon.png");
                  }
                }
                h1 {
                  font-size: 12px;
                  color: rgba($color: #000000, $alpha: 0.7);
                  line-height: 17px;
                  white-space: nowrap;
                  text-align: center;
                }
              }
            }
          }
          &::after {
            content: "";
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 20px solid #fff;
            position: absolute;
            right: 0;
            top: 0;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-popover.indexmenu-popover {
  background: rgba($color: #fff, $alpha: 0.9);
  box-shadow: 0px 2px 12px 0px rgba(120, 120, 120, 0.16);
  font-size: 12px;
  font-weight: 400;
  color: rgba($color: #000000, $alpha: 0.4);
  text-align: center;
  padding: 0;
  .menu-list {
    width: 100%;
    > div {
      height: 42px;
      line-height: 42px;
      cursor: pointer;
      a {
        color: rgba($color: #000000, $alpha: 0.4);
      }
      &:hover {
        background: rgba($color: #000000, $alpha: 0.07);
      }
    }
  }
}
</style>