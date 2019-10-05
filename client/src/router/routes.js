const routes = [
  {
    path: '/admin',
    component: () => import('layouts/RootLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('layouts/NavigationLayout.vue'),
        children: [
          {
            name: 'Admin',
            path: '',
            component: () => import('pages/Admin.vue')
          }
        ]
      }
    ],
  },
  {
    path: '/public',
    component: () => import('layouts/RootLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('layouts/NavigationLayout.vue'),
        children: [
          {
            name: 'Public Missions',
            path: '',
            component: () => import('pages/Public.vue')
          }
        ]
      }
    ],
  },
  {
    path: '/missions',
    component: () => import('layouts/RootLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('layouts/NavigationLayout.vue'),
        children: [
          {
            name: 'My Missions',
            path: '',
            component: () => import('pages/Index.vue')
          },
        ]
      },
      {
        path: '',
        component: () => import('layouts/DetailLayout.vue'),
        children: [
          {
            name: 'mission',
            path: ':id',
            component: () => import('pages/Mission.vue'),
          }
        ]
      }
    ],
  },
  {
    path: '/map',
    component: () => import('layouts/RootLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('layouts/NavigationLayout.vue'),
        children: [
          {
            name: 'Galaxy Map',
            path: '',
            component: () => import('pages/Map.vue')
          }
        ]
      }
    ],
  },
  {
    path: '/boards',
    component: () => import('layouts/RootLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('layouts/NavigationLayout.vue'),
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
      }
    ],
  },
  {
    path: '/',
    component: () => import('layouts/RootLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('layouts/NavigationLayout.vue'),
        children: [
          {
            name: 'SWC Mission Board',
            path: '',
            component: () => import('pages/Index.vue')
          }
        ]
      }
    ],
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
