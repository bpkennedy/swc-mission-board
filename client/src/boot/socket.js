import io from 'socket.io-client'
import { PUSH_NEW_NOTIFICATION_MUTATION } from '../store'

function setNotificationListener(Vue, store) {
  Vue.prototype.$socket.on('broadcast', (message) => {
    const notification = JSON.parse(message)
    const currentUserUid = store.state.user.uid
    if (notification.target_user_uids.includes(currentUserUid) || notification.origin_user_uid === currentUserUid) {
      store.commit(PUSH_NEW_NOTIFICATION_MUTATION, notification)
    }
  })
}

export default async ({ Vue, store }) => {
  const hostUrl = window.location.protocol + '//' + window.location.host + '/'
  Vue.prototype.$socket = io(hostUrl)
  setNotificationListener(Vue, store)
}
