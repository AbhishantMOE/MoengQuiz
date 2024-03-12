import { QuestionPoolSchema } from "../../../../schemas";
import MongoDbClient from "../../../../utils/mongo_client";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return fetchPoolList(req, res);
  }
}

async function fetchPoolList(req, res) {
  const db = new MongoDbClient();
  await db.initClient();

  // Access the poolName from the query parameters

  const { poolName } = req.query;

  try {
    const data = await QuestionPoolSchema.find({
      name: poolName,
      visibility: true,
    });
    const poolQ = data[0].questions;

    return res.status(200).json(poolQ);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "An error was encountered",
    });
  }
}
