import { RouteConfig } from 'vue-router';
import Login from '../pages/Login.vue';
import Permits from '../pages/Permits.vue';
import PermitDetailsUser from '../pages/PermitDetailsUser.vue';
import PermitDetailsStaff from '../pages/PermitDetailsStaff.vue';
import GroupingManagement from '../pages/GroupingManagement.vue';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', name: 'Login', component: Login},
      { path: '/permits', name: 'Permits', component: Permits},
      { path: '/permitdetails-user', name: 'PermitDetailsUser', component: PermitDetailsUser},
      { path: '/permitdetails-staff', name: 'PermitDetailsStaff', component: PermitDetailsStaff},
      { path: '/grouping-management', name: 'GroupingManagement', component: GroupingManagement}
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
