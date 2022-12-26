import axios from "axios";
import Cookie from "js-cookie";
const { initGeetest } = require("./geestest");
import App from "@/utils/app/index";
import { MessageBox } from "element-ui";
import { getQueryString } from "./common";
import rsa from "./rsa";
import store from "../store";

function checkApi(api) {
  const AUTH_API = store.state.behaviorVerifyList;
  for (let i = 0; i < AUTH_API.length; i++) {
    if (api.search(AUTH_API[i]) !== -1) {
      return AUTH_API[i];
    }
  }
  return false;
}
axios.defaults.timeout = 10000;
let messageAlert = null;
// 认证类型
const AUTH_TYPE = {
  BEARER: "Bearer",
  BASIC: "basic",
  AUTH1: "auth1",
  AUTH2: "auth2",
};
// http method
const METHOD = {
  GET: "get",
  POST: "post",
  PUT: "put",
};

//自动给同一个vue项目的所有请求添加请求头
axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem("authorization");
  if (token && token != "undefined") {
    if (App.browser.theone.isTheOne) {
      config.headers["Authorization"] = token;
    } else {
      config.headers["authorization"] = token;
    }
  }
  /*   config.headers["platform"] = App.browser.os.ios ? "iOS" : "Android";
  config.headers["deviceUuid"] = App.browser.theone.deviceId || "112211111"; */
  if (App.browser.theone.isTheOne) {
    config.headers["platform"] = App.browser.os.ios ? "iOS" : "Android";
    config.headers["deviceUuid"] = App.browser.theone.deviceId;
  } else {
  }
  return config;
});
let timer = null;
let isGet = false;
let count = 0;
async function delayTime() {
  clearInterval(timer);
  return new Promise((resolve, reject) => {
    // return / await 等待执行完
    timer = setInterval(() => {
      count++;
      if (isGet) {
        resolve("延迟");
        isGet = false;
        count = 0;
        clearInterval(timer);
      }
    }, 500);
  });
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params, config) {
  const api = checkApi(url);
  if (api) {
    console.log(`需要验证的接口：${api}`);
    initGeetest({
      success: () => {
        isGet = true;
      },
      id: api,
      api,
    });
    console.log("开始");
    await delayTime();
    console.log("结束");
  }

  switch (method) {
    case METHOD.GET:
      return axios.get(url, {
        params,
        ...config,
      });
    case METHOD.POST:
      let c = config;
      if (params && params.sig) {
        if (!c) {
          c = {
            headers: {},
          };
        }
        c.headers["sig"] = encodeURIComponent(params.sig);
      }
      return axios.post(url, params, c);
    case METHOD.PUT:
      return axios.put(url, params, config);
    default:
      return axios.get(url, {
        params,
        ...config,
      });
  }
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      break;
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
    case AUTH_TYPE.BASIC:
    case AUTH_TYPE.AUTH1:
    case AUTH_TYPE.AUTH2:
    default:
      break;
  }
  return false;
}

//请求拦截
axios.interceptors.request.use(
  (config) => {
    store.commit("setApi", {
      api: config.url,
      status: "start",
    });
    if (checkApi(config.url)) {
      config.headers["behaviorVerify"] =
        JSON.stringify(store.state.geetestParams) == "{}"
          ? ""
          : JSON.stringify(store.state.geetestParams);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//响应拦截
axios.interceptors.response.use(
  (response) => {
    switch (Number(response.data.code)) {
      //服务器状态
      case 401:
      case 405:
        if (
          App.browser.theone.isTheOne &&
          response.config.url.search(/userAttribute\/userInfo/g) === -1
        ) {
          App.$methods.loginExpire();
          return;
        } else {
        }
        if (response.data.code == 405 && !messageAlert) {
          messageAlert = MessageBox.alert(
            "系统检测到您的登陆环境发生变化，为保障您的账户安全，请重新登陆。",
            {
              confirmButtonText: "确定",
              callback: (action) => {
                messageAlert = null;
              },
            }
          );
        }
        if (response.config.url.search(/userAttribute\/userInfo/g) === -1) {
          //排除获取用户信息接口(讲道理这个接口不应该返回401)
          const redirect = `${window.location.href}`;
          window.location.href = `/login?redirect=${encodeURIComponent(
            redirect
          )}`;
          localStorage.removeItem("THEONE_MEMBER");
          localStorage.removeItem("authorization");
          localStorage.removeItem("THEONE_USER");
          localStorage.removeItem("VERIFY-LIST-V2");
        }
        break;
    }

    if (Number(response.data.code) == 1011) {
      localStorage.removeItem("VERIFY-LIST-V2");
      store.dispatch("getBehaviorVerify");
    }
    const authApi = checkApi(response.config.url);

    if (Number(response.data.code) == 200) {
      store.commit("setApi", {
        api: response.config.url,
        status: "over",
        info: response.data,
      });

      if (authApi) {
        console.log(`需要验证的接口响应拦截：${authApi}`);
        //如果如果成功销毁实例
        if (store.state.geetestAry) {
          const geetestIdx = store.state.geetestAry.findIndex(
            (item) => item.config.api == authApi
          );
          const geetestInfo1 = store.state.geetestAry[geetestIdx];
          if (geetestInfo1) {
            geetestInfo1.captchaObj.destroy();
            store.commit("removeGeetest", geetestIdx);
          }
        }
        console.log(store.state.geetestAry);
      }
    } else {
      if (authApi) {
        console.log(`需要验证的接口响应拦截：${authApi}`);
        //如果错误更改为重置状态
        if (store.state.geetestAry) {
          let geetestAry = [...store.state.geetestAry].map((item) => {
            if (item.config.api == authApi) {
              item.isReset = true;
            }
            return item;
          });
          store.commit("setGeetestAry", geetestAry);
        }
      }
      if (Number(response.data.code) == 1000) {
        store.commit("setApi", {
          api: response.config.url,
          status: "over",
          info: response.data,
        });
      } else {
        store.commit("setApi", {
          api: response.config.url,
          info: response.data,
          status: "error",
        });
      }
    }
    return response;
  },
  (error) => {
    //连接异常
    return Promise.reject(error);
  }
);

export {
  METHOD,
  AUTH_TYPE,
  request,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
};
