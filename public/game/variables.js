const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
const form = document.querySelector('form')
const textField = document.getElementById('textField')
const socket = (window.location.href == "http://localhost:3000/game/") ? io.connect('localhost:3000') : io.connect('https://paaskespill.herokuapp.com/')
let playerID


function newImg(src){
    let img = new Image()
    img.src = src
    return img
}

const playerSprites = {
    "girl": [newImg("assets/girl_left.png"), newImg("assets/girl_left.png"), newImg("assets/girl_front.png"), newImg("assets/girl_right.png"), newImg("assets/girl_right.png")],
    "boy": [newImg("assets/boy_leftW1.png"), newImg("assets/boy_left.png"), newImg("assets/boy_front.png"), newImg("assets/boy_right.png"), newImg("assets/boy_rightW1.png")]
}

const air = newImg("assets/air.png")

const grass = newImg("assets/grass.png")

const dirt = newImg("assets/dirt.png")

const log = newImg("assets/log.png")

const leaves = newImg("assets/leaves.png")

const stone = newImg("assets/stone.png")

const coal_ore = newImg("assets/coal_ore.png")

const iron_ore = newImg("assets/iron_ore.png")

const safe = newImg("assets/safe.png")

const sky = newImg("assets/sky.png")

const inventory = newImg("assets/inventory.png")

const safe_inside = newImg("assets/safe_inside.png")

const imgs = [air, stone, log, leaves, coal_ore, grass, iron_ore, dirt, safe]



canvas.width = window.innerWidth
canvas.height = window.innerHeight
const w = window.innerWidth
const h = window.innerHeight
var clientX = 0
var clientY = 0
var users = {}

function equalsSome(val, arr){
  let value = val
  for(let i = 0; i < arr.length; i++){
    if(arr[i] == value) return true
  }
  return false
}
