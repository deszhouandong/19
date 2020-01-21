import fetch from '@/apis/fetch'
import {Config} from '@/apis/env.js'

export function listVisitorsRecordForState(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/listVisitorsRecordForState',
    method: 'post',
    data,
  })
}
export function deleteVisitorsRecord(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/deleteVisitorsRecord',
    method: 'post',
    data,
  })
}
export function selectRecordById(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/getVisitorsRecordDetail',
    method: 'post',
    data,
  })
}
export function getContactsRelation(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/integration/listContactsRelation',
    method: 'post',
    data,
  })
}
export function visitorsUpload(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/upload',
    method: 'post',
    data,
  })
}

export function saveOrUpdateVisitorsRecord(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/saveOrUpdateVisitorsRecord',
    method: 'post',
    data,
  })
}

export function searchVisitName(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/integration/searchVisitName',
    method: 'post',
    data,
  })
}

export function getPersonMsgByAdName(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/integration/getPersonMsgByAdName',
    method: 'post',
    data,
  })
}
// 访客记录信息增加
export function appendVisitorDetails(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/appendVisitorDetails',
    method: 'post',
    data,
  })
}
// 获取用户名
export function queryPersonUnitMsgByAd(data) {
  return fetch({
    baseURL:Config.baseUrlSaas,
    url: '/api/saas/account/queryPersonUnitMsgByAd',
    method: 'post',
    data,
  })
}

// 获取商机查询状态枚举参数
export function getChanceQueryStatusParam(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/getChanceQueryStatusParam',
    method: 'post',
    data,
  })
}
// 访客记录翻页
export function getVisitorsListByPage(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/getVisitorsListByPage',
    method: 'post',
    data,
  })
}
