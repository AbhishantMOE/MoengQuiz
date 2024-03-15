import { useEffect, useState } from "react";
import { Heading, Box, SimpleGrid, GridItem } from "@chakra-ui/react";
import Info from "../components/quiz/Info";
import Questions from "../components/quiz/Questions";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Layout from "../components/Layout";
import Enrollusers from "../components/quiz/EnrollUsers";
import Head from "next/head";
import PoolInfo from "../components/quiz/PoolInfo";
import PoolQuestions from "../components/quiz/PoolQuestions";
import Cookies from "js-cookie";

const fetcher = (url) => axios.get(url).then((resp) => resp.data);
export default function QuizDetails() {
  const router = useRouter();
  const [poolId, setPoolId] = useState("");
  const [poolData, setPoolData] = useState("")
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    const { poolId: id } = router.query;
    if (id) {
      setPoolId(id);
    }
  }, [router]);
  useEffect(() => {
    const { poolId: id } = router.query;
    if(id) {
      setPoolId(id);
      Cookies.set('poolId', id);
    } else {
      const poolIdFromCookie = Cookies.get('poolId');
      if(poolIdFromCookie) {
        setPoolId(poolIdFromCookie);
      }
    }
    return () => {
      Cookies.remove('poolId');
    }
  }, [router.query]);
  const { data: pool } = useSWR(() => `/api/question/creating/pools/${poolId}`, fetcher);
  useEffect(() => {
    setPoolData(pool);
  },[pool,update]);
  return (
    <Box px={8} style={{ fontFamily: "Poppins" }}>
      <Head>
        <title>SE Assessment | Quiz Details</title>
      </Head>
      <Heading py={5}>Pool Details</Heading>
      <Box py={2} mx="auto">
        <SimpleGrid
          w={{ base: "full", xl: 11 / 12 }}
          columns={{ base: 1, lg: 11 }}
          gap={{ base: 0, lg: 16 }}
          // mx="auto"
        >
          <GridItem colSpan={{ base: "auto", md: 4 }}>
            <PoolInfo pool={pool} />
          </GridItem>
          <GridItem colSpan={{ base: "auto", lg: 7 }}>
            <PoolQuestions pool={pool} />
          </GridItem>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
QuizDetails.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

