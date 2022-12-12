// core module imports
const fs = require("fs");
const path = require("path");

// third party module imports
const { validationResult } = require("express-validator/check");

// my imporst
const Post = require("../models/post");
const User = require("../models/user");
const io = require("../socket");

// helper functions

const clearImage = (filePath) => {
  fs.unlink(path.join(__dirname, "../", filePath), (err) => {
    if (err) console.log(err);
  });
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page;
  const postPerPage = 2;
  const totalItems = await Post.find().countDocuments();
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * postPerPage)
      .limit(postPerPage)
      .populate("creator", "name");

    return res.status(200).json({
      message: "posts fetched ",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const filename = req?.file?.filename;
  const validationErrors = validationResult(req);
  try {
    if (!validationErrors.isEmpty()) {
      const error = new Error("validation error");
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error("file not provided!");
      error.statusCode = 422;
      throw err;
    }
    const newPost = new Post({
      title,
      content,
      imageUrl: `images/${filename}`,
      creator: req.userId,
    });
    await newPost.save();

    const user = await User.findById(req.userId);
    user.posts.push(newPost);
    await user.save();

    const socketIo = io.getIo();
    socketIo.emit("posts", {
      action: "create",
      post: { ...newPost._doc, creator: { name: user.name, userId: user._id } },
    });

    return res.status(201).json({
      message: "post created succesffuly",
      post: newPost,
      creator: { name: user.name, userId: user._id },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("post could not be found !");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      message: "Post fetched  ",
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.editPost = async (req, res, next) => {
  const postId = req.params.postId;
  const validationErrors = validationResult(req);
  try {
    if (!validationErrors.isEmpty()) {
      const error = new Error("validation error");
      error.statusCode = 422;
      next(error);
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = `images/${req.file.filename}`;
    }

    if (!imageUrl) {
      const error = new Error("file not provided!");
      error.statusCode = 422;
      next(error);
    }
    const post = await Post.findById(postId).populate("creator", "name");
    if (!post) {
      const error = new Error("post could not be found !");
      error.statusCode = 404;
      throw error;
    }
    console.log(post.creator);
    if (post.creator._id != req.userId) {
      const error = new Error("Not Authorized !");
      error.statusCode = 401;
      throw error;
    }
    if (post.imageUrl !== imageUrl) clearImage(post.imageUrl);
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const updatedPost = await post.save();
    io.getIo().emit("posts", { action: "update", post: updatedPost });

    res.status(200).json({ message: "post updated successfully", post: post });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const postToDelete = await Post.findById(postId);
    if (!postToDelete) {
      const error = new Error("validation error");
      error.statusCode = 422;
      throw error;
    }

    if (postToDelete.creator != req.userId) {
      const error = new Error(" Not Authorized !");
      error.statusCode = 401;
      throw error;
    }
    await Post.findByIdAndRemove(postToDelete._id);

    const user = await User.findById(req.userId);
    user.posts.pull(postToDelete._id);
    clearImage(postToDelete.imageUrl);
    await user.save();
    io.getIo().emit("posts", { action: "delete", post: postId });
    return res.status(200).json({
      message: "post deleted successfully",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
