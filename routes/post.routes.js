const express = require("express");
const PostModel = require("../model/post.model");
const auth = require("../middleware/auth.meddleware");
const postRouter = express.Router();

// creating new Post
postRouter.post("/", auth, async (req, res) => {
  const { content, title } = req.body;
  const creator = req.userId;
  const username = req.username;
  try {
    const newPost = {
      content,
      title,
      creator,
      username,
    };
    const post = await PostModel(newPost);
    await post.populate("creator");
    await post.save();
    res.status(200).json({ msg: "Post added", post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.get("/search", async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const title = new RegExp(searchQuery, "i");
    const posts = await PostModel.find({ title });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.patch("/update/:postId", auth, async (req, res) => {
  const { postId } = req.params;
  const post = await PostModel.findById(postId);
  try {
    if (post.creator.toString() !== req.userId) {
      return res
        .status(201)
        .json({ msg: "You are not allowed to update the post" });
    } else {
      const post = await PostModel.findByIdAndUpdate(
        { _id: postId },
        req.body,
        {
          new: true,
        }
      );
      return res.status(200).json({ post });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

postRouter.delete("/delete/:postId", auth, async (req, res) => {
  const { postId } = req.params;
  const post = await PostModel.findById(postId);

  try {
    if (post.creator.toString() !== req.userId) {
      return res
        .status(201)
        .json({ msg: "You are not allowed to delete the post" });
    } else {
      const post = await PostModel.findByIdAndDelete({ _id: postId });
      return res.status(200).json({ post });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

postRouter.patch("/like/:postId", auth, async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await PostModel.findById(postId);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index == -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes?.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostModel.findByIdAndUpdate(
      { _id: postId },
      post,
      { new: true }
    );
    return res.status(200).json({ updatedPost });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
postRouter.patch("/comment/:postId", auth, async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  try {
    const post = await PostModel.findById(postId);
    post.comments.push(comment);
    const updatedPost = await PostModel.findByIdAndUpdate(
      { _id: postId },
      post,
      { new: true }
    );
    return res.status(200).json({ updatedPost });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = postRouter;
