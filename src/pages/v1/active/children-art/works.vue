<template>
  <div class="ui-body children-art-bg-color">
    <section class="head-wrap max-width">
      <div class="head-block-info">
        <div class="left-block">
          <div class="active-name">{{ activeDetaiObj.name }}</div>
          <div class="date">
            {{ $common.formatDate(activeDetaiObj.startTime, "MM月dd日") }}-{{
              $common.formatDate(activeDetaiObj.endTime, "MM月dd日")
            }}
          </div>
        </div>
        <div class="active-time-wrap">
          <div class="title">
            <b>{{ timeTitle }}</b
            ><span class="ui-icon icon-works-time"></span>
          </div>
          <div class="time-block">
            <time-down ref="timeDownRef"></time-down>
          </div>
        </div>
      </div>

      <div class="search-block phone-hide">
        <search
          :open="showSearch"
          :value="listParams.searchContent"
          @listenChange="searchChange"
        ></search>
      </div>
    </section>
    <section class="max-width">
      <div class="line"></div>
    </section>
    <section class="max-width pc-hide">
      <div class="content phone-tool">
        <div class="sort-wrap">
          <el-select v-model="listParams.sortType" @change="sortTypeChange">
            <el-option
              :value="item.type"
              :label="item.name"
              v-for="(item, idx) in selectOption"
              :key="idx"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-block">
          <search
            :open="showSearch"
            :value="listParams.searchContent"
            @listenChange="searchChange"
          ></search>
        </div>
      </div>
    </section>

    <section class="tool-wrap max-width">
      <div class="surplus-num">
        <span v-if="activeDetaiObj.voteNum !== '不限'"
          >剩余可投票：<b>{{ activeDetaiObj.voteNum }}</b
          >次</span
        >
      </div>
      <div class="sort-wrap phone-hide">
        <el-select v-model="listParams.sortType" @change="sortTypeChange">
          <el-option
            :value="item.type"
            :label="item.name"
            v-for="(item, idx) in selectOption"
            :key="idx"
          >
          </el-option>
        </el-select>
      </div>
    </section>
    <div
      class="scroll-bar works-block"
      v-infinite-scroll="load"
      infinite-scroll-immediate="false"
      style="overflow: auto"
    >
      <div class="max-width">
        <section class="arts-wrap">
          <div class="art-box" v-for="item in list" :key="item.uuid">
            <art-box
              :goodsObj="item"
              @listenVote="vote"
              @listenGo="goGoodsDetail"
            ></art-box>
          </div>
        </section>
        <div class="loading-wrap" v-if="isListLoading">
          <loading></loading>
        </div>
        <div class="empty-wrap" v-if="isEmpty">
          <img
            src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/empty-img.png"
          />
          <div class="txt">未找到画作信息</div>
        </div>
      </div>
    </div>

    <vote ref="voteRef" @listenSuccess="voteSuccess"></vote>
  </div>
