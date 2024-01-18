import mongoose from "mongoose";
import { QuestionSchema } from "./index";
const { Schema } = mongoose;

const QuestionPool = new Schema({
  name: { type: String },
  authorId: { type: String },
  visibility: { type: Boolean },
  description: { type: String },
  questions: { type: [QuestionSchema] },
  count: { type: Number },
});

export default mongoose.models.QuestionPool ||
  mongoose.model("QuestionPool", QuestionPool);
