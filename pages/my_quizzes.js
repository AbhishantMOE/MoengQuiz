import useSWR from "swr";
import { useSession } from "next-auth/react";
import axios from "axios";
import AuthorQuizzes from "../components/quiz/AuthorQuizzes";
import StudentQuizzes from "../components/quiz/StudentQuizzes";
import Layout from "../components/Layout";
import Head from "next/head"

const fetcher = (url) => axios.get(url).then((resp) => resp.data);
const flag = "1";

export default function MyQuizzes() {
    const { data: session } = useSession();

    const { data: quizzes } = useSWR(
        () =>
            session?.user?.isAdmin
                ? "/api/user/my_quizzes"
                : `/api/quiz/enrolled?flag=${flag}`,
        fetcher
    );

    
    const { data: quizzesTaken } = useSWR("/api/quiz/submissions", fetcher);

    return (
        <>
            <Head>
                <title>SE Assessment | My Quizzes</title>
            </Head>
            {session?.user?.isAdmin ? (
                <AuthorQuizzes quizzes={quizzes} />
            ) : (
                <StudentQuizzes quizzes={quizzes} quizzesTaken={quizzesTaken} />
            )}
        </>
    );
}

MyQuizzes.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
