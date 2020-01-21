import CryptoJS from 'crypto-js'
export default { //加密
  encrypt(word, keyStr) {
    keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
    var key = CryptoJS.enc.Utf8.parse(keyStr); //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  UrlSearch() {
    let name, value, str = location.href,
      num = str.indexOf("?"); //取得整个地址栏
    str = str.substr(num + 1); //取得所有参数 stringvar.substr(start [, length ]
    let arr = str.split("&"); //各个参数放到数组里
    for (let i = 0; i < arr.length; i++) {
      num = arr[i].indexOf("=");
      if (num > 0) {
        name = arr[i].substring(0, num);
        value = arr[i].substr(num + 1);
        this[name] = value;
      }
    }
  }
}
