import { RouteConfig } from 'vue-router';
import Login from '../pages/Login.vue';
import Permits from '../pages/Permits.vue';
import PermitDetailsUser from '../pages/PermitDetailsUser.vue';
import PermitDetailsStaff from '../pages/PermitDetailsStaff.vue';
import GroupingManagement from '../pages/GroupingManagement.vue';
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
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/', name: 'Login', component: Login},
      { path: '/permits', name: 'Permits', component: Permits,
        beforeEnter: (to, from, next) => {
          if (isAuthorized(['research-catch-staff', 'research-catch-user'])) { return next(); } else { return next('/'); }
        }
      },
      { path: '/permitdetails-user', name: 'PermitDetailsUser', component: PermitDetailsUser,
        beforeEnter: (to, from, next) => {
          if (isAuthorized(['research-catch-user'])) { return next(); } else { return next('/'); }
        }
      },
      { path: '/permitdetails-staff', name: 'PermitDetailsStaff', component: PermitDetailsStaff,
        beforeEnter: (to, from, next) => {
          if (isAuthorized(['research-catch-staff'])) { return next(); } else { return next('/'); }
        }
      },
      { path: '/grouping-management', name: 'GroupingManagement', component: GroupingManagement,
        beforeEnter: (to, from, next) => {
          if (isAuthorized(['research-catch-staff'])) { return next(); } else { return next('/'); }
        }
      }
    ]
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
