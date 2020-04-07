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
let interact = require('./modules/variables').interact
const g = 0.00004
const db = require('./modules/db')


// functions
const gameFunctions = require('./modules/gameFunctions')
const usefulFunctions = require('./modules/usefulFunctions')
const dbFunctions = require('./modules/dbFunctions')
const update = gameFunctions.update
const updateSprites = gameFunctions.updateSprites
const keysD = gameFunctions.keysD
const keysU = gameFunctions.keysU
const click = gameFunctions.click
const interaction = gameFunctions.interaction
const objectIsEmpty = usefulFunctions.objectIsEmpty
const userExists = usefulFunctions.userExists
const updateMousePos = usefulFunctions.updateMousePos
const getPlayerInfo = dbFunctions.getPlayerInfo
const updatePlayerInfo = dbFunctions.updatePlayerInfo


class Player {
  constructor(username) {
    this.username = username
    this.x = 28,
    this.y = 8,
    this.direction = "front",
    this.moving = false,
    this.falling = false,
    this.vx = 0,
    this.vy = 0
    this.inventory = [
      [1,5],[4,4],[1,5],[1,5],[1,5],[1,5],[1,5],[1,5],
      [1,5],[1,5],[1,5],[1,5],[1,5],[1,5],[1,5],[1,5],
      [1,5],[5,60],[1,5],[1,5],[1,5],[1,5],[1,5],[1,5],
      [3,1],[1,5],[1,5],[1,5],[1,5],[1,5],[1,5],[1,5],
    ]

    this.pos = {
      topLeft: undefined,
      topRight: undefined,
      midLeft: undefined,
      midRight: undefined,
      botLeft: undefined,
      botRight: undefined
    }
    this.sprite = {
      index: 2,
      playerSprite: "boy",
      delay: 100,
      counter: 0
    }

    this.mouse = {
      counter: 0,
      delay: 50,
      keys: {
        0: false,
        2: false
      },
      px: undefined,
      py: undefined,
      PX: undefined,
      PY: undefined
    }
    this.selectedSwap = [{type:"", index:-1},{type:"", index:-1}]
    this.currentSafe = ""
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
  
  socket.on('new-user', (username) => {
    
    users[socket.id] = {username: username, player: new Player(username), controller: new Controller(), playerID: socket.id}
    
    socket.emit("playerID", socket.id)

    console.log(socket.id)

  })

  socket.on('keysD', (keyCode, clientX, clientY, canvasWidth, canvasHeight) => {
    if(!userExists(users, socket.id)) return
    keysD(keyCode, users[socket.id].player, users[socket.id].controller)
    updateMousePos(users[socket.id].player, clientX, clientY, canvasWidth, canvasHeight)
  })

  socket.on('keysU', keyCode => {
    if(!userExists(users, socket.id)) return
    keysU(keyCode, users[socket.id].player, users[socket.id].controller)
  })

  socket.on('mousedown', (button, clientX, clientY, canvasWidth, canvasHeight) => {
    updateMousePos(users[socket.id].player, clientX, clientY, canvasWidth, canvasHeight)
    users[socket.id].player.mouse.keys[button] = true
    var player = users[socket.id].player
    //interaksjon
    if(button==2 && interact.indexOf(map[player.mouse.py][player.mouse.px])!=-1){
      socket.emit(interaction(player.mouse.px, player.mouse.py, users[socket.id].player), player.mouse.px, player.mouse.py, users[socket.id].player.currentSafe)
    }
    else{
      click(button, users[socket.id].player)
    }
  })

  socket.on("mousemove", (clientX, clientY, canvasWidth, canvasHeight) => {
    updateMousePos(users[socket.id].player, clientX, clientY, canvasWidth, canvasHeight)
  })

  socket.on("mouseup", button => {
    users[socket.id].player.mouse.keys[button] = false
  })
  // socket.on('click', (button, clientX, clientY, canvasWidth, canvasHeight) => {
  //   px = Math.round(users[socket.id].player.x - 7/32 + (clientX - canvasWidth/2)/32)
  //   py = Math.round(users[socket.id].player.y + (clientY - canvasHeight/2)/32)
  //   PX = users[socket.id].player.x + (clientX - canvasWidth/2)/32
  //   PY = users[socket.id].player.y + (clientY - canvasHeight/2)/32
  //   if(button==2 && interact.indexOf(map[py][px])!=-1){
  //     socket.emit(interaction(px, py, users[socket.id].player), px, py, users[socket.id].player.currentSafe)
  //   }
  //   else{
  //     click(button, px, py, PX, PY, users[socket.id].player)
  //   }
  
  //mutering av inventory og safer
  socket.on('swap', (pos, inventory) => {
    console.log(pos)
    let player = users[socket.id].player
    if(player.selectedSwap[0].index==-1){
      player.selectedSwap[0].type = inventory
      player.selectedSwap[0].index = pos
    }
    else{
      player.selectedSwap[1].index = pos
      player.selectedSwap[1].type = inventory
      if(player.selectedSwap[0].type=="player"){
        var a = player.inventory[player.selectedSwap[0].index]
      }
      else if(player.selectedSwap[0].type=="safe"){
        var a = player.currentSafe.inventory[player.selectedSwap[0].index]
      }
      if(player.selectedSwap[1].type=="player"){
        var b = player.inventory[player.selectedSwap[1].index]
      }
      else if(player.selectedSwap[1].type=="safe"){
        var b = player.currentSafe.inventory[player.selectedSwap[1].index]
      }
      console.log(a, b)
      if(player.selectedSwap[0].type=="player"){
        player.inventory[player.selectedSwap[0].index] = b
      }
      else if(player.selectedSwap[0].type=="safe"){
        player.currentSafe.inventory[player.selectedSwap[0].index] = b
      }
      if(player.selectedSwap[1].type=="player"){
        player.inventory[player.selectedSwap[1].index] = a
      }
      else if(player.selectedSwap[1].type=="safe"){
        player.currentSafe.inventory[player.selectedSwap[1].index] = a
      }
      player.selectedSwap = [{type:"", index:-1},{type:"", index:-1}]
    }
  })

  socket.on('disconnect', () => {
    // updatePlayerInfo(socket[id].username)
    delete users[socket.id]
    console.log(socket.id + " disconnected.")
  })
})