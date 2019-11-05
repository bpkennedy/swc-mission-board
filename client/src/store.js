import Vue from 'vue'
import Vuex from 'vuex'
import { genericError, genericSuccess, sortArrayByObjectProperty } from './utils'
import {
  AVAILABLE_KEY,
  BIDDING_KEY,
  PENDING_KEY,
  APPROVING_KEY,
  PAYING_OUT_KEY,
  WITHDRAWN_KEY,
  DECLINED_KEY,
  COMPLETE_KEY,
  AVAILABLE_COLOR,
  BIDDING_COLOR,
  PENDING_COLOR,
  APPROVING_COLOR,
  WITHDRAWN_COLOR,
  PAYING_OUT_COLOR,
  DECLINED_COLOR,
  COMPLETE_COLOR,
} from './constants'

Vue.use(Vuex)

export const fqdn = window.location.protocol + '//' + window.location.host
const apiUrl = fqdn + '/api/v1/'

const statusColors = {
  [AVAILABLE_KEY]: AVAILABLE_COLOR,
  [BIDDING_KEY]: BIDDING_COLOR,
  [PENDING_KEY]: PENDING_COLOR,
  [APPROVING_KEY]: APPROVING_COLOR,
  [PAYING_OUT_KEY]: PAYING_OUT_COLOR,
  [WITHDRAWN_KEY]: WITHDRAWN_COLOR,
  [DECLINED_KEY]: DECLINED_COLOR,
  [COMPLETE_KEY]: COMPLETE_COLOR,
}

const initialState = () => {
  return {
    user: {},
    users: [],
    bids: [],
    missions: [],
    mission: {},
    boards: [],
    sectors: [],
    boardMissions: [],
    myMissions: [],
    notifications: [],
    missionTypes: [],
    filterLabel: 'All',
    statusColors,
  }
}

export const NEW_MISSION_FORM_RESET_EVENT = 'NEW_MISSION_FORM_RESET_EVENT'
export const START_ADMIN_TASK_ACTION = 'START_ADMIN_TASK_ACTION'
export const GET_INITIAL_APP_DATA = 'GET_INITIAL_APP_DATA'
export const GET_PROFILE_ACTION = 'GET_PROFILE_ACTION'
export const GET_USERS_ACTION = 'GET_USERS_ACTION'
export const GET_PUBLIC_MISSIONS_ACTION = 'GET_PUBLIC_MISSIONS_ACTION'
export const GET_MY_MISSIONS_ACTION = 'GET_MY_MISSIONS_ACTION'
export const GET_BOARD_MISSIONS_ACTION = 'GET_BOARD_MISSIONS_ACTION'
export const GO_TO_PRIVATE_BOARD = 'GO_TO_PRIVATE_BOARD'
export const GET_MISSION_ACTION = 'GET_MISSION_ACTION'
export const GET_MISSION_TYPES_ACTION = 'GET_MISSION_TYPES_ACTION'
export const CREATE_MISSION_ACTION = 'CREATE_MISSION_ACTION'
export const CREATE_BID_ACTION = 'CREATE_BID_ACTION'
export const ACCEPT_BID_ACTION = 'ACCEPT_BID_ACTION'
export const WITHDRAW_MISSION_ACTION = 'WITHDRAW_MISSION_ACTION'
export const DECLINE_MISSION_ACTION = 'DECLINE_MISSION_ACTION'
export const COMPLETE_MISSION_ACTION = 'COMPLETE_MISSION_ACTION'
export const MARK_PAID_MISSION_ACTION = 'MARK_PAID_MISSION_ACTION'
export const SET_MISSION_FILTER_LABEL_ACTION = 'SET_MISSION_FILTER_LABEL_ACTION'
export const MARK_READ_NOTIFICATIONS_ACTION = 'MARK_READ_NOTIFICATIONS_ACTION'

