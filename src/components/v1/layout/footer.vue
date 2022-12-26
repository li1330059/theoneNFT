<template>
  <div class="v1-footer" v-if="isShowFooter">
    <div class="v1-footer-main">
      <div>
        <div class="logo"></div>
      </div>
      <div v-for="(item, index) in menuList" :key="index">
        <h1>{{ item.name }}</h1>
        <ul>
          <li
            :class="itemChild.icon"
            v-for="(itemChild, indexChild) in item.children"
            :key="indexChild"
            @click="goPage(itemChild)"
          >
            <a :href="itemChild.to">{{ itemChild.name }}</a>
            <img
              class="hover"
              v-show="index == 0 && indexChild == 2"
              :src="`https://static.theone.art/pc/images/weixin.png?timer=${new Date().getTime()}`"
              alt=""
            />
            <img
              class="hover"
              v-show="index == 0 && indexChild == 4"
              src="//static.theone.art/pc/images/red.png"
              alt=""
            />
          </li>
        </ul>
      </div>
    </div>
    <div class="version" v-html="versionName"></div>
  </div>
</template>
<script>
import App from "@/utils/app/index";
export default {
  data() {
    return {
      isShowFooter: true,
      menuList: [
        {
          name: "关注我们",
          children: [
            {
              icon: "icon1",
              name: "微博",
              url: "https://weibo.com/u/7612430345",
            },
            {
              icon: "icon2",
              name: "抖音",
              url: "https://www.douyin.com/user/MS4wLjABAAAAxzy6P5RFyjtvtLwhvT16ruaLPTr9-O5EOXG3K_5gjpyo3EjqEDyx6t3FN1MG-Rdp?extra_params=%7B%22search_id%22%3A%22202108031507510102120651360D035582%22%2C%22search_result_id%22%3A%222744796156528366%22%2C%22search_keyword%22%3A%22%E5%94%AF%E8%89%BA%E5%8A%A0%E5%AF%86%E8%89%BA%E6%9C%AF%22%2C%22search_type%22%3A%22video%22%7D&enter_method=search_result&enter_from=search_result",
            },
            { icon: "icon3", name: "微信" },
            {
              icon: "icon4",
              name: "bilibili",
              url: "https://space.bilibili.com/1106814175?spm_id_from=333.788.b_765f7570696e666f.1",
            },
            { icon: "icon5", name: "小红书" },
            { icon: "icon6", name: "邮箱", url: "mailto:service@theone.art" },
          ],
        },
        {
          name: "唯艺热点",
          children: [
            // { name: "新闻动态", to: "/news" },
            // { name: "平台公告" },
            // { name: "平台活动" },
          ],
        },
        {
          name: "帮助中心",
          children: [
            { name: "平台规则和常见问题", to: "/question" },
            { name: "唯一平台使用指南", to: "/guide" },
          ], //, { name: "在线客服" }
        },
        {
          name: "合作伙伴",
          children: [{ name: "中国美术学院" }, { name: "杭州美术家协会" }],
        },
        {
          name: "关于我们",
          children: [
            { name: "关于唯一艺术", to: "/about" },
            { name: "加入我们", to: "/join" },
            { name: "APP下载", to: "/app_download/3d" },
          ],
        },
      ],
      versionName: `浙ICP备2021024600号 | 增值电信业务经营许可证（EDI）：浙B2-20210658 | 拍卖经营批准证：浙杭3300631100002022 | 浙网信备33011021539843750010号 | 杭余艺术品备（2021）1号｜<a class="auth-wrap"
          target="_blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011002016487"
          ><img
            src="//static.theone.art/pc/icons/icon-auth.png"
          />
          <span> 浙公网安备 33011002016487号 </span>｜</a >等保三级 33012213067-00001
      <div>© 2018-${this.$dayjs().format("YYYY")} TheOne.Art 版权所有</div>`,
    };
  },
  created() {
    this.getNewsCategory();
    this.checkFooterStatus(this.$route.meta);
  },
  watch: {
    $route: function (to, from) {
      console.log(to.meta);
      this.checkFooterStatus(to.meta);
    },
  },
  methods: {
    checkFooterStatus(meta) {
      if (App.browser.theone && App.browser.theone.isTheOne) {
        //app内
        this.isShowFooter = false;
      } else {
        this.isShowFooter = !(meta.isShowFooter === false);
      }
    },
    goPage(item) {
	  this.$sensors.track('bottom_click', {
	  	button_name: item.name
	  });
      if (item.url) {
        window.open(item.url);
      }
    },
    pagewechat() {
      window.open(
        "https://www.yuque.com/books/share/9034652a-92b5-4175-b8c7-bc3435c6e6c6"
      );
    },
    addImgClick() {
      this.isShowAddImg = !this.isShowAddImg;
    },
    goAboutUs() {
      const aboutUs = this.$router.resolve({ path: "/about" });
      window.open(aboutUs.href, "_blank");
    },
    //获取新闻动态分类
    async getNewsCategory() {
      if (this.$common.isMobile()) {
        return;
      }
      let result = await this.$api.service.category_findList({ name: "" });
      if (result && result.data.code == 200) {
        this.menuList[1].children = result.data.data.map((item) => {
          item.to = `/hotspot?type=${item.id}`;
          return item;
        });
      } else {
        // this.$message.error("获取新闻信息失败");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.v1-footer {
  padding: 32px 40px 10px;
  background: #f4f4f4;
  position: relative;
  z-index: 3;
  ::v-deep .auth-wrap {
    color: rgba(102, 102, 102, 0.7);
    img {
      display: inline-block;
      width: 14px;
      transform: translateY(1px);
    }
  }
  .v1-footer-main {
    margin-bottom: 85px;
    display: flex;
    justify-content: space-between;
    .logo {
      background: url("//static.theone.art/pc/images/pic-home/logo-footer.png")
        no-repeat center center;
      background-size: 100% 100%;
      width: 116px;
      height: 54px;
    }
    > div {
      flex: 1;
    }
    > div:nth-child(2) {
      ul {
        display: flex;
        flex-wrap: wrap;
        width: 160px;
        li {
          width: 80px;
          padding-left: 25px;
          background: url("~@/assets/1.0/images/footer-icon1.png") no-repeat
            left center;
          background-size: 18px 18px;
          position: relative;
          @for $i from 1 through 6 {
            &.icon#{$i} {
              background-image: url("~@/assets/1.0/images/footer-icon#{$i}.png");
            }
          }
          .hover {
            display: none;
            position: absolute;
            bottom: -80px;
            right: -80px;
            z-index: 10;
            width: 100px;
            height: 100px;
          }
          &:hover {
            .hover {
              display: inline-block;
              transition: all 9s;
            }
          }
        }
      }
    }
    h1 {
      color: #000000;
      line-height: 22px;
      font-size: 16px;
      margin-bottom: 16px;
    }
    ul {
      li {
        font-size: 12px;
        line-height: 20px;
        margin-bottom: 12px;
        a {
          color: rgba($color: #000000, $alpha: 0.4);
          cursor: pointer;
        }
      }
    }
  }
  .version {
    font-size: 12px;
    color: rgba($color: #666, $alpha: 0.7);
    line-height: 24px;
    text-align: center;
  }
}
</style>
<style lang="sass" scoped></style>
