import { Schema} from 'mongoose';
import { default as AttemptSchema } from './attempt'; // Use default import
import mongoose from "mongoose";
const QuizTakenSchema = new Schema({
    userId:{type:String},
    userName:{type:String},
    quizId: { type: String },
    quizTitle: { type: String },
    attempts: {type:[AttemptSchema]}, // Array of Attempt subdocuments
});

export default mongoose.models.QuizTaken || mongoose.model('QuizTaken', QuizTakenSchema);