const SET_PROFILE_MUTATION = 'SET_PROFILE_MUTATION'
const SET_USERS_MUTATION = 'SET_USERS_MUTATION'
const SET_PUBLIC_MISSIONS_MUTATION = 'SET_MISSIONS_MUTATION'
const SET_MY_MISSIONS_MUTATION = 'SET_MY_MISSIONS_MUTATION'
const SET_BOARD_MISSIONS_MUTATION = 'SET_BOARD_MISSIONS_MUTATION'
const SET_MISSION_MUTATION = 'SET_MISSION_MUTATION'
const SET_BOARDS_MUTATION = 'SET_BOARDS_MUTATION'
const SET_SECTORS_MUTATION = 'SET_SECTORS_MUTATION'
const SET_MISSION_TYPES_MUTATION = 'SET_MISSION_TYPES_MUTATION'
const SET_BIDS_MUTATION = 'SET_BIDS_MUTATION'
const SET_MISSION_FILTER_LABEL_MUTATION = 'SET_MISSION_FILTER_LABEL_MUTATION'
const SET_NOTIFICATIONS_MUTATION = 'SET_NOTIFICATIONS_MUTATION'
export const PUSH_NEW_NOTIFICATION_MUTATION = 'PUSH_NEW_NOTIFICATION_MUTATION'

export const PUBLIC_MISSIONS_GETTER = 'PUBLIC_MISSIONS_GETTER'
export const MISSION_TYPE_GETTER = 'MISSION_TYPE_GETTER'
export const MISSION_TYPES_FOR_SELECT_GETTER = 'MISSION_TYPES_FOR_SELECT_GETTER'
export const BIDDERS_FOR_SELECT_GETTER = 'BIDDERS_FOR_SELECT_GETTER'
export const BOARDS_FOR_SELECT_GETTER = 'BOARDS_FOR_SELECT_GETTER'
export const SECTORS_FOR_SELECT_GETTER = 'SECTORS_FOR_SELECT_GETTER'
export const SECTOR_SYSTEMS_FOR_SELECT_GETTER = 'SECTOR_SYSTEMS_FOR_SELECT_GETTER'
export const BOARD_IMAGE_URL_GETTER = 'BOARD_IMAGE_URL_GETTER'
export const BOARD_NAME_GETTER = 'BOARD_NAME_GETTER'
export const USER_IMAGE_URL_GETTER = 'USER_IMAGE_URL_GETTER'
export const USER_NAME_GETTER = 'USER_NAME_GETTER'
export const UNREAD_NOTIFICATIONS_GETTER = 'UNREAD_NOTIFICATIONS_GETTER'
export const MISSION_IS_BIDDING = 'MISSION_IS_BIDDING'
export const MISSION_IS_PENDING = 'MISSION_IS_PENDING'
export const MISSION_IS_APPROVING = 'MISSION_IS_APPROVING'
export const MISSION_IS_PAID = 'MISSION_IS_PAID'

