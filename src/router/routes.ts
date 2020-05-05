import { RouteConfig } from 'vue-router';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Permits from '../pages/Permits.vue';
import PermitDetailsUser from '../pages/PermitDetailsUser.vue';
import PermitDetailsStaff from '../pages/PermitDetailsStaff.vue';
import GroupingManagement from '../pages/GroupingManagement.vue';
import Reports from '../pages/Reports.vue';
import { authService } from '@boatnet/bn-auth/lib';

function isAuthorized(authorizedRoles: string[]) {
  for (const role of authorizedRoles) {
    if (authService.getCurrentUser()!.roles.includes(role)) {
      return true;
    }
  }
  return false;
}

const routes: RouteConfig[] = [
  {
    path: '/login', 
    name: 'Login', 
    component: Login
  },
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '', name: 'Home', component: Home,
        beforeEnter: (to, from, next) => {
          if (authService.isLoggedIn()) { return next(); } else { return next('/login'); }
        }
      },
      { path: '/permits', name: 'Permits', component: Permits,
        beforeEnter: (to, from, next) => {
          if (isAuthorized(['research-catch-staff', 'research-catch-user'])) { return next(); } else { return next('/login'); }
        }
      },
      { path: '/permitdetails-user', name: 'PermitDetailsUser', component: PermitDetailsUser,
        beforeEnter: (to, from, next) => {
          if (isAuthorized(['research-catch-user'])) { return next(); } else { return next('/login'); }
        }
      },
      { path: '/permitdetails-staff', name: 'PermitDetailsStaff', component: PermitDetailsStaff,
        beforeEnter: (to, from, next) => {
          if (isAuthorized(['research-catch-staff'])) { return next(); } else { return next('/login'); }
        }
      },
      { path: '/reports', name: 'Reports', component: Reports,
        beforeEnter: (to, from, next) => {
          if (isAuthorized(['research-catch-staff'])) { return next(); } else { return next('/login'); }
        }
      }
    ]
  },
  {
    path: '/grouping-management',
    name: 'GroupingManagement', 
    component: GroupingManagement,
    beforeEnter: (to, from, next) => {
      if (isAuthorized(['research-catch-staff'])) { return next(); } else { return next('/login'); }
    } 
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
