<template>
  <div class="v1-mine-menu">
    <ul>
      <li
        :class="{ 'menu-first': true }"
        v-for="(item, index) in menuList"
        :key="index"
      >
        <router-link
          v-if="item.url"
          :class="{
            active: activePath == item.url,
            hide: item.isAuthor == 1 && user_info.isAuthor != 1,
          }"
          :to="item.url"
          >{{ item.name }}</router-link
        >
        <a v-else class="no-hand">{{ item.name }}</a>
        <ul>
          <li
            :class="{ 'menu-second': true, active: activePath == citem.url }"
            v-for="(citem, cindex) in item.child"
            :key="cindex"
          >
            <router-link :to="citem.url">{{ citem.name }}</router-link>

            <!-- <a :href="citem.url">{{ citem.name }}</a> -->
            <i v-if="citem.amount && citem.amount > 0">{{ citem.amount }}</i>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  components: {},
  watch: {
    $route: function (to, from) {
      this.activePath = to.path;
    },
  },
  computed: {
    user_info() {
      return this.$store.state.user_info;
    },
  },
  mounted() {
    this.activePath = window.location.pathname;
  },
  data() {
    return {
      activePath: "",
      menuList: [
        { name: "个人中心", url: "/mine" },
        {
          name: "常用管理",
          child: [
            // { name: "我的作品", url: "/mine/opus", isAuthor: 1 },
            { name: "我的藏品", url: "/mine/treasure" },
            { name: "我的礼物", url: "/mine/gift" },
            { name: "赠与管理", url: "/mine/gift_manage" },
			{ name: "我的卡券", url: "/mine/virtual_coupon" },
          ],
        },
        {
          name: "社交数据",
          child: [
            { name: "我的关注", url: "/mine/attention/1", amount: 0 },
            { name: "我的粉丝", url: "/mine/attention/2", amount: 0 },
            { name: "我喜欢的", url: "/mine/collect" },
            /*           { name: "历史浏览", url: "/mine/history" }, */
          ],
        },
        {
          name: "我的订单",
          child: [
            { name: "我买到的", url: "/mine/buy" },
            { name: "我发布的", url: "/mine/release" },
            { name: "我卖出的", url: "/mine/sold" },
            // { name: "我提取的", url: "/mine/withdraw" },
          ],
        },
        {
          name: "支付管理",
          child: [
            { name: "结算账户管理", url: "/mine/wallet/account_manage" },
            { name: "支付总览", url: "/mine/wallet/index" },
            /*           { name: "第三方支付", url: "/mine/wallet/third" }, */
            { name: "银行卡绑定", url: "/mine/wallet/bank" },
          ],
        },
        {
          name: "设置管理",
          child: [{ name: "个人设置", url: "/mine/setting/index" }],
        },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.hide {
  display: none !important;
}
.v1-mine-menu {
  padding: 30px 0 0 54px;
  min-width: 150px;
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      position: relative;
      a {
        position: relative;
      }
      a.active,
      &.active {
        &::after {
          content: "";
          display: block;
          width: 20px;
          height: 2px;
          bottom: -4px;
          background: #e61f1a;
          border-radius: 4px;
          position: absolute;
        }
      }
    }
    .menu-first {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
      cursor: pointer;
      margin-bottom: 24px;
      a {
        color: #000000;
        &.no-hand {
          cursor: default;
        }
      }
      &:nth-child(1) {
        a {
          color: #e61f1a;
        }
      }
      ul {
        padding-left: 0;
        margin-left: 0;
        .menu-second {
          padding-top: 12px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.7);
          position: relative;
          a {
            color: rgba(0, 0, 0, 0.7);
          }
          &:nth-child(1) {
            padding-top: 16px;
          }
          i {
            width: 30px;
            height: 16px;
            display: inline-block;
            text-align: center;
            position: absolute;
            background: rgba($color: #000000, $alpha: 0.1);
            border-radius: 8px;
            font-size: 12px;
            left: 72px;
            font-weight: bold;
            color: #e61f1a;
            line-height: 14px;
            font-style: normal;
            margin-top: 2px;
          }
        }
      }
    }
  }
}
</style>
