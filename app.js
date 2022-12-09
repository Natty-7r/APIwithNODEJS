// core module imports 
const path = require('path');

// third party module imports 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// my module imports 
const feedRoutes = require('./routes/feed');

const app = express();
app.use('.images',express.static(path.join(__dirname,'images')));

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',"*")
  res.setHeader('Access-Control-Allow-Methods','OPTIONS,POST,GET,PUT,PATCH,DELETE')
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization')
 next();
});

app.use('/feed', feedRoutes);


mongoose
.connect('mongodb://127.0.0.1:27017/Post',).then(result=>{
  app.listen(8080);
})
.catch(err=>console.log(err))

