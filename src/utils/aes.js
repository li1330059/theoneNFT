import CryptoJS from "crypto-js";

export default {
  encrypt(word) {
    var key = CryptoJS.enc.Base64.parse(e);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  encryptSelf(id, sum) {
    var key = CryptoJS.enc.Base64.parse(e);
    let word =JSON.stringify({ id: id.substr(0,id.length-1), sum: sum });
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }); 
    return encrypted.toString();
  },
  decrypt(word) {  
    var key = CryptoJS.enc.Base64.parse(d);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });   
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }
};
