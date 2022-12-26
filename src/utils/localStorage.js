/**
 * 统一设置localStorage并添加过期时间
 * @param {expires 过期时间ms}
 */
const $localStorage = {
  setItem(key, val, expires) {
    let obj = {
      val: val,
      expires: expires || 0,
      createTime: new Date().getTime(),
    };
    localStorage.setItem(key, JSON.stringify(obj));
  },
  getItem(key) {
    let obj = localStorage.getItem(key);
    try {
      obj = JSON.parse(obj);
    } catch (error) {
      console.log(`ERROR:localStorage.getItem(${key})-${error}`);
      obj = obj;
    }
    const type = Object.prototype.toString.call(obj);
    if (type == "[object Object]" && obj.expires) {
      const now = new Date();
      if (now.getTime() > obj.expires + obj.createTime) {
        localStorage.removeItem(key);
        console.log(`localStorage.getItem(${key}) 过期！`);
        return null;
      } else {
        return obj.val;
      }
    } else {
      return obj;
    }
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
};
export default $localStorage;
