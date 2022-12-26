import { METHOD } from "@/utils/request";
export default [
  {
    name: "activityTemplate_detailV2", //api活动模板详情v2
    url: "/om-goods/api/activityTemplate/detailV2",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_synthesisV3", //api 财产sku合成v3
    url: "/om-goods/api/synthesis/synthesisV3",
    method: METHOD.POST,
  },
  {
    name: "treasureSku_queryTreasureByDetail", //api 根据合成明细id 查询财产
    url: "/goods/api/treasureSku/queryTreasureByDetail",
    method: METHOD.POST,
  },
  {
    name: "synthesisLog_list", //api合成日志列表
    url: "/om-goods/api/synthesisLog/list",
    method: METHOD.POST,
  },
  {
    name: "synthesisLog_detail", //api合成日志详情
    url: "/om-goods/api/synthesisLog/detail",
    method: METHOD.POST,
  },
  //
];
