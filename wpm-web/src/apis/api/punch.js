import {
  Config
} from '@/apis/env.js'
import fetch from '@/apis/fetch'

// 获取加班审批数据
const checkOverTime = (params) => {
  params.baseURL = Config.baseUrl;
  params.url = '/checkOverTime'
  return fetch(params)
}
// 修改位置范围基地内外高原
const modExtents = (params) => {
  params.baseURL = Config.baseUrl;
  params.url = '/modExtents'
  return fetch(params)
}
// 开启我要加班
const openOverTime = (params) => {
  params.baseURL = Config.baseUrl;
  params.url = '/openOverTime'
  return fetch(params)
}
export {
  checkOverTime,
  modExtents,
  openOverTime
}
