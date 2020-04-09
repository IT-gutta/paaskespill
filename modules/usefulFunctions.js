let map = require("./variables").map

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

  function objectIsEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function userExists(object, id) {
  if(object.hasOwnProperty(id)) return true
  return false
}

function equalsSome(val, arr){
  let value = val
  for(let i = 0; i < arr.length; i++){
    if(arr[i] == value) return true
  }
  return false
}

function equalsAll(val, arr){
  let value = val
  for(let i = 0; i < arr.length; i++){
    if(arr[i] != value) return false
  }
  return true
}

function mapValue(pos){
  return map[Math.floor(pos.y)][Math.floor(pos.x)]
}

function updateMousePos(player, clientX, clientY, canvasWidth, canvasHeight){
    player.mouse.r.x = Math.round(player.x - 7/32 + (clientX - canvasWidth/2)/32)
    player.mouse.r.y = Math.round(player.y + (clientY - canvasHeight/2)/32)
    player.mouse.x = player.x + (clientX - canvasWidth/2)/32
    player.mouse.y = player.y + (clientY - canvasHeight/2)/32
}

function toggleSprint(player, bool){
  if(bool && player.falling) return
  player.sprinting = bool
}

function copy(ob){
  return JSON.parse(JSON.stringify(ob))
}

const f = num => Math.floor(num)
const c = num => Math.ceil(num)
const r = num => Math.r(num)

module.exports = {random, timer, objectIsEmpty, userExists, equalsSome, equalsAll, mapValue, updateMousePos, toggleSprint}