import store from "../store";
require('./gt4.js');
import {
    request
} from "@/utils/request";
import Vue from "vue";
import {
    MessageBox
} from "element-ui";
//同一时间只能存在一个实例；
let DISABLED = false;
async function initGeetest(config) {
    if (DISABLED) {
        return
    }
    console.log(store.state.user_info);
    if (JSON.stringify(store.state.user_info) !== '{}') {
        //登录后，展示行为验证码前调取该接口进行判断
        const res = await Vue.prototype.$api.service.behaviorVerify_userNeedDisplay();
        if (res.data.code == 200 && res.data.data.status == 1) {
            console.log(res.data.data);
            geetest(config)
            return;
        } else {
            DISABLED = false;
            config.success();
        }


    } else {
        geetest(config)
    }



}
function geetest(config) {
    console.log('执行');
    DISABLED = true;
    let geetestAry = [...store.state.geetestAry];
    const captchaIdx = geetestAry.findIndex(item => item.config.id == config.id);
    if (captchaIdx != -1) {
        //此id已经生成过只调用show
        const captchaInfo = geetestAry[captchaIdx];
        DISABLED = false;
        console.log(captchaInfo);
        if (captchaInfo.isReset) {

            captchaInfo.captchaObj.showCaptcha();
            geetestAry[captchaIdx].isReset = false;
            store.commit('setGeetestAry', geetestAry)
        } else {
            captchaInfo.captchaObj.showCaptcha();
        }

        return;
    }
    //没有调用过销毁之前生成的然后重新执行load

    geetestAry.forEach(item => {
        item.captchaObj.destroy();
    })
    store.commit("resetGeetestAry");

    console.log('执行load');
    initGeetest4(
        {
            captchaId: "a3648527042a68ca58c8ea384483c9b9",
            product: "bind",
            hideSuccess: true,
            hideBar: ['close'],
            timeout: 5000,
            mask: {
                outside: false,
            }
        },
        function (captchaObj) {
            captchaObj
                .onNextReady(function () {
                    captchaObj.showCaptcha();
                    console.log('ready');
                    DISABLED = false;
                    //拼图失败重新触发此方法
              
                    store.commit("addGeetestAry", {
                        captchaObj,
                        config,
                        isReset: false,
                    });
                })
                .onSuccess(function () {
                    const successRes = captchaObj.getValidate();
                    store.commit("setGeetestParams", successRes);
                    config.success(captchaObj);
                })
                .onError(function (errorObj) {
                    MessageBox.alert("验证失败！请刷新页面重试", {
                        confirmButtonText: "确定",
                        callback: action => {
                            messageBox = null;
                        }
                    });
                }).onClose(function () {

                });
        }
    );
}
export {
    initGeetest
}