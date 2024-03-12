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

  try {
    const list = await QuestionPoolSchema.find({ visibility: true });
    const modifiedList = list.map((item) => ({
      id:item._id,
      name: item.name,
      count: item.questions.length,
      easy: item?.easy,
      medium: item?.medium,
      hard: item?.hard,
    }));
    return res.status(200).json(modifiedList);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "An error was encountered",
    });
  }
}
