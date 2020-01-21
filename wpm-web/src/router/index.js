import Vue from 'vue'
import Router from 'vue-router'
import moment from 'moment'
import {
  setCookie,
  getCookie,
  delCookie,
} from '@/apis/cookie1'
import wx from "weixin-js-sdk"; // 引入企业微信的sdk
import getData from '../apis/getData'
import {
  getIsApp,
  isShare,
  getUrlparams
} from '@/utils/env'
import store from '../store'
import * as Sentry from '@sentry/browser';
// 导入路由
import app from '@/router/routes/app'
import punch from '@/router/routes/punch'
import guestDirectory from '@/router/routes/guestDirectory'
import workPlan from '@/router/routes/workPlan'
import marketingManagement from '@/router/routes/marketingManagement'
import action from '@/router/routes/action'
import meeting from '@/router/routes/meeting'
Vue.use(Router)

const router = new Router({
  routes: [
    ...app,
    ...punch,
    ...guestDirectory,
    ...workPlan,
    ...marketingManagement, //出差招待
    ...action, //关键动作
    ...meeting,
  ]
});


router.beforeEach((to, from, next) => {
 // 判断是否需要鉴定篡改系统时间的页面
  const notTimeCheck = to.matched.some((item, index) => {
    return item.meta.notTimeCheck
  })
  if(process.env.NODE_ENV === 'production'){

  if (!notTimeCheck) {
    getData
      .timeCheck({
        method: "post",
        headers: {
          'Authorization': null
        },
        data: {
          frontTime: new Date()
          // frontTime: moment().add(1, 'days')._d
        }
      }).then((res) => {}).catch((err) => {
        //frontTime-前端当前时间   currDate-系统当前时间
        if (err.data) {
          const {
            currDate,
            frontTime
          } = err.data
          next(`/abnormalClock?currDate=${moment(currDate).valueOf()}&frontTime=${moment(frontTime).valueOf()}`)
        }
      })
  }
}
if(isShare())return next(); //是分享出去的不获取信息
// setCookie('access_token','ed873bed-9b0e-41cd-b1e3-aff11439c8e6',24*7)
  if (getIsApp()) {
    const access_token = getCookie('access_token');
    if (access_token) {
      next()
    } else {
      if (to.path == '/app/login') {
        next()
      } else {
        next('/app/login')
      }
    }
  } else {
    // let url = window.location.href.split("#")[0];
    // console.log(url);

    // getData
    //   .getConfig({
    //     method: "post",
    //     data: {
    //       url: url
    //     },
    //     headers: {
    //       'Authorization': null
    //     }
    //   })
    //   .then(res => {
    //     if (res&&res.code == 200) {
    //       wx.config({
    //         beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //         appId: res.data.appId, // 必填，企业微信的corpID
    //         timestamp: res.data.timestamp, // 必填，生成签名的时间戳
    //         nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
    //         signature: res.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
    //         jsApiList: [
    //           // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    //           "getLocation", // 获取地理位置接口
    //           "checkJsApi",
    //           "hideAllNonBaseMenuItem"
    //         ]
    //       });
    //       wx.error(function (res) {
    //         console.log(res);
    //         Sentry.captureException(res)
    //       });
    //       wx.ready(function () {
    //         wx.hideAllNonBaseMenuItem()
    //       })
    //     }
    //   })
    // 判断需要鉴权的页面
    const notRequireAuth = to.matched.some((item, index) => {
      return item.meta.notRequireAuth
    })
    if (notRequireAuth) {
      next()
    } else {
      const access_token = getCookie('access_token');
      if (access_token) {
        next()
      } else {
        const {search,hash}=getUrlparams()
        if (search&&search.code||hash&&hash.code) {
          getData.wechatLogin({
            method: 'post',
            data: {
              code:search&&search.code||hash&&hash.code
            }
          }).then((res) => {
            if (res.code == 200) {
              const {
                access_token,
                refresh_token,
                username
              } = res.data
              setCookie('access_token', access_token, 24*7)
              setCookie('refresh_token', refresh_token, 24 * 30)
              setCookie('accountName', username, 24*7)
              // next()
              store.commit('ADD_ACCESS_TOKEN',access_token)
              window.location.reload()
            }
          })
        } else {
          getData.getWeChatUrl({
            method: 'post',
            data: {
              redirectUri: window.location.href
            },
            headers: {
              'Authorization': null
            }
          }).then((res) => {
            if (res.code === 200) {
              const {
                weChatUri
              } = res.data
              window.location.href = weChatUri
            }
          })
        }
        /**
         * @require 构造企业微信网页授权链接,拿取code
         * @link  必填，https://work.weixin.qq.com/api/doc#90000/90135/91022
         * @appid 必填，企业的CorpID
         * @redirect_uri 必填，授权后重定向的回调链接地址，请使用urlencode对链接进行处理
         * @response_type 必填，返回类型，此时固定为：code
         * @scope 必填，应用授权作用域。企业自建应用固定填写：snsapi_base
         * @state 非必填 重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值，长度不可超过128个字节
         * @#wechat_redirect	必填，终端使用此参数判断是否需要带上身份信息
         * @result 员工点击后，页面将跳转至 redirect_uri?code=CODE&state=STATE，企业可根据code参数获得员工的userid。code长度最大为512字节。
         */
        // const appid='wxdd725338566d6ffe'
        // const redirect_uri=encodeUR('')
        // const qiyeApi='https://open.weixin.qq.com/connect/oauth2/authorize?appid=CORPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'

        // next()

      }
    }
  }
})



export default router;
