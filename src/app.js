const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const {addUser, removeUser, getUser, getUsersInRoom} = require("./helpers/users");
const formatMessage = require("./helpers/formatMessage");
const app = express();
const server = http.createServer(app);

const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

io.on("connection", socket => {
  

    socket.on("sendMessage", (message, callback) => {
        if(message == "bro"){
            return callback("You are not allowed to say that");
        }
        const user = getUser(socket.id);
        const room = user.room;
        io.to(room).emit("message", formatMessage(message, user.username));
        callback();
    });

    socket.on("location", (message, callback)=>{
        const user = getUser(socket.id);
        const room = user.room;
        io.to(room).emit("locationMessage", formatMessage(`https://google.com/maps?q=${message.latitude},${message.longitude}`, user.username));
        callback();
    })
    
    socket.on("join", (options, callback)=>{
        const res = addUser({id: socket.id, ...options});
        if(res.error){
            return callback(res.error);
        }
        socket.join(res.user.room);
        socket.emit("message", formatMessage("Welcome!","Admin"));
        socket.broadcast.to(res.user.room).emit("message", formatMessage(`${res.user.username} has joined the chat`, "Admin"));

        io.to(res.user.room).emit('roomData', {
            room: res.user.room,
            users: getUsersInRoom(res.user.room)
        });
        callback();

    })
    socket.on("disconnect", ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit("message", formatMessage(`${user.username} has left the chat`, "Admin"));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
});


server.listen(port, (err)=>{
    if(err) throw err;
    console.log(`listening to port ${port}`)
});