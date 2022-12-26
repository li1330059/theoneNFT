

import {
    METHOD
} from "@/utils/request";

export default [
    {
        name: "discountQueryUserDiscountSell", //获取寄售费率
        url: "/om-goods/api/discount/queryUserDiscountSell",
        method: METHOD.POST
    },
    {
        name: "discountCommodityDiscountInfo", //获取商品关联折扣卡信息
        url: "/om-goods/api/discount/commodityDiscountInfo",
        method: METHOD.POST
    },
    {
        name: "saleRecord_getRealPriceInfo", //商品价格计算接口
        url: "/om-goods/api/saleRecord/getRealPriceInfo",
        method: METHOD.POST
    }
]