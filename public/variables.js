const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
const form = document.querySelector('form')
const textField = document.getElementById('textField')
const socket = (window.location.href == "localhost:3000") ? io.connect('localhost:3000') : io.connect('https://paaskespill.herokuapp.com/')

const player_left = new Image()
player_left.src="assets/player_left.png"

const player_right = new Image()
player_right.src="assets/player_right.png"

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

const imgs = [stone, log, leaves, coal_ore, grass, iron_ore, dirt]

canvas.width = 1280
canvas.height = 640
const w = window.innerWidth
const h = window.innerHeight