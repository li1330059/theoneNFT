<template>
  <div
    :class="['page-v1-market', flag.showSearchFixed ? 'page-v1-marketBg' : '']"
  >
    <div class="mode-mobile">
      <m-header :title="`${bodyTitle}市场`" class="ui-body-head" />
      <div class="market-search-fixed" ref="marketSearchFixed">
        <div class="market-search-mobile">
          <div :class="['input', flag.showSearchFixed ? 'input-show' : '']">
            <input
              type="text"
              v-model="flag.searchString"
              @focus.stop="flag.showSearchFixed = true"
              @input="onSearchByGoodsName"
              @keydown.enter="onSearchByGoodsName"
            />
          </div>
          <div
            class="btn-search btn-cancel"
            v-if="flag.showSearchFixed"
            @click="
              flag.showSearchFixed = false;
              flag.searchString = null;
              flag.searchResult = false;
            "
          >
            取消
          </div>
        </div>
        <div
          :class="[
            'market-main-search mode-mobile',
            flag.showSearchFixed ? 'market-search-hidden' : '',
          ]"
        >
          <div class="market-search-option">
            <ul>
              <li
                :class="{
                  'active-high': searchValue.orderValue == 1,
                  'active-low': searchValue.orderValue == 4,
                }"
                @click="getTimesort"
              >
                时间
              </li>
              <li
                :class="{
                  'active-high': searchValue.orderValue == 2,
                  'active-low': searchValue.orderValue == 3,
                }"
                @click="getPricesort"
              >
                价格
              </li>
            </ul>
            <div class="tool-right">
              <div class="view-wrap">
                <span
                  class="ui-icon"
                  :class="{
                    'ui-icon-one': arrayWay == 1,
                    'ui-icon-two': arrayWay == 2,
                  }"
                  @click="toggleArrayWay"
                />
              </div>

              <div class="btn-search" @click="onMobileSearch">筛选</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-fixed" v-if="flag.showSearchFixed">
      <div :class="{ 'search-result': true, show: flag.searchResult }">
        <div>
          <h1>商品</h1>
          <ul
            v-if="flag.goodsList && flag.goodsList.length > 0"
            class="mobile-scroll"
            @scroll="mSearchScroll($event)"
          >
            <li
              v-for="(item, index) in flag.goodsList"
              :key="index"
              @click="searchGoodsList(item)"
            >
              {{ item.name }}
            </li>
          </ul>
          <div class="search-result-kong" v-else>暂无该作品信息</div>
        </div>
      </div>
    </div>
    <div class="market-flex" v-else>
      <van-popup
        v-model="flag.mobileSearch"
        position="right"
        @touchmove.prevent
        :closeable="true"
        :style="{ height: '100%' }"
        z-index="99999"
      >
        <div class="market-search-mobile-con">
          <div v-if="prepayMenu.length > 0">
            <div
              v-for="(item, index) in prepayMenu"
              :key="index"
              @click="item.show = !item.show"
            >
              <div v-if="item.childrens.length > 0">
                <h2 class="ui-title">
                  <span class="ui-icon" :class="`icon-c-${item.level}`" />{{
                    item.childLevelName
                  }}
                </h2>
                <div class="ul">
                  <div
                    class="ui-bar"
                    v-for="(childItem, childIndex) in item.childrens"
                    :key="childIndex"
                  >
                    <div
                      class="li hidden-one"
                      :class="{ hidden: true, active: childItem.selected }"
                      @click.stop="
                        prepayMenuHandle({
                          menuItem: childItem,
                          menuIdx: childIndex,
                        })
                      "
                    >
                      {{ childItem.name.replace(/市场/gi, "") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in menuList"
            :key="index"
            @click="item.show = !item.show"
          >
            <div v-if="item.childrens.length > 0">
              <h2 class="ui-title">
                <span class="ui-icon" :class="`icon-c-${item.level}`" />{{
                  item.childLevelName
                }}
              </h2>
              <div class="ul">
                <div
                  class="ui-bar"
                  v-for="(childItem, childIndex) in item.childrens"
                  :key="childIndex"
                >
                  <div
                    class="li hidden-one"
                    :class="{ hidden: true, active: childItem.selected }"
                    @click.stop="menuHandle({ menuItem: childItem })"
                  >
                    {{ childItem.name.replace(/市场/gi, "") }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="
              goodsListParam.typeMarket == 2 &&
              selectedCategoryStatus.length == 1 &&
              nameList.length > 0
            "
          >
            <div>
              <div class="phone-name-list-wrap">
                <h2 class="ui-title">
                  <span :class="`ui-icon  icon-market-name`" />名称分类
                </h2>
                <div class="ul infinite-list" v-infinite-scroll="loadMoreName">
                  <div
                    class="ui-bar"
                    v-for="(item, idx) in nameList"
                    :key="idx"
                  >
                    <div
                      class="li hidden-one"
                      :class="{ hidden: true, active: item.active }"
                      @click.stop="onToggleNameList(idx)"
                    >
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="goods-element-wrap"
            v-if="goodsListParam.typeMarket == 1 && traitList.length > 0"
          >
            <div :class="{ 'market-sift-line': true, show: isShowElementList }">
              <h2
                :class="`title`"
                @click="isShowElementList = !isShowElementList"
              >
                <span :class="`ui-icon icon-market-te`"></span>
                <van-popover
                  v-model="showPopover"
                  trigger="click"
                  placement="top"
                >
                  <van-grid square clickable>
                    <div style="max-width: 200px; padding: 12px">
                      特性数量指在所属分类下的全部商品中，该特性所拥有的总数。同类别的特性筛选是或的关系，不同类别的特性筛选是且的关系
                    </div>
                  </van-grid>
                  <template #reference>
                    <div
                      class="v1-icon-question"
                      @click.stop="showPopover = !showPopover"
                    >
                      特性分类
                    </div>
                  </template>
                </van-popover>
              </h2>
              <div class="wrap" v-show="isShowElementList">
                <div
                  class="ui-menu-message"
                  v-if="!isSelectCommodityCategoryId"
                >
                  请选择模块分类
                </div>
                <div class="ui-menu-message" v-else-if="traitList.length <= 0">
                  这里空空如也
                </div>
                <ul v-else class="">
                  <li
                    class="ui-bar"
                    v-for="(item, idx) in traitList"
                    :key="idx"
                  >
                    <div class="ui-bar-title" @click="onToggleElementList(idx)">
                      <span class="name hidden-1">{{ item.traitType }}</span>
                      <div>
                        <span
                          class="ui-icon icon-direction"
                          :class="{ 'icon-rotate': item.active }"
                        ></span>
                      </div>
                    </div>
                    <div class="goods-element-list" v-show="item.active">
                      <div
                        class="goods-element-bar"
                        :class="{ 'active-bar': item2.active }"
                        v-for="(item2, idx2) in item.traitValueList"
                        :key="idx2"
                        @click="onToggleEVal(idx, idx2)"
                      >
                        <div class="goods-element-name hidden-1">
                          {{ item2.traitValue }}
                        </div>
                        <div class="goods-element-num">{{ item2.count }}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="btn-groups">
            <div class="v1-btn grey" @click="onSearchMobileReset">重置</div>
            <div class="v1-btn" @click="onSearchMobile">确定筛选</div>
          </div>
        </div>
      </van-popup>
      <!--       web侧边栏 -->
      <div
        :class="['market-sift', transform ? 'transform' : 'transform-false']"
      >
        <div
          class="market-sift-line shrink"
          @click="transform = !transform"
        ></div>
        <div v-show="!transform" class="ui-market-tabs">
          <status-template
            :list="themeClassList && themeClassList.length > 0"
            api="/market/api/commodityCategory/list/v2"
            :init="getThemeClass"
            class="pc-menu-status"
          >
            <MarketMenu
              v-if="prepayMenu.length > 0"
              :menu-list="prepayMenu"
              @listen="prepayMenuHandle"
            ></MarketMenu>
            <MarketMenu :menu-list="menuList" @listen="menuHandle"></MarketMenu>

            <div
              class="goods-element-wrap"
              v-if="goodsListParam.typeMarket == 1 && traitList.length > 0"
            >
              <div
                :class="{ 'market-sift-line': true, show: isShowElementList }"
              >
                <div
                  :class="`title`"
                  @click="isShowElementList = !isShowElementList"
                >
                  <span :class="`ui-icon icon-market-te`"></span>
                  <el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    content="特性数量指在所属分类下的全部商品中，该特性所拥有的总数。同类别的特性筛选是或的关系，不同类别的特性筛选是且的关系"
                  >
                    <div slot="reference">
                      特性分类 <span :class="`ui-icon icon-help`"></span>
                    </div>
                  </el-popover>
                </div>
                <div class="wrap" v-show="isShowElementList">
                  <div
                    class="ui-menu-message"
                    v-if="!isSelectCommodityCategoryId"
                  >
                    请选择模块分类
                  </div>
                  <div
                    class="ui-menu-message"
                    v-else-if="traitList.length <= 0"
                  >
                    这里空空如也
                  </div>
                  <ul v-else class="pc-hot">
                    <li
                      class="ui-bar"
                      v-for="(item, idx) in traitList"
                      :key="idx"
                    >
                      <div
                        class="ui-bar-title"
                        @click="onToggleElementList(idx)"
                      >
                        <span class="name hidden-1">{{ item.traitType }}</span>
                        <div>
                          <span
                            class="ui-icon icon-direction"
                            :class="{ 'icon-rotate': item.active }"
                          ></span>
                        </div>
                      </div>
                      <div class="goods-element-list" v-show="item.active">
                        <div
                          class="goods-element-bar"
                          :class="{ 'active-bar': item2.active }"
                          v-for="(item2, idx2) in item.traitValueList"
                          :key="idx2"
                          @click="onToggleEVal(idx, idx2)"
                        >
                          <div class="goods-element-name">
                            {{ item2.traitValue }}
                          </div>
                          <div class="goods-element-num">{{ item2.count }}</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              class="goods-element-wrap"
              v-if="
                goodsListParam.typeMarket == 2 &&
                selectedCategoryStatus.length == 1 &&
                nameList.length > 0
              "
            >
              <div :class="{ 'market-sift-line': true, show: isShowNameList }">
                <div :class="`title`" @click="isShowNameList = !isShowNameList">
                  <span :class="`ui-icon icon-market-name`"></span>名称分类
                </div>
                <div class="wrap" v-show="isShowNameList">
                  <div class="ui-menu-message" v-if="false">请选择模块分类</div>
                  <div class="ui-menu-message" v-else-if="nameList.length <= 0">
                    这里空空如也
                  </div>
                  <ul
                    v-else
                    class="pc-hot infinite-list"
                    v-infinite-scroll="loadMoreName"
                  >
                    <li
                      class="ui-bar"
                      v-for="(item, idx) in nameList"
                      :key="idx"
                    >
                      <div
                        class="ui-bar-title"
                        :class="{ 'name-active': item.active }"
                        @click="onToggleNameList(idx)"
                      >
                        <span class="name hidden-1">{{ item.name }}</span>
                        <div>
                          <!--    <span
                            class="ui-icon icon-direction"
                            :class="{ 'icon-rotate': item.active }"
                          ></span> -->
                        </div>
                      </div>
                      <!--             <div class="goods-element-list" v-show="item.active">
                        <div
                          class="goods-element-bar"
                          :class="{ 'active-bar': item2.active }"
                          v-for="(item2, idx2) in item.traitValueList"
                          :key="idx2"
                          @click="onToggleEVal(idx, idx2)"
                        >
                          <div class="goods-element-name">
                            {{ item2.traitValue }}
                          </div>
                          <div class="goods-element-num">{{ item2.count }}</div>
                        </div>
                      </div> -->
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </status-template>
        </div>
      </div>

      <div
        :class="['market-main-search market-main-PC mode-PC']"
        ref="marketMainSearch"
      >
        <div class="search-head">
          <div
            :class="[
              'search-active',
              selectedCategoryList.length > 0 ? 'search-active-padding' : '',
              isPc ? 'search-active-pc' : '',
              transform && isPc ? 'market-main-left' : 'market-main-false',
            ]"
          >
            <ul class="grayscale">
              <div v-for="(item, index) in selectedCategoryList" :key="index">
                <li class="hidden-one">
                  {{ item.name.replace(/市场/gi, "") }}
                </li>
              </div>
            </ul>
          </div>

          <div
            class="pc-sort-box"
            :class="['search', transform ? 'transform1' : 'transform-false']"
          >
            <div class="navigation"></div>
            <el-form :inline="true" :model="searchValue">
              <el-form-item>
                <el-select
                  :value="searchValue.orderValue"
                  placeholder="排序规则"
                  @change="onSearchByInput"
                >
                  <el-option label="排序方式" :value="0"></el-option>
                  <el-option label="按照时间顺序" :value="4"></el-option>
                  <el-option label="价格从低到高" :value="2"></el-option>
                  <el-option label="价格从高到低" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <div
        :class="[
          'market-main',
          transform ? 'market-main-left' : 'market-main-false',
        ]"
      >
        <div class="market-main-center">
          <div
            ref="marketList"
            :class="['market-list', isPc ? 'market-list-pc' : '']"
          >
            <div class="select-element-wrap">
              <div
                class="element-btn"
                v-for="(item, idx) in selectElementList"
                :key="idx"
                @click="onRemoveElement(item)"
              >
                {{ item.name }}
                <span class="ui-icon icon-e-close"></span>
              </div>
              <div class="editor-txt-wrap" v-if="selectElementList.length > 0">
                <div
                  class="link-btn"
                  @click="onRemoveAllElement"
                  v-if="selectElementList.length >= 2"
                >
                  清除全部特性
                </div>
                <span v-if="total > 0"> 共{{ total }}个在售商品符合条件</span>
              </div>
            </div>
            <div class="phone-selected-wrap">
              <div
                class="phone-head-wrap"
                :class="[
                  'search-active',
                  Object.keys(searchActive).length > 0
                    ? 'search-active-padding'
                    : '',
                ]"
              >
                <div class="phone-bud"></div>
                <div class="overflow-x-auto">
                  <ul
                    style="margin: 0 -0.06rem"
                    :style="`width:${2.2 * selectedCategoryList.length}rem`"
                  >
                    <div
                      class="wrap grayscale"
                      v-for="(item, index) in selectedCategoryList"
                      :key="index"
                      :class="item.key"
                    >
                      <div v-if="item.name !== 'typeMarket' && !isPc">
                        <li class="hidden-one">
                          {{ item.name.replace(/市场/gi, "") }}
                        </li>
                      </div>
                    </div>
                  </ul>
                </div>

                <div
                  class="phone-select-element-wrap"
                  v-if="
                    isSelectCommodityCategoryId &&
                    goodsListParam.typeMarket == 1
                  "
                >
                  <div class="main">
                    <div
                      class="bar"
                      v-for="(item, idx) in traitList"
                      :key="idx"
                      @click="onPhoneToggleElement(idx)"
                      :class="{ 'bar-active': phoneElementIdx == idx }"
                    >
                      <div
                        class="title"
                        :class="{
                          'select-element': createElementName(
                            idx,
                            item.traitType
                          ).active,
                        }"
                      >
                        <div class="hidden-1">
                          {{ createElementName(idx, item.traitType).name }}
                        </div>
                        <span class="ui-icon icon-phone-position"></span>
                      </div>
                    </div>
                  </div>
                  <div class="element-message" v-if="total > 0">
                    共{{ total }}个在售商品符合条件
                  </div>

                  <transition name="fade">
                    <div class="list-main" v-show="phoneElementIdx >= 0">
                      <div
                        class="mask"
                        @click="onPhoneToggleElement(phoneElementIdx)"
                      ></div>
                      <div class="list-wrap">
                        <div
                          class="list-wrap-main"
                          v-if="traitList[phoneElementIdx]"
                        >
                          <div
                            class="element-bar"
                            v-for="(item, idx) in traitList[phoneElementIdx]
                              .traitValueList"
                            :key="idx"
                            :class="{ 'active-element-bar ': item.active }"
                            @click="onPhoneSelectElement(idx)"
                          >
                            <div class="element-info hidden-1">
                              {{ item.traitValue }}({{ item.count }})
                            </div>
                          </div>
                        </div>
                        <div class="ui-btn-group ui-btn-between">
                          <div>
                            <div
                              class="ui-btn ui-btn-default"
                              @click="onPhoneRestElement"
                            >
                              重置
                            </div>
                          </div>
                          <div>
                            <div
                              class="ui-btn ui-btn-red"
                              @click="onPhoneSearchElement(phoneElementIdx)"
                            >
                              确定
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>

            <div class="loading" v-if="loading">
              <loading></loading>
            </div>
            <empty v-else-if="showEmpty" :title="errTip"></empty>
            <div v-else>
              <div class="v1-goods-list">
                <div
                  class="v1-goods-wrap"
                  :class="{ 'goods-wrap-2': arrayWay == 2 }"
                  v-for="(item, index) in goodsListArr"
                  :key="index"
                >
                  <goods-frame
                    :goods-info="item"
                    @listenLike="likeGoods"
                    :isCheckPaying="true"
                    :index="index"
                    :isShowPreview="true"
                    :isShowPrepaySign="true"
                    @listenCoverClick="listenCoverClick"
                  >
                  </goods-frame>
                </div>
              </div>
              <div class="v1-goods-loading" v-show="showButtomLoading">
                加载中...
              </div>
              <div class="v1-goods-loading" v-show="isShowNotMore">
                ——我是有底线的——
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <goodsDetail ref="goodsDetail" />
    <ab-frequently :init="errUpDateData"></ab-frequently>
    <ab-not-logged-in :init="errUpDateData"></ab-not-logged-in>
    <ab-logged-in :init="errUpDateData"> </ab-logged-in>
    <div class="market-tip-wrap" v-if="showFigLeaf">
      <div class="content">
        <div class="message">{{ marketMessage }}</div>
        <div class="ui-btn-center">
          <div class="ui-btn ui-btn-red" @click="showFigLeaf = false">
            继续看看
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
if (window.e) {
  window.e = "4tBlCLWFZ3eD93CvDE2lpw==";
}
import MarketMenu from "./components/market-menu.vue";
require("../../../utils/gt4");
import mHeader from "@/components/v1/layout/mobileHeader";
import aes from "@/utils/aes";

