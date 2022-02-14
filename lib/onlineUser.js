const onlineUsersObj = function(list){
    this.member = list
}


onlineUsersObj.prototype.getNameList = function(){
    const tmp = []
    for(let obj of this.member){
        if( tmp.indexOf(obj.username) == -1){
            tmp.push(obj.username)
        }
    }
    return(tmp);
}

onlineUsersObj.prototype.getMember = function(){
    return this.member
}

onlineUsersObj.prototype.remove = function(sid){
    this.member = this.member.filter(obj => obj.sid !=  sid)
    return this
}

onlineUsersObj.prototype.add = function(sid, username){
    this.member.push({"sid" : sid, "username" : username})
    return this
}

module.exports = onlineUsersObj