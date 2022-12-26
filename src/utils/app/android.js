import MobileDevice from './device'
import CallApp from 'callapp-lib'

// callapp-lib 的选项配置
const option = {
    scheme: {
        protocol: 'weiyi'
    },
    appstore: 'https://www.theone.art/app_download/3d',
    yingyongbao: 'https://www.theone.art/app_download/3d', // 微信
    fallback: 'https://www.theone.art/app_download/3d', // 下载链接
    timeout: 2000,
};
const callLib = new CallApp(option);

/*
*调用安卓的api
*@param {string} fnName 由安卓端给出回调函数名
*@param {string} msg 发送给安卓的消息，如果是对象需要转换成JSON字符串
*/
// { [key: string]: unknown }
export const messageHandler = (fnName, msg) => {
    try {
        const androidCtx = window.TheOne;
        if (androidCtx && androidCtx[fnName] instanceof Function) {
            androidCtx[fnName](msg ? JSON.stringify(msg) : null);//msg ? JSON.stringify(msg) : null
        } else {
            alert(`fn:androidMessageHandlers [${fnName}] is not a function`);
            console.warn(`fn:androidMessageHandlers [${fnName}] is not a function`);
        }
    } catch (e) {
        console.error(e, "fn:androidMessageHandlers err");
    }
};



class Android extends MobileDevice {
    constructor(setting) {
        super(setting)
    }
    callApp(path) {
        return callLib.open({
            path: path ? path : 'theone.art'
        });
    }


}
const android = new Android({
    type: 'android',
    messageHandler: messageHandler
});
export default android;