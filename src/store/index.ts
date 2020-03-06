import Vue from 'vue'
import Vuex from 'vuex'

// we first import the module
import sPermit from './sPermit'
import { auth } from '@boatnet/bn-auth';

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // then we reference it
      sPermit,
      auth
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV // eslint-disable-line
  })

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot) { // eslint-disable-line
    module.hot.accept(['./sPermit'], () => { // eslint-disable-line
      const newPermit = require('./sPermit').default
      Store.hotUpdate({ modules: { sPermit: newPermit } })
    })
  }

  return Store
}
