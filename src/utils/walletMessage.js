import common from "@/utils/common";

let amountType = [
  "",
  "可用金额",
  "冻结金额",
  "待结算金额",
  "累计销售额",
  "累计收益额",
  "累计余额支付额",
  "累计充值额",
  "累计手续费",
  "累计第三方支付额",
  "累计提现金额"
];
let auditStatus = ["", "", "", "已通过", "被拒绝"];

export default {
  message(info) {
    let message = ``;
    try {
      let data = JSON.parse(info.dataJson);
     // console.log(info.dataType, data);

      if (info.dataType == 1) {
        //寄售
        if (data instanceof Array) {
          let sale = JSON.parse(data[0].commoditySkuJson);
          message = `您寄售的<span>${sale.name}</span>已售出。`;
          if (info.amountType == 1) {
            message += `已收到<span>${common.formatMoney(
              info.amount
            )}</span>的收益，此资金已进入可用金额池。`;
          } else {
            message += `${amountType[
              info.amountType
            ]}增加<span>${common.formatMoney(info.amount)}</span
              >。`;
          }
        }
      } else if (info.dataType == 2) {
        //充值
      } else if (info.dataType == 3) {
        //支付
        message = `您支付<span>${common.formatMoney(info.amount)} </span>。`;
        if (data.cancelType == 1) {
          message += `<span>订单超时被取消。</span>`;
       /*    if (info.amountType == 1) {
            message += `可用余额已接收原路返还的冻结金额。`;
          } else if (info.amountType == 2) {
            message += `冻结金额原路返还至可用余额中。`;
          } */
        } else {
      /*     if (info.amountType == 1) {
            message += `此金额将进入冻结金额池中，若订单取消，金额将原路返还。`;
          } else if (info.amountType == 2) {
            message += `此金额已冻结。`;
          } */
        }
      } else if (info.dataType == 4) {
        //提现
        if (data.auditStatus == 1) {
          message = ` 您已发起提现申请，<span>${common.formatMoney(
            info.amount
          )} </span>`;
       /*    if (info.amountType == 1) {
            message += `将从可用金额池中进入冻结金额池中，等待被提现。`;
          } else if (info.amountType == 2) {
            message += `进入冻结金额池中，若提现被拒绝此资金将会原路返还。`;
          } */
        } else {
          message = `您的提现申请<span>${auditStatus[data.auditStatus]}</span>。`;
          if (data.auditStatus == 4) {
            message += `原因：<span>${data.auditReason}</span>。`;
            if (info.amountType == 1) {
              message += `可用金额已接收到原路返还的<span>${common.formatMoney(
                info.amount
              )} </span>。`;
            } else if (info.amountType == 2) {
           /*    message += `冻结金额<span>${common.formatMoney(
                info.amount
              )}</span>已原路返还至可用金额池中。`; */
            }
          } else {
            if (data.withdrawalStatus == 3) {
              if (info.amountType == 10) {
                message += `财务<span>已打款</span>，累计提现金额增加<span>${common.formatMoney(
                  info.amount
                )} </span>。`;
              } else if (info.amountType == 2) {
                message += `财务<span>已打款</span>，`;
                if (data.payType == 2) {
                  message += `请使用支付宝进行查收。收款账号：<span>${data.alipayAccount}</span>。`;
                }
              }
            } else if (data.withdrawalStatus == 4) {
              message += `打款失败。原因：<span>${data.withdrawalReason}</span>。`;
              if (info.amountType == 1) {
                message += `可用金额已接收到原路返还的<span>${common.formatMoney(
                  info.amount
                )}</span> 。`;
              } else if (info.amountType == 2) {
          /*       message += `冻结金额<span>${common.formatMoney(
                  info.amount
                )}</span>已原路返还至可用金额池中。`; */
              }
            }
          }
        }
      } else if (info.dataType == 5) {
        message = `您已收到<span>${common.formatMoney(info.amount)}</span>。`;
      }
    } catch (error) {}

    return message;
  }
};
