<template>
  <div>
    <!-- <div class="mode-mobile">
      <m-header :title="pageTitle" />
    </div> -->
    <div class="page-mine-treasure" ref="contentRef">
      <div class="search">
        <div class="pc-choose">
          <!-- 搜索 -->
          <div class="m-search-wrap grayscale">
            <input
              v-model="treasureListParam.name"
              placeholder="输入您想查找的藏品名称"
            />
            <span class="search-btn" @click="searchList">搜索</span>
          </div>

          <!-- 状态 -->
          <div class="search-opt-wrap">
            <el-select
              v-model="treasureListParam['statusTreasure']"
              @change="searchList"
            >
              <el-option
                v-for="(item, index) in statusTreasureList"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <!-- 无限分类 -->
            <div v-for="num in chooseArray.length" :key="num" v-show="num != 1">
              <el-select
                v-model="objArr[num - 1]"
                placeholder="请选择"
                value-key="id"
              >
                <el-option
                  v-for="item in chooseArray[num - 1]"
                  @click.native="chooseChildrenArr(item)"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                  {{ item.name }}
                </el-option>
              </el-select>
            </div>
          </div>
          <div
            class="transfer-record"
            @click="goTransferRecord"
            v-if="this.$store.getters.showTransferRecord"
          >
            <img
              class="transfer-icon"
              src="~@/assets/img/icon/record@2x.png"
              alt=""
            />
            转移记录
          </div>
        </div>

        <!-- 移动端 -->
        <div class="moblie-choose">
          <!-- 搜索模块 -->
          <div class="search-content">
            <div class="m-search-wrap">
              <input
                v-model="treasureListParam.name"
                placeholder="输入您想查找的藏品名称"
              />
              <span class="search-btn" @click="searchList">搜索</span>
            </div>
            <div class="search-icon-btn" @click="isShowSearch = true">
              <span class="txt"> 筛选</span>
              <span class="ui-icon icon-filter"></span>
            </div>
          </div>

          <!-- 选中tag列表 -->
          <div class="overflow-x-auto">
            <div
              class="search-tab-wrap"
              :style="`width:${2 * categoryList.length}rem`"
            >
              <div
                class="search-tab"
                v-for="(item, idx) in categoryList"
                v-show="idx > 0"
                :key="idx"
              >
                <div class="tab hidden-1">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <receive-alert
        v-if="
          !this.$common.isMobile() && this.$store.getters.showTransferReceive
        "
        @update="receiveUpdate"
      />

      <div class="m-list-info">
        <div class="v1-goods-list ui-list-wrap">
          <div
            class="v1-goods-wrap"
            v-for="(item, index) in resList"
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
              :goods-info="item"
              :isShowLike="false"
              :index="index"
              :isShowTotal="true"
              :isShowPreview="false"
              :isShowNumber="false"
              @listenCoverClick="listenCoverClick"
            >
              <div class="v1-goods-line" slot="footer">
                <div class="line-item">
                  <h1 class="text-overflow author-name">
                    <span class="ui-icon icon-author"></span
                    >{{
                      (item.author && item.author.nickname) ||
                      item.authorName ||
                      (item.commodity &&
                        item.commodity.extendsData &&
                        item.commodity.extendsData.creator)
                    }}
                  </h1>
                  <el-popover
                    placement="top"
                    width="160"
                    v-model="item.visible_show"
                  >
                    <div class="select-visible-wrap">
                      <div
                        v-for="v_item in visible_list"
                        :key="v_item.key"
                        :class="{ selected: v_item.key == visible_key }"
                        @click="onChangeStatus(item, index, v_item)"
                      >
                        {{ v_item.name }}
                      </div>
                    </div>

                    <span
                      slot="reference"
                      class="icon"
                      :class="{
                        lock: item.visible == 3,
                        unlock: item.visible == 1,
                        man: item.visible == 2,
                      }"
                      @click.stop="setVisibleStatus(item)"
                    />
                  </el-popover>
                </div>

                <div class="line-item">
                  <h1 class="item-title">获得时间</h1>
                  <!-- TODO  获得时间-->
                  <span class="item-text">{{ item.createTime }}</span>
                </div>
              </div>
            </goods-frame>
          </div>
        </div>
        <div class="list-bottom">
          <status-template
            :list="resList"
            api="/goods/api/treasure/list"
            :init="getTreasureList"
            class="catch"
          >
          </status-template>
        </div>
      </div>
    </div>

    <!-- 移动端分类选择窗口 -->
    <van-popup
      v-model="isShowSearch"
      position="right"
      @touchmove.prevent
      :closeable="true"
      :style="{ height: '100%' }"
      z-index="9998"
    >
      <div class="m-goods-search-wrap">
        <div class="search-list-content">
          <!-- 状态 -->
          <section class="" v-for="(item, idx) in searchOption" :key="idx">
            <div class="goods-title">
              <span class="ui-icon" :class="[item.icon]"></span>
              {{ item.name }}
            </div>
            <div class="list-wrap">
              <div
                class="bar"
                :class="{
                  selected: treasureListParam[item.key] == item2.value,
                }"
                v-for="(item2, idx2) in item.item"
                v-show="item2.value"
                :key="idx2"
                @click="onblockHandle(item.key, item2.value)"
              >
                <div class="content hidden-1">{{ item2.name }}</div>
              </div>
            </div>
          </section>

          <!-- 移动端无限分类 -->
          <section class="" v-for="(item, index) in categoryList" :key="index">
            <div class="goods-title" v-if="item.childrens.length > 0">
              <span class="ui-icon icon-title-2"></span>
              {{ item.childLevelName }}
            </div>

            <div class="list-wrap">
              <div
                class="bar"
                :class="{ selected: tagitem.check == true }"
                v-for="(tagitem, tagindex) in item.childrens"
                :key="tagindex"
                @click="checkListItem(tagitem, tagindex, index)"
              >
                <div class="content hidden-1">{{ tagitem.name }}</div>
              </div>
            </div>
          </section>
        </div>
        <div class="footer">
          <div class="btn btn-rest" @click="onRestSearch">重置</div>
          <div class="btn btn-submit" @click="onSubmitSearch">确定筛选</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
