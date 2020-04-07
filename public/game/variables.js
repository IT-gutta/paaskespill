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

const air = new Image()
air.src="assets/air.png"

const grass = new Image()
grass.src="assets/grass.png"

const dirt = new Image()
dirt.src="assets/dirt.png"

const log = new Image()
log.src="assets/log.png"

const leaves = new Image()
leaves.src="assets/leaves.png"

const stone = new Image()
stone.src="assets/stone.png"

const coal_ore = new Image()
coal_ore.src="assets/coal_ore.png"

const iron_ore = new Image()
iron_ore.src="assets/iron_ore.png"

const sky = new Image()
sky.src="assets/sky.png"

const inventory = new Image()
inventory.src="assets/inventory.png"

const imgs = [air, stone, log, leaves, coal_ore, grass, iron_ore, dirt]

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