</template>
<script>
import ArtBox from "./components/art-box.vue";
import TimeDown from "./components/time-down.vue";
import loading from "@/components/v1/loading/loading";
import Search from "./components/search.vue";
import createstyle from "./create-style";
import Vote from "./components/vote.vue";
export default {
  components: { ArtBox, TimeDown, loading, Vote, Search },
  data() {
    return {
      isEmpty: false,
      showSearch: false,

      isListLoading: true,
      activeDetaiObj: {},
      activeConfig: {},
      isLoad: true,
      selectOption: [
        {
          name: "按作家首字母A至Z",
          type: "AUTHOR_NAME",
        },
        {
          name: "按获得票数从高到低",
          type: "VOTE_NUM",
        },
      ],
      listParams: {
        pageIndex: 1,
        pageSize: 20,
        searchContent: "",
        sortType: "AUTHOR_NAME",
        voteActivityUuid: "",
      },
      list: [],
    };
  },

  created() {
    if (this.$route.query.search) {
      this.showSearch = true;
      this.listParams.searchContent = this.$route.query.search;
    }

    this.active_uuid = this.$route.params.active_uuid;
    this.init();
  },
  mounted() {},
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
    timeTitle() {
      if (this.activeConfig.statusActivity == 1) {
        return "距离投票开始";
      }
      if (this.activeConfig.statusActivity == 2) {
        return "距离投票结束";
      }
      return "距离投票结束";
    },
  },

  methods: {
    init() {
      this.isLoad = true;
      this.getDetail();
      this.getActiveConfig();
      this.getList();
    },
    searchChange(e) {
      const txt = e.target.value;
      this.listParams.searchContent = txt;
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.listInit();
        this.getList();
      }, 400);
    },
    sortTypeChange() {
      this.listInit();
      this.getList();
    },
    load() {
      clearTimeout(this.loadTimer);
      if (!this.isLoad) {
        return;
      }
      this.loadTimer = setTimeout(() => {
        this.listParams.pageIndex++;
        this.getList();
      }, 260);
    },
    listInit() {
      this.listParams.pageIndex = 1;
      this.list = [];
    },
    async getDetail() {
      const res = await this.$api.service.voterActivity_voteDetail({
        uuid: this.active_uuid,
      });
      if (res.data.code == 200) {
        this.activeDetaiObj = res.data.data;
      }
    },
    async getActiveConfig() {
      const res = await createstyle(this, this.active_uuid);
      if (res.code == 200) {
        this.activeConfig = res.data;
        this.startTime();
      } else {
        this.$message.error(res.message);
      }
    },
    async getList() {
      this.isListLoading = true;
      this.isEmpty = false;
      const res = await this.$api.service.voterActivity_creation_list({
        ...this.listParams,
        voteActivityUuid: this.active_uuid,
      });
      this.isListLoading = false;

      if (res.data.code == 200) {
        if (res.data.data.records && res.data.data.records.length > 0) {
          this.list = [...this.list, ...res.data.data.records].map((item) => {
            item.isVote = false;
            return item;
          });
        } else {
          this.isLoad = false;
          if (res.data.data.current == 1) {
            this.isEmpty = true;
          }
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    startTime() {
      this.$nextTick(() => {
        this.$refs.timeDownRef.start({
          endTime:
            this.activeConfig.statusActivity == 1
              ? this.activeConfig.startTime
              : this.activeConfig.endTime,
          startTime: this.activeConfig.nowDate,
        });
      });
    },
    goGoodsDetail(obj) {
      this.$router.push(
        `/active/children_art/work_detail/${this.active_uuid}/${obj.uuid}`
      );
    },
    voteSuccess() {
      this.$message.success("投票成功");
      const newList = JSON.parse(JSON.stringify(this.list)).map((item) => {
        if (item.uuid == this.currentUuid) {
          item.isVote = true;
          item.voteNum = Number(item.voteNum || 0) + 1;
        }
        return item;
      });

      if (!isNaN(this.activeDetaiObj.voteNum)) {
        this.activeDetaiObj.voteNum = Number(this.activeDetaiObj.voteNum) - 1;
      }
      this.list = newList;
    },
    async vote(obj) {
      this.currentUuid = obj.uuid;
      this.$refs.voteRef.vote(obj.uuid);
      return;
      if (!(this.userInfo && this.userInfo.userUuid)) {
        //去登录
        return;
      }
      const res = await this.$api.service.voterActivity_creation_vote({
        uuid: obj.uuid,
      });
      if (res.data.code == 200) {
        const newList = JSON.parse(JSON.stringify(this.list)).map((item) => {
          if (item.uuid == obj.uuid) {
            item.isVote = true;
          }
          return item;
        });
        this.list = newList;
      } else if (res.data.code == 10005) {
        //实名认证
      } else if (res.data.code == 10006) {
        //  去绑定银行卡
      } else if (res.data.code === 10004) {
        //去登录
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 540px) {
  .scroll-bar::-webkit-scrollbar {
    width: 6px;
  }
  .scroll-bar::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #e4e4e4;
  }
  .scroll-bar::-webkit-scrollbar-track {
    border-radius: 0;

    background: #f8f8f8;
  }
}
.phone-tool {
  display: flex;
  justify-content: space-between;
}
.head-block-info {
  display: flex;
  justify-content: space-between;
  flex: 2;
  align-items: flex-end;
  .left-block {
    flex: 1;
  }
  .active-time-wrap {
    flex: 1;
  }
  .time-block {
    display: flex;
    justify-content: center;
    min-width: 226px;
  }
  @media screen and (max-width: 540px) {
    .time-block {
      justify-content: flex-end;
      min-width: initial;
    }
    .active-name {
      font-size: 0.3rem;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 0.1rem;
    }
    .date {
      font-size: 0.3rem;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
.search-block {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.pc-hide {
  display: none;
}
@media screen and (max-width: 540px) {
  .phone-hide {
    display: none;
  }
  .pc-hide {
    display: block;
  }
}
.works-block {
  height: calc(100vh - 270px);
  padding-bottom: 60px;
  @media screen and (max-width: 540px) {
    height: calc(100vh - 200px);
  }
}
.sort-wrap {
  ::v-deep .el-input__inner {
    background-color: transparent;
    color: #ffffff;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    border: 1px solid #dcdfe6 !important;
  }
  @media screen and (max-width: 540px) {
    padding-right: 0.25rem;
    ::v-deep .el-input__inner {
      height: 0.64rem;
      line-height: 0.64rem;
    }
  }
}
.loading-wrap {
  padding-top: 40px;
}
.arts-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: -15px;
  padding-top: 5px;
  .art-box {
    width: 25%;
    padding: 15px;
  }
  @media screen and (max-width: 540px) {
    margin: -0.1rem;
    .art-box {
      width: 50%;
      padding: 0.1rem;
    }
  }
}
.ui-body {
  min-height: calc(100vh - 80px);
  @media screen and (max-width: 540px) {
    min-height: 100vh;
  }
}
.max-width {
  max-width: 1150px;
  padding: 0 30px;
  margin: 0 auto;
  @media screen and (max-width: 540px) {
    padding: 0 0.3rem;
  }
}
.head-wrap {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  color: #ffffff;
  padding-top: 42px;
  @media screen and (max-width: 540px) {
    display: block;
    padding-top: 0.32rem;
  }
  .left-wrap {
    font-size: 19px;
    font-weight: bold;
    color: #ffffff;
    line-height: 27px;
    .date {
      margin-top: 8px;
    }
  }
  .active-time-wrap {
    .title {
      text-align: center;
      margin-bottom: 12px;
      .icon-works-time {
        position: relative;
        top: 3px;
        left: 4px;
      }
    }
    @media screen and (max-width: 540px) {
      .title {
        text-align: right;
        margin-bottom: 0.1rem;
        font-size: 0.28rem;
      }
    }
  }
}
.search-wrap {
  display: flex;
  align-items: center;
  .txt {
    font-size: 14px;
    color: #ffffff;
    display: inline-block;
    padding-left: 2px;
  }
  .search-input {
    border: none;
    outline: none;
    background-color: transparent;
    display: block;
    font-size: 14px;
    color: #ffffff;
    padding-left: 10px;
    width: 150px;
    &::-webkit-input-placeholder {
      font-size: 14px;
      color: #ffffff;
    }
  }
  .icon-search {
  }
}
.tool-wrap {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  .surplus-num {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    b {
      font-size: 16px;
    }
  }
  @media screen and (max-width: 540px) {
    display: block;
    text-align: right;
    font-size: 0.26rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 0.16rem;
    .surplus-num {
      font-size: 0.24rem;

      b {
        font-size: 0.32rem;
      }
    }
  }
}
.icon-works-time {
  width: 16px;
  height: 16px;
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-works-time.png");
}
.icon-search {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-search.png");
}
.line {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  margin: 15px 0;
}
.empty-wrap {
  padding-top: 20vh;
  img {
    width: 80%;
    display: block;
    max-width: 183px;
    margin: 0 auto 16px;
  }
  .txt {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
  }
}
</style>
