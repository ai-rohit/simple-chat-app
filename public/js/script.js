const socket = io();


const sendBtn = document.querySelector("#location");
const messageInput = document.querySelector("#message");
const btn = document.querySelector("#send");
const messages = document.querySelector("#messages");
const messageTemp = document.querySelector("#message-template").innerHTML;
const locationTemp = document.querySelector("#location-template").innerHTML;
// console.log(socket);

// socket.on("countUpdated", (count) =>{
//     console.log("count updated");
//     console.log(count);
// })

socket.on("message", (message)=>{
    console.log(message);
    const html = Mustache.render(messageTemp, {message: message.text, 
                                            createdAt: moment(message.createdAt).format("h:mm a")
                                         });         
    messages.insertAdjacentHTML("beforeend", html);
})
socket.on("locationMessage", (message)=>{
    console.log(message)
    const html = Mustache.render(locationTemp, {message: message.text, createdAt: moment(message.createdAt).format("h:mm a")});
    messages.insertAdjacentHTML("beforeend", html);    
})

socket.on("userDisconnected", (message)=>{
    console.log(message);
})

btn.addEventListener("click", ()=>{
    if(messageInput.value==""){
        alert("Please enter a message before sending")
    }else{
        btn.setAttribute("disabled", "disabled");
        socket.emit("sendMessage", messageInput.value, (message)=>{
            if(message){
                btn.removeAttribute("disabled");
                return console.log(message);
            }
            console.log("message delivered");
            btn.removeAttribute("disabled");
            messageInput.value = "";
            messageInput.focus();
        });
    }
})

sendBtn.addEventListener("click", ()=>{
    console.log("hello")
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by your browser");
    }
    sendBtn.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition(position=>{
        socket.emit("location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            console.log("location shared");
            sendBtn.removeAttribute("disabled");
        })
    })
});

// const btn = document.querySelector("#updateButton");


// btn.addEventListener("click", ()=>{
//     console.log("btn clicked")
//     socket.emit("updateCount");
// })