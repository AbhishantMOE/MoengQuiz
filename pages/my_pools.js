import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Box, Flex, Text, Heading, HStack, Tooltip, IconButton, useToast } from "@chakra-ui/react";
import Card from "../components/Card";
import { CgTrash } from "react-icons/cg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { deletePool } from "../services/createPoolQuestion";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Layout from "../components/Layout";
import Head from "next/head"

const fetcher = (url) => axios.get(url).then((resp) => resp.data);

export default function MyQuizzes() {
    const { data: session } = useSession();
    const { data: poolList } = useSWR("api/question/creating/fetchPools", fetcher);
    const [poolsState, setPoolsState] = useState(poolList);

    useEffect(() => setPoolsState(poolList), [poolList]);

    return (
        <>
            <Head>
                <title>SE Assessment | My Pools</title>
            </Head>
            {session?.user?.isAdmin && 
            <Box px={8}>
            <Heading py={5}>My Pools</Heading>
            <Card>
                {poolsState?.length === 0 ? (
                    <Text>You haven&apos;t created any pools yet.</Text>
                ) : (
                    <>
                        {poolsState?.map((pool) => (
                            <PoolItem key={pool?._id} pool={pool} />
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

const PoolItem = ({ pool }) => {
    const router = useRouter();
    const toast = useToast();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDeletePool() {
        setLoading(true);
        try {
            await deletePool(pool.id)
        
    //         mutate("/api/question/creating/fetchPools", (data) => 
    // data ? data.filter((p) => p._id !== pool._id) : [], false);
            
            toast({
                description: "Pool deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
            setTimeout(() => {
                window.location.reload()
                
            },100)
        }
    }

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
            <ConfirmDialog 
                title="Delete Pool" 
                isOpen={showConfirmModal} 
                isLoading={loading} 
                onClose={() => setShowConfirmModal(false)}
                onClickConfirm={handleDeletePool}
                description={'Are you sure you want to delete this pool?'}
            >
            </ConfirmDialog>
        </Box>
    );
};