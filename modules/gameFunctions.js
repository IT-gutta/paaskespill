const variables = require('./variables')
let map = variables.map
let interactMap = variables.interactMap
const solidBlocks = variables.solidBlocks
const Item = variables.Item

const usefulFunctions = require("./usefulFunctions")
const equalsSome = usefulFunctions.equalsSome
const equalsAll = usefulFunctions.equalsAll
const mapValue = usefulFunctions.mapValue

function updateSprites(player){
    if(player.direction == "left") player.sprite.index = player.sprite.index == 1 ? 0 : 1
    else if(player.direction == "right") player.sprite.index = player.sprite.index == 3 ? 4 : 3
    else player.sprite.index = 2
    player.sprite.counter = 0
}


function update(player, map, g){
        //movement og collision
        if(player.moving){
            if(player.direction=="left"){
                player.vx = -0.005
            }
            else{
                player.vx = 0.005
            }
        }
        else{
            if(player.falling){
                player.vx *= 0.95
            }
            else{
                player.vx *= 0.9
            }
        }

        if(player.sprite.counter > player.sprite.delay) updateSprites(player)
        else player.sprite.counter ++

        if(player.mouse.counter > player.mouse.delay){
            if(player.mouse.keys[0]) click(0, player)
            else if(player.mouse.keys[2]) click(2, player)
        }
        else player.mouse.counter ++

        //klatring i stige
        // if(map[Math.floor(player.y + 2)][Math.floor(player.x + 1)] == 11 || map[Math.floor(player.y + 1)][Math.floor(player.x + 1)] ==11 || map[Math.floor(player.y + 2)][Math.floor(player.x)] ==11 || map[Math.floor(player.y + 1)][Math.floor(player.x)] == 11){
        //     if(player.controller.up){
        //         player.vy = -0.005
        //     }
        // }


        // viktige punkter på spilleren
        player.pos.topRight = {x: player.x+1-9/32, y: player.y+20/64}
        player.pos.midRight = {x: player.x+1-9/32, y: player.y+1+20/64}
        player.pos.botRight = {x: player.x+1-9/32, y: player.y+1.99}
        player.pos.topLeft = {x: player.x+9/32, y: player.y+20/64}
        player.pos.midLeft = {x: player.x+9/32, y: player.y+1+20/64}
        player.pos.botLeft = {x: player.x+9/32, y: player.y+1.99}


        //kollisjon høyre side
        if(player.vx>0){
            if(equalsSome(mapValue(player.pos.topRight), solidBlocks) || equalsSome(mapValue(player.pos.midRight), solidBlocks) || equalsSome(mapValue(player.pos.botRight), solidBlocks)){
                player.vx = 0
            }
        }

        //kollissjon venstre side
        if(player.vx<0){
            if(equalsSome(mapValue(player.pos.topLeft), solidBlocks) || equalsSome(mapValue(player.pos.midLeft), solidBlocks) || equalsSome(mapValue(player.pos.botLeft), solidBlocks)){
                player.vx = 0
            }
        }

        //kollisjon når spilleren beveger seg oppover
        if(player.vy<0){
            if(equalsSome(mapValue(player.pos.topLeft), solidBlocks) || equalsSome(mapValue(player.pos.topRight), solidBlocks)){
                player.vy = 0
            }
        }


        if(map[Math.round(player.y+2)][Math.floor(player.pos.botLeft.x)]==0 && map[Math.round(player.y+2)][Math.floor(player.pos.botRight.x)]==0){
            player.falling = true
        }


        if(player.falling){
            if((equalsSome(mapValue(player.pos.botLeft), solidBlocks) || equalsSome(mapValue(player.pos.botRight), solidBlocks)) && player.vy>0){
                player.falling = false
                player.y = Math.round(player.y)
                player.vy = 0
            }
            else{
                player.vy+=g
            }
        }
        player.x+=player.vx
        player.y+=player.vy
}



