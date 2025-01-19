import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true }, // HTML with embedded Base64 images
  council: { type: String },
  section: { type: String },
  designer: { type: String },
  coverphoto: { type: String },
  userId: {type: String},
},);

const Article = mongoose.model('Article', articleSchema);
export default Article;
