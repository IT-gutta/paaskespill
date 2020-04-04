function update(player, map, g){
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
            player.vx-=player.vx/1000
        }
        else{
            player.vx = 0
        }
    }
    player.x+=player.vx
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