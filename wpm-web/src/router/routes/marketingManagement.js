export default [
{ //出差计划
      path: '/travelPlan',
      name: 'travelPlan',
      components: {
        default: () => import('@/views/marketingManagement/travelPlan.vue')
      },
    },
    { //出差回顾
      path: '/travelReview',
      name: 'travelReview',
      components: {
        default: () => import('@/views/marketingManagement/travelReview.vue')
      },
    },
    { //招待计划
      path: '/servePlan',
      name: 'servePlan',
      components: {
        default: () => import('@/views/marketingManagement/servePlan.vue')
      },
    },
    { //招待计划列表
      path: '/serverPlanList',
      name: 'serverPlanList',
      components: {
        default: () => import('@/views/marketingManagement/serverPlanList.vue')
      },
    },
    { //招待回顾列表
      path: '/serveReviewList',
      name: 'serveReviewList',
      components: {
        default: () => import('@/views/marketingManagement/serveReviewList.vue')
      },
    },
    { //招待回顾
      path: '/serveReview',
      name: 'serveReview',
      components: {
        default: () => import('@/views/marketingManagement/serveReview.vue')
      },
    },
    { //招待回顾访客记录
      path: '/visitorlistReview',
      name: 'visitorlistReview',
      components: {
        default: () => import('@/views/marketingManagement/visitorlistReview.vue')
      },
    },
    { //回顾明细
      path: '/reviewDetail',
      name: 'reviewDetail',
      components: {
        default: () => import('@/views/marketingManagement/reviewDetail.vue')
      },
    },
  ]