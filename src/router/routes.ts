import { RouteConfig } from 'vue-router';
import Permits from '../pages/Permits.vue';
import PermitDetails from '../pages/PermitDetails.vue';


const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/permits', name: 'Permits', component: Permits},
      { path: '/permitdetails', name: 'PermitDetails', component: PermitDetails}
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
