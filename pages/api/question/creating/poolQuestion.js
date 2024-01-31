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
    difficulty,
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

      default:
        return res.status(400).json({
          error: "Invalid question type",
        });
    }

    console.log("======>", newQuestion);

    await newQuestion.save();

    //////////
    let fieldToUpdate;
    if (difficulty == "easy") {
      fieldToUpdate = { easy: 1 };
    } else if (difficulty == "medium") {
      fieldToUpdate = { medium: 1 };
    } else fieldToUpdate = { hard: 1 };

    const quiz = await QuestionPoolSchema.updateOne(
      { name: poolName },
      {
        $push: { questions: newQuestion },
        $inc: { count: 1 },
        $inc: fieldToUpdate,
        authorId: authorId,
        visibility: false,
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
