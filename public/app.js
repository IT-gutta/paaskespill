const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")
const form = document.querySelector('form')
const text = document.getElementById('text')
const socket = io.connect('https://snake-multiplayer-hs.herokuapp.com/');
const scoreboard = document.querySelector('.scoreboard')
const content = document.querySelector('.content')


let scale, cWidth, cHeight, cols, rows

socket.on('welcome', data => {
    console.log(data)
    scale = data.scale
    cWidth = data.cWidth
    cHeight = data.cHeight
    cols = data.cols
    rows = data.rows
    canvas.width = cWidth
    canvas.height = cHeight
})


function ruter() {
    for (let i = 0; i <= cols; i+=1) {
        c.beginPath()
        c.strokeStyle = "grey"
        c.moveTo(i*scale, 0)
        c.lineTo(i*scale, cHeight)
        c.stroke()
    }
    for (let i = 0; i < rows; i+=1) {
        c.beginPath()
        c.strokeStyle = "grey"
        c.moveTo(0, i*scale)
        c.lineTo(cWidth, i*scale)
        c.stroke()
    }
}

ruter()





function newSnake(snake, name) {
    socket.emit('new-snake', snake, name)
}

function updateSnake(snake) {
    socket.emit('update-snake', snake)
}



function fillScoreboard(users) {
    topscores = []
    for (let [key, snake] of Object.entries(users)) {
        topscores.push({name: snake.name, score: snake.tail.length})
    }
    topscores.sort((a,b) => b.score - a.score)
    scoreboard.innerHTML = ""
    topscores.forEach((snake, i) => {
        scoreboard.innerHTML += `<div> ${i+1}: ${snake.name} ${snake.score}`
    })
}


form.onsubmit = e => {
    e.preventDefault()
    form.style = "display: none;"
    content.style = "display: block;"
    ruter()

    window.addEventListener('keydown', (e => {
        if(e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowRight" || e.key == "ArrowLeft") {
        let direction = e.key.replace('Arrow', '');
        socket.emit('change-direction', direction)
        }
      }));
    
    window.addEventListener('keydown', (e => {
        if(e.code == "Space") {
        socket.emit('boost')
        }
      }));
    
    window.addEventListener('keydown', (e => {
    if(e.key == "d") {
        socket.emit('cheat')
    }
    }));
    
    socket.on('time-to-boost', data => {
        console.log("TIME LEFT: " + data + "s")
    })

    snake = new Snake()
    newSnake(snake, text.value)
    console.log(text.value)

    socket.on('heartbeat', (users, fruit, deathfruits) => {
        c.clearRect(0, 0, cWidth, cHeight)
        ruter()
        c.drawImage(eple, fruit.x, fruit.y, scale, scale)
        deathfruits.forEach(fruit => c.drawImage(eple, fruit.x, fruit.y, scale, scale))
        for (let [key, snake] of Object.entries(users)) {
            if(snake.tail.length > 0){
                drawTails(snake)
            }
            drawRotated(hode, snake.x, snake.y, snake.angle)
            name(snake.x, snake.y, snake.name)
        }
        fillScoreboard(users)
    })
}
    


