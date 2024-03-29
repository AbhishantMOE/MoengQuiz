import MongoDbClient from "../../../../utils/mongo_client";
import { getSession } from "next-auth/react";
import { QuizSchema, UserSchema } from "../../../../schemas";
import quiz from "../../../../schemas/quiz";
import { Question } from "../../../../schemas/question";

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getQuizDetails(req, res);
    case "PUT":
      return updateDetails(req, res);
    case "DELETE":
      return removeQuiz(req, res);
  }
}

async function getQuizDetails(req, res) {
  const { quizId } = req.query;

  const db = new MongoDbClient();
  await db.initClient();

  try {
    const quiz = await QuizSchema.findById(quizId);
    return res.status(200).json({
      id: quiz._id,
      title: quiz.title,
      duration: quiz.duration,
      description: quiz.description,
      authorId: quiz.authorId,
      usersEnrolled:quiz.usersEnrolled,
      scheduledFor: quiz?.scheduledFor,
      endTime: quiz?.endTime,
      difficulty: quiz?.difficulty,
      questions: quiz?.questions,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "An error was encountered",
    });
  }
}

async function updateDetails(req, res) {
  const { quizId } = req.query;

  const db = new MongoDbClient();
  await db.initClient();

  const session = await getSession({ req });
  const userId = session?.user?._id;

  const { title, description, duration, scheduledFor, endTime, difficulty } =
    req.body;

  try {
    const quiz = await QuizSchema.findById(quizId);

    // Confirm the user removing is the author
    if (quiz.authorId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to remove the quiz",
      });
    }

    // Make changes
    quiz.description = description;
    quiz.title = title;
    quiz.duration = duration;
    quiz.scheduledFor = scheduledFor;
    quiz.endTime = endTime;

    // Save changes
    await quiz.save();

    return res.status(200).json({
      message: "Quiz Details updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "An error was encountered",
    });
  }
}

async function removeQuiz(req, res) {
  const { quizId } = req.query;
  const session = await getSession({ req });
  const user = session?.user;
  const db = new MongoDbClient();
  await db.initClient();

  try {
    if (user.isAdmin === false) {
      return res.status(403).json({
        message: "You are not authorized to remove the quiz",
      });
    }
    const quiz = await QuizSchema.findById(quizId);
    //Delete the questions
    const questions = quiz?.questions;
    if (questions && questions.length > 0) {
      for (let question of questions) {
        await Question.findByIdAndDelete(question._id);
      }
    }
    //Remove the quizId from enrolledQuizes in all users with the quizId.
    await UserSchema.updateMany({}, { $pull: { quizzesEnrolled: quizId } });
    // Now remove the quiz
    await QuizSchema.findByIdAndDelete(quizId);

    return res.status(200).json({
      message: "Quiz removed successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "An error was encountered",
    });
  }
}
