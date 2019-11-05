export const initializeSocket = (server) => {
  const io = require('socket.io')(server)

  io.sockets.on('connection', (socket) => {
    socket.emit('news', 'websocket connected')
  })
  
  return io
}