/* 宝户支付 */
import {
    METHOD
} from "@/utils/request";
export default [
    {
        name: "payChannel_transactionPassword", //B账号设置交易密码
        url: "/user/api/payChannel/transactionPassword",
        method: METHOD.POST
    },
    {
        name: "payChannel_confirmPassword", //B账号确认支付密码是否设置成功
        url: "/user/api/payChannel/confirmPassword",
        method: METHOD.POST
    },
    {
        name: "payChannel_idcardImage", //B账号设置身份证正反面
        url: "/user/api/payChannel/idcardImage",
        method: METHOD.POST
    },
    {
        name: "payChannel_uploadCert", //上传身份证
        url: "/base/api/upload/uploadCert",
        method: METHOD.POST
    },
]