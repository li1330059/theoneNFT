
/**
 * 倒计时功能
 * @param {number} cdTime 倒计时时间
 * @param {number} tickTime 倒计时间隔时间，默认1秒
 * @param {function} startCall 开始倒计时
 * @param {function} tickCall 倒计时中回调
 * @param {function} endCall 倒计时结束
 */
class countDown {
    cdFlag = -1; //倒计时标识
    opt = {}; //配置项
    tickTime = 1; //倒计时间隔时间，默认1秒
    pauseFlag = false;
    pauseTime = 0;//
    cdTime=5;
    isCounting = false; //是否倒计时中
    constructor(opt) {
        if (opt) {
            this.opt = opt
            this.start(opt);
        }

    }
    //开始倒计时{cdTime,tickTime,startCall, tickCall, endCall}
    start(opt) {
        var self = this;
        this.opt = opt;
        this.reset();
        self._doCallback(opt.startCall);
        self.isCounting = true;
        doFun();
        //开始倒计时
        self.cdFlag = setInterval(function () {
            doFun();
        }, self.tickTime * 1000);

        function doFun() {
            if (self.pauseFlag) {
                return false;
            }
            self.cdTime--;
            self.pauseTime++;
            self._doCallback(opt.tickCall);
         
            if (self.cdTime == 0) {
                self.stop();
                self._doCallback(opt.endCall);
            }
            return false;
        }
    }
    addCdTime(num){
        this.cdTime+=num;
    }

    //停止倒计时
    stop() {
        this.isCounting = false;
        clearInterval(this.cdFlag);
    }
    //暂停
    pause() {
        this.pauseFlag = true;
        this.pauseTime = 0;
    }
    //继续
    continu() {
        this.pauseFlag = false;
    }
    //重置
    reset() {
        clearInterval(this.cdFlag);
        this.cdTime = this.opt.cdTime || 5;
        this.tickTime = this.opt.tickTime || 1;
        this.pauseFlag = false;
        this.isCounting = false;
        this.pauseTime = 0;
    }
    //判断并执行回调
    _doCallback(callback) {
        if (callback && typeof callback == 'function') {
            callback(this);
        }
    }
    //
};

export default countDown