import {
  Config
} from './env.js'
import fetch from './fetch'
import * as punch from './api/punch';
import * as app from './api/app';
import * as meetingApi from './api/meetingApi';
import * as workPlanApi from './api/workPlanApi';
// import * as guestDirectory from './api/guestrecord';
import * as marketingManagementApi from './api/marketingManagementApi';
import * as actionApi from './api/actionApi';
let getData = {
  ...punch, //考勤接口
  ...app, //app登陆接口
  // ...guestDirectory, // 访客记录接口
  ...meetingApi,//会议管理项目请求
  ...workPlanApi, // 工作计划请求
  ...marketingManagementApi, //出差招待接口
  ...actionApi, //关键动作接口
  //待办总条数
  // clueFlowCount(params) {
  //  params.url = '/api/saas/activiti/clueFlowCount'
  //  return fetch(params)
  // },
  // 检测是否更改系统时间
  timeCheck(params) {
    params.baseURL = Config.baseUrlWps;
    params.url = '/users-anon/timeCheck'
    return fetch(params)
  },
  // 上班打卡
  punchClock(params) {
    params.url = '/punchClock'
    return fetch(params)
  },
  //打卡考勤默认加载
  attendanceInfoLoading(params) {
    params.url = '/attendanceInfoLoading'
    return fetch(params)
  },
  //获取企业微信信息
  getConfig(data) {
    data.url = '/getConfig'
    data.baseURL = Config.baseUrlWx;
    return fetch(data)
  },
  //重复打卡
  againPunchClock(params) {
    params.url = '/againPunchClock'
    return fetch(params)
  },
  //考勤查看
  checkinInfo(params) {
    params.url = '/checkinInfo'
    return fetch(params)
  },
  //异常确认
  checkinConfirm(params) {
    params.url = '/checkinConfirm'
    return fetch(params)
  },
  //考勤确认
  attendanceConfirm(params) {
    params.url = 'attendanceConfirm'
    return fetch(params)
  },
  //异常考勤确认
  appealConfirm(params) {
    params.url = 'appealConfirm'
    return fetch(params)
  },
  //考勤申诉提交
  appealSubmit(params) {
    params.url = 'appealSubmit'
    return fetch(params)
  },
  //在线考勤地图
  attendanceMap(params) {
    params.url = 'attendanceMap'
    return fetch(params)
  },
  // 单个员工异常考勤记录
  individualAbnormalRecordsList(params) {
    params.url = 'individualAbnormalRecordsList'
    return fetch(params)
  },
  //待确认考勤次数-团队
  unconfirmedList(params) {
    params.url = 'unconfirmedList'
    return fetch(params)
  },
  // 异常考勤-团队
  abnormalAttendanceList(params) {
    params.url = "abnormalAttendanceList"
    return fetch(params)
  },
  // 单个员工考勤记录
  NextLevelAttendanceRecords(params) {
    params.url = 'NextLevelAttendanceRecords'
    return fetch(params)
  },
  //单个员工考勤记录-地图
  individualCardingRecords(params) {
    params.url = 'individualCardingRecords'
    return fetch(params)
  },
  //单个员工待确认考勤记录(月)
  unconfirmedRecordsList(params) {
    params.url = 'unconfirmedRecordsList'
    return fetch(params)
  },
  //异常考勤确认
  abnormalConfirm(params) {
    params.url = 'abnormalConfirm'
    return fetch(params)
  },
  //获取当前前用户的信息
  getCurrent(params) {
    params.url = '/api/saas/user/getAccAndNameByToken'
    params.baseURL = Config.baseUrlSaas;
    return fetch(params)
  },
  // 微信登录
  wechatLogin(params) {
    params.url = '/sys/wechat/login'
    params.baseURL = Config.baseUrlToken;
    return fetch(params)
  },
  // 获取微信拼接code地址
  getWeChatUrl(params){
    params.url = '/api-cen/api/wechat/getWeChatUrl'
    params.baseURL = Config.baseUrlToken;
    return fetch(params)
  },
  // 刷新登录
  refreshLogin(params) {
    params.url = '/sys/refresh_token'
    params.baseURL = Config.baseUrlToken;
    return fetch(params)
  },
  //查看工作计划与回顾
  selOneDayPlan(params) {
    params.url = '/wps/workPlan/selOneDayPlan'
    params.baseURL = Config.baseUrlWps;
    return fetch(params)
  },
  // 分享图片压缩
uploadImg(params){
  params.url = '/wps/file/uploadImg'
  params.baseURL = Config.baseUrlWps;
  return fetch(params)
},



/**
 * wxa
 */


  // 会议 end


/**
 * wxa end
 */


};
export default getData

