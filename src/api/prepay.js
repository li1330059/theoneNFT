//预定金
import { METHOD } from "@/utils/request";

export default [
  {
    name: "saleRecord_supportFilterList", //市场筛选条件
    url: "/market/api/saleRecord/supportFilterList",
    method: METHOD.POST,
  },

  {
    name: "saleRecord_getSaleConfig", //寄售页配置
    url: "/goods/api/saleRecord/getSaleConfig",
    method: METHOD.POST,
  },
  {
    name: "saleRecord_calculatePrice", //实时计算寄售定金价格
    url: "/goods/api/saleRecord/calculatePrice",
    method: METHOD.POST,
  },
  {
    name: "goods_saleRecord_getRealPriceInfo", //api获取实际价格信息
    url: "/goods/api/saleRecord/getRealPriceInfo",
    method: METHOD.POST,
  },
];
