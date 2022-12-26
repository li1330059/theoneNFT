<template>
  <div>
    <div class="mode-mobile" v-if="detailInfo.name">
      <m-head :title="`'${detailInfo.name}'`" />
    </div>
    <!--     <div class="v1-module-title" v-if="title">{{title}}</div> -->
    <div class="loading" v-if="loading">
      <loading></loading>
    </div>
    <empty v-else-if="showEmpty"></empty>
    <div v-else class="ui-content">
      <div class="ui-banner">
        <div class="main max-width">
          <div class="info">
            <div class="title">{{detailInfo.name}}</div>
            <div class="des">{{detailInfo.description}}</div>
          </div>
          <img
            class="img"
            src="//static.theone.art/pc/news/banner-info.png"
          />
        </div>
      </div>
      <div class="ui-list-wrap max-width" v-if="newsList && newsList.records">
        <div
          class="m-item"
          v-for="item in newsList.records"
          :key="item.uuid"
          @click.stop="$common.goPage(`/news/${item.uuid}`, '_blank')"
        >
          <div class="icon-horn"></div>
          <div class="title">{{ item.name }}</div>
          <div class="txt">{{ item.summarize }}</div>
          <div class="des">
            唯一艺术<span class="date">{{ item.releaseTime }}</span>
          </div>
          <div class="see">查看详情<span class="icon-go" /></div>
        </div>
      </div>
      <div class="v1-pagination" v-if="newsList">
        <g-paging
          ref="gPagingRef"
          :pageChange="handleCurrentChange"
          :pageSize="10"
          :list="newsList.records"
          :current-page="newsList.current"
        />
      </div>
    </div>
  </div>
</template>
<script>
import empty from "@/components/v1/empty";
import loading from "@/components/v1/loading/loading";
// import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { empty, loading },
  data() {
    return {
      loading: false, //加载
      showEmpty: false, //空数据
      newsTopOptions: {
        //置顶参数
        pageCount: 1,
        pageSize: 12,
        top: 1,
        categoryId: "",
        location: "list",
      },
      newsOptions: {
        //非置顶参数
        pageCount: 1,
        pageSize: 12,
        top: 0,
        location: "list",
      },
      newsTopList: [],
      newsList: null,
      title: null,
      detailInfo:{}
    };
  },
  mounted() {
    this.newsTopOptions.categoryId = this.$route.params.id;
    this.newsOptions.categoryId = this.$route.params.id;
    this.title = this.$route.params.name;
    this.getNewsTopList();
    this.getDetail();
  },
  methods: {
    async getDetail(){
      
       let result = await this.$api.service.category_detail({ id:this.newsOptions.categoryId});
  
       if(result&&result.data.code==200){
         this.detailInfo=result.data.data;
       }
    },
    //获取置顶列表
    async getNewsTopList() {
      try {
        this.loading = true;
        let result = await this.$api.service.dynamicNews_findNewsList(
          this.newsTopOptions
        );
        if (
          result &&
          result.data.code == 200 &&
          result.data.data.records.length > 0
        ) {
          this.newsTopList = result.data.data.records;
        }
      } catch (error) {
        console.log(error);
      }
      this.getNewsList();
    },
    //获取非置顶列表数据
    async getNewsList() {
      let result = await this.$api.service.dynamicNews_findNewsList(
        this.newsOptions
      );
      this.loading = false;
      if (result && result.data.code == 200) {
        if (
          this.newsTopList.length > 0 ||
          result.data.data.records.length > 0
        ) {
          this.newsList = result.data.data;
          this.newsList.records = [
            ...this.newsTopList,
            ...this.newsList.records,
          ];
        }else{
          this.$refs.gPagingRef.disabledNext()
        }
      }
      this.showEmpty = this.newsList.records.length <= 0;
    },
    handleCurrentChange(val) {
      this.newsOptions.pageCount = val;
      this.getNewsList();
    },
  },
};
</script>
<style lang="scss" scoped>
.ui-banner {
  background: #eaeaea;
  .main {
    display: flex;
    height: 200px;
    justify-content: space-between;
    align-items: center;
  }

  .img {
    display: block;
    width: 245px;
  }
  .info {
    .title {
      font-size: 26px;
      font-weight: bold;
      color: #000000;
    }
    .des {
      font-size: 20px;
      font-weight: 400;
      color: #000000;
      margin-top: 16px;
    }
  }
}
.max-width {
  max-width: 860px;
  margin: 0 auto;
}

