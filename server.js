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
let variables = require('./modules/variables')
let map = variables.map
let interactables = variables.interactables
const g = 0.00004
const db = require('./modules/db')


// functions
const Item = variables.Item
const Safe = variables.Safe
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
const mapValue = usefulFunctions.mapValue
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
    this.inventory = {
      arr: []
    }
    // this.holdsItem = false

    for(let i = 0; i < 32; i++){
      this.inventory.arr.push(new Item("block", Math.floor(Math.random()*7), Math.floor(Math.random()*64), i, "inventory"))
    }

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
      x: undefined,
      y: undefined,
      counter: 0,
      delay: 50,
      keys: {
        0: false,
        2: false
      },
      r:{
        x: undefined,
        y: undefined
      }
    }
    this.hotBarSpot = 1
    this.hand = new Item("block", 3, 10)
    

    this.selectedSwap = 0
    this.safe = ""
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

  //change hotBarItem og hover, key er 1, 2, 3, 4 etc...
  socket.on("changeItem", key => {
    users[socket.id].player.hotBarSpot = key
    users[socket.id].player.hand = users[socket.id].player.inventory.arr[23+key]
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
    if(!userExists(users, socket.id)) return
    updateMousePos(users[socket.id].player, clientX, clientY, canvasWidth, canvasHeight)
    users[socket.id].player.mouse.keys[button] = true
    var player = users[socket.id].player


    //interaksjon
    if(button==2 && interactables.indexOf(mapValue(player.mouse))){
      socket.emit(interaction(users[socket.id].player), player.mouse.r.x, player.mouse.r.y, users[socket.id].player.safe)
    }

    
    else{
      click(button, users[socket.id].player)
    }
  })

  socket.on("mousemove", (clientX, clientY, canvasWidth, canvasHeight) => {
    if(!userExists(users, socket.id)) return
    updateMousePos(users[socket.id].player, clientX, clientY, canvasWidth, canvasHeight)
  })

  socket.on("mouseup", button => {
    if(!userExists(users, socket.id)) return
    users[socket.id].player.mouse.keys[button] = false
  })
  // socket.on('click', (button, clientX, clientY, canvasWidth, canvasHeight) => {
  //   px = Math.round(users[socket.id].player.x - 7/32 + (clientX - canvasWidth/2)/32)
  //   py = Math.round(users[socket.id].player.y + (clientY - canvasHeight/2)/32)
  //   PX = users[socket.id].player.x + (clientX - canvasWidth/2)/32
  //   PY = users[socket.id].player.y + (clientY - canvasHeight/2)/32
  //   if(button==2 && interact.indexOf(map[py][px])!=-1){
  //     socket.emit(interaction(px, py, users[socket.id].player), px, py, users[socket.id].player.safe)
  //   }
  //   else{
  //     click(button, px, py, PX, PY, users[socket.id].player)
  //   }
  
  //mutering av inventory og safer
  socket.on('swap', (index, type) => {
    if(!userExists(users, socket.id)) return
    console.log(index, type)

    let player = users[socket.id].player
    let swap = player.selectedSwap
    if(swap){
      //tuple switch for å bytte index
      let temp1 = player[swap.container].arr[swap.index].index
      player[swap.container].arr[swap.index].index = player[type].arr[index].index
      player[type].arr[index].index = temp1
      
      //tuple switch for å bytte container(hvis like endres ikke noe)
      let temp2 = player[swap.container].arr[swap.index].container
      player[swap.container].arr[swap.index].container = player[type].arr[index].container
      player[type].arr[index].container = temp2
      
      //tuple switch for å bytte posisjon i arraysa
      let temp3 = player[swap.container].arr[swap.index]
      player[swap.container].arr[swap.index] = player[type].arr[index]
      player[type].arr[index] = temp3

      player[type].arr[index].highlighted = false

      player.selectedSwap = null
    }
    else{
      // console.log(player.selectedSwap)
      player[type].arr[index].highlighted = true
      player.selectedSwap = player[type].arr[index]
    }
  })

  socket.on('disconnect', () => {
    if(!userExists(users, socket.id)) return
    // updatePlayerInfo(socket[id].username)
    delete users[socket.id]
    console.log(socket.id + " disconnected.")
  })
})