const BigNumber = require("bignumber.js");

const { initGeetest } = require("./geestest");

deciphering = function (i, e) {
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return i;
};

//时间格式化

Date.prototype.Format = function (fmt) {
  //
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
function fillZero(num, digit) {
  var str = "" + num;
  while (str.length < digit) {
    str = "0" + str;
  }
  return str;
}
String.prototype.byteLength = function () {
  //获取字符串的字节数，扩展string类型方法
  let b = 0,
    l = this.length; //初始化字节数递加变量并获取字符串参数的字符个数
  if (l) {
    //如果存在字符串，则执行计划
    for (var i = 0; i < l; i++) {
      //遍历字符串，枚举每个字符
      if (this.charCodeAt(i) > 255) {
        //字符编码大于255，说明是双字节字符
        b += 2; //则累加2个
      } else {
        b++; //否则递加一次
      }
    }
    return b; //返回字节数
  } else {
    return 0; //如果参数为空，则返回0个
  }
};
const payChannel = {
  balance: "恒信通账户",
  hxt: "恒信通账户",
  baofoo: "宝付账户",
  hy: "汇元账户",
  yb: "易宝账户",
  ll: "连连钱包",
  ybqb: "易宝钱包",
};

module.exports = {
  initGeetest,
  loadScript(cb, obj) {
    if (document.getElementById(obj.id)) {
      cb();
    } else {
      const script = document.createElement("script");
      script.async = true;
      script.src = obj.url;
      script.id = obj.id;
      script.onload = () => {
        cb();
      };
      document.body.appendChild(script);
    }
  },

  randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      a = t.length,
      n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  },
  tranPayChannel(channel) {
    const name = payChannel[channel];
    return name ? name : "";
  },
  formatDate(date, str) {
    if (!date) return "";
    return new Date(date.toString().replace(/-/gi, "/")).Format(
      str ? str : "yy/MM/dd HH:mm:ss"
    );
  },
  formatTime(second) {
    let msg = "";
    let minute = Math.floor(second / 60);
    if (minute > 0) {
      msg = minute + "分";
    }
    if (second % 60 > 0) {
      msg += (second % 60) + "秒";
    }
    return msg;
  },
  formatAddress(value, length) {
    return (
      value.substring(0, length) +
      "..." +
      value.substring(value.length - 4, value.length)
    );
  },
  formatAddressByLengthRange(value, startLength, endLength) {
    return (
      value.substring(0, startLength) +
      "**" +
      value.substring(value.length - endLength, value.length)
    );
  },
  formatMoney(value) {
    return new BigNumber(value || 0).toFormat(2, BigNumber.ROUND_FLOOR, {
      prefix: "¥ ",
      decimalSeparator: ".",
      groupSeparator: ",",
      groupSize: 3,
      secondaryGroupSize: 3,
    });
  },
  formatNum(value) {
    return new BigNumber(value || 0).toFormat(0, BigNumber.ROUND_FLOOR, {
      prefix: "",
      decimalSeparator: ".",
      groupSeparator: ",",
      groupSize: 3,
      secondaryGroupSize: 3,
    });
  },
  formatMoneyNum(value) {
    return new BigNumber(value || 0).times(100);
  },
  moneyFormat2(value) {
    return new BigNumber(value || 0).toFormat(2, BigNumber.ROUND_FLOOR, {
      prefix: "",
      decimalSeparator: ".",
    });
  },
  formatCardNumber(carNumber) {
    if (!carNumber) return;
    return carNumber.replace(/^(\d{4})\d+(\d{4})$/, "$1 **** **** $2");
  },
  formatAliAcount(acount) {
    if (!acount) return;
    let start_num = Math.ceil(acount.length / 2) - 2;
    start_num = start_num >= 0 ? start_num : 0;
    let reg = new RegExp(`^(\\S{${start_num}})\\S+(\\S{4})$`, "ig");
    return acount.replace(reg, "$1 **** $2");
  },
  formatFansNumber(num) {
    return num > 10000 ? (num - (num % 1000)) / 10000 + "W" : num;
  },
  goPage(path, type) {
    if (type && !this.isMobile()) {
      window.open(path, type);
    } else {
      location.href = path;
      // Vue.router.push(path);
      // window.open(path);
      // this.$router.push({
      //   path: path
      // });
    }
  },
  formatStr(value, length) {
    if (value.search(/^0x/gi) == -1) {
      return (
        value.substring(0, length) +
        "..." +
        value.substring(Math.abs(value.length - length), value.length)
      );
    } else {
      return (
        value.substring(0, 6) +
        "..." +
        value.substring(Math.abs(value.length - 4), value.length)
      );
    }
  },

  // 获取登录用户
  getLoginMember() {
    if (localStorage.getItem("THEONE_MEMBER")) {
      return JSON.parse(localStorage.getItem("THEONE_MEMBER"));
    } else {
      return null;
    }
  },
  loginOut() {
    localStorage.removeItem("THEONE_MEMBER");
    localStorage.removeItem("authorization");
    localStorage.removeItem("THEONE_USER");
    localStorage.removeItem("VERIFY-LIST-V2");
  },
  isMobile() {
    let flag = navigator.userAgent.match(
      /(phone|midp|rv:1.2.3.4|ucweb|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag;
  },
  browserIsWeChat() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    }
    return false;
  },
  checkPhoneNumber(phone) {
    /**
     * 检查国内手机号是否正确
     * @params {number} phone 手机号
     * @return {boolean}
     */
    if (!/^1[3456789]\d{9}$/.test(phone)) {
      return false;
    } else {
      return true;
    }
  },
  checkUserPassword(password) {
    /**
     * 检查用户密码是否合规(英文数字下划线)
     * @return {boolean}
     */
    if (password && password.toString().search(/^[a-zA-Z0-9_]+$/) !== -1) {
      if (password.length >= 8) {
        return true;
      }
    }
    return false;
  },

  getQueryString(name) {
    /**
     * 获取url参数
     * @params {string} 参数名
     * @return {string|null}
     */
    var reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  },
  uniqueAry(arr, key) {
    let map = new Map();
    let array = new Array(); // 数组用于返回结果
    for (let i = 0; i < arr.length; i++) {
      if (map.has(arr[i][key])) {
        // 如果有该key值
        map.set(arr[i][key], true);
      } else {
        map.set(arr[i][key], false); // 如果没有该key值
        array.push(arr[i]);
      }
    }
    return array;
  },
  randomNumBoth(Min, Max) {
    //在某个范围内随机取值
    //min<=r<=max
    const Range = Max - Min;
    const Rand = Math.random();
    const num = Min + Math.round(Rand * Range); //四舍五入
    return num;
  },

  //将秒数转换为天时分秒格式

  setSeconds(s) {
    var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
    return [
      fillZero(day, 2),
      fillZero(hour, 2),
      fillZero(minute, 2),
      fillZero(second, 2),
    ];
  },
};
