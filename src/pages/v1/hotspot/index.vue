<template>
  <div class="hotspot-body">
    <div class="body-banner bg-img"></div>

    <div class="m-tab-wrap">
      <div
        class="tab-wrap grayscale"
        v-for="(item, idx) in categoryList"
        :key="item.id"
      >
        <div
          class="tab"
          :class="{ selected: categoryIdx == idx }"
          @click="categoryChange(item, idx)"
        >
          {{ item.name }}
          <span class="line" />
        </div>
      </div>
    </div>
    <div class="hotspot-content">
      <status-template
        :list="list"
        api="/market/api/dynamicNews/findNewsList"
        :init="init"
      >
        <div>
          <div style="min-height: 30vh" class="hotspot-content-list">
            <hot-active
              :list="list"
			  :categoryName="categoryList[categoryIdx].name"
              v-if="
                categoryList[categoryIdx] &&
                categoryList[categoryIdx].name == '平台活动'
              "
            >
            </hot-active>
            <hot-news
              :list="list"
			  :categoryName="categoryList[categoryIdx].name"
              v-if="
                categoryList[categoryIdx] &&
                categoryList[categoryIdx].name == '新闻动态'
              "
            >
            </hot-news>
            <hot-notice
              :list="list"
			  :categoryName="categoryList[categoryIdx].name"
              v-if="
                categoryList[categoryIdx] &&
                categoryList[categoryIdx].name == '平台通知'
              "
            ></hot-notice>
            <hot-help
              :list="list"
			  :categoryName="categoryList[categoryIdx].name"
              v-if="
                categoryList[categoryIdx] &&
                categoryList[categoryIdx].name == '教程帮助'
              "
            ></hot-help>
            <hot-help
              :list="list"
			  :categoryName="categoryList[categoryIdx].name"
              v-if="
                categoryList[categoryIdx] &&
                categoryList[categoryIdx].name == '更新指南'
              "
            ></hot-help>
          </div>
          <div class="pagind-wrap">
            <g-paging
              :pageChange="handleCurrentChange"
              :list="pListInfo.records"
              :pageSize="listParams.pageSize"
              :current-page="listResult.current"
            />
          </div>
        </div>
      </status-template>
    </div>
  </div>
</template>
<script>
import HotActive from "./components/hot-active.vue";
import HotHelp from "./components/hot-help.vue";
import HotNews from "./components/hot-news.vue";
import HotNotice from "./components/hot-notice.vue";

export default {
  components: { HotNews, HotNotice, HotActive, HotHelp },
  data() {
    return {
      categoryIdx: 0,
      pListInfo: {},
      categoryList: [],
      listResult: {
        current: 1,
      },
      list: [],
      nextDisabled: false,
      listParams: {
        categoryId: "",
        location: "list",
        pageCount: 1,
        pageSize: 16,
      },
    };
  },
  created() {
    this.init();
	this.$sensors.track('main_pageview', {
		module_name: "唯艺热点"
	});
  },
  computed: {},
  methods: {
    async init() {
      this.type = this.$route.query.type;
      await this.getCategoryList();
      this.getList();
    },

    categoryChange(item, idx) {
		this.$sensors.track('hotspot_click', {
			tab_name: item.name
		});
      this.list = [];
      this.categoryIdx = idx;
      this.nextDisabled = false;
      this.listParams.pageCount = 1;
      this.getList();
    },
    async getCategoryList() {
      let result = await this.$api.service.category_findList({ name: "" });
      if (result && result.data.code == 200) {
        this.categoryList = result.data.data;
        if (this.type && this.categoryList.length > 0) {
          const idx = result.data.data.findIndex((item) => {
            return item.id == this.type;
          });
          this.categoryIdx = idx;
        }
      }
    },
    handleCurrentChange(e) {
      this.listParams.pageCount = e;
      this.getList();
    },
    async getList() {
      const categoryInfo = this.categoryList[this.categoryIdx];
      if (categoryInfo) {
        this.listParams.categoryId = categoryInfo.id;
        /*     if (categoryInfo.name == "新闻动态") {
          this.listParams.top = 0;
          await this.getTopNews(this.listParams.categoryId);
        } else {
          this.topListObj = {};
          delete this.listParams.top;
        } */
        this.listParams.top = 0;
        await this.getTopNews(this.listParams.categoryId);
        const res = await this.$api.service.dynamicNews_findNewsList(
          this.listParams
        );

        if (res.data.code == 200) {
          this.pListInfo = res.data.data;
          let resObj = JSON.parse(JSON.stringify(res.data.data));
          if (this.topListObj && this.topListObj.records) {
            resObj.records = [...this.topListObj.records, ...resObj.records];
          }
          if (resObj.records.length > 0) {
            if (resObj.records.length < this.listParams.pageSize) {
              this.nextDisabled = true;
            } else {
              this.nextDisabled = false;
            }
            this.listResult = resObj;
            this.list = resObj.records;
          } else {
            this.nextDisabled = true;
          }
        } else {
          this.nextDisabled = true;
        }
      }
    },
    async getTopNews(categoryId) {
      this.topListObj = {};
      const res = await this.$api.service.dynamicNews_findNewsList({
        pageCount: 1,
        pageSize: 12,
        top: 1,
        categoryId,
        location: "list",
      });
      if (res && res.data.code == 200 && res.data.data.records.length > 0) {
        this.topListObj = res.data.data;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.pagind-wrap {
  display: flex;
  justify-content: center;
  padding: 30px 0 80px;
}
.body-banner {
  background-image: url("https://static.theone.art/pc/hotspot/banner-body.png");
  height: 200px;
}
.m-tab-wrap {
  display: flex;
  padding-top: 50px;
  padding-bottom: 30px;
  max-width: 1220px;
  margin: 0 auto;
  .tab-wrap {
    flex: 1;
    .tab {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      text-align: center;
      cursor: pointer;
    }
    .line {
      display: block;
      width: 30px;
      height: 2px;
      background: #e61f1a;
      border-radius: 2px;
      margin: 4px auto 0;
      opacity: 0;
    }
    .selected {
      color: #e61f1a;
      .line {
        opacity: 1;
      }
    }
  }
}

.hotspot-body {
  min-height: 70vh;
}
.hotspot-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 30px;
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .hotspot-content {
    padding: 0;
  }
  .hotspot-content-list {
    padding: 0 0.3rem;
  }
  .body-banner {
    background-image: url("//static.theone.art/pc/hotspot/m-hot-banner.png");
    height: 2.2rem;
  }
  .m-tab-wrap {
    display: flex;
    padding: 0.3rem 0;
    .tab-wrap {
      flex: 1;
      .tab {
        font-size: 0.24rem;
      }
      .line {
        display: block;
        width: 30px;
        height: 2px;
        background: #e61f1a;
        border-radius: 2px;
        margin: 4px auto 0;
        opacity: 0;
      }
      .selected {
        color: #e61f1a;
        font-size: 0.3rem;
        .line {
          opacity: 1;
        }
      }
    }
  }
}
</style>
