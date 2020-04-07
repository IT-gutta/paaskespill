let showInventory = false
let showSafe = false
let selectedInventoryIndex = 0
let inventorySwap = false
form.onsubmit = (e) => {
    // dette er henriks kommentar
    //Jørgen er kul
    e.preventDefault()
        socket.emit('new-user', textField.value)
        form.style.display = "none"

        socket.on("playerID", id => {
            playerID = id
            console.log(playerID)
        })
        socket.on('heartbeat', (map, users, safe) => {
            for (let [id, user] of Object.entries(users)) {
                if(user.player.direction == "right") user.player.img = player_right
                else if(user.player.direction == "left") user.player.img = player_left
                else user.player.img = player_front
            }
            draw(map, users, safe)
        })
    
        window.addEventListener("keydown", e => {
            if(e.keyCode == 65 || e.keyCode == 68 || e.keyCode == 32 || e.keyCode == 66) socket.emit('keysD', e.keyCode)
            if(e.keyCode == 69/*nice*/) showInventory = !showInventory
            if(e.keyCode == 27/*nice*/) showSafe = !showSafe
        })
    
        window.addEventListener("keyup", e => {
            if(e.keyCode == 65 || e.keyCode == 68 || e.keyCode == 66) socket.emit('keysU', e.keyCode)
        })

        window.addEventListener("mousemove", e => {
            clientX = e.clientX
            clientY = e.clientY
        })

        window.addEventListener("mousedown", e => {
         if(!showInventory && !showSafe){
            if(e.button == 0 || e.button == 2){
                socket.emit('click', e.button, clientX, clientY, canvas.width, canvas.height)
            } 
         }
         else if(showInventory){
            var x = e.clientX
            var y = e.clientY
            var p = Math.floor((x-(canvas.width-800)/2)/80-1) + Math.floor((y-(canvas.height-480)/2)/80-1)*8
            if(p>=0 && p<=31){
                socket.emit('swap', p, "player")
            }
         }
         else if(showSafe){
            var x = e.clientX
            var y = e.clientY
            console.log(1)
            if(x>(canvas.width - 1300)/2+800){
                var p = Math.floor((x-(canvas.width-1300)/2-800)/100) + Math.floor((y-(canvas.height-500)/2)/100)*5
                socket.emit('swap', p, "safe")
            }
            else{
                var p = Math.floor((x-(canvas.width-1300)/2-80)/80) + Math.floor((y-(canvas.height-480)/2-80)/80)*8
                socket.emit('swap', p, "player")
            }
         }
        })
        

        socket.on("safeOpened",(px, py, safe) => {
            showSafe = true
        })
        
}

function draw(map, users){
    c.clearRect(0,0,w,h)
    c.drawImage(sky, 0, 0, w, h)
    for(i=Math.floor(users[playerID].player.y - 32/64 - canvas.height/64)-1; i<Math.ceil(users[playerID].player.y - 32/64 + canvas.height/64)+1; i++){
        if(i<0) continue
        if(i>=map.length) break
        for(j=Math.floor(users[playerID].player.x - 7/32 - canvas.width/64)-1; j<Math.ceil(users[playerID].player.x - 7/32 + canvas.width/64)+1; j++){
            if(j<0) continue
            if(j>=map[i].length) break
            c.drawImage(imgs[map[i][j]], canvas.width/2 + 32*(j-users[playerID].player.x-7/32), canvas.height/2 + 32*(i-users[playerID].player.y-32/64), 32, 32)
        }
    }

    c.drawImage(users[playerID].player.img, (canvas.width-16)/2, (canvas.height-32)/2, 32, 64)
    c.font = "14px Monospace"
    c.textAlign = "center"
    c.fillText(users[playerID].username, (canvas.width-16)/2 + 16, (canvas.height-32)/2 - 16)


  
  for (let [id, user] of Object.entries(users)){
    if(id != playerID){
        c.drawImage(user.player.img, canvas.width/2 + 32*(user.player.x-users[playerID].player.x-7/32), canvas.height/2 + 32*(user.player.y-users[playerID].player.y-32/64), 32, 64)
        c.fillText(user.username, canvas.width/2 + 32*(user.player.x-users[playerID].player.x-7/32) + 16, canvas.height/2 + 32*(user.player.y-users[playerID].player.y-32/64) - 16)
    }
  }
  if(showSafe){
    c.drawImage(inventory, (canvas.width-1300)/2, (canvas.height-480)/2, 800, 480)
    for(i=0; i<32; i+=1){
        if(users[playerID].player.inventory[i][1]!=0){
            c.drawImage(imgs[users[playerID].player.inventory[i][0]], 100 + i%8*80 + (canvas.width - 1300)/2, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2, 40, 40)
            c.fillText(users[playerID].player.inventory[i][1], 95 + (i%8)*80 + (canvas.width - 1300)/2, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2)
        }
    }
    c.drawImage(safe_inside, (canvas.width-1300)/2+800, (canvas.height-500)/2, 500, 500)
    for(i=0; i<24; i+=1){
        if(users[playerID].player.currentSafe.inventory[i][1]!=0){
            c.drawImage(imgs[users[playerID].player.currentSafe.inventory[i][0]], 30 + i%8*100 + (canvas.width - 1300)/2+800, 30 + Math.floor(i/8)*100 + (canvas.height-500)/2, 40, 40)
            c.fillText(users[playerID].player.currentSafe.inventory[i][1], 30 + (i%8)*100 + (canvas.width - 1300)/2+800, 30 + Math.floor(i/8)*100 + (canvas.height-500)/2)
        }
    }
  }
  if(showInventory){
      c.drawImage(inventory, (canvas.width-800)/2, (canvas.height-480)/2, 800, 480)
    for(i=0; i<32; i+=1){
        if(imgs[users[playerID].player.inventory[i][1]]!=0){
            c.drawImage(imgs[users[playerID].player.inventory[i][0]], 100 + i%8*80 + (canvas.width - 800)/2, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2, 40, 40)
            c.fillText(users[playerID].player.inventory[i][1], 95 + (i%8)*80 + (canvas.width - 800)/2, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2)
        }
    }
  }   
}