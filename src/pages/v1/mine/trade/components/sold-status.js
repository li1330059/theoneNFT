export const soldStatus = (data) => {
  if (
    data.statusTrade == 0 &&
    data.depositObj &&
    data.depositObj.statusTrade == 0
  ) {
    return { txt: "待支付定金" };
  }
  if (
    data.statusTrade == 0 &&
    data.balanceObj &&
    data.balanceObj.statusTrade == 0
  ) {
    return { txt: "待支付尾款", isRefund: true };
  }
  if (
    data.statusTrade == 5 &&
    data.refundObj &&
    data.refundObj.statusTrade == 1
  ) {
    return { txt: "已关闭 退款成功", time: data.payTIme };
  }
  if (
    data.statusTrade == 5 &&
    data.balanceObj &&
    data.balanceObj.statusTrade == 4
  ) {
    return { txt: "已关闭 尾款超时未支付", time: data.payTIme };
  }
  if (
    data.statusTrade == 3 &&
    data.balanceObj &&
    data.balanceObj.statusTrade == 1 &&
    data.depositObj &&
    data.depositObj.statusTrade == 1
  ) {
    return { txt: "已完成", time: data.payTime };
  }
  if (data.statusTrade == 4) {
    return { txt: "已取消", time: data.payTime };
  }
  return { txt: "" };
};
