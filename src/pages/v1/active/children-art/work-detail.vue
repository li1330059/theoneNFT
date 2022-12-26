<template>
  <div>
    <div class="loading-wrap" v-if="isLoading">
      <loading></loading>
    </div>
    <div class="ui-body children-art-bg-color" v-else>
      <section class="max-width search-block">
        <search @listenChange="searchChange" @listenSearch="listenSearch" />
      </section>
      <section class="goods-block max-width">
        <div class="goods-cover">
          <div
            class="cover"
            :style="`background-image:url(${workObj.creationPath})`"
          >
            <img
              class="cover-img"
              ref="cover-img"
              :src="workObj.creationPath"
              :large="workObj.creationPath"
              preview="1"
            />
          </div>
        </div>
        <div class="goods-detail">
          <div class="goods-detail-blcok radius">
            <div class="line-bar">
              <div class="label name">{{ workObj.name }}</div>
              <div class="val hand share-block">
                <g-share :qq-path="qqPath" :placement="placement">
                  <span slot="share" class="ui-icon icon-share"></span
                ></g-share>
              </div>
            </div>
            <div class="line-bar">
              <div class="label">作家</div>
              <div class="val author-wrap">
                <span class="ui-icon icon-author"></span
                >{{ workObj.authorName }}
              </div>
            </div>
            <div class="line-bar">
              <div class="label">序号</div>
              <div class="val">{{ workObj.serialNum }}</div>
            </div>
          </div>
          <div class="goods-vote-blcok radius">
            <div class="sign">
              获得票数：<b>{{ workObj.voteNum }}</b
              >票
            </div>

            <img
              src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/btn-voted.png"
              class="vote-btn"
              v-if="isVote"
            />
            <img
              src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/btn-vote.png"
              class="vote-btn hand"
              @click="onVote"
              v-else
            />
          </div>
        </div>
      </section>
      <section class="max-width" v-if="workObj.creationDetail">
        <div
          class="rule-wrap children-art-introduce-color children-art-introduce-bg-color radius"
        >
          <img
            src="https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/work-title.png"
            class="title"
          />
          <div v-html="workObj.creationDetail"></div>
        </div>
      </section>
    </div>
    <vote ref="voteRef" @listenSuccess="voteSuccess"></vote>
  </div>
