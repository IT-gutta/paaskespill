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


io.on('connection', socket => {
  console.log("connected: " + socket.id)
})