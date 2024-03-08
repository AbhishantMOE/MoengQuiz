import MongoDbClient from "../../../../utils/mongo_client";
import { QuestionPoolSchema } from "../../../../schemas";
import { Question } from "../../../../schemas/question";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return createPool(req, res);
  }
}

async function createPool(req, res) {
  console.log("-------->", req.body);
  const { poolName, authorId } = req.body;

  const db = new MongoDbClient();
  await db.initClient();

  try {
    const pool = new QuestionPoolSchema({
      name: poolName,
      visibility: true,
      easy:0,
      medium:0,
      hard:0
    });

    await pool.save()

    return res.status(200).json({
      message: "Question Pool added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "An error was encountered",
    });
  }
}
