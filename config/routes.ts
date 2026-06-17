export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './account/login',
      },
    ],
  },
  {
    path: '/account/change-password',
    layout: false,
    component: './account/change-password',
  },
  {
    path: '/account/verify-mfa',
    layout: false,
    component: './account/verify-mfa',
  },
  {
    path: '/account/settings',
    name: 'settings',
    component: './account/settings',
    hideInMenu: true,
  },
  {
    path: '/exception/403',
    name: '403',
    component: './exception/403',
    hideInMenu: true,
  },
  {
    path: '/system',
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/system/user',
        name: 'user',
        component: './system/user',
      },
    ],
  },
  {
    path: '/exception/500',
    name: '500',
    component: './exception/500',
    hideInMenu: true,
  },
  {
    path: '/',
    redirect: '/account/settings',
  },
  {
    component: './exception/404',
    layout: false,
    path: './*',
  },
];
