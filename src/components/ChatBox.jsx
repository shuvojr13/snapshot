import { Send } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import InputEmoji from "react-input-emoji";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TimeAgo from "react-timeago";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const ChatBox = ({
  chat,
  currentUser,
  setSendMessage,
  receivedMessage,
  drawerWidth,
  handleDrawerToggle,
}) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const navigate = useNavigate();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const data = response.data;
          // console.log(data);
          setUserData(data);
        }
        // dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser, token]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_SERVER_URL}/message/${chat._id}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const data = response.data;
          setMessages(data);
        }
        // dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSend = async (e) => {
    // e.preventDefault();
    if (newMessage) {
      const message = {
        senderId: currentUser,
        text: newMessage,
        chatId: chat._id,
      };
      // console.log(message);
      const receiverId = chat.members.find((id) => id !== currentUser);
      // send message to socket server
      setSendMessage({ ...message, receiverId });
      // send message to database
      try {
        const response = await axios({
          method: "post",
          url: `${process.env.REACT_APP_SERVER_URL}/message`,
          headers: { Authorization: `Bearer ${token}` },
          data: message,
        });
        if (response.status === 201) {
          const data = response.data;
          setMessages([...messages, data]);
          setNewMessage("");
        }
        // dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Receive Message from parent component
  useEffect(() => {
    // console.log("Message Arrived: ", receivedMessage);
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage]);

  const scroll = useRef();
  return (
    <Box
      sx={{
        // width: { sm: `calc(100% - ${drawerWidth}px)` },
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {chat ? (
        <>
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100vw - ${drawerWidth})` },
              ml: { sm: `${drawerWidth}` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              {userData && (
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => navigate(`/profile/${userData._id}`)}
                >
                  <UserImage
                    image={userData.picturePath}
                    // alt="Profile"
                    // className="followerImage"
                    // style={{ width: "50px", height: "50px" }}
                    size="40px"
                  />
                  <Typography ml={1}>
                    {userData.firstName} {userData.lastName}
                  </Typography>
                </Box>
              )}
            </Toolbar>
          </AppBar>
          {/* chat-body */}
          <Box
            display="flex"
            flexDirection="column"
            gap=".5rem"
            height="80vh"
            sx={{ overflowY: "scroll" }}
          >
            {messages.map((message) => (
              <Box
                ref={scroll}
                key={message._id}
                sx={{
                  borderRadius: "5px",
                  p: ".5rem 1rem",
                  border:
                    message.senderId === currentUser
                      ? `1px solid ${palette.neutral.dark}`
                      : `1px solid ${palette.primary.main}`,
                  alignSelf:
                    message.senderId === currentUser
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <Typography>{message.text}</Typography>{" "}
                <Typography fontSize="0.5rem">
                  <TimeAgo date={message.createdAt} />
                </Typography>
              </Box>
            ))}
          </Box>
          {/* chat-sender */}
          <Toolbar />
          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              left: 0,
              width: "100%",
            }}
          >
            <FlexBetween>
              {/* <div onClick={() => imageRef.current.click()}>+</div> */}
              {/* <InputEmoji value={newMessage} onChange={handleChange} /> */}
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
                onEnter={handleSend}
                placeholder="Type a message"
                // style={{
                //   width: "100%",
                //   backgroundColor: palette.neutral.light,
                //   borderRadius: "2rem",
                //   padding: ".5rem 1rem",
                // }}
              />
              <Button
                // type="submit"
                onClick={handleSend}
                disabled={!newMessage}
                sx={{
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  borderRadius: "3rem",
                  fontSize: ".5rem",
                }}
              >
                <Send fontSize="small" />
              </Button>
            </FlexBetween>{" "}
          </Box>
        </>
      ) : (
        <Typography textAlign="center">
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100vw - ${drawerWidth})` },
              ml: { sm: `${drawerWidth}` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              Tap on a chat to start conversation...
            </Toolbar>
          </AppBar>
        </Typography>
      )}
    </Box>
  );
};

export default ChatBox;
