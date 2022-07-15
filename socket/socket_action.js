global.onlineUsers = []

module.exports = (io) => {
    io.on("connection", (socket) => {

        console.log("connect teacher or student to socket.io")

        socket.on("add-user", ({userId, status}) => {
            let obj = global.onlineUsers.find(user => user && user.userId === userId)
            if(userId && !obj)
                onlineUsers.push({userId: userId, sockedId: socket.id, status: status})

            socket.on("send-request", (group) => {
                onlineUsers.forEach(user =>{
                    console.log(user)
                    if(group.teacher_id == user.userId){
                        onlineUsers.forEach(elem => {
                            if(elem.userId == group.teacher_id)
                                socket.to(elem.sockedId).emit('response-from-teacher',group)
                        })
                    }
                })
                console.log(group.teacher_id,"<---")
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