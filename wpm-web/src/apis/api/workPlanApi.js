import { Config } from '@/apis/env.js'
import fetch from '@/apis/fetch'
// import { FLAG_NUMBER } from 'html2canvas/dist/types/css/syntax/tokenizer';


// /wps/annual/selUserAnnual
export function selUserAnnual(params){ // 获取用户年报
    params.url = "/wps/annual/selUserAnnual";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}

export function chanceStatistics(params) { //  商机统计
    params.url = "/chanceInfo/chanceStatistics";
    params.baseURL = Config.baseUrlC;
    return fetch(params);
}
export function queryClueCountForAtt(params) { //  获取线索数量
    params.url = "/crm/clue/queryClueCountForAtt";
    params.baseURL = Config.baseUrlC;
    return fetch(params);
}
// export function checkOverTime(params) { //  查看加班考勤清单
//     params.url = "/wps/checkin/checkOverTime";
//     params.baseURL = Config.baseUrlWps;
//     return fetch(params);
// }
export function checkinRecordList(params) { //  查询考勤领导是否确认
    params.url = "/wps/checkin/checkinRecordList";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function getWorkDay(params) { //  查询用户本周的请假和工作日
    params.url = "/wps/workPlan/selLeaveDay"; // /wps/workPlan/selOneWeekPlan
    // /wps/workPlan/selLeaveDay selLeaveDay
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function addWeekWorkPlan(params) { //  添加周计划和工作日
    params.url = "/wps/workPlan/addWeekWorkPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function selOneWeekPlan(params) { // 查询某周的计划
    params.url = "/wps/workPlan/selOneWeekPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function submitWeekWorkPlan(params) { // 提交周计划和日计划
    params.url = "/wps/workPlan/submitWeekWorkPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function revokeWeekWorkPlan(params) { // 撤回周计划和日计划
    params.url = "/wps/workPlan/revokeWeekWorkPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function selWorkPlanLog(params) { // 查询操作记录
    params.url = "/wps/workPlan/selWorkPlanLog";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function examineWeekWorkPlan(params) { // 领导审核周计划和日计划
    params.url = "/wps/workPlan/examineWeekWorkPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function addWeekWorkReview(params) { // 添加周回顾和日回顾
    params.url = "/wps/workPlan/addWeekWorkReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function submitWeekWorkReview(params) { // 提交周回顾和日回顾
    params.url = "/wps/workPlan/submitWeekWorkReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function revokeWeekWorkReview(params) { // 撤回周回顾和日回顾 或审核
    params.url = "/wps/workPlan/revokeWeekWorkReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function examineWeekWorkReview(params) { // 回顾 审核
    params.url = "/wps/workPlan/examineWeekWorkReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function selColleagueCircle(params) { // 查询用户同事圈
    params.url = "/wps/workPlan/selColleagueCircle";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function listNextVisitorCount(params){ // 获取同事圈下级的每个人员的访客记录数
    params.url = "/wps/visitors/dataBlock/listNextVisitorCount";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function selPersonByFuzzyName(params) { // 搜索公司的人
    params.url = "/wps/workPlan/selPersonByFuzzyName";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function selSubordinates(params) { // 查询当前用的的下级
    params.url = "/wps/workPlan/selSubordinates";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function addConcern(params) { // 添加关注
    params.url = "/wps/workPlan/addConcern";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function selConcernList(params) { // 查询用户的关注
    params.url = "/wps/workPlan/selConcernList";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function cancelConcern(params) { // 取消关注
    params.url = "/wps/workPlan/cancelConcern";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function getVisitorCount(params){ // 查询访客记录
    params.url = "/wps/visitors/getVisitorCount";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function queryHomeDataForPerson(params){ // 查询出差和招待的图标
    // /wps/tripEntertain/queryHomeDataForPerson
    params.url = "/wps/tripEntertain/queryHomeDataForPerson";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
// export function queryTripEntertainPlanDataForLeader(params){ // 查询计划审批界面 出差和招待的数据
//     // /wps/tripEntertain/queryTripEntertainPlanDataForLeader
//     params.url = "/wps/tripEntertain/queryTripEntertainPlanDataForLeader";
//     params.baseURL = Config.baseUrlWps;
//     return fetch(params);
// }
// export function queryTripEntertainReviewDataForLeader(params){ // 查询回顾审批界面 出差和招待的数据
//     // /wps/tripEntertain/queryTripEntertainReviewDataForLeader
//     params.url = "/wps/tripEntertain/queryTripEntertainReviewDataForLeader";
//     params.baseURL = Config.baseUrlWps;
//     return fetch(params);
// }
export function selectMouthExamineWorkCnt(params){ // 工作简报 查询用户某年月的待阅数
    // /wps/workPlan/selectMouthExamineWorkCnt
    params.url = "/wps/workPlan/selectMouthExamineWorkCnt";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function selectMouthExamineWork(params){ // 工作简报 查询用户某年月的待阅详情
    // /wps/workPlan/selectMouthExamineWork
    params.url = "/wps/workPlan/selectMouthExamineWork";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function queryTripEntertainReviewDataForLeader(params){ // 获取 回顾 招待出差
    // /wps/tripEntertain/queryTripEntertainReviewDataForLeader
    params.url = "/wps/tripEntertain/queryTripEntertainReviewDataForLeader";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function queryTripEntertainPlanDataForLeader(params){ // 获取 计划 招待出差
    // /wps/tripEntertain/queryTripEntertainPlanDataForLeader
    params.url = "/wps/tripEntertain/queryTripEntertainPlanDataForLeader";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
}
export function queryPersonUnitMsgByAd(params){ // 获取 计划 招待出差
    // /api/saas/account/queryPersonUnitMsgByAd
    params.url = "/api/saas/account/queryPersonUnitMsgByAd";
    params.baseURL = Config.baseUrlSaas;
    return fetch(params);
}

