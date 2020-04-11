const socket = (window.location.href == "http://localhost:3000/world/") ? io.connect('localhost:3000') : io.connect('https://paaskespill.herokuapp.com/')
// const button = document.querySelector('button')


//nyttige funksjoner
const f = num => Math.floor(num)
const c = num => Math.ceil(num)
const r = num => Math.r(num)
const s = num => Math.sqrt(num)
const randInt = (fra_og_med, til) => Math.floor(Math.random()*(til-fra_og_med))+fra_og_med
const random = () => Math.random()
const pow = (num, ex) => Math.pow(num, ex)
function equalsSome(val, arr){
    let value = val
    for(let i = 0; i < arr.length; i++){
      if(arr[i] == value) return true
    }
    return false
  }

function newImg(src){
    let img = new Image()
    img.src = src
    return img
}
//bilder
const air = newImg("../game/assets/blocks/general/air.png")

const grass = newImg("../game/assets/blocks/general/grass.png")

const dirt = newImg("../game/assets/blocks/general/dirt.png")

const log = newImg("../game/assets/blocks/general/log.png")

const leaves = newImg("../game/assets/blocks/general/leaves.png")

const stone = newImg("../game/assets/blocks/general/stone.png")

const coal_ore = newImg("../game/assets/blocks/ores/coal_ore.png")

const iron_ore = newImg("../game/assets/blocks/ores/iron_ore.png")

const gold_ore = newImg("../game/assets/blocks/ores/gold_ore.png")

const plutonium_ore = newImg("../game/assets/blocks/ores/plutonium_ore.png")

const silver_ore = newImg("../game/assets/blocks/ores/silver_ore.png")

const uranium_ore = newImg("../game/assets/blocks/ores/uranium_ore.png")

const safe = newImg("../game/assets/blocks/interactables/safe.png")

const sky = newImg("../game/assets/backgrounds/sky.png")

const inventory = newImg("../game/assets/ui/inventory.png")

const safe_inside = newImg("../game/assets/ui/safe_inside.png")

const crafting = newImg("../game/assets/ui/crafting.png")

const iron_pick = newImg("../game/assets/tools/iron_pick.png")

const tool_base = newImg("../game/assets/tools/tool_base.png")

const bedrock = newImg("../game/assets/blocks/general/bedrock.png")

const imgs = [air, stone, log, leaves, coal_ore, grass, iron_ore, dirt, safe, tool_base, bedrock, 0, iron_pick, gold_ore, silver_ore, plutonium_ore, uranium_ore]

const ores = [4, 6, 13, 14, 15, 16]
const oreChunkTypes = [
    [0,1,0,1,1,1,1,1,1],
    [1,1,1,0,1,1,0,0,1],
    [0,1,1,0,0,1,0,0,0],
    [0,0,0,0,1,1,1,1,1],
    [1,1,1,1,1,0,0,0,0],
    [1,1,0,0,1,1,0,1,1],
    [1,1,1,0,1,1,0,0,0],
    [0,1,0,1,1,1,0,0,0],
    [0,1,0,1,1,1,1,1,0],
]
//bare sånn at ikke det skal flickere
let dirtDepth = []
let bedrockLevel2 = []
let bedrockLevel3 = []
let treeBools = []
let oreBools = []
const oreRate = 0.03
const treeRate = 0.3

function updateRandomPlacements(width, height, blockSize){
    //dirtDepth
    dirtDepth = []
    for(let i = 0; i < f(width/blockSize); i++){
        dirtDepth[i] = randInt(6, 8)
    }
    
    //bedrock level 2
    bedrockLevel2 = []
    for(let i = 0; i < f(width/blockSize); i++){
        bedrockLevel2[i] = random()<0.7 ? true : false
    }
    
    //bedrock level 3
    bedrockLevel3 = []
    for(let i = 0; i < f(width/blockSize); i++){
        bedrockLevel3[i] = random()<0.4 && bedrockLevel2[i] && (bedrockLevel2[i-1] || bedrockLevel2[i+1]) ? true : false
    }

    //treeBools
    treeBools = []
    for(let i = 0; i < f(width/blockSize); i++){
        treeBools[i] = random()<treeRate ? true : false
    }

    oreBools = []
    //2dim-array-fylling
    for(let y = 0; y < f(height/blockSize); y++){
        oreBools[y] = []
        for(let x = 0; x < f(width/blockSize); x++){
            oreBools[y][x] = [random()<oreRate ? true : false, randInt(0, oreChunkTypes.length), randInt(0, ores.length)]
        }
    }
}


