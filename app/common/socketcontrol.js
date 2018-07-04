
module.exports = function(io){
    var usernames = [];
    io.sockets.on("connection", function(socket){
    //listen addUser
        socket.on("addUser", function(username){
            socket.username = username;
            usernames.push(username);
            //thông báo đến người đăng nhập

            var data = {
                sender: "SERVER",
                message: "Bạn đã tham gia phòng chat"
            };
            socket.emit("updateMessage", data);
            //thông báo đến các user  khác
            var data = {
                sender: "SERVER",
                message: username + " đã tham gia phòng chat"
            };
            socket.broadcast.emit("updateMessage", data);
        });

        //listen sendMessage event
        socket.on("sendMessage", function(message){
            //gui cho minh
            
            var data = {
                sender : "You",
                message: message
            };
            socket.emit("updateMessage",data);

            //gui cho nguoi khac

            var data = {
                sender : socket.username,
                message: message
            };
            socket.broadcast.emit("updateMessage",data);

        });

        //disconnect
        socket.on("disconnect", function(){
            //delete user
            for(var i = 0; i < usernames.length;i++)
                if(usernames[i] == socket.username){
                    usernames.splice(i,1);
                }
            //notify to other user
            var data = {
                sender: "SERVER",
                message: socket.username + " left the chatroom!"
            };
            socket.broadcast.emit("updateMessage",data);

        });
    });
}