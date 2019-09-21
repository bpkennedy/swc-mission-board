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
export const SET_PROFILE_MUTATION = 'SET_PROFILE_MUTATION'

export default new Vuex.Store({
  state: initialState(),
  actions: {
    async [GET_PROFILE_ACTION]({ state, commit }) {
      const { data } = await Vue.prototype.$axios.get(apiUrl + 'users/me')
      commit(SET_PROFILE_MUTATION, data)
    }
  },
  mutations: {
    [SET_PROFILE_MUTATION](state, user) {
      Vue.set(state, 'user', { ...user })
    }
  },
  getters: {}
})
