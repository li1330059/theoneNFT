class MobileDevice {
  constructor(setting) {
    this.setting = setting;
  }
  payResult(status) {
    this.setting.messageHandler("payResult", { status: status });
  }
  authLogin(item) {
    this.setting.messageHandler("authLogin", item);
  }
  goBack() {
    this.setting.messageHandler("goBack", {});
  }
  loginExpire() {
    this.setting.messageHandler("loginExpire", {});
  }
  goPage() {
    this.setting.messageHandler("goPage", { page: "artDetail", params: {} });
  }
  goPageArtDetail(artUuid) {
    this.setting.messageHandler("goPage", {
      page: "artDetail",
      params: { userUuid: artUuid },
    });
  }
  goPageGoodsDetail(saleUuid, activeUuid) {
    this.setting.messageHandler("goPage", {
      page: "goodsDetail",
      params: { saleUuid: saleUuid, activeUuid: activeUuid },
    });
  }
  saveImage(params) {
    this.setting.messageHandler("saveImage", params);
  }
}
export default MobileDevice;
