form.onsubmit = e => {
    e.preventDefault()
    socket.emit('new-user', textField.value)

    socket.on('heartbeat', (map, users) => {
        for (let [id, user] of Object.entries(users)) {
            if(user.player.direction == "right") user.player.img = player_right
            else user.player.img = player_left
            console.log(user.player)
            draw(map, user.player)
        }
    })

    window.addEventListener("keydown", e => {
        if(e.keyCode == 65 || e.keyCode == 68 || e.keyCode == 32) socket.emit('keysD', e.keyCode)
    })

    window.addEventListener("keyup", e => {
        if(e.keyCode == 65 || e.keyCode == 68) socket.emit('keysU', e.keyCode)
    })
}

function draw(map, player){
  c.clearRect(0,0,w,h)
  c.drawImage(sky, 0, 0)
  for(i=0; i<map.length; i++){
      for(j=0; j<map[0].length; j++){
          if(map[i][j]!=9){
              c.drawImage(imgs[map[i][j]], 32*j, 32*i, 32, 32)
          }
      }
  }
  c.drawImage(player.img, player.x*32, player.y*32, 32, 64)
}