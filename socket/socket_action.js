global.onlineUsers = new Map()

module.exports = (io) => {
    io.on("connection", (socket) => {

        console.log("connect teacher or student to socket.io")

        socket.on("add-user", (userId) => {
            console.log(userId)
            onlineUsers.set(userId, socket.id);
        });

        socket.on('disconnect',  () => {
            socket.emit('disconnected');
            global.delete(userId)
        });

    });
}