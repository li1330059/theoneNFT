import MobileDevice from './device'
import CallApp from 'callapp-lib'
// callapp-lib 的选项配置
const option = {
    scheme: {
        protocol: 'weiyi'
    },
    appstore: 'https://www.theone.art/app_download/3d', // ios
    yingyongbao: '', // 微信
    fallback: 'https://www.theone.art/app_download/3d', // 下载链接
    timeout: 2000,

};
const callLib = new CallApp(option);
export const messageHandler = (fnName, msg) => {
    try {
        const iosCtx = window.webkit;
        if (iosCtx && iosCtx.messageHandlers && iosCtx.messageHandlers[fnName]) {
            iosCtx.messageHandlers[fnName].postMessage(msg ? msg : null);
        } else {
            console.warn(`fn:iosMessageHandlers [${fnName}] is not a function`);
        }
    } catch (e) {
        console.error(e, "fn:iosMessageHandlers err");
    }
};

class Ios extends MobileDevice {
    constructor(setting) {
        super(setting)
    }
    callApp(path) {
        return callLib.open({
            path: path ? path : 'theone.art'
        });
    }

}
const ios = new Ios({
    type: 'ios',
    messageHandler: messageHandler
});

export default ios;