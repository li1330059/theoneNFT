import Vue from "vue";
import Vuex from "vuex";
import chainStore from "./chainStore";
import api from "@/api/index";
import axios from "axios";
import $localStorage from "../utils/localStorage";
Vue.use(Vuex);
function toHump(name) {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}
export default new Vuex.Store({
  //状态管理
  state: {
    llConfig: {
      appName: "test",
      pkgName: "test",
    },
    transferOnOff: false, //转移开关
    videoTime: 3, //视频预览播放时长

    isMarketRouteChange: true,
    theme: "light-theme",
    user_info: {}, //用户信息
    is_show_set_password: false, //是否显示设置密码弹窗
    is_show_loading: false, //是否显示全局loading
    apis: [], //当前正则请求的api
    isBigPay: true, //大额寄售，支付，提现流程开关
    goodsVideoInfo: {
      //商品视频信息
      isShow: false,
      src: "",
    },
    greyConfig: {
      isOpen: false,
      isLoad: false,
    },
    isShowFrequently: false, //10006
    isShowLoggedIn: false,
    isShowNotLoggedIn: false,
    vcodeTip: {
      isShow: false,
      message: "",
    }, //验证吗弹窗
    marketBtnDisabledInfo: {
      code: -1,
      time: "",
    },
    wxTipInfo: {
      show: false,
    },
    geetestParams: {},
    geetestAry: [],
    updateInfo: {},
    behaviorVerifyList: [],
    llWalletAccountInfo: {},
    transferInfo: {
      toReceive: 0, // 待接收
      hasReceived: 0, // 已接收
      hasRefused: 0, // 已拒绝
    },
  },
  //修改state
  mutations: {
    setTransferOnOff(state, isOpen) {
      state.transferOnOff = isOpen;
    },
    setGreyConfig(state, config) {
      state.greyConfig = config;
    },
    setLlConfig(state, info) {
      state.llConfig = {
        ...state.llConfig,
        ...info,
      };
    },
    setVideoTime(state, videoTime) {
      videoTime;
      state.videoTime = videoTime;
    },
    setMarketRouteChange(state, info) {
      state.isMarketRouteChange = info;
    },
    setUpdateInfo(state, info) {
      state.updateInfo = info || {};
    },
    setGeetestParams(state, params) {
      /*       params.lot_number=1; */
      const _params = {};
      for (let key in params) {
        _params[toHump(key)] = params[key];
      }

      state.geetestParams = _params;
    },
    removeGeetest(state, idx) {
      const ary = state.geetestAry;
      ary.splice(idx, 1);
      state.geetestAry = ary;
    },
    addGeetestAry(state, obj) {
      console.log(`记录行为验证码实例`);
      const checkHave = () => {
        for (let i = 0; i < state.geetestAry.length; i++) {
          if (
            state.geetestAry[i].config &&
            state.geetestAry[i].config.id == obj.config.id
          ) {
            return true;
          }
        }
        return false;
      };
      if (!checkHave()) {
        state.geetestAry.push(obj);
      }
    },
    setGeetestAry(state, ary) {
      state.geetestAry = ary;
    },
    resetGeetestAry(state) {
      state.geetestAry = [];
    },
    setWxTip(state, params) {
      state.wxTipInfo = params;
    },
    setmarketBtnDisabledInfo(state, params) {
      state.marketBtnDisabledInfo = params;
    },
    // 修改主题
    changeTheme(state, params) {
      state.theme = params;
    },
    setVcodeTip(state, params) {
      state.vcodeTip = params;
    },
    setUserInfo(state, user_info) {
      state.user_info = {
        ...state.user_info,
        ...user_info,
      };
      localStorage.setItem("THEONE_USER", JSON.stringify(state.user_info));
    },
    setLlWalletAccountInfo(state, info) {
      state.llWalletAccountInfo = {
        ...state.llWalletAccountInfo,
        ...info,
      };
    },
    toggleSetPassWord(state, is_show) {
      state.is_show_set_password = is_show;
    },
    setLoading(state, is_show_loading) {
      //loading开关
      state.is_show_loading = is_show_loading;
    },
    setAntiBrush(state, params) {
      switch (Number(params.code)) {
        case 1005: // "您的操作过于频繁,请登录进行验证!"
          state.isShowNotLoggedIn = params.isShow;
          return;
        case 1006: //您的访问过于频繁,请先休息一下!
          state.isShowFrequently = params.isShow;
          return;
        case 1007: //您的操作过于频繁,我们将向您的注册手机号发送短信验证码,请先获取验证码进行验证!
          state.isShowLoggedIn = params.isShow;
          return;
      }
    },
    setApi(state, params) {
      const idx = state.apis.findIndex(
        (item) => item.api.search(params.api) !== -1
      );
      let apis = JSON.parse(JSON.stringify(state.apis));
      if (idx === -1) {
        apis.push(params);
      } else {
        apis[idx] = params;
      }
      state.apis = apis;
    },
    restApis(state) {
      state.apis = [];
    },
    setGoodsVideoInfo(state, info) {
      state.goodsVideoInfo = {
        ...state.goodsVideoInfo,
        ...info,
      };
    },
    setBehaviorVerifyList(state, list) {
      state.behaviorVerifyList = list;
    },
    setTransferInfo(state, params) {
      state.transferInfo = params;
    },
  },
  //异步操作
  actions: {
    async getGreyConfig(ctx, meta) {
      //刷新页面更新返回结果

      const check = () => {
        if (meta.isGrey && ctx.state.greyConfig.isOpen) {
          window.document.documentElement.setAttribute(
            "data-status",
            "grayscale"
          );
        } else {
          window.document.documentElement.setAttribute("data-status", "normal");
        }
      };

      if (ctx.state.greyConfig.isLoad) {
        check();
      } else {
        if (meta.isGrey) {
          const res = await api.service.config_get({ key: "GREY_THEME" });
          if (
            res.data.code == 200 &&
            res.data.data &&
            res.data.data.confValue1 &&
            res.data.data.confValue1.toString() == "true"
          ) {
            ctx.commit("setGreyConfig", {
              isOpen: true,
              isLoad: true,
            });
          } else {
            ctx.commit("setGreyConfig", {
              isOpen: false,
              isLoad: true,
            });
          }
        }
        check();
      }

      return;
    },
    async getTransferConfig(ctx) {
      const res = await api.service.config_get({ key: "TRANSFER_SHOW_KEY" });
      if (res.data.code == 200 && res.data.data) {
        ctx.commit(
          "setTransferOnOff",
          res.data.data.confValue1 == 1 ? true : false
        );
      }
    },
    async getConfig(ctx) {
      const key = "VIDEO-PLAY-TIME";
      const time = $localStorage.getItem(key);
      if (time) {
        ctx.commit("setVideoTime", time);
        return;
      }
      const res = await api.service.config_getConfigByType({
        type: 9,
      });
      if (res.data.code == 200 && res.data.data.confValue1) {
        $localStorage.setItem(
          key,
          res.data.data.confValue1,
          1 * 60 * 60 * 1000
        );
        ctx.commit("setVideoTime", res.data.data.confValue1);
      }
    },
    async getUpdateInfo(ctx) {
      const updateRes = await axios.get(`/update.json`);
      if (updateRes && updateRes.data.code == 200 && updateRes.data.data) {
        console.log(updateRes.data.data);
        ctx.commit("setUpdateInfo", updateRes.data.data);
      } else {
        ctx.commit("setUpdateInfo", {});
      }
    },
    async getLlAccountStatus(ctx) {
      const res = await api.service.ll_queryWalletAccountStatus();
      if (res.data.code == 200) {
        ctx.commit("setLlWalletAccountInfo", res.data.data.llWalletAccountDTO);
      }
    },
    //获取需要行为验证码的接口
    async getBehaviorVerify(ctx) {
      const res = await api.service.behaviorVerify_list();

      if (res.data.code == 200 && res.data.data.urls) {
        ctx.commit("setBehaviorVerifyList", res.data.data.urls);
        $localStorage.setItem(
          "VERIFY-LIST-V2",
          res.data.data.urls,
          2 * 60 * 60 * 1000
        );
      }
    },
    //获取用户信息
    async getUserInfo(ctx) {
      let token = localStorage.getItem("authorization");
      if (token) {
        const user_attribute_res = await api.service
          .userattribute_queryByUserUuid()
          .catch((e) => e);
        if (
          user_attribute_res &&
          user_attribute_res.data &&
          user_attribute_res.data.code == 200
        ) {
          const user_attribute = user_attribute_res.data.data;
          ctx.commit("setUserInfo", user_attribute);

          if (
            window.location.pathname.search(
              /invite_friends_detail|invite_user_registration|invite_user_name_auth/gi
            ) == -1
          ) {
            /*    if (user_attribute.isPwd !== 1) {
               //设置登录密码
               const last_password_time = localStorage.getItem("PASSWORD-DATE");
               const now_time = new Date().getTime();
               if (
                 (now_time && now_time - last_password_time >= 24 * 60 * 60 * 1000) ||
                 !last_password_time
               ) {
                 localStorage.setItem("PASSWORD-DATE", now_time);
                 ctx.commit('toggleSetPassWord', true);
                 return
               }
             } */

            if (user_attribute.isFulfill !== 1) {
              //去设置用户资料24小时内不可重复弹出
              const last_personal_time = localStorage.getItem("PERSONAL-DATE");
              const now_time = new Date().getTime();
              if (
                (now_time &&
                  now_time - last_personal_time >= 24 * 60 * 60 * 1000) ||
                !last_personal_time
              ) {
                if (window.location.pathname !== "/personal_data") {
                  localStorage.setItem("PERSONAL-DATE", now_time);
                  window.location.href = `${window.location.origin}/personal_data`;
                }
              }
            }
          } else {
          }
        } else {
          //获取用户信息失败
        }
      }
    },
    async toggleSetPassWord(ctx, is_show) {
      ctx.commit("toggleSetPassWord", is_show);
    },
    async setTransferRecordDetailCount(ctx) {
      try {
        let res = await api.service.transferRecordDetail_count();
        let redData = res?.data?.data;
        if (redData) {
          ctx.commit("setTransferInfo", {
            toReceive: redData.toReceive, // 待接收
            hasReceived: redData.hasReceived, // 已接收
            hasRefused: redData.hasRefused, // 已拒绝
          });
        }
      } catch (error) {}
    },
  },
  getters: {
    showTransferReceive(state) {
      if (!state.transferOnOff) {
        return false;
      }
      return state.transferInfo.toReceive > 0;
    },
    showTransferRecord(state) {
      let res = false;
      if (!state.transferOnOff) {
        return false;
      }
      if (
        state.transferInfo.toReceive > 0 ||
        state.transferInfo.hasReceived > 0 ||
        state.transferInfo.hasRefused > 0
      ) {
        res = true;
      }

      return res;
    },
  },
  //模块
  modules: {
    chainStore,
  },
});
