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
addRecipe(recipes, [1,1,1,1,1,1,1,1,1], "block", 6, 7)
addRecipe(recipes, [2,2,2,2,2,2,2,2,2], "pickaxe", 12, 1)

// let b = [1, 1, 1, 1, 1, 1, 1, 1, 1]

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

// console.log(checkRecipe(b))

module.exports = {checkRecipe}