//少儿数字艺术活动
import { METHOD } from "@/utils/request";
export default [
  {
    name: "voterActivity_detailo", //获取投票详情
    url: "/activity/api/voterActivity/detail",
    method: METHOD.POST,
  },
  {
    name: "voterActivity_list", //投票活动作品列表
    url: "/activity/api/voterActivity/creation/list",
    method: METHOD.POST,
  },
  {
    name: "voterActivity_voteDetail", //Api投票页面信息
    url: "/activity/api/voterActivity/voteDetail",
    method: METHOD.POST,
  },
  {
    name: "voterActivity_creation_list", //投票活动作品列表
    url: "/activity/api/voterActivity/creation/list",
    method: METHOD.POST,
  },
  {
    name: "voterActivity_creation_vote", //投票
    url: "/activity/api/voterActivity/creation/vote",
    method: METHOD.POST,
  },
  {
    name: "voterActivity_creation_detail", //投票活动作品详情
    url: "/activity/api/voterActivity/creation/detail",
    method: METHOD.POST,
  },
];