function keysD(keyCode, player, controller){
    if(keyCode==65){
        if(equalsSome(player.direction, ["right", "front"])) player.sprite.index = 0
        player.direction = "left"
        player.moving = true
        controller.left = true
    }
    if(keyCode==68){
        if(equalsSome(player.direction, ["left", "front"])) player.sprite.index = 4
        player.direction = "right"
        player.moving = true
        controller.right = true
    }
    if(keyCode==66){
        player.moving = true
        controller.up = true
    }
    if(keyCode==32){
        if(!player.falling){
            player.falling = true
            player.vy = -0.01
        }
    }
}

function keysU(keyCode, player, controller){
    if(keyCode==65){
        if(!controller.right){
            player.moving = false
            player.direction = "front"
            player.sprite.index = 2
        }
        controller.left = false
    }
    if(keyCode==68){
        if(!controller.left){
            player.direction = "front"
            player.moving = false
            player.sprite.index = 2
            
        }
        controller.right = false
    }
}

function updatePlayerHand(player){
    player.hand = player.inventory.arr[23+player.hotBarSpot]
}
function click(keyCode, player){
    player.mouse.counter = 0
    //høyreklikk, sjekker om man kan sette ut blokk
    const [py, px, PY, PX] = [player.mouse.r.y, player.mouse.r.x, player.mouse.y, player.mouse.x]
    if(keyCode==2){
        if(map[py][px]==0){
            if(px!=Math.floor(player.x) || (py!=Math.floor(player.y) && py!=Math.floor(player.y+1))){
                if(map[py+1][px]!=0 || map[py-1][px]!=0 || map[py][px+1]!=0 || map[py][px-1]!=0){
                    if(Math.sqrt(Math.pow(player.x+1-7/32 - PX, 2) + Math.pow(player.y+16/32 - PY, 2))<=5){
                        if(sight([player.x+0.5, player.y+1], [PX, PY], py, px)){
                            //sjekker om spiller holder en blokk i hånden
                            if(player.hand && player.hand.type == "block" && player.hand.number != 0){
                                map[py][px] = player.hand.value
                                player.hand.number -= 1
                                //hvis spiller har brukt opp den siste av en blokk skal den fjernes
                                if(player.hand.number <= 0){
                                    delete player.inventory.arr[player.hand.index]
                                    player.inventory.arr[player.hand.index] = new Item("empty", null, null, player.hand.index, player.hand.container, 1, false)
                                    delete player.hand
                                    updatePlayerHand(player)
                                    
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if(keyCode==0){
        if(Math.sqrt(Math.pow(player.x+1-7/32 - PX, 2) + Math.pow(player.y+16/32 - PY, 2))<=5){
            if(sight([player.x+0.5, player.y+1], [PX, PY], py, px)){
                if(mapValue(player.mouse.r) != 0) mine(player)
            }
        }
    }
}

function mine(player){
    if(player.mining.active && player.mining.current.x == player.mouse.r.x && player.mining.current.y == player.mouse.r.y){
        player.mining.stage += player.hand.mineSpeed/player.mining.difficulty
        if(player.mining.stage > 5){
            //adde til inventory, sjekker først om man kan legge den inn i en eksisterende bunke
            for(let i = player.inventory.arr.length-1; i >= 0; i--){
                //hvis det finnes en stack med itemet fra før der det er plass
                if(player.inventory.arr[i].value == mapValue(player.mining.current) && player.inventory.arr[i].number < 64){
                    player.inventory.arr[i].number += 1
                    map[player.mining.current.y][player.mining.current.x] = 0
                    player.mining.active = false
                    return
                }
            }
            //hvis det ikke finnes prøver den å fylle en tom plass
            for(let i = player.inventory.arr.length-1; i >= 0; i--){
                //hvis det finnes en stack med itemet fra før der det er plass
                if(player.inventory.arr[i].type == "empty"){
                    delete player.inventory.arr[i]
                    player.inventory.arr[i] = new Item("block", mapValue(player.mining.current), 1, i, "inventory", 1, false)
                    map[player.mining.current.y][player.mining.current.x] = 0
                    player.mining.active = false
                    return
                }
            }
        }
    }
    else{
        player.mining.active = true
        player.mining.current = {x: player.mouse.r.x, y: player.mouse.r.y}
        player.mining.stage = 0
        player.mining.difficulty = 1
    }
}
//Sjekker om det er blokker mellom spilleren og musa
function sight(pPos, mPos, py, px){
    let a = (mPos[1]-pPos[1])/(mPos[0]-pPos[0])
    for(x=pPos[0]; x<mPos[0]; x+=0.01){
        if(Math.floor(pPos[1]+(x-pPos[0])*a)==py && Math.floor(x)==px){
            return true
        }
        if(map[Math.floor(pPos[1]+(x-pPos[0])*a)][Math.floor(x)]!=0){
            return false
        }
    }
    for(x=pPos[0]; x>mPos[0]; x-=0.01){
        if(Math.floor(pPos[1]+(x-pPos[0])*a)==py && Math.floor(x)==px){
            return true
        }
        if(map[Math.floor(pPos[1]+(x-pPos[0])*a)][Math.floor(x)]!=0){
            return false
        }
    }
    return true
}
//Sjekker om spilleren har trykket på en block man kan interagere med
function interaction(player){
    if(map[player.mouse.r.y][player.mouse.r.x]==8){
        player.safe = interactMap[player.mouse.r.y][player.mouse.r.x]
        return 'safeOpened'
    }
    return ("", "")
}


// funksjon som bytter plass på 2 inventoryItems, kan være et tomt item og en blokk f.eks
// parameterene index og container fortelleren hvor brukeren har trykket, og hvilken container den har trykket i
// hvilken index i hvilken container
// den åpnede safen og inventory er accesible gjennom player
function swap(player, index, container){
    if(player.selectedSwap){


        //tidligere valgte Item (allerede highlighted)
        const swap = player.selectedSwap
  
        //senest valgte Item
        const cItem = player[container].arr[index]

        //sjekker først om det er items av samme type, slik at vi kan legge de sammen
        if(cItem.value == swap.value && cItem.type == "block" && swap.type == "block"){
            cItem.number += swap.number
            if(cItem.number > 64){
                swap.number = cItem.number - 64
                cItem.number = 64
                //legges bare tilbake igjen
            }
            else{
                
            }
        }

        //sjekker først om det er items av samme type, slik at vi kan legge de sammen
        if(cItem.value == swap.value && cItem.type == "block" && swap.type == "block"){
            cItem.number += swap.number
            if(cItem.number > 64){
                swap.number = cItem.number - 64
                cItem.number = 64
                //legges bare tilbake igjen
            }
            else{
                
            }
        }
  
        //bruker delete for unngå at serveren kan krasje ved lange kjøretider pga fullt minne
        delete player[swap.container].arr[swap.index]
        player[swap.container].arr[swap.index] = new Item(cItem.type, cItem.value, cItem.number, swap.index, swap.container, cItem.mineSpeed, false)
        delete player[container].arr[index]
        player[container].arr[index] = new Item(swap.type, swap.value, swap.number, cItem.index, cItem.container, swap.mineSpeed, false)
  
        delete cItem
        delete swap
        delete player.selectedSwap
      }
  
      //hvis det eksisterer ikke er et tomt item der du trykker
      else if(player[container].arr[index].type != "empty"){
        player[container].arr[index].highlighted = true
        const cItem = player[container].arr[index]
        player.selectedSwap = new Item(cItem.type, cItem.value, cItem.number, cItem.index, cItem.container, cItem.mineSpeed, true)
        delete cItem
      }
}

module.exports = {update, keysD, keysU, click, sight, updateSprites, interaction, updatePlayerHand, swap}
