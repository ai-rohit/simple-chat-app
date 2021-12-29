const users = [];

//addUser
//data= {id, username, room}
const addUser = ({id, username, room})=>{
    console.log(id, username , room)
    //sanitize and clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate data
    if(!username || !room){
        return {
            error: "Username and room are required"
        }
    }

    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error:"Username is in use!"
        }
    }

    //store user
    const user = {id, username, room};
    users.push(user);
    return {
        user
    };
}

//removeUser
const removeUser = (id)=>{
    const userIndex = users.findIndex((user)=>{
        return user.id === id;
    });
    if(userIndex !== -1){
        return users.splice(userIndex, 1)[0];
    }

}

//getUser
const getUser = (id)=>{
    return users.find(user=>{
        return user.id === id;
    })
}

//getUsersInRoom
const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();
    return users.filter(user=>{
        return user.room === room;
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}