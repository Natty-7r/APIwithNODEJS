 // thied party module imports 
const express = require('express');
const router = express.Router();
const {body} =  require('express-validator/check')



// my module imports 
const feedController = require('../controllers/feed');

// helper functions 
const postValidation =  [
body('title').isLength({min:5}).withMessage('must be at least 7 character long'),
body('content').isLength({min:7}).withMessage('content must be at least 7 characters')];


// GET get posts
router.get('/posts', feedController.getPosts);

//POST single post 
router.post('/post',postValidation,feedController.createPost)
router.get('/post/:postId',feedController.getPost)

module.exports = router;
