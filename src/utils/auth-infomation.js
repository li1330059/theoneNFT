const BigInteger = require("./jsbn").BigInteger;
module.exports = {
  contractAddress(goods) {
    if (goods.commoditySku && goods.commoditySku.contractAddress) {
      return goods.commoditySku.contractAddress;
    } else if (goods.commodity && goods.commodity.contractAddress) {
      return goods.commodity.contractAddress;
    }
    return "";
  },
  getNftId(goods) {
    const sourcePlatform =
      (goods.commodity && goods.commodity.sourcePlatform) || "";
    if (goods.commoditySku && goods.commoditySku.nftId) {
      if (sourcePlatform == 3) {
        return goods.commoditySku.nftId;
      }
      return new BigInteger(
        goods.commoditySku.nftId.replace(/0x/gi, ""),
        16
      ).toString();
    } else if (goods.commodity && goods.commodity.nftId) {
      if (sourcePlatform == 3) {
        return goods.commodity.nftId;
      }
      return new BigInteger(
        goods.commodity.nftId.replace(/0x/gi, ""),
        16
      ).toString();
    }
    return "";
  },
  getChainContract(goods) {
    if (goods.commoditySku && goods.commoditySku.chainContract) {
      return goods.commoditySku.chainContract;
    } else if (goods.commodity && goods.commodity.chainContract) {
      return goods.commodity.chainContract;
    }
    return "";
  },
  getChainName(goods) {
    if (goods.commoditySku && goods.commoditySku.chainName) {
      return goods.commoditySku.chainName;
    } else if (goods.commodity && goods.commodity.chainName) {
      return goods.commodity.chainName;
    }
    return "";
  },
  goChain(type) {
    const _type = type.toLowerCase();
    if (_type == "polygon") {
      window.open("https://polygonscan.com/");
    } else if (_type == "ethereum") {
      window.open("https://etherscan.io/");
    }
  },
  goContractAddress(type, val, chainContract) {
    if (chainContract.toLowerCase() == "erc1155") {
      return;
    }
    const _type = type.toLowerCase();
    if (_type == "polygon") {
      window.open(`https://polygonscan.com/token/${val}`);
    } else if (_type == "ethereum") {
      window.open(`https://etherscan.io/token/${val}`);
    }
  },
  goNftId(type, address, val, chainContract) {
    if (chainContract.toLowerCase() == "erc1155") {
      return;
    }
    const _type = type.toLowerCase();
    if (_type == "polygon") {
      window.open(`https://polygonscan.com/token/${address}?a=${val}`);
    } else if (_type == "ethereum") {
      window.open(`https://etherscan.io/token/${address}?a=${val}`);
    }
  },
};
