import JSEncrypt from "jsencrypt";
import Encrypt from "encryptlong";
const publicKey = process.env.VUE_APP_PUBLIC_KEY;
 


export default {
  /* JSEncrypt加密 */
  rsaPublicData(data) {
    var jsencrypt = new JSEncrypt();
    jsencrypt.setPublicKey(publicKey);
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    var result = jsencrypt.encrypt(data); 
    return result;
  },
  /* JSEncrypt解密 */
  rsaPrivateData(data) {
    var jsencrypt = new JSEncrypt();
    jsencrypt.setPrivateKey(privateKey);
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    var result = jsencrypt.encrypt(data);
    return result;
  },
  /* 加密 */
  encrypt(data) {
    const PUBLIC_KEY = publicKey;
    var encryptor = new Encrypt();
    encryptor.setPublicKey(PUBLIC_KEY);
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    const result = encryptor.encryptLong(data); 
    return result;
  },
  /* 解密 - PRIVATE_KEY - 验证 */
  decrypt(data) {
    const PRIVATE_KEY = privateKey;
    var encryptor = new Encrypt();
    encryptor.setPrivateKey(PRIVATE_KEY);
    // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
    var result = encryptor.decryptLong(JSON.stringify(data));
    return result;
  }
};
