import MongoDbClient from "../../../../utils/mongo_client";
import { QuestionPoolSchema } from "../../../../schemas";
import { Question } from "../../../../schemas/question";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return createPoolQuestion(req, res);
    case "DELETE":
      return deletePool(req, res);
  }
}

async function deletePool(req, res) {
  const db = new MongoDbClient();
  await db.initClient();
  const poolId = req.query.poolId;
  
  try {
    await QuestionPoolSchema.findByIdAndDelete(poolId);
    
    return res.status(204).end();
  } catch (err) {
      console.log(err);
      return res.status(400).json({
          message: "An error was encountered while deleting the pool",
      });
  }
}


async function createPoolQuestion(req, res) {
  const {
    poolName,
    authorId,
    description,
    options,
    correctAnswer,
    type,
    imageUrl,
    difficulty,
    quizId,
    dropdowns,
    poolId
  } = req.body;

  const db = new MongoDbClient();
  await db.initClient();

  try {
    let newQuestion;

    switch (type) {
      case "MCQ":
        newQuestion = new Question({
          quizId,
          poolName,
          description,
          options,
          correctAnswer,
          difficulty,
          type,
        });
        break;

      case "Reorder":
        newQuestion = new Question({
          quizId,
          poolName,
          description,
          options,
          difficulty,
          type,
        });
        break;

      case "MCM":
        newQuestion = new Question({
          quizId,
          poolName,
          description,
          options,
          correctAnswer,
          difficulty,
          type,
        });
        break;

      case "True/False":
        newQuestion = new Question({
          quizId,
          poolName,
          description,
          options: ["True", "False"],
          correctAnswer,
          difficulty,
          type,
        });
        break;

      case "Hotspot":
        newQuestion = new Question({
          quizId,
          poolName,
          description,
          correctAnswer: correctAnswer,
          difficulty,
          type,
          imageUrl,
        });
        break;

      case "Fill":
        newQuestion = new Question({
          quizId,
          poolName,
          description,
          dropdowns,
          correctAnswer: correctAnswer,
          type,
          difficulty,
        });
        break;

      default:
        return res.status(400).json({
          error: "Invalid question type",
        });
    }


    await newQuestion.save();

    //////////
    let fieldToUpdate;
    if (difficulty == "easy") {
      fieldToUpdate = { easy: 1 };
    } else if (difficulty == "medium") {
      fieldToUpdate = { medium: 1 };
    } else fieldToUpdate = { hard: 1 };

    const quiz = await QuestionPoolSchema.updateOne(
      { _id: poolId },
      {
        $push: { questions: newQuestion },
        $inc: { count: 1 },
        $inc: fieldToUpdate,
        authorId: authorId,
        visibility: true,
        poolName: poolName,
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
