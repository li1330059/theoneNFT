import { METHOD } from "@/utils/request";
export default [
  {
    name: "exhibition_getByKey", //c端活动详情
    url: "/om-goods/api/exhibition/popularize/getByKey",
    method: METHOD.POST,
  },
  {
    name: "exhibition_getConfiguration", //查看活动配置信息
    url: "/om-goods/api/exhibition/popularize/getConfiguration",
    method: METHOD.POST,
  },
];
