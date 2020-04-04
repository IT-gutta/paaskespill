const hode = document.getElementById('hode')
const hale_rett = document.getElementById('hale_rett')
const hale_vri = document.getElementById('hale_vri')
const hale_slutt = document.getElementById('hale_slutt')
const eple = document.getElementById('eple')


// slange-class
class Snake {
  // har noen egenskaper
    constructor() {
        this.x = 0
        this.y = 0
        this.direction = ""
        this.angle = 0
        this.xs = 0
        this.ys = 0
        this.tail = []
        this.color = ""
        this.headcolor = "black"
        this.name = ""
        this.boosting = false
        this.boostready = true
    }
}

function name(x,y, name){
    c.fillStyle = "black";
    c.font = "20px Comic Sans MS";
    c.fillText(name, x-scale/2, y-10)
}

function drawRotated(img, x, y, angle) {
  c.save()
  c.translate(x+scale/2, y+scale/2)
  c.rotate(angle)
  c.translate(-(x+scale/2), -(y+scale/2))
  c.drawImage(img, x, y, scale, scale)
  c.restore()
}
 
function compare(x1, y1, x2, y2) {
  if(x1 > x2)return 1.5 * Math.PI
  if(x1 < x2)return Math.PI/2
  if(y1 < y2)return Math.PI
  if(y1 > y2)return 0
}

function findAngle3(x1, y1, x2, y2, x3, y3) {
  // fra venstre -> ned
  if(x2 > x3 && y1 > y2) return 0
  // fra venstre -> opp
  if(x2 > x3 && y1 < y2) return 0.5*Math.PI
  // fra opp -> venstre
  if(y2 > y3 && x1 < x2) return 0.5*Math.PI
  // fra opp -> høyre
  if(y2 > y3 && x1 > x2) return Math.PI
  // fra høyre -> ned
  if(x2 < x3 && y1 > y2) return 1.5*Math.PI
  // fra høyre -> opp
  if(x2 < x3 && y1 < y2) return Math.PI
  // fra ned -> venstre
  if(y2 < y3 && x1 < x2) return 0
  // fra ned -> høyre
  if(y2 < y3 && x1 > x2) return 1.5*Math.PI
}

function drawTails(snake) {
  // har egen case for lengde lik 1 siden den første halen følger hodet
  let f = snake.tail[0]
  // hvis lengden er en må man ha egen case, for man har ikke 3 deler å sammenligne
  if(snake.tail.length == 1){
    f.angle = snake.angle
    f.image = hale_slutt
    drawRotated(f.image, f.x, f.y, f.angle)
    snake.tail[0] = f
  } 
  // lengde større enn 1 bruker a som siste del å sammenligne
  else {
    let a = snake.tail[1]
    if((f.x == snake.x && f.x == a.x) || (f.y == snake.y && f.y == a.y)){
      f.image = hale_rett
      f.angle = snake.angle
      drawRotated(f.image, f.x, f.y, f.angle)
      snake.tail[0] = f
    }
      else {
        f.angle = findAngle3(snake.x, snake.y, f.x, f.y, a.x, a.y)
        f.image = hale_vri
        drawRotated(f.image, f.x, f.y, f.angle)
        snake.tail[0] = f
      }
  }

  // egen case om lengden er 2
  if(snake.tail.length == 2){
    let curr = snake.tail[1]
    curr.angle = compare(curr.x, curr.y, snake.tail[0].x, snake.tail[0].y)
    curr.image = hale_slutt
    drawRotated(curr.image, curr.x, curr.y, curr.angle)
    snake.tail[1] = curr
  }


  if(snake.tail.length > 2) {
    for (let i = 1; i < snake.tail.length-1; i++) {
      let f = snake.tail[i-1]
      let curr = snake.tail[i]
      let e = snake.tail[i+1]
        if((curr.x == f.x && curr.x == e.x) || (curr.y == f.y && curr.y == e.y)){
          curr.image = hale_rett
          curr.angle = compare(curr.x, curr.y, f.x, f.y)
        } else {
          curr.image = hale_vri
          curr.angle = findAngle3(f.x, f.y, curr.x, curr.y, e.x, e.y)
        }

      drawRotated(curr.image, curr.x, curr.y, curr.angle)
      snake.tail[i] = curr
    }
    let hale = snake.tail[snake.tail.length-1]
    let før = snake.tail[snake.tail.length-2]
    hale.angle = compare(hale.x, hale.y, før.x, før.y)
    drawRotated(hale_slutt, hale.x, hale.y, hale.angle)
  }
}