class NoiseMap{
    constructor(width, height, scale, octaves, lacunarity, persistance, blockSize, canWidth){

        //ikke viktige, kun for litt customizing av hvor blokker skal plasseres
        if(dirtDepth.length != f(width/blockSize)) updateRandomPlacements(width, height, blockSize)


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
                const sampleX = (x - (canWidth/2)/blockSize) / this.scale * this.frequency
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

    create2DArr(){
    
        //lage et tomt 2-dimensjonalt array
        let arr = []
        for(let y = 0; y < Math.floor(this.height/this.blockSize); y++){
            arr.push([])
            for(let x = 0; x < Math.floor(this.width/this.blockSize); x++){
                arr[y].push([])
                arr[y][x] = 0
            }
        }
    
    
        for(let y = 0; y < arr.length; y++){
            for(let x = 0; x < arr[y].length; x++){
                //hvis ruta befinner seg under noisegrafen
                let height = map(y, 0, arr.length-1, 0, 1)
                if(arr[y] && y > 10 && (y > arr.length-6 || height > this.map[x])){
                    arr[y][x] = getValue(arr, x, y)
                    //hvis gress
                    if(arr[y][x] == 5 && treeBools[x]) placeTree(arr, x, y-1)
                    else if(arr[y][x] == 1 && oreBools[y][x][0]) placeOreChunk(arr, x, y)
                }
            }
        }
        return arr
    }
}

function getValue(map, x, y){
    //bedrock
    if(y == map.length-1) return 10
    if(y == map.length-2 && bedrockLevel2[x]) return 10
    if(y == map.length-3 && bedrockLevel3[x]) return 10
    
    let i = y-1
    //mindre computation ved å bare slenge inn stein hvis det er stein over
    if(i>=0 && map[i][x] == 1) return 1

    //dybde
    let depth = 0
    while(i>=0){
        if(map[i][x] == 0 || map[i][x] == 2) break
        depth++
        i--
    }
    if(y < dirtThreshHold(map.length)){
        //gress
        if(depth == 0) return 5

        //dirt
        if(depth > 0 && depth < dirtDepth[x]) return 7
    }
    
    //ellers bare returnere luft
    return 1
}
const dirtThreshHold = height => height-15

function placeTree(map, x, y){
    for(let i = y; i > y-6; i--){
        if(!map[i]) return
        if(map[y][x] != 0) return
        if(i <= y-2 && i >= y-4 && (map[i][x-1] != 0 || map[i][x-2] != 0 || map[i][x+1] != 0 || map[i][x+2] != 0)) return
    }
    //klart til å plante
    map[y][x] = 2
    map[y-1][x] = 2
    map[y-2][x] = 2
    map[y-2][x-1] = 3
    map[y-2][x-2] = 3
    map[y-2][x+1] = 3
    map[y-2][x+2] = 3
    map[y-3][x] = 3
    map[y-3][x-1] = 3
    map[y-3][x-2] = 3
    map[y-3][x+1] = 3
    map[y-3][x+2] = 3
    map[y-4][x-1] = 3
    map[y-4][x] = 3
    map[y-4][x+1] = 3
    map[y-5][x] = 3
}

function placeOreChunk(map, x, y){
    for(let i = y; i > y-4; i--){
        for(let j = x; j > x-4; j--){
            if(!map[i]) return
            if(equalsSome(map[i][j], [2, 3, 10, undefined])) return
        }
    }
    //klart til å plassere, har klarert et 3*3 område oppe til venstre for x, y
    const oreVal = ores[oreBools[y][x][2]]
    const oreChunk = oreChunkTypes[oreBools[y][x][1]]
    for(let i = 0; i < oreChunk.length; i++){
        if(oreChunk[i] == 1) map[(y-2) + f(i/3)][(x-2) + i%3] = oreVal
    }
}

let img = new Image()
img.src = "../game/assets/blocks/general/dirt.png"
let scale, octaves, lacunarity, persistance, xPos, yPos, blockSize
let prevX, prevY, mouseIsPressed, slideSpeed
function setup(){
    createCanvas(window.innerWidth-5, window.innerHeight-5)
    colorMode(HSB)
    scale = createSlider(1, 1000, 500)
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
    canvas.addEventListener("wheel", e =>{
        if(e.deltaY < 0){
            scale.value(scale.value() + 5)
        }
        else{
            scale.value(scale.value() - 5)
        }
    })
}

function draw(){
    drawingContext.clearRect(0, 0, width, height)
    const sizeValue = blockSize.value()
    const xVal = /*0*/ xPos.value()
    const yVal = /*0*/ yPos.value()

    let noiseMap = new NoiseMap(10000, 3000, scale.value(), octaves.value(), lacunarity.value()/100, persistance.value()/1000, sizeValue, width, xVal)
    let map = noiseMap.create2DArr()
    
    

    beginShape()
    for(let y = Math.floor(yVal/sizeValue); y < Math.floor(yVal+height/sizeValue); y++){
        for(let x = Math.floor(xVal/sizeValue); x < Math.floor(xVal + width/sizeValue); x++){
            if(map[y] && map[y][x]) drawingContext.drawImage(imgs[map[y][x]], x*sizeValue - xVal, y*sizeValue - yVal, sizeValue, sizeValue)
        }
    }
    // for(let y = 0; y < map.length; y++){
    //         for(let x = 0; x < map[0].length; x++){
    //             if(map[y][x] == 1) drawingContext.drawImage(img, x*sizeValue, y*sizeValue, sizeValue, sizeValue)
    //         }
    //     }
    endShape()

    text(`Scale: ${scale.value()}`, 10, 20)
    text(`Octaves: ${octaves.value()}`, 10, 70)
    text(`Lacunarity: ${lacunarity.value()/100}`, 10, 120)
    text(`Persistance: ${persistance.value()/1000}`, 10, 170)
    text(`xPos: ${xVal}`, 10, 220)
    text(`yPos: ${yVal}`, 10, 270)
    text(`blockSize: ${sizeValue}`, 10, 320)
    text(`Slidespeed: ${slideSpeed.value()}`, 10, 370)

    return
}
// noLoop()