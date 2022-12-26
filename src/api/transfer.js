//作品转入

import { METHOD } from "@/utils/request";

export default [
  {
    name: "transferRecordDetail_count", // 待接收，已接收，已拒绝藏品总数查询（用于提示用户有藏品待接收
    url: "/goods/api/transferRecordDetail/count",
    method: METHOD.GET,
  },
  {
    name: "transferRecord_list", // 转移记录
    url: "/goods/api/transferRecord/list",
    method: METHOD.POST,
  },
  {
    name: "transferRecord_detail", // 转移记录明细列表
    url: "/goods/api/transferRecordDetail/list",
    method: METHOD.POST,
  },
  {
    name: "transferRecordDetail_receiveList", // 待接收藏品列表
    url: "/goods/api/transferRecordDetail/toReceiveList",
    method: METHOD.GET,
  },
  {
    name: "transferRecordDetail_receive", // 接收
    url: "/goods/api/transferRecordDetail/receive",
    method: METHOD.POST,
  },
  {
    name: "transferRecordDetail_refuse", // 拒绝
    url: "/goods/api/transferRecordDetail/refuse",
    method: METHOD.POST,
  },
];
