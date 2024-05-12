import { Box, Drawer, Toolbar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import ChatBox from "../../components/ChatBox";
import ChatList from "../../components/ChatList";

const drawerWidth = "15rem";

const Chat = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const socket = useRef();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_SERVER_URL}/chat/${user._id}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          // console.log(response.data);
          setChats(response.data);
        } else {
          throw response;
        }
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io(`${process.env.REACT_APP_SERVER_URL}`);
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data);
      setReceivedMessage(data);
    });
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <ChatList
            chats={chats}
            setCurrentChat={setCurrentChat}
            checkOnlineStatus={checkOnlineStatus}
            user={user}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <ChatList
            chats={chats}
            setCurrentChat={setCurrentChat}
            checkOnlineStatus={checkOnlineStatus}
            user={user}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100vw - ${drawerWidth})` },
        }}
      >
        <Toolbar />
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        />
      </Box>
    </Box>
  );
};

export default Chat;
