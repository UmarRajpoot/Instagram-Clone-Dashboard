"use client";

import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { auth } from "../../Firebase/firebase";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(user);
        router.replace("/dashboard");
      } else {
        router.replace("/auth");
        console.log("User is Sign out");
      }
    });
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Analyzing.... <Spinner />
    </div>
  );
};

export default page;
