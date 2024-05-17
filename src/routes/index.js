const icon = require('@heroicons/react/outline');

const PATH = {
  SERVICES: 'SERVICES',
  RECEIPT: 'RECEIPT',
  AFFILIATES: {
    OVERVIEW: 'OVERVIEW',
    HISTORY: 'HISTORY',
  },
  ADMIN: {
    CUSTOMER: 'CUSTOMER',
    ORDER: 'ORDER',
    COUPON: 'COUPON',
    AFFILIATES: 'AFFILIATES',
    BANNER: 'BANNER',
    HISTORY_ADMIN: 'HISTORY_ADMIN',
  },
  SUPPORT: 'SUPPORT',
  PROFILE: 'PROFILE',
  SERVICES_DETAIL: 'SERVICES_DETAIL',
  CHOOSE_LICENSE: 'CHOOSE_LICENSE',
  NOT_FOUND: 'NOT_FOUND',
  LOGIN: 'LOGIN',
  AUTHORIZE: 'AUTHORIZE',
  ONEPAYRESULT: 'ONEPAYRESULT',
  RECEIVER: 'RECEIVER',
};
const menuDashboard = [
  {
    name: PATH.SERVICES,
    path: '/services',
    src: '/services',
    dashBoardName: 'Dịch vụ',
    icon: icon.HomeIcon,
    isAdmin: false,
  },
  // {
  //   name: PATH.RECEIPT,
  //   path: '/receipt',
  //   src: '/receipt',
  //   dashBoardName: 'Hóa đơn',
  //   icon: icon.MenuIcon,
  //  isAdmin: false,
  // },
  {
    name: PATH.AFFILIATES.OVERVIEW,
    path: '/affiliates/overview',
    src: '/affiliates/overview',
    dashBoardName: 'Affiliates',
    icon: icon.TagIcon,
    isAdmin: false,
  },
  {
    name: PATH.SUPPORT,
    path: '/support',
    src: '/support',
    dashBoardName: 'Hỗ trợ',
    icon: icon.SupportIcon,
    isAdmin: false,
  },
  {
    name: PATH.ADMIN.CUSTOMER,
    path: '/admin/customer',
    src: '/admin/customer',
    dashBoardName: 'Admin',
    icon: icon.CogIcon,
    isAdmin: true,
  },
];
const paths = [
  {
    name: PATH.SERVICES,
    path: '/services',
    src: '/services',
    dashBoardName: 'Dịch vụ',
    icon: icon.HomeIcon,
  },
  {
    name: PATH.RECEIPT,
    path: '/receipt',
    src: '/receipt',
    dashBoardName: 'Hóa đơn',
    icon: icon.MenuIcon,
  },
  {
    name: PATH.AFFILIATES.OVERVIEW,
    path: '/affiliates/overview',
    src: '/affiliates/overview',
    dashBoardName: 'Affiliates',
    icon: icon.TagIcon,
  },
  {
    name: PATH.SUPPORT,
    path: '/support',
    src: '/support',
    dashBoardName: 'Hỗ trợ',
    icon: icon.SupportIcon,
  },

  {
    name: PATH.ADMIN.CUSTOMER,
    path: '/admin/customer',
    src: '/admin/customer',
    dashBoardName: 'Admin',
    icon: icon.CogIcon,
  },
  {
    name: PATH.AFFILIATES.HISTORY,
    path: '/affiliates/history',
    src: '/affiliates/history',
    dashBoardName: 'Affiliates',
    icon: icon.TagIcon,
  },
  {
    name: PATH.PROFILE,
    path: '/profile',
    src: '/profile',
    dashBoardName: 'Tài khoản',
    icon: icon.UsersIcon,
  },
  {
    name: PATH.SERVICES_DETAIL,
    path: '/services/:id',
    src: '/services/:id',
    dashBoardName: 'Chi tiết',
    icon: icon.UsersIcon,
  },
  {
    name: PATH.CHOOSE_LICENSE,
    path: '/license/:idDetailService',
    src: '/license/:idDetailService',
    dashBoardName: 'CHOOSE_LICENSE',
    icon: icon.UsersIcon,
  },
  {
    name: PATH.NOT_FOUND,
    path: '/404',
    src: '/404',
  },

  {
    name: PATH.LOGIN,
    path: '/',
    src: '/login',
  },
  {
    name: PATH.AUTHORIZE,
    path: '/login/authorize',
    src: '/authorize',
  },
  {
    name: PATH.ONEPAYRESULT,
    path: '/onePayResult',
    src: '/onepay_result',
  },

  {
    name: PATH.ADMIN.ORDER,
    path: '/admin/order',
    src: '/admin/order',
  },
  {
    name: PATH.ADMIN.AFFILIATES,
    path: '/admin/affiliates',
    src: '/admin/affiliates',
  },
  {
    name: PATH.ADMIN.COUPON,
    path: '/admin/coupon',
    src: '/admin/coupon',
  },
  {
    name: PATH.ADMIN.HISTORY_ADMIN,
    path: '/admin/history_admin',
    src: '/admin/history_admin',
  },
  {
    name: PATH.ADMIN.BANNER,
    path: '/admin/banner',
    src: '/admin/banner',
  },
  {
    name: PATH.RECEIVER,
    path: '/receiver',
    src: '/receiver',
  },
];
const routes = paths.map((path) => {
  return {
    source: path.path,
    destination: path.src,
  };
});
module.exports = {
  PATH,
  paths,
  routes,
  menuDashboard,
};
