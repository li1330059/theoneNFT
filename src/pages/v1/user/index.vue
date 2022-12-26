<template>
  <div class="page-user-index">
    <div class="mode-mobile">
      <m-header :title="headTitle" />
    </div>
    <!--  banner-start -->
    <swiper
      v-if="authorBanner && authorBanner.length > 0"
      :class="[
        'swiper-wrapper',
        authorBanner.length <= 1 ? 'swiper-no-swiping' : '',
      ]"
      :options="swiperOption"
    >
      <swiper-slide
        class="swiper-slide grayscale"
        v-for="(item, index) in authorBanner"
        :key="index"
      >
        <div
          class="banner"
          :style="`background-image:url(${item.cover})`"
        ></div>
      </swiper-slide>
    </swiper>
    <div v-else class="banner grayscale"></div>
    <!--  banner-end -->
    <div class="user-main grayscale">
      <div class="v1-main" v-if="userInfo">
        <!-- 用户基础信息-start -->
        <div class="user-info">
          <div
            class="avatar"
            :style="`background: url(${
              userInfo.avatar ? userInfo.avatar : '/static/img/avatars.svg'
            }) no-repeat center;background-size: cover`"
          >
            <i v-if="userInfo.type == 1||userInfo.type == 2" class="artist-icon"></i>
          </div>
          <h1>{{ userInfo.nickname || "-" }}</h1>
          <h2>
            {{
              userInfo.introduce
                ? userInfo.introduce
                : "他好像对元宇宙没有什么话想说"
            }}
          </h2>
          <div class="relation">
            <div>
              <h3>粉丝</h3>
              <h4>
                {{ $common.formatFansNumber(userInfo.passiveNum) }}
              </h4>
              <h3 class="relation-text">粉丝</h3>
            </div>
            <div>
              <h3>获赞</h3>
              <h4>{{ $common.formatFansNumber(likeNum) || 0 }}</h4>
              <h3 class="relation-text">获赞</h3>
            </div>
          </div>
          <div
            :class="[isFocus ? 'v1-btn-followed' : 'v1-btn-attention']"
            @click="focusArtist(isFocus)"
          >
            {{ isFocus ? "已关注" : "关注" }}
          </div>
        </div>
        <div v-if="isPageLock">
          <div class="m-lock">
            <img src="//static.theone.art/pc/artist/icon-lock.png" />
            <div class="txt">艺术家设置了权限</div>
          </div>
        </div>
        <div v-else>
          <div
            class="introduce"
            v-if="
              userInfo.type && (userInfo.type == 1||userInfo.type == 2) && userInfo.artDetail
            "
          >
            <div class="v1-module-title">个人介绍</div>
            <div>{{ userInfo.artDetail }}</div>
          </div>
          <!-- 用户基础信息-end -->
          <!--  tab-start -->
          <div class="v1-tabs red">
            <ul>
              <li
                :class="[currentTabIdx == index ? 'active' : '']"
                @click="cutTitle(index,1)"
                v-for="(item, index) in searchOptions"
                :key="index"
                :show="
                  (item.key == 'gallery' && (userInfo.type == 1||userInfo.type == 2)) ||
                  item.key !== 'gallery'
                "
              >
                <a>{{ item.name }}</a>
              </li>
            </ul>
          </div>
          <!--  tab-end -->
          <div class="works">
            <div class="category" v-show="!showMoreTreasure">
              <ul v-if="showSeletOptions">
                <li
                  :class="['pointer', idX == index ? 'active' : '']"
                  @click="selectOptions(index, item.id)"
                  v-for="(item, index) in activeList"
                  :key="index"
                >
                  <a>{{ item.name }}</a>
                </li>
              </ul>
              <div
                class="choose"
                v-show="
                  searchOptions[this.currentTabIdx].key == 'collection' &&
                  !this.isViewAssetsLock
                "
              >
                <el-select
                  v-model="collectListParam[item.key]"
                  :placeholder="item.name"
                  v-for="(item, index) in searchOption"
                  :key="index"
                  @change="upDateList"
                >
                  <el-option
                    v-for="(option, oindex) in item.item"
                    :key="oindex"
                    :label="option.name"
                    :value="option.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div
              class="back pointer"
              v-if="showMoreTreasure"
              @click="returnBack()"
            >
              {{ goBackTitle }}
            </div>
            <!-- 画廊藏品馆 -->
            <div class="loading" v-if="loading">
              <loading></loading>
            </div>
            <empty v-else-if="showEmpty"></empty>
            <div v-else>
              <!-- 画廊 -->
              <div v-if="searchOptions[this.currentTabIdx].key == 'gallery'">
                <div>
                  <div class="v1-goods-list" v-if="artistCommodityResult">
                    <div
                      class="v1-goods-wrap gallery-wrap"
                      v-for="(item, index) in artistCommodityResult.records"
                      :key="index"
                      @click="goMarket(item.name, item.id, item.typeMarket)"
                    >
                      <goods-frame
                        class="v1-goods ui-goods-frame"
                        :isShowGoodsName="false"
                        :isShowNumber="false"
                        :isShowPrice="false"
                        :isShowTypeMarket="false"
                        :goods-info="{
                          commodity: item,
                          ...item,
                        }"
                        @listenLike="likeGoods"
                        :params="{ dataType: 1 }"
                        :index="index"
                        :isShowPreview="true"
                        @listenCoverClick="listenCoverClick"
                      >
                        <div class="cus-goods-line" slot="footer">
                          <div class="goods-name">{{ item.name }}</div>
                        </div>
                      </goods-frame>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 藏品馆 -->
              <div
                v-if="!isCollection
                "
              >
                <div class="m-lock">
                  <img src="//static.theone.art/pc/artist/icon-lock.png" />
                  <div class="txt">艺术家设置了权限</div>
                </div>
              </div>
              <div v-else>
                <div
                  class="v1-goods-list"
                  v-if="
                    searchOptions[this.currentTabIdx].key == 'collection' &&
                    !showMoreTreasure &&
                    artistCommodityResult
                  "
                >
                  <div
                    class="v1-goods-wrap"
                    v-for="(item, index) in artistCommodityResult.records"
                    :key="index"
                  >
                    <categoryMore
                      :count="
                        item.amount +
                        item.amountLockSold +
                        (item.amountLockGive ? item.amountLockGive : 0)
                      "
                      class="category-more"
                    />
                    <goods-frame
                      class="v1-goods ui-goods-frame"
                      :isShowGoodsName="false"
                      :isShowNumber="false"
                      :isShowPrice="false"
                      :isShowTypeMarket="false"
                      :goods-info="{
                        commodity: item,
                        ...item,
                      }"
                      :isShowLike="false"
                      :index="index"
                      :isShowTotal="true"
                      :isShowPreview="false"
                      @listenCoverClick="getMoreTreasure"
                    >
                      <div class="v1-goods-line" slot="footer">
                        <h1 class="text-overflow author-name">
                          <span class="ui-icon icon-author"></span
                          >{{ item.author && item.author.name }}
                        </h1>
                      </div>
                    </goods-frame>
                  </div>
                </div>
                <!-- 私藏作品集展示 -->
                <div
                  class="v1-goods-list"
                  v-if="
                    searchOptions[currentTabIdx].key == 'collection' &&
                    showMoreTreasure
                  "
                >
                  <div
                    class="v1-goods-wrap"
                    v-for="(item, index) in artistCommodityResult.records"
                    :key="index"
                  >
                    <goods-frame
                      class="v1-goods ui-goods-frame"
                      :isShowGoodsName="false"
                      :isShowNumber="false"
                      :isShowTypeMarket="false"
                      :goods-info="{
                        commodity: item,
                        ...item,
                      }"
                      @listenLike="likeGoods"
                      :params="{ dataType: 1 }"
                      :index="index"
                      :isShowPreview="true"
                      :isShowPrice="false"
                      @listenCoverClick="listenCoverClick"
                      v-show="item.commoditySku"
                    >
                    </goods-frame>
                  </div>
                </div>
                <div class="v1-pagination" v-if="artistCommodityResult">
                  <g-paging
                    :pageChange="handleCurrentChange"
                    :list="artistCommodityResult.records"
                    :pageSize="16"
                    :current-page="artistCommodityResult.current"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
import categoryMore from "@/pages/v1/mine/treasure/components/categoryMore.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  components: { empty, loading, mHeader, goodsDetail, Swiper, categoryMore },
  data() {
    return {
      loginMember: null,
      isFriend: false,
      isPc: false,
      loading: false, //加载
      showEmpty: false, //空数据
      // isDisabled: false,
      id: null,
      userInfo: null, //个人信息
      active: true,
      swiperOption: {
        loop: true,
        autoplay: 5000,
        slidesPerView: 1,
        spaceBetween: 0,
      },
      searchOption: [
        {
          key: "typeMarket",
          name: "市场类型",
          item: [
            {
              name: "全部",
              value: "",
            },
            {
              name: "版权品",
              value: 1,
            },
            {
              name: "衍生品",
              value: 2,
            },
          ],
        },
      ],
      //选项
      showSeletOptions: true,
      activeList: [],
      searchOptions: [
        {
          name: "画廊",
          key: "gallery",
          value: 0,
          children: [
            {
              name: "全部",
            },
          ],
        },
        {
          name: "藏品馆",
          key: "collection",
          value: 1,
          children: [
            {
              name: "全部",
            },
            {
              name: "可售",
            },
            {
              name: "私藏",
            },
          ],
        },
      ],
      treasureListResult: null,
      idX: 0,
      currentTabIdx: 0, //tab
      seriesId: null, //系类id
      showMoreTreasure: false, //显示藏品组详情
      isFocus: null, //是否关注
      authorBanner: null, //作者背景图
      likeNum: null, //作者喜欢的商品数量
      collectListParam: {
        //藏品馆请求数据
        pageCount: 1,
        pageSize: 16,
        statusTreasure: null,
        typeMarket: null,
        userId: "",
      },
      galleryListParam: {
        authorId: "",
		authorInstitutionId:"",
        pageSize: 16,
        pageCount: 1,
        seriesWorksId: null,
      },
      moreTreasureListParam: {
        pageSize: 16,
        pageCount: 1,
        treasureId: null,
        userId: "",
      },
      artistCommodityResult: null, //画廊商品列表
      goBackTitle: null, //私藏作品返回标题
	  isCollection:true,
    };
  },
  created() {
    this.isPc = !this.$common.isMobile();
    this.id = this.$route.params.id;
    this.collectListParam.userId = this.id;
    this.moreTreasureListParam.userId = this.id;
    this.pageInit();
  },
  computed: {
    headTitle() {
      if (this.userInfo) {
        if (
          this.loginMember &&
          JSON.parse(this.loginMember).uuid == this.userInfo.userUuid
        ) {
          return "我的空间";
        }
        return `${this.userInfo.stageName}的空间`;
      }
      return "我的空间";
    },
    isPageLock() {
      if (
        this.loginMember &&
        JSON.parse(this.loginMember).uuid == this.userInfo.userUuid
      ) {
        return false;
      }
      if (this.userInfo.viewHomepage == 2) {
        return true;
      } else if (this.userInfo.viewHomepage == 1) {
        if (this.isFriend) {
          return false;
        }
		if (this.isFocus) {
		  return false;
		}
        return true;
      }
      return false;
    },
    isViewAssetsLock() {
      if (
        this.loginMember &&
        JSON.parse(this.loginMember).uuid == this.userInfo.userUuid
      ) {
        return false;
      }
      if (this.userInfo.viewAssets == 2) {
        return true;
      } else if (this.userInfo.viewAssets == 1) {
        if (this.isFriend) {
          return false;
        }
		if (this.isFocus) {
		  return false;
		}
        return true;
      }
      return false;
    },
  },
  methods: {
    async upDateList(value) {
		console.dir(value)
		if(!value){
			this.$sensors.track('artistdetail_click', {
				collections_screen: "全部"
			});
		}else if(value==1){
			this.$sensors.track('artistdetail_click', {
				collections_screen: "版权品"
			});
		}
		else if(value==2){
			this.$sensors.track('artistdetail_click', {
				collections_screen: "衍生品"
			});
		}
      this.collectListParam.typeMarket = value;
      this.collectListParam.pageCount = 1;
      this.artistCommodityResult = await this.getCollectCommodityList(
        this.collectListParam
      );
    },
    //页面初始化
    async pageInit() {
      this.loginMember = localStorage.getItem("THEONE_MEMBER");
      if (this.loginMember) {
        await this.getFoucsByuuid();
      }

      this.userInfo = await this.getUserInfo();
      this.authorBanner = await this.getUserBg();
      this.likeNum = await this.getLikeNum();
	  this.cutTitle(0);
      // if (!this.isPageLock) {
      //   if (this.userInfo.type == 1||this.userInfo.type == 2) {
      //     this.searchOptions = [
      //       {
      //         name: "画廊",
      //         key: "gallery",
      //         value: 0,
      //         children: [
      //           {
      //             name: "全部",
      //           },
      //         ],
      //       },
      //       {
      //         name: "藏品馆",
      //         key: "collection",
      //         value: 1,
      //         children: [
      //           {
      //             name: "全部",
      //           },
      //           {
      //             name: "可售",
      //           },
      //           {
      //             name: "私藏",
      //           },
      //         ],
      //       },
      //     ];
      //   } else {
      //     this.searchOptions = [
      //       {
      //         name: "藏品馆",
      //         key: "collection",
      //         value: 1,
      //         children: [
      //           {
      //             name: "全部",
      //           },
      //           {
      //             name: "可售",
      //           },
      //           {
      //             name: "私藏",
      //           },
      //         ],
      //       },
      //     ];
      //   }
      //   this.cutTitle(0);
      // }
    },
    //获取个人信息
    async getUserInfo() {
      let result = await this.$api.service.userAttribute_query({
        uuid: this.id,
      });
      return result.data.data;
    },
    //作者背景图
    async getUserBg() {
      let result = await this.$api.service.userBanner_listByUserUuid({
        userUuid: this.id,
        pageCount: 1,
        pageSize: 20,
      });
      if (result.data.data.records.length <= 1) {
        this.swiperOption.autoplay = false;
        this.swiperOption.loop = false;
      }
      //需要设置如果只要一张背景图时loop循环为false;
      return result.data.data.records;
    },
    //获取艺术家喜欢的商品数量
    async getLikeNum() {
		let params = {};
		if(this.userInfo.isAuthorInstitution){
			params.authorInstitutionId = this.id;
		}else{
			params.authorId = this.id;
		}
      let result = await this.$api.service.commodity_getAmountLike(params);
      return result.data.data;
    },
    //是否关注艺术家
    async getFoucsByuuid() {
      try {
        let result = await this.$api.service.userFriend_result({
          userUuid: this.id,
        });
        this.isFocus = result.data.data.isFocus == 1 ? true : false;
        this.isFriend = result.data.data.isFriend == 1 ? true : false;
      } catch (error) {}
    },
    //关注与取消关注
    async focusArtist() {
      // this.isDisabled = true;
      let result;
      if (!this.isFocus) {
		  this.$sensors.track('artistdetail_click',{
		  	button_name:"关注"
		  });
        result = await this.$api.service.userfriend_operation({
          type: 1,
          userUuid: this.id,
        });
        if (result.data.code == 200) {
          this.$message.success("关注成功");
          this.getFoucsByuuid();
          this.userInfo.passiveNum++;
        } else if (result.data.code !== 401) {
          this.$message.error("关注失败");
        }
        // this.isDisabled = false;
      } else {
		  this.$sensors.track('artistdetail_click',{
		  	button_name:"取消关注"
		  });
        result = await this.$api.service.userfriend_operation({
          type: 2,
          userUuid: this.id,
        });
        if (result.data.code == 200) {
          this.$message.success("取消关注成功");
          this.getFoucsByuuid();
          this.userInfo.passiveNum--;
        } else if (result.data.code !== 401) {
          this.$message.error("取消关注失败");
        }
        // this.isDisabled = false;
      }
    },
    //获取画廊作品
    async getGalleryCommodityList(params) {
      let result = await this.$api.service.commodity_list(params);
      this.loading = false;
      this.showEmpty = result.data.data.records.length == 0 ? true : false;
      return result.data.data;
    },
    //获取藏品馆作品
    async getCollectCommodityList(params) {
      let result = await this.$api.service.public_list(params);
      this.loading = false;
      this.showEmpty = result.data.data.records.length == 0 ? true : false;
      return result.data.data;
    },
    //获取系列作品
    async getSeriesWorksList() {
		let params = {
			pageSize: 20,
			pageCount: 1,
		};
		if(this.userInfo.isAuthorInstitution){
			params.authorInstitutionId = this.id;
		}else{
			params.authorId = this.id;
		}
      let result = await this.$api.service.seriesWorks_list(params);
      this.searchOptions.forEach((item) => {
        item.key == "gallery"
          ? (item.children = item.children.concat(result.data.data.records))
          : "";
      });
      this.activeList = this.searchOptions[this.currentTabIdx].children;
      this.showSeletOptions = true;
    },
    //切换画廊藏品馆标题
    async cutTitle(index,type) {
      this.currentTabIdx = index;
      this.idX = 0;
      this.showMoreTreasure = false;
	  if(this.userInfo.isAuthorInstitution){
			this.galleryListParam.authorInstitutionId = this.id;
	  }else{
			this.galleryListParam.authorId = this.id;
	  }
      if (
        this.searchOptions[index].key == "collection" &&
        this.isViewAssetsLock
      ) {
		  this.showEmpty = false;
		  this.isCollection = false;
		  return;
      }
      this.loading = true;
      this.showEmpty = true;
      this.activeList = this.searchOptions[index].children;
      this.collectListParam.statusTreasure = null;
      this.collectListParam.pageCount = 1;
      // this.collectListParam.typeMarket = null;
      this.galleryListParam.seriesWorksId = null;
      this.galleryListParam.pageCount = 1;
      if (this.searchOptions[this.currentTabIdx].key == "gallery") {
		  if(type){
			  this.$sensors.track('artistdetail_click',{
			  	button_name:"画廊"
			  });
		  }
        this.artistCommodityResult = await this.getGalleryCommodityList(
          this.galleryListParam
        );
      } else {
		  this.$sensors.track('artistdetail_click',{
		  	button_name:"藏品"
		  });
        this.artistCommodityResult = await this.getCollectCommodityList(
          this.collectListParam
        );
        this.loading = false;
      }
    },
    //切换查询产品状态
    async selectOptions(index, id) {
      this.loading = true;
      this.idX = index;
      this.seriesId = id;
      if (this.searchOptions[this.currentTabIdx].key == "gallery") {
        this.galleryListParam.seriesWorksId = id;
        this.galleryListParam.pageCount = 1;
        this.artistCommodityResult = await this.getGalleryCommodityList(
          this.galleryListParam
        );
      } else {
		  console.dir(index)
        if (index == 0) {
			this.$sensors.track('artistdetail_click',{
				collections_tab:"全部"
			});
          this.collectListParam.statusTreasure = null;
        } else {
			if(index==1){
				this.$sensors.track('artistdetail_click',{
					collections_tab:"可售"
				});
			}else{
				this.$sensors.track('artistdetail_click',{
					collections_tab:"私藏"
				});
			}
          this.collectListParam.statusTreasure = index;
        }
        this.collectListParam.pageCount = 1;
        this.artistCommodityResult = await this.getCollectCommodityList(
          this.collectListParam
        );
      }
    },
    //展开更多展集
    async getMoreTreasure(item) {
      if (
        item.amount +
          item.amountLockSold +
          (item.amountLockGive ? item.amountLockGive : 0) >=
        2
      ) {
        this.goBackTitle = item.commodity.name;
        this.moreTreasureListParam.treasureId = item.id;
        let result = await this.$api.service.treasureSku_public_list(
          this.moreTreasureListParam
        );
        this.showMoreTreasure = true;
        this.showEmpty = result.data.data.records.length == 0 ? true : false;
        this.artistCommodityResult = result.data.data;
      }
    },
    //喜欢及取消喜欢
    async likeGoods(info) {
      const { id, like, name, dataType, index } = info;

      let message1 = `您确定取消喜欢【${
        (info.commodity && info.commodity.name) || info.name
      }】吗?`;
      let message2 = `您已成功取消对【${
        (info.commodity && info.commodity.name) || info.name
      }】的喜欢！`;
      let collectParam = {
        dataId: id,
        type: 2,
        dataType: dataType,
      };
      if (like) {
		  this.$sensors.track('artistdetail_click',{
		  	gallery_save:"取消"
		  });
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.$message.success(message2);
          // this.selectOptions(this.idX, this.seriesId);
          this.artistCommodityResult.records[index].like = false;
          this.likeNum = await this.getLikeNum();
          if (this.artistCommodityResult.records[index].amountLike) {
            this.artistCommodityResult.records[index].amountLike--;
          } else {
            this.artistCommodityResult.records[index].commodity.amountLike--;
          }
        } else if (result.data.code !== 401) {
          this.$message.error("失败,请稍后重试");
        }
      } else {
		  this.$sensors.track('artistdetail_click',{
		  	gallery_save:"收藏"
		  });
        collectParam.type = 2;
        let result = await this.$api.service.userLike_operation(collectParam);
        if (result.data.code == 200) {
          this.$message.success("成功");
          this.likeNum = await this.getLikeNum();
          this.artistCommodityResult.records[index].like = true;
          if (
            this.artistCommodityResult.records[index].amountLike ||
            this.artistCommodityResult.records[index].amountLike == 0
          ) {
            this.artistCommodityResult.records[index].amountLike++;
          } else {
            this.artistCommodityResult.records[index].commodity.amountLike++;
          }
        } else if (result.data.code !== 401) {
          this.$message.error("失败,请稍后重试");
        }
      }
    },
    async returnBack() {
      this.artistCommodityResult = null;
      this.showMoreTreasure = false;
      this.collectListParam.pageCount = 1;
      this.artistCommodityResult = await this.getCollectCommodityList(
        this.collectListParam
      );
    },
    async handleCurrentChange(val) {
      if (this.searchOptions[this.currentTabIdx].key == "gallery") {
        this.galleryListParam.pageCount = val;
        this.artistCommodityResult = await this.getGalleryCommodityList(
          this.galleryListParam
        );
      } else if (
        this.searchOptions[this.currentTabIdx].key == "collection" &&
        !this.showMoreTreasure
      ) {
        this.collectListParam.pageCount = val;
        this.artistCommodityResult = await this.getCollectCommodityList(
          this.collectListParam
        );
      } else {
        this.moreTreasureListParam.pageCount = val;
        this.artistCommodityResult = await this.$api.service.treasureSku_list(
          this.moreTreasureListParam
        );
      }
    },
    listenCoverClick({ name, id, typeMarket }) {
      if (name && id && typeMarket) {
        window.open(`/market?key=${name}&id=${id}&type=${typeMarket}`);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.gallery-wrap {
  .goods-name {
    font-weight: bold;
    color: #333333;
    font-size: 16px;
    margin-top: 18px;
    padding-bottom: 10px;
  }
  ::v-deep .frame-box {
    padding: 0;
  }
}
.ui-goods-frame {
  ::v-deep .frame-box {
    border: none;
    background-color: #fff;
    box-shadow: none;
  }
}
.v1-goods-line {
  h1 {
    margin-top: 8px;
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
  }
}
.m-lock {
  img {
    display: block;
    width: 250px;
    margin: 0 auto 14px;
  }
  .txt {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    text-align: center;
  }
}
.v1-goods-cover {
  position: relative;
  .img-wrap {
    position: absolute;
  }
}
.loading {
  height: 300px;
}
.page-user-index {
  padding-bottom: 100px;
  .banner {
    background: url("//static.theone.art/pc/images/user-banner.png") no-repeat
      center center;
    background-size: cover;
    height: 400px;
  }
  .user-main {
    background: url("//static.theone.art/pc/images/user-banner-bottom.png")
      no-repeat center 59px;
    background-size: 100% 144px;
    margin-top: -200px;
    position: relative;
    z-index: 2;
    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar {
        width: 118px;
        height: 118px;
        border-radius: 100%;
        background: #f2f2f2;
        margin-bottom: 27px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        // align-items: center;
        // overflow: hidden;
        position: relative;
        img {
          border-radius: 100%;
          width: 100%;
        }
      }
      h1 {
        font-weight: bold;
        color: #000000;
        line-height: 21px;
        font-size: 16px;
        margin-bottom: 43px;
      }
      h2 {
        font-size: 14px;
        color: #000000;
        line-height: 19px;
        margin-bottom: 16px;
      }
      .relation {
        display: flex;
        text-align: center;
        margin-bottom: 24px;
        div {
          margin: 0 25px;
        }
        h3 {
          font-size: 12px;
          color: rgba($color: #000000, $alpha: 0.4);
          margin-bottom: 6px;
        }
        h4 {
          font-size: 16px;
        }
        .relation-text {
          display: none;
        }
      }
      .v1-btn-attention,
      .v1-btn-followed {
        margin-bottom: 40px;
      }
    }
    .introduce {
      padding: 32px 32px 46px;
      border-radius: 4px;
      border: 1px solid #e3e3e3;
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.4);
      line-height: 24px;
      margin-bottom: 80px;
      .v1-module-title {
        margin-bottom: 32px;
      }
    }
    .v1-tabs {
      margin-bottom: 30px;
    }

    .category {
      font-size: 14px;
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      margin-top: -10px;
      ul {
        display: flex;
        flex: 1;
        overflow-x: auto;
        li {
          color: rgba($color: #000000, $alpha: 0.4);
          margin-right: 24px;
          margin-bottom: 5px;
          word-break: keep-all;
          white-space: nowrap;
          padding: 10px 0;
          &.active {
            color: #e61f1a;
          }
        }
      }
    }
  }
  .back {
    height: 14px;
    line-height: 14px;
    font-size: 12px;
    margin-bottom: 40px;
    background: url("//static.theone.art/pc/images/pic-home/header-operate-back.png")
      no-repeat left center;
    background-size: 14px 14px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .content-first {
    margin-bottom: 10px;
  }
  .goodstwo,
  .goodsmore {
    position: relative;
    &::before {
      height: 6px;
      position: absolute;
      top: -6px;
      left: 9px;
      right: 9px;
      content: "";
      background: url("//static.theone.art/pc/images/treasure-1.png") no-repeat
        center center;
      background-size: 100% 6px;
    }
  }
  .goodsmore {
    &::before {
      background-image: url("//static.theone.art/pc/images/treasure-2.png");
      background-size: 100% 12px;
      top: -12px;
      height: 12px;
    }
  }
  .artist-icon {
    position: absolute;
    background: url("//static.theone.art/pc/images/yishujia%402x.png") no-repeat;
    width: 30px;
    height: 30px;
    background-size: 100% 100%;
    right: 0;
    bottom: 0;
  }
  .mode-mobile {
    display: none;
  }
  .mode-PC {
    display: inline-block;
  }
  .v1-goods-line h1 {
    display: inline-block;
  }
  @media screen and (min-width: 541px) and (max-width: 960px) {
    .goods-list {
      width: auto;
      .goods-padding {
        width: 50%;
      }
      .goods-item {
        margin-bottom: 24px;
      }
    }
  }
  @media screen and (max-width: 540px) {
    .mode-mobile {
      display: inline-block;
    }
    .mode-PC {
      display: none;
    }
    .banner {
      background: url("//static.theone.art/pc/images/user-banner-wap.png")
        no-repeat center center;
      background-size: cover;
      height: 161px;
      margin-top: 55px;
    }
    .user-main {
      margin-top: -35px;
      background: none;
      .user-info {
        .avatar {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 65px;
            height: 65px;
          }
        }
        h1 {
          margin-bottom: 20px;
        }
        .relation {
          h3 {
            display: none;
          }
          > div {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .relation-text {
            display: inline-block;
            margin-bottom: 0;
            margin-left: 5px;
          }
        }
      }
      .category {
        font-size: 12px;
        align-items: center;
        margin-bottom: 10px;
      }
      .el-select {
        width: 110px !important;
      }
      .el-input__inner {
        font-size: smaller !important;
      }
      .v1-module-title {
        margin-bottom: 0rem;
        margin-top: 24px;
      }
    }

    .goods-list {
      width: auto;
      .goods-padding {
        width: 100%;
      }
      .goods-item {
        margin-bottom: 24px;
      }
    }
    .artist-icon {
      right: -4px;
      bottom: -4px;
    }
  }
}
</style>
