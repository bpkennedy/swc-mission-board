
const routes = [
  {
    path: '/public',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name: 'Public Missions',
        path: '',
        component: () => import('pages/Public.vue')
      }
    ]
  },
  {
    path: '/missions',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name: 'My Missions',
        path: '',
        component: () => import('pages/Index.vue')
      },
    ]
  },
  {
    path: '/map',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name: 'Galaxy Map',
        path: '',
        component: () => import('pages/Map.vue')
      }
    ]
  },
  {
    path: '/boards',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name: 'Boards',
        path: '',
        component: () => import('pages/Boards.vue')
      },
      {
        name: 'boardMissions',
        path: ':id',
        component: () => import('pages/BoardMissions.vue'),
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name: 'SWC Mission Board',
        path: '',
        component: () => import('pages/Index.vue')
      }
    ]
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
