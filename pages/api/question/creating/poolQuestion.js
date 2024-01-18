import MongoDbClient from "../../../../utils/mongo_client";
import { QuestionPoolSchema } from "../../../../schemas";
import { Question } from "../../../../schemas/question";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return createPoolQuestion(req, res);
  }
}

async function createPoolQuestion(req, res) {
  console.log("+++++=====", req.body);
  const {
    poolName,
    authorId,
    description,
    options,
    correctAnswer,
    type,
    imageUrl,
    quizId,
  } = req.body;

  const db = new MongoDbClient();
  await db.initClient();
  //console.log(type);

  try {
    let newQuestion;

    switch (type) {
      case "MCQ":
        newQuestion = new Question({
          quizId: poolName,
          description,
          options,
          correctAnswer,
          type,
        });
        break;

      case "Reorder":
        newQuestion = new Question({
          quizId: poolName,
          description,
          options,
          type,
        });
        break;

      case "MCM":
        newQuestion = new Question({
          quizId: poolName,
          description,
          options,
          correctAnswer,
          type,
        });
        break;

      case "True/False":
        newQuestion = new Question({
          quizId: poolName,
          description,
          options: ["True", "False"],
          correctAnswer,
          type,
        });
        break;

      case "Hotspot":
        newQuestion = new Question({
          quizId: poolName,
          description,
          correctAnswer: correctAnswer,
          type,
          imageUrl,
        });
        break;

      default:
        return res.status(400).json({
          error: "Invalid question type",
        });
    }

    console.log("======>", newQuestion);

    await newQuestion.save();
    const quiz = await QuestionPoolSchema.updateOne(
      { name: poolName },

      {
        $push: { questions: newQuestion },
        authorId: authorId,
        visibility: false,
      },
      { upsert: true }
    );

    return res.status(200).json({
      message: "Question added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "An error was encountered",
    });
  }
}
