import {
    METHOD
} from "@/utils/request";
export default [
    {
        name: "commodityTrait_statistics", //查询商品特性汇总信息
        url: "/market/api/commodityTrait/statistics",
        method: METHOD.POST
    },
    {
        name: "commodity_search", //查询名称分类
        url: "/market/api/commodity/search",
        method: METHOD.POST
    },
    {
        name: "saleRecord_list_v2", //出售记录 市场列表页
        url: "/market/api/saleRecord/list/v2",
        method: METHOD.POST
    },
    {
        name: "commodityTrait_ratio", //获取商品特性
        url: "/market/api/commodityTrait/ratio/v2",
        method: METHOD.POST
    }
]