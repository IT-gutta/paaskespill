function getPlayerData(username) {
    const db = require('./db.js')
    return new Promise((resolve, reject) => {
        db.find({username: username}).toArray((err, result) => {
            if(result[0].gameData){
                resolve (result[0].gameData)
            } else {
                resolve (false)
            } 
        })
    })
}

function updatePlayerData(username, data) {
    const db = require('./db.js')
    db.update({username: username}, {$set: {gameData: data}})
}

module.exports = {getPlayerData, updatePlayerData}