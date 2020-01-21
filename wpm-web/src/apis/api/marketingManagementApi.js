import {
  Config
} from '@/apis/env.js'
import fetch from '@/apis/fetch'


export function travelPlanFind(params) {//出差计划查询
    params.url = "/wps/businesstrip/findLastPlanDateByWpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }

  export function travelPlanSearch(params) {//出差计划模糊查询
    params.url = "/wps/integration/searchVisitNameForTrip";
    params.baseURL =  Config.baseUrlWps;
    return fetch(params);
  }

  export function travelPlanSave(params) { //出差计划保存
    params.url = "/wps/businesstrip/saveTripPlanByAdcount";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }

  export function travelPlanDel(params) { //出差计划删除
    params.url = "/wps/businesstrip/logicDelTripPlanByWpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }

  export function travelReviewFind(params) { //出差回顾查询
    params.url = "/wps/businesstrip/findTripReviewByWpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }

  export function travelReviewSave(params) { //出差回顾保存
    params.url = "/wps/businesstrip/saveTripReviewByAdCount";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }

  export function travelReviewDel(params) { //出差回顾删除
    params.url = "/wps/businesstrip/logicDelTripReviewByWrId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }


  export function servePlanFind(params) { //招待计划查询
    params.url = "/entertain/findEntertainPlanByEpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function servePlanListFind(params) { //招待计划列表查询
    params.url = "/entertain/findEntertainPlanList";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function servePlanDel(params) { //招待计划删除
    params.url = "/entertain/logicDelEntertainPlanByEpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function servePlanSave(params) { //招待计划保存
    params.url = "/entertain/addEntertainPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function servePlanUpdate(params) { //招待计划修改
    params.url = "/entertain/updateEntertainPlan";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function serveRewSave(params) { //招待回顾保存
    params.url = "/entertain/addEntertainReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function serveRewUpdete(params) { //招待回顾修改
    params.url = "/entertain/updateEntertainReview";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function serveRewDel(params) { //招待回顾删除
    params.url = "/entertain/logicDelEntertainReviewByEpId";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function serveRewFind(params) { //招待回顾查询
    params.url = "/entertain/findEntertainReviewDetailById";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function serveRewVis(params) { //访客对象
    params.url = "/wps/visitors/listVisitorsRecordForState";
    params.baseURL = Config.baseUrlMockvis;
    return fetch(params);
  }
  export function serveReviewList(params) { //招待回顾列表查询
    params.url = "/entertain/findEntertainReviewList";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }

  export function reviewDetailFind(params) { //回顾明细查询
    params.url = "/wps/reviewDetails/selWorkReviewDetails";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function reviewDetailSave(params) { //回顾明细保存
    params.url = "/wps/reviewDetails/inSelWorkReviewDetails";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function reviewDetailDelete(params) { //回顾明细删除
    params.url = "/wps/reviewDetails/delReviewDetails";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }
  export function mock(params) { //招待计划模糊查询mock
    params.url = "/mock";
    params.baseURL = Config.baseUrlWps;
    return fetch(params);
  }