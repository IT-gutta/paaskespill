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
let storage = variables.storage
let map
let mapInfo
storage.collection("map").get().then(snap =>{
  map = JSON.parse(snap.docs[2].data().stringifiedMap)
  mapInfo = snap.docs[snap.docs.length-1].data()
}).then( ()=>{
  //updater mappet til databasen hvert 15 sekund
  setInterval(() => {
    storage.collection("map").doc(mapInfo.index.toString()).set({stringifiedMap: JSON.stringify(map)})
  }, 30000)
})

let interactables = variables.interactables
const g = 0.00004
const db = require('./modules/db')


// functions
const Item = variables.Item
const Safe = variables.Safe
const Player = variables.Player
const Controller = variables.Controller
const gameFunctions = require('./modules/gameFunctions')
const usefulFunctions = require('./modules/usefulFunctions')
const dbFunctions = require('./modules/dbFunctions')
const recipes = require('./modules/recipes')
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
const copy = usefulFunctions.copy
const insertIntoCollection = dbFunctions.insertIntoCollection
const updatePlayerHand = gameFunctions.updatePlayerHand
const swap = gameFunctions.swap
const pickupItem = gameFunctions.pickupItem

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

  // change hotBarItem og hover, key er 1, 2, 3, 4 etc...
  socket.on("changeItem", key => {
    users[socket.id].player.hotBarSpot = key

    // begge disse er pekere som peker til et sted i minnet, siden de peker til sammme sted når man setter den ene lik den andre,
    // vil en endring av den ene resultere i en endring av den andre også, ingen av de har liksom sin egen verdi, programmet henter fram en verdi
    // fra denne minneplassen når man spør om det, og det er verdien som befinner seg i minnet som blir endret dersom man endrer objektet
    updatePlayerHand(users[socket.id].player)
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
    const player = users[socket.id].player


    //interaksjon
    if(button==2 && interactables.indexOf(mapValue(player.mouse, map))){
      socket.emit(interaction(users[socket.id].player, map), player.mouse.r.x, player.mouse.r.y, users[socket.id].player.safe)
    }

    
    else{
      click(button, users[socket.id].player, map)
    }
  })

  socket.on("mousemove", (clientX, clientY, canvasWidth, canvasHeight) => {
    if(!userExists(users, socket.id)) return
    updateMousePos(users[socket.id].player, clientX, clientY, canvasWidth, canvasHeight)
  })

  socket.on("mouseup", button => {
    if(!userExists(users, socket.id)) return
    users[socket.id].player.mouse.keys[button] = false
    users[socket.id].player.mining.active = false
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


  socket.on("closeInventory", () =>{
    const player = users[socket.id].player
    //fjerner highlight
    if(player.selectedSwap) player[player.selectedSwap.container].arr[player.selectedSwap.index].highlighted = false

    player.selectedSwap = null
    player.safe = null

    //sørger for at player.hand er oppdatert
    updatePlayerHand(player)
  })


  socket.on('swap', (index, container, button) => {
    if(!userExists(users, socket.id)) return
    swap(users[socket.id].player, index, container, button)
  })

  socket.on('pickUpCraftedItem', ()=>{
    pickupItem(users[socket.id].player, map, true)
  })

  socket.on('disconnect', () => {
    if(!userExists(users, socket.id)) return
    // updatePlayerInfo(socket[id].username)
    delete users[socket.id]
    console.log(socket.id + " disconnected.")
  })


  socket.on('new-insert', (collection, data) => {
    console.log("new insert!!", collection)
    insertIntoCollection(collection, data)
  })

})