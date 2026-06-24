export default [
  {
    path: '/user',
    layout: false,
    routes: [{ path: '/user/login', component: './account/login' }],
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
    path: '/exception/403',
    component: './exception/403',
    hideInMenu: true,
  },
  {
    path: '/exception/500',
    component: './exception/500',
    hideInMenu: true,
  },
  {
    path: '/',
    component: './DynamicPage',
  },
  {
    path: '/*',
    component: './DynamicPage',
  },
];
