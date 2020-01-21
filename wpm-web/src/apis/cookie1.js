/**
 * cookie操作
 * 增 删 获取
 */

const setCookie = (name, value, expiresHours) => {

  let cookieString = name + "=" + escape(value);
  if (expiresHours === Infinity) {
    cookieString = cookieString + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  } else {
    //判断是否设置过期时间
    if (expiresHours > 0) {
      // debugger;
      var date = new Date();
      date.setTime(date.getTime() + expiresHours * 60 * 60 * 1000);
      cookieString = cookieString + "; expires=" + date.toGMTString();
    }
  }
  document.cookie = cookieString;
}

const getCookie = (name) => {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const arr = document.cookie.match(reg);
  if (arr) {
    return decodeURIComponent(arr[2]);
  } else {
    return null;
  }
}

const delCookie = ({
  name,
  domain,
  path
}) => {
  if (getCookie(name)) {
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT'
  }
}

export {
  setCookie,
  getCookie,
  delCookie,
}









// set: function (key, value, expireSeconds) {
//   document.cookie = key + '=' + value + ';' + expireSeconds;
// },
// get: function (key) {
//   // cookie 里获取 access_token
//   let strCookie = document.cookie;
//   // 将多cookie切割为多个名/值对
//   let arrCookie = strCookie.split(';');
//   let accessToken;
//   // 遍历cookie数组，处理每个cookie对
//   for (let i = 0; i < arrCookie.length; i++) {
//     let arr = arrCookie[i].split('=');
//     // 找到名称为access_token的cookie，并返回它的值
//     if (key === arr[0].trim()) {
//       accessToken = arr[1];
//       break;
//     }
//   }
//   return accessToken;
// },
// delete: function (key) {
//   let myDate = new Date();
//   myDate.setTime(-100000); // 设置时间
//   document.cookie = key + "=''; expires=" + myDate.toGMTString();
// }
