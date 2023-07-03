"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";

import { db, auth } from "../../../Firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const SignIn = async () => {
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoading(false);
        // Signed in
        const user = userCredential.user;
        console.log(user);
        router.replace("/dashboard");
      })
      .catch((error) => {
        setIsLoading(false);
        router.replace("/auth");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      bgColor={useColorModeValue("gray.300", "gray.900")}
    >
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading
            fontSize={"2xl"}
            color={useColorModeValue("gray.900", "gray.300")}
          >
            Sign in to your account
          </Heading>
          <FormControl id="email">
            <FormLabel color={useColorModeValue("gray.900", "gray.300")}>
              Email address
            </FormLabel>
            <Input
              type="email"
              color={useColorModeValue("gray.900", "gray.300")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel color={useColorModeValue("gray.900", "gray.300")}>
              Password
            </FormLabel>
            <Input
              type="password"
              color={useColorModeValue("gray.900", "gray.300")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Stack spacing={6}>
            <Button
              colorScheme={"blue"}
              variant={"solid"}
              isLoading={isLoading}
              loadingText={"Signing in..."}
              onClick={() => SignIn()}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          }
        />
      </Flex>
    </Stack>
  );
};

export default page;
