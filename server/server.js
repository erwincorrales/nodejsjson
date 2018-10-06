'use strict'

const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.static('public'))

app.get('/json',  function(req, res){
  fs.readFile( __dirname + "/.." + path.join('/data/data.json'), 'utf8', (err, data) =>{
    if (err)  throw err
    res.json( JSON.parse(data) )
  })
})


app.listen(8080, function(){
  console.log('El servidor esta escuchando en puerto: 8080')
})
