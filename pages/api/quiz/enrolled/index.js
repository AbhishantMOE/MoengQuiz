import MongoDbClient from "../../../../utils/mongo_client";
import { getSession } from "next-auth/react"
import {QuizSchema} from "../../../../schemas"
import { log } from "console";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            return getEnrolledQuizzes(req, res); }
}

async function getEnrolledQuizzes(req, res) {
    const session = await getSession({ req })

    const db = new MongoDbClient();
    await db.initClient();

    try {
        if(req.query.flag === '1'){
            const fields = 'title duration description scheduledFor passingMarks attempts';
            const quizzes = await QuizSchema.find({ 'usersEnrolled': session.user.id }).select(fields);
            console.log(quizzes);
            return res.status(200).json(quizzes)
        } else {
            const quizzes = await QuizSchema.find({ 'usersEnrolled': session.user.id }); 
            return res.status(200).json(quizzes)
        }
    } catch (err) {
        return res.status(400).json({
            message: 'An error was encountered'
        })
    }  
}