import mongoose from "mongoose";
import MongoDbClient from "../../../../utils/mongo_client";
import { QuestionPoolSchema, QuestionSchema, QuizSchema } from "../../../../schemas";
import { Question } from "../../../../schemas/question";


export default function handler(req, res) {
    switch (req.method) {
        case "PUT":
            return updateQuestion(req, res);
        case "DELETE":
            return removeQuestion(req, res);
    }
}

async function updateQuestion(req, res) {
    const { questionId } = req.query;
    const { description, options, correctAnswer, type, hotspot } = req.body;  // Add 'type' and 'hotspot' fields

    const db = new MongoDbClient();
    await db.initClient();

    try {
        const question = await QuestionSchema.findById(questionId); // retrieve the question

        question.description = description;
        question.options = options;
        question.correctAnswer = correctAnswer;
        question.type = type;  // Update 'type' field
        question.hotspot = hotspot;  // Update 'hotspot' field

        await question.save(); // save changes

        return res.status(200).json({
            message: "Question updated successfully",
        });
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            error: "An error was encountered",
        });
    }  
}

async function removeQuestion(req, res) {
    console.log("This is the req body", req.body);
    const { questionId, poolId } = req.body;
    const db = new MongoDbClient();
    await db.initClient();

    try {
        //const question = await Question.findById(questionId);
        //const quizId = question.quizId;

        // Then: Remove the question from the Question collection
        //await Question.findByIdAndDelete(questionId);
        // At last: Remove the question from the respective Quiz
        let pool = await QuestionPoolSchema.findById(poolId);
        // console.log(pool)
        // The questions are plain JS objects, not mongoose docs, we have to find it manually
        const questionToRemove = pool.questions.find(question => question._id.toString() === questionId);

        // Removing it from array
        const questionIndex = pool.questions.indexOf(questionToRemove);
        if (questionIndex !== -1) {
            pool.questions.splice(questionIndex, 1);
        }

        // Telling mongoose that we've changed the questions array
        pool.markModified('questions');
        if(questionToRemove.difficulty === 'easy'){
                pool.easy = pool.easy-1
                pool.markModified("easy")
        }else if(questionToRemove.difficulty === 'medium'){
                pool.medium = pool.medium-1
                pool.markModified("medium")
        }else{
                pool.hard = pool.hard-1
                pool.markModified("hard")
        }
        // Now, save it back to database
        await pool.save();

        return res.status(200).json({
            message: "Question removed successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "An error was encountered",
        });
    }  
}