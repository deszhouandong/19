export default[{
    path: '/',
    redirect: 'punch'
  },
  {
    path: '*',
    redirect: 'punch' //所有不匹配路径(*)punch
  },
  {
    path: '/mainFotter',
    name: 'mainFotter',
    component: ()=> import('@/component/punch/MainFotter'),
    children: [{
        path: '/punch',
        name: 'punch',
        component: () => import('@/views/index/punch.vue'),
      }, {
        path: '/punchHistory',
        name: 'punchHistory',
        component: () => import('@/views/index/punchHistory.vue'),
      },

      {
        path: '/attendanceRecord',
        name: 'attendanceRecord',
        component: () => import('@/views/index/attendanceRecord.vue'),
      },
      {
        path: '/mapDetail',
        name: "mapDetail",
        component: () => import('@/views/index/mapDetail.vue'),

      },

    ]
  },
  { // 本地时间与实际时间相差较大提醒
    path: '/abnormalClock',
    name: "abnormalClock",
    component: () => import('@/views/index/abnormalClock.vue'),
    meta: {
      notTimeCheck: true
    }
  },
  {
    path: '/punchHistory',
    name: 'punchHistory',
    component: () => import('@/views/index/punchHistory.vue'),
  },
  // 加班审批单
  {
    path: '/overtimeOrder',
    name: 'overtimeOrder',
    component: () => import('@/views/index/overtimeOrder.vue'),
  },
  {
    path: '/leaderConfirm',
    name: 'leaderConfirm',
    component: () => import('@/views/index/leaderConfirm.vue'),
  },
  {
    path: '/AttendanceAffirm',
    name: 'attendanceAffirm',
    component: () => import('@/views/index/leaderConfirm.vue')
  },
  { // 异常考勤确认
    path: '/abnormalCheck',
    name: 'abnormalCheck',
    component: () => import('@/views/index/leaderConfirm.vue')
  },
  {
    path: '/CheckAppeal',
    name: "CheckAppeal",
    component: () => import('@/views/index/leaderConfirm.vue')
  },
  { // 考勤申诉
    path: '/AppealCheck',
    name: "AppealCheck",
    component: () => import('@/views/index/leaderConfirm.vue')
  },
  { // 待确认考勤列表
    path: '/workbench',
    name: "workbench",
    component: () => import('@/views/index/workBench.vue'),
    // meta:{
    //   keepAlive: true
    // }
  },
  { // 下属异常考勤列表
    path: '/attendanceTeam',
    name: "attendanceTeam",
    component: () => import('@/views/index/attendanceTeam.vue'),
    // meta:{
    //   keepAlive: true
    // }
  },
  { // 我的异常考勤列表
    path: '/attendanceMy',
    name: "attendanceMy",
    component: () => import('@/views/index/attendanceMy.vue')
  },
  {
    path: '/confirmResult',
    name: "confirmResult",
    component: () => import('@/views/index/confirmResult.vue')
  }
]
