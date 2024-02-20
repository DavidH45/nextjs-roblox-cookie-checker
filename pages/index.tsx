import { ReactNode, useState, useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  Textarea,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AttachmentIcon, EmailIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import axios from "axios";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { FaDiscord } from "react-icons/fa";

const NavLink = ({ children }: { children: ReactNode }) => {
  const linkBg = useColorModeValue("gray.200", "gray.700");
  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: linkBg,
      }}
      href={"#"}
    >
      {children}
    </Link>
  );
};

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const emailColor = useColorModeValue("gray.700", "gray.200");
  const boxBgColor = useColorModeValue("gray.100", "gray.900");
  const toast = useToast();
  const { width, height } = useWindowSize();

  // State to store cookies input
  const [isCheckingCookies, setIsCheckingCookies] = useState(false);
  const [cookies, setCookies] = useState("");
  const [working_cookies, setworking_Cookies] = useState("");

  const payload = {
    cookies: cookies.split("\n").filter((cookie) => cookie.trim() !== ""),
  };

  const downloadWorking = async () => {
    var mimetype = "application/txt";
    var filename = "valid.txt";

    var a = window.document.createElement("a");

    console.log(working_cookies);
    a.href = window.URL.createObjectURL(
      new Blob([working_cookies.toString().replaceAll(",", "\n")], {
        type: mimetype + ";charset=UTF-8",
      })
    );
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const fileContents = await file.text();
      setCookies(fileContents.replace(/\r/g, ""));
      if (cookies) {
        checkCookies();
      }
    }
  };

  const checkCookies = async () => {
    console.log(cookies);
    if (!cookies.trim()) {
      toast({
        title: "Error",
        description: "Please enter some cookies before checking.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsCheckingCookies(true);

    try {
      const response = await axios.post("/api/check-cookies", payload);
      onOpen();
      setworking_Cookies(response.data.validCookies);
      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An error occurred while checking cookies.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCheckingCookies(false);
    }
  };

  useEffect(() => {
    if (cookies) {
    }
  }, [cookies]);

  if (session) {
    const { user } = session;
    return (
      <>
        <Box bg={boxBgColor} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <Box>
              <Text fontSize="2xl" as="b">
                Nectory
                <Tag size="sm" ml="5px" colorScheme="red">
                  v0.01-beta
                </Tag>
              </Text>
            </Box>
            <Badge ml="1" fontSize="0.8em" colorScheme="blue">
              Website is in beta, expect bugs!
            </Badge>

            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={7}>
                <Button onClick={toggleColorMode}>
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={user?.image || ""} />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar size={"2xl"} src={user?.image || ""} />
                    </Center>
                    <br />
                    <Center>
                      <Text fontSize="22px" as="b">
                        {user?.name}
                      </Text>
                    </Center>
                    <center>
                      <Text fontSize="15px" color={emailColor}>
                        {user?.email}
                      </Text>
                    </center>
                    <MenuDivider />
                    <MenuItem onClick={() => signOut()}>
                      <Text color={"tomato"}>Logout</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
        </Box>
        <Center>
          <FormControl bg={boxBgColor} rounded="lg" p="20px" w="80%" m="20px">
            <Textarea
              h="500px"
              placeholder="Paste roblox cookies here"
              onChange={(e) => setCookies(e.target.value)}
            />
            <Input
              mt="15px"
              variant="unstyled"
              w="300px"
              type="file"
              accept=".txt"
              onChange={handleImageUpload}
            />{" "}
            <FormHelperText>Only one cookie per line</FormHelperText>
            <Center>
              {" "}
              <Button
                m="10px"
                isLoading={isCheckingCookies}
                loadingText="Loading"
                onClick={checkCookies}
              >
                Check Cookies
              </Button>
            </Center>
          </FormControl>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <Confetti width={width} height={height} numberOfPieces={250} />
            <ModalContent>
              <ModalHeader>Valid Cookies Found! 🎉</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                We found {working_cookies.length} active cookie in your list!
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={downloadWorking}>
                  Download Valid
                </Button>
                <Button variant="ghost">Copy Valid (Soon)</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Center>
      </>
    );
  }
  return (
    <>
      <Box bg={boxBgColor} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Text fontSize="2xl" as="b">
              Nectory
            </Text>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Button
                onClick={() => signIn()}
                leftIcon={<FaDiscord />}
                as={"a"}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"#5865F2"}
                href={"#"}
                _hover={{
                  bg: "#7881e7",
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="100%"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Login Required
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          To help us prevent spamming of our services, we require that you login
          with Discord first! Dont worry, the only info we can view is your
          username and email.
        </AlertDescription>
        <Button
          onClick={() => signIn()}
          leftIcon={<FaDiscord />}
          mt="15px"
          mb="10px"
          as={"a"}
          fontSize={"sm"}
          fontWeight={600}
          color={"white"}
          bg={"#5865F2"}
          href={"#"}
          _hover={{
            bg: "#7881e7",
          }}
        >
          Sign In
        </Button>
      </Alert>
    </>
  );
};

export default Home;
