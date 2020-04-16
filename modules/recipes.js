const variables = require("./variables")
const Item = variables.Item
let recipes = {}

function addRecipe(grid, type, value, quantity){
    current = recipes
    for(i=0; i<grid.length; i++){
        if(current[grid[i]]==undefined){
            current[grid[i]] = {}
        }
        current = current[grid[i]]
    }
    current.value = value
    current.quantity = quantity
    current.type = type
}


function checkRecipe(currentRecipe){
    try{
        const a = recipes[currentRecipe[0].value][currentRecipe[1].value][currentRecipe[2].value][currentRecipe[3].value][currentRecipe[4].value][currentRecipe[5].value][currentRecipe[6].value][currentRecipe[7].value][currentRecipe[8].value]
        if(a==undefined){
            return false
        }
        return a
    }
    catch{
        return false
    }
}




function addRecipeSingleItem(val, type, outComeValue, quantity){
    for(let i = 0; i < 9; i++){
        let arr = []
        for(let j = 0; j < 9; j++){
            if(i==j) arr[j] = val
            else arr[j] = 0
        }
        addRecipe(arr, type, outComeValue, quantity)
    }
}
//pickaxe
addRecipe([1,1,1,0,9,0,0,9,0], "pickaxe", 12, 1)

//1 wood til 4 sticks
addRecipeSingleItem(2, "material", 9, 4)

//safe
addRecipe([1,1,1,17,18,17,1,1,1], "interactable", 8, 1)



module.exports = {checkRecipe}