const socket = require('socket.io')
const config = require('config')

const io = socket(server, {
    cors: {
        origin: config.get('front'),
        credentials: true
    }
})

require('../socket/socket_action')(io)