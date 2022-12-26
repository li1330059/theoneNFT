function getNum(goodsObj) {
  if (goodsObj.commodity && goodsObj.commodity.typeMarket == 1) {
    return 1;
  }
  return (
    (goodsObj.commoditySku && goodsObj.commoditySku.number) ||
    (goodsObj.commodity && goodsObj.commodity.number) ||
    goodsObj.number
  );
}
function getAmountNum(goodsObj) {
  if (goodsObj.commodity && goodsObj.commodity.typeMarket == 1) {
    return 1;
  }
  const num =
    (goodsObj.commoditySku && goodsObj.commoditySku.amountNumber) ||
    (goodsObj.commodity && goodsObj.commodity.amountSku);
  return num == -1 ? "纪念品" : Number(num);
}
function getNumStr(goodsObj) {
  if (goodsObj.commodity) {
    let statusNumber = goodsObj.commodity.statusNumber;
    if (!statusNumber) {
      statusNumber = goodsObj.commoditySku.statusNumber;
    }

    if (
      goodsObj.commodity.typeMarket == 1 ||
      (goodsObj.commodity.typeMarket == 2 && statusNumber == 1) ||
      goodsObj.commodity.typeMarket == 3
    ) {
      return `${getNum(goodsObj)}/${getAmountNum(goodsObj)}`;
    }
  }
  return "";
}
module.exports = {
  getNum,
  getAmountNum,
  getNumStr,
};
