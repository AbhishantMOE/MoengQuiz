import {
    Box,
    Heading,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import Card from "../Card";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import User from "./User";


const fetcher = (url) => axios.get(url).then((resp) => resp.data);


export default function EnrollUsers({ quiz, isOpen, onClose }) {
    const { data: users } = useSWR("/api/user", fetcher);
    const quizId = quiz?.id
    console.log("The quizzzzz", quiz);
    console.log("These are the userses", users);
    const[alreadyEnrolled,setAlreadyEnrolled] = useState([])
    if(quiz !== undefined &&  quiz.usersEnrolled.length != 0 && alreadyEnrolled.length == 0) {
        //console.log("Iam no undefined", quiz);
        setAlreadyEnrolled([...quiz.usersEnrolled])
    }
    //console.log("alreday", alreadyEnrolled);

    const [selectedUsers, setSelectedUsers] = useState([]);

    if(quiz!= undefined  && quiz.usersEnrolled.length != 0 && selectedUsers.length == 0) {
        //console.log("Iam no undefined", quiz);
        setSelectedUsers([...quiz.usersEnrolled])
    }

    const onUserSelect = (user, isChecked) => {
        if (isChecked) {
            setSelectedUsers([...selectedUsers, user._id]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== user._id));
        }
    };
    const onSubmit = async () => {
        try {
            const response = await axios.post(`/api/quiz/enroll/${quizId}`, {
              usersEnrolled: selectedUsers
            });
            setSelectedUsers([])
            onClose();
          } catch (error) {
            console.log(error);
          }
      };
    const handleOnClose = ()=>{
        setSelectedUsers([])
        onClose()
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Box px={8} style={{ fontFamily: "Poppins" }}>
                        <Heading py={5}>Enroll Users</Heading>
                        <Card>
                            {
                                
                                users?.map((user) =>
                                    user?.isAdmin ? null : <User key={user?._id} user={user} onUserSelect={onUserSelect} isChecked={alreadyEnrolled.includes(user._id)} />
                                )
                            }
                        </Card>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleOnClose}>Close</Button>
                    {/* Add the Submit Button */}
                    <Button colorScheme="blue" onClick={onSubmit}>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}