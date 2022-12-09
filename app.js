// core module imports 
const path = require('path');

// third party module imports 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer =  require('multer');

// my module imports 
const feedRoutes = require('./routes/feed');


// helper functions 
const multerStorage =  multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images')
  },
  filename:(req,file,cb)=>{
    cb(null,`image_${Date.now().toString()}_${file.originalname}`);
  }
})
const multerFilter =  (req,file,cb)=>{
  if(!(file.mimetype=='image/png'||
      file.mimetype=='image/jpg'||
      file.mimetype=='image/jpeg'||
      file.mimetype=='image/gif')
      )
      cb(null,false)
      else cb(null,true);
}
const app = express();
app.use('/images',express.static(path.join(__dirname,'images')));

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({storage:multerStorage,fileFilter:multerFilter}).single('image'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',"*")
  res.setHeader('Access-Control-Allow-Methods','OPTIONS,POST,GET,PUT,PATCH,DELETE')
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization')
 next();
});

app.use('/feed', feedRoutes);
app.use((err,req,res,next)=>{
  console.log(err, 'eeeeeeeeeee')
  const status =  err.statusCode;
  const errMessage = err.message;
 return  res.status(status).json({
    message:errMessage
  })
})


mongoose
.connect('mongodb://127.0.0.1:27017/Post',).then(result=>{
  app.listen(8080);
})
.catch(err=>console.log(err))

