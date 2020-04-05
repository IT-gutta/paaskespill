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
                player.vx-=player.vx/200
            }
            else{
                player.vx = 0
            }
        }
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
            if(map[Math.floor(player.y+2)][Math.round(player.x)]!=9 && player.vy>0){
                player.falling = false
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

module.exports = {update, keysD, keysU}