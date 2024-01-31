import {
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  option,
  Select,
  ButtonGroup,
  Center,
  Stack,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { useState } from "react";

import { fetchPool } from "../../services/fetchPools";

function PoolQModal({ isOpen, onOpen, onClose, setPoolPref }) {
  const [list, setList] = useState([]);
  const [pool, setPool] = useState("");
  const [easyQN, setEasyQN] = useState(0);
  const [mediumQN, setMediumQN] = useState(0);
  const [hardQN, setHardQN] = useState(0);
  const toast = useToast();
  const getList = () => {
    fetchPool().then((data) => {
      console.log(data, "datatastast");
      setList(data);
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Question Pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Select Question Pool </FormLabel>
            <Select
              onClick={getList}
              placeholder="Choose the Question Pool"
              onChange={(e) =>
                setPool(list.find((element) => element.name == e.target.value))
              }
            >
              {list?.map((item, index) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </Select>
            {pool && (
              <Flex justify={"center"} padding={5}>
                {/* newwwwwww */}
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>
                      Imperial to metric conversion factors
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Type</Th>
                        <Th>count</Th>
                        <Th> Set Count</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Easy</Td>
                        <Td>{pool.easy ? pool.easy : "nil"}</Td>
                        <Td>
                          <NumberInput
                            defaultValue={0}
                            min={0}
                            max={pool.easy ? pool.easy : 0}
                            size="xs"
                            width={70}
                            clampValueOnBlur={false}
                            onChange={(valStr, valNum) => {
                              setEasyQN(valNum);
                              //   console.log(easyQN);
                            }}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Medium</Td>
                        <Td>{pool.medium ? pool.medium : "nil"}</Td>
                        <Td>
                          <NumberInput
                            defaultValue={0}
                            min={0}
                            max={pool.medium ? pool.medium : 0}
                            size="xs"
                            width={70}
                            clampValueOnBlur={false}
                            onChange={(valStr, valNum) => {
                              setMediumQN(valNum);
                              //   console.log(easyQN);
                            }}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Hard</Td>
                        <Td>{pool.hard ? pool.hard : "nil"}</Td>
                        <Td>
                          <NumberInput
                            defaultValue={0}
                            min={0}
                            max={pool.hard ? pool.hard : 0}
                            size="xs"
                            width={70}
                            clampValueOnBlur={false}
                            onChange={(valStr, valNum) => {
                              setHardQN(valNum);
                              //   console.log(easyQN);
                            }}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                      </Tr>
                    </Tbody>
                    {/* <Tfoot>
                      <Tr>
                        <Th>To convert</Th>
                        <Th>into</Th>
                        <Th isNumeric>multiply by</Th>
                      </Tr>
                    </Tfoot> */}
                  </Table>
                </TableContainer>
              </Flex>
            )}
            <Flex justify={"center"} padding={5}>
              <Button
                colorScheme="blue"
                onClick={() => {
                  if (pool == "") {
                    toast({
                      title: "Pool Not Selected",
                      description: "Select Pool",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                    return;
                  }
                  setPoolPref({
                    name: pool.name,
                    count: pool.count,
                    easyQN,
                    mediumQN,
                    hardQN,
                  });
                  onClose();
                }}
              >
                Add
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PoolQModal;
