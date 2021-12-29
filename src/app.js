const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const formatMessage = require("./helpers/formatMessage");
const app = express();
const server = http.createServer(app);

const io = socketio(server);

const port = 3000;
const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

io.on("connection", socket => {
    socket.emit("message", formatMessage("Welcome!"));

    socket.broadcast.emit("message", formatMessage("Another user has joined"));

    socket.on("sendMessage", (message, callback) => {
        if(message == "bro"){
            return callback("You are not allowed to say that");
        }
        socket.broadcast.emit("message", formatMessage(message));
        callback();
    });

    socket.on("location", (message, callback)=>{
        socket.broadcast.emit("locationMessage", formatMessage(`https://google.com/maps?q=${message.latitude},${message.longitude}`));
        callback();
    })
    // // socket.on("updateCount", ()=>{
    // //     count++;
    // //     console.log(count);
    // //     // socket.emit("countUpdated", count);
    // //     io.emit("countUpdated", count);
    // // })
    // // console.log(io);
    socket.on("disconnect", ()=>{
        console.log("user disconnected");
        io.emit("userDisconnected", "A user has disconnected");
    })
});


server.listen(port, (err)=>{
    if(err) throw err;
    console.log(`listening to port ${port}`)
});