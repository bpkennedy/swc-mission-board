import Vue from 'vue'
import Vuex from 'vuex'
import { genericError, genericSuccess } from './utils'

Vue.use(Vuex)

const apiUrl = window.location.protocol + '//' + window.location.host + '/api/v1/'
const initialState = () => {
  return {
    user: {},
    users: [],
    missions: [],
    missionTypes: [],
  }
}

export const GET_INITIAL_APP_DATA = 'GET_INITIAL_APP_DATA'
export const GET_PROFILE_ACTION = 'GET_PROFILE_ACTION'
export const GET_USERS_ACTION = 'GET_USERS_ACTION'
export const GET_PUBLIC_MISSIONS_ACTION = 'GET_MISSIONS_ACTION'
export const GET_MISSION_TYPES_ACTION = 'GET_MISSION_TYPES_ACTION'
export const CREATE_MISSION_ACTION = 'CREATE_MISSION_ACTION'
export const SET_PROFILE_MUTATION = 'SET_PROFILE_MUTATION'
export const SET_USERS_MUTATION = 'SET_USERS_MUTATION'
export const SET_PUBLIC_MISSIONS_MUTATION = 'SET_MISSIONS_MUTATION'
export const SET_MISSION_TYPES_MUTATION = 'SET_MISSION_TYPES_MUTATION'
export const PUBLIC_MISSIONS_GETTER = 'PUBLIC_MISSIONS_GETTER'
export const MISSION_TYPE_GETTER = 'MISSION_TYPE_GETTER'
export const MISSION_TYPES_FOR_SELECT_GETTER = 'MISSION_TYPES_FOR_SELECT_GETTER'

export default new Vuex.Store({
  state: initialState(),
  actions: {
    async [GET_INITIAL_APP_DATA]({ commit }) {
      const profile = Vue.prototype.$axios.get(apiUrl + 'users/me')
      const users = Vue.prototype.$axios.get(apiUrl + 'users')
      const missionTypes = Vue.prototype.$axios.get(apiUrl + 'mission-types')
      const publicMissions = Vue.prototype.$axios.get(apiUrl + 'missions/public')

      const bootupData = await Promise.all([profile, users, missionTypes, publicMissions])
      commit(SET_PROFILE_MUTATION, bootupData[0].data)
      commit(SET_USERS_MUTATION, bootupData[1].data)
      commit(SET_MISSION_TYPES_MUTATION, bootupData[2].data)
      commit(SET_PUBLIC_MISSIONS_MUTATION, bootupData[3].data)
    },
    async [GET_PROFILE_ACTION]({ commit }) {
      const { data } = await Vue.prototype.$axios.get(apiUrl + 'users/me')
      commit(SET_PROFILE_MUTATION, data)
    },
    async [GET_USERS_ACTION]({ commit }) {
      const { data } = await Vue.prototype.$axios.get(apiUrl + 'users')
      commit(SET_USERS_MUTATION, data)
    },
    async [GET_PUBLIC_MISSIONS_ACTION]({ commit }) {
      const { data } = await Vue.prototype.$axios.get(apiUrl + 'missions/public')
      commit(SET_PUBLIC_MISSIONS_MUTATION, data)
    },
    async [GET_MISSION_TYPES_ACTION]({ commit }) {
      const { data } = await Vue.prototype.$axios.get(apiUrl + 'mission-types')
      commit(SET_MISSION_TYPES_MUTATION, data)
    },
    async [CREATE_MISSION_ACTION]({ dispatch, commit }, { formData, closePopupElement }) {
      try {
        await Vue.prototype.$axios.post(apiUrl + 'missions', formData)
        genericSuccess('New Mission created!')
        closePopupElement.click()
        dispatch(GET_PUBLIC_MISSIONS_ACTION)
      } catch (error) {
        genericError('An error occurred. Failed to create new mission.')
      }
    }
  },
  mutations: {
    [SET_PROFILE_MUTATION](state, user) {
      Vue.set(state, 'user', { ...user })
    },
    [SET_USERS_MUTATION](state, users) {
      Vue.set(state, 'users', [ ...users ])
    },
    [SET_PUBLIC_MISSIONS_MUTATION](state, missions) {
      Vue.set(state, 'missions', [ ...missions ])
    },
    [SET_MISSION_TYPES_MUTATION](state, types) {
      Vue.set(state, 'missionTypes', [ ...types ])
    },
  },
  getters: {
    [PUBLIC_MISSIONS_GETTER]: state => {
      if (state.missions.length === 0) {
        return []
      }
      return state.missions.filter(mission => mission.board_ids.find(id => id.toLowerCase() === 'public'))
    },
    [MISSION_TYPE_GETTER]: state => id => {
      if (state.missionTypes.length === 0) {
        return ''
      }
      return state.missionTypes.find(type => type.id === id).name
    },
    [MISSION_TYPES_FOR_SELECT_GETTER]: state => {
      const selectArray = []
      for (const type of state.missionTypes) {
        selectArray.push({
          label: type.name,
          value: type.uid,
        })
      }
      return selectArray
    }
  }
})
