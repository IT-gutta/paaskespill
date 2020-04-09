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
                user.player.img = playerSprites[user.player.sprite.playerSprite][user.player.movement][user.player.direction][user.player.sprite.index]
            }
            draw(map, users, safe)
        })
    
        window.addEventListener("keydown", e => {
            if(equalsSome(e.keyCode, [65, 68, 32, 66, 16])) socket.emit('keysD', e.keyCode, clientX, clientY, canvas.width, canvas.height)
            if(e.keyCode == 69/*nice*/ && !showSafe){
                showInventory = !showInventory
                if(!showInventory) socket.emit("closeInventory")
            }
            if(e.keyCode == 27/*nice*/){
                showSafe = false
                showInventory = false
                socket.emit("closeInventory")
            }

            //hotbar-opplegg
            if(Number(e.key)){
                socket.emit("changeItem", Number(e.key))
            }
        })
    
        window.addEventListener("keyup", e => {
            if(equalsSome(e.keyCode, [65, 68, 66, 16])) socket.emit('keysU', e.keyCode)
        })

        window.addEventListener("mousemove", e => {
            clientX = e.clientX
            clientY = e.clientY
        })

        function emitMouseMove(e){
            socket.emit("mousemove", e.clientX, e.clientY, canvas.width, canvas.height)
        }

        window.addEventListener("mousedown", e => {
         if(!showInventory && !showSafe){
            if(e.button == 0 || e.button == 2){
                window.addEventListener("mousemove", emitMouseMove)
                socket.emit('mousedown', e.button, e.clientX, e.clientY, canvas.width, canvas.height)
            }
         }
         else if(showInventory){
            var x = e.clientX
            var y = e.clientY
            var p = Math.floor((x-(canvas.width-800)/2)/80-1) + Math.floor((y-(canvas.height-480)/2)/80-1)*8
            if(p>=0 && p<=31){
                socket.emit('swap', p, "inventory", e.button)
            }
         }
         else if(showSafe){
            var x = e.clientX
            var y = e.clientY
            if(x>(canvas.width - 1300)/2+800){
                var p = Math.floor((x-(canvas.width-1300)/2-800)/100) + Math.floor((y-(canvas.height-500)/2)/100)*5
                if(p>=0 && p<25){
                    socket.emit('swap', p, "safe", e.button)
                }
            }
            else{
                var p = Math.floor((x-(canvas.width-1300)/2-80)/80) + Math.floor((y-(canvas.height-480)/2-80)/80)*8
                if(p>=0 && p<32){
                    socket.emit('swap', p, "inventory", e.button)
                }
            }
         }
        })

        window.addEventListener("mouseup", e => {
            if(e.button == 0 || e.button == 2){
                window.removeEventListener("mousemove", emitMouseMove)
                socket.emit("mouseup", e.button)
            }
        })
        

        socket.on("safeOpened",(px, py, safe) => {
            showSafe = true
        })
        
}

