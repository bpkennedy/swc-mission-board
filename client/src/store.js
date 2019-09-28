import Vue from 'vue'
import Vuex from 'vuex'
import { genericError, genericSuccess } from './utils'

Vue.use(Vuex)

export const fqdn = window.location.protocol + '//' + window.location.host
const apiUrl = fqdn + '/api/v1/'

const initialState = () => {
  return {
    user: {},
    users: [],
    missions: [],
    boards: [],
    boardMissions: [],
    missionTypes: [],
  }
}

export const GET_INITIAL_APP_DATA = 'GET_INITIAL_APP_DATA'
export const GET_PROFILE_ACTION = 'GET_PROFILE_ACTION'
export const GET_USERS_ACTION = 'GET_USERS_ACTION'
export const GET_PUBLIC_MISSIONS_ACTION = 'GET_MISSIONS_ACTION'
export const GET_BOARD_MISSIONS_ACTION = 'GET_BOARD_MISSIONS_ACTION'
export const GET_MISSION_TYPES_ACTION = 'GET_MISSION_TYPES_ACTION'
export const CREATE_MISSION_ACTION = 'CREATE_MISSION_ACTION'

const SET_PROFILE_MUTATION = 'SET_PROFILE_MUTATION'
const SET_USERS_MUTATION = 'SET_USERS_MUTATION'
const SET_PUBLIC_MISSIONS_MUTATION = 'SET_MISSIONS_MUTATION'
const SET_BOARD_MISSIONS_MUTATION = 'SET_BOARD_MISSIONS_MUTATION'
const SET_BOARDS_MUTATION = 'SET_BOARDS_MUTATION'
const SET_MISSION_TYPES_MUTATION = 'SET_MISSION_TYPES_MUTATION'

export const PUBLIC_MISSIONS_GETTER = 'PUBLIC_MISSIONS_GETTER'
export const MISSION_TYPE_GETTER = 'MISSION_TYPE_GETTER'
export const MISSION_TYPES_FOR_SELECT_GETTER = 'MISSION_TYPES_FOR_SELECT_GETTER'
export const BOARDS_FOR_SELECT_GETTER = 'BOARDS_FOR_SELECT_GETTER'

export default new Vuex.Store({
  state: initialState(),
  actions: {
    async [GET_INITIAL_APP_DATA]({ commit }) {
      const profile = Vue.prototype.$axios.get(apiUrl + 'users/me')
      const users = Vue.prototype.$axios.get(apiUrl + 'users')
      const missionTypes = Vue.prototype.$axios.get(apiUrl + 'mission-types')
      const publicMissions = Vue.prototype.$axios.get(apiUrl + 'missions/public')
      const boards = Vue.prototype.$axios.get(apiUrl + 'boards')

      const bootupData = await Promise.all([profile, users, missionTypes, publicMissions, boards])
      commit(SET_PROFILE_MUTATION, bootupData[0].data)
      commit(SET_USERS_MUTATION, bootupData[1].data)
      commit(SET_MISSION_TYPES_MUTATION, bootupData[2].data)
      commit(SET_PUBLIC_MISSIONS_MUTATION, bootupData[3].data)
      commit(SET_BOARDS_MUTATION, bootupData[4].data)
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
    async [GET_BOARD_MISSIONS_ACTION]({ commit }, { boardId, router }) {
      try {
        const { data } = await Vue.prototype.$axios.get(apiUrl + 'missions/board/' + boardId)
        commit(SET_BOARD_MISSIONS_MUTATION, data)
      } catch (error) {
        if (error.response.data.message === 'Forbidden') {
          genericError('You do not have access to this board.')
          router.back()
        }
      }
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
    [SET_BOARD_MISSIONS_MUTATION](state, boardMissions) {
      Vue.set(state, 'boardMissions', [ ...boardMissions ])
    },
    [SET_BOARDS_MUTATION](state, boards) {
      Vue.set(state, 'boards', [ ...boards ])
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
      return state.missionTypes.map(type => ({
        label: type.name,
        value: type.uid,
      }))
    },
    [BOARDS_FOR_SELECT_GETTER]: state => {
      return state.boards.map(board => ({
        label: board.name,
        value: board.uid,
      })).filter(b => b.label.toLowerCase() !== 'public')
    }
  }
})
