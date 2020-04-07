const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

const loginContainer =document.getElementById('loginContainer')

const signupForm =document.getElementById('signupForm')
const signupUsernameInput =document.getElementById('signupUsernameInput')
const signupPasswordInput =document.getElementById('signupPasswordInput')


const loginForm =document.getElementById('loginForm')
const loginUsernameInput =document.getElementById('loginUsernameInput')
const loginPasswordInput =document.getElementById('loginPasswordInput')

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }
  
//   postData('https://example.com/answer', { answer: 42 })
//     .then((data) => {
//       console.log(data); // JSON data parsed by `response.json()` call
//     });






const textField = document.getElementById('textField')
const socket = (window.location.href == "http://localhost:3000/game/") ? io.connect('localhost:3000') : io.connect('https://paaskespill.herokuapp.com/')
let playerID

const player_left = new Image()
player_left.src="assets/girl_left.png"

const player_right = new Image()
player_right.src="assets/girl_right.png"

const player_front = new Image()
player_front.src="assets/girl_front.png"

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

canvas.width = window.innerWidth
canvas.height = window.innerHeight
const w = window.innerWidth
const h = window.innerHeight
var clientX = 0
var clientY = 0
var users = {}