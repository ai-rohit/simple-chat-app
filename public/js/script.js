const socket = io();


const sendBtn = document.querySelector("#location");
const messageInput = document.querySelector("#message");
const btn = document.querySelector("#send");
const messages = document.querySelector("#messages");
const messageTemp = document.querySelector("#message-template").innerHTML;
const locationTemp = document.querySelector("#location-template").innerHTML;
const sidebarTemp = document.querySelector("#sidebar-template").innerHTML;
// console.log(socket);

// socket.on("countUpdated", (count) =>{
//     console.log("count updated");
//     console.log(count);
// })

const {username, room} = Qs.parse(location.search.replace("?", ""));

const autoscroll = () =>{
    const newMessage = messages.lastElementChild;
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
    const visibleHeight = messages.offsetHeight;

    const contentHeight = messages.scrollHeight;

    const scrollOffset = messages.scrollTop + visibleHeight;

    if(contentHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight;
    }


}

socket.on("message", (message)=>{
    const html = Mustache.render(messageTemp, {
                                            username: message.user,
                                            message: message.text, 
                                            createdAt: moment(message.createdAt).format("h:mm a")
                                         });         
    messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
})
socket.on("locationMessage", (message)=>{
    console.log(message)
    const html = Mustache.render(locationTemp, {username:message.user,message: message.text, createdAt: moment(message.createdAt).format("h:mm a")});
    messages.insertAdjacentHTML("beforeend", html);  
    autoscroll();  
})


btn.addEventListener("click", ()=>{
    if(messageInput.value==""){
        return alert("Please enter a message before sending")
    }else{
        btn.setAttribute("disabled", "disabled");
        socket.emit("sendMessage", messageInput.value, (message)=>{
            if(message){
                btn.removeAttribute("disabled");
                return console.log(message);
            }
            btn.removeAttribute("disabled");
            messageInput.value = "";
            messageInput.focus();
            autoscroll();
        });
    }
})

sendBtn.addEventListener("click", ()=>{
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
    autoscroll();
});

socket.emit("join", {username, room}, (error)=>{
    if(error){
        alert(error);
        location.href = "/";
    }
});

const sidebar = document.querySelector("#sidebar");
socket.on("roomData", ({room, users})=>{
    const html = Mustache.render(sidebarTemp, {
        room,
        users
    })
    sidebar.innerHTML = html;
})