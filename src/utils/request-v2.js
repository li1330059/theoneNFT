/**
 * 统一请求封装v2
 * @author nice
 * @date 2021-11-24
 * @version v1
*/
import axios from 'axios';
import { MessageBox } from "element-ui";
let messageAlert = null;
const getToken = () => {
    return localStorage.getItem("authorization");
};
//构建axios请求基础
const request = axios.create({
    baseURL: '',//api host：api的请求基础地质
    timeout: 1000 * 10,// 超时时间ms
    withCredentials: false,
    headers: {
        authorization: getToken()
    }
});
//请求拦截
request.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.authorization = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
//响应拦截
request.interceptors.response.use((response) => {
    switch (Number(response.data.code)) {
        //服务器状态
        
        case 401:
            if (response.config.url.search(/queryByUserUuid/g) === -1) {
                //排除获取用户信息接口(讲道理这个接口不应该返回401)
                const redirect = `${window.location.href}`
                
                window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
                localStorage.removeItem("THEONE_MEMBER");
                localStorage.removeItem("authorization");
                localStorage.removeItem('THEONE_USER');
            };
            break;
    }
    return response;
}, (error) => {
    return Promise.reject(error);// 返回接口返回的错误信息
});

//请求方法的构建,type为：get、post、delete等等
const createRequestFuc = (type) => {
    return function (url, params, error_tip, isCustom, success, error) {//请求地址和请求参数
        //返回请求的Promise的对象
        return new Promise((resolve, reject) => {
            request[type](url, params)
                .then(res => {
                    if (res && res.status == 200) {
                        resolve(res.data);
                    } else {
                        resolve({
                            data: false,
                            code: 503,
                            errorCode: 10000,
                            message: '服务异常'
                        });
                    }
                })
                .catch((err) => {
                    //这种情况一般是请求失败
                    if (!messageAlert && !isCustom) {
                        // messageAlert = MessageBox.alert("数据去外星了，请刷新网页把数据拉回来~~~", {
                        //     confirmButtonText: "确定",
                        //     callback: action => {
                        //         messageAlert = null;
                        //     }
                        // });
                    }
                    resolve({
                        data: false,
                        code: 503,
                        errorCode: 10001,
                        message: '服务异常'
                    });
                });

        });
    }
};

export const $get = createRequestFuc('get');
export const $put = createRequestFuc('put');
export const $post = createRequestFuc('post');
export const $patch = createRequestFuc('patch');
export const $delete = createRequestFuc('delete');

export default {
    $get,
    $put,
    $post,
    $patch,
    $delete,
};