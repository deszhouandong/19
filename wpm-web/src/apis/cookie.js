export default {
      /**
       * cookie操作
       * 增 删 获取
       */
      cookie: {
        set: function (key, value, expireSeconds) {
          document.cookie = key + '=' + value + ';' + expireSeconds;
        },
        get: function (key) {
          // cookie 里获取 access_token
          let strCookie = document.cookie;
          // 将多cookie切割为多个名/值对
          let arrCookie = strCookie.split(';');
          let accessToken;
          // 遍历cookie数组，处理每个cookie对
          for (let i = 0; i < arrCookie.length; i++) {
            let arr = arrCookie[i].split('=');
            // 找到名称为的cookie，并返回它的值
            if (key === arr[0].trim()) {
              accessToken = arr[1];
              break;
            }
          }
          return accessToken;
        },
        delete: function (key) {
          let myDate = new Date();
          myDate.setTime(-100000); // 设置时间
          document.cookie = key + "=''; expires=" + myDate.toGMTString();
        }
      }
    };