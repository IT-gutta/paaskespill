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

module.exports = {random, timer, objectIsEmpty}