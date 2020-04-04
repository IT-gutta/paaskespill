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
const delay = 50
const constants = {scale: 20, cWidth: 1500, cHeight: 800}
const scale = constants.scale
let fruit
constants.cols = constants.cWidth / scale
constants.rows = constants.cHeight / scale

const cols = constants.cols
const rows = constants.rows

let time, timerInt;
let boostCooldownInts = {}
let boostInts = {}
let boostTimerInts = {}
let deathFruits = []

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function timer(start, dur, func) {
  let delta = Date.now() - start; // milliseconds elapsed since start
  time = delta
  if (delta > dur) {
    func()
  }
}

function die(id) {
  users[id].tail.forEach(tail => {
    f = new deathFruit(tail.x, tail.y)
    deathFruits.push(f)
  })


  users[id].x = random(0, cols) * scale
  users[id].y = random(0, rows) * scale
  users[id].tail = []
  users[id].xs = scale
  users[id].ys = 0
}

function boost(id) {
  if(users[id]){
    let u = users[id]
      
      if(u.xs > 0 && u.ys == 0) u.direction = "Right"
      if(u.xs < 0 && u.ys == 0) u.direction = "Left" 
      if(u.ys > 0 && u.xs == 0) u.direction = "Down"
      if(u.ys < 0 && u.xs == 0) u.direction = "Up"
      
      for (let i = u.tail.length-1; i>0;  i--) {
        
        u.tail[i].x = u.tail[i-1].x
        u.tail[i].y = u.tail[i-1].y
      }

      if(u.tail.length > 0){
      u.tail[0].x = u.x         
      u.tail[0].y = u.y     
      }



      u.x += u.xs
      u.y += u.ys
      
      if(u.x / scale > cols-1)u.x = 0
      if(u.x < 0)u.x = cols*scale
      if(u.y / scale > rows-1)u.y = 0
      if(u.y < 0)u.y = rows*scale


      if(u.x == fruit.x && u.y == fruit.y){
        fruit.pickNewLocation()
        u.tail.push({})
      }

      deathFruits.forEach(fruit => {
        if(fruit.x == u.x && fruit.y == u.y){
          u.tail.push({})
          deathFruits.splice(deathFruits.indexOf(fruit), 1)
        }
      })
      
      for (let [key1, value] of Object.entries(users)) {
          users[key1].tail.forEach(tail => {
            if(u.x == tail.x && u.y == tail.y) {
              die(key1)
          }
        })
      }
      users[id] = u
      
      io.emit('heartbeat', users, fruit, deathFruits) 
  }
}


function heartbeat() {
    if(Object.keys(users).length > 0){
      if(timerInt != undefined) {
        clearInterval(timerInt)
        time = 0
      }
      timerInt = setInterval(timer, 10, Date.now())
    // console.log(snake.x/scale, snake.y/scale)
      for (let [id, snake] of Object.entries(users)) {
        let u = users[id]
        
        if(u.xs > 0 && u.ys == 0) u.direction = "Right"
        if(u.xs < 0 && u.ys == 0) u.direction = "Left" 
        if(u.ys > 0 && u.xs == 0) u.direction = "Down"
        if(u.ys < 0 && u.xs == 0) u.direction = "Up"
        
        for (let i = u.tail.length-1; i>0;  i--) {
          u.tail[i].x = u.tail[i-1].x
          u.tail[i].y = u.tail[i-1].y
        }

        if(u.tail.length > 0){
          u.tail[0].x = u.x         
          u.tail[0].y = u.y     
        }



        u.x += u.xs
        u.y += u.ys
        
        if(u.x / scale > cols-1)  u.x = 0
        if(u.x < 0)               u.x = cols*scale
        if(u.y / scale > rows-1)  u.y = 0
        if(u.y < 0)               u.y = rows*scale


        if(u.x == fruit.x && u.y == fruit.y){
          fruit.pickNewLocation()
          u.tail.push({})
        }

        deathFruits.forEach(fruit => {
          if(fruit.x == u.x && fruit.y == u.y){
            u.tail.push({})
            deathFruits.splice(deathFruits.indexOf(fruit), 1)
          }
        })
        

        for (let [subID, subSnake] of Object.entries(users)) {
          if(subSnake.tail){
            subSnake.tail.forEach(tail => {
              if(u.x == tail.x && u.y == tail.y) {
                console.log(snake)
                die(id)
                console.log(snake)
            }
          })
      }
      }
        users[id] = u
        
      }

      io.emit('heartbeat', users, fruit, deathFruits)
    }
  }

setInterval(heartbeat, delay)

io.on('connection', socket => {
  console.log("connected: " + socket.id)
  socket.emit('welcome', constants)
  
  
  socket.on('new-snake', (snake, name) =>  {
    if(Object.keys(users).length == 0)fruit = new Fruit()
    console.log(name)
    let u = users[socket.id]

    u = snake
    u.x = random(0, cols)*scale
    u.y = random(0, rows)*scale
    u.name = name
    u.color = rcolor()
    u.boost = rcolor()
    u.xs = scale

    users[socket.id] = u
  })

  socket.on('change-direction', direction => {
    if(users[socket.id])changeDirection(direction, socket)
  })

  socket.on('disconnect', () => {
    console.log(users)
    delete users[socket.id]
    console.log(users)
  })

  // socket.on('cheat', () => {
  //   if(users[socket.id] != null) {
  //   users[socket.id].tail.push({})
  //   }
  // })

  socket.on('boost', () => {
        if(users[socket.id].boostready == true){
          users[socket.id].boosting = true
          users[socket.id].boostready = false
          users[socket.id].started = Date.now()
          boostInts[socket.id] = setInterval(boost, delay, socket.id)
          boostCooldownInts[socket.id] = setInterval(timer, 10, Date.now(), 1000, ()=>{
            clearInterval(boostInts[socket.id]); 
            clearInterval(boostCooldownInts[socket.id])
            users[socket.id].boosting = false

          })
          boostTimerInts[socket.id] = setInterval(timer, 10, Date.now(), 5000, 
          () => {
            if(users[socket.id]) {
            users[socket.id].boostready = true;
             clearInterval(boostTimerInts[socket.id])
            }
            })
        } else {
          let timeleft = ((5000 - (Date.now() - users[socket.id].started)) / 1000).toFixed(2)
          socket.emit('time-to-boost', timeleft)
        } 
  })
})

function changeDirection(direction, socket) {
  let xs, ys, angle
  let s = users[socket.id]
  
  switch(direction) {
    case "Up":
      if(s.direction != "Down"){
      xs=0;
      ys=-scale*1;
      angle = 0
    }
      break;
    case "Down":
    if(s.direction != "Up"){
      xs=0;
      ys=scale*1;
      angle = Math.PI
    }
      break;
    case "Right":
    if(s.direction != "Left"){
      xs=scale*1;
      ys=0;
      angle = Math.PI / 2
    }
      break;
      case "Left":
      if(s.direction != "Right"){
        xs=-scale*1;
        ys=0;
        angle = 1.5 * Math.PI

      }
        break;
  }
  if(xs || ys){
    users[socket.id].xs = xs
    users[socket.id].ys = ys
    users[socket.id].angle = angle
  }
}

class deathFruit {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Fruit {
  constructor() {
      this.pickNewLocation()
  }

  pickNewLocation() {
      this.x = (Math.floor(Math.random()*cols))*scale
      this.y = (Math.floor(Math.random()*rows))*scale
  }
}

function rcolor() {
  color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
  return color;
}