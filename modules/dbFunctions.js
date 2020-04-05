function getPlayerInfo(username) {
    const db = require('db.js')
    db.find({username: username}).toArray((err, result) => {
        if(result.player && result.controller) return {username: username, player: result.player, controller: result.controller}
        else return false
    })
}

function updatePlayerInfo(username, player, controller) {
    const db = require('db.js')
    db.update({username: username}, {$set: {player: player, controller: controller}})
}

module.exports = {getPlayerInfo, updatePlayerInfo}