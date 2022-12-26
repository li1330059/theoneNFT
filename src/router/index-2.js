import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Browser from "../utils/browser";
import $localStorage from "../utils/localStorage";
import api from "@/api";

const load = (pathName) => {
  ///*webpackChunkName: "[request]" */
  return () => import(`@/pages/v1/${pathName}`);
};
Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const routes = [
  {
    path: "/active_11",
    component: () => import("@/pages/v1/active/11"),
    meta: {
      requireAuth: false,
      hideService: true,
    },
  },
  {
    path: "/update",
    component: () => import("@/pages/v1/fig-leaf"),
    meta: {
      hideService: true,
    },
  },
  {
    path: "/app/agreement/:location",
    component: () => import("@/pages/v1/app/agreement"),
    meta: {
      hideService: true,
    },
  },

  {
    path: "/app/go_back",
    component: () => import("@/pages/v1/app/go-back"),
    meta: {
      hideService: true,
      hideMoblieFooter: true,
    },
  },
  {
    path: "/app/cb_face",
    component: () => import("@/pages/v1/app/cb-face"),
    meta: {
      hideService: true,
      hideMoblieFooter: true,
    },
  },
  {
    path: "/app/result/:key",
    component: () => import("@/pages/v1/app/result"),
    meta: {
      hideService: true,
      hideMoblieFooter: true,
    },
  },
  {
    path: "/qrcode/:txt",
    component: load("qrcode"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/qrcode_tip",
    component: load("qrcode-tip"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/ll_bag",
    component: load("ll-bag/index"),
    meta: {
      hideService: true,
      requireAuth: true,
      llAccountAuth: true,
    },
  },
  {
    path: "/ll_bag/result_status/:type",
    component: load("ll-bag/result-status"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/recharge",
    component: load("ll-bag/recharge"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/recharge_confirm/:info",
    component: load("ll-bag/recharge-confirm"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/withdraw",
    component: load("ll-bag/withdraw"),
    meta: {
      hideService: true,
      requireAuth: true,
      llAccountAuth: true,
    },
  },
  {
    path: "/ll_bag/bankcards_info",
    component: load("ll-bag/bankcards-info"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/pay_bankcard",
    component: load("ll-bag/pay-bankcard"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/pay",
    component: load("ll-bag/pay"),
    meta: {
      hideService: true,
      requireAuth: true,
      llAccountAuth: true,
    },
  },
  {
    path: "/ll_bag/account_opening",
    component: load("ll-bag/account-opening"),
    meta: {
      hideService: true,
      requireAuth: true,
      llAccountAuth: false,
    },
  },
  {
    path: "/ll_bag/billing_list",
    component: load("ll-bag/billing_list"),
    meta: {
      hideService: true,
      requireAuth: true,
      keepAlive: true,
    },
  },
  {
    path: "/ll_bag/billing_details",
    component: load("ll-bag/billing-details"),
    meta: {
      hideService: true,
      requireAuth: true,
      keepAlive: true,
    },
  },
  {
    path: "/ll_bag/security_setting",
    component: load("ll-bag/security-setting"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/change_pay_password",
    component: load("ll-bag/change-pay-password"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/reset_password_verify/:code/:token",
    component: load("ll-bag/reset-password-verify"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/reset_password",
    component: load("ll-bag/reset-password"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/bankcard_manage",
    component: load("ll-bag/bankcard-manage"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/bankcard_bind",
    component: load("ll-bag/bankcard-bind"),
    meta: {
      hideService: true,
      requireAuth: true,
      keepAlive: true,
    },
  },
  {
    path: "/ll_bag/bankcard_bind_confirm",
    component: load("ll-bag/bankcard-bind-confirm"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/bank-bind",
    component: load("ll-bag/bank-bind"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/res_status/open_fail",
    component: load("ll-bag/res-status/open-fail"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/res_status/bindcard_success",
    component: load("ll-bag/res-status/bindcard-success"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/res_status/bindcard_fail",
    component: load("ll-bag/res-status/bindcard-fail"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/res_status/recharge_success",
    component: load("ll-bag/res-status/recharge-success"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/res_status/recharge_fail",
    component: load("ll-bag/res-status/recharge-fail"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/res_status/open_success",
    component: load("ll-bag/res-status/open-success"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/active/exhibition/:key",
    component: load("active/exhibition/index"),
    meta: {
      hideService: true,
      requireAuth: false,
      hideMoblieFooter: true,
    },
  },
  {
    path: "/ll_bag/res_status/draw_fail",
    component: load("ll-bag/res-status/draw-fail"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/res_status/draw_success",
    component: load("ll-bag/res-status/draw-success"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/pay_fail",
    component: load("ll-bag/pay-fail"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/ll_bag/pay_success",
    component: load("ll-bag/pay-success"),
    meta: {
      hideService: true,
      requireAuth: true,
    },
  },
  {
    path: "/",
    component: (r) =>
      require.ensure([], () => r(require(`@/views/v1`)), "group-index"),
    children: [
      {
        path: "agreement/:location",
        component: () => import("@/pages/v1/agreement"),
        meta: {
          hideService: true,
        },
      },
      {
        path: "active/children_art/:active_uuid",
        component: load("active/children-art"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: true,
        },
      },
      {
        path: "active/children_art/works/:active_uuid",
        component: load("active/children-art/works"),
        meta: {
          hideService: true,
          requireAuth: true,
          isShowFooter: false,
          hideMoblieFooter: true,
        },
      },
      {
        path: "active/children_art/work_detail/:active_uuid/:work_id",
        component: load("active/children-art/work-detail"),
        meta: {
          hideService: true,
          requireAuth: true,
          isShowFooter: false,
          hideMoblieFooter: true,
        },
      },
      {
        path: "/active/exhibition/:key",
        component: load("active/exhibition/index"),
        meta: {
          hideService: true,
          requireAuth: false,
          hideMoblieFooter: true,
        },
      },
      {
        path: "active_date",
        component: load("active-date/index"),
        meta: {
          hideService: true,
          requireAuth: true,
        },
      },
      {
        path: "active_date/detail/:key",
        component: load("active-date/detail"),
        meta: {
          hideService: true,
          requireAuth: true,
        },
      },
      {
        path: "collect",
        component: load("active/collect"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: true,
        },
      },
      {
        path: "treasuresku_info/:id",
        component: load("mine/treasure/treasureSkuInfo"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: true,
        },
      },
      {
        path: "/active/compose/sys",
        component: load("active/compose-sys/index"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: false,
        },
      },
      {
        path: "/active/compose/520",
        component: load("active/compose-520/index"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: false,
        },
      },

      {
        path: "/active/linkage_compose/:key",
        component: load("active/linkage-compose/index"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: false,
        },
      },
      {
        path: "/active/compose",
        component: load("active/compose/index"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: false,
        },
      },
      {
        path: "/img_active",
        component: load("active/img-active"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: true,
        },
      },
      {
        path: "/active/invite",
        component: load("active/invite"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: true
        }
      },
      /*
      {
        path: "invite_friends_detail",
        component: load("active/invite/invite-friends-detail"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: true
        },
      },
      {
        path: "invite_user_registration/:invitation_code",
        component: load("active/invite/invite-user-registration"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: true,
          des: '新用户注册页面'
        },
      },
      {
        path: "invite_user_name_auth",
        component: load("active/invite/invite-user-name-auth"),
        meta: {
          hideService: true,
          requireAuth: true,
          hideMoblieFooter: true,
          des: '新用户实名认证'
        },
      },
      */
      {
        path: "active/drawlots/:key",
        component: load("active/lottery"),
        meta: {
          requireAuth: true,
          hideMoblieFooter: true,
          hideService: true,
        },
      },
      {
        path: "tomzone",
        component: load("active/tomzone/index"),
        meta: {
          requireAuth: true,
        },
      },
      // {
      //   path: "maySign",
      //   component: load('active/may-sign/index'),
      //   meta: {
      //     requireAuth: true,
      //   },
      // },
      {
        path: "active/xyxy",
        component: load("active/xyxy"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/LQJ",
        component: load("active/LQJ"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "hotspot",
        component: load("hotspot"),
        meta: {
          tab: 3,
          requireAuth: true,
        },
      },
      {
        path: "active/Dworks",
        component: load("active/dworks"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/royal_cats",
        component: load("active/royal-cats"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/digital_rongbao",
        component: load("active/digital-rongbao"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/mode",
        component: load("active/mode"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/tktwo",
        component: load("active/tktwo"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/xiangyanghua",
        component: load("active/xiangyanghua"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/cloisonne",
        component: load("active/cloisonne"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/meta_D",
        component: load("active/meta-D"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/walk",
        component: load("active/walk"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/dunhuang",
        component: load("active/dunhuang"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/cat_hand",
        component: load("active/cat-hand"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/huafeng_girl",
        component: load("active/huafeng-girl"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/lucky",
        component: load("active/lucky"),
        meta: {
          requireAuth: true,
        },
      },

      {
        path: "/bh_draw_result",
        component: load("baohu/bh-draw-result"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/stim",
        component: load("active/stim"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/golden_key_blind_box/:active_uuid",
        component: load("active/golden-key-blind-box"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "active/turntable_lottery_love/:active_uuid",
        component: load("active/turntable-lottery/love"),
        meta: {
          requireAuth: true,
          hideMoblieFooter: true,
          hideService: true,
        },
      },
      {
        path: "active/turntable_lottery/:active_uuid",
        component: load("active/turntable-lottery"),
        meta: {
          requireAuth: true,
          hideMoblieFooter: true,
          hideService: true,
        },
      },
      {
        path: "/bh_draw_result",
        component: load("baohu/bh-draw-result"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/bh_pay_result",
        component: load("baohu/bh-pay-result"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "/bh_password_result",
        component: load("baohu/bh-password-result"),
        meta: {
          requireAuth: true,
        },
      },
      /*     {
            path: "/update",
            component: r => require.ensure([], () => r(require(`@/pages/v1/update`)), 'group-index2'),
            meta: {
              requireAuth: true,
            }
          }, */
      {
        path: "activity",
        name: "activity",
        component: (r) =>
          require.ensure(
            [],
            () => r(require(`@/pages/v1/activity/index`)),
            "group-index3"
          ),
        meta: {
          style: "activity-index",
          requireAuth: true,
        },
      },
      {
        path: "integral",
        name: "integral",
        component: (r) =>
          require.ensure(
            [],
            () => r(require(`@/pages/v1/activity/integral`)),
            "group-index3"
          ),
        meta: {
          style: "activity-index",
          requireAuth: true,
        },
      },
      {
        path: "/404",
        component: load("404"),
        meta: {
          requireAuth: true,
        },
      },
      // 首页
      {
        path: "/",
        component: load("index/index"),
        meta: {
          style: "index",
          requireAuth: true,
          name: "首页",
          tab: 0,
          isGrey: true,
        },
      },
      {
        path: "pay_manage",
        component: load("active/pay-manage"),
        meta: {
          requireAuth: true,
          name: "支付管理帮助",
        },
      },
      // 市场  商品列表页
      {
        path: "list",
        component: load("goods/list"),
        meta: {
          requireAuth: true,
          name: "市场",
          tab: 1,
        },
      },
      {
        path: "market",
        component: load("goods/list"),
        meta: {
          requireAuth: true,
          name: "市场",
          isShowFooter: false,
          tab: 1,
        },
      },
      {
        path: "market/list",
        component: load("goods/market-list"),
        meta: {
          requireAuth: true,
          name: "市场",
          tab: 1,
        },
      },
      // 市场  商品列表页
      {
        path: "market/:type",
        component: load("goods/list"),
        meta: {
          requireAuth: true,
        },
      },
      // 市场  商品列表页带搜索
      {
        path: "market/search/:key",
        component: load("goods/list"),
        meta: {
          requireAuth: true,
        },
      },
      // 商品详情页
      {
        path: "goods/:id",
        component: load("goods/detail"),
        meta: {
          requireAuth: true,
        },
      },
      // 荣誉详情h5
      {
        path: "honorDetail/:id",
        component: load("goods/honor-details"),
        meta: {
          requireAuth: true,
        },
      },
      // 总量列表
      {
        path: "volumeList",
        component: load("goods/market-volume/volume-list"),
        meta: {
          requireAuth: true,
        },
      },
      // 单日总量
      {
        path: "volumeOne",
        component: load("goods/market-volume/volume-one"),
        meta: {
          requireAuth: true,
        },
      },
      // 总量详情
      {
        path: "volumeDetail",
        component: load("goods/market-volume/volume-detail"),
        meta: {
          requireAuth: true,
        },
      },
      // 商品购买页
      {
        name: "buy",
        path: "buy/:id",
        component: load("order/buy"),
        meta: {
          type: "goods",
          requireAuth: true,
        },
      },
      // 购买成功
      {
        path: "order/success",
        component: load("order/success"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "alipaysuccess",
        redirect: "order/success",
      },
      // 购买失败
      {
        path: "order/fail",
        component: load("order/fail"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "alipayfail",
        redirect: "order/fail",
      },
      // 个人中心 我买到的 支付
      {
        path: "mine/trade/pay/:orderId",
        component: load("order/buy"),
        meta: {
          type: "order",
          requireAuth: true,
        },
      },
      // 艺术家
      {
        path: "artist",
        component: load("artist/list"),
        meta: {
          requireAuth: true,
          // tab: 3,
        },
      },
      // 用户主页
      {
        path: "user/:id",
        component: load("user"),
        meta: {
          requireAuth: true,
        },
      },
      // 常见问题
      {
        path: "question",
        component: load("question/list"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "guide",
        component: load("question/guide"),
        meta: {
          requireAuth: true,
        },
      },
      // 关于我们  ->  关于唯一艺术
      {
        path: "about",
        component: load("about"),
        meta: {
          requireAuth: true,
        },
      },
      // 关于我们  ->  加入我们
      {
        path: "join",
        component: load("about/join-us"),
        meta: {
          requireAuth: true,
        },
      },
      // 新闻动态
      {
        path: "news_list/:id",
        component: load("news/list"),
        meta: {
          requireAuth: true,
        },
      },

      {
        path: "wallet/bill_m",
        component: load("mine/wallet/billM"),
        meta: {
          requireAuth: true,
        },
      },
      //新闻详情
      {
        path: "news/:id",
        component: load("news/detail"),
        meta: {
          requireAuth: true,
          footerTheoneHide: true,
          headerTheoneHide: true,
          // footerWechatHide: true,
          // footerWeiboHide: true,
          hideService: true,
        },
      }, //meta新闻详情
      {
        path: "meta_news/:id",
        component: load("news/meta-detail"),
        meta: {
          requireAuth: true,
          footerTheoneHide: true,
          headerTheoneHide: true,
          // footerWechatHide: true,
          // footerWeiboHide: true,
          hideService: true,
        },
      },
      {
        path: "mine/message",
        component: load("mine/message/list"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "mine/message/:id",
        component: load("mine/message/detail"),
        meta: {
          requireAuth: true,
        },
      },

      {
        path: "mine/order/:id",
        component: load("mine/trade/orderDetail"),
        meta: {
          requireAuth: true,
        },
      },
      // 个人中心
      {
        path: "mine",
        component: load("mine/layout"),
        meta: {
          requireAuth: true,
          tab: 4,
        },
        children: [
          {
            path: "transfer_record",
            component: load("mine/transfer-record"),
            meta: {
              requireAuth: true,
              tab: 4,
              type: "transfer",
              configType: "treasure-config",
            },
          },
          {
            path: "transfer_record_mobile",
            component: load("mine/transfer-record/mobile"),
            meta: {
              requireAuth: true,
              type: "transfer",
              configType: "treasure-config",
              // tab: 4,
            },
          },
          {
            path: "wallet/account_manage",
            component: load("mine/wallet/account-manage"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "wallet/account_manage_list/:payChannel",
            component: load("mine/wallet/account-manage-list"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "gift",
            component: load("mine/gift"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "gift_manage",
            component: load("mine/gift-manage"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "virtual_coupon",
            component: load("mine/virtual-coupon"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "/",
            component: load("mine"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },

          // {
          //   path: "fans/:type",
          //   component: () => import("@/pages/v1/mine/base/attention")
          // },

          {
            path: "attention/:type",
            component: load("mine/base/attention"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "collect",
            component: load("mine/base/collect"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          // 通用购买结果页面
          {
            path: "order/pay_result",
            component: load("order/pay-result"),
            meta: {
              requireAuth: true,
            },
          },
          // 购买成功
          /*     {
                path: "history",
                component: load('mine/base/history'),
                meta: {
                  requireAuth: true,
                  tab: 4
                },
              }, */
          {
            path: "opus",
            component: load("mine/base/opus"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "buy",
            component: load("mine/trade/buy"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "release",
            component: load("mine/trade/release"),
            meta: {
              requireAuth: true,
              name: "release",
              tab: 4,
            },
          },
          {
            path: "sold",
            component: load("mine/trade/sold"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "withdraw",
            component: load("mine/trade/withdraw"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "treasure",
            component: load("mine/treasure/treasure"),
            meta: {
              requireAuth: true,
              tab: 4,
              configType: "treasure-config",
            },
          },
          {
            path: "treasure/:id",
            component: load("mine/treasure/treasureSku"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "treasure/category",
            component: load("mine/treasure/category"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "wallet/index",
            component: load("mine/wallet"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "wallet/bill",
            component: load("mine/wallet/bill"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "wallet/pay_channel_bill/:way",
            component: load("mine/wallet/pay-channel-bill"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          /*,
                     {
                      path: "wallet/blockchain",
                      component: load("mine/wallet/blockchain"),
                      meta: {
                        requireAuth: true,
                        tab: 4
                      },
                    } */
          {
            path: "wallet/bill_m",
            component: load("mine/wallet/billM"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          /*    {
               path: "wallet/third",
               component: load("mine/wallet/third"),
               meta: {
                 requireAuth: true,
                 tab: 4
               },
             }, */
          {
            path: "wallet/bank",
            component: load("mine/wallet/bank"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
          {
            path: "setting/index",
            component: load("mine/setting"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },

          {
            path: "setting/personal_information",
            component: load("mine/setting/personalInformation"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },

          {
            name: "address-mobile",
            path: "setting/address-manage/address-mobile",
            component: load("mine/setting/address-manage/address-mobile"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },

          {
            path: "setting/address-manage/address-mobile-edit",
            component: load("mine/setting/address-manage/address-mobile-edit"),
            meta: {
              requireAuth: true,
              tab: 4,
            },
          },
        ],
      },
      {
        path: "login",
        component: load("login-registration/login"),
        meta: {
          hideService: true,
          requireAuth: false,
          hideMoblieFooter: true,
          tab: -1,
        },
      },
      {
        path: "authorize",
        component: load("login-registration/authorize"),
        meta: {
          requireAuth: true,
          tab: -1,
          hideService: true,
          hideMoblieFooter: true,
        },
      },
      {
        path: "verification",
        component: load("login-registration/verification"),
        meta: {
          requireAuth: false,
          tab: -1,
        },
      },
      {
        path: "personal_data",
        component: load("login-registration/personalData"),
        meta: {
          requireAuth: true,
        },
      },

      {
        path: "reset_password",
        component: load("login-registration/resetPassword"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "share_wx/:url",
        component: load("goods/shareWx"),
      },
      /*    {
           path: "dunhuang",
           component: () => import("@/pages/v1/dunhuang/index"),
           meta: {
             requireAuth: true,
           },
         }, */
      {
        path: "profiteer",
        component: load("profiteer"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "tom",
        component: load("active/tom"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "three-feet-boy",
        component: load("active/three-feet-boy"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "inside_synthesis/:key",
        component: load("active/inside-synthesis"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "app_download",
        component: load("app-download"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "app_download/3d",
        component: load("app-download/3d"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "synthetic_system/:activeKey",
        component: load("active/synthetic-system"),
        meta: {
          requireAuth: true,
          hideMoblieFooter: true,
          hideService: true,
        },
      },
      {
        path: "synthetic_system_v2/:activeKey",
        component: load("active/synthetic-system-v2"),
        meta: {
          requireAuth: true,
          hideMoblieFooter: true,
          hideService: true,
        },
      },

      {
        path: "test",
        component: load("test"),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: "*",
        redirect: "/404",
      },

      // {
      //   path: "*",
      //   redirect: "/update",
      // },
    ],
  },
];

const router = new VueRouter({
  mode: "history", // add 'history' mode
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0,
    };
  },
});
/**
 * app自动登录
 */
async function autoLoginByToken(info) {
  const token = info.query.token;
  if (token) {
    localStorage.setItem("authorization", token);
    await store.dispatch("getUserInfo");
  }
}
router.beforeEach(async (to, from, next) => {
  if (to.meta.configType && to.meta.configType == "treasure-config") {
    await store.dispatch("getTransferConfig");
    if (to.meta.type && to.meta.type == "transfer") {
      if (!store.state.transferOnOff) {
        next("/404");
      }
    }
  }

  if (process.env.VUE_APP_NAME && process.env.VUE_APP_NAME == "theone") {
    store.commit("setLlConfig", {
      appName: "https://theone.art",
      pkgName: "https://theone.art",
    });
  }
  try {
    store.dispatch("getConfig");

    store.dispatch("getGreyConfig", to.meta);
    await autoLoginByToken(to);
    //获取升级信息
    const updateInfo = store.state.updateInfo;

    if (updateInfo && JSON.stringify(updateInfo) != "{}") {
    } else {
      await store.dispatch("getUpdateInfo");
    }

    if (store.state.updateInfo && store.state.updateInfo.update == 1) {
      if (to.path.indexOf("/update") == -1) {
        next("/update");
      }
    } else {
      if (to.path.indexOf("/update") !== -1) {
        next("/");
      }
    }
  } catch (e) { }
  //接口行为验证校验
  const verifiedList = $localStorage.getItem("VERIFY-LIST-V2");
  if (verifiedList) {
    store.commit("setBehaviorVerifyList", verifiedList);
  } else {
    store.dispatch("getBehaviorVerify");
  }

  const fromName = from.meta.style || "";
  const toName = to.meta.style || "";
  if (fromName) {
    document.documentElement.classList.remove(`html-${fromName}`); //remove className
  }
  if (toName) {
    document.documentElement.classList.add(`html-${toName}`); //add className
  }

  if (new Browser().browser.wechat) {
  }

  store.commit("restApis");
  //首先判断哪些页面需要用户信息
  if (to.meta.requireAuth) {
    const redirect = `${window.location.origin}${window.location.pathname}/${window.location.search}`;

    if (JSON.stringify(store.state.user_info) == "{}") {
      let user = localStorage.getItem("THEONE_USER");
      if (user) {
        user = JSON.parse(user);
        store.commit("setUserInfo", user);
      } else {
        await store.dispatch("getUserInfo");
        if (to.path == "/Authorize") {
          next({
            path: `/login?redirect=${encodeURIComponent(redirect)}`,
            replace: true,
          });
        }
      }
    }
  }
  if (to.path.indexOf("/market") !== -1) {
    if (JSON.stringify(to.query) == "{}") {
      next(`/market?type=copyright`);
    }
  }
  //连连钱包信息
  if (to.meta.llAccountAuth) {
    if (JSON.stringify(store.state.llWalletAccountInfo) == "{}") {
      await store.dispatch("getLlAccountStatus");
    } else {
    }
  }
  //检查地址栏device

  if (to.query.device == "uniapp") {
    localStorage.setItem("is_uniapp", 1);
  }
  const userUuid = store.state?.user_info?.userUuid
  const inviteCode = to.query.inviteCode
  const inviteCodeCache = sessionStorage.getItem("inviteCode");
  // url有inviteCode
  if (inviteCode && inviteCode !== inviteCodeCache) {
    sessionStorage.setItem("inviteCode", inviteCode);
    // 已经录，绑定邀请码
    if (userUuid) {
      console.log('invite_bind');
      await api.$service.invite_bind({
        inviteCode: inviteCode
      })
    }
  }

  next();
});

export default router;
