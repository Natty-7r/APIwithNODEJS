
// core module imports 
const fs = require('fs');
const path = require('path');

// third party module imports
const {validationResult} =  require('express-validator/check');

module.exports.getPosts =  async(req,res,next)=>{
res.status(200).json({
  posts:[
    {
      title:'cat ',
      author:'natty',
      imageUrl: 'images/cat.jpg',
      content:'cat reading a book ',
      creator:{name:'natty'},
      _id: 1,
      createdAt: Date.now(),

    }
  ]
})
}

module.exports.createPost =  async(req,res,next)=>{
const title =  req.body.title;
const content = req.body.content;
const validationErrors =  validationResult(req);
if(!validationErrors.isEmpty()){
  return res.status(422).json({
    message: 'validation error',
    errors: validationErrors.array(),
  })
}
return res.status(201).json({
  message:'post created succesffuly',
  post: {
      title,
      content,
      author:'natty',
      creator:{name:'natty'},
      id: 1,
      createdAt: Date.now(),

    }
})
}