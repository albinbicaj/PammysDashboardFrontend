const routesConfig = {
  dashboardRoutes: [
    {
      path: '/dashboard/profile',
      name: 'Profile',
      element: <DashboardProfilePage />,
      icon: 'user', // icon for side menu
      category: 'User Management', // route category
      roles: [RoleEnum.ADMIN, RoleEnum.USER],
    },
    {
      path: '/dashboard/stats',
      name: 'Stats',
      element: <DashboardStatsPage />,
      icon: 'chart', // icon for side menu
      category: 'Analytics', // route category
      roles: [RoleEnum.ADMIN, RoleEnum.USER],
    },
    {
      path: '/dashboard/users',
      name: 'Users',
      element: <DashboardUsersPage />,
      icon: 'users', // icon for side menu
      category: 'User Management',
      roles: [RoleEnum.ADMIN],
    },
    // Other dashboard routes...
  ],
  clientRoutes: [
    {
      path: '/home',
      name: 'Home',
      element: <ClientHomePage />,
      icon: 'home', // if you need it for side menu
      roles: [RoleEnum.GUEST, RoleEnum.USER],
    },
    {
      path: '/products',
      name: 'Products',
      element: <ClientProductsPage />,
      icon: 'box',
      roles: [RoleEnum.GUEST, RoleEnum.USER],
    },
  ],
};
