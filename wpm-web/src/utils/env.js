/**
 * 判断是微信环境/企业微信环境/其他
 */
const getWxClient = function () {
  let wxenv = '';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    if (ua.match(/wxwork/i) == 'wxwork') {
      wxenv = 'wxwork'
    } else {
      wxenv = 'wx'
    }
  } else {
    wxenv = 'other'
  }
  return wxenv;
};
/**
 * 判断是否在app壳子中
 */
const getIsApp = function () {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("shell-android") > -1 || ua.indexOf("shell-ios") > -1) {
    return true
  } else {
    return false
  }
}
/**
 * 获取当前环境具体信息
 */
const getTerminal = function () {
  const ua = navigator.userAgent.toLowerCase();
  let terminalEnv = '';
  if (ua.indexOf("shell-android") > -1) {
    // 安卓壳子
    terminalEnv = 'shell-android'
  } else if (ua.indexOf("shell-ios") > -1) {
    // ios壳子
    terminalEnv = 'shell-ios'
  } else if (ua.indexOf('android') > -1 || ua.indexOf('linux') > -1) {
    // 安卓环境（非壳子）
    terminalEnv = 'android'
  } else if (ua.indexOf('iphone') > -1) {
    // ios手机(非壳子)
    terminalEnv = 'iphone'
  }
  return terminalEnv
}
/**
 * 获取当前环境url
 */
const getCurrentEnvUrl = function (path) {
  let prefix;
  const environment = process.env.NODE_ENV
  const wps = path === 'wps' ? 'wps-vue' : ''
  switch (environment) {
    case "test":
      prefix = `http://a.fehorizon.com/HXJFwpsTEST/${wps}#/`;
      break;
    case "production":
      prefix = `http://hxjf.fehorizon.com/${wps}#/`;
      break;
    default:
      prefix = `localhost:8080/#/`;
      break;
  }
  return prefix;
}
/**
 * 获取地址栏的hash参数和search参数
 */
const getUrlparams = () => {
  let save = {};
  const arr = [{
      key: "hash",
      content: window.location.hash.split("?")[1],
      params: {}
    },
    {
      key: "search",
      content: window.location.search.substr(1),
      params: {}
    }
  ];
  arr.map(function (item, index) {
    item.params = {};
    if (item.content) {
      item.content.split(/&/g).forEach(function (itemInner) {
        item.params[(itemInner = itemInner.split("="))[0]] = itemInner[1];
      });
      save[item.key] = item.params;
    }else{
      save[item.key]={}
    }
  });
  return save;
};
/**
 * 获取地址栏的hash参数和search参数
 */
const isShare = () => {
  const { search,hash } = getUrlparams();
  return hash&&hash.shareType == "1";
};
/**
 * 判断当前环境是否是手机
 */
const getIsPhone = ()=> {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}
export {
  getWxClient,
  getIsApp,
  getTerminal,
  getCurrentEnvUrl,
  getUrlparams,
  isShare,
  getIsPhone

}