const MENU = {
  typeMarket: {
    icon: "icon-nav-1",
    name: "市场类型",
    show: true, //收缩切换
    flag: true,
    key: "typeMarket",
    idx: 1,
    mobile: true,
    children: [
      {
        name: "版权品",
        value: "1",
        key: "copyright",
      },
      {
        name: "衍生品",
        value: "2",
        key: "derive",
      },
      {
        name: "数字身份标识艺术品",
        value: "3",
        key: "derive",
      },
    ],
  },
  themeClass: {
    icon: "icon-nav-2",
    name: "标签分类",
    show: true,
    flag: true,
    idx: 2,
    tip: "请选择市场类型",
    key: "themeClass",
    children: [],
  },
  commodityCategoryId: {
    icon: "icon-nav-3",
    name: "模块分类",
    show: false, //收缩切换
    flag: false,
    idx: 3,
    tip: "请选择标签分类",
    key: "commodityCategoryId",

    children: [],
  },
  statusSell: {
    icon: "icon-nav-4",
    name: "状态",
    key: "statusSell",
    show: true,
    flag: true,
    idx: 4,
    tip: "请选择主题分类",
    children: [
      {
        name: "在售",
        value: "1",
      },
      {
        name: "售罄",
        value: "2",
        key: "",
      },
    ],
  },
};
import Loading from "@/components/v1/loading/loading";
import Empty from "@/components/v1/empty";
import { memoryUsage } from "process";
export default {
  components: { mHeader, MarketMenu, Loading, Empty },
  computed: {
    marketBtnDisabledInfo() {
      return this.$store.state.marketBtnDisabledInfo;
    },
    currentPrepayObj() {
      let prepayMenu = this.prepayMenu;

      return (
        prepayMenu &&
        prepayMenu[0] &&
        prepayMenu[0].childrens &&
        prepayMenu[0].childrens.length > 0 &&
        prepayMenu[0].childrens.find((item, idx) => item.selected)
      );
    },
    selectElementList() {
      let ary = [];
      for (let i = 0; i < this.traitList.length; i++) {
        for (let j = 0; j < this.traitList[i].traitValueList.length; j++) {
          if (this.traitList[i].traitValueList[j].active) {
            ary.push({
              name: this.traitList[i].traitValueList[j].traitValue,
              count: this.traitList[i].traitValueList[j].count,
              idx: [i, j],
            });
          }
        }
      }
      return ary;
    },
    bodyTitle() {
      if (this.goodsListParam.typeMarket == 1) {
        return "版权品";
      }
      if (this.goodsListParam.typeMarket == 2) {
        return "衍生品";
      }
      return "";
    },
  },
  data() {
    return {
      prepayMenu: [],
      categoryId: "",
      selectedCategoryStatus: [],
      menuList: [],
      selectedCategoryList: [],
      selectedCategoryObj: {},
      levelObj: {},
      categoryList: [], //市场分类数据
      showPopover: false,
      traitValueList: [],

      nameListParams: {
        commodityCategoryId: "",
        name: "",
        pageCount: 1,
        pageSize: 20,
      },
      nameList: [], //名称分类
      phoneElementIdx: -1, //手机端前选择哪个特性数据列表
      isShowElementList: false,
      isShowNameList: false, //名称分类是否显示
      isShowNotMore: false,
      isSelectMartType: false,
      arrayWay: 1,
      isSelectThemeClass: false,
      isSelectCommodityCategoryId: false,
      copyrightList: [],
      deriveList: [],
      showFigLeaf: false,
      searchParamsArr: [], //存贮用户搜索参数记录
      isGoOnGetList: true,
      isPc: false,
      loading: true, //加载
      showEmpty: false, //空数据
      showButtomLoading: false, //显示加载更多文本
      loadingMore: true, //是否加载更多
      transform: false,
      errTip: "",
      flag: {
        mobileSearch: false, //移动端选项卡搜索弹出框
        showSearchFixed: false, //是否显示input框搜索列表
        searchResult: false, //input搜索是否有结果
        goodsList: null, //input框商品搜索结果
        searchString: null,
      },
      searchActive: {}, //已选择的选项  点击X进行删除
      //选项
      searchOptions: {},
      searchValue: {
        orderValue: 0,
        highPrice: "",
        lowPrice: "",
      },
      goodsListParam: {
        authorId: null,
        chainContract: null,
        commodityCategoryId: null,
        commodityCategoryIdList: [],
        commodityId: null,
        highPrice: null,
        lowPrice: null,
        pageCount: 1,
        pageSize: 20,
        seriesWorks: null,
        seriesWorksId: null,
        sort: null,
        statusSell: 1,
        topicId: null,
        typeMarket: null,
        typeSale: "",
      },
      goodsListResult: {
        current: 0,
        size: 0,
        total: 0,
      },
      goodsListArr: [],
      resetSearchParam: {
        searchValue: {},
        searchActive: {},
        searchOptions: {},
      },
      searchHeight: 0,
      hotParams: {
        categoryUuid: "",
        name: "",
        pageCount: 1,
        pageSize: 40,
      },
      isSearch: true,

      searchOption: {
        pageCount: 1,
        pageSize: 16,
        name: "",
      },
      hotLoad: true,
      searchClear: null,
      searchInfo: null,
      searchValueP: null,
      traitList: [], //特性分类数据
      total: 0,
      typeMarket: "",
    };
  },
  watch: {
    $route: function (to, from) {
      this.routeChange();
    },
    searchOptions: {
      handler: function (val) {
        this.isSelectThemeClass = val["themeClass"].children.find(
          (item) => item.active
        )
          ? true
          : false;
        this.isSelectMartType = val["typeMarket"].children.find(
          (item) => item.active
        )
          ? true
          : false;
        this.isSelectCommodityCategoryId = val[
          "commodityCategoryId"
        ].children.find((item) => item.active)
          ? true
          : false;
      },
      deep: true,
    },
    categoryList(val) {
      const list = JSON.parse(JSON.stringify(val));
      const _list = [];
      if (list && list.length > 0) {
        const fn = (info) => {
          if (info.childrens && info.childrens.length > 0) {
            info.open = true;
            _list.push(info);
            //确定选中哪个子类
            const childInfo = info.childrens.find((item) => item.selected);
            if (childInfo) {
              fn(childInfo);
            }
          }
        };
        fn(list[0]);
      }
      this.menuList = _list;
    },
  },
  created() {
    this.isPc = !this.$common.isMobile();
    this.pageInit();
    window.addEventListener("scroll", this.scrollToTop);
    window.onresize = () => {
      return (() => {
        this.isPc = !this.$common.isMobile();
      })();
    };
  },
  mounted() {},
  methods: {
    async getPrepayMenu() {
      const res = await this.$api.service.saleRecord_supportFilterList({
        from: "market",
      });

      if (
        res &&
        res.data.code == 200 &&
        res.data.data &&
        res.data.data.length > 0 &&
        res.data.data[0].options &&
        res.data.data[0].options.length > 0
      ) {
        //预定金参数初始化
        let prepayMenu = [
          {
            childLevelName: res.data.data[0].name,
            level: 11,
            childrens: res.data.data[0].options.map((item) => {
              item.selected = false;
              return item;
            }),
            open: true,
          },
        ];

        if (this.$route.query.prepay_type && prepayMenu && prepayMenu[0]) {
          if (prepayMenu[0].childrens && prepayMenu[0].childrens.length > 0) {
            const menuIdx = prepayMenu[0].childrens.findIndex(
              (item) => item.dataValue == this.$route.query.prepay_type
            );
            if (menuIdx >= 0) {
              const menuItem = prepayMenu[0].childrens[menuIdx];
              this.goodsListParam.typeSale = menuItem.dataValue;
              this.selectedCategoryList.push({
                name: menuItem.name,
              });
              console.log(this.selectedCategoryList);
              prepayMenu = this.prepayCreateParams(prepayMenu, menuIdx);
            }
          }
        }
        this.prepayMenu = prepayMenu;
      }
    },
    prepayMenuHandle({ menuItem, menuIdx }) {
		this.$sensors.track(this.sensousClickEvent, {
			module_name: "左侧筛选栏",
			button_name:menuItem.name
		});
      this.$store.commit("setMarketRouteChange", false);
      this.$router.push({
        query: { ...this.$route.query, prepay_type: menuItem.dataValue },
      });
      /*       this.selectedCategoryList.push({
          name: this.currentPrepayObj.name,
          sellType: true,
        }); */
      const sellIdx = this.selectedCategoryList.findIndex(
        (item) => item.sellType
      );
      const CategoryItem = {
        name: menuItem.name,
        sellType: true,
      };
      let selectedCategoryList = JSON.parse(
        JSON.stringify(this.selectedCategoryList)
      );
      if (sellIdx == -1) {
        selectedCategoryList.push(CategoryItem);
      } else {
        selectedCategoryList[sellIdx] = CategoryItem;
      }
      this.selectedCategoryList = selectedCategoryList;
      this.prepayMenu = this.prepayCreateParams(this.prepayMenu, menuIdx);
      this.goodsListParam.typeSale = menuItem.dataValue;
      this.cleargoodsListData();
    },
    prepayCreateParams(arr, menuIdx) {
      let prepayMenu = JSON.parse(JSON.stringify(arr));

      prepayMenu[0].childrens = prepayMenu[0].childrens.map((item, idx) => {
        item.selected = menuIdx == idx;
        return item;
      });
      return prepayMenu;
    },
    restPrepayMenu() {
      const sellIdx = this.selectedCategoryList.findIndex(
        (item) => item.sellType
      );
      if (sellIdx >= 0) {
        this.selectedCategoryList.splice(sellIdx, 1);
      }
      if (this.prepayMenu && this.prepayMenu[0]) {
        let prepayMenu = JSON.parse(JSON.stringify(this.prepayMenu));
        prepayMenu[0].childrens = prepayMenu[0].childrens.map((item, idx) => {
          item.selected = false;
          return item;
        });
        this.prepayMenu = prepayMenu;
        this.goodsListParam.typeSale = "";
      }
    },
    menuHandle({ menuItem, menuIdx }) {
		this.$sensors.track(this.sensousClickEvent, {
			module_name: "左侧筛选栏",
			button_name:menuItem.name
		});
      console.log("menu-change");
      this.restPrepayMenu();
      this.categoryId = menuItem.id;
      this.$store.commit("setMarketRouteChange", false);

      if (menuItem.id == "f34b047edd05ddcd7d39df4ca106d214") {
        this.goodsListParam.typeMarket = 1;
      }
      if (menuItem.id == "7928dcb378475f97688da730ef0e0658") {
        this.goodsListParam.typeMarket = 2;
      }

      if (menuItem.id == "ffece0ec1ffe75ff7ddd252e4f375d8f") {
        this.goodsListParam.typeMarket = 3;
      }

      this.$router.push(
        `/market?type=${this.goodsListParam.typeMarket}&category_id=${menuItem.id}`
      );
      console.log(this.goodsListParam.typeMarket);
      this.createSelected(menuItem.id, menuItem.level);
      console.log(this.goodsListParam.typeMarket);
      this.goodsListParam.commodityId = "";
      this.removeAllElement();
      this.traitList = [];
      this.nameList = [];
      this.goodsListParam.commodityTraitList = [];

      this.cleargoodsListData();
      this.checkBlock();
    },
    async checkBlock(evl, trait_type, value_name) {
      this.nameList = [];
      this.nameListParams.pageCount = 1;
      if (this.selectedCategoryStatus.length == 1) {
        //说明到了最后一级了
        if (this.goodsListParam.typeMarket == 1) {
          this.isSelectCommodityCategoryId = true;
          this.isShowElementList = true;
          await this.getCommodityTraitList(
            this.selectedCategoryStatus[0],
            trait_type,
            value_name,
            evl
          );
        }
        if (this.goodsListParam.typeMarket == 2) {
          this.isSelectCommodityCategoryId = false;
          this.isShowElementList = false;
          this.nameListParams.commodityCategoryId =
            this.selectedCategoryStatus[0];

          this.nameList = [];
          this.nameListParams.pageCount = 1;

          await this.getNameList();

          this.removeAllElement();
          this.isShowNameList = true;
        }
      }
    },

    createSelected(category_id, level) {
      //同级别selected去除，

      const fn = (info) => {
        if (info.childrens && info.childrens.length > 0) {
          for (let i = 0; i < info.childrens.length; i++) {
            let childInfo = info.childrens[i];
            try {
              if (childInfo.level >= level) {
                childInfo.selected = false;
              }
              if (childInfo.id == category_id) {
                childInfo.selected = true;
                this.selectedCategoryObj[`${childInfo.level}`] = childInfo;
              }
              fn(childInfo);
            } catch (e) {}
          }
        }
      };
      const _categoryList = JSON.parse(JSON.stringify(this.categoryList));
      fn(_categoryList[0]);
      this.selectedCategoryList = this.createSelectedCategoryList(level);
      this.categoryList = _categoryList;
    },
    createSelectedCategoryList(level) {
      let _list = [];

      for (let key in this.selectedCategoryObj) {
        const info = this.selectedCategoryObj[key];
        if (info && key <= level) {
          _list.push(info);
        }
      }
      //生成市场参数
      const obj = _list[_list.length - 1];
      if (obj) {
        this.createCategoryParams(obj.id);
      }

      return _list;
    },
    createCategoryParams(category_id) {
      //生成市场分类参数
      let params = [];
      const info = this.findCategoryObj(category_id).obj;
      if (info) {
        params.push(info.id);
        const fn = (info) => {
          if (info.childrens && info.childrens.length > 0) {
            for (let i = 0; i < info.childrens.length; i++) {
              let childInfo = info.childrens[i];
              params.push(childInfo.id);
              fn(childInfo);
            }
          }
        };
        fn(info);
      }
      if (info.level == 2) {
        if (info.id == "f34b047edd05ddcd7d39df4ca106d214") {
          this.goodsListParam.typeMarket = 1;
          this.goodsListParam.commodityCategoryIdList = [];
        } else if (info.id == "7928dcb378475f97688da730ef0e0658") {
          this.goodsListParam.typeMarket = 2;
          this.goodsListParam.commodityCategoryIdList = [];
        } else if (info.id == "ffece0ec1ffe75ff7ddd252e4f375d8f") {
          this.goodsListParam.typeMarket = 3;
          this.goodsListParam.commodityCategoryIdList = [];
        } else {
          this.goodsListParam.commodityCategoryIdList = params;
          this.goodsListParam.typeMarket = "";
        }
      } else {
        this.goodsListParam.commodityCategoryIdList = params;
      }
      //子集&本身所有分类id
      this.selectedCategoryStatus = params;
    },

    findCategoryObj(category_id) {
      let obj = "";
      let isFind = false;
      let arr = [];
      let testArr = [];
      const fn = (info) => {
        if (isFind) {
          return;
        }
        if (info.childrens && info.childrens.length > 0) {
          for (let i = 0; i < info.childrens.length; i++) {
            if (!isFind) {
              let childInfo = info.childrens[i];
              arr.push(childInfo);
              testArr.push(childInfo.name);
              if (category_id == childInfo.id) {
                obj = childInfo;
                isFind = true;
              } else {
                fn(childInfo);
              }
            }
          }
        }
      };
      fn(this.categoryList[0]);

      return {
        obj: obj || "",
        list: arr.splice(arr.length - obj.level + 1, arr.length),
      };
    },
    listenCoverClick(goodsInfo) {
		this.$sensors.track(this.sensousClickEvent, {
			module_name: "商品详情"
		});
      const url = `${window.location.pathname}${window.location.search}`;
      localStorage.setItem("VISITOR-LINK", url);
      this.$common.goPage(`/goods/${goodsInfo.id}`, "_blank");
    },

    async onRemoveAllElement() {
      this.$store.commit("setMarketRouteChange", false);
      this.$router.push(
        `/market?type=${this.goodsListParam.typeMarket}&category_id=${this.categoryId}`
      );
      this.removeAllElement();
      this.initList();
    },
    rest() {
      this.searchInfo = null;
      this.isGoOnGetList = true;
      (this.isShowNotMore = false), (this.searchActive = {});
      this.searchOptions = JSON.parse(JSON.stringify(MENU));
      this.traitList = [];

      this.goodsListParam = {
        authorId: null,
        chainContract: null,
        commodityCategoryId: null,
        commodityCategoryIdList: [],
        commodityId: null,
        highPrice: null,
        lowPrice: null,
        pageCount: 1,
        pageSize: 20,
        seriesWorks: null,
        seriesWorksId: null,
        sort: null,
        statusSell: 1,
        topicId: null,
        typeMarket: null,
      };
    },
    async pageInit() {
      this.rest(); //所有数据重置

      //小老虎
      this.getConfig();
      //获取三级分类信息
      await this.getThemeClass();
      //获取预定金分类信息
      await this.getPrepayMenu();
      //地址栏参处理
      this.urlParamsHandle();

      this.initParam();

      //document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    routeChange() {
      if (!this.$store.state.isMarketRouteChange) {
        setTimeout(() => {
          this.$store.commit("setMarketRouteChange", true);
        }, 200);
        return;
      }
      console.log(123);
      this.restPrepayMenu();
      this.rest();
      //地址栏参处理
      this.urlParamsHandle();
      //根据参数设置市场类型参数
      this.setMarketTypeClass(this.goodsListParam.typeMarket);
      this.initParam();
      //获取数据
    },
    async initParam() {
      let category_id;
      if (this.goodsListParam.typeMarket == 1) {
        category_id = "f34b047edd05ddcd7d39df4ca106d214";
      }
      if (this.goodsListParam.typeMarket == 2) {
        category_id = "7928dcb378475f97688da730ef0e0658";
      }
      if (this.goodsListParam.typeMarket == 3) {
        category_id = "ffece0ec1ffe75ff7ddd252e4f375d8f";
      }

      if (this.$route.query.category_id) {
        category_id = this.$route.query.category_id;
      }
      if (category_id) {
        this.searchValue.orderValue = 2;
        this.createSortParams(2);
        this.categoryId = category_id;
        const list = this.findParent(
          this.categoryList,
          (data) => data.id === category_id
        );

        if (list.length > 0) {
          for (let i = 1; i < list.length; i++) {
            this.createSelected(list[i].id, list[i].level);
          }
        }

        this.commodity_id = this.$route.query.commodity_id;

        let trait_type = this.$route.query.trait_type;
        let value_name = this.$route.query.value_name;

        trait_type = trait_type ? decodeURIComponent(trait_type) : "";
        value_name = value_name ? decodeURIComponent(value_name) : "";
        if (trait_type && value_name) {
          this.goodsListParam.commodityTraitList = [
            {
              traitType: trait_type,
              traitValueList: [value_name],
            },
          ];
        } else {
          this.goodsListParam.commodityTraitList = [];
        }
        await this.checkBlock(this.$route.query.evl, trait_type, value_name);
        const name_id = this.$route.query.name_id;
        if (name_id) {
          const idx = this.nameList.findIndex((item) => item.id == name_id);
          if (idx !== -1) {
            this.commodity_id = idx;
          }
        }
        if (Number(this.commodity_id) >= 0) {
          this.createNameListParams(this.commodity_id);
        }

        if (this.$route.query.evl) {
          this.createTraitList();
        }

        this.cleargoodsListData();
      }
      if (this.$route.query.key) {
        this.selectedCategoryList.push({
          name: this.$route.query.key,
        });
      }
      if (this.$route.query.prepay_type && this.currentPrepayObj) {
        this.selectedCategoryList.push({
          name: this.currentPrepayObj.name,
          sellType: true,
        });
      }
    },
    findParent(tree, func, path = []) {
      if (!tree) return [];
      for (const data of tree) {
        // 这里按照你的需求来存放最后返回的内容吧
        path.push(data);
        if (func(data)) return path;
        if (data.childrens) {
          const findChildren = this.findParent(data.childrens, func, path);
          if (findChildren.length) return findChildren;
        }
        path.pop();
      }
      return [];
    },

    urlParamsHandle() {
      this.createSortParams(4);
      this.searchValue.orderValue = 4;
      //地址栏参数处理并生成对应的请求参数

      let typeMarket = this.$route.query.type;

      if (!typeMarket) {
        typeMarket = "copyright";
      }
      //进入不同的市场类型
      if (!typeMarket) {
        typeMarket = "copyright";
      }
      if (typeMarket == "copyright" || typeMarket == 1) {
		  this.$sensors.track('main_pageview', {
		    module_name: "版权品"
		   });
		   this.sensousClickEvent = "authoritypage_click"
        this.goodsListParam.typeMarket = "1";
      }
      if (typeMarket == "derive" || typeMarket == 2) {
		  this.$sensors.track('main_pageview', {
		    module_name: "衍生品"
		   });
		   this.sensousClickEvent = "derivationpage_click"
        this.goodsListParam.typeMarket = "2";
      }
      if (typeMarket == 3) {
        this.goodsListParam.typeMarket = "3";
      }
      // 关键字进入界面
      const key = this.$route.query.key;

      if (key) {
        this.searchActive["key"] = { name: key, key: "key" }; //已经选择的顶部key
      }

      if (this.$route.query.id) {
        //商品id
        this.goodsListParam.commodityId = this.$route.query.id;
        this.searchOptions.themeClass.show = false;
        this.searchValue.orderValue = 2;
        this.createSortParams(2);
      }
    },
    async getConfig() {
      const res = await this.$api.service.config_getConfigByType({
        type: 4,
      });
      if (
        res.data.code == 200 &&
        res.data.data.confValue3 &&
        res.data.data.confValue3.toUpperCase() == "ON"
      ) {
        this.marketMessage = res.data.data.confValue4;

        this.showFigLeaf = true;
      }
    },
    mSearchScroll(e) {
      const el = e.target;

      if (el.scrollTop + el.clientHeight >= el.scrollHeight && this.isSearch) {
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
        const _ary = [...this.flag.goodsList, ...res.data.records];
        this.flag.goodsList = this.$common.uniqueAry(_ary, "id");
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    },

    mHotScroll(e, info) {
      const el = e.target;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        if (this.hotParams.pageCount < this.hotResult.pages) {
          this.hotLoad = false;
          this.hotParams.pageCount++;
          this.getHot();
        }

        return false;
      }
    },
    scrollToTop() {
      if (this.$refs.marketList) {
        var scrollTop =
          document.documentElement.scrollTop ||
          window.pageYOffset ||
          document.body.scrollTop;
        const domPostion = this.$refs.marketList.getBoundingClientRect();
        var fullHeight = domPostion.height;

        if (
          fullHeight - (scrollTop + document.body.clientHeight) <= 300 &&
          this.loadingMore
        ) {
          if (this.loading) {
            return;
          }
          this.loadingMore = false;
          this.goodsListParam.pageCount++;
          /*
          if (this.goodsListParam.pageCount <= this.goodsListResult.pages) {
            this.scrollGetGoodsList();
          } */

          if (this.isGoOnGetList) {
            this.scrollGetGoodsList();
            //  this.scrollGetGoodsList();
          }
        }
      }
    },

    //获取市场分类数据
    async getThemeClass() {
      let result = await this.$api.service.commodityCategory_list_v2({
        fid: "561f30937d5798f6da1de70c14546f99",
      });
      if (result && result.data.data.length > 0) {
        this.themeClassList = result.data.data;
        this.categoryList = result.data.data;
      }
      if (result.data.code == 1010) {
        this.transform = true;
      }
    },

    // 加载失败重新触发更新
    errUpDateData() {
      if (this.goodsListParam.pageCount == 1) {
        this.pageInit();
      } else {
        this.scrollGetGoodsList();
      }
    },

    //
    onSearchByInput(e) {
		let sortTxt = "";
		if(e==2){
			sortTxt="价格从低到高"
		}else if(e==3){
			sortTxt="价格从高到低"
		}
		else if(e==4){
			sortTxt="按照时间顺序"
		}
		this.$sensors.track(this.sensousClickEvent, {
			module_name: "右侧排序",
			arrangement:sortTxt
		});
      this.searchValueP = e;
      const arr = Object.keys(this.searchActive);
      if (this.searchActive.statusSell && arr.length == 1) {
        this.$message.warning("请先选择具体品类");
        return;
      }

      if (this.marketBtnDisabledInfo.code !== -1) {
        const nowDay = new Date().getDate();
        const sigDay = this.marketBtnDisabledInfo.time.getDate();
        if (nowDay == sigDay) {
          this.checkBrush(this.marketBtnDisabledInfo.code);
          return;
        }
      }
      this.cleargoodsListData();
    },
    //点击选中进行搜索 再次点击取消选中进行搜索

    onSearchByClick(currentOptionInfo, selectItem) {},

    addClass() {
      const sInfo = { ...this.searchInfo };
      const { currentOptionInfo, selectItem } = sInfo;
      const options = { ...this.searchOptions };

      options[currentOptionInfo.key].children.forEach((item) => {
        item.active = false;
      });
      this.searchOptions = options;
      selectItem.active = true;
      this.searchInfo.selectItem = selectItem;
    },
    changeSearchActive(info) {
      //跟新顶部导航ui
      const { currentOptionInfo, selectItem } = info || this.searchInfo;
      this.searchActive = {
        ...this.searchActive,
        [currentOptionInfo.key]: {
          name: selectItem.name,
          key: currentOptionInfo.key,
          value: selectItem.value,
        },
      };
    },

    initList() {
      this.isShowNotMore = false;
      document.documentElement.scrollTop = 0;

      this.goodsListParam.pageCount = 1;
      this.goodsListParam.commodityId = null;
      this.createTraitList();

      this.getGoodsList();
    },
    createTraitList() {
      let commodityTraitList = [];
      for (let i = 0; i < this.traitList.length; i++) {
        const list = this.traitList[i].traitValueList.filter(
          (item) => item.active
        );
        if (list.length > 0) {
          commodityTraitList.push({
            traitType: this.traitList[i].traitType,
            traitValueList: list.map((item) => {
              return item.traitValue;
            }),
          });
        }
      }
      this.goodsListParam.commodityTraitList = commodityTraitList;
    },

    addSearchClass() {
      const item = this.searchClear;
      if (this.searchClear) {
        delete this.searchActive[this.searchClear.key];
        if (item.key == "key") {
          this.goodsListParam.commodityId = "";
        }
        if (
          this.searchOptions[item.key] &&
          this.searchOptions[item.key].children
        ) {
          this.searchOptions[item.key].children.forEach((element) => {
            element.active = false;
          });
        }
        if (item.key == "sort") {
          this.searchValue.orderValue = 0;
        }
        this.searchClear = null;
      }
    },
    //搜索条件点击X  清除搜索
    onSearchClear(item) {
      this.searchClear = JSON.parse(JSON.stringify(item));
      if (this.marketBtnDisabledInfo.code !== -1) {
        const nowDay = new Date().getDate();
        const sigDay = this.marketBtnDisabledInfo.time.getDate();
        if (nowDay == sigDay) {
          this.checkBrush(this.marketBtnDisabledInfo.code);
          return;
        }
      }

      this.goodsListParam[item.key] = "";

      this.getGoodsList();
    },
    async getGoodsList() {
      this.getLGoddsListGo();
    },
    async getLGoddsListGo() {
      this.errTip = "";
      this.watchSelectHeight();
      try {
        let sigData = "";
        let sig = await this.$api.service.goods_key();
        if (sig.data.code == 200) {
          let dataresult = aes.decrypt(sig.data.data);
          let dataResultFun = dataresult.split(",")[0].substr(4);
          let dataResultId = dataresult.split(",")[1].split("=")[1];
          let sigresult = eval(dataResultFun);
          sigData = aes.encryptSelf(dataResultId, sigresult);
        }

        //价格赋值
        this.goodsListParam.highPrice = this.searchValue.highPrice;
        this.goodsListParam.lowPrice = this.searchValue.lowPrice;
        //排序处理
        this.createSortParams(this.searchValueP);

        if (this.goodsListParam.pageCount <= 1) {
          this.loading = true;
        }
        this.isGoOnGetList = true;
        this.searchParamsArr.push(
          JSON.parse(JSON.stringify(this.goodsListParam))
        );

        let result = await this.$api.service.saleRecord_list_v2(
          this.goodsListParam,
          null,
          sigData
        );

        this.loading = false;
        this.$previewRefresh();

        if (result.data.code == 200) {
          const goodsListResult = result.data.data;
          this.total = result.data.data.total;
          //添加样式
          /*    if (this.searchClear) {
            delete this.searchActive[this.searchClear.key];
          } */
          if (this.searchValueP) {
            this.searchValue.orderValue = this.searchValueP;
          }
          this.searchValueP = null;
          if (this.searchClear) {
            this.addSearchClass();
          }

          if (this.searchInfo) {
            this.addClass(this.searchInfo.item, this.searchInfo.selectItem);
          }
          this.searchInfo = null;

          if (
            goodsListResult &&
            goodsListResult.records &&
            goodsListResult.records.length > 0
          ) {
            this.goodsListArr = goodsListResult.records;
            this.showEmpty = false;
            let timer = setTimeout(() => {
              this.loadingMore = true;
            }, 500);
          } else {
            this.showEmpty = true;
          }
        } else {
          if (result.data.code == 1010) {
            this.showEmpty = true;
            this.errTip = result.data.message;
          }

          if (result.data.code == 1005 || result.data.code == 1007) {
            let timer = setTimeout(() => {
              this.loadingMore = true;
            }, 500);
            if (result.data.code == 1007) {
              this.showEmpty = this.goodsListArr.length <= 0;
              this.errTip = `未进行验证码验证，暂时无法使用市场功能，请完成验证码验证`;
            }
            if (result.data.code == 1005) {
              this.showEmpty = this.goodsListArr.length <= 0;
              this.errTip = result.data.message;
            }

            this.checkBrush(result.data.code);
          } else if (result.data.code == 1006) {
            this.showEmpty = this.goodsListArr.length <= 0;
          } else if (result.data.code == 1009) {
            this.showEmpty = true;
            this.errTip = result.data.message;
          } else {
            this.showEmpty = true;
          }
        }
      } catch (error) {}
    },
    createSortParams(val) {
      if (val > 0) {
        if (val == 1) {
          this.goodsListParam.sort = {
            field: 1,
            upOrDown: 1, //时间升序
          };
        } else if (val == 2) {
          this.goodsListParam.sort = {
            field: 2,
            upOrDown: 1, //价格升序
          };
        } else if (val == 3) {
          this.goodsListParam.sort = {
            field: 2,
            upOrDown: 2, //价格降序
          };
        } else if (val == 4) {
          this.goodsListParam.sort = {
            field: 1,
            upOrDown: 2, //时间倒序
          };
        }
      } else if (val == 0) {
        this.goodsListParam.sort = null;
      }
    },
    async scrollGetGoodsList() {
      this.showButtomLoading = true;
      this.goOnScroll();
    },
    async goOnScroll() {
      let result = await this.$api.service.saleRecord_list_v2(
        this.goodsListParam
      );
      this.$previewRefresh();

      // result.data.data.records.forEach((item)=>{
      //   this.goodsListArr.push(item)
      // })
      if (result.data.code == 200) {
        const goodsListResult = result.data.data;
        this.total = result.data.data.total;
        if (
          goodsListResult &&
          goodsListResult.records &&
          goodsListResult.records.length > 0
        ) {
          this.isGoOnGetList = true;
          let resAry = [...this.goodsListArr, ...result.data.data.records];
          this.goodsListArr = this.$common.uniqueAry(resAry, "id");

          let timer = setTimeout(() => {
            this.loadingMore = true;
          }, 500);
        } else {
          this.isShowNotMore = true;
          this.isGoOnGetList = false;
        }
      } else {
        this.isGoOnGetList = false;
        if (result.data.code == 1005 || result.data.code == 1007) {
          this.checkBrush(result.data.code);
        } else {
        }
      }
      this.showButtomLoading = false;
    },
    checkBrush(code) {
      this.$store.commit("setmarketBtnDisabledInfo", {
        code,
        time: new Date(),
      });
      this.$store.commit("setAntiBrush", {
        code,
        isShow: true,
      });
    },
    //商品喜欢与取消
    async likeGoods(info) {
      const { id, like, index } = info;
      let likeGoodsParm = {
        dataId: id,
        type: 2,
        dataType: 2,
      };
      if (like) {
		  this.$sensors.track(this.sensousClickEvent, {
			module_name:"商品详情",
		  	goods_save: "取消收藏"
		  });
        let result = await this.$api.service.userLike_operation(likeGoodsParm);
        if (result.data.code == 200) {
          this.$message.success("取消成功");
          this.goodsListArr[index].like = false;
          this.goodsListArr[index].commodity.amountLike--;
          if (this.goodsListArr[index].commodity.amountLike <= 0) {
            this.goodsListArr[index].commodity.amountLike = 0;
          }
        } else if (result.data.code !== 401) {
          this.$message.error(result.data.message);
        }
      } else {
		  this.$sensors.track(this.sensousClickEvent, {
			module_name:"商品详情",
		  	goods_save: "收藏"
		  });
        likeGoodsParm.type = 1;
        let result = await this.$api.service.userLike_operation(likeGoodsParm);
        if (result.data.code == 200) {
          this.$message.success("成功");
          this.goodsListArr[index].like = true;
          this.goodsListArr[index].commodity.amountLike++;
        } else if (result.data.code !== 401) {
          this.$message.error(result.data.message);
        }
      }
    },
    // handleCurrentChange(val) {
    //   this.goodsListParam.pageCount = val;
    //   this.getGoodsList();
    // },
    //input框按名称搜索
    async onSearchByGoodsName(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getSearchInfo(e.target.value);
      }, 300);
    },
    getSearchInfo(name) {
      this.flag.searchResult = true;
      this.searchOption.name = name;
      this.flag.goodsList = [];
      this.searchOption.pageCount = 1;
      this.getSearchList();
    },
    //商品搜索跳转
    searchGoodsList(info) {
      this.flag.showSearchFixed = false;
      this.flag.searchString = null;
      this.$router.push(
        `/market?id=${info.id}&key=${encodeURIComponent(info.name)}&type=${
          info.typeMarket
        }`
      );
    },
    goNextPage(item, event) {
      if (!event.target.src) {
        this.$common.goPage(`/goods/${item.id}`, "_blank");
      }
    },
    // 显示大图
    showBigPic(key) {
      this.$previewRefresh();
      document.getElementById(key).click();
    },
    //条件查询清空数据
    cleargoodsListData() {
      this.loading = true;
      this.goodsListParam.pageCount = 1;
      this.goodslistArr = [];
      document.documentElement.scrollTop = 0;
      this.getGoodsList();
    },
    //监听已选择选项卡高度
    watchSelectHeight() {
      /*       this.$nextTick(() => {
        if (this.isPc) {
          this.searchHeight = 90;
        } else {
          this.searchHeight = 90;
        }
      }); */
    },
    getTimesort() {
      if (this.marketBtnDisabledInfo.code !== -1) {
        const nowDay = new Date().getDate();
        const sigDay = this.marketBtnDisabledInfo.time.getDate();
        if (nowDay == sigDay) {
          this.checkBrush(this.marketBtnDisabledInfo.code);
          return;
        }
      }
      /*  this.createSortParams(1); */

      //searchValueP控制参数searchValue控制ui

      if (this.searchValue.orderValue && this.searchValue.orderValue > 0) {
        if (this.searchValue.orderValue == 1) {
          this.searchValueP = 4;
        } else {
          this.searchValueP = 1;
        }
      } else {
        this.searchValueP = 1;
      }
      this.createSortParams(this.searchValueP);
      this.cleargoodsListData();
    },
    getPricesort() {
      if (this.marketBtnDisabledInfo.code !== -1) {
        const nowDay = new Date().getDate();
        const sigDay = this.marketBtnDisabledInfo.time.getDate();
        if (nowDay == sigDay) {
          this.checkBrush(this.marketBtnDisabledInfo.code);
          return;
        }
      }

      if (this.searchValue.orderValue && this.searchValue.orderValue > 0) {
        if (this.searchValue.orderValue == 2) {
          this.searchValueP = 3;
        } else {
          this.searchValueP = 2;
        }
      } else {
        this.searchValueP = 2;
      }
      this.createSortParams(this.searchValueP);
      this.cleargoodsListData();
    },
    //设置主题分类样式
    setMarketTypeClass(type) {
      console.log(this.searchOptions.typeMarket.children);
      const typeIdx = this.searchOptions.typeMarket.children.findIndex(
        (item) => item.value == type
      );
      const typeInfo = this.searchOptions.typeMarket.children[typeIdx];
      this.bodyTitle = typeInfo.name;
      this.searchActive["typeMarket"] = {
        name: typeInfo.name,
        key: "typeMarket",
        value: typeInfo.value,
      };
      this.searchOptions.typeMarket.children.forEach((item, idx) => {
        item.active = idx == typeIdx;
      });
      //设置市场类型对应的标签分类数据
      if (type == 1) {
        this.searchOptions.themeClass.children = JSON.parse(
          JSON.stringify(this.copyrightList)
        );
      }
      if (type == 2) {
        this.searchOptions.themeClass.children = JSON.parse(
          JSON.stringify(this.deriveList)
        );
      }
    },
    onPhoneRestElement() {
      console.log(12313);
      const list = JSON.parse(JSON.stringify(this.traitList));
      list[this.phoneElementIdx].traitValueList.forEach((item) => {
        item.active = false;
      });
      /*     list[this.phoneElementIdx].traitValueList = JSON.parse(
        JSON.stringify(this.resetElementList.traitValueList)
      ); */
      this.traitList = list;
    },
    onPhoneSearchElement(idx) {
      this.goodsListParam.pageCount = 1;
      this.initList();
      this.onPhoneToggleElement(idx);
    },
    createElementName(idx, name) {
      if (this.traitList[idx] && this.traitList[idx].traitValueList) {
        const elementInfo = this.traitList[idx].traitValueList.find((item) => {
          return item.active;
        });
        if (elementInfo) {
          if (this.phoneElementIdx == idx) {
            return {
              name: elementInfo.traitValue,
              active: false,
            };
          } else {
            return {
              name: elementInfo.traitValue,
              active: true,
            };
          }
        } else {
          return {
            name,
            active: false,
          };
        }
      } else {
        return {
          name,
          active: false,
        };
      }
    },
    loadMoreName() {
      clearTimeout(this.nameTimer);
      this.nameTimer = setTimeout(() => {
        this.nameListParams.pageCount++;
        this.getNameList();
      }, 200);
    },
    onToggleNameList(idx) {
		this.$sensors.track(this.sensousClickEvent, {
			module_name: "左侧筛选栏"
		});
      //名称分类点击
      this.restPrepayMenu();

      this.$store.commit("setMarketRouteChange", false);
      this.$router.push(
        `/market?type=${this.goodsListParam.typeMarket}&category_id=${this.categoryId}&commodity_id=${idx}`
      );
      this.createNameListParams(idx);

      this.cleargoodsListData();
    },
    createNameListParams(idx) {
      let list = [...this.nameList];
      list = list.map((item, idx2) => {
        if (idx == idx2) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
      this.nameList = list;
      this.goodsListParam.commodityId = list[idx].active ? list[idx].id : "";
      const isIdx = this.selectedCategoryList.findIndex((item) => item.id == 1);
      if (isIdx >= 0) {
        this.selectedCategoryList.splice(isIdx, 1);
      }
      if (list[idx].active) {
        this.goodsListParam.commodityId = list[idx].id;

        this.searchActive.nameType = {
          key: "nameType",
          name: list[idx].name,
          value: "",
        };
        this.selectedCategoryList.push({
          name: list[idx].name,
          id: 1,
        });
      } else {
        this.goodsListParam.commodityId = "";
        delete this.searchActive.nameType;
      }
    },
    onPhoneSelectElement(idx) {
      const list = [...this.traitList];
      list[this.phoneElementIdx].traitValueList[idx].active =
        !list[this.phoneElementIdx].traitValueList[idx].active;
      this.traitList = list;
    },
    onPhoneToggleElement(idx) {
      this.phoneElementIdx = this.phoneElementIdx == idx ? -1 : idx;
      if (this.phoneElementIdx !== -1) {
        this.resetElementList = JSON.parse(JSON.stringify(this.traitList[idx]));
      }
    },
    removeAllElement() {
      this.traitList = this.traitList.map((item) => {
        item.traitValueList = item.traitValueList.map((item) => {
          item.active = false;
          return item;
        });
        return item;
      });
    },
    onRemoveElement(info) {
      this.onToggleEVal(info.idx[0], info.idx[1]);
    },
    toggleArrayWay() {
      this.arrayWay = this.arrayWay == 1 ? 2 : 1;
    },
    onToggleElementList(idx) {
      const list = [...this.traitList];
      list[idx].active = !list[idx].active;

      this.traitList = list;
    },
    onToggleEVal(idx1, idx2) {
      this.restPrepayMenu();
      const list = [...this.traitList];
      list[idx1].traitValueList[idx2].active =
        !list[idx1].traitValueList[idx2].active;
      this.traitList = list;
      this.selectedTraitList = [];
      list.forEach((item, idx) => {
        if (item.active) {
          item.traitValueList.forEach((item2, idx2) => {
            if (item2.active) {
              this.selectedTraitList.push(`${idx}-${idx2}`);
            }
          });
        }
      });
      this.$store.commit("setMarketRouteChange", false);
      const evl = this.selectedTraitList.join(",");
      if (this.categoryId) {
        this.$router.push(
          `/market?type=${this.goodsListParam.typeMarket}&category_id=${this.categoryId}&evl=${evl}`
        );
      }
      this.createTraitList();
      this.cleargoodsListData();

      /*      this.initList(); */
    },
    async getCommodityTraitList(commodityCategoryId, type, val, evl) {
      //获取特性分类信息
      const res = await this.$api.service.commodityTrait_statistics({
        commodityCategoryId,
      });
      if (res.data.code == 200) {
        if (res.data.data && res.data.data) {
          let evlArr = [];
          if (evl) {
            evlArr = evl.split(",");
          }
          function findSelectedEvl(idx) {
            for (let i = 0; i < evlArr.length; i++) {
              if (idx == evlArr[i]) {
                return true;
              }
            }
            return false;
          }

          this.traitList = res.data.data.map((item, idx) => {
            item.active = type == item.traitType;
            item.traitValueList = item.traitValueList.map((item2, idx2) => {
              item2.active = item2.traitValue == val;
              if (!item2.active) {
                item2.active = findSelectedEvl(`${idx}-${idx2}`);
                if (item2.active) {
                  item.active = true;
                }
              }
              return item2;
            });
            return item;
          });
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    async getNameList() {
      //获取名称分类信息
      const res = await this.$api.service.commodity_search(this.nameListParams);
      if (res.data.code == 200) {
        if (res.data.data) {
          let nameList = res.data.data.records.map((item) => {
            item.active = false;
            return item;
          });
          if (
            this.nameListParams.pageSize > nameList.length ||
            nameList.length <= 0
          ) {
            this.isLoadNameList = false;
          } else {
            this.isLoadNameList = true;
          }
          this.nameList = this.$common.uniqueAry(
            [...this.nameList, ...nameList],
            "id"
          );
          /*      localStorage.setItem(
            "nameList",
            JSON.stringify({
              data: this.nameList,
              params: this.nameListParams,
            })
          ); */
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    //默认展示在售
    setStatusSellClass(type) {
      /*     this.searchOptions.statusSell.children.forEach((item) => {
        if (item.value == type) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
      this.searchActive.statusSell = {
        key: "statusSell",
        name: type == 1 ? "在售" : "售罄",
        value: type,
      }; */
    },
    // 显示移动端搜索选项卡
    onMobileSearch() {
      if (this.marketBtnDisabledInfo.code !== -1) {
        const nowDay = new Date().getDate();
        const sigDay = this.marketBtnDisabledInfo.time.getDate();
        if (nowDay == sigDay) {
          this.checkBrush(this.marketBtnDisabledInfo.code);
          return;
        }
      }
      this.flag.mobileSearch = true;
    },
    // 移动端搜索确定
    onSearchMobile() {
      //记录搜索选项，为 重置 功能提供数据初始化
      // this.resetSearchParam.searchValue = { ...this.searchValue };
      // this.resetSearchParam.searchActive = { ...this.searchActive };
      this.onSearchByInput();
      this.flag.mobileSearch = false;
    },
    // 移动端搜索重置
    onSearchMobileReset() {
      this.$router.push(`/market?type=${this.$route.query.type}`);
      this.restPrepayMenu();
      this.routeChange();
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("scroll", this.scrollToTop);
    next();
  },
};
</script>
<style lang="scss" scoped>
.overflow-x-auto {
  overflow-x: auto;
}
.v1-icon-question {
  background-size: 18px;
  padding-right: 22px;
}
.pc-sort-box {
  ::v-deep .el-input__inner {
    line-height: 30px;
    height: 30px;
  }
}
.market-list-pc {
  padding-bottom: 100px;
}
.infinite-list {
  max-height: 200px !important;
  overflow-y: auto;
}

.phone-select-element-wrap {
  position: relative;
  top: 0;
  left: 0;
  background-color: #fff;
  .bar {
    .title {
      word-break: keep-all;
      font-size: 0.24rem;
      font-weight: 400;
      color: #666666;
      padding: 0 0.15rem;
      max-width: 2rem;
      overflow: hidden;
      border: 1px solid #f9f9f9;
      .hidden-1 {
        flex: 1;
      }
      .ui-icon {
        transform: rotate(180deg);
        transition: all ease-out 0.26s;
      }
    }
    .select-element {
      background: rgba(230, 31, 26, 0.08);
      border-radius: 4px;
      border: 1px solid rgba(230, 31, 26, 0.5);
      color: #694444;
    }
  }
  .bar-active {
    background-color: #f9f9f9;
    .title {
      .ui-icon {
        transform: rotate(0);
      }
    }
  }
  .list-main {
    position: absolute;
    width: 100%;
    top: 0.56rem;
    left: 0;
    margin: 0;

    .mask {
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 0;
      left: 50%;
      height: 90vh;
      width: 100vw;
      transform: translateX(-50%);
      z-index: 1;
    }
  }
  .list-wrap {
    position: absolute;
    top: 0rem;
    left: 50%;
    background-color: #f9f9f9;
    z-index: 2;
    border-radius: 0 0 4px 4px;
    width: 100vw;
    transform: translateX(-50%);

    .list-wrap-main {
      max-height: 40vh;
      min-height: 2rem;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      padding: 0.23rem 0.4rem;
      .element-bar {
        width: 50%;
        overflow: hidden;
        font-size: 0.26rem;
        font-weight: 400;
        color: #666666;
        .element-info {
          padding: 0.15rem 0;
        }
      }
      .active-element-bar {
        color: #e61f1a;
        font-weight: bold;
      }
    }
    .ui-btn-group {
      padding: 0.1rem 0 0.46rem;
      > div {
        flex: 1;
        padding: 0 0.35rem;
        .ui-btn {
          border-radius: 100px;
          width: 100%;
          line-height: 0.7rem;
          height: 0.7rem;
        }
      }
    }
  }
  .main {
    display: flex;
    overflow-x: auto;
    margin: 0.21rem -0.05rem 0.1rem;
  }
  .element-message {
    font-size: 0.26rem;
    font-weight: 400;
    color: #666666;
    padding-bottom: 0rem;
  }
  .bar {
    padding-bottom: 0.2rem;
    margin: 0 0.05rem;
    .title {
      min-width: 1.12rem;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0.44rem;
      background: #f9f9f9;
      border-radius: 4px;

      .ui-icon {
        width: 0.24rem;
        height: 0.24rem;
        margin-left: 0.1rem;
      }
    }
  }
}
.select-element-wrap {
  display: flex;
  flex-wrap: wrap;
  position: relative;

  margin: -6px -5px 15px;
  .element-btn {
    line-height: 30px;
    background: #fdeded;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 400;
    color: #694444;
    padding: 0 12px 0 24px;
    margin: 8px 5px 0;
    cursor: pointer;
    .ui-icon {
      margin-left: 7px;
      width: 12px;
      height: 12px;
    }
  }
  .editor-txt-wrap {
    display: flex;
    align-items: center;
    .link-btn {
      color: #397fe7;
      padding-right: 6px;
      cursor: pointer;
    }
    color: #333333;
    font-size: 12px;
    padding-top: 8px;
    padding-left: 8px;
  }
}
.pc-menu-status {
  overflow-y: auto;
  overflow-x: hidden;
  ::v-deep .section {
    align-items: flex-start;
    padding: 30px 0;
  }
  ::v-deep .empty {
    position: inherit;
  }
}
.market-main-center {
  .com-empty {
    margin-top: 0vh;
  }
}
.icon-help {
  background-image: url("//static.theone.art/pc/icons/icon-help.png");
}
.icon-market-name {
  background-image: url("//static.theone.art/pc/market-2/icon-market-name.png");
}
.icon-phone-position {
  background-image: url("//static.theone.art/pc/icons/icon-phone-position.png");
}
.icon-e-close {
  background-image: url("//static.theone.art/pc/icons/icon-e-close.png");
}
.icon-direction {
  background-image: url("//static.theone.art/pc/images/pic-home/market-item-hide.png");
}
.icon-nav-1 {
  background-image: url("//static.theone.art/pc/images/nav/icon-nav-1.png");
}
.icon-nav-2 {
  background-image: url("//static.theone.art/pc/images/nav/icon-nav-2.png");
}
.icon-nav-3 {
  background-image: url("//static.theone.art/pc/images/nav/icon-nav-3.png");
}
.icon-nav-4 {
  background-image: url("//static.theone.art/pc/images/nav/icon-nav-4.png");
}
.ui-icon-one {
  background-image: url("//static.theone.art/pc/images/nav/icon-one.png");
}
.ui-icon-two {
  background-image: url("//static.theone.art/pc/images/nav/icon-two.png");
}
.icon-market-te {
  background-image: url("//static.theone.art/pc/market-2/icon-market-te.png");
}
.market-search-option {
  .tool-right {
    display: flex;
    align-items: center;
    .view-wrap {
      border-right: 1px solid #dddddd;
      padding: 0rem 0.4rem 0;
      margin-right: 0.3rem;
      height: 0.3rem;
      .ui-icon {
        width: 0.44rem;
        height: 0.44rem;
        margin-top: -0.05rem;
      }
    }
  }
}
.ui-menu-message {
  font-size: 12px;
  color: #666666;
  text-align: center;
  line-height: 100px;
}
.market-tip-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  .content {
    width: 338px;
    height: 338px;
    background-image: url("//static.theone.art/pc/market/market-tip.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin: 20vh auto;
    .message {
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.7);
      line-height: 20px;
      padding: 210px 50px 0;
      margin-bottom: 20px;
      word-break: break-all;
    }
  }
}
.market-search-hot {
  .status-template {
    max-height: 1rem;
    ::v-deepimg {
      display: none;
    }
    ::v-deep .section {
      align-items: flex-start;
    }
  }
}
.search-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 0px;
}
.mobile-scroll {
  max-height: 360px;
  overflow-y: auto;
}
.ui-market-tabs {
  height: calc(100vh - 130px);
  overflow-y: auto;
}
.pc-hot {
  max-height: 320px;
  overflow-y: auto;
}
.m-hot {
  overflow-x: auto;
}
.loading {
  height: 500px;
}
.buttomLoading {
  height: 100px;
}
.img-cover {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 20px;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .scal-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: url("//static.theone.art/pc/images/user1%402x.png") no-repeat;
    width: 24px;
    height: 24px;
    background-position: center;
    background-size: contain;
  }
}
.el-form {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.v1-goods-cover {
  position: relative;
  .cover-wrap {
    position: absolute;
  }
}
.v1-goods-cover {
  .view {
    background: url("//static.theone.art/pc/images/user1%402x.png") no-repeat;
    width: 24px;
    height: 24px;
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 199;
  }
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    // z-index: 1;
  }
}
.v1-goods-loading {
  font-size: 14px;
  color: #666;
  text-align: center;
  padding: 20px 0 40px;
}
.page-v1-market {
  display: flex;
  justify-content: flex-start;
  min-height: 100vh;
  &Bg {
    background-color: #fff;
  }
  .market-flex {
    display: flex;
    flex: 1;
    ::v-deep .van-overlay {
    }
  }
  .market-sift {
    width: 265px;
    height: 100%;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    background-color: #fff;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 2;
    .market-sift-line {
      cursor: pointer;
      background: url("//static.theone.art/pc/images/pic-home/market-item-hide.png")
        no-repeat 240px 16px;
      background-size: 14px 14px;
      .title,
      &.shrink {
        padding: 0 16px;
        display: flex;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        color: #333;
        /*     background: url("//static.theone.art/pc/images/pic-home/market-show.png")
          no-repeat 240px center;
        background-size: 14px 14px;
        padding-left: 36px; */
      }
      .ui-icon {
        width: 30px;
        height: 30px;
        margin-right: 4px;
      }
      .icon-help {
        width: 15px;
        height: 15px;
        position: relative;
        top: 2px;
      }

      .wrap {
        background: #f9f9f9;
        display: none;
      }
      &.show {
        background-image: url("//static.theone.art/pc/images/pic-home/market-item-show.png");
        .wrap {
          display: block;
        }
      }
      ul {
        align-items: center;
        flex-wrap: wrap;
        padding: 16px 12px;
        padding-bottom: 30px;
        display: flex;
        li {
          padding: 0 5px 5px;
          width: 50%;
          .ui-bar-title {
            overflow: hidden;
            border-radius: 4px;
          }
          .goods-element-list {
            overflow: hidden;
            border-radius: 4px;
          }
          div {
            background: #ffffff;
            border-radius: 4px;
            line-height: 30px;
            text-align: center;
            color: rgba(0, 0, 0, 0.7);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            // margin-bottom: 10px;

            // &:nth-child(2n + 1) {
            //   margin-right: 16px;
            // }
          }
        }
        .active {
          div {
            background: rgba(230, 31, 26, 0.2);
            /*            box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1); */
            color: #e61f1a;
          }
        }
      }
    }
  }
  .transform {
    transform: translateX(-220px);
    transition: all 0.3s;
    .shrink {
      transform: rotate(180deg);
      background: url("//static.theone.art/pc/images/pic-home/market-show.png")
        no-repeat 18px center;
      background-size: 14px 14px;
    }
  }
  .transform-false {
    .shrink {
      transform: rotate(0deg);
      background: url("//static.theone.art/pc/images/pic-home/market-show.png")
        no-repeat 18px;
      background-size: 14px 14px;
      background-position: center right;
      position: relative;
      right: 10px;
    }
  }
  .market-main-PC {
    width: 100%;
    min-width: 800px;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 1;
    background-color: #fff;
  }
  .market-main-search {
    .search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 15px;
      ::v-deep .el-form-item {
        margin-bottom: 0px;
      }
      ::v-deep .el-input__inner {
      }
      .navigation {
        color: rgba($color: #000000, $alpha: 0.6);
      }
      .price-input {
        width: 90px;
      }
      ::v-deep .el-button {
        background: transparent;
        border: none;
        color: #000000;
        height: 30px;
      }
    }
    .search-active {
      &-pc {
        margin-left: 290px;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          padding: 0px 20px;
          height: 30px;
          line-height: 30px;
          text-align: center;

          margin-right: 10px;
          color: #e61f1a;
          background: rgba(230, 31, 26, 0.08);
          border-radius: 4px;
          border: 1px solid rgba(230, 31, 26, 0.5);
          font-size: 12px;
          font-weight: 400;
          color: #694444;
          position: relative;
          .close {
            position: absolute;
            right: -6px;
            top: -6px;
            background: url("//static.theone.art/pc/images/pic-home/market-close.png")
              no-repeat center center;
            background-size: 12px 12px;
            width: 12px;
            height: 12px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .market-main {
    flex: 1;
    padding: 0 24px;
    position: relative;
    margin-top: 62px;
    .market-list {
      &-pc {
        margin-left: 265px;
      }
    }
  }
}

.transform1 {
  transform: translateX(-110px);
  transition: all 0.3s;
}
.market-main-left {
  transform: translateX(-110px);
  transition: all 0.3s;
}
.transform-false,
.market-main-false {
  transform: translateX(0);
  transition: all 0.5s;
}
.page-v1-market {
  .goods-element-wrap {
    user-select: none;
    .ui-bar {
      border-radius: 4px;
      width: 100% !important;
      padding: 0px !important;
      margin-bottom: 4px;
      overflow: hidden;
      .ui-bar-title {
        overflow: hidden;
        padding: 0 12px;
        line-height: 34px;
        height: 34px !important;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
        .ui-icon {
          width: 14px;
          height: 14px;
        }
        .icon-rotate {
          transform: rotate(180deg);
        }
      }
      .name-active {
        background: rgba(230, 31, 26, 0.2);
        color: #e61f1a;
      }
    }
    .goods-element-list {
      .goods-element-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #666666;
        line-height: 32px;
        padding: 0 20px;
        border-radius: 0;
      }
      .active-bar {
        background: #f7e6e5;
        font-weight: bold;
        .goods-element-name {
          color: #e61e1a;
          background-color: transparent;
        }
        .goods-element-num {
          color: #e61e1a;
          background-color: transparent;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.v1-goods-line h1 {
  display: inline-block;
  text-overflow: ellipsis;
  margin-right: 0;
}
// .v1-goods-line-title {
//   min-width: 45px;
// }
.v1-goods-wrap {
  padding: 12px;
}
@media screen and (min-width: 1800px) {
  .page-v1-market .market-main .market-list .v1-goods-wrap {
    width: 20%;
  }
}
@media screen and (min-width: 2100px) {
  .page-v1-market .market-main .market-list .v1-goods-wrap {
    width: 16.66%;
  }
}
</style>
<style lang="scss" scoped>
.phone-head-wrap {
  display: none;
}
@media screen and (max-width: 541px) {
  // .v1-goods-line-title {
  //   min-width: 0.9rem;
  // }
  .v1-goods-list {
    padding: 0 0.12rem;
  }
  .v1-goods-wrap {
    padding: 0.12rem;
  }
  .page-v1-market {
    .goods-element-wrap {
      user-select: none;
      .ui-bar {
        border-radius: 4px;
        width: 100% !important;
        padding: 0px !important;
        margin-bottom: 4px;
        .ui-bar-title {
          padding: 0 12px;
          line-height: 34px;
          height: 34px !important;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 0.28rem;
          .ui-icon {
            width: 14px;
            height: 14px;
          }
          .icon-rotate {
            transform: rotate(180deg);
          }
        }
        .name-active {
          background: rgba(230, 31, 26, 0.2);
          color: #e61f1a;
        }
      }
      .goods-element-list {
        .goods-element-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.26rem;
          color: #999;
          line-height: 0.78rem;
          padding: 0 20px;
        }
        .active-bar {
          background: #f7e6e5;
          .goods-element-name {
            color: #e61e1a;
            font-size: 0.26rem;
            background-color: transparent;
          }
          .goods-element-num {
            color: #e61e1a;
            background-color: transparent;
          }
        }
      }
    }
  }
  .select-element-wrap {
    display: none;
  }
  .phone-selected-wrap {
    position: sticky;
    z-index: 10;
    top: 3rem;
    background-color: #fff;
    padding-bottom: 0.04rem;
  }
  .phone-head-wrap {
    display: block;
    /*     overflow-x: auto; */
    .phone-bud {
      position: absolute;
      height: 0.2rem;
      top: -0.2rem;
      left: 0;
      width: 100%;
      background-color: #fff;
    }
    ul {
      background-color: #fff;
      overflow: hidden;
      .wrap {
        width: 2rem;
        float: left;
        overflow: hidden;
        line-height: 0.6rem;
        background: rgba(230, 31, 26, 0.08);
        border-radius: 0.04rem;
        border: 0.02rem solid rgba(230, 31, 26, 0.5);
        font-size: 0.24rem;
        font-weight: 400;
        color: #694444;
        text-align: center;
        margin: 0 0.06rem;
      }
      .typeMarket {
        display: none;
      }
      .nameType {
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
      }
    }
  }
  .v1-goods-list {
    padding-top: 0rem;
  }
  .ui-body-head {
    z-index: 999999;
  }
  .img-cover {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0.48rem;
    height: 0.48rem;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
    .scal-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: url("//static.theone.art/pc/images/user1%402x.png") no-repeat;
      width: 0.48rem;
      height: 0.48rem;
      background-position: center;
      background-size: contain;
    }
  }
  .page-v1-market {
    flex-direction: column;
    padding-top: 1.1rem;

    .v1-goods {
      margin: 0.32rem 0.3rem 0;
    }
    .market-sift {
      display: none;
    }
    .market-main {
      margin: 1.8rem 0 0;
      padding: 0rem 0.32rem 1.5rem;
      background: #fff;
      width: 100%;
    }
    .market-main-search {
      .search-active {
        margin: 0 -0.05rem;
        .wrap {
          flex: inherit;
          max-width: 50%;
          padding: 0 0.05rem;
          width: 50%;
        }
        .typeMarket {
          display: none;
        }
        .nameType {
          max-width: inherit;
          width: 100%;

          li {
            padding: 0;
            text-align: left;
            border: none;

            background-color: transparent;
          }
        }
        ul {
          li {
            height: 0.6rem;
            line-height: 0.6rem;
            font-size: 0.24rem;
            margin: 0;
          }
        }
      }
    }
    .market-main-search {
      .search {
        display: none;
      }
      // .search-active-padding {
      //   // padding-top: 0.44rem;
      // }
    }
  }
  .market-search-fixed {
    position: fixed;
    top: 46px;
    left: 0;
    z-index: 3;
    background-color: #fff;
    width: 100%;
  }
  .market-main-search {
    &.mode-mobile {
      margin: 0 16px;
    }
  }
  .market-search {
    &-hidden {
      display: none !important;
    }
    &-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0;
      .btn-search {
        background: url("//static.theone.art/pc/images/search-submit.png")
          no-repeat right center;
        background-size: 0.36rem 0.36rem;
        padding-right: 0.4rem;
        font-size: 0.26rem;
        line-height: 0.72rem;
        color: rgba($color: #000, $alpha: 0.4);
        cursor: pointer;
      }
      ul {
        display: flex;
        align-items: center;
        li {
          width: 0.8rem;
          font-size: 0.26rem;
          color: rgba($color: #000, $alpha: 0.4);
          margin-right: 24px;
          background: url("//static.theone.art/pc/images/pic-home/default.png")
            no-repeat center right;
          background-size: 8px auto;
          &.active-high {
            background: url("//static.theone.art/pc/images/pic-home/high.png")
              no-repeat center right;
            background-size: 8px auto;
          }
          &.active-low {
            background: url("//static.theone.art/pc/images/pic-home/low.png")
              no-repeat center right;
            background-size: 8px auto;
          }
        }
      }
    }
    &-hot {
      display: flex;
      align-content: center;
      margin: 16px 0 20px;
      position: relative;
      &:after {
        display: inline-block;
        content: "";
        width: 43px;
        height: 36px;
        background: url("//static.theone.art/pc/images/pic-home/hot-icon.png")
          no-repeat center right;
        background-size: 100%;
        position: absolute;
        right: -16px;
        top: 0;
      }
      span {
        font-size: 12px;
        width: 60px;
      }
      > div {
        flex: 1;
        max-width: calc(100% - 70px);
      }
      ul {
        flex: 1;
        display: flex;
        align-items: center;
      }
      li {
        margin: 0 12px;
        font-size: 12px;
        color: rgba($color: #000, $alpha: 0.4);
        white-space: nowrap;
      }
    }
  }
  .market-search-mobile {
    padding: 0.32rem;
    display: flex;
    .input {
      flex: 1;
      height: 0.72rem;
      border-radius: 0.36rem;
      border: 0.02rem solid rgba($color: #000, $alpha: 0.2);
      background: url("//static.theone.art/pc/images/search.png") no-repeat
        0.32rem center;
      background-size: 0.36rem 0.36rem;
      &.input-show {
        margin-right: 0.32rem;
      }
      input {
        width: 80%;
        height: 100%;
        margin-left: 0.78rem;
        background: transparent;
      }
    }
    .btn-search {
      background: url("//static.theone.art/pc/images/search-submit.png")
        no-repeat right center;
      background-size: 0.36rem 0.36rem;
      padding-right: 0.4rem;
      font-size: 0.28rem;
      line-height: 0.72rem;
      color: rgba($color: #000, $alpha: 0.4);
      cursor: pointer;
    }
    .btn-cancel {
      background: none;
      padding-right: 0;
    }
  }
  .market-search-mobile-con {
    width: 80vw;
    height: 100vh;
    padding: 1.4rem 0.32rem 1rem;
    position: relative;
    padding-bottom: 5rem;
    overflow-y: auto;
    background-color: #fff;

    h2 {
      font-size: 0.3rem;
      color: #333333;
      margin-bottom: 0.2rem;
      display: flex;
      align-items: center;
      .ui-icon {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 0.1rem;
      }
    }
    .goods-element-list {
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      .goods-element-bar {
        width: 50%;
      }
      .active-bar {
        background: transparent !important;
      }
    }

    .ul {
      display: flex;
      margin-bottom: 0.2rem;
      flex-wrap: wrap;
      .ui-bar {
        width: 50%;
        padding: 0.08rem;
      }
      .li {
        line-height: 0.76rem;
        border-radius: 0.04rem;
        text-align: center;
        font-size: 0.24rem;
        color: rgba($color: #000, $alpha: 0.7);
        background: #f9f9f9;
        border-radius: 4px;

        &.active {
          background: rgba($color: #e61f1a, $alpha: 0.2);
          color: #e61f1a;
        }
      }
    }
    .input-price {
      font-size: 12px;
      input {
        width: 2.8rem;
        height: 0.56rem;
        border-radius: 0.04rem;
        border: 0.02rem solid rgba($color: #000, $alpha: 0.3);
        padding: 0 0.1rem;
        text-align: center;
      }
      color: rgba($color: #000, $alpha: 0.4);
    }

    .btn-groups {
      position: fixed;
      bottom: 0rem;
      left: 0;
      display: flex;
      background: #fff;
      box-sizing: border-box;
      width: 100%;
      .v1-btn {
        width: 60%;
        border-radius: 0;
        line-height: 1.1rem;
        height: 1.1rem;
      }
      .grey {
        width: 40%;
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
    top: 2rem;
    display: none;
    &.show {
      display: block;
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
}
.goods-wrap-2 {
  width: 50% !important;
  .v1-goods {
    margin: 0.16rem;
  }
  :deep(.icon-prepay-sign) {
    width: 2.06rem;
    height: 0.34rem;
  }
  :deep(.bg-size-normal) {
    height: 0.18rem;
  }
}
.market-search-mobile-con {
  .phone-name-list-wrap {
    .ul {
      .ui-bar {
        width: 100%;
        .li {
          text-align: left;
          padding: 0 0.3rem;
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.v1-goods-list {
  margin: 0 -13px;
}
</style>
