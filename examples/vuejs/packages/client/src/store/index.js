import Vue from 'vue'
import Vuex from 'vuex'
import calendarsStore from './calendars.store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    calendars: calendarsStore
  }
})
