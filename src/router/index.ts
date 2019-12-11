import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import { LocalStorage } from 'quasar'
import { authService } from '@boatnet/bn-auth';

// Note: Jenkins build will update this dbConfig.ts file for Prod/ Stage/ Dev etc.
// import dbConfig from '../config/dbConfig';
// authService.setDBConfig(dbConfig);

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
