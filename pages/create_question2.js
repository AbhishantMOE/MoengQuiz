import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Checkbox,
  Input,
  Stack,
  Button,
  Heading,
  Textarea,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
  GridItem,
  Select,
  useToast,
  RadioGroup,
  Radio,
  HStack,
  Text,
} from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/router";
import { createQuestion } from "../services/question";
import { createPoolQuestion } from "../services/createPoolQuestion";
import Layout from "../components/Layout";
import Head from "next/head";
import { Image } from "@chakra-ui/image";
import { DeleteIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
//const quizId = 3333;
export default function CreateQuestion({ poolName, countInc, authorId }) {
  const router = useRouter();
  const toast = useToast();
  const { quizId } = router.query;
  const image_url = null;
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [marker, setMarker] = useState({
    top: null,
    left: null,
    width: null,
    height: null,
  });
  const [dragging, setDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [options1, setOptions] = useState([""]);
  const [sentences, setSentences] = useState([""]);
  const [difficulty, setDifficulty] = useState("");
  const [selectInputs, setSelectInputs] = useState([[]]);
  const [selectAnswers, setSelectAnswers] = useState([]);

  const handleRemoveSelectInput = (selectIndex) => {
    const newSelectInputs = selectInputs.filter(
      (_, index) => index !== selectIndex
    );
    const newSelectAnswers = selectAnswers.filter(
      (_, index) => index !== selectIndex
    );
    setSelectInputs(newSelectInputs);
    setSelectAnswers(newSelectAnswers);
  };

  const handleRemoveOptionDropdown = (selectIndex, optionIndex) => {
    const newSelectInputs = [...selectInputs];
    newSelectInputs[selectIndex] = newSelectInputs[selectIndex].filter(
      (_, index) => index !== optionIndex
    );
    setSelectInputs(newSelectInputs);

    if (
      selectAnswers[selectIndex] === newSelectInputs[selectIndex][optionIndex]
    ) {
      const newSelectAnswers = [...selectAnswers];
      newSelectAnswers[selectIndex] = "";
      setSelectAnswers(newSelectAnswers);
    }
  };

  const addSelectInput = () => {
    setSelectInputs([...selectInputs, []]);
    setSelectAnswers([...selectAnswers, ""]);
  };

  const addOptionToSelectInput = (selectIndex) => {
    const newSelectInputs = [...selectInputs];
    newSelectInputs[selectIndex].push("");
    setSelectInputs(newSelectInputs);

    if (newSelectInputs[selectIndex].length === 1) {
      const newSelectAnswers = [...selectAnswers];
      newSelectAnswers[selectIndex] = "";
      setSelectAnswers(newSelectAnswers);
    }
  };

  const handleSelectInputChange = (selectIndex, optionIndex, event) => {
    const newSelectInputs = [...selectInputs];
    newSelectInputs[selectIndex][optionIndex] = event.target.value;
    setSelectInputs(newSelectInputs);

    if (optionIndex === 0) {
      const newSelectAnswers = [...selectAnswers];
      newSelectAnswers[selectIndex] = event.target.value;
      setSelectAnswers(newSelectAnswers);
    }
  };

  const handleSelectAnswerChange = (selectIndex, event) => {
    const newSelectAnswers = [...selectAnswers];
    newSelectAnswers[selectIndex] = event.target.value;

    setSelectAnswers(newSelectAnswers);
  };

  const handleAddSentence = () => {
    setSentences([...sentences, ""]);
  };

  const handleSentenceChange = (index, event) => {
    const newSentences = [...sentences];
    newSentences[index] = event.target.value;
    setSentences(newSentences);
  };

  const handleAddOption = () => {
    setOptions([...options1, ""]);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options1];
    newOptions[index] = event.target.value;

    if (index === 0 && correctAnswer === "") {
      setCorrectAnswer(newOptions[0]);
    }

    setOptions(newOptions);
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const startDraw = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMarker({ top: y, left: x, width: 0, height: 0 });
    setDragging(true);
  };

  const draw = (event) => {
    if (!dragging) {
      return;
    }
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMarker({ ...marker, width: x - marker.left, height: y - marker.top });
  };

  const endDraw = () => {
    setDragging(false);
    getBoxCoordinates();
  };

  const getBoxCoordinates = () => {
    return marker;
  };

  const resetForm = () => {
    setDescription("");
    setCorrectAnswer("");
    setQuestionType("");
    setLoading(false);
    setDifficulty("");
    setSelectAnswers([]);
    setSelectInputs([[]]);
    setOptions([""]);
    image_url = null;
    setMarker({
      top: null,
      left: null,
      width: null,
      height: null,
    });
  };
  const handleRemoveOption = (index) => {
    const newOptions = options1.filter((option, opIndex) => opIndex !== index);
    setOptions(newOptions);
    if (correctAnswer.includes(newOptions[index])) {
      setCorrectAnswer(correctAnswer.filter((cA) => cA !== newOptions[index]));
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "wc2ewopf");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dnb0henp1/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      image_url = data.url;
    } catch {
      console.log("Error");
    }
  };

  const clickSubmit = async () => {
    setLoading(true);

    console.log(
      "These are",
      difficulty,
      description,
      correctAnswer,
      questionType,
      marker,
      image_url
    );

    if (difficulty == "" || description == "" || questionType == "") {
      toast({
        title: "Error",
        description: "Please select required fields before proceeding",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (questionType == "fib") {
      if (selectAnswers == [] || selectAnswers.length == 0) {
        toast({
          title: "Error",
          description: "Please Select Answer",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
    } else if (questionType == "hotspot") {
      if (marker.top == null) {
        toast({
          title: "Error",
          description: "Please Select Coordinates/ upload Image",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
    } else {
      if (correctAnswer == "") {
        toast({
          title: "Error",
          description: "Please Select Answer",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
    }

    if (poolName == undefined || poolName == "" || poolName == null) {
      toast({
        title: "Error",
        description: "Please Enter Pool Name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    let questionData = {};

    if (questionType === "mcq") {
      questionData = {
        poolName,
        description,
        options: options1,
        correctAnswer,
        difficulty,
        type: "MCQ",
      };
    }
    if (questionType === "mcm") {
      questionData = {
        poolName,
        description,
        options: options1,
        correctAnswer,
        difficulty,
        type: "MCM",
      };
    }
    if (questionType === "mtf") {
      questionData = {
        poolName,
        description,
        matches: pairs,
        type: "Match the following",
        difficulty,
      };
    }
    if (questionType === "tf") {
      options1 = ["True", "False"];
      questionData = {
        poolName,
        description,
        options: options1,
        correctAnswer,
        difficulty,
        type: "True/False",
      };
    }
    if (questionType === "hotspot") {
      await uploadImage();
      if (image) {
        if (image_url == null) {
          toast({
            title: "Error",
            description: "Image upload failed",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
        }
      }
      const ans = getBoxCoordinates();
      questionData = {
        poolName,
        description,
        correctAnswer: ans,
        difficulty,
        type: "Hotspot",
        imageUrl: image_url,
      };
    }
    if (questionType === "reorder") {
      questionData = {
        description,
        options: sentences,
        difficulty,
        poolName,
        type: "Reorder",
      };
    }
    if (questionType === "fib") {
      questionData = {
        description,
        poolName,
        difficulty,
        type: "Fill",
        dropdowns: selectInputs.map((options, index) => ({
          options,
          correctAnswer: selectAnswers[index],
        })),
      };
    }
    questionData.quizId = "3333";
    createPoolQuestion(questionData)
      .then((data) => {
        console.log("Resetting it?");
        resetForm();
        countInc();
        if (data?.message) {
          toast({
            title: "Success",
            description: data?.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          //router.push({ pathname: "/quiz_detail", query: { quizId: quizId } });
        } else {
          toast({
            title: "Error",
            description: data?.error,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box>
      <Head>
        <title>SE Assessment | Create Question</title>
      </Head>
      <Flex
        justify={"center"}
        align={"flex-start"}
        bg={useColorModeValue("gray.50", "gray.800")}
        mt={2}
      >
        <Stack spacing={8} mx={"auto"} w={"768px"}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Add Questions</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <SimpleGrid spacing={6} columns={6} mb={8}>
              <FormControl id="questionType" as={GridItem} colSpan={6}>
                <FormLabel>Question Type</FormLabel>
                <Select
                  placeholder="Select the question type"
                  onChange={(e) => {
                    resetForm();
                    setQuestionType(e.target.value);
                  }}
                  value={questionType}
                >
                  <option value="mcq">
                    Multiple Choice Question (Single Correct)
                  </option>
                  <option value="mcm">
                    Multiple Choice Question (Multiple Correct)
                  </option>
                  <option value="tf">True/False</option>
                  <option value="fib">Fill in the blanks</option>
                  <option value="hotspot">Hotspot</option>
                </Select>
              </FormControl>
              {/* ////NEWWW//////// */}
              <RadioGroup
                onChange={(val) => setDifficulty(val)}
                value={difficulty}
              >
                <Stack direction="row">
                  <Radio value="easy">Easy</Radio>
                  <Radio value="medium">Medium</Radio>
                  <Radio value="hard">Hard</Radio>
                </Stack>
              </RadioGroup>
              <FormControl id="description" as={GridItem} colSpan={6}>
                <FormLabel>Question</FormLabel>
                <Textarea
                  placeholder="Type Question here ..."
                  size="md"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </FormControl>
              {/* Multi choice single correct */}
              {questionType === "mcq" && (
                <>
                  {options1.map((option, index) => (
                    <GridItem key={index} colSpan={[6, 3]}>
                      <Flex alignItems="center" mb={4}>
                        <Radio
                          mr={2}
                          isChecked={correctAnswer === option}
                          value={option}
                          onChange={(e) => setCorrectAnswer(e.target.value)}
                        />
                        <FormControl id={`option${index + 1}`}>
                          <FormLabel ml={2}>Option {index + 1}</FormLabel>
                          <Input
                            variant={"flushed"}
                            color={"gray.500"}
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e)}
                          />
                        </FormControl>
                        <Button
                          ml={2}
                          onClick={() => handleRemoveOption(index)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </GridItem>
                  ))}
                  <Button onClick={handleAddOption}>Add Option</Button>
                </>
              )}
              {/* Multi choice multi correct */}
              {questionType === "mcm" && (
                <>
                  {options1.map((option, index) => (
                    <GridItem key={index} colSpan={[6, 3]}>
                      <Flex alignItems="center" mb={4}>
                        <Checkbox
                          mr={2}
                          isChecked={correctAnswer.includes(option)}
                          value={option}
                          onChange={(e) =>
                            setCorrectAnswer(
                              e.target.checked
                                ? [...correctAnswer, e.target.value]
                                : correctAnswer.filter(
                                    (ca) => ca !== e.target.value
                                  )
                            )
                          }
                        />
                        <FormControl id={`option${index + 1}`}>
                          <FormLabel ml={2}>Option {index + 1}</FormLabel>
                          <Input
                            variant={"flushed"}
                            color={"gray.500"}
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e)}
                          />
                        </FormControl>
                        <Button
                          ml={2}
                          onClick={() => handleRemoveOption(index)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </GridItem>
                  ))}
                  <Button onClick={handleAddOption}>Add Option</Button>
                </>
              )}
              {/* True/False */}
              {questionType === "tf" && (
                <FormControl id="correctAnswer" as={GridItem} colSpan={6}>
                  <FormLabel>Answer</FormLabel>
                  <Select
                    placeholder="Choose the answer"
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  >
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </Select>
                </FormControl>
              )}
              {/* Match the following */}
              {questionType === "mtf" && <>to be added</>}
              {/* reorder sentence */}
              {questionType === "reorder" && (
                <>
                  {sentences.map((sentence, index) => (
                    <GridItem key={index} colSpan={[6, 3]}>
                      <FormControl id={`sentence${index + 1}`}>
                        <FormLabel>Sentence {index + 1}</FormLabel>
                        <Input
                          variant={"flushed"}
                          color={"gray.500"}
                          placeholder={`Sentence ${index + 1}`}
                          value={sentence}
                          onChange={(e) => handleSentenceChange(index, e)}
                        />
                      </FormControl>
                    </GridItem>
                  ))}
                  <Button onClick={handleAddSentence}>Add Sentence</Button>
                </>
              )}
              {/* fill in the blanks */}
              {questionType === "fib" && (
                <>
                  {selectInputs.map((selectInput, selectIndex) => (
                    <GridItem key={selectIndex} colSpan={[6, 3]}>
                      <FormControl
                        id={`dropdown${selectIndex + 1}`}
                        justifyContent="space-between"
                      >
                        <Flex justify="space-between" align="center">
                          <FormLabel mr={2} color="black">
                            Dropdown {selectIndex + 1}
                          </FormLabel>
                          <Button
                            onClick={() => handleRemoveSelectInput(selectIndex)}
                            size="sm"
                          >
                            <DeleteIcon color="red" />
                          </Button>
                        </Flex>
                        <br />

                        {selectInput.map((option, optionIndex) => (
                          <Flex
                            key={optionIndex}
                            marginBottom={3}
                            justifyContent="space-between"
                          >
                            <Input
                              flex="1 1 auto"
                              maxWidth="90%"
                              variant={"flushed"}
                              color={"gray.500"}
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleSelectInputChange(
                                  selectIndex,
                                  optionIndex,
                                  e
                                )
                              }
                            />
                            <Button
                              onClick={() =>
                                handleRemoveOptionDropdown(
                                  selectIndex,
                                  optionIndex
                                )
                              }
                              size="sm"
                            >
                              <DeleteIcon />
                            </Button>
                          </Flex>
                        ))}

                        <Button
                          onClick={() => addOptionToSelectInput(selectIndex)}
                          size="sm"
                        >
                          Add Option
                        </Button>
                      </FormControl>
                    </GridItem>
                  ))}
                  <Button my={3} onClick={addSelectInput} width="200px">
                    Add Dropdown
                  </Button>
                  <div></div>
                  {selectInputs.map((selectInput, selectIndex) => (
                    <GridItem key={selectIndex} colSpan={[6, 3]}>
                      <FormControl id={`dropdownAnswer${selectIndex + 1}`}>
                        <FormLabel>
                          Correct Answer for Dropdown {selectIndex + 1}
                        </FormLabel>
                        <Select
                          value={selectAnswers[selectIndex] || ""}
                          onChange={(e) =>
                            handleSelectAnswerChange(selectIndex, e)
                          }
                        >
                          {selectInput.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                  ))}
                </>
              )}
              {/* Hotspot type */}
              {questionType === "hotspot" && (
                <>
                  <FormControl id="questionImage" as={GridItem} colSpan={6}>
                    <FormLabel fontSize="lg" mb={2}>
                      Upload Image
                    </FormLabel>
                    <Input type="file" onChange={handleFileChange} />
                    <Box position={"relative"} mt={4}>
                      <p mb={2} fontSize="sm" color="gray.500">
                        Uploaded Image:
                      </p>

                      {image ? (
                        <>
                          <Image
                            boxSize="200px"
                            src={
                              imageUrl ? imageUrl : URL.createObjectURL(image)
                            }
                            onMouseDown={startDraw}
                            onMouseMove={draw}
                            onMouseUp={endDraw}
                            onDragStart={(event) => event.preventDefault()}
                            alt="Hotspot"
                            style={{
                              position: "relative",
                              display: "inline-block",
                              overflow: "hidden",
                              width: "750px",
                              height: "500px",
                            }}
                          />
                          <Box
                            style={{
                              position: "absolute",
                              top: marker.top + "px",
                              left: marker.left + "px",
                              width: marker.width + "px",
                              height: marker.height + "px",
                              border: "2px solid red",
                              boxSizing: "border-box",
                              pointerEvents: "none",
                            }}
                          />
                          <Alert status="info">
                            <AlertIcon />
                            Please add some margin for errors
                          </Alert>
                        </>
                      ) : (
                        <p>No image uploaded yet</p>
                      )}
                    </Box>
                  </FormControl>
                </>
              )}
            </SimpleGrid>
            <Stack spacing={10}>
              <Button
                bg="#00237c"
                color={"white"}
                leftIcon={<FiEdit3 />}
                loadingText={"Saving"}
                isLoading={loading}
                _hover={{ bg: "blue.500" }}
                onClick={clickSubmit}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
}

CreateQuestion.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
