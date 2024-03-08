import { Heading, Flex, Box, Text, SimpleGrid} from "@chakra-ui/react";
import Card from "../Card"; 
import { useRouter } from "next/router";

const PoolInfo = ({ pool }) => {
    const router = useRouter();
    return (
      <Card>
        <Flex alignItems={"center"}>
          <Heading>{pool?.name}</Heading>
        </Flex>
        <Box mt={2}>
          <SimpleGrid columns={{ base: 4, md: 2, lg: 2 }} spacing={"20px"}>
            <Box mx={2}>
              <Text
                color={"gray.400"}
                fontWeight={600}
                fontSize="sm"
                textTransform={"uppercase"}
              >
                No. of Questions
              </Text>
              <Text color={"gray.900"} fontSize={"md"}>
                {pool?.questions?.length}
              </Text>
            </Box>
            <Box mx={2}>
              <Text
                color={"gray.400"}
                fontWeight={600}
                fontSize="sm"
                textTransform={"uppercase"}
              >
                Easy
              </Text>
              <Text color={"gray.900"} fontSize={"md"}>
                {pool?.easy ? pool.easy: 0}
              </Text>
            </Box>
            <Box mx={2}>
              <Text
                color={"gray.400"}
                fontWeight={600}
                fontSize="sm"
                textTransform={"uppercase"}
              >
                Medium
              </Text>
              <Text color={"gray.900"} fontSize={"md"}>
                {pool?.medium ? pool.medium: 0}
              </Text>
            </Box>
            <Box mx={2}>
              <Text
                color={"gray.400"}
                fontWeight={600}
                fontSize="sm"
                textTransform={"uppercase"}
              >
                Hard
              </Text>
              <Text color={"gray.900"} fontSize={"md"}>
                { pool?.hard ? pool.hard : 0 }
              </Text>
            </Box>
          </SimpleGrid>
          <Box mx={2} my={5}></Box>
        </Box>
      </Card>
    );
};

export default PoolInfo;