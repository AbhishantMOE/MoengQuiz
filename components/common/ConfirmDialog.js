import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogOverlay,
    AlertDialogFooter,
    AlertDialogContent,
    AlertDialogCloseButton,
    AlertDialogHeader,
    Button,
    Box,
    List,
    ListItem,
    OrderedList,
} from "@chakra-ui/react";
import { useRef } from "react";

const ConfirmDialog = ({
    isOpen,
    onClose,
    title,
    description,
    onClickConfirm,
    isLoading = false,
    loadingText = "Saving",
    showNoBtn = true,
}) => {
    const cancelRef = useRef();

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>{title}</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                    {/* <Box mb={2}><b>Instructions:</b> <br/> 
                    <Box marginLeft="3px">
                        <OrderedList>
                            <ListItem>Total Time Duration is</ListItem>
                            <ListItem>When the test starts, you will automatically be in fullscreen mode. You are not allowed to exit fullscreen mode for the duration of the test.</ListItem>
                            <ListItem>After 3 warnings for not being in fullscreen mode, test will be auto submitted and no points will be given.</ListItem>
                        </OrderedList>
                    </Box>
                    </Box> */}
                        {description}
                        </AlertDialogBody>
                    <AlertDialogFooter>
                        {showNoBtn && (
                            <Button
                                ref={cancelRef}
                                onClick={() => onClose(false)}
                            >
                                No
                            </Button>
                        )}
                        <Button
                            colorScheme="teal"
                            ml={3}
                            onClick={onClickConfirm}
                            isLoading={isLoading}
                            loadingText={loadingText}
                        >
                            Yes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ConfirmDialog;
