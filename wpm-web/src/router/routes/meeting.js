export default [
  // 会议 start
  { //会议管理列表
    path: '/meetingList',
    name: 'meetingList',
    components: {
      default: () => import('@/views/meeting/meetingList.vue')
    },
  },
  { //会议管理详情
    path: '/meetingDetail',
    name: 'meetingDetail',
    components: {
      default: () => import('@/views/meeting/meetingDetail.vue')
    },
  },
  { //创建会议
    path: '/meetingCreate',
    name: 'meetingCreate',
    components: {
      default: () => import('@/views/meeting/meetingCreate.vue')
    },
  },

  { //会议信息
    path: '/meetingInfo',
    name: 'meetingInfo',
    components: {
      default: () => import('@/views/meeting/meetingInfo.vue')
    },
  },
  { //会议签到
    path: '/signList',
    name: 'signList',
    components: {
      default: () => import('@/views/meeting/signList.vue')
    },
  },
  { //会议签到
    path: '/meetingSignIn',
    name: 'meetingSignIn',
    components: {
      default: () => import('@/views/meeting/meetingSignIn.vue')
    },
  },
  { //人员搜索
    path: '/meetingSelect',
    name: 'meetingSelect',
    components: {
      default: () => import('@/views/meeting/select.vue')
    },
  },
]
