//文案系统

import { METHOD } from "@/utils/request";

export default [
  {
    name: "getByKey_collectionImgSuccessToast", //源文件下载文案
    url: "/base/api/copyWriting/getByKey/collectionImgSuccessToast",
    method: METHOD.GET,
  },

  {
    name: "getByKey_depositProportionCharge", //定金收取比例
    url: "/base/api/copyWriting/getByKey/depositProportionCharge",
    method: METHOD.GET,
  },
  {
    name: "getByKey_DepositPresellRule", //什么是定金预售
    url: "/base/api/copyWriting/getByKey/DepositPresellRule",
    method: METHOD.GET,
  },
  {
    name: "getByKey_newRefundCalculationMethod", //退款计算方式
    url: "/base/api/copyWriting/getByKey/newRefundCalculationMethod",
    method: METHOD.GET,
  },
  {
    name: "getByKey_depositBigSalePrice", //定金活动寄售最大金额
    url: "/base/api/copyWriting/getByKey/depositBigSalePrice",
    method: METHOD.GET,
  },
  {
    name: "getByKey_hxtLimitAgeTips", //寄售提示
    url: "/base/api/copyWriting/getByKey/hxtLimitAgeTips",
    method: METHOD.GET,
  },
  {
    name: "getByKey_supportedChannelTip", //寄售提示
    url: "/base/api/copyWriting/getByKey/supportedChannelTip",
    method: METHOD.GET,
  },
  {
    name: "getByKey_marketVolumeTip", //市场总量提示
    url: "/base/api/copyWriting/getByKey/marketVolumeTip",

    method: METHOD.GET,
  },
];
