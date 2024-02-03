import MongoDbClient from "../../../../utils/mongo_client";
import { ResponseSchema } from "../../../../schemas";
import { Attempt } from "../../../../schemas/attempt";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return getResponses(req, res);
  }
}

async function getResponses(req, res) {
  const db = new MongoDbClient();
  await db.initClient();

  const { attemptId } = req.query;

  try {
    console.log("This the attempt ID", attemptId);
    let attempt = await Attempt.findById(attemptId);
    attempt = attempt.toJSON();

    const responseIds = attempt.responses;

    let attemptInfo = new Object();
    attemptInfo.score = attempt.score;
    attemptInfo.attemptId = attempt._id;

    let responses = await ResponseSchema.find({
      _id: {
        $in: responseIds,
      },
    });

    responses = responses.map((item) => item.toJSON());
    attemptInfo.responses = responses;
    console.log("Attempt Info", attemptInfo);

    return res.status(200).json(attemptInfo);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "An error was encountered",
    });
  }
}