function draw(map, users){

    c.textAlign = "center"
    
    const player = users[playerID].player
    const inv = player.inventory.arr
   
    c.clearRect(0,0,w,h)
    c.drawImage(sky, 0, 0, w, h)
    //draws tilemap
    for(i=Math.floor(player.y - 32/64 - canvas.height/64)-1; i<Math.ceil(player.y - 32/64 + canvas.height/64)+1; i++){
        if(i<0) continue
        if(i>=map.length) break
        for(j=Math.floor(player.x - 7/32 - canvas.width/64)-1; j<Math.ceil(player.x - 7/32 + canvas.width/64)+1; j++){
            if(j<0) continue
            if(j>=map[i].length) break
            c.drawImage(imgs[map[i][j]], canvas.width/2 + 32*(j-player.x-7/32), canvas.height/2 + 32*(i-player.y-32/64), 32, 32)
        }
    }

    //draw miningprogression
    if(player.mining.active){// && Math.floor(player.mining.stage) < miningImgs.length){
        //c.drawImage(miningImgs[Math.floor(player.mining.stage)], canvas.width/2 + 32*(player.mining.current.x-player.x-7/32), canvas.height/2 + 32*(player.mining.current.y-player.y-32/64), 32, 32)
        c.fillStyle = `rgba(255, 0, 0, ${player.mining.stage/5})`
        c.fillRect(canvas.width/2 + 32*(player.mining.current.x-player.x-7/32), canvas.height/2 + 32*(player.mining.current.y-player.y-32/64), 32, 32)
    }
    

    const px = Math.round(player.x - 7/32 + (clientX - canvas.width/2)/32)
    const py = Math.round(player.y + (clientY - canvas.height/2)/32)
    //tegne inn den blokken man titter på med hvit rundt
    if((map[py] && map[py][px]) || (map[py] && map[py][px+1]) || (map[py] && map[py][px-1]) || (map[py+1] && map[py+1][px]) || (map[py-1] && map[py-1][px])/*sjekker om det går an å sette ut blokk på stedet*/ ){
        c.strokeStyle = "white"
        c.strokeRect(canvas.width/2 + 32*(px-player.x-7/32), canvas.height/2 + 32*(py-player.y-32/64), 32, 32)
    }

    if(player.img) c.drawImage(player.img, (canvas.width-16)/2, (canvas.height-32)/2, 32, 64)
    c.fillStyle = "black"
    c.font = "20px Arial bold"
    c.fillText(users[playerID].username, (canvas.width-16)/2 + 16, (canvas.height-32)/2 - 16)


  
  for (let [id, user] of Object.entries(users)){
    if(id != playerID){
        c.drawImage(user.player.img, canvas.width/2 + 32*(user.player.x-player.x-7/32), canvas.height/2 + 32*(user.player.y-player.y-32/64), 32, 64)
        c.fillText(user.username, canvas.width/2 + 32*(user.player.x-player.x-7/32) + 16, canvas.height/2 + 32*(user.player.y-player.y-32/64) - 16)
    }
  }

  //font for inventory og hotbar
  c.font = "20px Arial bold"
  c.fillStyle = "black"

  if(showSafe){
    
    //tegner inventory i tillegg til safe
    c.drawImage(inventory, (canvas.width-1300)/2, (canvas.height-480)/2, 800, 480)
    for(i=0; i<32; i+=1){
        if(inv[i].type != "empty"){
            c.drawImage(imgs[inv[i].value], 100 + i%8*80 + (canvas.width - 1300)/2, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2, 40, 40)

            //hvis boksen skal highlightes
            if(inv[i].highlighted){
                c.strokeStyle = "white"
                c.lineWidth = 4
                c.strokeRect(100 + i%8*80 + (canvas.width - 1300)/2 - 5, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2 - 5, 50, 50)
            }

            c.fillText(inv[i].number, 95 + (i%8)*80 + (canvas.width - 1300)/2, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2)
        }
    }
    c.drawImage(safe_inside, (canvas.width-1300)/2+800, (canvas.height-500)/2, 500, 500)

    c.fillStyle = "white"
    for(i=0; i<25; i+=1){
        if(player.safe.arr[i].type != "empty"){
            c.drawImage(imgs[player.safe.arr[i].value], 30 + i%5*100 + (canvas.width - 1300)/2+800, 30 + Math.floor(i/5)*100 + (canvas.height-500)/2, 40, 40)
            
            //hvis boksen skal highlightes
            if(player.safe.arr[i].highlighted){
                c.strokeStyle = "white"
                c.lineWidth = 4
                c.strokeRect(30 + i%5*100 + (canvas.width - 1300)/2+800 - 5, 30 + Math.floor(i/5)*100 + (canvas.height-500)/2 - 5, 50, 50)
            }


            
            c.fillText(player.safe.arr[i].number, 30 + (i%5)*100 + (canvas.width - 1300)/2+800, 30 + Math.floor(i/5)*100 + (canvas.height-500)/2)
        }
    }
  }
  if(showInventory){
    c.fillStyle = "black"
      //tegner kun inventory
    c.drawImage(inventory, (canvas.width-800)/2, (canvas.height-480)/2, 800, 480)
    for(i=0; i<32; i+=1){
        if(inv[i].type != "empty"){
            //hvis boksen skal highlightes
            if(inv[i].highlighted){
                c.strokeStyle = "white"
                c.lineWidth = 4
                c.strokeRect(100 + i%8*80 + (canvas.width - 800)/2 - 5, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2 - 5, 50, 50)
            }

            c.drawImage(imgs[inv[i].value], 100 + i%8*80 + (canvas.width - 800)/2, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2, 40, 40)
            c.fillText(inv[i].number, 95 + (i%8)*80 + (canvas.width - 800)/2, 100 + Math.floor(i/8)*80 + (canvas.height-480)/2)
            
            
        }
    }
  }
  //kun tegne inn hotbaren
  else{

    //tenger rektangel rundt den valgte
    c.strokeStyle = "white"
    c.lineWidth = 4
    c.strokeRect(100 + (player.hotBarSpot + 23)%8*80 + (canvas.width - 800)/2-5, canvas.height-105, 50, 50)

    for(let i=24; i<32; i++){
        if(inv[i].type != "empty"){
            c.drawImage(imgs[inv[i].value], 100 + i%8*80 + (canvas.width - 800)/2, canvas.height-100, 40, 40)
            c.fillText(inv[i].number, 95 + (i%8)*80 + (canvas.width - 800)/2, canvas.height-100)
        }
        c.fillStyle = "black"
        c.fillText(i-23, 95 + (i%8)*80 + (canvas.width - 800)/2 + 52, canvas.height-100 + 52)
    }
  }
}

//Sjekker om det er blokker mellom spilleren og musa
function sight(pPos, mPos, py, px, map){
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