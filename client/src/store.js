import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const apiUrl = window.location.protocol + '//' + window.location.host + '/api/v1/'
const initialState = () => {
  return {
    user: {},
  }
}

export const GET_PROFILE_ACTION = 'GET_PROFILE_ACTION'
export const SET_PROFILE_ACTION = 'SET_PROFILE_ACTION'

export default new Vuex.Store({
  state: initialState(),
  actions: {
    async [GET_PROFILE_ACTION]({ state }) {
      const user = await Vue.prototype.$axios.get(apiUrl + 'users/me')
      console.log(user)
    }
  },
  mutations: {},
  getters: {}
})
