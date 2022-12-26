/**
 * 全局组件
 */
import countLetters from "./countLetters";
import countIdcard from "./countIdcard";
import copy from "./copy";
import pageTemplate from "./pageTemplate";
import getphonecode from "./getphonecode";
import verifiedPayPw from "./verifiedPayPw";
import commodityNum from "./commodity-num";
import PreviewImg from "./preview-img";
import StatusTemplate from "./status-template";
import GVideoPlayer from "./g-video-player";
import GVerificationCode from "./g-verification-code";
import AntiBrushFrequently from "./anti-brush/frequently";
import AntiBrushLoggedIn from "./anti-brush/logged-in";
import AntiBrushNotLoggedIn from "./anti-brush/not-logged-in";
import GVcodeTip from "./anti-brush/g-vcode-tip";
import Paging from "./g-paging";
import GWxTip from "./g-wx-tip";
import CustomerService from "./customer-service";
import CommunityService from "./community-service";
import TimePicker from "./time-picker";
import Cascader from "./cascader";
import UiSelect from "./ui-select";
import Mhead from "./m-head";
import GoodsFrame from "./goods-frame";
import Share from "./share";
import GSwiperGoods from "./global/swiper-goods.vue";
import OpenApp from "./open-app";
import PrepaySign from "./prepay-sign.vue";
import SimpleFrame from "./simple-frame.vue";
export default {
  install: (Vue) => {
    Vue.component("count-letters", countLetters),
      Vue.component("count-idcard", countIdcard),
      Vue.component("copy", copy),
      Vue.component("page-template", pageTemplate),
      Vue.component("get-phonecode", getphonecode),
      Vue.component("verified-pay-pw", verifiedPayPw),
      Vue.component("commodity-num", commodityNum),
      Vue.component("preview-img", PreviewImg),
      Vue.component("status-template", StatusTemplate),
      Vue.component("g-video-player", GVideoPlayer),
      Vue.component("g-verification-code", GVerificationCode),
      Vue.component("ab-frequently", AntiBrushFrequently),
      Vue.component("ab-logged-in", AntiBrushLoggedIn),
      Vue.component("ab-not-logged-in", AntiBrushNotLoggedIn),
      Vue.component("g-vcode-tip", GVcodeTip),
      Vue.component("g-paging", Paging),
      Vue.component("g-wx-tip", GWxTip),
      Vue.component("customer-service", CustomerService),
      Vue.component("community-service", CommunityService),
      Vue.component("time-picker", TimePicker),
      Vue.component("cascader", Cascader),
      Vue.component("ui-select", UiSelect),
      Vue.component("m-head", Mhead),
      Vue.component("goods-frame", GoodsFrame),
      Vue.component("g-share", Share),
      Vue.component("g-swiper-goods", GSwiperGoods),
      Vue.component("open-app", OpenApp);
    Vue.component("prepay-sign", PrepaySign);
    Vue.component("simple-frame", SimpleFrame);
  },
};
