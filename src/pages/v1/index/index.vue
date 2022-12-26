<template>
  <div class="v1-page-index">
    <index-notice></index-notice>
    <div class="mode-mobile">
      <div class="v1-page-index-mhead grayscale">
        <div class="logo"></div>
        <div class="btn"><open-app mode="btn"></open-app></div>
      </div>
      <div class="v1-page-index-search grayscale">
        <el-input
          type="text"
          @focus.stop="showSearchFixed = true"
          @click.stop="showSearchFixed = true"
        ></el-input>
        <div class="search-icon"></div>
        <div>
          <div
            class="avatar"
            v-lazy:background-image="
              user_info.avatar || '/static/img/avatars.svg'
            "
            v-if="user_info && user_info.userUuid"
            @click="goPage('/mine')"
          ></div>
          <div v-else class="no-login avatar" @click="onGoLogin"></div>
        </div>
      </div>
    </div>
    <banner />
    <div class="margin-insert content-width">
      <section class="active-section-wrap section-margin">
        <div class="block phone-hide">
          <active-date></active-date>
        </div>
        <div class="block">
          <index-news-active></index-news-active>
        </div>
      </section>
    </div>

    <div class="pc-hide">
      <section class="v1-page-index-mobile grayscale">
        <div class="market-date-wrap">
          <div class="active-wrap" @click="goActiveDate">
            <img
              class="active-date-1"
              src="//static.theone.art/pc/active-date/red-icon.gif"
            />
          </div>

          <div>
            <div class="market">
              <div style="margin-bottom: ">
                <router-link to="/market?type=derive"
                  ><img
                    src="//static.theone.art/pc/active-date/market-2.png"
                /></router-link>
              </div>
              <div>
                <router-link to="/market?type=copyright"
                  ><img
                    src="//static.theone.art/pc/active-date/market-1.png"
                /></router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!--  衍生品推荐 -->
    <section class="content-width section-margin yan-margin">
      <derive></derive>
    </section>
    <div class="block-title ban-block-title">版权品</div>
    <div class="mode-PC">
      <div class="v1-page-content">
        <swiper ref="topic" @sendTopicResult="getTopicResult" />
        <index-pc-artist :artistResult="artistResult" />

        <div class="panel bg1" v-if="newsAResult && newsAResult.length > 0">
          <div class="title white">{{ newsAResult[0].name }}</div>
          <div class="text">{{ newsAResult[0].summarize }}</div>
        </div>

        <div class="panel bg2" v-if="newsBResult">
          <div class="title">数字艺术藏品的优势</div>
          <div class="content-list">
            <div
              class="content-item"
              v-for="(item, index) in newsBResult"
              :key="index"
            >
              <div :class="'images icon' + (index + 1)"></div>
              <div class="sub">{{ item.name }}</div>
              <div class="sub-son">{{ item.summarize }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mode-mobile">
      <div class="search-fixed" v-if="showSearchFixed">
        <div class="v1-page-index-search">
          <el-input
            v-model="searchContent"
            style="width: 88%"
            type="text"
            v-focus
            @input="onSearchKey"
            @keydown.enter="onSearchKey"
          ></el-input>
          <div class="search-icon"></div>
          <div
            class="cancel-search"
            @click.stop="
              showSearchFixed = false;
              onSearch();
            "
          >
            取消
          </div>
        </div>
        <div :class="{ 'search-result': true, show: flagMobile.searchResult }">
          <div>
            <h1>作品</h1>
            <ul
              v-if="flagMobile.searchWorks && flagMobile.searchWorks.length > 0"
              class="mobile-scroll"
              @scroll="mSearchScroll($event)"
            >
              <li
                v-for="(item, index) in flagMobile.searchWorks"
                :key="index"
                @click="goMarket(item.name, item.id, item.typeMarket)"
              >
                {{ item.name }}
              </li>
            </ul>
            <div class="search-result-kong" v-else>暂无该作品信息</div>
          </div>
          <div>
            <h1>作家</h1>
            <ul
              v-if="
                flagMobile.searchArtist && flagMobile.searchArtist.length > 0
              "
              class="mobile-scroll"
              @scroll="mobilSearchAuthorScroll($event)"
            >
              <li
                v-for="(item, index) in flagMobile.searchArtist"
                :key="index"
                @click="
                  $common.goPage(`/user/${item.uuid}`);
                  onSearch();
                "
              >
                {{ item.stageName }}
              </li>
            </ul>
            <div class="search-result-kong" v-else>暂无该作家信息</div>
          </div>
        </div>
      </div>
      <div class="v1-page-index-mobile grayscale">
        <!--     <div class="market-date-wrap">
          <div class="active-wrap" @click="goActiveDate">
            <img
              class="active-date-1"
              src="//static.theone.art/pc/active-date/red-icon.gif"
            />
          </div>

          <div>
            <div class="market">
              <div style="margin-bottom: ">
                <router-link to="/market?type=derive"
                  ><img
                    src="//static.theone.art/pc/active-date/market-2.png"
                /></router-link>
              </div>
              <div>
                <router-link to="/market?type=copyright"
                  ><img
                    src="//static.theone.art/pc/active-date/market-1.png"
                /></router-link>
              </div>
            </div>
          </div>
        </div> -->

        <div class="tabs-panel">
          <!-- 精选 系列 -->
          <status-template
            :list="topicListResult"
            api="/market/api/saleRecord/listTopic"
            :init="topicList"
          >
            <div v-for="(item, index) in topicListResult" :key="index">
              <div class="choiceness">
                <div class="choiceness-lf">{{ item.topic.name }}</div>
                <div class="choiceness-rg" @click="$common.goPage(`/market`)">
                  查看更多
                </div>
              </div>
              <div class="v1-goods-list">
                <div
                  class="v1-goods-wrap"
                  v-for="(mitem, mindex) in item.list"
                  :key="mindex"
                  v-show="mindex < 4"
                >
                  <goods-frame
                    class="v1-goods"
                    :goods-info="mitem"
                    @listenLike="listenLikeGoods"
                    :index="mindex"
                    :params="{ key: 2, dataType: 2, index2: index }"
                    :isShowPreview="true"
                    @listenCoverClick="listenCoverClick"
                  >
                  </goods-frame>
                </div>
              </div>
            </div>
            <div class="btn-item" @click="$common.goPage(`/market`)">
              搜索更多画作
            </div>
          </status-template>
          <!-- 人气艺术家 -->
          <status-template
            :list="artistResult"
            api="/market/api/author/list"
            :init="artistList"
          >
            <div class="pic-list">
              <div
                class="pic-padding"
                v-for="(item, index) in artistResult"
                :key="index"
              >
                <div class="pic-item">
                  <div
                    class="info"
                    @click.stop="$common.goPage(`/user/${item.uuid}`)"
                  >
                    <div>
                      <div
                        class="avatar bg-img"
                        v-lazy:background-image="
                          `${
                            item.avatar
                              ? item.avatar
                              : '/static/img/avatars.svg'
                          }`
                        "
                      ></div>
                      <div class="name">
                        <h3 class="hidden-more">
                          {{ item.nickname ? item.nickname : "-" }}
                        </h3>
                        <span>
                          {{
                            $common.formatFansNumber(item.passiveNum) || 0
                          }}粉丝
                        </span>
                      </div>
                      <div
                        :class="['btn-gz', item.isPassive == 1 ? 'active' : '']"
                        @click.stop="
                          focusArtist(
                            item.uuid,
                            item.nickname,
                            item.isPassive,
                            index
                          )
                        "
                      >
                        <i :class="[item.isPassive == 1 ? 'active' : '']"></i>
                        {{ item.isPassive == 1 ? "已关注" : "关注" }}
                      </div>
                    </div>
                    <div class="hidden-more">{{ item.introduce }}</div>
                  </div>
                  <div
                    class="img"
                    @click.stop="$common.goPage(`/user/${item.uuid}`)"
                  >
                    <preview-img
                      :cover="item.commodityVO && item.commodityVO.cover"
                      :info="{
                        ...item,
                        commodity: item.commodityVO,
                      }"
                    ></preview-img>

                    <!--          <div
                      class="imgurl"
                      v-lazy:background-image="
                        `${
                          item.commodityVO
                            ? item.commodityVO.cover
                            : 'https://source.theone.art/watermarkResize/8c6269d60edafe3a31785fa7bdf31563/4346296d6f2c3b4b3c4daa0d5abc23ca-16362781979580.9.jpg'
                        }`
                      "
                      @click.stop="
                        goMarket(
                          item.commodityVO.name,
                          item.commodityVO.uuid,
                          item.commodityVO.typeMarket
                        )
                      "
                    >
                      <div
                        v-if="item.commodityVO"
                        class="view"
                        @click.stop="
                          $refs['goodsDetail'].open(
                            item.commodityVO
                              ? item.commodityVO.cover
                              : 'https://source.theone.art/watermarkResize/8c6269d60edafe3a31785fa7bdf31563/4346296d6f2c3b4b3c4daa0d5abc23ca-16362781979580.9.jpg'
                          )
                        "
                      ></div>
                    </div> -->
                  </div>
                  <div
                    class="content"
                    v-if="item.commodityVO"
                    @click.stop="
                      goMarket(
                        item.commodityVO.name,
                        item.commodityVO.uuid,
                        tem.commodityVO.typeMarket
                      )
                    "
                  >
                    <h1 class="hidden">
                      {{ item.commodityVO ? item.commodityVO.name : "-" }}
                    </h1>
                    <span
                      :class="[
                        item.commodityVO && item.commodityVO.isLike == 1
                          ? 'like-active'
                          : '',
                      ]"
                      @click.stop="
                        likeGoods(
                          item.commodityVO.uuid,
                          item.commodityVO.isLike,
                          item.commodityVO.name,
                          1,
                          index,
                          1
                        )
                      "
                    >
                      {{
                        item.commodityVO
                          ? $common.formatFansNumber(
                              item.commodityVO.amountLike
                            )
                          : 0
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-item" @click="$common.goPage(`/artist/`)">
              查看更多艺术家
            </div>
          </status-template>
          <!--     <van-tabs v-model="activeTab" swipeable>
            <van-tab title="精选系列" :key="0">
       
            </van-tab>
            <van-tab title="人气艺术家" :key="1">
    
            </van-tab>
          </van-tabs> -->
        </div>
      </div>
      <pageMobileFooter />
    </div>
    <goodsDetail ref="goodsDetail" />
    <open-app mode="fixed"></open-app>
  </div>
</template>
<script>
window.d = window.d || "4opkstHO2Kj5utjZggszg==";
import banner from "@/components/v1/index/banner";
import swiper from "@/components/v1/index/swiper";
import pageMobileFooter from "@/components/v1/layout/mobileFooter";
import goodsDetail from "@/components/v1/modalfor3d/index";
import IndexPcArtist from "./component/index-pc-artist.vue";
import IndexNotice from "./component/index-notice.vue";
import IndexNewsActive from "./component/index-news-active.vue";
import ActiveDate from "./component/active-date.vue";
import Derive from "./component/derive.vue";
export default {
  components: {
    banner,
    swiper,
    pageMobileFooter,
    goodsDetail,
    IndexPcArtist,
    IndexNotice,
    IndexNewsActive,
    ActiveDate,
    Derive,
  },
  data() {
    return {
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
      activeTab: 0,
      searchContent: "",
      newsAResult: null,
      newsBResult: null,
      artistResult: [],
      topicListResult: null,
      showSearchFixed: false,
      flagMobile: {
        search: false, //搜索是否展开
        searchResult: false, //搜索是否有结果
        searchArtist: [], //作家搜索结果
        searchWorks: [], //作品搜索结果
      },
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector("input").focus();
      },
    },
  },

  created() {
    this.pageInit();
    this.artistList();
	this.$sensors.track('main_pageview', {
		module_name: "首页"
	});
  },
  computed: {
    user_info() {
      return this.$store.state.user_info;
    },
  },
  methods: {
    goActiveDate() {
      this.$router.push("/active_date");
    },
    listenCoverClick(info) {
      this.$common.goPage(`/goods/${info.id}`);
    },
    mobilSearchAuthorScroll(e) {
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
    async getSearchAuthorList() {
      let searchArtistResult = await this.$api.service.author_list(
        this.searchAuthorParams
      );
      if (
        searchArtistResult.data.data.records &&
        searchArtistResult.data.data.records.length > 0
      ) {
        const _ary = [
          ...this.flagMobile.searchArtist,
          ...searchArtistResult.data.data.records,
        ];
        this.flagMobile.searchArtist = _ary;
        this.isSearchAuthor = true;
      } else {
        this.isSearchAuthor = false;
      }
    },
    mSearchScroll(e) {
      const el = e.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight && this.isSearch) {
        console.log("到底了");
        this.isSearch = false;
        this.searchOption.pageCount++;
        this.getSearchList();
        return false;
      }
    },
    async getSearchList() {
      let searchWorksResult = await this.$api.service.commodity_search(
        this.searchOption
      );
      const res = searchWorksResult.data;
      if (res.code == 200 && res.data.records.length > 0) {
        const _ary = [...this.flagMobile.searchWorks, ...res.data.records];
        this.flagMobile.searchWorks = this.$common.uniqueAry(_ary, "id");
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    },
    goPage(url) {
      this.$router.push(url);
    },
    onGoLogin() {
      this.$router.push("/login");
    },
    onSearch() {
      let timer = setTimeout(() => {
        this.flagMobile.searchResult = false;
        this.flagMobile.search = !this.flagMobile.search;
        this.searchContent = null;
        clearTimeout(timer);
      }, 300);
    },
    async onSearchKey(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getSearchInfo(e);
      }, 300);
    },
    getSearchInfo(name) {
      this.flagMobile.searchResult = true;
      this.searchOption.name = name;
      this.searchOption.pageCount = 1;
      this.searchAuthorParams.pageCount = 1;
      this.searchAuthorParams.name = name;
      this.flagMobile.searchWorks = [];
      this.flagMobile.searchArtist = [];
      this.getSearchList();
      this.getSearchAuthorList();
    },
    async pageInit() {
      if (this.$common.isMobile()) {
        return;
      }
      this.newsAResult = await this.newsList({
        location: "home_A",
        pageCount: 1,
        pageSize: 20,
      });

      this.newsBResult = await this.newsList({
        location: "home_B",
        pageCount: 1,
        pageSize: 20,
      });
    },
    async newsList(param) {
      if (this.$common.isMobile()) {
        return;
      }
      let result = await this.$api.service.news_list(param);
      return result.data.data.records;
    },
    //艺术家列表
    async artistList() {
      let result = await this.$api.service.author_list({
        pageCount: 1,
        pageSize: 4,
      });
      if (result && result.data.code == 200) {
        this.artistResult = result.data.data.records;
      }

      this.$previewRefresh();
    },
    //关注与取消关注
    async focusArtist(id, name, isPassive, idx) {
      let result = null;
      if (isPassive == 0) {
        result = await this.$api.service.userfriend_operation({
          type: 1,
          userUuid: id,
        });
        if (result.data.code == 200) {
          this.$message.success("关注成功");
          const list = JSON.parse(JSON.stringify(this.artistResult));
          list[idx].isPassive = 1;
          this.artistResult = list;
          //this.artistList();
        }
      } else {
        result = await this.$api.service.userfriend_operation({
          type: 2,
          userUuid: id,
        });
        if (result.data.code == 200) {
          this.$message.success("取消关注成功");
          const list = JSON.parse(JSON.stringify(this.artistResult));
          list[idx].isPassive = 0;
          this.artistResult = list;
        }
      }
    },
    topicList() {
      this.$refs.topic.topicList();
    },
    getTopicResult(option) {
      this.topicListResult = option;
    },
    goMarket(name, id, type) {
      if (name && id) {
        window.open(
          `/market?id=${id}&key=${encodeURIComponent(name)}&type=${type}`
        );
      } else {
        this.$message.warning("缺少参数");
      }
    },
    //喜欢及取消喜欢
    listenLikeGoods(info) {
      const { id, like, key, index, dataType, index2 } = info;
      this.likeGoods(
        id,
        like,
        info.commodity.name,
        key,
        index,
        dataType,
        index2
      );
    },
    async likeGoods(id, like, name, key, index, dataType, listId) {
      if (like == 1 || like == 0) {
        like = like == 1 ? true : false;
      }
      let collectParam = {
        dataId: id,
        type: 2,
        dataType: dataType,
      };
      if (like) {
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.$message.success("取消成功");
          if (key == 1) {
            this.artistResult[index].commodityVO.isLike = 0;
            let num = this.artistResult[index].commodityVO.amountLike;
            this.artistResult[index].commodityVO.amountLike--;
          } else {
            this.$refs.topic.likeGoods(id, index, false, listId);
          }
        } else if (result.data.code !== 401) {
          this.$message.error(result.data.message);
        }
      } else {
        collectParam.type = 1;
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.$message.success("成功");
          if (key == 1) {
            this.artistResult[index].commodityVO.isLike = 1;
            this.artistResult[index].commodityVO.amountLike++;
          } else {
            this.$refs.topic.likeGoods(id, index, true, listId);
          }
        } else if (result.data.code !== 401) {
          this.$message.error(result.data.message);
        }
      }
    },
    showCover(cover) {
      this.$refs["goodsDetail"].open(
        cover
          ? cover
          : "https://source.theone.art/watermarkResize/8c6269d60edafe3a31785fa7bdf31563/4346296d6f2c3b4b3c4daa0d5abc23ca-16362781979580.9.jpg"
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/index/index.scss";
@import "~@/assets/1.0/scss/artistList.scss";
.pc-hide {
  display: none;
}
.active-section-wrap {
  display: flex;
  margin: 80px -8px;
  .block {
    flex: 1;
    padding: 8px;
  }
  @media screen and (max-width: 540px) {
    display: block;
    margin: 0;
    .block {
      padding: 0.32rem;
    }
    .phone-hide {
      display: none;
    }
  }
}
.mobile-scroll {
  max-height: 30vh;
  overflow-y: auto;
}
.v1-goods-cover {
  position: relative;
  .img-wrap {
    position: absolute;
  }
}
.avatar {
  width: 0.6rem;
  height: 0.6rem;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 100px;
  margin-left: 0.15rem;
}
.no-login {
  background-image: url("//static.theone.art/pc/images/pic-home/login-phone.png");
}
.v1-page-index {
  .v1-page-index-mhead {
    height: 1.08rem;
    background: #ffffff;
    box-shadow: 0 0.04rem 0.08rem 0 rgba(131, 131, 131, 0.1);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    .logo {
      background: url("//static.theone.art/pc/images/pic-home/logoindex%402x.png")
        center center no-repeat;
      width: 100%;
      height: 100%;
      background-size: 3.48rem 0.52rem;
      margin-top: 0.08rem;
    }
    .btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0.32rem;
    }
  }
  .v1-page-index-search {
    margin: 0 0.32rem;
    margin-top: 1.4rem;
    margin-bottom: 0.48rem;
    position: relative;
    .el-input {
      ::v-deep .el-input__inner {
        height: 0.72rem;
        border-radius: 0.36rem;
        border: 0.02rem solid rgba($color: #000000, $alpha: 0.2);
        padding-left: 1rem;
      }
    }
    .search-icon {
      background: url("//static.theone.art/pc/images/searchicon%402x.png")
        no-repeat;
      width: 0.36rem;
      height: 0.36rem;
      background-size: 0.36rem 0.36rem;
      position: absolute;
      top: 0.18rem;
      left: 0.32rem;
    }
  }
  .v1-goods-line h1 {
    display: inline-block;
  }
  @media screen and (min-width: 541px) {
    &::before {
      content: "";
      background: url("//static.theone.art/pc/images/pic-home/pic_home_bj2%402x.png")
        no-repeat;
      width: 135px;
      height: 291px;
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      top: 1668px;
      z-index: 9;
    }
    &::after {
      content: "";
      background: url("//static.theone.art/pc/images/pic-home/pic_home_bj1%402x.png")
        no-repeat;
      width: 110px;
      height: 245px;
      background-size: 100% 100%;
      position: absolute;
      right: 0;
      top: 655px;
      z-index: 9;
    }
  }

  .v1-page-content {
    z-index: 99;
    position: relative;
    min-height: 1500px;

    .panel {
      .title {
        font-size: 20px;
        font-weight: bold;
        color: #e61f1a;
        position: relative;
        text-align: center;
        &:before {
          content: "";
          background: url("//static.theone.art/pc/images/pic_home_zuo%402x.png")
            no-repeat;
          width: 77px;
          height: 7px;
          background-size: 100% auto;
          display: inline-block;
          vertical-align: middle;
          margin: -4px 16px 0 0;
        }
        &:after {
          content: "";
          background: url("//static.theone.art/pc/images/pic-home/pic_home_you%402x.png")
            no-repeat;
          width: 77px;
          height: 7px;
          background-size: 100% auto;
          display: inline-block;
          vertical-align: middle;
          margin: -4px 0 0 16px;
        }
      }
      .btn-item {
        width: 200px;
        height: 46px;
        border-radius: 23px;
        border: 1px solid #e61f1a;
        text-align: center;
        line-height: 46px;
        font-size: 14px;
        color: #e61f1a;
        margin: 0 auto;
        cursor: pointer;
        &:after {
          content: "";
          background: url("//static.theone.art/pc/images/arrowright3%402x.png")
            no-repeat;
          width: 24px;
          height: 24px;
          background-size: 100% auto;
          display: inline-block;
          vertical-align: middle;
          margin: -2px 0 0 8px;
        }
      }
      &.bg1 {
        width: 100%;
        height: 286px;
        background: #1e1d1d;
        margin-top: 160px;
        padding-top: 68px;
        position: relative;
        .white {
          font-size: 20px;
          font-weight: bold;
          color: #ffffff;
          &:before {
            background: url("//static.theone.art/pc/images/pic-home/pic_home_you1%402x.png")
              no-repeat;
            background-size: 100% auto;
          }
          &::after {
            background: url("//static.theone.art/pc/images/pic_home_zuo1%402x.png")
              no-repeat;
            background-size: 100% auto;
          }
        }
        .text {
          font-size: 14px;
          color: rgba($color: #fff, $alpha: 0.8);
          line-height: 28px;
          max-width: 1029px;
          margin: 0 auto;
          margin-top: 49px;
        }
        &:before {
          content: "";
          background: url("//static.theone.art/pc/images/pic-home/pic_home_bj3%402x.png");
          width: 211px;
          height: 201px;
          background-size: 100% auto;
          position: absolute;
          left: 0;
          top: 0;
        }
        &::after {
          content: "";
          background: url("//static.theone.art/pc/images/pic-home/pic_home_bj4%402x.png");
          width: 463px;
          height: 286px;
          background-size: 100% auto;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      &.bg2 {
        max-width: 1190px;
        margin: 0 auto;
        padding: 160px 0 152px;
        .content-list {
          // max-width: 1170px;
          display: flex;
          flex-wrap: wrap;
          .content-item {
            width: 25%;
            padding: 0 28px;
            text-align: center;
            .sub {
              font-size: 16px;
              font-family: MicrosoftYaHei;
              color: #000000;
              line-height: 20px;
              margin-top: 32px;
              margin-bottom: 16px;
            }
            .sub-son {
              font-size: 12px;
              font-family: MicrosoftYaHei;
              color: rgba($color: #000000, $alpha: 0.4);
              line-height: 20px;
            }
            .images {
              background: url("//static.theone.art/pc/images/pic-home/pic_home_pei1%402x.png")
                center center no-repeat;
              width: 84px;
              height: 84px;
              margin: 0 auto;
              margin-top: 90px;
              background-size: 100% 100%;
              @for $i from 2 to 5 {
                &.icon#{$i} {
                  background: url("../../../assets/1.0/images/pic_home_pei#{$i}@2x.png")
                    center
                    center
                    no-repeat;
                  background-size: 100% 100%;
                }
              }
            }
          }
          @media screen and (min-width: 541px) and (max-width: 960px) {
            .content-item {
              width: 50%;
            }
          }
          @media screen and (max-width: 540px) {
            .content-item {
              width: 100%;
            }
            ::v-deep .van-tabs__line {
              color: #e61f1a;
            }
          }
        }
      }
    }
  }
  .v1-page-index-mobile {
    margin: 0 0 0.32rem;
    padding-bottom: 0.2rem;
    background-color: #fff;
    @media screen and (max-width: 540px) {
      background-color: transparent;
    }
    .market-date-wrap {
      display: none;
      display: flex;
      padding: 0 0.32rem;
      margin-top: -0.32rem;
      .active-wrap {
        position: relative;
        top: 0;
        left: 0;
        background-image: url("//static.theone.art/pc/active-date/active-bg.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 0.2rem;
        img {
          position: absolute;
          display: block;
        }
        .active-date-1 {
          right: 0rem;
          bottom: 0.6rem;
          width: 1.7rem;
        }
      }
      .market {
        img {
          display: block;
          width: 100%;
        }
      }
      > div {
        flex: 1;
      }
    }

    .tabs-panel {
      margin-top: -0.32rem;
      background: #fff;
      padding-bottom: 0.52rem;
      ::v-deep .van-tabs__line {
        width: 0.52rem;
        height: 0.04rem;
        background: #e61f1a;
        border-radius: 0.02rem;
      }
    }
    .btn-item {
      width: 3.28rem;
      height: 0.72rem;
      border-radius: 0.36rem;
      border: 0.02rem solid #e61f1a;
      text-align: center;
      line-height: 0.72rem;
      font-size: 0.28rem;
      color: #e61f1a;
      margin: 0 auto;
      &:after {
        content: "";
        background: url("//static.theone.art/pc/images/arrowright3%402x.png")
          no-repeat;
        width: 0.48rem;
        height: 0.48rem;
        background-size: 100% auto;
        display: inline-block;
        vertical-align: middle;
        margin: -2px 0 0 8px;
      }
    }
  }
}
.choiceness {
  margin-top: 15px;
  padding: 13px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0.32rem;
  &-lf {
    font-size: 20px;
    color: #e61f1a;
    background: url("//static.theone.art/pc/images/yh%402x.png") no-repeat left
      center;
    background-size: 24px 24px;
    padding-left: 30px;
  }
  &-rg {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}
.search-fixed {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 1.4rem;
  z-index: 998;
}
.cancel-search {
  font-size: 0.3rem;
}
.v1-page-index-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.v1-goods-line {
  .sold {
    &::before {
      display: inline-block;
      content: "";
      background: url("//static.theone.art/pc/images/sold%402x.png") no-repeat;
      width: 38px;
      height: 20px;
      background-size: 38px 20px;
    }
  }
}
.search-result {
  position: absolute;
  background: #ffffff;
  box-shadow: 0px 4px 16px 0px rgba(180, 180, 180, 0.18);
  border-radius: 0px 0px 4px 4px;
  width: 100%;
  z-index: 99;
  top: 200px;
  display: none;
  &.show {
    display: block;
    height: 70%;
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
  &-kong {
    font-size: 14px;
    padding-left: 50px;
    color: rgba($color: #000000, $alpha: 0.4);
    line-height: 32px;
  }
}
@media screen and (max-width: 540px) {
  .pc-hide {
    display: block;
  }
  .ban-block-title {
    margin-bottom: 0;
    padding-bottom: 0.48rem;
    background-color: #fff;
    padding-top: 0.32rem;
  }
  .yan-margin {
    margin-bottom: 0.32rem;
  }
}
</style>
