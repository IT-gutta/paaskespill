const socket = (window.location.href == "http://localhost:3000/world/") ? io.connect('localhost:3000') : io.connect('https://paaskespill.herokuapp.com/')
// const button = document.querySelector('button')



class NoiseMap{
    constructor(width, height, scale, octaves, lacunarity, persistance, blockSize){
        this.width = width
        this.height = height
        this.scale = scale
        this.octaves = octaves
        this.lacunarity = lacunarity
        this.persistance = persistance
        this.blockSize = blockSize
        this.map = []
        this.minVal = Infinity
        this.maxVal = -Infinity
        this.noiseHeight = 0
        this.amplitude = 1
        this.frequency = 1
        for(let x = 0; x < Math.floor(this.width/blockSize); x++){
            this.amplitude = 1
            this.frequency = 1
            this.noiseHeight = 0

            for(let i = 0; i < this.octaves; i++){
                const sampleX = x / this.scale * this.frequency
                const perlinValue = noise(sampleX) * 2 - 1

                this.noiseHeight += perlinValue * this.amplitude

                //vet hele tiden hva som er den største og minste
                if(this.noiseHeight < this.minVal) this.minVal = this.noiseHeight
                else if(this.noiseHeight > this.maxVal) this.maxVal = this.noiseHeight

                this.amplitude *= this.persistance
                this.frequency *= this.lacunarity
            }
            this.map.push(this.noiseHeight)
        }

        //normalize values to between 0 and 1
        for(let i = 0; i < this.map.length; i++){
            this.map[i] = map(this.map[i], this.minVal, this.maxVal, 0, 1)
        }
        // console.log(this.map)
    }
    draw(){
        beginShape()
        for(let x = 0; x < this.map.length; x++){
            vertex(x*blockSize, map(this.map[x], 0, 1, 0, this.height))
        }
        endShape()
    }

    create2DArr(noiseMap, width, height, blockSize){
    
        //lage et tomt 2-dimensjonalt array
        let arr = []
        for(let y = 0; y < Math.floor(height/blockSize); y++){
            arr.push([])
            for(let x = 0; x < Math.floor(width/blockSize); x++){
                arr[y].push([])
                arr[y][x] = 0
            }
        }
    
    
        for(let y = 0; y < arr.length; y++){
            for(let x = 0; x < arr[y].length; x++){
                //hvis ruta befinner seg under noisegrafen
                let height = map(y, 0, arr.length-1, 0, 1)
                
                if(height > noiseMap[x] && arr[y]){
                    arr[y][x] = 1
                }
            }
        }
        return arr
    }
    
}


let img = new Image()
img.src = "../game/assets/blocks/general/dirt.png"
let scale, octaves, lacunarity, persistance, xPos, yPos, blockSize
let prevX, prevY, mouseIsPressed, slideSpeed
function setup(){
    createCanvas(window.innerWidth-5, window.innerHeight-5)
    colorMode(HSB)
    scale = createSlider(1, 1000, 50)
    octaves = createSlider(1, 10, 3)
    lacunarity = createSlider(100, 500, 200)
    persistance = createSlider(200, 1000, 500)
    xPos = createSlider(0, 10000, 0)
    yPos = createSlider(0, 10000, 0)
    blockSize = createSlider(4, 64, 32)
    slideSpeed = createSlider(1, 4, 1)

    scale.position(10, 20)
    octaves.position(10, 70)
    lacunarity.position(10, 120)
    persistance.position(10, 170)
    xPos.position(10, 220)
    yPos.position(10, 270)
    blockSize.position(10, 320)
    slideSpeed.position(10, 370)
    
    scale.style("width", "200px")
    octaves.style("width","200px")
    lacunarity.style("width", "200px")
    persistance.style("width", "200px")
    xPos.style("width", "200px")
    yPos.style("width", "200px")
    blockSize.style("width", "200px")
    slideSpeed.style("width", "200px")
    textSize(20)
    

    canvas.addEventListener("mousemove", e =>{
        if(mouseIsPressed){
            xPos.value(xPos.value() + (prevX-e.clientX)*slideSpeed.value())
            yPos.value(yPos.value() + (prevY-e.clientY)*slideSpeed.value())
            prevX = e.clientX
            prevY = e.clientY
        }
    })
    canvas.addEventListener("mousedown", e =>{
        mouseIsPressed = true
        prevX = e.clientX
        prevY = e.clientY
    })
    canvas.addEventListener("mouseup", e =>{
        mouseIsPressed = false
    })
}

function draw(){
    drawingContext.clearRect(0, 0, width, height)
    const sizeValue = blockSize.value()
    const xVal = xPos.value()
    const yVal = yPos.value()

    let noiseMap = new NoiseMap(10000, 3000, scale.value(), octaves.value(), lacunarity.value()/100, persistance.value()/1000, sizeValue)
    let map = noiseMap.create2DArr(noiseMap.map, 10000, 3000, sizeValue)
    
    // beginShape()
    // noiseMap.draw()
    // endShape()
    


    beginShape()
    for(let y = Math.floor(yVal/sizeValue); y < Math.floor(yVal+height/sizeValue); y++){
        for(let x = Math.floor(xVal/sizeValue); x < Math.floor(xVal + width/sizeValue); x++){
            if(map[y] && map[y][x] == 1) drawingContext.drawImage(img, x*sizeValue - xVal, y*sizeValue - yVal, sizeValue, sizeValue)
        }
    }
    endShape()

    text(`Scale: ${scale.value()}`, 10, 20)
    text(`Octaves: ${octaves.value()}`, 10, 70)
    text(`Lacunarity: ${lacunarity.value()/100}`, 10, 120)
    text(`Persistance: ${persistance.value()/1000}`, 10, 170)
    text(`xPos: ${xVal}`, 10, 220)
    text(`yPos: ${yVal}`, 10, 270)
    text(`blockSize: ${sizeValue}`, 10, 320)
    text(`Slidespeed: ${slideSpeed.value()}`, 10, 370)
}
// noLoop()