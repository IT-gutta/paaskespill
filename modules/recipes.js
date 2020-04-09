const variables = require("./variables")
const Item = variables.Item
let recipes = {}

function addRecipe(recipes, grid, type, value, quantity){
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


addRecipe(recipes, [1,1,1,1,1,1,1,1,1], "block", 6, 7)
addRecipe(recipes, [1,1,1,0,9,0,0,9,0], "pickaxe", 12, 1)

function addRecipeSingleItem(val, type, outComeValue, quantity){
    for(let i = 0; i < 9; i++){
        let arr = []
        for(let j = 0; j < 9; j++){
            if(i==j) arr[j] = val
            else arr[j] = 0
        }
        addRecipe(recipes, arr, type, outComeValue, quantity)
    }
}



module.exports = {checkRecipe}