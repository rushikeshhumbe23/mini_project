const mongoose = require("mongoose");

const reqString = { type: String, required: true };
const reqNumber = { type: Number, required: true };
const reqArray = { type: Array, required: true };

const postSchema = mongoose.Schema(
  {
    title: reqString,
    content: reqString,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    username: reqString,
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    tags: { type: [String], default: [] },
  },
  {
    versionKey: false,
  }
);

const PostModel = mongoose.model("post", postSchema);

module.exports = PostModel;
