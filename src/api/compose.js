//临时合成接口
import {
    METHOD
} from "@/utils/request";
export default [
    {
        name: "treasureSku_queryTreasureByCategory", //根据分类uuid获取藏品
        url: "/goods/api/treasureSku/queryTreasureByCategory",
        method: METHOD.POST
    },
    {
        name: "treasureSku_listMaterial", //根据藏品uuid获取藏品sku（带编号）
        url: "/goods/api/treasureSku/listMaterial",
        method: METHOD.POST
    },
    {
        name: "treasureSku_synthesisV2", //合成
        url: "/goods/api/treasureSku/synthesisV2",
        method: METHOD.POST
    }
]

