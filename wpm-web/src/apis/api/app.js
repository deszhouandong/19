import {
  Config
} from '@/apis/env.js'
import fetch from '@/apis/fetch'

// 获取验证码
const sendPhoneCode = (params) => {
  params.baseURL = Config.baseUrlApp;
  params.url = '/phone/sendPhoneCode'
  return fetch(params)
}
// 登陆
const login = (params) => {
  params.baseURL = Config.baseUrlApp;
  params.url = '/phone/login'
  return fetch(params)
}
// 自动打卡
const addDeviceInfo = (params) => {
  params.baseURL = Config.baseUrlWps;
  params.url = '/api/gaode/addDeviceInfo'
  return fetch(params)
}
// 自动打卡
const getCurrentDeviceStatus = (params) => {
  params.baseURL = Config.baseUrlWps;
  params.url = '/api/gaode/getCurrentDeviceStatus'
  return fetch(params)
}
export {
  sendPhoneCode,
  login,
  addDeviceInfo,
  getCurrentDeviceStatus
}
