export default [{
    path: '/visitorDetail',
    name: 'visitorDetail',
    // component: visitorDetail
    component: () => import('@/views/guestDirectory/detail'),
  },
  {
    path: '/visitorlist',
    name: 'visitorlist',
    // component: visitorlist
    component: () => import('@/views/guestDirectory/list')
  },
  {
    path: '/visitorlistAll',
    name: 'visitorlistAll',
    // component: visitorlist
    component: () => import('@/views/guestDirectory/visitorlistAll'),
    meta: {
      keepAlive: true,
      isRefresh:false  //是否刷新数据
    }
  },
  {
    path: '/addressbook',
    name: 'addressbook',
    // component: addressbook
    component: () => import('@/views/guestDirectory/addressbook')
  }
]
