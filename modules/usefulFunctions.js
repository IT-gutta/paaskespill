function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  function timer(start, dur, func) {
    let delta = Date.now() - start; // milliseconds elapsed since start
    time = delta
    if (delta > dur) {
      func()
    }
  }

  function objectIsEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function userExists(object, id) {
  if(object.hasOwnProperty(id)) return true
  return false
}

function equalsSome(val, arr){
  for(let i = 0; i < arr.length; i++){
    if(arr[i] == val) return true
  }
  return false
}

function equalsAll(val, arr){
  for(let i = 0; i < arr.length; i++){
    if(arr[i] != val) return false
  }
  return true
}

module.exports = {random, timer, objectIsEmpty, userExists, equalsSome, equalsAll}