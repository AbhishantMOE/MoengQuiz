import { useState } from "react";
import {
    Box,
    Flex,
    Tag,
    IconButton,
    Heading,
    Text,
    HStack,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import Card from "../Card";
import {  FiPlay } from "react-icons/fi";
import { useRouter } from "next/router";
import { startQuiz } from "../../services/quiz";
import ConfirmDialog from "../common/ConfirmDialog";
import { useSession } from "next-auth/react";
import Countdown from "../Countdown";

const StudentQuizzes = ({ quizzes, quizzesTaken }) => {
    const { data: session } = useSession();
    console.log(quizzesTaken)
    return (
        <Box px={8}>
            <Heading py={5}>My Quizzes</Heading>
            <Card>
                {quizzes?.length === 0 ? (
                    <Text>You haven&apos;t enrolled to any quizzes yet.</Text>
                ) : (
                    <>
                        {quizzes?.map((quiz) => (
                            <QuizItem
                                key={quiz?._id}
                                quiz={quiz}
                                user={session?.user}
                                quizzesTaken={quizzesTaken}
                            />
                        ))}
                    </>
                )}
            </Card>
        </Box>
    );
};

const QuizItem = ({ quiz, user, quizzesTaken}) => {
    const router = useRouter();
    const toast = useToast();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData ] = useState();
    
    let quizTaken
    for(let i=0;i<quizzesTaken?.length;i++){
        if(quizzesTaken[i].quizId === quiz._id){
            quizTaken = quizzesTaken[i]
            break;
        }
    }
    console.log(quizzesTaken, "   ",quizTaken)
    const start = () => {

        startQuiz(quiz._id, user.id)
            .then((data) => {
                if (data?.error) {
                    toast({
                        title: "Error",
                        description: data?.error,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                } else {
                    setQuizData(data.quizData)
                    setShowConfirmModal(false);
                    toast({
                        title: "Success",
                        description: data?.message,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    launchFullScreen(document.documentElement);
                    router.push(
                        {
                            pathname: "/take_quiz",
                            query: { quizId: quiz._id },
                        },
                        "/take_quiz"
                    );
                }
            }).catch(err => console.log(err))
            .finally(() => {
                setLoading(false)
                setShowConfirmModal(false);
            });
    };
    function launchFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    return (
        <Box mb={6}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    {/* To add a push state */}
                    <Text
                        fontSize={"3xl"}
                        _hover={{
                            borderBottom: "2px solid #4299E1",
                        }}
                        cursor={"pointer"}
                    >
                        {quiz?.title}
                    </Text>
                </Flex>
                <Countdown
                    title={"Time Remaining for quiz to Start"}
                    isQuizCountdown={false}
                    totalTime={new Date(quiz?.scheduledFor?.replace("Z", ""))}
                    onComplete={() => {}}
                />
                <Tag
                    display={{ base: "none", lg: "flex" }}
                    bg={"teal.400"}
                    variant="subtle"
                    size="lg"
                    borderRadius={"full"}
                >
                    {quiz?.description}
                </Tag>
                <HStack spacing={4}>
                    {quiz?.attempts>quizTaken?.attempts || !quizTaken?
                    (<Tooltip
                    label={"Start Quiz"}
                    hasArrow
                    placement={"top"}
                    bg={"teal"}
                >
                    <IconButton
                        size={"md"}
                        icon={<FiPlay />}
                        isRound
                        bg={"gray.300"}
                        onClick={() => setShowConfirmModal(true)}
                    />
                </Tooltip>) :(
                    <Tooltip
                    label={"Attempt Limit Reached"}
                    hasArrow
                    placement={"top"}
                    bg={"teal"}
                >
                    <span>   
                    <IconButton
                        size={"md"}
                        icon={<FiPlay />}
                        isRound
                        bg={"gray.300"}
                        onClick={() => setShowConfirmModal(true)}
                        isDisabled
                        />
                    </span>
                </Tooltip>
                )
                    }
                    
                </HStack>
            </Flex>
            <br />
            <hr
                style={{
                    backgroundColor: "#CBD5E0",
                    color: "#CBD5E0",
                    height: 2,
                }}
            />
            <ConfirmDialog
                isOpen={showConfirmModal}
                onClose={setShowConfirmModal}
                title={"Start Quiz"}
                description={`Are you sure you want to start ${quiz?.title} quiz`}
                isLoading={loading}
                loadingText={"Enrolling"}
                onClickConfirm={start}
            />
        </Box>
    );
};

export default StudentQuizzes;
