//品牌月用户方案征集活动
import {
    METHOD
} from "@/utils/request";
export default [
    {
        name: "suggestion_info", //检测用户是否具有资格
        url: "/user/api/suggestion/info",
        method: METHOD.GET
    },
    {
        name: "suggestion_save", //用户添加提议
        url: "/user/api/suggestion/save",
        method: METHOD.POST
    }
]