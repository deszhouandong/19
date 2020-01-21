import {
  Config
} from '@/apis/env.js'
import fetch from '@/apis/fetch'


export function keyAction(params) { // 关键动作查询
  params.url = "/wps/monitor/getApplyRecord";
  params.baseURL = Config.baseUrlWps;
  return fetch(params);
}
export function keyActionSave(params) { // 关键动作保存
  params.url = "/wps/monitor/save";
  params.baseURL = Config.baseUrlWps;
  return fetch(params);
}
export function keyActionSubmit(params) { // 关键动作提交
  params.url = "/wps/monitor/submit";
  params.baseURL = Config.baseUrlWps;
  return fetch(params);
}

//文件上传
export function keyUpload(params) {
  params.url = "/fast/files/uploadRes";
  params.baseURL = Config.baseUrlUpload;
  return fetch(params);
}