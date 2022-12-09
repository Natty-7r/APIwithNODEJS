const fs = require('fs');
const path = require('path');

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
console.log('getting all posts ')
}