import useSWR from "swr";
import { useSession } from "next-auth/react";
import axios from "axios";
import AuthorQuizzes from "../components/quiz/AuthorQuizzes";
import StudentQuizzes from "../components/quiz/StudentQuizzes";
import Layout from "../components/Layout";
import Head from "next/head"
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
import Card from "../components/Card";
import { CgTrash } from "react-icons/cg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { removeQuiz } from "../services/quiz";
import ConfirmDialog from "../components/common/ConfirmDialog";


const fetcher = (url) => axios.get(url).then((resp) => resp.data);

export default function MyQuizzes() {
    const { data: session } = useSession();

    const { data: poolList } = useSWR(
          "/api/question/creating/fetchPools",
          fetcher
        );
    const [poolsState, setPoolsState] = useState(poolList);
    useEffect(() => {
        setPoolsState(poolList);
    }, poolList);

    return (
        <>
            <Head>
                <title>SE Assessment | My Quizzes</title>
            </Head>
            {session?.user?.isAdmin && 
            <Box px={8}>
            <Heading py={5}>My Pools</Heading>
            <Card>
                {poolsState?.length === 0 ? (
                    <Text>You haven&apos;t authored any quizzes yet.</Text>
                ) : (
                    <>
                        {poolsState?.map((pool) => (
                            <PoolItem key={pool?._id} pool={pool} setPoolsState={setPoolsState} />
                        ))}
                    </>
                )}
            </Card>
        </Box>}
        </>
    );
}

MyQuizzes.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};


const PoolItem = ({ pool, setPoolsState }) => {
    const router = useRouter();
    const toast = useToast();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log(pool)

    // const remove = () => {
    //     setLoading(true);
    //     removeQuiz(pool?._id)
    //         .then((data) => {
    //             if (data.message) {
    //                 setShowConfirmModal(false);
    //                 toast({
    //                     title: "Success",
    //                     description: data?.message,
    //                     status: "success",
    //                     duration: 9000,
    //                     isClosable: true,
    //                 });
    //                 setQuizzesState(prev => prev.filter(q => q._id !== quiz._id));
    //                 router.replace("/my_quizzes");
    //             } else {
    //                 toast({
    //                     title: "Error",
    //                     description: data?.error,
    //                     status: "success",
    //                     duration: 9000,
    //                     isClosable: true,
    //                 });
    //             }
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //             setShowConfirmModal(false);
    //         });
    // };

    return (
        <Box mb={6}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    {/* To add a push state */}
                    <Text
                        fontSize={"3xl"}
                        maxWidth={"250px"}  
                        whiteSpace={"normal"} // enable text wrap
                        _hover={{
                            borderBottom: "2px solid #4299E1",
                        }}
                        cursor={"pointer"}
                        onClick={() =>
                            router.push(
                                {
                                    pathname: "/pool_detail",
                                    query: { poolId: pool?.id },
                                },
                                "/pool_detail"
                            )
                        }
                    >
                        {pool?.name}
                    </Text>
                </Flex>
                {/* <Tag
                    display={{ base: "none", lg: "flex" }}
                    bg={"teal.400"}
                    variant="subtle"
                    size="lg"
                    borderRadius={"full"}
                >
                    {quiz?.description}
                </Tag> */}
                <HStack spacing={4}>
                    <Tooltip
                        label={"Remove Pool"}
                        hasArrow
                        placement={"right"}
                        bg={"teal"}
                    >
                        <IconButton
                            size={"sm"}
                            aria-label={"remove"}
                            icon={<CgTrash />}
                            isRound
                            bg={"gray.300"}
                            onClick={() => setShowConfirmModal(true)}
                        />
                    </Tooltip>
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
            {/* <ConfirmDialog
                isOpen={showConfirmModal}
                onClose={setShowConfirmModal}
                title={"Remove Quiz"}
                description={`Are you sure you want to remove ${pool?.name} pool`}
                isLoading={loading}
                loadingText={"Removing"}
                onClickConfirm={remove}
            /> */}
        </Box>
    );
};

