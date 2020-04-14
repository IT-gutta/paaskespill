const socket = (window.location.href == "http://localhost:3000/world/") ? io.connect('localhost:3000') : io.connect('https://paaskespill.herokuapp.com/')
// const button = document.querySelector('button')

const firebaseConfig = {
    apiKey: "AIzaSyC_qo-PKhtoAUMq-8hz3N5pW8nwbVLMRTE",
    authDomain: "paaskespill.firebaseapp.com",
    databaseURL: "https://paaskespill.firebaseio.com",
    projectId: "paaskespill",
    storageBucket: "paaskespill.appspot.com",
    messagingSenderId: "200950577223",
    appId: "1:200950577223:web:919978e4905514e8fc5962",
    measurementId: "G-HXN2PSV4SQ"
}
firebase.initializeApp(firebaseConfig);
db = firebase.firestore()

// db.collection("map").get().then(snap =>{
//     console.log(snap.docs[0].data().height)
// })



//nyttige funksjoner
const f = num => Math.floor(num)
const c = num => Math.ceil(num)
const r = num => Math.r(num)
const s = num => Math.sqrt(num)
const randInt = (fra_og_med, til) => Math.floor(Math.random()*(til-fra_og_med))+fra_og_med
// const random = () => Math.random()
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
// let dirtDepth = []
// let bedrockLevel2 = []
// let bedrockLevel3 = []
// let treeBools = []
// let oreBools = []

const oreRate = 0.03
const treeRate = 0.3

// function updateRandomPlacements(width, height, blockSize){
//     //dirtDepth
//     dirtDepth = []
//     bedrockLevel2 = []
//     bedrockLevel3 = []
//     treeBools = []
//     oreBools = []
//     for(let i = 0; i < f(width/blockSize); i++){
//         dirtDepth[i] = randInt(6, 8)
//         bedrockLevel2[i] = random()<0.7 ? true : false
//         treeBools[i] = random()<treeRate ? true : false
//         oreBools[i] = []
//         for(let y = 0; y < f(height/blockSize); y++){
//             oreBools[i][y] = [random()<oreRate ? true : false, randInt(0, oreChunkTypes.length), randInt(0, ores.length)]
//         }
//     }
//     //bedrock level 3
//     for(let i = 0; i < f(width/blockSize); i++){
//         bedrockLevel3[i] = random()<0.4 && bedrockLevel2[i] && (bedrockLevel2[i-1] || bedrockLevel2[i+1]) ? true : false
//     }
// }


const mp5 = new p5()
class NoiseMap{
    constructor(width, height, scale, octaves, lacunarity, persistance, blockSize, canWidth){

        //ikke viktige, kun for litt customizing av hvor blokker skal plasseres
        // if(dirtDepth.length != f(width/blockSize)) updateRandomPlacements(width, height, blockSize)


        this.width = width
        this.height = height
        this.scale = scale
        this.octaves = octaves
        this.lacunarity = lacunarity
        this.persistance = persistance
        this.blockSize = blockSize
        this.noiseMap = []
        this.minVal = Infinity
        this.maxVal = -Infinity
        this.noiseHeight = 0
        this.amplitude = 1
        this.frequency = 1

        for(let x = 0; x < f(this.width/blockSize); x++){
            // if(x > f(this.width/(blockSize*2))){
            //     if(this.scale > scale/4) this.scale-=5
            //     if(this.persistance > 0.4) this.persistance-=0.01
            //     this.octaves = 6
            // }
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
            this.noiseMap.push(this.noiseHeight)
        }

        //normalize values
        // let max = 0.5
        // let min = 0.2
        for(let i = 0; i < this.noiseMap.length; i++){
            // if(i > this.noiseMap.length/2 && max < 1) max+=0.001
            // if(i > this.noiseMap.length/2 && min < 0.5) min+=0.001

            this.noiseMap[i] = mp5.map(this.noiseMap[i], this.minVal, this.maxVal, 0.2/*1-max*/, 0.8/*1-min*/)   
        }
        // console.log(this.noiseMap)
    }
    draw(){
        beginShape()
        for(let x = 0; x < this.noiseMap.length; x++){
            vertex(x*blockSize, mp5.map(this.noiseMap[x], 0, 1, 0, this.height))
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
                let height = mp5.map(y, 0, arr.length-1, 0, 1)
                if(arr[y] && y > 10 && (y > arr.length-6 || height > this.noiseMap[x])){
                    arr[y][x] = getValue(arr, x, y)
                    //hvis gress
                    if(arr[y][x] == 5 && random()<treeRate) placeTree(arr, x, y-1)
                    else if(arr[y][x] == 1 && random()<oreRate) placeOreChunk(arr, x, y)
                }
            }
        }
        return arr
    }
}

function getValue(map, x, y){
    //bedrock
    if(y == map.length-1) return 10
    if(y == map.length-2 && random()<0.7) return 10
    // if(y == map.length-3 && bedrockLevel3[x]) return 10
    
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
    let highestDirt = map.length * 0.35
    if(y > highestDirt){
        //gress
        if(depth == 0) return 5

        //dirt
        if(depth > 0 && depth < random(5, 7)) return 7
    }
    
    //ellers bare returnere luft
    return 1
}


