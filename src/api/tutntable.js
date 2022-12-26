//幸运大转盘

import {
    METHOD
} from "@/utils/request";

export default [
    {
        name: "lottery_spin_openOne", //单抽
        url: "/om-goods/api/lottery/spin/openOne",
        method: METHOD.POST
    },
    {
        name: "lottery_spin_openTen", //十抽
        url: "/om-goods/api/lottery/spin/openTen",
        method: METHOD.POST
    },
    {
        name: "lottery_spin_detail", //活动详情
        url: "/om-goods/api/lottery/spin/detail",
        method: METHOD.POST
    },
    {
        name: "lottery_spin_treasureList", //获取材料
        url: "/om-goods/api/lottery/spin/treasureList",
        method: METHOD.POST
    },
    {
        name: "lottery_spin_treasureSkuList", //获取材料sku
        url: "/om-goods/api/lottery/spin/treasureSkuList",
        method: METHOD.POST
    },
    //
]