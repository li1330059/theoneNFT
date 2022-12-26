import { METHOD } from "@/utils/request";
export default [
  {
    name: "withdrawalOrderYb_withdrawalOrderList", //易宝申请提现接口
    url: "/order/api/withdrawalOrderYb/withdrawalOrderList",
    method: METHOD.POST,
  },
  {
    name: "payChannel_queryMicroStatusYb",
    url: "/user/api/payChannel/queryMicroStatusYb",
    method: METHOD.POST,
  },
  {
    name: "payChannel_queryYbAddressCode", //获取区码
    url: "/user/api/payChannel/queryYbAddressCode",
    method: METHOD.GET,
  },
  {
    name: "payChannel_queryYbAddress", //获取省市县编码
    url: "/user/api/payChannel/queryYbAddress",
    method: METHOD.POST,
  },
  {
    name: "payChannel_requestYbRepeat", //重新请求易宝接口
    url: "/user/api/payChannel/requestYbRepeat",
    method: METHOD.POST,
  },
  {
    name: "payChannel_changeYbSettleBankCard", //易宝结算卡更换
    url: "/user/api/payChannel/changeYbSettleBankCard",
    method: METHOD.POST,
  },
  {
    name: "ybWallet_getInfo", //获取易宝钱包信息
    url: "/user/api/ybWallet/getInfo",
    method: METHOD.POST,
  },
  {
    name: "getBalance_yb", //易宝快捷账户的余额
    url: "/user/api/notecase/getBalance/yb",
    method: METHOD.POST,
  },
];