export default new Vuex.Store({
  state: initialState(),
  actions: {
    async [START_ADMIN_TASK_ACTION]({ commit }, task) {
      await Vue.prototype.$axios.post(apiUrl + 'tasks', { task })
      genericSuccess('Admin task completed without error.')
    },
    async [GET_INITIAL_APP_DATA]({ commit }) {
      const profile = Vue.prototype.$axios.get(apiUrl + 'users/me')
      const users = Vue.prototype.$axios.get(apiUrl + 'users')
      const missionTypes = Vue.prototype.$axios.get(apiUrl + 'mission-types')
      const publicMissions = Vue.prototype.$axios.get(apiUrl + 'missions/public')
      const myMissions = Vue.prototype.$axios.get(apiUrl + 'missions/me')
      const notifications = Vue.prototype.$axios.get(apiUrl + 'notifications/me')
      const boards = Vue.prototype.$axios.get(apiUrl + 'boards')
      const sectors = Vue.prototype.$axios.get(apiUrl + 'sectors')

      const bootupData = await Promise.all([
        profile,
        users,
        missionTypes,
        publicMissions,
        myMissions,
        notifications,
        boards,
        sectors
      ])
      commit(SET_PROFILE_MUTATION, bootupData[0].data)
      commit(SET_USERS_MUTATION, bootupData[1].data)
      commit(SET_MISSION_TYPES_MUTATION, bootupData[2].data)
      commit(SET_PUBLIC_MISSIONS_MUTATION, bootupData[3].data)
      commit(SET_MY_MISSIONS_MUTATION, bootupData[4].data)
      commit(SET_NOTIFICATIONS_MUTATION, bootupData[5].data)
      commit(SET_BOARDS_MUTATION, bootupData[6].data)
      commit(SET_SECTORS_MUTATION, bootupData[7].data)
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
    async [GET_MY_MISSIONS_ACTION]({ commit }) {
      const { data } = await Vue.prototype.$axios.get(apiUrl + 'missions/me')
      commit(SET_MY_MISSIONS_MUTATION, data)
    },
    async [GET_BOARD_MISSIONS_ACTION]({ commit }, { boardId, router }) {
      const { data } = await Vue.prototype.$axios.get(apiUrl + 'missions/board/' + boardId)
      commit(SET_BOARD_MISSIONS_MUTATION, data)
    },
    async [GO_TO_PRIVATE_BOARD]({ commit }, { boardId, boardName, router }) {
      try {
        await Vue.prototype.$axios.get(apiUrl + 'boards/' + boardId + '/member')
        router.push({
          name: 'boardMissions',
          params: {
            id: boardId,
            boardName,
          },
        })
      } catch (error) {
        genericError('You do not have access to this board.')
      }
    },
    async [GET_MISSION_ACTION]({ commit }, missionId) {
      const missionResponse = await Vue.prototype.$axios.get(apiUrl + 'missions/' + missionId)
      const bidsResponse = await Vue.prototype.$axios.get(apiUrl + 'missions/' + missionId + '/bids')
      commit(SET_MISSION_MUTATION, missionResponse.data)
      commit(SET_BIDS_MUTATION, bidsResponse.data)
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
        dispatch(GET_MY_MISSIONS_ACTION)
      } catch (error) {
        genericError('An error occurred. Failed to create new mission.')
      }
    },
    async [CREATE_BID_ACTION]({ dispatch }, { bidderId, missionId }) {
      await Vue.prototype.$axios.post(apiUrl + 'bids', {
        bidderId,
        missionId,
      })
      await dispatch(GET_MISSION_ACTION, missionId)
    },
    async [ACCEPT_BID_ACTION]({ dispatch }, { bidderId, missionId, bidId }) {
      await Vue.prototype.$axios.post(apiUrl + 'bids/' + bidId + '/accept', {
        bidderId,
        missionId,
      })
      await dispatch(GET_MISSION_ACTION, missionId)
    },
    async [WITHDRAW_MISSION_ACTION]({ dispatch }, { missionId }) {
      await Vue.prototype.$axios.put(apiUrl + 'missions/' + missionId + '/withdraw')
      await dispatch(GET_MISSION_ACTION, missionId)
    },
    async [DECLINE_MISSION_ACTION]({ dispatch }, { missionId }) {
      await Vue.prototype.$axios.put(apiUrl + 'missions/' + missionId + '/decline')
      await dispatch(GET_MISSION_ACTION, missionId)
    },
    async [COMPLETE_MISSION_ACTION]({ dispatch }, { missionId }) {
      await Vue.prototype.$axios.put(apiUrl + 'missions/' + missionId + '/complete')
      await dispatch(GET_MISSION_ACTION, missionId)
    },
    async [MARK_PAID_MISSION_ACTION]({ dispatch }, { missionId }) {
      await Vue.prototype.$axios.put(apiUrl + 'missions/' + missionId + '/paid')
      await dispatch(GET_MISSION_ACTION, missionId)
    },
    async [SET_MISSION_FILTER_LABEL_ACTION]({ commit }, label) {
      commit(SET_MISSION_FILTER_LABEL_MUTATION, label)
    },
    async [MARK_READ_NOTIFICATIONS_ACTION]({ state, commit, getters }) {
      const unreads = getters[UNREAD_NOTIFICATIONS_GETTER]
      if (state.user.uid && unreads.length > 0) {
        const notificationIds = unreads.map(u => u.uid)
        await Vue.prototype.$axios.put(apiUrl + 'notifications/mark-read', {
          notificationIds,
          readerUid: state.user.uid,
        })
        const updatedNotificationsResponse = await Vue.prototype.$axios.get(apiUrl + 'notifications/me')
        commit(SET_NOTIFICATIONS_MUTATION, updatedNotificationsResponse.data)
      }
    },
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
    [SET_MY_MISSIONS_MUTATION](state, missions) {
      Vue.set(state, 'myMissions', [ ...missions ])
    },
    [SET_BOARD_MISSIONS_MUTATION](state, boardMissions) {
      Vue.set(state, 'boardMissions', [ ...boardMissions ])
    },
    [SET_MISSION_MUTATION](state, mission) {
      Vue.set(state, 'mission', { ...mission })
    },
    [SET_BOARDS_MUTATION](state, boards) {
      Vue.set(state, 'boards', [ ...boards ])
    },
    [SET_SECTORS_MUTATION](state, sectors) {
      Vue.set(state, 'sectors', [ ...sectors ])
    },
    [SET_MISSION_TYPES_MUTATION](state, types) {
      Vue.set(state, 'missionTypes', [ ...types ])
    },
    [SET_BIDS_MUTATION](state, bids) {
      Vue.set(state, 'bids', [ ...bids ])
    },
    [SET_MISSION_FILTER_LABEL_MUTATION](state, label) {
      Vue.set(state, 'filterLabel', label)
    },
    [SET_NOTIFICATIONS_MUTATION](state, notifications) {
      Vue.set(state, 'notifications', notifications)
    },
    [PUSH_NEW_NOTIFICATION_MUTATION](state, notification) {
      Vue.set(state, 'notifications', [ notification, ...state.notifications ])
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
    [BIDDERS_FOR_SELECT_GETTER]: (state, getters) => {
      return state.bids.map(bid => ({
        label: getters.USER_NAME_GETTER(bid.bidder_id),
        value: bid.bidder_id,
        bidId: bid.uid,
      }))
    },
    [BOARDS_FOR_SELECT_GETTER]: state => {
      return state.boards.map(board => ({
        label: board.name,
        value: board.uid,
      })).filter(b => b.label.toLowerCase() !== 'public')
    },
    [BOARD_IMAGE_URL_GETTER]: state => boardUid => {
      const board = state.boards.find(board => board.uid === boardUid)
      return board ? board.image : undefined
    },
    [BOARD_NAME_GETTER]: state => boardUid => {
      const board = state.boards.find(board => board.uid === boardUid)
      return board ? board.name : undefined
    },
    [SECTORS_FOR_SELECT_GETTER]: state => {
      const unsortedSectors = state.sectors.map(sector => ({
        label: sector.name,
        value: sector.uid,
      }))
      return sortArrayByObjectProperty(unsortedSectors, 'label')
    },
    [SECTOR_SYSTEMS_FOR_SELECT_GETTER]: state => uid => {
      const sector = state.sectors.find(s => s.uid === uid)
      const unsortedSystems = sector.systems.map(sys => ({
        label: sys.name,
        value: sys.uid,
      }))
      return sortArrayByObjectProperty(unsortedSystems, 'label')
    },
    [USER_IMAGE_URL_GETTER]: state => uid => {
      const user = state.users.find(user => user.uid === uid)
      return user ? user.image : undefined
    },
    [USER_NAME_GETTER]: state => uid => {
      const user = state.users.find(user => user.uid === uid)
      return user ? user.handle : undefined
    },
    [MISSION_IS_BIDDING]: state => {
      return state.mission.status === AVAILABLE_KEY || state.mission.status === BIDDING_KEY
    },
    [MISSION_IS_PENDING]: state => {
      return state.mission.status === PENDING_KEY
    },
    [MISSION_IS_APPROVING]: state => {
      return state.mission.status === APPROVING_KEY
    },
    [MISSION_IS_PAID]: state => {
      return state.mission.status === PAYING_OUT_KEY
    },
    [UNREAD_NOTIFICATIONS_GETTER]: state => {
      return state.notifications.filter(n => !n.target_user_read.includes(state.user.uid))
    },
  }
})
