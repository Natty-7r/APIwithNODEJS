 // thied party module imports 
const express = require('express');
const router = express.Router();
const {body} =  require('express-validator/check')



// my module imports 
const feedController = require('../controllers/feed');


// GET /feed/posts
router.get('/posts', feedController.getPosts);

//POST /feed/post
router.post('/post',[
  body('title').isLength({min:7}).withMessage('must be at least 7 character long'),
body('content').isLength({min:7}).withMessage('content must be at least 7 characters')]
,feedController.createPost)

module.exports = router;
