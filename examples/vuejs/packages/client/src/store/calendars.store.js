import HttpClient from '../utils/HttpClient'


export const types = {
  CALENDARS: 'CALENDARS'
}

export default {
  state: {
    calendars: []
  },
  mutations: {
    [types.CALENDARS] (state, calendars) {
      state.calendars = calendars
    }
  },
  actions: {
    async getCalendars ({ commit }) {
      const calendars = await HttpClient.get('/rest/calendars')

      commit(types.CALENDARS, calendars)
    }
  },
  getters: {
    calendars: state => state.calendars
  }
}
