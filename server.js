const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.set('json spaces', 2); // number of spaces for indentation

// const routes = require('./routes/routes')
// app.use('/', routes)

const PORT = process.env.PORT || 3000

server.listen(PORT)

// ----variables
let users = {}
let map = require('./modules/variables').map
const g = 0.00004
const db = require('./modules/db')


// functions
const gameFunctions = require('./modules/gameFunctions')
const usefulFunctions = require('./modules/usefulFunctions')
const dbFunctions = require('./modules/dbFunctions')
const update = gameFunctions.update
const keysD = gameFunctions.keysD
const keysU = gameFunctions.keysU
const click = gameFunctions.click
const objectIsEmpty = usefulFunctions.objectIsEmpty
const userExists = usefulFunctions.userExists
const getPlayerInfo = dbFunctions.getPlayerInfo
const updatePlayerInfo = dbFunctions.updatePlayerInfo


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
        update(user.player, map, g)      
      }
    }
      io.emit('heartbeat', map, users)
  }
}


setInterval(heartbeat, 1000/60)

io.on('connection', socket => {
  console.log("connected: " + socket.id)
  
  socket.on('new-user', (username) => {
    // if(!getPlayerInfo(username)) {
    //   users[socket.id] = {username: username, player: new Player(username), controller: new Controller()}
    //   updatePlayerInfo(username, users[socket.id].player, users[socket.id].controller)
    // } else {
    //   users[socket.id] = getPlayerInfo(username)
    // }
    
    users[socket.id] = {username: username, player: new Player(username), controller: new Controller(), playerID: socket.id}
    
    socket.emit("playerID", socket.id)

    console.log(socket.id)
    // console.log(socket.id)
    // console.log('new user: ' + username)
    // console.log('all users: ' + JSON.stringify(users))

  })

  socket.on('keysD', keyCode => {
    if(!userExists(users, socket.id)) return
    keysD(keyCode, users[socket.id].player, users[socket.id].controller)
  })

  socket.on('keysU', keyCode => {
    if(!userExists(users, socket.id)) return
    keysU(keyCode, users[socket.id].player, users[socket.id].controller)
  })

  socket.on('click', (button, clientX, clientY, canvasWidth, canvasHeight) => {
    px = Math.round(users[socket.id].player.x - 7/32 + (clientX - canvasWidth/2)/32)
    py = Math.round(users[socket.id].player.y + (clientY - canvasHeight/2)/32)
    PX = users[socket.id].player.x + (clientX - canvasWidth/2)/32
    PY = users[socket.id].player.y + (clientY - canvasHeight/2)/32
    click(button, px, py, PX, PY, users[socket.id].player)
  })

  socket.on('disconnect', () => {
    // updatePlayerInfo(socket[id].username)
    delete users[socket.id]
    console.log(socket.id + " disconnected.")
  })
})