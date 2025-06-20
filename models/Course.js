// Course.js
import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  image: String,
  youtubeLink: String,
  chapters: [chapterSchema],
  createdAt: { type: Date, default: Date.now },
  userId: String,
});

// ✅ ES Module export
export default mongoose.model("Course", courseSchema);
