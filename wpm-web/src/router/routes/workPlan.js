import e from '@/views/workPlan/e';
export default [
    { // 年度汇报
        path:'/2020',
        name:'2020',
        component:() => import("@/views/annualSummary/2020")
    },
    { // 错误页面
        path: '/error',
        name: "error",
        component: () => import('@/views/error.vue'),
        meta: {
          notRequireAuth: true
        }
    },
    { // 工作计划分享界面
        path: '/workPlanShare',
        name: 'workPlanShare',
        component: () => import('@/views/workPlan/workPlanShare')
    },
    { // 工作计划
        path: '/workplan',
        name: 'workplan',
        component: () => import('@/views/workPlan/workPlan')
    },
    { // 工作计划 error页面
        path: '/worke',
        name: 'worke',
        component: e
    },
    {
        path: '/record',
        name: 'record',
        component: () => import('@/views/workPlan/workPlanRecord')
    },
    { //审阅页面
        path: '/workplanAudit',
        name: 'workplanAudit',
        component: () => import('@/views/workPlan/workPlanAudit')
    },
    { // 同事圈
        path: '/colleague',
        name: 'colleague',
        component: () => import('@/views/workPlan/colleague')
    },
    { // 工作简报
        path: '/toBeRead',
        name: 'toBeRead',
        component: () => import('@/views/workPlan/toBeRead0')
    },
    { // 工作简报
        path: '/toBeRead0',
        name: 'toBeRead0',
        component: () => import('@/views/workPlan/toBeRead')
    },
  
]