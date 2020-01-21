import {
  Config
} from '@/apis/env.js'
import fetch from '@/apis/fetch'

export function listMeetingRoom(params){ // 获取会议室
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/address/listMeetingRoom';
  return fetch(params)
}
export function listMeetingPlace(params){ // 获取会议地点接口
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/address/listMeetingPlace';
  return fetch(params)
}
export function saveConferee(params){ // 新增参会人员接口
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/personnel/saveConferee';
  return fetch(params)
}
export function saveMeetingAgency(params){ // 指定会议授权代理人接口
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/personnel/saveMeetingAgency'
  return fetch(params)
}
export function getPersonMsgByAdName(params){ // 查询人员
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/integration/getPersonMsgByAdName'
  return fetch(params)
}
export function receiveOrRefuseTheMeeting(params){ // 接受或拒绝会议
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/personnel/receiveOrRefuseTheMeeting'
  return fetch(params)
}
export function listPendingMeeting(params){ // 获取待处理会议列表
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/manage/listPendingMeeting'
  return fetch(params)
}
export function cancelMeeting(params){ // 取消会议
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/manage/cancelMeeting'
  return fetch(params)
}
export function sendInvitations(params){ // 发送会议邀请接口
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/manage/sendInvitations'
  return fetch(params)
}
export function saveMeetingSummary(params){ // 保存会议纪要接口
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/documents/saveMeetingSummary'
  return fetch(params)
}
export function listMeetingSignInInfo(params){ // 获取会议签到人员信息接口
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/personnel/listMeetingSignInInfo'
  return fetch(params)
}
export function listMeetingConflictPersonnelInfo(params){ // 会议冲突人员校验接口
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/personnel/listMeetingConflictPersonnelInfo'
  return fetch(params)
}
export function meetingShare(params){ //会议分享 获取会议详情
  const {data} = params;
  const {id} = data;
  params.baseURL = Config.baseUrlMeeting;
  params.url = `/wps/common/meetingShare?id=${id||""}`
  return fetch(params)
}
export function shareMeetingSignInInfo(params){ //会议分享签到信息接口情
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/common/shareMeetingSignInInfo'
  return fetch(params)
}
export function getMeetingList(params){ //搜素列表 获取会议详情
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/manage/getMeetingInfoDetail'
  return fetch(params)
}
export function scanningSignIn(params){ //扫码签到接口
  const {data} = params;
  const {meetingNumber} = data;
  params.baseURL = Config.baseUrlMeeting;
  params.url = `/wps/common/meeting/scanningSignIn?meetingNumber=${meetingNumber||""}`
  return fetch(params)
}
export function uploadFile(params){ //文档上传
  params.baseURL = Config.baseUrlMeeting;
  params.url = 'wps/meeting/documents/uploadDocuments'
  return fetch(params)
}
