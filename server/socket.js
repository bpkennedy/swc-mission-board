export const initializeSocket = (server) => {
  const io = require('socket.io')(server)

  io.sockets.on('connection', (socket) => {
    socket.emit('news', { hello: 'world' })
    socket.on('my other event', (data) => {
      console.log(data)
    })
  })
  
  return io
}