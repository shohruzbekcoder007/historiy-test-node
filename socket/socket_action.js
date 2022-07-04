global.onlineUsers = []

module.exports = (io) => {
    io.on("connection", (socket) => {

        console.log("connect teacher or student to socket.io")

        socket.on("add-user", ({userId, status}) => {
            let obj = global.onlineUsers.find(user => user && user.userId === userId)
            if(userId && !obj)
                onlineUsers.push({userId: userId, sockedId: socket.id, status: status})

            console.log(onlineUsers)
            onlineUsers.forEach(user => {
                if(user.status)
                    socket.to(user?.sockedId).emit("new-msg", "send message");
            })
        });

        socket.on('disconnect',  () => {
            onlineUsers = onlineUsers.filter(elem => {
                if(elem !== undefined && elem.sockedId !== socket.id)
                    return elem
            })
            socket.emit('disconnected')
        });

    });
}