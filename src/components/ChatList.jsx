import { Box, Divider, List, ListItemButton, Typography } from "@mui/material";
import Conversation from "./Conversation";
import Logo from "./Logo";

const ChatList = ({ chats, setCurrentChat, user, checkOnlineStatus }) => {
  return (
    <div>
      <Box textAlign="center" py="5px">
        <Logo />
      </Box>
      <Divider />
      <Typography textAlign="center" fontSize="1rem">
        Chat with Friends
      </Typography>
      <Divider />
      <List>
        {chats.map((chat) => (
          <ListItemButton
            onClick={() => {
              setCurrentChat(chat);
            }}
            key={chat._id}
          >
            <Conversation
              data={chat}
              currentUser={user._id}
              online={checkOnlineStatus(chat)}
            />
            <Divider />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default ChatList;
