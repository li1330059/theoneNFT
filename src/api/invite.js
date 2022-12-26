import { METHOD } from "@/utils/request";
export default [
  // TODO 拉新
  {
    name: "invite_login", //邀请码登录
    url: "/activity/api/activity/login",
    method: METHOD.POST,
  },
  {
    name: "invite_addOrder", //邀请码下单
    url: "/activity/api/activity/addOrder",
    method: METHOD.POST,
  },
  {
    name: "invite_bind", //用户绑定邀请码
    url: "/activity/api/invite/bind",
    method: METHOD.POST,
  },
  {
    name: "invite_detail", //活动详情
    url: "/activity/api/invite/detail",
    method: METHOD.POST,
  },
  {
    name: "invite_simpleDetail", //活动基础简讯
    url: "/activity/api/invite/simpleDetail",
    method: METHOD.POST,
  },
  {
    name: "invite_pageRecord", //邀请记录
    url: "/activity/api/invite/pageRecord",
    method: METHOD.POST,
  },
];
