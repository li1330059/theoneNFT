//行为验证码
import {
    METHOD
} from "@/utils/request";

export default [
    {
        name: "behaviorVerify_list", //行为验证码接口列表
        url: "/base/api/behaviorVerify/list",
        method: METHOD.POST
    },
    {
        name: "behaviorVerify_userNeedDisplay", //用户是否需要展示行为验证码
        url: "/base/api/behaviorVerify/userNeedDisplay",
        method: METHOD.POST
    }
]