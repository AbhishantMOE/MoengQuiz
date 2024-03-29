import {
    Box,
    Flex,
    IconButton,
    Heading,
    Text,
    Tooltip,
    Tag,
} from "@chakra-ui/react";
import Card from "../components/Card";
import Layout from "../components/Layout";
import { IoEyeSharp } from "react-icons/io5";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

const fetcher = (url) => axios.get(url, fetcher).then((resp) => resp.data);

export default function Users() {
    const { data: users } = useSWR("/api/user", fetcher);

    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Heading py={5}>Users</Heading>
            <Card>
                {users?.map((user) => (
                    <UserItem key={user?._id} user={user} />
                ))}
            </Card>
        </Box>
    );
}

const UserItem = ({ user }) => {
    const router = useRouter();
    return (
        <Box mb={6}>
            <Head>
                <title>Quizzes | Users</title>
            </Head>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    {/* To add a push state */}
                    <Flex
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                    >
                        <Text fontSize={"xl"}>{user?.name}</Text>
                        <Text fontSize={"md"} color={"gray.500"}>
                            {user?.email}
                        </Text>
                    </Flex>
                </Flex>
                <Tag
                    display={{ base: "none", lg: "flex" }}
                    bg={"teal.400"}
                    variant="subtle"
                    size="lg"
                    borderRadius={"full"}
                >
                    {user?.isAdmin ? "Administrator" : "Student"}
                </Tag>
                <Tooltip
                    label={"View Profile"}
                    hasArrow
                    placement={"top"}
                    bg={"teal"}
                >
                    <IconButton
                        size={"md"}
                        icon={<IoEyeSharp />}
                        isRound
                        bg={"cyan.100"}
                        onClick={() => {
                            router.push(
                                {
                                    pathname: "/userprofile",
                                    query: {
                                        userId: user?._id,
                                    },
                                },
                                "/userprofile"
                            );
                        }}
                    />
                </Tooltip>
            </Flex>
            <br />
            <hr
                style={{
                    backgroundColor: "#CBD5E0",
                    color: "#CBD5E0",
                    height: 2,
                }}
            />
        </Box>
    );
};

Users.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
