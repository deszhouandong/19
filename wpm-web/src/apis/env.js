import {
  getIsApp
} from '@/utils/env'
/**
 * 配置编译环境和线上环境之间的切换
 *
 */
let Config = {
  baseUrl: '', //接口url
  imgBaseUrl: '', //图片url
  mallUrl: 'http://mall.sz.energy.js.cn', //商城地址
  portalUrl: 'http://portal.sz.energy.js.cn', //公共服务地址
}
const getCurrentEnvUrl = function (path) {
  let prefix,prefix1;
  const isApp = getIsApp()
  const environment = process.env.NODE_ENV
  if (isApp) {
    switch (environment) {
      case "test":
        prefix = `https://testwps.hongxinshop.com`;
        // prefix = `http://a.fehorizon.com/HXJFwpsTEST`;
        break;
      case "production":
        prefix = `https://wps.hongxinshop.com`;
        break;
      default:
        prefix = `http://172.16.85.112:8080`;
        break;
    }
  } else {
    switch (environment) {
      case "test":
        prefix = `http://a.fehorizon.com/HXJFwpsTEST`;
        break;
      case "production":
        prefix = `http://hxjf.fehorizon.com`;
        break;
      default:
        prefix = `http://172.16.85.112:8080`;
        prefix1= `http://172.24.121.217:8080`
        break;
    }
  }
  const aim=path&&environment==='development'?eval(path):prefix
  return aim;
}

Config.baseUrl = `${getCurrentEnvUrl()}/api-att/wps/checkin`
Config.baseUrlWx = `${getCurrentEnvUrl()}/api-cen/api/wechat`
Config.baseUrlSaas = `${getCurrentEnvUrl()}/api-u`
Config.baseUrlC = `${getCurrentEnvUrl()}/api-c` // 线索 商机获取接口
Config.baseUrlWps = `${getCurrentEnvUrl()}/api-att`
Config.baseUrlToken = `${getCurrentEnvUrl()}`
Config.baseUrlToken1 = `${getCurrentEnvUrl('prefix1')}`
Config.baseUrlMock = `${getCurrentEnvUrl()}/api-mmp`
Config.baseUrlMockvis = `${getCurrentEnvUrl()}/api-att`
Config.baseUrlUpload = `${getCurrentEnvUrl()}/api-f/` //关键动作文件上传
Config.baseUrlApp = `${getCurrentEnvUrl()}/sys/`
// Config.baseUrlMeeting = 'http://114.67.104.46:3000/mock/119/'

let meetingUrl = ''
switch (process.env.NODE_ENV) {
  case "test":
    meetingUrl = `http://a.fehorizon.com/HXJFwpsTEST`;
    break;
  case "production":
    meetingUrl = `http://hxjf.fehorizon.com`;
    break;
  default:
    meetingUrl = `http://172.24.121.201:8080`;
    meetingUrl = `http://172.16.85.112:8080`;
    break;
}

Config.baseUrlMeeting = `${meetingUrl}/api-att/`;
// Config.baseUrlMeeting = 'http://172.24.121.205:31420'
// Config.baseUrlMeeting = 'http://172.24.121.205:15644' //

// process.env.NODE_ENV == 'development'
// if (process.env.NODE_ENV == 'development') { //开发环境
//   Config.baseUrl = `${getCurrentEnvUrl()}/api-att/wps/checkin`
//   Config.baseUrlWx = `${getCurrentEnvUrl()}/api-cen/api/wechat`
//   Config.baseUrlSaas = `${getCurrentEnvUrl()}/api-u`
//   Config.baseUrlWps = `${getCurrentEnvUrl()}/api-att`
//   Config.baseUrlToken = `${getCurrentEnvUrl()}`
//   Config.baseUrlMock = `${getCurrentEnvUrl()}/api-mmp`
//   Config.baseUrlMockvis = `${getCurrentEnvUrl()}/api-att`
//   Config.baseUrlUpload = `${getCurrentEnvUrl()}/api-f/` //关键动作文件上传
//   Config.baseUrlApp = `${getCurrentEnvUrl()}/sys/`

// } else if (process.env.NODE_ENV === 'production') {
//   // 生产环境地址
//   Config.baseUrl = `${getCurrentEnvUrl()}/api-att/wps/checkin`
//   Config.baseUrlWx = `${getCurrentEnvUrl()}/api-cen/api/wechat`
//   Config.baseUrlSaas = `${getCurrentEnvUrl()}/api-u`
//   Config.baseUrlWps = `${getCurrentEnvUrl()}/api-att`
//   Config.baseUrlToken = `${getCurrentEnvUrl()}`
//   Config.baseUrlMock = `${getCurrentEnvUrl()}/api-mmp`
//   Config.baseUrlMockvis = `${getCurrentEnvUrl()}/api-att`
//   Config.baseUrlUpload = `${getCurrentEnvUrl()}/api-f/`, //关键动作文件上传
//     Config.baseUrlApp = `${getCurrentEnvUrl()}/sys/`


// } else if (process.env.NODE_ENV === 'test') {
//   //测试环境
//   Config.baseUrl = `${getCurrentEnvUrl()}/api-att/wps/checkin`
//   Config.baseUrlWx = `${getCurrentEnvUrl()}/api-cen/api/wechat`
//   Config.baseUrlSaas = `${getCurrentEnvUrl()}/api-u`
//   Config.baseUrlWps = `${getCurrentEnvUrl()}/api-att`
//   Config.baseUrlToken = `${getCurrentEnvUrl()}`
//   Config.baseUrlMock = `${getCurrentEnvUrl()}/api-mmp`
//   Config.baseUrlMockvis = `${getCurrentEnvUrl()}/api-att`,
//     Config.baseUrlUpload = `${getCurrentEnvUrl()}/api-f/` //关键动作文件上传
//   Config.baseUrlApp = `${getCurrentEnvUrl()}/sys/`

// }
export {
  Config
}
