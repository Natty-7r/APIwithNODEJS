 // thied party module imports 
const express = require('express');
const router = express.Router();
const {body} =  require('express-validator/check')



// my module imports 
const feedController = require('../controllers/feed');

// helper functions 
let  postValidation =  [
body('title').isLength({min:5}).withMessage('must be at least 7 character long'),
body('content').isLength({min:7}).withMessage('content must be at least 7 characters')];

// postValidation = [];

// GET get posts
router.get('/posts', feedController.getPosts);

//POST single post 
router.post('/post',postValidation,feedController.createPost)

// getting single post 
router.get('/post/:postId',feedController.getPost)

// editing a post 
router.put('/post/:postId',postValidation,feedController.editPost);

// deleting post 
router.delete('/post/:postId',feedController.deletePost);

module.exports = router;
