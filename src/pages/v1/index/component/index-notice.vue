<template>
  <div class="ui-body" v-if="noticeArr.length > 0">
    <div v-if="showNotice">
      <div class="phone-padding"></div>
      <div class="m-notice" :class="{ active: isActive }">
        <div class="content">
          <div class="swiper-container swiper j-notice-swiper">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(item, idx) in noticeArr"
                :key="idx"
                :data-obj="JSON.stringify(item || {})"
              >
                <div class="notice-content grayscale" @click="sensousClick(item.name)">
                  <div class="left padding">
                    <div class="time">
                      {{ $common.formatDate(item.releaseTime, "yyyy-MM-dd") }}
                    </div>
                    <div class="phone-time">
                      {{ $common.formatDate(item.releaseTime, "MM-dd") }}
                      <span>{{
                        $common.formatDate(item.releaseTime, "yyyy")
                      }}</span>
                    </div>
                    <div class="line"></div>
                    <div class="notice-title">公告</div>
                  </div>
                  <div class="txt">{{ item.name }}</div>
                  <div class="btns">
                    <div class="ui-btn ui-btn-red">了解详情</div>
                  </div>
                  <!--       <div class="right padding" @click.stop="onClose(item)">
                    <div class="close icon"></div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="theone-dialog"
      :visible.sync="isShowDetail"
      append-to-body
      width="570px"
      :lock-scroll="true"
      title="公告"
    >
      <div class="content">
        <div class="txt" v-html="detailHtml"></div>
        <div class="time" v-if="releaseTime">时间：{{ releaseTime }}</div>
      </div>
      <div class="ui-btn-group ui-btn-end">
        <div class="ui-btn ui-btn-red" @click="isShowDetail = false">
          我知道了
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "IndexNotice",
  components: {},
  data() {
    return {
      showNotice: true,
      noticeArr: [],
      detailHtml: "",
      isShowDetail: false,
      releaseTime: "",
      isActive: false,
    };
  },
  created() {
    this.getNotice();
    window.addEventListener("scroll", this.scroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scroll, false);
  },

  mounted() {},

  computed: {},
  methods: {
    scroll() {
      const scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      this.isActive = scrollTop > 10;
    },
	sensousClick(name) {
      this.$sensors.track('homepage_click', {
      	module_name: "顶部公告栏",
		button_name:name
      });
    },
    onClose() {
      this.showNotice = false;
    },
    onShowDetail(info) {
      this.getNoticeDetail(info.uuid);
    },
    createNoticeSwiper() {
      const self = this;
      this.swiper = new Swiper(".j-notice-swiper", {
        loop: this.noticeArr.length > 1 ? true : false, // 循环模式选项
        speed: 300,
        autoplay: 5000,
        height: 74,
        direction: "vertical",
        autoplayDisableOnInteraction: false,
        waitForTransition: false,
      });
      this.swiper.on("click", function (swiper) {
        const data = swiper.clickedSlide.attributes["data-obj"].value;
        self.onShowDetail(JSON.parse(data));

        //some code
      });
    },
    async getNotice() {
      let res = await this.$api.service.dynamicNews_findNewsList({
        pageCount: 1,
        pageSize: 12,
        location: "list",
        categoryId: 40,
      });
      /*      res = {
        data: {
          code: 200,
          message: "成功",
          data: {
            records: [
              {
                name: "由于C支付通道周末临时维护，C支付通道的25日及以前的提现将在今日中午下午陆续到账，26日的提现将在今日24点前陆续完成到账。唯一艺术所有交易资金都在持牌第三方支付托管账户，安全可靠，但需要平台和第三方一起协同处理技术工作，感谢大家的理解。",
                summarize: null,
                categoryName: null,
                location: "list",
                cover:
                  "https://theoneart-common.oss-cn-qingdao.aliyuncs.com/author/547870fd78e37bcbc415b8687d04e6e71648347619907.png",
                updateBy: "admin",
                releaseBy: "admin",
                releaseTime: "2022-03-27 10:20:40",
                activityStartTime: null,
                activityEndTime: null,
                uuid: "b715ecb84de245db226c6fc79b8ebc74",
              },
              {
                name: "作为行业的最新尝试，3万个不同结果的版权盲盒同时开启，确实带来了新的挑战，但也证明了唯一艺术用户对版权画作的热情。我们抓紧时间寻找各项服务的薄弱环节，尽快优化，解决开盲盒拥堵的问题。但如大家所说，临时打补丁永远不是办法，我们也将在用户数量级快速增长的现状下，业务不停的要求下，早日部署更成熟稳定的新架构。感谢大家的理解，春节以来平台用户量大增，也带来了服务的不稳定，感谢大家的忍耐和包容，我们400电话也将上线，有各类问题的用户后续也可以通过电话咨询。",
                summarize:
                  "作为行业的最新尝试，3万个不同结果的版权盲盒同时开启，确实带来了新的挑战，但也证明了唯一艺术用户对版权画作的热情。我们抓紧时间寻找各项服务的薄弱环节，尽快优化，解决开盲盒拥堵的问题。但如大家所说，临时打补丁永远不是办法，我们也将在用户数量级快速增长的现状下，业务不停的要求下，早日部署更成熟稳定的新架构。感谢大家的理解，春节以来平台用户量大增，也带来了服务的不稳定，感谢大家的忍耐和包容，我们400电话也将上线，有各类问题的用户后续也可以通过电话咨询。",
                categoryName: null,
                location: "list",
                cover: null,
                updateBy: "admin",
                releaseBy: "admin",
                releaseTime: "2022-03-26 22:38:11",
                activityStartTime: null,
                activityEndTime: null,
                uuid: "c1e4847e1fb57d3d58e7303a48899d03",
              },
              {
                name: "公告：29日0点到8点平台将进行维护，届时市场将暂停使用，其他功能不受影响。",
                summarize:
                  "公告：25日零点到8点平台将进行维护，届时市场将暂停使用，其他功能不受影响。",
                categoryName: null,
                location: "list",
                cover: null,
                updateBy: "王希腾",
                releaseBy: "王希腾",
                releaseTime: "2022-03-24 19:10:53",
                activityStartTime: null,
                activityEndTime: null,
                uuid: "0a436690e424a925944834852cf9af0d",
              },
              {
                name: "近期部分活动变更公告",
                summarize: null,
                categoryName: null,
                location: "list",
                cover: null,
                updateBy: "田婷",
                releaseBy: "田婷",
                releaseTime: "2022-03-24 14:00:00",
                activityStartTime: null,
                activityEndTime: null,
                uuid: "7f8e63bb947f81346003d38dc05c78df",
              },
              {
                name: "网页端移动支付已上线，APP端还需要一段时间的部署，请先使用网页端 theone.art 感谢用户一直以来的支持。",
                summarize:
                  "网页端移动支付已上线，APP端还需要一段时间的部署，请先使用网页端 theone.art 感谢用户一直以来的支持。",
                categoryName: null,
                location: "list",
                cover: null,
                updateBy: "admin",
                releaseBy: "admin",
                releaseTime: "2022-03-23 23:49:47",
                activityStartTime: null,
                activityEndTime: null,
                uuid: "4d1c4998c962542ed48e04beb5324c21",
              },
              {
                name: "尊敬的用户您好，为让您更好区分唯一艺术平台购买和售卖时输入的密码与支付通道中结算提现使用的“支付密码”，现唯一艺术平台购买和售卖时需要的密码称谓已变更为“安全锁密码”，此处升级不会影响您的使用。",
                summarize:
                  "尊敬的用户您好，为让您更好区分唯一艺术平台购买和售卖时输入的密码与支付通道中结算提现使用的“支付密码”，现唯一艺术平台购买和售卖时需要的密码称谓已变更为“安全锁密码”，此处升级不会影响您的使用。",
                categoryName: null,
                location: "list",
                cover: null,
                updateBy: "admin",
                releaseBy: "admin",
                releaseTime: "2022-03-21 21:31:03",
                activityStartTime: null,
                activityEndTime: null,
                uuid: "9523bcdb42a55f78c6a5d9cfcda1f0b2",
              },
            ],
            total: 6,
            size: 10,
            current: 1,
            orders: [],
            optimizeCountSql: true,
            hitCount: false,
            countId: null,
            maxLimit: null,
            searchCount: true,
            pages: 1,
          },
        },
      }; */
      if (res.data.code == 200 && res.data.data.records.length > 0) {
        this.noticeArr = res.data.data.records;
        this.$nextTick(() => {
          this.createNoticeSwiper();
        });
      }
    },
    async getNoticeDetail(uuid) {
      const res = await this.$api.service.dynamicNews_findNews({
        uuid,
      });
      if (res.data.code == 200) {
        this.isShowDetail = true;
        this.detailHtml = res.data.data.details.replace(/\\n/gi, "<br>");
        this.releaseTime = res.data.data.releaseTime
          ? new Date(res.data.data.releaseTime.replace(/\-/gi, "/")).Format(
              "yyyy-MM-dd"
            )
          : "";
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$pc-height: 74px;

.phone-padding {
  height: 72px;
  display: none;
  @media screen and (max-width: 540px) {
    display: block;
  }
}
.phone-time {
  display: none;
}

.icon-notice {
  width: 16px;
  height: 16px;
  background-image: url("//static.theone.art/pc/icons/icon-notice.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: inline-block;
}
.ui-btn-group {
  margin-top: 20px;
}
.notice-title {
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  width: 36px;
  height: 18px;
  background: linear-gradient(149deg, #ff7a64 0%, #e61f1a 100%);
  border-radius: 2px;
  text-align: center;
}
.theone-dialog {
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .content {
    max-height: 420px;
    overflow-y: auto;
    overflow-x: hidden;
    line-height: 28px;
    .time {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
    }
    ::v-deepimg {
      display: block;
      max-width: 100%;
    }
  }
  @media screen and (max-width: 540px) {
    .content {
      max-height: 4.2rem;
      ::v-deep img {
        max-width: 90%;
        margin: 0 auto;
      }
    }
  }
}
.m-notice {
  position: fixed;
  top: 80px;
  left: 50%;
  z-index: 999;
  transform: translateX(-50%);
  height: $pc-height;
  overflow: hidden;
  padding: 0 10px;
  transition: all ease-in-out 0.26s;

  width: 100%;

  cursor: pointer;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.08);
  &.active {
    background: rgba(255, 255, 255, 1);
  }

  .txt {
  }
  @media screen and (max-width: 540px) {
    top: 1.08rem;
    width: 100%;
    font-size: 0.28rem;
    padding: 0 0.2rem;
    background-size: contain;
    bottom: -0.4rem;

    background: rgba(255, 255, 255, 1);
    .content {
      width: 100%;
      background-size: contain;
    }
    .swiper-slide {
    }
    .txt {
    }
  }
}
.notice-content {
  max-width: 1170px;
  margin: 0 auto;
  .icon {
  }
  height: $pc-height;
  display: flex;
  align-items: center;
  .txt {
    font-size: 14px;

    line-height: 18px;
    height: 18px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba(0, 0, 0, 0.7);
    flex: 1;
  }
  .padding {
    padding: 0 6px;
  }
  .close {
    width: 14px;
    height: 14px;
    background-image: url("//static.theone.art/pc/icons/icon-notice-close.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    display: inline-block;
  }
  .right {
    padding-top: 1px;
  }
  .left {
    display: flex;
    align-items: center;
    .time {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .line {
      width: 1px;
      height: 20px;
      opacity: 0.1;
      border: 1px solid #333333;
      margin: 0 16px;
    }
  }
  @media screen and (max-width: 540px) {
    .icon {
      top: 0;
    }
  }
}
@media screen and (max-width: 540px) {
  .btns {
    display: none;
  }
  .time {
    display: none;
  }
  .phone-time {
    display: block;
    font-size: 0.28rem;
    font-weight: bold;
    color: #333333;
    span {
      display: block;
      font-size: 0.24rem;
      font-weight: 400;
      color: rgba(51, 51, 51, 0.6);
      margin-top: 0.12rem;
    }
  }
}
</style>
