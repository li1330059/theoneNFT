//临时合成接口
import {
    METHOD
} from "@/utils/request";
export default [
    {
        name: "treasure_list_v2", //根据分类uuid获取藏品
        url: "/goods/api/treasure/list/v2",
        method: METHOD.POST
    },
    {
        name: "treasureSku_detail", //api藏品sku详情
        url: "/goods/api/treasureSku/detail",
        method: METHOD.POST
    },
	{
	    name: "getMarketVolume", //获取市场总量
	    url: "/goods/api/commodityTotal/queryCommodityTotal",
	    method: METHOD.POST
	},
	{
	    name: "queryCommodityMaxNum", //总量最大版本号
	    url: "/goods/api/commodityTotal/queryCommodityMaxNum",
	    method: METHOD.POST
	},
	{
	    name: "queryCommodityTotalDetail", //总量详情
	    url: "/goods/api/commodityTotal/queryCommodityTotalDetail",
	    method: METHOD.POST
	},
	{
	    name: "queryCommodityTotalList", //总量详情列表
	    url: "/goods/api/commodityTotal/queryCommodityTotalList",
	    method: METHOD.POST
	},
	{
	    name: "searchCommodityTotalList", //总量编号搜索
	    url: "/goods/api/commodityTotal/searchCommodityTotalList",
	    method: METHOD.POST
	},
]