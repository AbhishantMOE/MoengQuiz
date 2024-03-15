import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  VisuallyHidden,
  HStack,
  useDisclosure,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Avatar,
  Tabs,
  TabList,
  Tab,
  Icon,
  Image,
  Spacer,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { AiOutlineMenu, AiOutlineSearch, AiFillBell } from "react-icons/ai";
import { useRouter } from "next/router";
import { SiSwarm } from "react-icons/si";
import { RiUserHeartFill, RiLogoutCircleFill } from "react-icons/ri";
import { useSession, signOut } from "next-auth/react";
import JoinQuiz from "./common/JoinQuiz";
import { useEffect, useState } from "react";

const getTabIndexAdmin = (route) => {
  switch(route) {
    case "/profile": return 0;
    case "/my_quizzes": return 1;
    case "/create_quiz": return 2;
    case "/my_pools": return 3;
    case "/create_pool": return 4;
    case "/users": return 5;
    default: return 0;
  }
};
const getTabIndexUser = (route) => {
  switch(route) {
    case "/profile": return 0;
    case "/my_quizzes": return 1;
    case "/my_submissions": return 2;
    default: return 0;
  }
};

export default function Navbar() {
  const bg = useColorModeValue("white", "gray.800");
  const mobileNav = useDisclosure();
  const router = useRouter();
  const { data } = useSession();
  const [open, setOpen] = useState(false);
  const imagePath = "./moe-bluelogo.png";
  let callbackUrl
  if(process.env.MODE === 'dev'){
    callbackUrl: `http://localhost:3000/login`
  }else{

    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`
  }
  const logout = async () => {
    const result = await signOut({

      redirect: true,
      callbackUrl: callbackUrl
    })
  };
  useEffect(() => {}, [router.pathname]);
  return (
    <Box shadow="md" fontFamily={"Poppins"}>
      <JoinQuiz open={open} setOpen={setOpen} />
      <chakra.header
        bg={bg}
        borderColor="gray.600"
        borderBottomWidth={1}
        w="full"
        px={{ base: 2, sm: 4 }}
        py={4}
      >
        <Flex alignItems="center" justifyContent="space-between" mx="auto">
          <HStack spacing={4} display="flex" alignItems="center">
            <Box display={{ base: "inline-flex", md: "none" }}>
              <IconButton
                display={{ base: "flex", md: "none" }}
                aria-label="Open menu"
                fontSize="20px"
                color={useColorModeValue("gray.800", "inherit")}
                variant="ghost"
                icon={<AiOutlineMenu />}
                onClick={mobileNav.onOpen}
              />
            </Box>
            <chakra.a
              href="/"
              title="Quiz Platform"
              display="flex"
              alignItems="center"
            >
              {/* <Icon as={SiSwarm} w={8} h={8} /> */}
              <VisuallyHidden>Quiz Platform</VisuallyHidden>
            </chakra.a>
            <Image
              src={imagePath}
              alt="Quiz Platform Logo"
              width="200px"
              height="auto"
            />
          </HStack>
          <HStack spacing={3} display="flex" alignItems="center">
            {!data?.user?.isAdmin && <div></div>}
            <Menu>
              <MenuButton
                as={Avatar}
                size="sm"
                name={data?.user?.name}
                src={`https://avatars.dicebear.com/api/adventurer/${data?.user?.name
                  .toLowerCase()
                  .replaceAll(" ", "")}.svg`}
              />
              <p>{data?.user?.name}</p>
              <MenuList>
                <MenuItem
                  icon={<RiUserHeartFill />}
                  onClick={() => router.push("/profile")}
                >
                  {data?.user?.name}
                </MenuItem>
                <MenuItem icon={<RiLogoutCircleFill />} onClick={logout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </chakra.header>
      <Box bg="#121180" color="white">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mx={2}
          borderWidth={0}
          overflowX="auto"
        >
          {data?.user?.isAdmin? (<Tabs borderBottomColor="transparent" index={getTabIndexAdmin(router.pathname)}>
            <TabList>
              <Tab
                py={4}
                m={0}
                _focus={{ boxShadow: "none" }}
                onClick={() => router.replace("/profile")}
              >
                Quiz Platform
              </Tab>
              <Tab
                py={4}
                m={0}
                _focus={{ boxShadow: "none" }}
                onClick={() => router.replace("/my_quizzes")}
              >
                My Quizzes
              </Tab>
                  <Tab
                    py={4}
                    m={0}
                    _focus={{ boxShadow: "none" }}
                    onClick={() => router.replace("/create_quiz")}
                  >
                    Create Quiz
                  </Tab>
                  <Tab
                    py={4}
                    m={0}
                    _focus={{ boxShadow: "none" }}
                    onClick={() => router.replace("/my_pools")}
                  >
                    My Pools
                  </Tab>
                  <Tab
                    py={4}
                    m={0}
                    _focus={{ boxShadow: "none" }}
                    onClick={() => router.replace("/create_pool")}
                  >
                    Create Pool
                  </Tab>
                  
                  <Tab
                    py={4}
                    m={0}
                    _focus={{ boxShadow: "none" }}
                    onClick={() => router.replace("/users")}
                  >
                    Users
                  </Tab>
            </TabList>
          </Tabs>):(<Tabs borderBottomColor="transparent" index={getTabIndexUser(router.pathname)}>
            <TabList>
              <Tab
                py={4}
                m={0}
                _focus={{ boxShadow: "none" }}
                onClick={() => router.replace("/profile")}
              >
                Quiz Platform
              </Tab>
              <Tab
                py={4}
                m={0}
                _focus={{ boxShadow: "none" }}
                onClick={() => router.replace("/my_quizzes")}
              >
                My Quizzes
              </Tab>
                <Tab
                  py={4}
                  m={0}
                  _focus={{ boxShadow: "none" }}
                  onClick={() => router.replace("/my_submissions")}
                >
                  My Submissions
                </Tab>
            </TabList>
          </Tabs>)}
          <Spacer />
          <HStack spacing={3} alignItems="center">
            <InputGroup display={{ base: "none", lg: "block" }} ml="auto">
              <InputLeftElement pointerEvents="none">
                <AiOutlineSearch />
              </InputLeftElement>
              {/* <Input type="tel" placeholder="Search Quiz..." /> */}
            </InputGroup>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