</template>
<script>
import loading from "@/components/v1/loading/loading";
import Vote from "./components/vote.vue";
import createstyle from "./create-style";
import Search from "./components/search.vue";
export default {
  components: { loading, Vote, Search },
  data() {
    return {
      isLoading: true,
      isVote: false,
      workObj: {},
      link: "",
      qqPath: "",
      placement: "right-start",
      searchTxt: "",
    };
  },
  created() {
    this.work_id = this.$route.params.work_id;
    this.active_uuid = this.$route.params.active_uuid;
    this.link = window.location.href;
    if (this.$common.isMobile()) {
      this.placement = "left-start";
    }

    this.init();
  },
  mounted() {},
  computed: {},
  beforeDestroy() {},
  methods: {
    init() {
      this.isLoading = true;
      this.getDetail();
      createstyle(this, this.active_uuid);
    },
    searchChange(txt) {
      /*    this.searchTxt = txt; */
    },
    listenSearch(e) {
      const txt = e.target.value;
      if (txt) {
        this.$router.push(
          `/active/children_art/works/${
            this.active_uuid
          }?search=${encodeURIComponent(txt)}`
        );
      }
      console.log(txt);
    },
    onCopy() {
      this.$message.success("已复制");
    },
    onCopyError() {
      this.$message.warning("复制失败");
    },
    async getDetail() {
      const res = await this.$api.service.voterActivity_creation_detail({
        uuid: this.work_id,
      });
      this.isLoading = false;
      if (res.data.code == 200) {
        this.workObj = res.data.data;
        this.qqPath = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(
          window.location.href
        )}&sharesource=qzone&title=少儿数字艺术创作大赛&pics=${
          this.workObj.creationPath
        }&summary=${this.workObj.name}&desc=${this.workObj.name}`;
      } else {
        this.$message.error(res.data.message);
      }
    },
    onVote() {
      this.$refs.voteRef.vote(this.work_id);
    },
    voteSuccess() {
      this.$message.success("投票成功");
      this.isVote = true;
      this.getDetail();
    },
  },
};
</script>
<style lang="scss" scoped>
.search-block {
  display: flex;
  justify-content: flex-end;
  height: 26px;
  @media screen and (max-width: 540px) {
    height: 20px;
  }
}
.radius {
  border-radius: 10px;
  @media screen and (max-width: 540px) {
    border-radius: 0.1rem;
  }
}
.icon-copy {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-copy.png");
}
.icon-wx {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-wechart.png");
}
.icon-qq {
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-qq.png");
}
.share-block {
  position: relative;
  top: 0;
  left: 0;

  .share-list {
    position: absolute;
    top: -13px;
    left: 25px;
    display: flex;
    background: #e2e9f5;
    box-shadow: 0px 0px 6px 0px rgba(105, 145, 206, 0.38);

    padding: 10px;
    .ui-icon {
      width: 18px;
      height: 18px;
      margin-right: 16px;
    }
    .ui-icon:last-child {
      margin-right: 0;
    }
  }
}
.vote-btn {
  width: 204px;
  display: block;
  margin: 0 auto;
}
.icon-author {
  background-image: url("//static.theone.art/pc/icons/icon-author.png");
}
.icon-share {
  width: 18px;
  height: 18px;
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/icon-share.png");
}

.ui-body {
  background: linear-gradient(180deg, #5481c0 0%, #cde1fe 100%);
  min-height: 100vh;
  padding-top: 20px;
  @media screen and (max-width: 540px) {
    padding: 0.35rem 0.3rem 1rem;
  }
}
.loading-wrap {
  padding-top: 30vh;
}
.max-width {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}
.goods-block {
  display: flex;
  margin-bottom: 30px;
  @media screen and (max-width: 540px) {
    display: block;
  }
}
.goods-cover {
  flex: 1;
  padding: 60px;
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/mid/goods-bg.png");
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .cover {
    height: 100%;
    background-position: center;
    background-size: cover;
    position: relative;
    top: 0;
    left: 0;
  }
  .cover-img {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
  @media screen and (max-width: 540px) {
    margin: 0 -0.2rem;
    padding: 0.9rem 0.8rem;
    .cover {
      padding-bottom: 100%;
    }
  }
}
.goods-detail {
  flex: 1.4;
  padding: 1.3% 0 1.3% 3.4%;
  @media screen and (max-width: 540px) {
    padding: 1.3% 0;
  }
}
.goods-detail-blcok {
  background: rgba(226, 233, 245, 0.25);
  margin-bottom: 32px;
  padding: 20px 16px;

  border: 1px solid rgba(255, 255, 255, 0.25);
}
.goods-vote-blcok {
  background-color: rgba(226, 233, 245, 0.25);
  background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/detail-bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom right;
  padding-bottom: 36px;
  .sign {
    display: inline-block;
    min-width: 180px;
    margin-bottom: 32px;
    background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/detail-vote.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 10px 30px 10px 10px;
    font-size: 16px;
    color: #fff;
    @media screen and (max-width: 540px) {
      background-image: url("https://theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/children-art/detail-vote-mobile.png");
    }
    b {
      font-size: 20px;
    }
  }
}
.line-bar {
  display: flex;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  padding: 8px 0;
  justify-content: space-between;
  align-items: center;
  .label {
  }
  .value {
  }
  .name {
    font-size: 20px;
    font-weight: bold;
  }
}
.author-wrap {
  display: flex;
  align-items: center;
  .icon-author {
    width: 18px;
    height: 18px;
    display: inline-block;
    margin-right: 8px;
  }
}
.rule-wrap {
  margin-top: 75px;
  padding: 55px 30px 24px;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  position: relative;
  top: 0;
  left: 0;
  box-shadow: 0px 0px 6px 0px rgba(105, 145, 206, 0.38);

  .title {
    width: 218px;
    position: absolute;
    top: 0;
    transform: translateY(-50%);
    left: -11px;
  }
  @media screen and (max-width: 540px) {
    .title {
      width: 3.2rem;
      left: -0.18rem;
    }
  }
}
</style>
