function getPlayerInfo(username) {
    const db = require('./db.js')
    return new Promise((resolve, reject) => {
        db.find({username: username}).toArray((err, result) => {
            console.log("inne i toArray-funksjonen")
            if(result[0].player != undefined){
                console.log("returner true!")
                resolve ({username: username, player: result[0].player, controller: result[0].controller})
            } else {
                console.log(result[0].player)
                resolve (false)
            } 
        })
    })
}

function updatePlayerInfo(username, player, controller) {
    const db = require('./db.js')
    db.update({username: username}, {$set: {player: player, controller: controller}})
}

module.exports = {getPlayerInfo, updatePlayerInfo}