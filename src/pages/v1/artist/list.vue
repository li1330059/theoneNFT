<template>
  <div class="page-artist-list" style>
    <div class="mode-mobile">
      <m-header :title="'艺术家'" />
    </div>
    <div class="panel">
      <div class="v1-module-title">艺术家</div>
      <div class="loading" v-if="loading">
        <loading></loading>
      </div>
      <empty v-else-if="showEmpty"></empty>
      <div v-else>
        <div ref="artistList" class="pic-list">
          <div
            class="pic-padding pointer"
            v-for="(item, index) in artistListArr"
            :key="index"
          >
            <div class="pic-item">
              <div
                class="info"
                @click.stop="goUser(item.uuid)"
              >
                <div>
                  <div
                    class="avatar"
                    :style="`background: url(${
                      item.avatar ? item.avatar : '/static/img/avatars.svg'
                    }) no-repeat center;background-size: cover;`"
                  ></div>
                  <div class="name">
                    <h3 class="hidden-one">{{ item.nickname || "-" }}</h3>
                    <span
                      >{{
                        $common.formatFansNumber(
                          item.passiveNum && item.passiveNum >= 0
                            ? item.passiveNum
                            : 0
                        )
                      }}粉丝</span
                    >
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
                <div class="hidden-more">{{ item.remarks }}</div>
              </div>
              <div
                class="img"
                @click.stop="goUser(item.uuid)"
              >
                <preview-img
                  :cover="item.commodityVO && item.commodityVO.cover"
                  :info="{
                    ...item,
                    commodity: item.commodityVO,
                  }"
                ></preview-img>
                <!--      <div
                  class="imgurl"
                  v-lazy:background-image="
                    `${
                      item.commodityVO
                        ? item.commodityVO.cover
                        : 'https://source.theone.art/watermarkResize/8c6269d60edafe3a31785fa7bdf31563/4346296d6f2c3b4b3c4daa0d5abc23ca-16362781979580.9.jpg'
                    }`
                  "
                  @click.stop="
                    goMarket(item.commodityVO.name, item.commodityVO.uuid,item.commodityVO.typeMarket)
                  "
                ></div> -->
              </div>
              <div
                class="content"
                v-if="item.commodityVO"
                @click.stop="
                  goMarket(
                    item.commodityVO.name,
                    item.commodityVO.uuid,
                    item.commodityVO.typeMarket
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
                      index
                    )
                  "
                >
                  {{
                    item.commodityVO
                      ? $common.formatFansNumber(item.commodityVO.amountLike)
                      : 0
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="artist-loading" v-show="showButtomLoading">加载中...</div>
      </div>
    </div>
    <goodsDetail ref="goodsDetail" />
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import mHeader from "@/components/v1/layout/mobileHeader";
import goodsDetail from "@/components/v1/modalfor3d/index";
export default {
  components: { empty, loading, mHeader, goodsDetail },
  data() {
    return {
      isPc: false,
      loading: true, //加载
      showEmpty: false, //空数据
      artistListParam: {
        pageCount: 1,
        pageSize: 20,
      },
      artistListResult: null, //艺术家列表
      showButtomLoading: false, //显示加载更多文本
      loadingMore: true, //是否加载更多
      artistListArr: null,
    };
  },
  created() {
    this.isPc = !this.$common.isMobile();
    window.addEventListener("scroll", this.scrollToTop);
    this.pageInit();
	this.$sensors.track('main_pageview', {
		module_name: "艺术家"
	});
  },
  methods: {
	goUser(uuid){
		this.$sensors.track('artist_click', {
			module_name: "名片点击"
		});
		this.$common.goPage(`/user/${uuid}`, '_blank')
	},
    scrollToTop() {
      if (this.$refs.artistList) {
        var scrollTop = window.pageYOffset;
        var fullHeight = this.$refs.artistList.offsetHeight
          ? this.$refs.artistList.offsetHeight
          : document.documentElement.clientHeight;
        if (fullHeight - scrollTop <= 1000 && this.loadingMore) {
          this.loadingMore = false;
          this.artistListParam.pageCount++;
          if (this.artistListParam.pageCount <= this.artistListResult.pages) {
            this.scrollGetArtistList();
          }
        }
      }
    },
    //页面初始化
    async pageInit() {
      try {
        this.loading = true;
        let result = await this.$api.service.author_list(this.artistListParam);
        this.artistListResult = result.data.data;
        this.artistListArr = result.data.data.records;
        if (!result.data.data) {
          this.$router.push({
            path: "/404",
          });
        }
        this.showEmpty = !this.artistListArr.length > 0;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async scrollGetArtistList() {
      this.showButtomLoading = true;
      let result = await this.$api.service.author_list(this.artistListParam);
      this.artistListResult = result.data.data;
      this.artistListArr.push.apply(
        this.artistListArr,
        result.data.data.records
      );
      this.showButtomLoading = false;
      let timer = setTimeout(() => {
        this.loadingMore = true;
      }, 500);
    },
    //关注与取消关注
    async focusArtist(id, name, isPassive, index) {
      console.log(index);
      let result = null;
      if (isPassive == 0) {
		  this.$sensors.track('artist_click', {
		  	cards_attention: "关注"
		  });
        result = await this.$api.service.userfriend_operation({
          type: 1,
          userUuid: id,
        });
        if (result.data.code == 200) {
          this.$message.success("关注成功");
          this.artistListArr[index].isPassive = 1;
          this.artistListArr[index].passiveNum++;
        }
      } else {
		  this.$sensors.track('artist_click', {
		  	cards_attention: "取消"
		  });
        result = await this.$api.service.userfriend_operation({
          type: 2,
          userUuid: id,
        });
        if (result.data.code == 200) {
          this.$message.success("取消成功");
          this.artistListArr[index].isPassive = 0;
          this.artistListArr[index].passiveNum--;
        }
      }
    },
    handleCurrentChange(val) {
      this.artistListParam.pageCount = val;
      this.pageInit();
    },
    //喜欢及取消喜欢
    async likeGoods(id, like, name, index) {
      console.log(`下标`, index);
      like = like == 1 ? true : false;
      let message1 = `您确定取消喜欢【${name}】吗?`;
      let message2 = `您已成功取消对【${name}】的喜欢！`;
      let collectParam = {
        dataId: id,
        type: 2,
        dataType: 1,
      };
      if (like) {
		  this.$sensors.track('artist_click', {
		  	artists_save: "取消"
		  });
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.$message.success(message2);
          this.artistListArr[index].commodityVO.isLike = 0;
          this.artistListArr[index].commodityVO.amountLike--;
        } else if (result.data.code !== 401) {
          this.$message.error("失败,请稍后重试");
        }
      } else {
		  this.$sensors.track('artist_click', {
		  	artists_save: "收藏"
		  });
        collectParam.type = 1;
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.$message.success("成功");
          this.artistListArr[index].commodityVO.isLike = 1;
          this.artistListArr[index].commodityVO.amountLike++;
        } else if (result.data.code !== 401) {
          this.$message.error("失败,请稍后重试");
        }
      }
    },
    goMarket(name, id, type) {
      window.open(`/market?key=${name}&id=${id}&type=${type}`);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/1.0/scss/artistList.scss";

.loading {
  height: 500px;
}
.page-artist-list {
  background: url("//static.theone.art/pc/images/artist-bg%402x.png") no-repeat;
  background-size: 100% auto;
  padding: 80px 0;
  box-sizing: border-box;
}
.v1-pagination {
  max-width: 1190px;
  margin: 0 auto;
}
.artist-loading {
  font-size: 14px;
  color: #666;
  text-align: center;
  padding: 20px 0 40px;
}
@media screen and (max-width: 540px) {
  .v1-module-title {
    display: none;
  }
  .pic-list {
    margin-top: 0px;
  }
}
</style>
