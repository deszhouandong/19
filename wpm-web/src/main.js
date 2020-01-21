// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Calendar from 'vue-mobile-calendar' // 日期插件
import './assets/sass/global.scss'
import {
  getCookie,
} from './apis/cookie1'
import config from '../package.json'

// import './assets/sass/reset.css'

// 获取电脑的用户名
// import {getname} from '@/assets/js/getEquipment'
// 适配插件
import 'lib-flexible/flexible.js'
// import moment from "moment";
// import dateList from '@/component/dateList'
// Vue.component('dateList', dateList)


if (process.env.NODE_ENV != 'production') {
  // 控制台按钮
  const Vconsole = require('vconsole')
  new Vconsole();

  // mocks数据
  require("./mock")
}

//MD5加密
import md5 from 'js-md5';

// 移动端300ms延迟
// import FastClick from 'fastclick'

// FastClick.attach(document.body);

// import cookieOperation from "@/apis/cookie";
// Vue.prototype.$cookieOperation = cookieOperation;
// Vue.use(cookieOperation)

import getData from './apis/getData';
Vue.prototype.$getData = getData
// import _ from 'lodash'
// Vue.prototype._ = _
// 注册全局工具函数
import * as commonUtils from './utils/';
Vue.prototype.commonUtils = commonUtils

// vant
import Vant from 'vant';
import 'vant/lib/index.css';


//VeeValidate form校验
import Vuerify from '@/component/vuerify'
Vue.use(Vuerify)

Vue.use(Vant);

import { Lazyload } from 'vant';
Vue.use(Lazyload);// options 为可选参数，无则不传
Vue.use(Calendar); // 日期插件

// Vue.use(wx)
// 获取电脑的用户名
// Vue.prototype.getmsg = getname();
// Vue.use(moment);
// Vue.prototype.$moment = moment;

//MD5加密
Vue.prototype.$md5 = md5;



import moment from 'moment' //导入文件
// import 'moment/locale/zh-cn'
Vue.prototype.$moment = moment; //赋值使用

// sentry监控
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
Vue.prototype.Sentry = Sentry;
if (process.env.NODE_ENV != 'development') {
  Sentry.init({
    // dsn: 'https://909407cf2f2243fd8e0f409098546a97@sentry.io/1855924',
    dsn: 'https://716acf601a034b98ab555aac29195e87@sentry.io/1865996',
    integrations: [new Integrations.Vue({
      Vue,
      attachProps: true,
      logErrors: true,
    })],
    environment: process.env.NODE_ENV,
    release: config.version,
  });
  Sentry.configureScope((scope) => {
    scope.setUser({
      // id: '1',
      username: getCookie('accountName'),
      // ip_address: '127.0.0.1', //设置会覆盖设备ip
      // email: 'test.doe@example.com',
    });

  });
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
