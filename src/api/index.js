import { request, METHOD } from "@/utils/request";
import requestV2 from "@/utils/request-v2";
import { MessageBox } from "element-ui";

import ybPay from "./yb-pay";
import accountManage from "./account-manage";
import collect from "./collect";
import bh from "./bh";
import xCode from "./x-code";
import goods from "./goods";
import compose from "./compose";
import goodsInfo from "./goods-info";
import linkageCompose from "./linkage-compose";
import activeDate from "./active-date";
import omGoods from "./om-goods";
import llBag from "./ll-bag";
import GoldBoxActive from "./gold-box-active";
import exhibition from "./exhibition";
import Tutntable from "./tutntable";
import ChildrenArt from "./children-art";
import prepay from "./prepay";
import text from "./text";
import invite from "./invite";
import user from "./user";
import transfer from "./transfer";

const BASE_URL = process.env.VUE_APP_API_BASE_URL;
console.log(process.env);

import store from "../store";
let service = {};
let $service = {};
let api = [
  //////////////////// config ///////////////////////
  {
    name: "test_behaviorVerify",
    url: "/goods/api/test/behaviorVerify",
    method: METHOD.POST,
  },
  {
    name: "config_get",
    url: "/base/api/config/getConfig",
    method: METHOD.POST,
  },
  {
    name: "copy_writing",
    url: "/base/api/copyWriting/query",
    method: METHOD.GET,
  },
  {
    name: "bankQuota_list",
    url: "/base/api/bankQuota/list",
    method: METHOD.GET,
  },
  {
    name: "lottery_tip",
    url: "/base/api/copyWriting/getByKey/LotteryActivityTip",
    method: METHOD.GET,
  },
  {
    name: "getByKey_walletLlHelp",
    url: "/base/api/copyWriting/getByKey/walletLlHelp",
    method: METHOD.GET,
  },
  {
    name: "weixin_shareConfig", //微信分享配置
    url: "/base/api/weixin/shareConfig",
    method: METHOD.POST,
  },
  //////////////////// config end ///////////////////////
  //////////////////// banner ///////////////////////
  {
    name: "banner_list",
    url: "/market/api/banner/list",
    method: METHOD.POST,
    isNotTip: true,
  },
  //////////////////// banner end ///////////////////////////////////
  //////////////////// 主题 ///////////////////////
  {
    name: "topic_list",
    url: "/market/api/saleRecord/listTopic",
    method: METHOD.GET,
    isNotTip: true,
  },
  //////////////////// 主题 end ///////////////////////////////////
  //////////////////// 内容管理 ///////////////////////
  {
    name: "news_list",
    url: "/market/api/dynamicNews/findNewsList",
    method: METHOD.POST,
    isNotTip: true,
  },
  {
    name: "commodityCategory_detail",
    url: "/market/api/commodityCategory/detail",
    method: METHOD.POST,
    isNotTip: true,
  },
  {
    name: "treeList",
    url: "/market/api/category/treeList",
    method: METHOD.POST,
    isNotTip: true,
  },
  {
    name: "treeNews",
    url: "/market/api/dynamicNews/guideList",
    method: METHOD.POST,
    isNotTip: true,
  },

  //////////////////// 内容管理 end ///////////////////////////////////

  //////////////////// 登录相关 ///////////////////////

  {
    name: "getVerificationCode", //获取图片验证码
    url: "/auth/api/auth/getVerificationCode",
    method: METHOD.POST,
  },
  {
    name: "login_authCodeLogin", //验证码登录
    url: "/auth/api/auth/authCodeLoginV3",
    method: METHOD.POST,
  },
  {
    name: "login_getAuthCode", //获取验证码（无身份认证）
    url: "/auth/api/auth/getAuthCode",
    method: METHOD.POST,
  },
  {
    name: "login_verifyUser", //区块链验证用户身份是否是中心化用户
    url: "/user/api/loginVerify/verifyUser",
    method: METHOD.POST,
  },
  {
    name: "login_verifySignLogin", //区块链  验签登录
    url: "/auth/api/auth/verifySignLogin",
    method: METHOD.POST,
  },
  {
    name: "login_authPcLogin", //登录
    url: "/auth/api/auth/pcLogin",
    method: METHOD.POST,
  },
  {
    name: "operation_changePwByAuthCode", //验证码更改密码
    url: "/user/api/operation/changePwByAuthCode",
    method: METHOD.PUT,
  },
  {
    name: "operation_authCode", //获取当前用户验证码（有身份认证）
    url: "/user/api/operation/authCode",
    method: METHOD.POST,
  },

  {
    name: "operation_initialPw", //设置初始登录密码
    url: "/user/api/operation/initialPw",
    method: METHOD.PUT,
  },
  {
    name: "operation_changePwByOldPw", //更改登录密码
    url: "/user/api/operation/changePwByOldPw",
    method: METHOD.PUT,
  },
  {
    name: "auth_logout", //退出登录
    url: "/auth/api/auth/logoutV2",
    method: METHOD.GET,
  },
  {
    name: "auth_bankVerified", //银行卡验证
    url: "/auth/api/risk/bankVerified",
    method: METHOD.POST,
  },
  {
    name: "auth_idCardVerified", //身份证
    url: "/auth/api/risk/idCardVerified",
    method: METHOD.POST,
  },
  {
    name: "auth_logout", //退出登录
    url: "/auth/api/auth/logoutV2",
    method: METHOD.GET,
  },
  {
    name: "userAttribute_updateEamil", //设置更新邮箱
    url: "/user/api/userAttribute/updateEamil",
    method: METHOD.POST,
  },
  {
    name: "oauth_grantcode", //获取三方临时code
    url: "/oauth/api/oauth2/grantcode",
    method: METHOD.POST,
  },
  {
    name: "oauth_authinfo", //获取三方授权信息
    url: "/oauth/api/app/authinfo",
    method: METHOD.POST,
  },
  {
    name: "authedapp", //查询用户已授权应用列表
    url: "/oauth/api/app/authedapp",
    method: METHOD.POST,
  },
  {
    name: "deauthorize", //用户解除授权应用
    url: "/oauth/api/oauth2/deauthorize",
    method: METHOD.POST,
  },
  //////////////////// 登录相关 end ///////////////////////////////////
  //////////////////// 商品相关 ///////////////////////

  {
    name: "commodityCategory_list", //市场分级列表
    url: "/market/api/commodityCategory/list",
    method: METHOD.POST,
  },
  {
    name: "commodityCategory_list_v2", //市场分级列表
    url: "/market/api/commodityCategory/list/v2",
    method: METHOD.POST,
  },
  {
    name: "goods_key", //商品详情
    url: "/market/api/key/get",
    method: METHOD.GET,
  },
  {
    name: "saleRecord_detail", //商品详情
    url: "/market/api/saleRecord/detail",
    method: METHOD.POST,
  },
  {
    name: "saleRecord_list", //出售记录 市场列表页
    url: "/market/api/saleRecord/list",
    method: METHOD.POST,
  },
  {
    name: "commodityHotspot_list", //出售记录 市场列表页
    url: "/market/api/commodityHotspot/list",
    method: METHOD.POST,
  },
  {
    name: "orderBuy_add", //商品下单
    url: "/order/api/orderBuy/add",
    method: METHOD.POST,
  },
  {
    name: "scoreByOrder", //获得积分
    url: "/om-goods/api/score/scoreByOrder",
    method: METHOD.POST,
  },
  {
    name: "orderBuy_pay", //商品支付
    url: "/pay/api/pay",
    method: METHOD.POST,
  },
  {
    name: "v2_pay", //商品支付v2
    url: "/pay/api/v2/pay",
    method: METHOD.POST,
  },
  {
    name: "v3_pay", //商品支付v3 可灵活切换第三方中间商与原厂家支付
    url: "/pay/api/v3/pay",
    method: METHOD.POST,
  },
  {
    name: "v2_getResult", //获取支付结果
    url: "/pay/api/v2/getResult",
    method: METHOD.POST,
  },
  {
    name: "pay_expirePayOrder", //设置支付订单为失效状态
    url: "/pay/api/expirePayOrder",
    method: METHOD.POST,
  },
  {
    name: "v2_pay_expirePayOrder", //设置支付订单为失效状态v2
    url: "/pay/api/v2/expirePayOrder",
    method: METHOD.POST,
  },
  {
    name: "v3_pay_expirePayOrder", //设置支付订单为失效状态v3
    url: "/pay/api/v3/expirePayOrder",
    method: METHOD.POST,
  },
  {
    name: "saleRecord_getAmountAvailable", //出售记录获取可用数量
    url: "/market/api/saleRecord/getAmountAvailable",
    method: METHOD.POST,
  },
  {
    name: "saleRecord_search", //商品搜索
    url: "/goods/api/saleRecord/search",
    method: METHOD.POST,
  },
  {
    name: "commodityDownload_sendEmailCode", //邮箱验证码
    url: "/goods/api/commodityDownload/sendEmailCode",
    method: METHOD.POST,
  },
  {
    name: "commodityDownload_commodityDownload", //商品的下载
    url: "/goods/api/commodityDownload/commodityDownload",
    method: METHOD.POST,
  },
  {
    name: "saleRecord_cancelBatch", //批量取消出售记录
    url: "/goods/api/saleRecord/cancelBatch",
    method: METHOD.POST,
  },
  {
    name: "withdrawalOrder_getChargeRate", //获取提现费率
    url: "/order/api/withdrawalOrder/getChargeRate",
    method: METHOD.POST,
  },
  {
    name: "commodityDownload_commodityDownloadVideo", //api商品下载(文件流)
    url: "/goods/api/commodityDownload/commodityDownloadVideo",
    method: METHOD.GET,
  },
  {
    name: "commodity_search", //商品搜索
    url: "/market/api/commodity/search",
    method: METHOD.POST,
  },
  //////////////////// 商品相关 end ///////////////////////////////////
  //////////////////// 常见问题 ///////////////////////
  {
    name: "question_list", //常见问题
    url: "/base/api/queation/findListByQueation",
    method: METHOD.POST,
  },
  //////////////////// 常见问题 end ///////////////////////////////////
  //////////////////// 关于我们 ///////////////////////
  {
    name: "dynamicNews_list", //关于唯一艺术
    url: "/market/api/dynamicNews/list",
    method: METHOD.GET,
  },
  //////////////////// 关于我们 end ///////////////////////////////////
  //////////////////// 个人中心 ///////////////////////
  {
    name: "userattribute_queryByUserUuid", //查询当前用户属性
    url: "/user/api/userAttribute/userInfo",
    method: METHOD.POST,
  },
  {
    name: "userattribute_change", //保存用户属性
    url: "/user/api/userAttribute/change",
    method: METHOD.POST,
  },
  {
    name: "userattribute_verifiedIdcard", // 实名认证
    url: "/user/api/userAttribute/verifiedIdcard",
    method: METHOD.POST,
  },
  {
    name: "upload_uploadFile", //上传文件
    url: "/base/api/upload/uploadFile",
    method: METHOD.POST,
  },
  {
    name: "upload_uploadCert", //上传文件私有
    url: "/base/api/upload/uploadCert",
    method: METHOD.POST,
  },
  {
    name: "virtualCouponList", //虚拟卡券列表
    url: "/om-goods/api/virtualCoupon/page",
    method: METHOD.POST,
  },
  {
    name: "virtualCopy", //虚拟卡券复制
    url: "/om-goods/api/virtualCoupon/copy",
    method: METHOD.POST,
  },

  ///////地址管理///////
  {
    name: "address_create", //地址管理 - 新建地址
    url: "/user/api/userAddress/create",
    method: METHOD.POST,
  },
  {
    name: "address_update", //地址管理 - 修改地址
    url: "/user/api/userAddress/update",
    method: METHOD.POST,
  },
  {
    name: "address_delete", //地址管理 - 删除地址
    url: "/user/api/userAddress/delete",
    method: METHOD.POST,
  },
  {
    name: "address_list", //地址管理 - 地址列表
    url: "/user/api/userAddress/list",
    method: METHOD.POST,
  },

  ///////社群服务入口///////
  {
    name: "detail_communityPic", //地址管理 - 新建地址
    url: "/user/api/customer/detailCommunityPic",
    method: METHOD.POST,
  },

  //////////////////// 交易 ///////////////////////
  {
    name: "orderBuy_list", // 我买到的
    url: "/order/api/orderBuy/list", //类型 0待支付 1待发货 2已发货 3已完成 4已取消
    method: METHOD.POST,
  },
  {
    name: "orderBuy_cancel", // 我买到的 - 取消订单
    url: "/order/api/orderBuy/cancel",
    method: METHOD.POST,
  },
  {
    name: "saleRecord_my_list", // 我发布的
    url: "/goods/api/saleRecord/mine/list", //出售状态 0待处理 1出售中(审核通过) 2已售罄 3已取消(下架) 4拒绝出售(审核不通过) 5锁定(不可继续购买)
    method: METHOD.POST,
  },
  {
    name: "saleRecord_myCancel", // 我发布的 - 取消
    url: "/goods/api/saleRecord/my/myCancel",
    method: METHOD.POST,
  }, //
  {
    name: "saleRecord_cancel", // 我发布的 - 取消
    url: "/goods/api/saleRecord/cancel",
    method: METHOD.POST,
  },
  {
    name: "orderBuy_listSale", // 我卖出的
    url: "/order/api/orderBuy/listSale",
    method: METHOD.POST,
  },
  {
    name: "orderBuy_detail", // 订单详情
    url: "/order/api/orderBuy/detail",
    method: METHOD.POST,
  },
  {
    name: "orderBuy_listPublic", // 订单购买公开列表
    url: "/order/api/orderBuy/listPublic",
    method: METHOD.POST,
  },
  {
    name: "orderBuy_listSale", // api订单购买卖出列表
    url: "/order/api/orderBuy/listSale",
    method: METHOD.POST,
  },
  //////////////////// 个人中心-我的粉丝、我的关注 ///////////////////////
  {
    name: "userfriend_list", //关注列表
    url: "/user/api/userFriend/list",
    method: METHOD.POST,
  },
  {
    name: "userfriend_operation", //关注和取消关注
    url: "/user/api/userFriend/operation",
    method: METHOD.POST,
  },
  //////////////////// 个人中心-我的藏品 ///////////////////////
  {
    name: "treasure_list", //我的藏品
    url: "/goods/api/treasure/list",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_list", //我的藏品sku
    url: "/goods/api/treasureSku/list",
    method: METHOD.POST,
  },
  {
    name: "treasure_addSaleRecord", //我的藏品出售
    url: "/goods/api/saleRecord/add",
    method: METHOD.POST,
  },
  {
    name: "userLike_list", //我喜欢的
    url: "/goods/api/userLike/list",
    method: METHOD.POST,
  },
  {
    name: "userLike_operation", //喜欢与取消喜欢 1喜欢 2取消
    url: "/goods/api/userLike/operation",
    method: METHOD.POST,
  },
  {
    name: "userLike_like", //是否喜欢
    url: "/market/api/userLike/like",
    method: METHOD.POST,
  },
  {
    name: "treasure_operation", //好友可见
    url: "/goods/api/treasure/operation",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_operation", //好友可见
    url: "/goods/api/treasureSku/operation ",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_listBox", //财产sku盒子列表
    url: "/goods/api/treasureSku/listBox",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_openBox", //api财产sku盒子开启
    url: "/goods/api/treasureSku/openBox",
    method: METHOD.POST,
  },
  {
    name: "play_treasureSku_openBox", //api财产sku盒子开启new
    url:
      process.env.VUE_APP_SERVICE && process.env.VUE_APP_SERVICE == "theone"
        ? "/play/api/treasureSku/openBox"
        : "/goods/api/treasureSku/openBox",
    method: METHOD.POST,
  },
  //////////////////// 个人中心-钱包 //////////////////////

  /*   {
      name: "walletLog_list", // 提现列表
      url: "/market/api/walletLog/list",
      method: METHOD.POST
    }, */
  {
    name: "withdrawalOrder_list", // 提现列表
    url: "/order/api/withdrawalOrder/list",
    method: METHOD.POST,
  },
  {
    name: "userWallet_list", // 钱包账单
    url: "/market/api/walletLog/list",
    method: METHOD.POST,
  },
  {
    name: "userWallet_get", //  我的零钱金额
    url: "/market/api/userWallet/getUserWallet",
    method: METHOD.POST,
  },
  {
    name: "orderRecharge_addRecharge", //  我的零钱充值
    url: "/order/api/orderRecharge/addRecharge",
    method: METHOD.POST,
  },
  {
    name: "pay_rechargePay", //  我的零钱充值
    url: "/pay/api/rechargePay",
    method: METHOD.POST,
  },
  {
    name: "v2_pay_rechargePay", //  我的零钱充值v2
    url: "/pay/api/v2/rechargePay",
    method: METHOD.POST,
  },
  {
    name: "userWallet_getChargeRate", //  获取提现费率
    url: "/user/api/userWallet/getChargeRate",
    method: METHOD.POST,
  },
  {
    name: "userWallet_withdrawal", //  提现操作
    url: "/order/api/withdrawalOrder/withdrawalAmount",
    method: METHOD.POST,
  },
  {
    name: "userWallet_withdrawalNum", //剩余提现次数
    url: "/order/api/withdrawalOrder/withdrawalNum",
    method: METHOD.GET,
  },
  {
    name: "userAttribute_changeAliAccount", //设置支付宝账号
    url: "/user/api/operation/changeAliAccount",
    method: METHOD.PUT,
  },
  {
    name: "userAttribute_initialPayPw", //设置初始支付密码
    url: "/user/api/operation/initialPayPw",
    method: METHOD.POST,
  },
  {
    name: "userAttribute_changePayPw", //更改支付密码
    url: "/user/api/operation/changePayPw",
    method: METHOD.POST,
  },
  {
    name: "blockchainAddress_getBlockchain", //区块链钱包
    url: "/user/api/blockchainAddress/getBlockchain",
    method: METHOD.POST,
  },
  {
    name: "operation_verifiedPayPw", //验证
    url: "/user/api/operation/verifiedPayPw",
    method: METHOD.POST,
  },
  {
    name: "userAttribute_getPwdPayCount", //当前用户支付密码剩余输入次数
    url: "/market/api/userAttribute/getPwdPayCount",
    method: METHOD.POST,
  },
  {
    name: "userWallet_returnsDetailed", //用户收益明细
    url: "/user/api/userWallet/returnsDetailed",
    method: METHOD.POST,
  },
  //////////////////// 个人中心-银行卡 ///////////////////////
  {
    name: "bankInfo_listShortName", // 银行列表
    url: "/base/api/bankInfo/listShortName",
    method: METHOD.POST,
  },
  {
    name: "bankInfo_list", // 银行支行列表
    url: "/base/api/bankInfo/list",
    method: METHOD.POST,
  },
  {
    name: "userBank_updateBnakInfo", // 更新银行卡名称信息
    url: "/user/api/userBank/updateBnakInfo",
    method: METHOD.POST,
  },

  {
    name: "userbank_findBankAccount", // 银行卡列表
    url: "/user/api/userBank/findBankAccount",
    method: METHOD.POST,
  },
  {
    name: "userbank_unverified_add", // 未认证通过 新增银行卡
    url: "/user/api/userBankVerified/verified",
    method: METHOD.POST,
  },
  {
    name: "userbank_verified_add", // 认证通过 新增银行卡
    url: "/user/api/userBankVerified/verified2",
    method: METHOD.POST,
  },
  {
    name: "operation_getAuthCode", //获取验证码
    url: "/user/api/operation/getAuthCode",
    method: METHOD.POST,
  },
  {
    name: "userbank_defalutBank", //设置默认银行卡
    url: "/user/api/userBank/defalutBank",
    method: METHOD.POST,
  },
  {
    name: "userBank_unbound", //解绑银行卡
    url: "/user/api/userBank/unbound",
    method: METHOD.POST,
  },
  //////////////////// 个人中心 end ///////////////////////////////////
  //////////////////// 艺术家 ///////////////////////////////////
  {
    name: "author_search", //艺术家页面搜索
    url: "/market/api/author/search",
    method: METHOD.POST,
    isNotTip: true,
  },
  {
    name: "author_list", //艺术家页面列表
    url: "/market/api/author/list",
    method: METHOD.POST,
    isNotTip: true,
  },
  //////////////////// 艺术家end ///////////////////////////////////
  //////////////////// 个人主页 ///////////////////////////////////
  {
    name: "userAttribute_query", //个人信息
    url: "/market/api/userAttribute/query",
    method: METHOD.POST,
  },
  {
    name: "userFriend_result", //用户是否已关注是否是好友
    url: "/user/api/userFriend/result",
    method: METHOD.POST,
  },
  {
    name: "userBanner_listByUserUuid", //获取个人主页作者背景图
    url: "/user/api/userBanner/listByUserUuid",
    method: METHOD.POST,
  },
  {
    name: "userBanner_list", //查询当前用户背景图
    url: "/user/api/userBanner/list",
    method: METHOD.POST,
  },
  {
    name: "userBanner_save", //新增用户背景
    url: "/user/api/userBanner/save",
    method: METHOD.POST,
  },
  {
    name: "userBanner_delete", //删除用户背景
    url: "/user/api/userBanner/delete",
    method: METHOD.POST,
  },
  {
    name: "commodity_getAmountLike", //喜欢的商品数量
    url: "/goods/api/commodity/getAmountLike",
    method: METHOD.POST,
  },
  {
    name: "commodity_list", //画廊商品列表
    url: "/goods/api/commodity/list",
    method: METHOD.POST,
  },
  {
    name: "seriesWorks_list", //画廊系列作品列表
    url: "/goods/api/seriesWorks/list",
    method: METHOD.POST,
  },
  {
    name: "public_list", //藏品馆列表
    url: "/goods/api/treasure/public/list",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_public_list", //藏品馆sku公开列表
    url: "/goods/api/treasureSku/public/list",
    method: METHOD.POST,
  },
  {
    name: "treasureCategory_list", //藏品查询
    url: "/assets/api/treasureCategory/list",
    method: METHOD.POST,
  },
  {
    name: "userHistory_list", //用户历史列表
    url: "/goods/api/userHistory/list",
    method: METHOD.POST,
  },
  //////////////////// 个人主页end ///////////////////////////////////
  //////////////////// 新闻动态 ///////////////////////////////////
  {
    name: "category_findList", //动态分类
    url: "/market/api/category/findList",
    method: METHOD.POST,
  },
  {
    name: "category_detail", //api分类详情
    url: "/market/api/category/detail",
    method: METHOD.POST,
  },
  {
    name: "dynamicNews_findNewsList", //列表页
    url: "/market/api/dynamicNews/findNewsList",
    method: METHOD.POST,
  },
  {
    name: "dynamicNews_toplist", //置顶列表
    url: "/market/api/dynamicNews/topList",
    method: METHOD.POST,
  },
  {
    name: "honor_detail", //证书大图
    url: "/market/api/honor/detail",
    method: METHOD.POST,
  },
  {
    name: "dynamicNews_findNews", //详情页
    url: "/base/api/dynamicNews/findNews",
    method: METHOD.POST,
  },
  //////////////////// 新闻动态end ///////////////////////////////////
  //////////////////// 喜欢start ///////////////////////////////////
  {
    name: "userLike_operation", //
    url: "/goods/api/userLike/operation", //1商品 2出售记录 3商品SKU
    method: METHOD.POST,
  },
  //////////////////// 收藏end ///////////////////////////////////
  {
    name: "orderBuy_statisticsPrice", //
    url: "/order/api/orderBuy/statisticsPrice", //排行榜接口
    method: METHOD.GET,
  },
  //////////////////// 敦煌合成活动 ///////////////////////////////////
  {
    name: "synthesis_list", //玩法列表
    url: "/goods/api/synthesis/list",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_synthesis", //合成操作
    url: "/goods/api/treasureSku/synthesis",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_listMaterial", //根据玩法key获取用户藏品信息
    url: "/goods/api/treasureSku/listMaterial",
    method: METHOD.POST,
  },
  {
    name: "activityTemplate_detail", //api活动模板详情
    url: "/goods/api/activityTemplate/detail",
    method: METHOD.POST,
  },
  //////////////////// 敦煌合成活动end ///////////////////////////////////
  //////////////////// app start ///////////////////////////////////
  {
    name: "config_getConfigByType", //api活动模板详情
    url: "/base/api/config/getConfigByType",
    method: METHOD.POST,
  },
  //////////////////// app end ///////////////////////////////////
  //////////////////// 用户邀请接口 start ///////////////////////////////////
  {
    name: "userInvite_inviteList", //当前用户邀请列表
    url: "/user/api/userInvite/inviteList",
    method: METHOD.POST,
  },
  //////////////////// 用户邀请接口 end ///////////////////////////////////

  //////////////////// 大额支付接口 start ///////////////////////////////////
  {
    name: "baofooInfo_baofooInfo", //宝户账号信息
    url: "/user/api/baofooInfo/baofooInfo",
    method: METHOD.POST,
  },
  {
    name: "baofooInfo_baofooPhoneCode", //通过银行4要素获取验证码
    url: "/user/api/baofooInfo/baofooPhoneCode",
    method: METHOD.POST,
  },
  {
    name: "baofooInfo_changeCard", //通过银行4要素获取验证码&换卡
    url: "/user/api/baofooInfo/changeCard",
    method: METHOD.POST,
  },
  {
    name: "baofooInfo_confirm", //确认绑定银行卡
    url: "/user/api/baofooInfo/confirm",
    method: METHOD.POST,
  },
  {
    name: "baofooInfo_idcardImage", //设置身份证正反面
    url: "/user/api/baofooInfo/idcardImage",
    method: METHOD.POST,
  },
  {
    name: "pay_confirmBaofooPay", //确认大额支付是否支付
    url: "/pay/api/v3/confirmBaofooPay",
    method: METHOD.POST,
  },
  {
    name: "v3_pay_confirm", //是否支付成功
    url: "/pay/api/v3/pay/confirm",
    method: METHOD.POST,
  },
  {
    name: "baofooPayBank_findPageList", //宝户支付支持的银行列表
    url: "/pay/api/baofooPayBank/findPageList",
    method: METHOD.POST,
  },
  {
    name: "baofooInfo_setBaofooPassword", //设置宝付支付密码
    url: "/user/api/baofooInfo/setBaofooPassword",
    method: METHOD.POST,
  },
  {
    name: "withdrawalOrderBaofoo_baofooWithdraw", //宝户用户提现申请
    url: "/order/api/withdrawalOrderBaofoo/baofooWithdraw",
    method: METHOD.POST,
  },
  {
    name: "withdrawalOrderBaofoo_list", //提现申请列表
    url: "/order/api/withdrawalOrderBaofoo/list",
    method: METHOD.POST,
  },
  {
    name: "baofooWithdraw_withdraw", //宝户 用户取款
    url: "/pay/api/baofooWithdraw/withdraw",
    method: METHOD.POST,
  },
  {
    name: "baofooWithdraw_withdrawConfirm", //宝户取款确认
    url: "/pay/api/baofooWithdraw/withdrawConfirm",
    method: METHOD.POST,
  },
  {
    name: "v3_pay_sendSms", //支付短信发送
    url: "/pay/api/v3/pay/sendSms",
    method: METHOD.POST,
  }, //

  //////////////////// 大额支付接口 end ///////////////////////////////////
  //////////////////// 赠与接口 start ///////////////////////////////////
  {
    name: "treasureGive_list", //api财产赠与列表,我的赠与
    url: "/goods/api/treasureGive/list",
    method: METHOD.POST,
  },
  {
    name: "treasureGiveSku_list", //api财产赠与列表,我的赠与
    url: "/goods/api/treasureGiveSku/list",
    method: METHOD.POST,
  },
  {
    name: "treasureGive_add", //api财产赠与添加
    url: "/goods/api/treasureGive/add",

    method: METHOD.POST,
  },
  {
    name: "treasureGive_listGift", //api财产赠与礼物列表，我的礼物
    url: "/goods/api/treasureGive/listGift",
    method: METHOD.POST,
  },
  {
    name: "treasureGive_operation", //api财产赠与操作，接收/拒绝
    url: "/goods/api/treasureGive/operation",
    method: METHOD.POST,
  },
  {
    name: "giveConfig_detail", //api赠与配置信息
    url: "/goods/api/giveConfig/detail",
    method: METHOD.POST,
  },
  //////////////////// 赠与接口 end ///////////////////////////////////
  //////////////////// api限制 start ///////////////////////////////////
  {
    name: "limit_getCode", //api限制获取验证码
    url: "/auth/api/limit/getCode",
    method: METHOD.POST,
  },
  {
    name: "limit_valid", //api限制验证
    url: "/auth/api/limit/valid",
    method: METHOD.POST,
  },
  //////////////////// api限制 end ///////////////////////////////////

  //////////////////// 出售最低价 start ///////////////////////////////////
  {
    name: "saleRecord_checkSalePrice", //api出售记录校验出售最低价
    url: "/goods/api/saleRecord/checkSalePrice",
    method: METHOD.POST,
  },
  {
    name: "saleRecord_sendCode", //api出售记录校验出售最低价发送验证码
    url: "/goods/api/saleRecord/sendCode",
    method: METHOD.POST,
  },
  //////////////////// 出售最低价 end ///////////////////////////////////
  //////////////////// 活动接口 start ///////////////////////////////////
  {
    name: "activity_signUp", //
    url: "/activity/api/activity/signUp",
    method: METHOD.POST,
  },
  {
    name: "activity_getResult", //
    url: "/activity/api/activity/getResult",
    method: METHOD.POST,
  },
  {
    name: "activity_getActivityDetail",
    url: "/activity/api/activity/getActivityDetail",
    method: METHOD.POST,
  },
  {
    name: "activity_valid",
    url: "/activity/api/activity/valid",
    method: METHOD.POST,
  },
  {
    name: "activity_getResultV2",
    url: "/activity/api/activity/getResultV2",
    method: METHOD.POST,
  },
  //////////////////// 活动接口 start ///////////////////////////////////

  //////////////////// 积分排行榜接口 start ///////////////////////////////////
  {
    name: "rankingCurrentGlobalRanking",
    url: "/om-goods/ranking/currentGlobalRanking",
    method: METHOD.POST,
  },
  //////////////////// 积分排行榜接口 start ///////////////////////////////////

  //////////////////// 报名接口 start ///////////////////////////////////
  {
    name: "userCheckIn_today",
    url: "/user/api/userCheckIn/today",
    method: METHOD.GET,
  },
  {
    name: "userCheckIn_save",
    url: "/user/api/userCheckIn/save",
    method: METHOD.POST,
  },
  {
    name: "userCheckIn_month",
    url: "/user/api/userCheckIn/month",
    method: METHOD.GET,
  },
  {
    name: "userCheckIn_month_v2",
    url: "/user/api/userCheckIn/monthV2",
    method: METHOD.GET,
  },
  {
    name: "userCheckIn_check",
    url: "/user/api/userCheckIn/check",
    method: METHOD.GET,
  },
  {
    name: "userCheckIn_current",
    url: "/user/api/userCheckIn/current",
    method: METHOD.GET,
  },
  {
    name: "userCheckIn_getAdditionInfo",
    url: "/user/api/userCheckIn/getAdditionInfo",
    method: METHOD.GET,
  },
  {
    name: "userCheckIn_additionCheckIn",
    url: "/user/api/userCheckIn/additionCheckIn",
    method: METHOD.POST,
  },
  //////////////////// 报名接口 start ///////////////////////////////////
  //////////////////// 兑换接口 start ///////////////////////////////////
  {
    name: "exchangeActivity_exchange",
    url: "/user/api/exchangeActivity/exchange",
    method: METHOD.POST,
  },
  {
    name: "exchangeActivity_check",
    url: "/user/api/exchangeActivity/check",
    method: METHOD.POST,
  },
  //////////////////// 兑换接口 start ///////////////////////////////////
  {
    name: "v3_pay_getPayChannel", //获取支付方式
    url: "/pay/api/v3/pay/getPayChannel",
    method: METHOD.GET,
  },
  //////////////////// 汇元支付 start ///////////////////////////////////
  {
    name: "payChannel_openAccount", //开户
    url: "/user/api/payChannel/openAccount",
    method: METHOD.POST,
  },
  {
    name: "v2_openAccount", //易宝开户
    url: "/user/api/payChannel/v2/openAccount",
    method: METHOD.POST,
  },
  {
    name: "payChannel_bindCardApply", //绑卡申请
    url: "/user/api/payChannel/bindCardApply",
    method: METHOD.POST,
  },
  {
    name: "payChannel_bindCardConfirm", //绑卡确认
    url: "/user/api/payChannel/bindCardConfirm",
    method: METHOD.POST,
  },
  {
    name: "payChannel_accountInfo", //
    url: "/user/api/payChannel/accountInfo",
    method: METHOD.POST,
  },
  {
    name: "notecaseLog_list", //api 支付通道余额LOG
    url: "/market/api/notecaseLog/list",
    method: METHOD.POST,
  },
  {
    name: "notecase_query", //api 用户钱包
    url: "/market/api/notecase/query",
    method: METHOD.POST,
  },
  {
    name: "payChannel_changeCard", //api 换卡
    url: "/user/api/payChannel/changeCard",
    method: METHOD.POST,
  },
  {
    name: "userBank_checkAuthInfo", //检查银行卡是否进行汇元授权
    url: "/user/api/userBank/checkAuthInfo",
    method: METHOD.POST,
  },
  {
    name: "userAttribute_getPhone", //查询用户手机号
    url: "/user/api/userAttribute/getPhone",
    method: METHOD.POST,
  },
  {
    name: "thirdAccount_saleChannel", //寄售支持的结算方式
    url: "/user/api/thirdAccount/saleChannel",
    method: METHOD.POST,
  },

  {
    name: "recommend_list", //首页推荐商品列表
    url: "/om-goods/api/recommend/list",
    method: METHOD.POST,
  },
  {
    name: "appVersion_judgeAppVersion", //寄售支持的结算方式
    url: "/base/api/appVersion/judgeAppVersion",
    method: METHOD.POST,
  }, //

  ///user/api/payChannel/queryMicroStatusYb
  //////////////////// 汇元支付 end ///////////////////////////////////
  ...ybPay,
  ...accountManage,
  ...collect,
  ...bh,
  ...xCode,
  ...goods,
  ...compose,
  ...goodsInfo,
  ...linkageCompose,
  ...activeDate,
  ...omGoods,
  ...llBag,
  ...GoldBoxActive,
  ...Tutntable,
  ...exhibition,
  ...ChildrenArt,
  ...prepay,
  ...text,
  ...invite,
  ...user,
  ...transfer
];

let messageBox = null; //保持单例
api.forEach((a) => {
  service[a.name] = function (data, fnError, sig, config) {
    if (data && sig) {
      data["sig"] = sig;
    }
    return request(`${BASE_URL}${a.url}`, a.method, data, config).catch((e) => {
      store.commit("setApi", {
        api: `${BASE_URL}${a.url}`,
        status: "error",
      });
      if (fnError && typeof fnError == "function") {
        fnError(e);
      } else {
        if (!messageBox && !a.isNotTip) {
          // messageBox = MessageBox.alert("数据去外星了，请刷新网页把数据拉回来~~~", {
          //   confirmButtonText: "确定",
          //   callback: action => {
          //     messageBox = null;
          //   }
          // });
        }
      }
      return {
        data: {
          code: 503,
          data: false,
          message: "服务器异常",
        },
      };
    });
  };

  $service[a.name] = function (params) {
    return requestV2[`$${a.method}`](`${BASE_URL}${a.url}`, params);
  };
});

export default {
  service,
  $service,
};