import categoryMore from "./categoryMore.vue";
import receiveAlert from "./receive-alert.vue";

export default {
  components: { categoryMore, receiveAlert },
  data() {
    return {
      isShowSearch: false,
      blind_box_list: {},
      categoryList: [],
      blind_box_params: {
        pageCount: 1,
        pageSize: 12,
      },
      search_category_name: "",
      pageTitle: "我的藏品",
      loading: true,
      showEmpty: false,
      searchDisable: false,
      visible_list: [
        { name: "全部可见", key: 1 },
        { name: "好友可见", key: 2 },
        { name: "全部不可见", key: 3 },
      ],
      visible_key: 1, //可见状态
      statusTreasureList: [
        {
          name: "全部",
          value: "",
        },
        {
          name: "在售",
          value: "1",
        },
        {
          name: "私藏",
          value: "2",
        },
        {
          name: "可赠与",
          value: "3",
        },
        {
          name: "赠与中",
          value: "4",
        },
      ],
      searchOption: [
        {
          key: "statusTreasure",
          name: "藏品状态",
          show: false,
          icon: "icon-title-1",
          item: [
            {
              name: "全部",
              value: "",
            },
            {
              name: "在售",
              value: "1",
            },
            {
              name: "私藏",
              value: "2",
            },
            {
              name: "可赠与",
              value: "3",
            },
            {
              name: "赠与中",
              value: "4",
            },
          ],
        },
      ],

      treasureListParam: {
        pageCount: 1,
        pageSize: 16,
        name: "",
        blindBoxDraw: 0,
        typeMarket: "",
        statusTreasure: "",
      },
      classList: [],
      treasureListResult: null,
      isBottom: false,
      resList: [],

      //选中的下拉框数据
      chooseArray: [],

      // el-select选中的数据
      objArr: [],
    };
  },
  computed: {},
  created() {
    this.isBottom = false;
    this.getCategoryList();
    this.restSearchOptions();
    window.addEventListener("scroll", this.scroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scroll, false);
  },

  mounted() {},
  watch: {
    "treasureListParam.name": {
      handler(val, oldVal) {
        clearTimeout(this.search_category_timer);
        this.search_category_timer = setTimeout(() => {
          /*     this.searchList(); */
        }, 400);
      },
    },
  },
  methods: {
    receiveUpdate() {
      this.getTreasureList();
    },
    goTransferRecord() {
      this.$router.push(`/mine/transfer_record`);
    },
    chooseChildrenArr(val) {
      // 每次重新点击下拉框都要清楚，后续下拉框的值，重新为其赋值
      if (val.childrens.length > 0) {
        //如果选中的元素，其有子元素，那么保留下一级的下拉框
        // this.obj = {}
        this.chooseArray[val.level] = val.childrens;
        this.chooseArray.splice(val.level + 1);
        this.objArr.splice(val.level);
      } else {
        //如果选中的元素，没有子元素，那么只保留切换的下拉框，清楚其以下的所有下拉框
        this.chooseArray.splice(val.level);
        this.objArr.splice(val.level);
      }

      if (this.objArr.length > 0) {
        this.treasureListParam.commodityCategoryIdList = [];
        if (
          this.objArr[this.objArr.length - 1].id ==
          "561f30937d5798f6da1de70c14546f99"
        ) {
          //市场三级
          this.treasureListParam.typeMarket = "";
        } else if (
          this.objArr[this.objArr.length - 1].id ==
          "f34b047edd05ddcd7d39df4ca106d214"
        ) {
          //版权品
          this.treasureListParam.typeMarket = 1;
        } else if (
          this.objArr[this.objArr.length - 1].id ==
          "7928dcb378475f97688da730ef0e0658"
        ) {
          //衍生品
          this.treasureListParam.typeMarket = 2;
        } else if (
          this.objArr[this.objArr.length - 1].id ===
          "ffece0ec1ffe75ff7ddd252e4f375d8f"
        ) {
          // 数字身份
          this.treasureListParam.typeMarket = 3;
        } else {
          //普通标签
          this.treasureListParam.commodityCategoryIdList.push(
            this.objArr[this.objArr.length - 1].id
          ); //带入自身id
          if (this.objArr[this.objArr.length - 1].childrens.length > 0) {
            //下面还有孩子，递归找下面所有子孙id
            this.getIdArr(this.objArr[this.objArr.length - 1].childrens);
          }
        }
      }
      this.searchList();
    },

    getIdArr(arr) {
      //递归找孩子往params里push进id
      for (let i = 0; i < arr.length; i++) {
        this.treasureListParam.commodityCategoryIdList.push(arr[i].id);
        if (arr[i].childrens.length > 0) {
          this.getIdArr(arr[i].childrens);
        }
      }
    },
    selCreate() {
      var arr = [];
      // 将数据中第一级分类保留放入到要遍历的数组中，
      // 核心思路是[[一级下拉框数据],[二级下拉框数据],[三级下拉框]....[n级下拉框]]
      this.categoryList.forEach((ele) => {
        if (ele.level == 1) arr.push(ele);
      });
      this.chooseArray[this.chooseArray.length] = arr;
      this.chooseChildrenArr(this.categoryList[0]);
      this.objArr[0] = this.categoryList[0]; //第一个下拉框默认点击，为展示第二级版权品衍生品列表，第一级v-show隐藏
    },

    //移动端选择
    checkListItem(item, tagindex, index) {
      this.treasureListParam.commodityCategoryIdList = [];
      if (item.id == "f34b047edd05ddcd7d39df4ca106d214") {
        //版权品
        this.treasureListParam.typeMarket = 1;
      } else if (item.id == "7928dcb378475f97688da730ef0e0658") {
        //衍生品
        this.treasureListParam.typeMarket = 2;
      } else if (item.id === "ffece0ec1ffe75ff7ddd252e4f375d8f") {
        // 数字身份
        this.treasureListParam.typeMarket = 3;
      } else {
        //同pc
        this.treasureListParam.commodityCategoryIdList = [];
        this.treasureListParam.commodityCategoryIdList.push(item.id);
        if (item.childrens.length > 0) {
          //有孩子
          this.getIdArr(item.childrens);
        }
      }
      this.searchList();

      //设置分类选中状态check标识，仅移动端用此逻辑
      for (let i = 0; i < this.categoryList[index].childrens.length; i++) {
        this.categoryList[index].childrens[i].check = false;
      }
      this.categoryList[index].childrens[tagindex].check = true;

      //是新增还是切换同级分类
      let if_add = false;
      for (let i = 0; i < this.categoryList.length; i++) {
        if (this.categoryList[i].level == item.level) {
          if_add = true;
        }
      }
      if (if_add) {
        this.categoryList.length = item.level - 1;
      }
      this.categoryList.push(item);
      this.categoryList = JSON.parse(JSON.stringify(this.categoryList));
    },
    onRestSearch() {
      this.treasureListParam = {
        pageCount: 1,
        pageSize: 16,
        name: "",
        blindBoxDraw: 0,
        statusTreasure: "",
      };
      this.getCategoryList();
    },
    onSubmitSearch() {
      this.isShowSearch = false;
    },
    restSearchOptions() {
      this.searchOption = this.searchOption.map((item) => {
        item.item = item.item.map((item2) => {
          item2.selected = false;
          return item2;
        });
        return item;
      });
    },
    onblockHandle(key, val, idx1, idx2) {
      if (this.treasureListParam[key] == val) {
        this.treasureListParam[key] = "";
      } else {
        this.treasureListParam[key] = val;
      }
      this.searchList();
    },
    async getCategoryList() {
      let res = await this.$api.service.commodityCategory_list_v2({
        fid: "561f30937d5798f6da1de70c14546f99",
      });
      if (res.data.code == 200) {
        this.categoryList = res.data.data;
        this.selCreate();
      } else {
        this.$message.error(res.data.message);
      }
    },
    inputChange() {},
    listenCoverClick(info) {
      this.$common.goPage(
        `/mine/treasure/${info.id}?commodity_id=${info.commodity.id}`
      );
    },
    scroll() {
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      const domPostion = this.$refs.contentRef.getBoundingClientRect();
      const contentHeight = this.$common.isMobile()
        ? parseInt(domPostion.height)
        : parseInt(domPostion.height) + 400;

      //console.log(contentHeight ,scrollTop , document.body.clientHeight , document.body.offsetHeight);
      if (
        contentHeight <= scrollTop + document.body.clientHeight + 100 &&
        !this.isBottom
      ) {
        this.isBottom = true;
        console.log("到底了");

        this.treasureListParam.pageCount++;
        this.getTreasureList();
      }
    },

    searchList() {
      if (this.searchDisable) {
        return;
      }
      this.searchDisable = true;
      this.resList = [];
      this.treasureListParam.pageCount = 1;
      this.getTreasureList();
    },
    concatList(item) {},

    setVisibleStatus(item) {
      this.visible_key = item.visible;
    },
    async onChangeStatus(item, idx, visible_info) {
      this.visible_key = visible_info.key;

      const params = {
        visible: visible_info.key,
        treasureId: item.id,
        type: 1,
      };

      const result = await this.$api.service.treasure_operation(params);
      if (result && result.data.code == 200) {
        this.$message.success("操作成功");
        this.treasureListResult.records[idx].visible = params.visible;
        this.treasureListResult.records[idx].visible_show = false;
      } else {
        this.$message.error("操作失败请重试");
      }
    },
    showSelect(item) {
      console.log(item);
    },
    onPickerChange(e, idx) {
      this.searchOption[idx].name = e.name;
      this.treasureListParam[this.searchOption[idx].key] = e.value;
      this.searchList();
      this.searchOption[idx].show = false;
    },
    searchOrder() {},

    //我的资产列表
    async getTreasureList() {
      this.loading = true;
      const result = await this.$api.service.treasure_list_v2(
        this.treasureListParam
      );
      setTimeout(() => {
        this.searchDisable = false;
      }, 300);

      if (result && result.data.code == 200) {
        this.treasureListResult = result.data.data;
        this.showEmpty = this.treasureListResult.total == 0;
        this.loading = false;
        if (
          this.treasureListResult.records &&
          this.treasureListResult.records.length > 0
        ) {
          this.resList = [...this.resList, ...this.treasureListResult.records];
          if (
            this.treasureListResult.records.length >=
            this.treasureListParam.pageSize
          ) {
            setTimeout(() => {
              this.isBottom = false;
            }, 500);
          }
        } else {
          this.isBottom = true;
        }
      } else {
        this.$message({
          message: result.data.message,
          type: "error",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.m-goods-search-wrap {
  width: 80vw;
  height: 100vh;
  padding: 1.5rem 0.3rem 1.6rem;
  overflow-y: auto;
  section {
    margin-bottom: 0.6rem;
  }
  .goods-title {
    display: flex;
    align-items: center;
    font-size: 0.28rem;
    font-weight: 400;
    color: #333333;
    line-height: 0.4rem;
    margin-bottom: 0.12rem;
    .ui-icon {
      margin-right: 0.1rem;
      width: 0.6rem;
      height: 0.6rem;
    }
  }
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.08rem;
    .bar {
      width: 50%;
      padding: 0.08rem;
      .content {
        line-height: 0.72rem;
        background: #f9f9f9;
        border-radius: 0.04rem;
        text-align: center;
        color: #666666;
        font-weight: 400;
        font-size: 0.24rem;
      }
    }
    .selected {
      .content {
        background: rgba(230, 31, 26, 0.1);
        color: #e61f1a;
      }
    }
  }
  .footer {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    .btn {
      line-height: 0.8rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
    }
    .btn-rest {
      flex: 1;
      color: #9fa0bb;
      background: #ececf1;
    }
    .btn-submit {
      flex: 1.6;
      background: linear-gradient(149deg, #ff7a64 0%, #e61f1a 100%);
    }
  }
}
.icon-title-1 {
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/treasure/icon-title-1.png");
}
.icon-title-2 {
  background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/treasure/icon-title-2.png");
}
.icon-title-3 {
  background-image: url("//static.theone.art/pc/images/nav/icon-nav-2.png");
}
.icon-title-4 {
  background-image: url("//static.theone.art/pc/images/nav/icon-nav-3.png");
}
.list-bottom {
  position: relative;
  height: 160px;
  top: 0;
  left: 0;
  .catch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    ::v-deep .section {
      background-color: transparent;
      img {
        width: 160px;
      }
    }
  }
}
.v1-goods-wrap {
  padding: 12px;
}
.v1-goods-line p {
  min-width: 30px;
  text-align: right;
}
.search-opt-wrap {
  flex: 1;
  flex-wrap: wrap;
  display: flex;
}
.m-search-wrap {
  border-radius: 100px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 290px;
  padding: 3px;
  input {
    flex: 1;
    display: block;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 30px;
    padding: 0 15px;
    min-width: 220px;
    border-radius: 17px;
    background-color: transparent;
  }
  .search-opt-wrap {
    flex: 1;
    flex-wrap: wrap;
    display: flex;
  }
  .search-btn {
    line-height: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    padding: 0 16px;
    display: inline-block;
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 17px;
    cursor: pointer;
    text-align: center;
  }
}
.content-title {
  font-size: 20px;
  font-weight: bold;
  color: #e61f1a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  span {
    display: inline-block;
    width: 73px;
    height: 6px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    margin: 0 30px;
  }
  .left {
    background-image: url("//static.theone.art/pc/images/pic-home/icon-left-title.svg");
  }
  .right {
    background-image: url("//static.theone.art/pc/images/pic-home/icon-right-title.svg");
  }
}
.bilnd-box {
  transition: all line 0.16s;
}
.page-mine-treasure {
  padding-top: 30px;
  .loading {
    height: 500px;
  }
  .search {
    background-color: transparent;
    margin-bottom: 27px;
    .key {
      width: 220px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid rgba($color: #000000, $alpha: 0.4);
      padding-left: 42px;
      background: url("//static.theone.art/pc/images/search.png") no-repeat 12px
        center;
      background-size: 14px 14px;
      input {
        height: 100%;
      }
    }
    .pc-choose {
      display: flex;
      align-items: center;
      justify-content: space-between;
      ::v-deep .el-select {
        width: 116px;
        margin: 8px;
      }
      ::v-deep .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
      .transfer-record {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        color: #397fe7;
        .transfer-icon {
          width: 20px;
          height: 20px;
          margin-right: 2px;
        }
      }
    }
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
}
.moblie-choose {
  display: none;
}
.icon {
  display: inline-block;
  width: 18px;
  height: 18px;
}
.unlock {
  background: url("//static.theone.art/pc/images/unlock.png") no-repeat right
    center;
  background-size: contain;
}
.lock {
  background: url("//static.theone.art/pc/images/pic-home/lock%402x.png")
    no-repeat right center;
  background-size: contain;
}
.man {
  background: url("//static.theone.art/pc/images/pic-home/friendsee.png")
    no-repeat right center;
  background-size: contain;
}
.select-visible-wrap {
  margin: -12px;
  background: #fff;
  > div {
    width: 100%;
    line-height: 34px;

    border-radius: 0px 0px 2px 2px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    padding: 0 16px;
  }
  .selected {
    background-color: #f4f4f4;
  }
}
.v1-goods-line {
  margin-top: 8px;
  margin-bottom: 0;
  display: block;
  .line-item {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .item-title {
      color: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
    }
    .item-text {
      color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      text-align: right;
    }
    p {
      text-align: right;
    }
  }
  h1 {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    margin-right: 7px;

    .ui-icon {
      margin-right: 4px;
      position: relative;
      top: 2px;
    }
  }
}
.list-bottom {
  margin-top: 10vh;
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .m-search-wrap {
    margin-bottom: 0.32rem;
    width: 100%;
  }
  .v1-pagination {
    padding-bottom: 1.2rem;
  }
  .content-title {
    font-size: 0.4rem;

    margin: 0.5rem 0 0.2rem;
    span {
      display: inline-block;
      width: 1.4rem;
      height: 0.12rem;
      margin: 0 0.3rem;
    }
  }
  .page-mine-treasure {
    background: #fafafa;
    margin-top: 0;
    padding-top: 0;
    .search {
      border-bottom: none !important;
      background-color: #fff;
    }
    .loading {
      height: 8rem;
    }
    .v1-search.mycenter .v1-search-title {
      padding: 0.32rem;
    }

    .v1-search-title .search-more {
      width: 1.92rem;
      height: 0.6rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.4);
      background-size: 0.36rem 0.36rem;
      padding-left: 0.46rem;
      background-position-x: 1.2rem;
    }

    .v1-search.mycenter .search-order span {
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.4);
    }

    .v1-search {
      margin-bottom: 0;
    }

    .gray-line {
      padding-top: 0.14rem;
      border-bottom: 0.01rem solid rgba($color: #000000, $alpha: 0.1);
    }

    .gray-btn {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 0.46rem;
      div {
        width: 2.92rem;
        height: 0.72rem;
        background: #e5e5e5;
        border-radius: 0.36rem;
        justify-content: center;
        display: flex;
        align-items: center;
        font-size: 0.28rem;
        font-weight: 500;
        color: rgba($color: #000000, $alpha: 0.7);
      }
    }

    .v1-goods-line h1 {
    }
    .v1-goods-line-title {
      font-size: 0.24rem;
    }
    .v1-goods-line-people {
      font-size: 0.28rem;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.7);
    }
    .search {
      margin-bottom: 0;
      border-bottom: 1px solid rgba($color: #979797, $alpha: 0.2);
      padding-bottom: 0;
      padding-top: 0.32rem;
      display: flex;
      align-items: center;

      .key {
        flex: 1;
        height: 30px;
        border-radius: 4px;
        border: none;
        padding-left: 42px;
        background: url("//static.theone.art/pc/images/pic-home/input-search.png")
          no-repeat 12px center;
        background-size: 14px 14px;
        input {
          height: 100%;
          width: 100%;
          border: none;
          background-color: transparent;
        }
      }
      .moblie-choose {
        display: block;
        padding: 0 0.3rem;
        width: 100%;
        .search-content {
          display: flex;
          align-items: center;

          width: 100%;
          .m-search-wrap {
            flex: 1;
            width: initial;
            margin-bottom: 0;
            .search-btn {
              line-height: 0.72rem;
              height: 0.72rem;
              width: 1.28rem;
              border-radius: 100px;
              text-align: center;
            }
          }
          .search-icon-btn {
            font-size: 0.28rem;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
            padding-left: 0.2rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .txt {
              word-break: keep-all;
              display: inline-block;
              padding-right: 0.04rem;
            }
          }
          .icon-filter {
            width: 0.32rem;
            height: 0.32rem;
            background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/treasure/icon-filter.png");
          }
          .type-wrap {
            display: flex;
            justify-content: space-between;
            > div {
              border-radius: 100px;
              font-size: 0.24rem;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.4);
              border: 0.02rem solid rgba(0, 0, 0, 0.1);
              line-height: 0.58rem;
              padding: 0 0.2rem;
              width: 48%;
              height: 0.58rem;
              background: url("//static.theone.art/pc/images/pic-home/market-item-hide.png")
                no-repeat;
              background-position: 96% center;
              background-size: 0.28rem;
              padding-right: 0.3rem;
            }
          }
        }
        .overflow-x-auto {
          width: 100%;
          overflow-x: auto;
        }
        .search-tab-wrap {
          display: flex;
          margin-top: 0.24rem;

          .search-tab {
            overflow: hidden;
            margin: 0 0.06rem;
            width: 2rem;
            .tab {
              line-height: 0.6rem;
              background: rgba(230, 31, 26, 0.08);
              border-radius: 0.04rem;
              border: 1px solid rgba(230, 31, 26, 0.5);
              font-size: 0.24rem;
              font-weight: 400;
              color: #694444;
              text-align: center;
              padding: 0 10px;
            }
          }
        }
      }
      .pc-choose {
        display: none;
      }
    }
  }
}
</style>
