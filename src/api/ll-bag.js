
import {
    METHOD
} from "@/utils/request";

export default [
    {
        name: "ll_balance_get", //获取账户余额
        url: "/user/api/ll/walletAccount/balance/get",
        method: METHOD.POST
    },
    {
        name: "ll_phoneVerifyCodeApply", //开户绑定手机号验证码发送申请
        url: "/user/api/ll/walletAccount/phoneVerifyCodeApply",
        method: METHOD.POST
    },
    {
        name: "ll_checkVerifyCode", //开户绑定手机号验证码验证
        url: "/user/api/ll/walletAccount/checkVerifyCode",
        method: METHOD.POST
    },
    {
        name: "ll_queryWalletAccountStatus", //获取账户开户信息
        url: "/user/api/payChannel/queryWalletAccountStatus",
        method: METHOD.POST
    },
    {
        name: "ll_walletAccount_bindCardApply", //个人开户申请
        url: "/user/api/ll/walletAccount/bindCardApply",
        method: METHOD.POST
    },
    {
        name: "ll_walletAccount_confirmBindCard", //个人开户验证
        url: "/user/api/ll/walletAccount/confirmBindCard",
        method: METHOD.POST
    },
    {
        name: "ll_safeConfig_randomKey", //随机密码因子获取
        url: "/user/api/ll/safeConfig/randomKey/get",
        method: METHOD.POST
    },
    {
        name: "ll_recharge_create", //充值
        url: "/pay/api/recharge/create",
        method: METHOD.POST
    },
    {
        name: "ll_bindCard_list", //银行卡列表
        url: "/user/api/ll/bindCard/list",
        method: METHOD.POST
    },
    {
        name: "ll_recharge_check", //用户充值验证
        url: "/pay/api/recharge/check",
        method: METHOD.POST
    },
    {
        name: "llWithdrawal_withdrawa", //提现
        url: "/finance/api/llWithdrawal/withdrawa",
        method: METHOD.POST
    }, {
        name: "ll_pay_confirm", //银行卡支付确认
        url: "/pay/api/v3/pay/confirm",
        method: METHOD.POST
    },
    {
        name: "llWithdrawal_withdrawal", //连连钱包用户提现申请
        url: "/finance/api/llWithdrawal/withdrawal",
        method: METHOD.POST
    },
    {
        name: "llAccount_list", //连连钱包用户账单
        url: "/finance/api/llAccount/list",
        method: METHOD.POST
    },
    {
        name: "ll_bindCard_unbind", //解绑银行卡
        url: "/user/api/ll/bindCard/unbind",
        method: METHOD.POST
    },
    {
        name: "ll_bindCard_bind", //绑银行卡
        url: "/user/api/ll/bindCard/bind/apply",
        method: METHOD.POST
    },
    {
        name: "ll_bindCard_bind_verify", //绑卡确认
        url: "/user/api/ll/bindCard/bind/verify",
        method: METHOD.POST
    },
    {
        name: "ll_resetPwd_apply", //重置密码申请
        url: "/user/api/ll/safeConfig/resetPwd/apply",
        method: METHOD.POST
    },
    {
        name: "ll_resetPwd_verify", //重置密码验证
        url: "/user/api/ll/safeConfig/resetPwd/verify",
        method: METHOD.POST
    },
    {
        name: "ll_safeConfig_changePwd", //修改密码
        url: "/user/api/ll/safeConfig/changePwd",
        method: METHOD.POST
    },
    {
        name: "ll_llWithdrawal_list", //获取列表
        url: "/finance/api/llWithdrawal/list",
        method: METHOD.POST
    },
    {
        name: "ll_llWithdrawal_uploadIdCard", //身份证上传确认
        url: "/user/api/ll/walletAccount/uploadIdCard",
        method: METHOD.POST
    },
]