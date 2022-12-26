/* 活动日历*/
import {
    METHOD
} from "@/utils/request";
export default [
    {
        name: "activityCalendar_page", //发售列表
        url: "/activity/api/activityCalendar/page",
        method: METHOD.POST
    },
    {
        name: "activityCalendar_detail", //发售详情
        url: "/activity/api/activityCalendar/detail",
        method: METHOD.POST
    }

]