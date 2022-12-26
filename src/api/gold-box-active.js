//临时合成接口
import {
    METHOD
} from "@/utils/request";
export default [
    {
        name: "om_goods_lottery_detail", //抽奖活动详情
        url: "/om-goods/api/lottery/detail",
        method: METHOD.POST
    },
    {
        name: "om_goods_lottery_logList", //开启记录
        url: "/om-goods/api/lottery/logList",
        method: METHOD.POST
    },
    {
        name: "om_goods_lottery_open", //开启礼盒
        url: "/om-goods/api/lottery/open",
        method: METHOD.POST
    },
]