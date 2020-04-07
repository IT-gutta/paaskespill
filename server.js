const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.set('json spaces', 2); // number of spaces for indentation
app.use(express.json());

const router = require('./modules/api/routes/routes')
app.use('/api', router)

// const routes = require('./routes/routes')
// app.use('/', routes)

const PORT = process.env.PORT || 3000

server.listen(PORT)

// ----variables
let users = {}
let map = require('./modules/variables').map
const g = 0.00004
const db = require('./modules/api/modules/db')


// functions
const gameFunctions = require('./modules/gameFunctions')
const usefulFunctions = require('./modules/usefulFunctions')
const dbFunctions = require('./modules/api/modules/dbFunctions')
const update = gameFunctions.update
const keysD = gameFunctions.keysD
const keysU = gameFunctions.keysU
const click = gameFunctions.click
const objectIsEmpty = usefulFunctions.objectIsEmpty
const userExists = usefulFunctions.userExists
const getPlayerData = dbFunctions.getPlayerData
const updatePlayerData = dbFunctions.updatePlayerData


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
    this.right = false,
    this.up = false
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

  socket.on('new-login', async username => {
    const playerData = await getPlayerData(username)
    if(!playerData){
      // not playerData -> spilleren er ny
      users[socket.id] = {username: username, player: new Player(username), controller: new Controller()}

      let updatedData = {player: users[socket.id].player, controller: users[socket.id].controller}

      updatePlayerData(username, updatedData)
    } else {
      // ellers bruker data fra databasen
      let temp = {username: username, player: playerData.player, controller: playerData.controller}
      users[socket.id] = temp
      users[socket.id].playerID = socket.id
    }
    socket.emit("playerID", socket.id)
    socket.emit("logged-in")
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
    if(!userExists(users, socket.id)) return
    px = Math.round(users[socket.id].player.x - 7/32 + (clientX - canvasWidth/2)/32)
    py = Math.round(users[socket.id].player.y + (clientY - canvasHeight/2)/32)
    PX = users[socket.id].player.x + (clientX - canvasWidth/2)/32
    PY = users[socket.id].player.y + (clientY - canvasHeight/2)/32
    click(button, px, py, PX, PY, users[socket.id].player)
  })

  socket.on('disconnect', () => {
    if(!userExists(users, socket.id)) return
      updatePlayerData(users[socket.id].username, users[socket.id].player, users[socket.id].controller)
      delete users[socket.id]
      console.log(socket.id + " disconnected.")
  })
})