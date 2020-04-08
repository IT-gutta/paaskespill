const socket = (window.location.href == "http://localhost:3000/world/") ? io.connect('localhost:3000') : io.connect('https://paaskespill.herokuapp.com/')
const button = document.querySelector('button')



class NoiseMap{
    constructor(width, height, scale){
        this.width = width
        this.height = height
        this.scale = scale
        this.inc = 0.0015
        this.xOff1 = 0
        this.xOff2 = 10000
        this.map = Array(this.width).fill(0)
        for(let x = 0; x < this.width; x++){
            let n1 = noise(this.xOff1)*this.height
            let n2 = noise(this.xOff2)*50 - 100
            let y = n1+n2
            this.map[x] = y
            this.xOff1 += this.inc
            this.xOff2 += this.inc
        }
    }
    draw(){
        beginShape()
        for(let x = 0; x < this.map.length; x++){
            vertex(x, this.map[x])
        }
        endShape()
    }
}

function createFromNoiseMap(noiseArr, width, height, scale){
    
    //lage et tomt 2-dimensjonalt array
    let map = []
    for(let y = 0; y < Math.floor(height/scale); y++){
        map.push([])
        for(let x = 0; x < Math.floor(width/scale); x++){
            map[y].push([])
            map[y][x] = 0
        }
    }


    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[y].length; x++){
            //hvis ruta befinner seg under noisegrafen
            if(y > noiseArr[x*scale]/scale){
                map[y][x] = 1
            }
        }
    }
    return map
}

let img = new Image()
img.src = "../game/assets/dirt.png"

function setup(){
    createCanvas(window.innerWidth, window.innerHeight)
    let noiseMap = new NoiseMap(width, height, undefined)
    let map = createFromNoiseMap(noiseMap.map, width, height, 32)
    
    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[y].length; x++){
            if(map[y][x] == 1) drawingContext.drawImage(img, x*32, y*32, 32, 32)
        }
    }
    // noiseMap.draw()

    button.addEventListener('click', () => {
        socket.emit('new-insert', "gameObjects", {map: map})
    })
}

