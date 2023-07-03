"use client";
import {
  Container,
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { BsPerson } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { TfiReload } from "react-icons/tfi";

import Footer from "../../../Components/Footer";
import NavBar from "../../../Components/NavBar";
import Post from "../../../Components/Post";
import { useEffect, useState } from "react";

// Firebase
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const IMAGE =
  "https://plus.unsplash.com/premium_photo-1668824629048-07829929c302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80";

export default function Dashboard() {
  const [usersCount, setUserCount] = useState(0);
  const [reportPost, setReportPost] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [authLoading, setAuthLoading] = useState(false);

  const [user, setUser] = useState([]);

  const router = useRouter();

  useEffect(() => {
    setAuthLoading(true);
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthLoading(false);
        setUser(user);
      } else {
        setAuthLoading(false);
        router.replace("/auth");
        console.log("User is Sign out");
      }
    });
  }, []);

  function StatsCard({ title, stat, icon }) {
    return (
      <Stat
        px={{ base: 2, md: 4 }}
        py={"5"}
        shadow={"xl"}
        border={"1px solid"}
        borderColor={useColorModeValue("gray.800", "gray.500")}
        rounded={"lg"}
        color={useColorModeValue("gray.800", "gray.500")}
      >
        <Flex justifyContent={"space-between"}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontWeight={"medium"} isTruncated>
              {title}
            </StatLabel>
            <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
              {stat}
            </StatNumber>
          </Box>
          <Box
            my={"auto"}
            color={useColorModeValue("gray.800", "gray.200")}
            alignContent={"center"}
          >
            {icon}
          </Box>
        </Flex>
      </Stat>
    );
  }

  const getUsersData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users")).then(
        (snaps) => {
          setUserCount(snaps.size);
          setIsLoading(false);
        }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getReportsData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Report")).then(
        (snaps) => {
          setIsLoading(false);
          setReportPost(
            snaps.docs.map((doc) => {
              return { id: doc.id, data: doc.data() };
            })
          );
        }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    getUsersData();
    getReportsData();
  }, []);
  return (
    <>
      <NavBar user={user} />
      <Container
        maxW="full"
        color="white"
        bgColor={useColorModeValue("gray.300", "gray.900")}
        // height={["container.md", "container.sm"]}
      >
        <Container maxW="3xl" pt={"5"}>
          <Heading
            fontWeight={600}
            fontSize={{ base: "md", sm: "lg", md: "xl" }}
            lineHeight={"110%"}
            my={"5"}
          >
            Welcome{" "}
            <Text as={"span"} color={"orange.400"}>
              {user.email} 💁
            </Text>
          </Heading>
          <Text mb={"5"} color={useColorModeValue("gray.800", "gray.500")}>
            Stats
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard
              title={"Users"}
              stat={usersCount}
              icon={<BsPerson size={"3em"} />}
            />
            <StatsCard
              title={"Reports"}
              stat={reportPost.length}
              icon={<TbReportAnalytics size={"3em"} />}
            />
          </SimpleGrid>
          <Text mt={"10"} color={useColorModeValue("gray.800", "gray.500")}>
            Reported Posts
            <IconButton
              variant="outline"
              colorScheme="gray"
              aria-label="Call Sage"
              fontSize="20px"
              ml={"2"}
              icon={<TfiReload />}
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                getUsersData();
                getReportsData();
              }}
            />
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            {reportPost.map((reportedPost) => {
              if (reportPost.length !== 0) {
                return (
                  <Post
                    key={reportedPost.id}
                    displayName={reportedPost.data.auth.displayName}
                    authPhotoURl={reportedPost.data.auth.photoURL}
                    IMAGE={reportedPost.data.post.ImageURL}
                    caption={reportedPost.data.post.caption}
                    location={reportedPost.data.post.location}
                    deletedBadge={reportedPost.data.deleted}
                    removePost={async () => {
                      const docRef = doc(
                        db,
                        "/Users",
                        `${reportedPost.data?.auth.id}`,
                        "/Posts",
                        `${reportedPost.data?.post.id}`
                      );
                      await updateDoc(docRef, { deleted: true }).then(() => {
                        alert("Removed");
                      });
                      // Report update
                      const reportRef = doc(
                        db,
                        "/Report",
                        `${reportedPost.id}`
                      );
                      await updateDoc(reportRef, { deleted: true }).then(() => {
                        getReportsData();
                        alert("Removed");
                      });
                    }}
                    restorePost={async () => {
                      const docRef = doc(
                        db,
                        "/Users",
                        `${reportedPost.data?.auth.id}`,
                        "/Posts",
                        `${reportedPost.data?.post.id}`
                      );
                      await updateDoc(docRef, { deleted: false }).then(() => {
                        alert("Image Restored");
                      });
                      // Report update
                      const reportRef = doc(
                        db,
                        "/Report",
                        `${reportedPost.id}`
                      );
                      await updateDoc(reportRef, { deleted: false }).then(
                        () => {
                          getReportsData();
                          alert("Image Restored");
                        }
                      );
                    }}
                  />
                );
              }
            })}

            <Post
              displayName={"xyz"}
              authPhotoURl={
                "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              IMAGE={
                "https://plus.unsplash.com/premium_photo-1668824629048-07829929c302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              caption={"Abstract"}
              location={"Pakistan"}
            />
            <Post
              displayName={"xyz"}
              authPhotoURl={
                "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              IMAGE={
                "https://plus.unsplash.com/premium_photo-1668824629048-07829929c302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              caption={"Abstract"}
              location={"Pakistan"}
            />
            <Post
              displayName={"xyz"}
              authPhotoURl={
                "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              IMAGE={
                "https://plus.unsplash.com/premium_photo-1668824629048-07829929c302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              caption={"Abstract"}
              location={"Pakistan"}
            />
            <Post
              displayName={"xyz"}
              authPhotoURl={
                "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              IMAGE={
                "https://plus.unsplash.com/premium_photo-1668824629048-07829929c302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              caption={"Abstract"}
              location={"Pakistan"}
            />
            <Post
              displayName={"xyz"}
              authPhotoURl={
                "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              IMAGE={
                "https://plus.unsplash.com/premium_photo-1668824629048-07829929c302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              caption={"Abstract"}
              location={"Pakistan"}
            />
            <Post
              displayName={"xyz"}
              authPhotoURl={
                "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              IMAGE={
                "https://plus.unsplash.com/premium_photo-1668824629048-07829929c302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              caption={"Abstract"}
              location={"Pakistan"}
            />
            <Post
              displayName={"xyz"}
              authPhotoURl={
                "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              IMAGE={
                "https://plus.unsplash.com/premium_photo-1668824629048-07829929c302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
              }
              caption={"Abstract"}
              location={"Pakistan"}
            />
          </SimpleGrid>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
