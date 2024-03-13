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
  Select,
  Alert,
  AlertIcon,
  HStack,
  TagLabel,
  TagCloseButton,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { MdGraphicEq } from "react-icons/md";
import { createQuiz } from "../services/quiz";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

import Head from "next/head";
import { fetchPool } from "../services/fetchPools";
import { getPoolQ } from "../services/fetchPoolQ";
import { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
// import QuestionSelector from "../components/quiz/QuizSelector";
import { PoolListAccordian } from "../components/quiz/QuizPoolAccordian";
import PoolQModal from "../components/quiz/PoolModal";
export default function CreateQuiz() {
  const router = useRouter();
  const toast = useToast();
  const [poolDetail, setPoolDetail] = useState([]); /// added
  const [duration, setDuration] = useState(10);
  const [noOfQuestions, setNoOfQuestions] = useState(10);
  const [passingMarks, setPassingMarks] = useState(85);
  const [title, setTitle] = useState("");
  const [attempts, setAttempts] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledFor, setScheduledFor] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [pool, setPool] = useState("");
  const [poolq, setPoolQ] = useState([]);

  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // for Modal

  const { data: session } = useSession();

  const [poolSelectPref, setPoolSelectPref] = useState([]);

  useEffect(() => {
  }, [poolSelectPref]);

  const setPoolPref = (item) => {
    if (!poolSelectPref.find((element) => element.name == item.name)) {
      setPoolSelectPref([...poolSelectPref, item]);
    } else {
      toast({
        title: "Pool Already Added",
        description: "Duplicate Pool",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // const fetcher = (url) => axios.get(url, fetcher).then((resp) => resp.data);
  // const { data: modifiedList } = useSWR(
  //   "/api/question/creating/fetchPools",
  //   fetcher
  // );

  // const getList = () => {
  //   fetchPool().then((data) => {
  //     setList(data);
  //   });
  // };

  const getPoolQIndividual = async (poolName) => {
    const data = await getPoolQ(poolName);
    return data;
  };

  const getPoolQuestions = async (poolList) => {
    let list = await Promise.all(
      poolList.map((item) => getPoolQIndividual(item.name))
    ).then((data) => {
      const quiz = {
        title: title,
        duration: duration,
        description: description,
        authorId: session.user.id,
        scheduledFor: scheduledFor,
        endTime: endTime,
        questions: data.flat(),
        passingMarks: passingMarks,
        attempts: attempts
      };
      const resetForm = () => {
        setTitle("");
        setDescription("");
        setDuration(10);
        setLoading(false);
      };
      createQuiz(quiz)
        .then((data) => {
          if (data?.message) {
            resetForm();
            toast({
              title: "Success",
              description: data?.message,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            router.push(
              {
                pathname: "/quiz_detail",
                query: { quizId: data?.quizId },
              },
              "/quiz_detail"
            );
          } else {
            toast({
              title: "Error",
              description: data?.error,
              status: "error",
              duration: 9000,
              isClosable: true,
            });
          }
          resetForm();
        })
        .finally(() => setLoading(false));
    });
  };

  const clickSubmit = async () => {
    setLoading(true);

    const currentDate = new Date();
    currentDate.setSeconds(0, 0); 
    console.log(currentDate,"now");
    console.log(Date(scheduledFor), "start time");
    console.log(Date(endTime), "end time");

    if (new Date(scheduledFor) <= currentDate || new Date(endTime) <= currentDate) {
        toast({
          title: "Error",
          description: "Quiz start time and end time should not be in the past",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
        return;
    }

    if (new Date(scheduledFor) >= new Date(endTime)) {
        toast({
          title: "Error",
          description: "Quiz end time should not be before quiz start time",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
        return;
    }
    if (!attempts || attempts <= 0) {
      toast({
        title: "Error",
        description: "Number of attempts must be greater than 0",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
  }

    getPoolQuestions(poolSelectPref);

    const resetForm = () => {
      setTitle("");
      setDescription("");
      setDuration(10);
      setLoading(false);
    };
};

  return (
    <Box>
      <Head>
        <title>SE Assessment | Create Quiz</title>
      </Head>
      <Flex
        justify={"center"}
        align={"flex-start"}
        bg={useColorModeValue("gray.50", "gray.800")}
        mt={2}
      >
        <Stack spacing={8} mx={"auto"} w={"450px"}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create Quiz</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="title">
                <FormLabel>Title</FormLabel>
                <Input
                  variant={"flushed"}
                  color={"gray.500"}
                  placeholder={"Title"}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Type something"
                  size="md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormControl id="duration">
                <FormLabel>Duration</FormLabel>
                <Slider
                  aria-label="duration"
                  defaultValue={duration}
                  min={10}
                  max={120}
                  step={10}
                  onChange={(val) => setDuration(val)}
                >
                  <SliderMark value={duration} mt="3" ml="-2.5" fontSize="sm">
                    {duration} min
                  </SliderMark>
                  <SliderTrack bg="red.100">
                    <SliderFilledTrack bg="tomato" />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Box color="tomato" as={MdGraphicEq} />
                  </SliderThumb>
                </Slider>
              </FormControl>
              <FormControl id="scheduledFor">
                <FormLabel>Quiz Start Date and Time</FormLabel>
                <Input
                  variant={"flushed"}
                  color={"gray.500"}
                  placeholder="Select Quiz Start Date and Time"
                  type={"datetime-local"}
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                />
              </FormControl>
              {/* {poolDetail.length && 

              } */}
              <FormControl id="endTime">
                <FormLabel>Quiz End Date and Time</FormLabel>
                <Input
                  variant={"flushed"}
                  color={"gray.500"}
                  placeholder="Select Quiz End Date and Time"
                  type={"datetime-local"}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </FormControl>
              <FormControl id="passing marks">
                <FormLabel>Passing %</FormLabel>
                <Input
                  variant={"flushed"}
                  color={"gray.500"}
                  placeholder="Select Quiz Passing Marks"
                  type={"number"}
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(e.target.value)}
                />
              </FormControl>
              <FormControl id="no_of_attempts">
                <FormLabel>Number of Attempts %</FormLabel>
                <Input
                  variant={"flushed"}
                  color={"gray.500"}
                  placeholder="Select No Of Attempts"
                  type={"number"}
                  value={attempts}
                  onChange={(e) => setAttempts(e.target.value)}
                />
              </FormControl>

              {/* <HStack
                spacing={4}
                border="1px"
                borderRadius="2xl"
                borderColor="gray"
                padding="5px"
              >
                {["lg", "lg", "lg"].map((size) => (
                  <Tag
                    size={size}
                    key={size}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="green"
                  >
                    <TagLabel>Green</TagLabel>
                    <TagCloseButton />
                  </Tag>
                ))}
              </HStack> */}

              {/* diff
               */}
              {poolSelectPref.length && (
                <PoolListAccordian list={poolSelectPref} />
              )}

              <PoolQModal
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                setPoolPref={setPoolPref}
              />
              <Button colorScheme="teal" size="sm" onClick={onOpen}>
                Add Pools
              </Button>

              {/* <FormControl id="SelectedPool">
                <FormLabel>Select Question Pool (Optional)</FormLabel>
                <Select
                  onClick={() => getList()}
                  placeholder="Choose the Question Pool"
                  onChange={(e) => setPool(e.target.value)}
                >
                  {list.map((item, index) => (
                    <option value={item.name}>{item.name}</option>
                  ))}
                </Select>
              </FormControl> */}
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
                  Create
                </Button>
              </Stack>
              <Alert status="info">
                <AlertIcon />
                Note That after creating the quiz you add questions
              </Alert>
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
