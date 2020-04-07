const variables = require('./variables')
let map = variables.map
let interactMap = variables.interactMap
const solidBlocks = variables.solidBlocks

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

function click(keyCode, player){
    player.mouse.counter = 0
    //høyreklikk, sjekker om man kan sette ut blokk
    const [py, px, PY, PX] = [player.mouse.py, player.mouse.px, player.mouse.PY, player.mouse.PX]
    if(keyCode==2){
        if(map[py][px]==0){
            if(px!=Math.floor(player.x) || (py!=Math.floor(player.y) && py!=Math.floor(player.y+1))){
                if(map[py+1][px]!=0 || map[py-1][px]!=0 || map[py][px+1]!=0 || map[py][px-1]!=0){
                    if(Math.sqrt(Math.pow(player.x+1-7/32 - PX, 2) + Math.pow(player.y+16/32 - PY, 2))<=5){
                        if(sight([player.x+0.5, player.y+1], [PX, PY], py, px)){
                            //sjekker om spiller holder en blokk i hånden
                            if(player.hand.type == "block" && player.hand.number != 0){
                                map[py][px] = player.hand.value
                                player.hand.number -= 1
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
                map[py][px] = 0
            }
        }
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
function interaction(px, py, player){
    if(map[py][px]==8){
        player.currentSafe = interactMap[py][px]
        return 'safeOpened'
    }
    return ("", "")
}

module.exports = {update, keysD, keysU, click, sight, updateSprites, interaction}