function placeTree(map, x, y){
    //sjekker om det er plass
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
    //sjekker om det er plass
    for(let i = y; i > y-4; i--){
        for(let j = x; j > x-4; j--){
            if(!map[i]) return
            if(equalsSome(map[i][j], [2, 3, 10, undefined])) return
        }
    }
    //klart til å plassere, har klarert et 3*3 område oppe til venstre for x, y
    const oreVal = random(ores)
    const oreChunk = random(oreChunkTypes)
    for(let i = 0; i < oreChunk.length; i++){
        if(oreChunk[i] == 1) map[(y-2) + f(i/3)][(x-2) + i%3] = oreVal
    }
}




let img = new Image()
img.src = "../game/assets/blocks/general/dirt.png"
let scale, octaves, lacunarity, persistance, xPos, yPos, blockSize, noiseMap, map, caveMap
let prevX, prevY, mouseIsPressed, slideSpeed, seedInp, createRandomSeed, updateBtn
function setup(){
    createCanvas(window.innerWidth-5, window.innerHeight-5)
    colorMode(HSB)
    scale = createSlider(1, 2000, 500)
    octaves = createSlider(1, 10, 5)
    lacunarity = createSlider(100, 500, 220)
    persistance = createSlider(200, 1000, 500)
    xPos = createSlider(0, 100000, 0)
    yPos = createSlider(0, 100000, 0)
    blockSize = createSlider(4, 64, 32)
    slideSpeed = createSlider(1, 4, 1)
    seedInp = createInput("")
    createRandomSeed = createCheckbox("randomSeed", true)
    cavesOn = createCheckbox("Draw caves", false)
    updateBtn = createButton("Update")
    sendBtn = createButton("Send map to database")
    zoomSlider = createSlider(10, 10000, 1000)
    caveFillPercent = createSlider(400, 550, 480)

    scale.position(10, 20)
    octaves.position(10, 70)
    lacunarity.position(10, 120)
    persistance.position(10, 170)
    xPos.position(10, 220)
    yPos.position(10, 270)
    blockSize.position(10, 320)
    slideSpeed.position(10, 370)
    seedInp.position(10, 420)
    createRandomSeed.position(10, 470)
    cavesOn.position(120, 470)
    updateBtn.position(10, 520)
    sendBtn.position(100, 520)
    zoomSlider.position(10, 620)
    caveFillPercent.position(10, 670)
    
    scale.style("width", "200px")
    octaves.style("width","200px")
    lacunarity.style("width", "200px")
    persistance.style("width", "200px")
    xPos.style("width", "200px")
    yPos.style("width", "200px")
    blockSize.style("width", "200px")
    slideSpeed.style("width", "200px")
    zoomSlider.style("width", "200px")
    caveFillPercent.style("width", "200px")
    textSize(20)
    

    updateBtn.mousePressed(newMap)
    sendBtn.mousePressed( ()=>{
        
        let sendMap = JSON.stringify(map)
        
        db.collection("map").get().then(snap =>{
            let index = snap.docs.length
            db.collection("map").doc(index.toString()).set({
                width: map[0].length,
                height: map.length,
                stringifiedMap: sendMap,
                index: index
            })
        })
    })
    cavesOn.changed(newMap)


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
    window.addEventListener("mouseup", e =>{
        mouseIsPressed = false
    })
    canvas.addEventListener("wheel", e =>{
        if(e.deltaY < 0){
            zoomSlider.value(zoomSlider.value() + 20)
        }
        else{
            zoomSlider.value(zoomSlider.value() - 20)
        }
    })
    newMap()
}

function newMap(){
    if(createRandomSeed.checked()) seedInp.value(f(Math.random()*1000))

    noiseSeed(seedInp.value())
    randomSeed(seedInp.value())

    noiseMap = new NoiseMap(8000, 3000, scale.value(), octaves.value(), lacunarity.value()/100, persistance.value()/1000, blockSize.value(), width)
    map = noiseMap.create2DArr()

  
    if(cavesOn.checked()){
        caveMap = createCaveMap(8000, 3000, blockSize.value(), caveFillPercent.value()/10)
        adjustMap(caveMap, map)
    }
}


function draw(){
    drawingContext.clearRect(0, 0, width, height)
    const sizeValue = blockSize.value()
    const xVal = xPos.value()
    const yVal = yPos.value()
    const zoom = zoomSlider.value()/1000

    
    if(map){
        beginShape()
        for(let y = Math.floor(yVal/(sizeValue*zoom)); y < Math.floor(yVal+height/(sizeValue*zoom)); y++){
            for(let x = Math.floor(xVal/(sizeValue*zoom)); x < Math.floor(xVal + width/(sizeValue*zoom)); x++){
                if(map[y] && map[y][x]) drawingContext.drawImage(imgs[map[y][x]], x*sizeValue*zoom - xVal, y*sizeValue*zoom - yVal, sizeValue*zoom, sizeValue*zoom)
            }
        }
        endShape()
    }

    text(`Scale: ${scale.value()}`, 10, 20)
    text(`Octaves: ${octaves.value()}`, 10, 70)
    text(`Lacunarity: ${lacunarity.value()/100}`, 10, 120)
    text(`Persistance: ${persistance.value()/1000}`, 10, 170)
    text(`xPos: ${xVal}`, 10, 220)
    text(`yPos: ${yVal}`, 10, 270)
    text(`blockSize: ${sizeValue}`, 10, 320)
    text(`Slidespeed: ${slideSpeed.value()}`, 10, 370)
    text(`Zoom: ${zoom}`, 10, 620)
    text(`Cavefillpercent: ${caveFillPercent.value()/10}`, 10, 670)
}
