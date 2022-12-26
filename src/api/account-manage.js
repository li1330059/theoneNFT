/* 结算账户管理 */
import { METHOD } from "@/utils/request";
export default [
  {
    name: "payChannel_accountInfoList", //多渠道账户状态
    url: "/user/api/payChannel/accountInfoList",
    method: METHOD.POST,
  },
  {
    name: "payChannel_operationInfo", //支付渠道操作记录
    url: "/user/api/payChannel/operationInfo",
    method: METHOD.POST,
  },
  {
    name: "thirdAccount_sellerChannel", //卖家支持的支付渠道
    url: "/user/api/thirdAccount/sellerChannel",
    method: METHOD.POST,
  },
  {
    name: "thirdAccount_sellerChannel_v2", //卖家支持的支付渠道
    url: "/user/api/thirdAccount/sellerChannel/v2",
    method: METHOD.POST,
  },
  {
    name: "userAttribute_getCardImage", //查看身份证
    url: "/user/api/userAttribute/getCardImage",
    method: METHOD.POST,
  },
  //
];
