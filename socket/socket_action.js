global.onlineUsers = new Map()

module.exports = (io) => {
    io.on("connection", (socket) => {

        socket.on("add-user", (userId) => {
            onlineUsers.set(userId, socket.id);
        });

        socket.on('disconnect',  () => {
            socket.emit('disconnected');
            global.delete(userId)
        });

    });
}