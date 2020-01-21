export default {
  email: {
    test: /.+@.+\..+/,
    message: '邮箱格式错误'
  },
  required: {
    // test: /\S+/,
    test: function (obj) {
      var result = true;
      /*进行校验*/
      switch (obj) {
        case undefined:
        case null:
          result = false;
          break;
      }
      if (result) {
        if (String(obj).replace(/\s+/g, "") == "") {//空字符串校验
          result = false;
        }
      }
      return result;
    },
    message: '必填项'
  },
  url: {
    test: /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[:?\d]*)\S*$/,
    message: 'URL 格式错误'
  }
}
