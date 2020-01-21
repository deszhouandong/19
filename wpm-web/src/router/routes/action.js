export default [{ //关键动作
  path: '/keyAction',
  name: 'keyAction',
  components: {
    default: () => import('@/views/action/keyAction.vue')
  },
  meta: {
    keepAlive: true
  }
},
{
  path: '/actionSafe',
  name: 'actionSafe',
  components: {
    default: () => import('@/views/action/actionSafe.vue')
  },
  // meta:{
  //   keepAlive: true
  // }
},]