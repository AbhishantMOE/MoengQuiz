import MongoDbClient from "../../../../utils/mongo_client";
import { QuizSchema, UserSchema } from "../../../../schemas";


export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            return updateAssignedUsers(req, res);
    }
}

async function updateAssignedUsers(req, res) {
    const { quizId } = req.query;
    const {usersEnrolled} = req.body
    const db = new MongoDbClient();

    console.log("Iam in asssigned userss", quizId, usersEnrolled);
    await db.initClient();

    try {
        let quiz = await QuizSchema.findById(quizId);
        console.log("fine1");
        let users = await UserSchema.find({_id: {$in: usersEnrolled}});
        console.log("fine2",quiz, users);

        quiz.usersEnrolled = []

        for(let i=0; i<users.length; i++){
            if (!users[i].quizzesEnrolled.includes(quizId)) {
                quiz.usersEnrolled.push(users[i]._id);
                users[i].quizzesEnrolled.push(quizId);
                await users[i].save();
              }
        }
        console.log("fine3");

        
        await quiz.save()
        return res.status(200).json({
            message: 'User enrolled successfully'
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: 'An error was encountered'
        });
    }  
}