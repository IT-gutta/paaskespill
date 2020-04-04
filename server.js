const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


const PORT = process.env.PORT || 3000

server.listen(PORT)

// ----variables
let users = {}
const map = require('./modules/variables')
const collisionPrec = 10
const g = 0.00004

// functions
const gameFunctions = require('./modules/gameFunctions')
const update = gameFunctions.update
const keysD = gameFunctions.keysD
const keysU = gameFunctions.keysU
const objectIsEmpty = require('./modules/usefulFunctions').objectIsEmpty

class Player {
  constructor(username) {
    this.username = username
    this.x = 28,
    this.y = 8,
    this.direction = "",
    this.moving = false,
    this.falling = false,
    this.vx = 0,
    this.vy = 0
  }
}

class Controller {
  constructor() {
    this.left = false,
    this.right = false
  }
}

function heartbeat(){
  if(!objectIsEmpty(users)) {
    for (let [id, user] of Object.entries(users)) {
      for (let i = 0; i < 10; i++) {
        update(user.player, map)      
      }
    }
      io.emit('heartbeat', map, users, g)
  }
}


setInterval(heartbeat, 1000/60)

io.on('connection', socket => {
  console.log("connected: " + socket.id)
  
  socket.on('new-user', (username) => {
    users[socket.id] = {player: new Player(username), controller: new Controller()}
  })

  socket.on('keysD', keyCode => {
    keysD(keyCode, users[socket.id].player, users[socket.id].controller)
  })

  socket.on('keysU', keyCode => {
    keysU(keyCode, users[socket.id].player, users[socket.id].controller)
  })
})