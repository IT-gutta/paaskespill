const routes = require('express').Router()
module.exports = routes

routes.post('/login', (req, res) => {
    const db = require('../modules/db')
    console.log(req.body)
    db.find({username: req.body.username, password: req.body.password}).count((err, result) => {
        if(err) return res.status(404)
        if(result == 0) return res.json({msg: "Have to sign up", ok: false})
        else return res.json({msg: "logged in!", ok: true})
    })
})

routes.post('/signup', (req, res) => {
    const db = require('../modules/db')
    console.log(req.body)
    db.find({username: req.body.username}).count((err, result) => {
        if(err) return console.log(err)
        if(result == 0) {
            try {
            db.insertOne({username: req.body.username, password: req.body.password})
            return res.json({msg: "Registrert", ok: true})
            } catch(e) {
                console.log(e)
            }
        } else {
            return res.json({msg: "name in db already", ok: false})
        }
    })
})