.m-item {
  position: relative;
  top: 0;
  left: 0;
  cursor: pointer;
  border-left: 1px solid #e5e5e5;
  padding-left: 50px;
  padding-bottom: 50px;
  margin-bottom: 10px;
  &:hover {
    .title {
      color: #397fe7;
    }
  }
  .icon-horn {
    background: url("//static.theone.art/pc/icons/icon-horn.png")
      no-repeat top center #fff;
    background-size: contain;
    display: inline-block;
    width: 26px;
    height: 36px;
    position: absolute;
    top: -1px;
    left: -13px;
  }
  .title {
    transition: all ease-out 0.16s;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 16px;
  }
  .txt {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    margin-bottom: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .des {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }
  .see {
    font-size: 14px;
    font-weight: 400;
    color: #397fe7;
    display: flex;
    align-items: center;
    margin-top: 16px;
    .icon-go {
      background: url("//static.theone.art/pc/icons/icon-go.png")
        no-repeat top center;
      background-size: contain;
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-left: 8px;
    }
  }
}
.m-item:last-child {
  border: none;
}
.ui-list-wrap {
  padding-top: 62px;
}
.ui-content {
  padding-bottom: 108px;
}

.v1-pagination {
  justify-content: center;
}
.loading {
  height: 500px;
}
.center {
  padding: 60px 0 20px;
  box-sizing: border-box;
}
.news-top-tl {
  background-color: rgba(255, 126, 126, 0.38);
}
.news-box {
  max-width: 1170px;
  margin: 25px auto;
}
.news-list {
  max-width: 1170px;
  margin: 25px auto;
  display: flex;
  padding: 20px 20px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 2px 16px 0px rgba(182, 182, 182, 0.3);
    .news-list-tl {
      background-color: rgba(255, 255, 255, 0);
      color: rgba(57, 127, 231, 1);
    }
  }
  &-lf {
    width: 24%;
    height: 148px;
    margin-right: 30px;
  }
  &-ct {
    flex: 1;
    max-width: 60%;
  }
  &-text {
    max-width: 600px;
  }
  &-rg {
    width: 90px;
    margin-left: 30px;
  }
  &-tl {
    font-size: 20px;
    display: inline-block;
    max-width: 100%;
  }
  &-describe {
    font-size: 16px;
    color: rgba(102, 102, 102, 1);
    margin: 16px 0;
  }
  &-bt {
    display: flex;
    justify-content: space-between;
  }
  &-name {
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
    margin-right: 12px;
    &::before {
      display: inline-block;
      width: 24px;
      height: 24px;
      content: "";
      background: url("//static.theone.art/pc/images/pic-home/logo-middle.png")
        no-repeat center;
      background-size: 100% 100%;
      vertical-align: middle;
      margin-right: 4px;
    }
  }
  &-icon {
    display: inline-block;
    border-radius: 2px;
    opacity: 0.4;
    border: 1px solid #e61f1a;
    color: #e61f1a;
    font-size: 12px;
    padding: 0 5px;
  }
  &-rg,
  &-time {
    font-size: 12px;
    color: #999;
  }
  &-time {
    display: none;
  }
  &-rg {
    white-space: nowrap;
  }
  .img {
    background: #ddd;
    height: 148px;
    overflow: hidden;
    .imgurl {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center center;
    }
  }
}
@media screen and (min-width: 541px) and (max-width: 960px) {
  .news-list {
    align-items: center;
    &-lf {
      width: 27%;
    }
    &-rg {
      display: none;
    }
    &-time {
      display: inline-block;
    }
  }
}
@media screen and (max-width: 540px) {
  .v1-module-title {
    display: none;
  }
  .news-top {
    padding: 0 16px;
    box-sizing: border-box;
  }
  .news-list {
    align-items: center;
    margin: 0px auto;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 16px 0px;
    box-sizing: border-box;
    &-rg {
      display: none;
    }
    &-time {
      display: inline-block;
      font-size: 10px;
    }

    &-lf {
      width: 30%;
      height: 85px;
      margin-right: 10px;
    }
    &-tl {
      background-color: rgba(255, 255, 255, 0);
      font-size: 14px;
      font-weight: bold;
    }
    &-describe {
      font-size: 10px;
      color: rgba(102, 102, 102, 1);
      margin: 5px 0;
    }
    &-name {
      font-size: 10px;
      &::before {
        width: 16px;
        height: 16px;
      }
    }
    &-icon {
      font-size: 10px;
    }
    .img {
      height: 85px;
    }
  }
}
</style>