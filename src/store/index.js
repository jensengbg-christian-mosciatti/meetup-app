import Vue from 'vue'
import Vuex from 'vuex'

import location from './location'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    location,
    peppe: {
      namespaced: false,
      mutations: {
        CIAO(state) {
          state.pippo = 4
        },
      },
      actions: {
        getPeppe({ commit }) {
          commit('CIAO')
        },
      },
    },
  },
  state: {
    pippo: 2,
  },
  mutations: {
    SPIPPO(state, newVal) {
      state.pippo = newVal
    },
  },
  actions: {
    setPippo({ commit }) {
      commit('SPIPPO', 3)
    },
  },
})
