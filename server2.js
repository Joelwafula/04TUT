const express = require('express')
const app = express()
const PORT = 3000;

const cb0 = function(req,res,next){
    console.log('CB0')
    next()
}

const cb1 = function(req,res,next){
    console.log('CB1')
    next()
}

const cb2 = function(req,res){
    res.send("Hello from C!")
}

app.get("/example/c",[cb0,cb1,cb2])

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`))