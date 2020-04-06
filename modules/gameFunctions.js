let map = require('./variables').map
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

        //klatring i stige
        // if(map[Math.floor(player.y + 2)][Math.floor(player.x + 1)] == 11 || map[Math.floor(player.y + 1)][Math.floor(player.x + 1)] ==11 || map[Math.floor(player.y + 2)][Math.floor(player.x)] ==11 || map[Math.floor(player.y + 1)][Math.floor(player.x)] == 11){
        //     if(player.controller.up){
        //         player.vy = -0.005
        //     }
        // }

        if(player.vx>0){
            if(map[Math.floor(player.y+20/64)][Math.floor(player.x+1-9/32)]!=9 || map[Math.floor(player.y+1+20/64)][Math.floor(player.x+1-9/32)]!=9 || map[Math.floor(player.y+1.99)][Math.floor(player.x+1-9/32)]!=9){
                player.vx = 0
            }
        }
        if(player.vx<0){
            if(map[Math.floor(player.y+20/64)][Math.floor(player.x+9/32)]!=9 || map[Math.floor(player.y+1+20/64)][Math.floor(player.x+9/32)]!=9 || map[Math.floor(player.y+1.99)][Math.floor(player.x+9/32)]!=9){
                player.vx = 0
            }
        }
        if(player.vy<0){
            if(map[Math.floor(player.y+20/64)][Math.floor(player.x+9/32)]!=9 || map[Math.floor(player.y+20/64)][Math.floor(player.x+1-9/32)]!=9){
                player.vy = 0
            }
        }
        player.x+=player.vx
        if(map[Math.round(player.y+2)][Math.floor(player.x+9/32)]==9 && map[Math.round(player.y+2)][Math.floor(player.x+1-9/32)]==9){
            player.falling = true
        }
        if(player.falling){
            if(map[Math.floor(player.y+2)][Math.round(player.x)]!=9 && /*map[Math.floor(player.y+2)][Math.round(player.x)]!=11 &&*/ player.vy>0){
                player.falling = false
                player.y = Math.round(player.y)
                player.vy = 0
            }
            else{
                player.y+=player.vy
                player.vy+=g
            }
        }
}

function keysD(keyCode, player, controller){
    if(keyCode==65){
        player.direction = "left"
        player.moving = true
        controller.left = true
    }
    if(keyCode==68){
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
        }
        controller.left = false
    }
    if(keyCode==68){
        if(!controller.left){
            player.moving = false
        }
        controller.right = false
    }
}

function click(keyCode, px, py, PX, PY, player){
    //høyreklikk, sjekker om man kan sette ut blokk
    if(keyCode==2){
        if(map[py][px]==9){
            if(px!=Math.floor(player.x) || (py!=Math.floor(player.y) && py!=Math.floor(player.y+1))){
                if(map[py+1][px]!=9 || map[py-1][px]!=9 || map[py][px+1]!=9 || map[py][px-1]!=9){
                    if(Math.sqrt(Math.pow(player.x+1-7/32 - PX, 2) + Math.pow(player.y+16/32 - PY, 2))<=5){
                        if(sight([player.x+0.5, player.y+1], [PX, PY])){
                            map[py][px] = 0
                        }
                    }
                }
            }
        }
    }
    if(keyCode==0){
        if(Math.sqrt(Math.pow(player.x+1-7/32 - PX, 2) + Math.pow(player.y+16/32 - PY, 2))<=5){
            if(sight([player.x+0.5, player.y+1], [PX, PY])){
                map[py][px] = 9
            }
        }
    }
}

function sight(pPos, mPos){
    let a = (mPos[1]-pPos[1])/(mPos[0]-pPos[0])
    for(x=pPos[0]; x<mPos[0]; x+=0.01){
        if(Math.floor(pPos[1]+(x-pPos[0])*a)==py && Math.floor(x)==px){
            return true
        }
        if(map[Math.floor(pPos[1]+(x-pPos[0])*a)][Math.floor(x)]!=9){
            return false
        }
    }
    for(x=pPos[0]; x>mPos[0]; x-=0.01){
        if(Math.floor(pPos[1]+(x-pPos[0])*a)==py && Math.floor(x)==px){
            return true
        }
        if(map[Math.floor(pPos[1]+(x-pPos[0])*a)][Math.floor(x)]!=9){
            return false
        }
    }
    return true
}

module.exports = {update, keysD, keysU, click, sight}