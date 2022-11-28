global.onlineUsers = []

module.exports = (io) => {
    io.on("connection", (socket) => {

        console.log("connect teacher or student to socket.io")

        socket.on("add-user", ({userId, status}) => {
            let obj = global.onlineUsers.find(user => user && user.userId === userId)
            if(userId && !obj){
                onlineUsers.push({userId: userId, sockedId: socket.id, status: status})
            }
        })

        socket.on("send-request", (group) => {
            onlineUsers.forEach(user =>{
                if(group.teacher_id == user.userId){
                    socket.to(user.sockedId).emit('response-from-teacher',group);
                }
            })
        })

        socket.on("send-response", (data) => {
            onlineUsers.forEach(user =>{
                if(data.student_id == user.userId){
                    socket.to(user.sockedId).emit('response-from-student', data.group);
                }
            })
        })

        socket.on('disconnect',  () => {
            onlineUsers = onlineUsers.filter(elem => {
                if(elem !== undefined && elem.sockedId !== socket.id)
                    return elem
            })
            socket.emit('disconnected')
        })

    })
}