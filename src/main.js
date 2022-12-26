import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
/* import ElementUI from "element-ui"; */
/* import "element-ui/lib/theme-chalk/index.css"; */
import router from "./router/index-2"; //正常路由
//import router from "./router/update";//update
import api from "@/api/index";
import VueClipboard from "vue-clipboard2";
// import disableDevtool from "disable-devtool";
import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";
import lozad from "lozad";
import adapter from "@/utils/adapter";
import LocalStorage from "./utils/localStorage";
import common from "@/utils/common";
import authInfomation from "@/utils/auth-infomation";
import store from "./store";
import dayjs from "dayjs";
import "@/assets/1.0/scss/theme/index.scss";
// import VConsole from 'vconsole';

import {
  Popup,
  Picker,
  Field,
  DatetimePicker,
  Toast,
  Notify,
  Tab,
  Tabs,
  Tabbar,
  TabbarItem,
  Cascader,
  Popover as VPopover,
  SwipeCell,
} from "vant";
import "vant/lib/index.css";
import SetPassword from "@/pages/v1/login-registration/SetPassword/SetPassword.js"; //添加全局设置密码弹窗
import globalCommon from "@/components/v1/globalCommon";
import VueLazyload from "vue-lazyload";
import VueLuckyCanvas from "@lucky-canvas/vue";
import numFormat from "@/utils/number-format";

import {
  Pagination,
  Dialog,
  Input,
  Radio,
  RadioGroup,
  Select,
  Button,
  DatePicker,
  TimeSelect,
  Tooltip,
  Form,
  Alert,
  Popover,
  Avatar,
  Option,
  Message,
  FormItem,
  InputNumber,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Loading,
  MessageBox,
  Collapse,
} from "element-ui";

// if (process.env.NODE_ENV !== 'production') {
//   new VConsole();
// }


Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Select);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(Alert);
Vue.use(Popover);
Vue.use(Avatar);
Vue.use(Option);
Vue.use(FormItem);
Vue.use(InputNumber);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Loading);
Vue.use(Collapse);
/* Vue.use(Skeleton); */

Vue.use(Popup);
Vue.use(SwipeCell);
Vue.use(Picker);
Vue.use(Field);
Vue.use(DatetimePicker);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Cascader);
Vue.use(VPopover);
Vue.use(adapter);
Vue.use(preview, {
  maxSpreadZoom: 2, // 控制预览图最大的倍数，默认是2倍，我这里改成了原图
  fullscreenEl: true, //控制是否显示右上角全屏按钮
  closeEl: true, //控制是否显示右上角关闭按钮
  tapToClose: true, //点击滑动区域应关闭图库
  shareEl: false, //控制是否显示分享按钮
  zoomEl: true, //控制是否显示放大缩小按钮
  counterEl: false, //控制是否显示左上角图片数量按钮
  arrowEl: false, //控制如图的左右箭头（pc浏览器模拟手机时）
  tapToToggleControls: true, //点击应切换控件的可见性
  clickToCloseNonZoomable: true, //点击图片应关闭图库，仅当图像小于视口的大小时
});
Vue.use(VueClipboard);
/* Vue.use(ElementUI); */
Vue.use(store);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: "//static.theone.art/pc/icons/icon-loading-err.png",
  loading: "//static.theone.art/pc/icons/img-loading.png",
  attempt: 1, //失败尝试次数
});
// if (process.env.NODE_ENV == 'production' && document.domain == "theone.art") {
//   disableDevtool({ disableMenu: false });
// }
/* disableDevtool({ disableMenu: false });  */

// var sensors = require('sa-sdk-javascript');
var sensors = window["sensorsDataAnalytic201505"];
sensors.init({
  server_url: "https://bi-receive.theone.art/sa?project=production",
  // server_url: "https://bi-receive.theone.art/sa?project=default",
  app_js_bridge:true,
  is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
  use_client_time: true,
  send_type: "beacon",
  show_log: false,
  heatmap: {
    //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
    clickmap: "default",
    //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
    scroll_notice_map: "not_collect",
  },
});
if (
  localStorage.getItem("THEONE_MEMBER") &&
  JSON.parse(localStorage.getItem("THEONE_MEMBER")).encryptUuid
) {
  sensors.login(JSON.parse(localStorage.getItem("THEONE_MEMBER")).encryptUuid);
}
sensors.quick("autoTrack"); //用于采集 $pageview 事件。
sensors.use("PageLeave");
Vue.prototype.$sensors = sensors;

Vue.prototype.$common = common;
Vue.prototype.$localStorage = LocalStorage;
Vue.prototype.$authInfomation = authInfomation;
Vue.prototype.$toast = Toast;
Vue.prototype.$notify = Notify;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$llmessage = {
  warning: (msg) => {
    Message({
      type: "warning",
      message: msg,
      customClass: "ll-message",
      duration: 0,
    });
  },
  error: (msg) => {
    Message({
      type: "error",
      message: msg,
      customClass: "ll-message",
    });
  },
  success: (msg) => {
    Message({
      type: "success",
      message: msg,
      customClass: "ll-message",
    });
  },
};
Vue.prototype.$numFormat = numFormat;
Vue.prototype.$lozad = lozad;
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.$bus = new Vue();
Vue.prototype.$setPassword = SetPassword.install;
Vue.use(globalCommon);
Vue.use(VueLuckyCanvas);
window.d = common.randomString();
window.e = common.randomString();

if (common.isMobile()) {
  common.loadScript(() => {}, {
    id: "p-2",
    url: "https://mpay-static.oss-cn-hangzhou.aliyuncs.com/html/lib/microdone/index.js",
  });
} else {
  common.loadScript(() => {}, {
    id: "p-2",
    url: "https://static.theone.art/pc/ll-bag/js/microdone.js",
  });
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
