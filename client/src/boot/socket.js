import io from 'socket.io-client'

export default async ({ Vue }) => {
  const hostUrl = window.location.protocol + '//' + window.location.host + '/'
  Vue.prototype.$socket = io(hostUrl)
}
