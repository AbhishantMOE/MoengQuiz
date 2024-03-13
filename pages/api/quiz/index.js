import { nanoid } from "nanoid";
import { QuizSchema } from "../../../schemas";
import MongoDbClient from "../../../utils/mongo_client";
import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";

dayjs.extend(utc);

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      return createQuiz(req, res);
  }
}

async function createQuiz(req, res) {
  const db = new MongoDbClient();
  await db.initClient();

  try {
    const {
      title,
      duration,
      description,
      authorId,
      scheduledFor,
      endTime,
      questions,
      passingMarks,
      attempts
    } = req.body;

    console.log(req.body);

    const newQuiz = new QuizSchema({
      title: title,
      duration: parseInt(duration),
      description: description,
      authorId: authorId,
      usersEnrolled: [],
      createdAt: dayjs().utc().add(5.5, 'hour').toDate(),
      scheduledFor: dayjs(scheduledFor).utc().add(5.5, 'hour').toDate(),
      endTime: dayjs(endTime).utc().add(5.5, 'hour').toDate(),
      questions: questions,
      passingMarks: passingMarks,
      attempts: attempts
    });

    await newQuiz.save();

    return res.status(200).json({
      message: "Quiz Created Successfully",
      quizId: newQuiz._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: `An error was encountered`,
    });
  }
}