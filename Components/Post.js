import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";

import { MdRestore } from "react-icons/md";
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  Badge,
} from "@chakra-ui/react";

export default function ProductSimple({
  displayName,
  authPhotoURl,
  IMAGE,
  caption,
  location,
  removePost,
  restorePost,
  deletedBadge,
}) {
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.800", "gray.500")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${IMAGE})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={IMAGE}
          />
        </Box>
        <Stack pt={10}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Avatar src={authPhotoURl} size={"xs"} />
            <Text
              color={"gray.500"}
              fontSize={"sm"}
              textTransform={"uppercase"}
              isTruncated
              ml={"2"}
            >
              {displayName}
            </Text>
          </Box>
          <Text color={"gray.500"} fontSize={"sm"}>
            caption
          </Text>

          <Text
            color={"gray.500"}
            fontSize={"sm"}
            textTransform={"uppercase"}
            // isTruncated
            noOfLines={3}
          >
            {caption}
          </Text>
          <Text
            color={"gray.500"}
            fontSize={"sm"}
            textTransform={"uppercase"}
            isTruncated
          >
            {location}
          </Text>
          {deletedBadge && (
            <Badge
              w={"fit-content"}
              rounded={"md"}
              p={"1"}
              bgColor={"red.500"}
              color={"white"}
            >
              Removed
            </Badge>
          )}
          <Box display={"flex"} alignSelf={"flex-end"} zIndex={"5"}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                {deletedBadge ? (
                  <MenuItem
                    icon={<MdRestore size={20} />}
                    _hover={{ bgColor: "blue.500", color: "white" }}
                    onClick={restorePost}
                  >
                    Restore
                  </MenuItem>
                ) : (
                  <MenuItem
                    icon={<DeleteIcon />}
                    _hover={{ bgColor: "red.500", color: "white" }}
                    onClick={removePost}
                  >
                    Remove
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Box>
        </Stack>
      </Box>
    </Center>
  );
}
