import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    access_token: null,
  },
  mutations: {
    [types.ADD_ACCESS_TOKEN](state, payload) {
      state.access_token = payload
    }
  },

  actions: {
    // getAccess_token({
    //   commit
    // }, params) {
    //   commit(types.ADD_ACCESS_TOKEN, response.data.list)
    // },
  },

  modules: {}
})
