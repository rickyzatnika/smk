import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    content: { type: String },
    imageUrl: { type: String },
    slug: { type: String },
    category: { type: String },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};
const News = mongoose.model("News", NewsSchema);

export default News;
