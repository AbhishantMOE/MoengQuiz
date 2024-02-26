import { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Textarea,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { MdGraphicEq } from "react-icons/md";
import { createQuiz } from "../services/quiz";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Head from "next/head";
import CreateQuestion from "./create_question2";
import { createPool } from "../services/createPool";
export default function CreateQuiz() {
  const router = useRouter();
  const toast = useToast();
  const [poolName, setPoolName] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const { data: session } = useSession();
  const authorId = session?.user?.id;

  const clickSubmit = async () => {
    setLoading(true);
    const poolData = {
      poolName,
      authorId: session?.user?.id,
    };

    createPool(poolData)
      .then((data) => {
        console.log("Errororo", data);
        if (data?.message) {
          toast({
            title: "Success",
            description: data?.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          router.push({ pathname: "/my_quizzes" });
          //router.push({ pathname: "/quiz_detail", query: { quizId: quizId } });
        } else {
          toast({
            title: "Errorr",
            description: data?.error,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          console.log("Not Executed");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box>
      <Head>
        <title>Quiz Platform | Create Quiz</title>
      </Head>
      <Flex
        justify={"center"}
        align={"flex-start"}
        bg={useColorModeValue("gray.50", "gray.800")}
        mt={2}
      >
        <Stack spacing={8} mx={"auto"} w={"950px"}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create Question Pool</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="title">
                <FormLabel>Name</FormLabel>
                <Input
                  variant={"flushed"}
                  color={"gray.800"}
                  placeholder={"Pool Name"}
                  value={poolName}
                  onChange={(e) => setPoolName(e.target.value)}
                />
              </FormControl>
              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Brief Description of Question Pool"
                  size="md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <CreateQuestion
                poolName={poolName}
                authorId={authorId}
                countInc={() => setCount(count + 1)}
              />
              <h3>Questions Added: {count}</h3>
              <Stack spacing={10} my={8}>
                <Button
                  bg="#00237c"
                  color={"white"}
                  leftIcon={<FiEdit3 />}
                  isLoading={loading}
                  loadingText={"Saving ..."}
                  onClick={clickSubmit}
                  _hover={{
                    bg: "blue.700",
                  }}
                >
                  Create Pool
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
}

CreateQuiz.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
