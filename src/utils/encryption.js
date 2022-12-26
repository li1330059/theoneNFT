/**
 * 加密/解密
 */
import service from "@/api/index";
import CryptoJS from "crypto-js";
import aes from "@/utils/aes";
import JSEncrypt from "jsencrypt";
import Encrypt from "encryptlong";
class Encryption {
    static async getPassword(password) {
        let pubKeyRes = await service.service.config_getConfigByType({
            type:3
        });
        console.log(pubKeyRes);
        if (pubKeyRes && pubKeyRes.data.code == 200) {
            const publicKey = pubKeyRes.data.data.confValue1
            var jsencrypt = new JSEncrypt();
            jsencrypt.setPublicKey(publicKey);
            // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
            var result = jsencrypt.encrypt(password);
            return result;
        } else {
            return false;
        }
    }
    static lin() {
        const key = "weiyi@123456";
        const enPassword = CryptoJS.HmacSHA256(`${password}`, key);
        const enPasswordStr = CryptoJS.enc.Hex.stringify(enPassword);
        return enPasswordStr

    }

};

export default Encryption