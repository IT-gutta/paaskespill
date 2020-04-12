function getWallCount(arr, x, y){
    let wallCount = 0
    for(let i = y-1; i <= y+1; i++){
        for(let j = x-1; j <= x+1; j++){
            if(!arr[i]) wallCount++
            else if(arr[i][j] == undefined) wallCount++
            else if(arr[i][j]) wallCount++
        }
    }

    return wallCount
}

function createCaveMap(width, height, blockSize, fillPercent){
    //lage et tomt 2-dimensjonalt array
    let arr = []
    for(let y = 0; y < Math.floor(height/blockSize); y++){
        arr.push([])
        for(let x = 0; x < Math.floor(width/blockSize); x++){
            arr[y].push([])
            arr[y][x] = random(100) < fillPercent ? 1 : 0
        }
    }

    //smooth map
    for(let i = 0; i < 5; i++){
        for(let y = 0; y < arr.length; y++){
            for(let x = 0; x < arr[0].length; x++){
                const wallCount = getWallCount(arr, x, y)
                if(wallCount > 4) arr[y][x] = 1
                else if(wallCount < 4) arr[y][x] = 0
            }
        }
    }

    //floodfill

    return arr
}

//implementerer cavemappet inn i det andre mappet
function adjustMap(caveMap, map){
    // let arr = JSON.parse(JSON.stringify(map))
    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map[0].length; x++){
            if(caveMap[y][x] == 0) map[y][x] = 0
        }
    }

    // return arr
}
