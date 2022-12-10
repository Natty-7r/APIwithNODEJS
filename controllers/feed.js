
// core module imports 
const fs = require('fs');
const path = require('path');

// third party module imports
const {validationResult} =  require('express-validator/check');

// my imporst 
const Post =  require('../models/post')

// helper functions 

const clearImage = filePath=> {
  fs.unlink(
  path.join(__dirname,'../',filePath),
  err=>console.log(err)
  );

}

exports.getPosts =  async(req,res,next)=>{
  Post.find()
  .then(posts=>{
    return res.status(200).json({
      message:'posts fetched ',
      posts: posts,
    })
  })
  .catch(err=>{
    if(!err.statusCode) err.statusCode =  500;
    next(err);
  })
}

exports.createPost =  async(req,res,next)=>{
const title =  req.body.title;
const content = req.body.content;
const filename = req?.file?.filename; 
const validationErrors =  validationResult(req);
if(!validationErrors.isEmpty()){
  const error =  new Error('validation error');
  error.statusCode =  422;
  next(error);
}
if(!req.file){
  const error =  new Error('file not provided!');
  error.statusCode =  422;
  next(error);
}

const newPost =  new Post({
  title,
  content,
  imageUrl:`images/${filename}`,
  creator:{
    name:'natty '
  }
});
newPost.save()
.then(postSaved=>{
  return res.status(201).json({
  message:'post created succesffuly',
  post:postSaved,
})
})
.catch(err=>{
  if(!err.statusCode)
   err.statusCode =  500;
   next(err);
})
}
exports.getPost =  async(req,res,next) =>{
const postId =  req.params.postId;
Post.findById(postId).then(post=>{
  if(!post){
  const error =  new Error('post could not be found !');
  error.statusCode =  404;
  throw error;
  }
  else 
    return res.status(200).json({
    message: "Post fetched  ",
    post:post,
  });

}).catch(err=>{
  if(!err.statusCode)
   err.statusCode = 500;
  next(err);
})
}
exports.editPost =  async(req,res,next)=>{
const postId =  req.params.postId;
const validationErrors =  validationResult(req);
if(!validationErrors.isEmpty()){
  const error =  new Error('validation error');
  error.statusCode =  422;
  next(error);
}
const title =  req.body.title;
const content = req.body.content;
let  imageUrl =req.body.image;
if(req.file){
  imageUrl =  `images/${req.file.filename}`;
}
if(!imageUrl){
  const error =  new Error('file not provided!');
  error.statusCode =  422;
  next(error);
}
Post.findById(postId).then(post=>{
  if(!post){
    const error =  new Error('post could not be found !');
    error.statusCode =  404;
    throw error;
  }
  if(post.imageUrl!== imageUrl) clearImage(post.imageUrl);
  post.title = title;
  post.content = content;
  post.imageUrl = imageUrl;
  return post.save();
})
.then(updatedPost=>{
  res.status(200).json({message:'post updated successfully',post:updatedPost});
})
.catch(err=>{
  if(!err.statusCode)
  err.statusCode =  500;
  next(err);
})
}
exports.deletePost = async  (req,res,next)=>{
  const postId =  req.params.postId;
  try {
     const postToDelete =  await Post.findById(postId);
  if(!postToDelete){
     const error =  new Error('validation error');
     error.statusCode =  422;
     throw error;
  }
   Post.findByIdAndRemove(postToDelete._id).then(deleteResult=>{
    return res.status(200).json({
      message:'post deleted successfully',
    })
  })
  } catch (err) {
      if(!err.statusCode)
    err.statusCode  =  500;
    next(err)
  }
  
}