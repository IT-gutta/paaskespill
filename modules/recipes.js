let recipes = {}

function addRecipe(recipes, grid, id, quantity){
    current = recipes
    for(i=0; i<grid.length; i++){
        if(current[grid[i]]==undefined){
            current[grid[i]] = {}
        }
        current = current[grid[i]]
    }
    current.id = id
    current.quantity = quantity
}
addRecipe(recipes, [1,1,1,1,1,1,1,1,1], 6, 7)
addRecipe(recipes, [9,8,7,6,5,4,3,2,1], )
addRecipe(recipes, [1,8,7,6,5,4,3,2,1])
console.log(recipes)

var a = [1,1,1,1,1,1,1,1,1]

function checkRecipe(recipes, currentRecipe){
    try{
        let a = recipes[currentRecipe[0]][currentRecipe[1]][currentRecipe[2]][currentRecipe[3]][currentRecipe[4]][currentRecipe[5]][currentRecipe[6]][currentRecipe[7]][currentRecipe[8]]
        if(a==undefined){
            return false
        }
        return a
    }
    catch{
        return false
    }
}
console.log(checkRecipe(recipes, a))