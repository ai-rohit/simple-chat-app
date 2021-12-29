module.exports  = (text, user) =>{
    return {
        user: user,
        text: text,
        createdAt: new Date().getTime()
    }
}