const routes = require('express').Router()
module.exports = routes

routes.post('/login', (req, res) => {
    const db = require('../modules/db')
    db.find({username: req.body.username, password: req.body.password}).count((err, result) => {
        if(err) return console.log(err)
        if(result == 0) return res.send("Have to sign up")
        else return res.send("logged in!")
    })
})

routes.post('/signup', (req, res) => {
    const db = require('../modules/db')
    db.find({username: req.body.username}).count((err, result) => {
        if(err) return console.log(err)
        if(result == 0) {
            try {
            db.insertOne({username: req.body.username, password: req.body.password})
            return res.send("Registrert")
            } catch(e) {
                console.log(e)
            }
        } else {
            return res.send("name in db already")
        }
    })
})







